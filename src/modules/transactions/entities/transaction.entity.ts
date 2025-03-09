import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Account } from '../../accounts/entities/account.entity';

@Entity('transactions')
export class Transaction {
  @ApiProperty({ description: 'The unique identifier of the transaction' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Transaction reference number' })
  @Column({ unique: true })
  referenceNumber: string;

  @ApiProperty({ description: 'Transaction amount' })
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @ApiProperty({ description: 'Transaction type (deposit, withdrawal, transfer)' })
  @Column()
  type: string;

  @ApiProperty({ description: 'Transaction description' })
  @Column({ nullable: true })
  description: string;

  @ApiProperty({ description: 'Account ID for the transaction' })
  @Column()
  accountId: string;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'accountId' })
  account: Account;

  @ApiProperty({ description: 'Recipient account ID for transfers' })
  @Column({ nullable: true })
  recipientAccountId: string;

  @ManyToOne(() => Account, { nullable: true })
  @JoinColumn({ name: 'recipientAccountId' })
  recipientAccount: Account;

  @ApiProperty({ description: 'Transaction status (pending, completed, failed)' })
  @Column({ default: 'completed' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;
} 