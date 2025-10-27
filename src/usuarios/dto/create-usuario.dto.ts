import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
} from 'class-validator';

export class CreateUsuarioDto {
  @ApiProperty({ example: 'put some text here' })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({ example: 'put some text here' })
  @IsNotEmpty()
  @IsString()
  email: string;

  @ApiProperty({ example: 'put some text here' })
  @IsNotEmpty()
  @IsString()
  password_hash: string;

  @ApiProperty({ example: 'put some text here' })
  @IsNotEmpty()
  @IsString()
  salt: string;

  @ApiProperty({ example: 12345 })
  @IsNotEmpty()
  @IsNumber()
  id_rol: number;

  @ApiProperty({ example: 'put some text here' })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiProperty({ example: 'put some text here' })
  @IsOptional()
  @IsString()
  avatar_url?: string;

  @ApiProperty({ example: 'example' })
  @IsOptional()
  ultimo_acceso?: any;

  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  intentos_fallidos?: number;

  @ApiProperty({ example: 'example' })
  @IsOptional()
  bloqueado_hasta?: any;

  @ApiProperty({ example: 'put some text here' })
  @IsOptional()
  @IsString()
  token_reset_password?: string;

  @ApiProperty({ example: 'example' })
  @IsOptional()
  token_reset_expira?: any;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  debe_cambiar_password?: boolean;

  @ApiProperty({ example: 'example' })
  @IsOptional()
  fecha_ultimo_cambio_password?: any;

  @ApiProperty({ example: 'put some text here' })
  @IsNotEmpty()
  @IsString()
  agregado_por: string;

  @ApiProperty({ example: 'example' })
  @IsOptional()
  agregado_en?: any;

  @ApiProperty({ example: 'put some text here' })
  @IsOptional()
  @IsString()
  actualizado_por?: string;

  @ApiProperty({ example: 'example' })
  @IsOptional()
  actualizado_en?: any;

  @ApiProperty({ example: 'put some text here' })
  @IsOptional()
  @IsString()
  estado?: string;

  // @ApiProperty({ example: 12345 })
  // @IsOptional()
  // @IsNumber()
  // id_empleado?: number;
}
