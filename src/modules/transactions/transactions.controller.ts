import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './entities/transaction.entity';

@ApiTags('Transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new transaction' })
  @ApiResponse({ status: 201, description: 'Transaction created successfully', type: Transaction })
  async create(@Request() req, @Body() createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    return this.transactionsService.create(req.user.id, createTransactionDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all transactions for the authenticated user' })
  @ApiResponse({ status: 200, description: 'Return all transactions', type: [Transaction] })
  async findAll(@Request() req): Promise<Transaction[]> {
    return this.transactionsService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get transaction by ID' })
  @ApiResponse({ status: 200, description: 'Return the transaction', type: Transaction })
  @ApiResponse({ status: 404, description: 'Transaction not found' })
  async findOne(@Request() req, @Param('id') id: string): Promise<Transaction> {
    return this.transactionsService.findOne(id, req.user.id);
  }

  @Get('account/:accountId')
  @ApiOperation({ summary: 'Get transactions for a specific account' })
  @ApiResponse({ status: 200, description: 'Return the transactions', type: [Transaction] })
  @ApiResponse({ status: 404, description: 'Account not found' })
  async findByAccount(@Request() req, @Param('accountId') accountId: string): Promise<Transaction[]> {
    return this.transactionsService.findByAccount(accountId, req.user.id);
  }
} 