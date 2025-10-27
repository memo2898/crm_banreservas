import { IsOptional, IsDateString, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ProductividadFiltrosDto {
  @ApiPropertyOptional({
    description: 'Fecha de inicio (YYYY-MM-DD)',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDateString()
  fechaInicio?: string;

  @ApiPropertyOptional({
    description: 'Fecha de fin (YYYY-MM-DD)',
    example: '2024-12-31',
  })
  @IsOptional()
  @IsDateString()
  fechaFin?: string;

  @ApiPropertyOptional({
    description: 'ID del ejecutivo',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  idEjecutivo?: number;
}

export class ProductividadSimpleDto {
  @ApiPropertyOptional({
    description: 'ID del ejecutivo',
    example: 1,
  })
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  idEjecutivo?: number;
}
