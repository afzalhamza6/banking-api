import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @ApiProperty({ description: 'The unique identifier of the user' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ description: 'User\'s first name' })
  @Column()
  firstName: string;

  @ApiProperty({ description: 'User\'s last name' })
  @Column()
  lastName: string;

  @ApiProperty({ description: 'User\'s email address', example: 'user@example.com' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ description: 'User\'s phone number' })
  @Column({ nullable: true })
  phoneNumber: string;

  @Exclude()
  @Column()
  password: string;

  @ApiProperty({ description: 'Whether the user\'s email is verified' })
  @Column({ default: false })
  isEmailVerified: boolean;

  @ApiProperty({ description: 'User\'s role in the system' })
  @Column({ default: 'customer' })
  role: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships will be defined here once Account entity is created
} 