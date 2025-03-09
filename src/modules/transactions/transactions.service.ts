import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { Account } from '../accounts/entities/account.entity';
import { CreateTransactionDto, TransactionType } from './dto/create-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    @InjectRepository(Account)
    private accountsRepository: Repository<Account>,
    private dataSource: DataSource,
  ) {}

  async create(userId: string, createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    // Verify the account belongs to the user
    const account = await this.accountsRepository.findOne({
      where: { id: createTransactionDto.accountId, userId },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    // For transfers, verify recipient account exists
    let recipientAccount: Account | null = null;
    if (createTransactionDto.type === TransactionType.TRANSFER) {
      if (!createTransactionDto.recipientAccountId) {
        throw new BadRequestException('Recipient account is required for transfers');
      }

      recipientAccount = await this.accountsRepository.findOne({
        where: { id: createTransactionDto.recipientAccountId },
      });

      if (!recipientAccount) {
        throw new NotFoundException('Recipient account not found');
      }

      if (account.id === recipientAccount.id) {
        throw new BadRequestException('Cannot transfer to the same account');
      }
    }

    // Business logic for different transaction types
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Generate a unique reference number
      const referenceNumber = this.generateReferenceNumber();

      // Create the transaction
      const transaction = this.transactionsRepository.create({
        ...createTransactionDto,
        referenceNumber,
        status: 'completed',
      });

      // Update account balances
      switch (createTransactionDto.type) {
        case TransactionType.DEPOSIT:
          account.balance += createTransactionDto.amount;
          break;
        case TransactionType.WITHDRAWAL:
          if (account.balance < createTransactionDto.amount) {
            throw new BadRequestException('Insufficient funds');
          }
          account.balance -= createTransactionDto.amount;
          break;
        case TransactionType.TRANSFER:
          if (account.balance < createTransactionDto.amount) {
            throw new BadRequestException('Insufficient funds');
          }
          account.balance -= createTransactionDto.amount;
          if (recipientAccount) {
            recipientAccount.balance += createTransactionDto.amount;
            await queryRunner.manager.save(recipientAccount);
          }
          break;
      }

      await queryRunner.manager.save(account);
      const savedTransaction = await queryRunner.manager.save(transaction);
      await queryRunner.commitTransaction();

      return savedTransaction;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(userId: string): Promise<Transaction[]> {
    // Get all accounts for this user
    const accounts = await this.accountsRepository.find({
      where: { userId },
      select: ['id'],
    });
    
    const accountIds = accounts.map(account => account.id);
    
    // Find transactions for these accounts
    return this.transactionsRepository.find({
      where: [
        { accountId: In(accountIds) },
        { recipientAccountId: In(accountIds) },
      ],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Transaction> {
    // Get all accounts for this user
    const accounts = await this.accountsRepository.find({
      where: { userId },
      select: ['id'],
    });
    
    const accountIds = accounts.map(account => account.id);
    
    // Find the transaction
    const transaction = await this.transactionsRepository.findOne({
      where: [
        { id, accountId: In(accountIds) },
        { id, recipientAccountId: In(accountIds) },
      ],
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  async findByAccount(accountId: string, userId: string): Promise<Transaction[]> {
    // Verify the account belongs to the user
    const account = await this.accountsRepository.findOne({
      where: { id: accountId, userId },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    // Find transactions for this account
    return this.transactionsRepository.find({
      where: [
        { accountId },
        { recipientAccountId: accountId },
      ],
      order: { createdAt: 'DESC' },
    });
  }

  private generateReferenceNumber(): string {
    // Generate a transaction reference in format TRX-YYYYMMDD-XXXXXX
    const date = new Date();
    const datePart = date.toISOString().slice(0, 10).replace(/-/g, '');
    const randomPart = Math.floor(100000 + Math.random() * 900000).toString();
    return `TRX-${datePart}-${randomPart}`;
  }
} 