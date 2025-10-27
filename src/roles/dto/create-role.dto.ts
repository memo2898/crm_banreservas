import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({ example: "put some text here" })
  @IsNotEmpty()
  @IsString()
  nombre_rol: string;

  @ApiProperty({ example: "put some text here" })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({ example: "put some text here" })
  @IsOptional()
  @IsString()
  agregado_por?: string;

  @ApiProperty({ example: "2025-04-01" })
  @IsOptional()
  @IsDateString()
  agregado_en?: string;

  @ApiProperty({ example: "put some text here" })
  @IsOptional()
  @IsString()
  actualizado_por?: string;

  @ApiProperty({ example: "2025-04-01" })
  @IsOptional()
  @IsDateString()
  actualizado_en?: string;

  @ApiProperty({ example: "put some text here" })
  @IsOptional()
  @IsString()
  estado?: string;
}
