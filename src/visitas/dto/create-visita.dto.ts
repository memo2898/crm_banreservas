import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsNotEmpty, IsDateString, IsString } from 'class-validator';

export class CreateVisitaDto {
  @ApiProperty({ example: 12345 })
  @IsOptional()
  @IsNumber()
  id_visita?: number;

  @ApiProperty({ example: 12345 })
  @IsNotEmpty()
  @IsNumber()
  id_cliente: number;

  @ApiProperty({ example: 12345 })
  @IsNotEmpty()
  @IsNumber()
  id_ejecutivo: number;

  @ApiProperty({ example: "2025-04-01" })
  @IsNotEmpty()
  @IsDateString()
  fecha_visita: string;

  @ApiProperty({ example: "put some text here" })
  @IsOptional()
  @IsString()
  resultado?: string;

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
