import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

@Entity('accounts')
export class Account {
  @ApiProperty({ description: 'The unique identifier of the account' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'Account number' })
  @Column({ unique: true })
  accountNumber: string;

  @ApiProperty({ description: 'Account type (checking, savings, etc.)' })
  @Column()
  accountType: string;

  @ApiProperty({ description: 'Current balance of the account' })
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  balance: number;

  @ApiProperty({ description: 'Currency of the account' })
  @Column({ default: 'USD' })
  currency: string;

  @ApiProperty({ description: 'Whether the account is active' })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'Owner of the account (user ID)' })
  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 