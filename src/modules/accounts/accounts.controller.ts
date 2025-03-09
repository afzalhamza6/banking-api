import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AccountsService } from './accounts.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { Account } from './entities/account.entity';

@ApiTags('Accounts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('accounts')
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new account' })
  @ApiResponse({ status: 201, description: 'Account created successfully', type: Account })
  async create(@Request() req, @Body() createAccountDto: CreateAccountDto): Promise<Account> {
    return this.accountsService.create(req.user.id, createAccountDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all accounts for the authenticated user' })
  @ApiResponse({ status: 200, description: 'Return all accounts', type: [Account] })
  async findAll(@Request() req): Promise<Account[]> {
    return this.accountsService.findAll(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get account by ID' })
  @ApiResponse({ status: 200, description: 'Return the account', type: Account })
  @ApiResponse({ status: 404, description: 'Account not found' })
  async findOne(@Request() req, @Param('id') id: string): Promise<Account> {
    return this.accountsService.findOne(id, req.user.id);
  }

  @Get(':id/balance')
  @ApiOperation({ summary: 'Get account balance' })
  @ApiResponse({ status: 200, description: 'Return the account balance' })
  @ApiResponse({ status: 404, description: 'Account not found' })
  async getBalance(@Request() req, @Param('id') id: string): Promise<{ balance: number; currency: string }> {
    return this.accountsService.getBalance(id, req.user.id);
  }
} 