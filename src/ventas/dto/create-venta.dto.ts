import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsDateString, IsString, IsOptional } from 'class-validator';

export class CreateVentaDto {
  @ApiProperty({ example: 12345 })
  @IsNotEmpty()
  @IsNumber()
  id_cliente: number;

  @ApiProperty({ example: "2025-04-01" })
  @IsNotEmpty()
  @IsDateString()
  fecha_venta: string;

  @ApiProperty({ example: 12345 })
  @IsNotEmpty()
  @IsNumber()
  monto: number;

  @ApiProperty({ example: "put some text here" })
  @IsNotEmpty()
  @IsString()
  producto: string;

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
