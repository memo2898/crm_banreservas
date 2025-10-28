import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class VentasProductoDto {
  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Tarjeta de Crédito',
  })
  producto: string;

  @ApiProperty({
    description: 'Cantidad de ventas del producto',
    example: 150,
  })
  cantidad_ventas: number;

  @ApiProperty({
    description: 'Monto total vendido del producto',
    example: 2500000.0,
  })
  monto_total: number;
}

export class VentasProductoQueryDto {
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
