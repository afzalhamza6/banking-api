import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsEnum, IsOptional, IsUUID, Min } from 'class-validator';

export enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
  TRANSFER = 'transfer',
}

export class CreateTransactionDto {
  @ApiProperty({ 
    description: 'Type of transaction', 
    enum: TransactionType,
    example: TransactionType.DEPOSIT 
  })
  @IsNotEmpty()
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({ description: 'Amount for the transaction', example: 100.50 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({ description: 'Description of the transaction', example: 'Salary deposit', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Source account ID', example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsNotEmpty()
  @IsUUID()
  accountId: string;

  @ApiProperty({ 
    description: 'Recipient account ID (for transfers only)',
    example: '123e4567-e89b-12d3-a456-426614174001',
    required: false
  })
  @IsOptional()
  @IsUUID()
  recipientAccountId?: string;
} 