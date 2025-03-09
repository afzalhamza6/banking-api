import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsEnum } from 'class-validator';

export enum AccountType {
  CHECKING = 'checking',
  SAVINGS = 'savings',
  CREDIT = 'credit',
}

export class CreateAccountDto {
  @ApiProperty({ 
    description: 'Type of account', 
    enum: AccountType,
    example: AccountType.CHECKING
  })
  @IsNotEmpty()
  @IsEnum(AccountType)
  accountType: AccountType;

  @ApiProperty({ description: 'Currency for the account', example: 'USD', required: false })
  @IsOptional()
  @IsString()
  currency?: string;
} 