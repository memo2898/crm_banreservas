import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class VentasEjecutivoDto {
  @ApiProperty({
    description: 'Nombre del ejecutivo',
    example: 'María González',
  })
  ejecutivo: string;

  @ApiProperty({
    description: 'Total de ventas realizadas por el ejecutivo',
    example: 45,
  })
  total_ventas: number;

  @ApiProperty({
    description: 'Monto total vendido por el ejecutivo',
    example: 875000.0,
  })
  monto_total: number;
}

export class VentasEjecutivoQueryDto {
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
