import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './entities/account.entity';
import { CreateAccountDto } from './dto/create-account.dto';

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private accountsRepository: Repository<Account>,
  ) {}

  async create(userId: string, createAccountDto: CreateAccountDto): Promise<Account> {
    // Generate a unique account number
    const accountNumber = this.generateAccountNumber();

    const account = this.accountsRepository.create({
      userId,
      accountNumber,
      ...createAccountDto,
      balance: 0,
      currency: createAccountDto.currency || 'USD',
    });

    return this.accountsRepository.save(account);
  }

  async findAll(userId: string): Promise<Account[]> {
    return this.accountsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string, userId: string): Promise<Account> {
    const account = await this.accountsRepository.findOne({
      where: { id, userId },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return account;
  }

  async getBalance(id: string, userId: string): Promise<{ balance: number; currency: string }> {
    const account = await this.findOne(id, userId);
    return { balance: account.balance, currency: account.currency };
  }

  private generateAccountNumber(): string {
    // Generate a random 10-digit account number
    return Math.floor(1000000000 + Math.random() * 9000000000).toString();
  }
} 