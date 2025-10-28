import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class VentasClienteDto {
  @ApiProperty({
    description: 'ID del cliente',
    example: 1,
  })
  id_cliente: number;

  @ApiProperty({
    description: 'Nombre completo del cliente',
    example: 'Juan Pérez',
  })
  cliente: string;

  @ApiProperty({
    description: 'Total de ventas del cliente',
    example: 5,
  })
  total_ventas: number;

  @ApiProperty({
    description: 'Monto total de compras del cliente',
    example: 125000.0,
  })
  monto_total: number;
}

export class VentasClienteQueryDto {
  @ApiProperty({
    required: false,
    description: 'Fecha de inicio del período (formato: YYYY-MM-DD)',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsString()
  fecha_inicio?: string;

  @ApiProperty({
    required: false,
    description: 'Fecha de fin del período (formato: YYYY-MM-DD)',
    example: '2024-12-31',
  })
  @IsOptional()
  @IsString()
  fecha_fin?: string;
}
