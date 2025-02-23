import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

export enum UserIdentifierType {
  EMAIL = 'email',
  TELEGRAM = 'telegram'
}

export class CheckUserDto {
  @ApiProperty({
    enum: UserIdentifierType,
    description: 'Type of identifier (email or telegram)'
  })
  @IsEnum(UserIdentifierType)
  type: UserIdentifierType;

  @ApiProperty({
    description: 'User identifier (email address or telegram username)'
  })
  @IsString()
  identifier: string;
}