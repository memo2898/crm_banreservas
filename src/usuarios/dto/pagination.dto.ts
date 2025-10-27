import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsNumber, Min, Max, IsString } from 'class-validator';

export class PaginationDto {
  @ApiPropertyOptional({ 
    example: 1, 
    description: 'Número de página (empezando desde 1)',
    minimum: 1 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ 
    example: 10, 
    description: 'Cantidad de elementos por página',
    minimum: 1,
    maximum: 100 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({ 
    example: 'created_at:DESC',
    description: 'Ordenamiento en formato campo:direccion (ASC o DESC)' 
  })
  @IsOptional()
  @IsString()
  sort?: string;
}

export class UsuarioFiltersDto extends PaginationDto {

  @ApiPropertyOptional({ 
    example: 'valor ejemplo', 
    description: 'Filtrar por nombre_usuario' 
  })
  @IsOptional()
  @IsString()
  nombre_usuario?: string;

  @ApiPropertyOptional({ 
    example: 'valor ejemplo', 
    description: 'Filtrar por nombre_completo' 
  })
  @IsOptional()
  @IsString()
  nombre_completo?: string;

  @ApiPropertyOptional({ 
    example: 'usuario@ejemplo.com', 
    description: 'Filtrar por email' 
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ 
    example: 'valor ejemplo', 
    description: 'Filtrar por password_hash' 
  })
  @IsOptional()
  @IsString()
  password_hash?: string;

  @ApiPropertyOptional({ 
    example: 'valor ejemplo', 
    description: 'Filtrar por salt' 
  })
  @IsOptional()
  @IsString()
  salt?: string;

  @ApiPropertyOptional({ 
    example: 1, 
    description: 'Filtrar por id_rol' 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  id_rol?: number;

  @ApiPropertyOptional({ 
    example: 'valor ejemplo', 
    description: 'Filtrar por telefono' 
  })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiPropertyOptional({ 
    example: 'valor ejemplo', 
    description: 'Filtrar por avatar_url' 
  })
  @IsOptional()
  @IsString()
  avatar_url?: string;

  @ApiPropertyOptional({ 
    example: 1, 
    description: 'Filtrar por intentos_fallidos' 
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  intentos_fallidos?: number;

  @ApiPropertyOptional({ 
    example: 'valor ejemplo', 
    description: 'Filtrar por token_reset_password' 
  })
  @IsOptional()
  @IsString()
  token_reset_password?: string;

  @ApiPropertyOptional({ 
    example: true, 
    description: 'Filtrar por debe_cambiar_password' 
  })
  @IsOptional()
  @Type(() => Boolean)
  debe_cambiar_password?: boolean;

  @ApiPropertyOptional({ 
    example: 'valor ejemplo', 
    description: 'Filtrar por agregado_por' 
  })
  @IsOptional()
  @IsString()
  agregado_por?: string;

  @ApiPropertyOptional({ 
    example: 'valor ejemplo', 
    description: 'Filtrar por actualizado_por' 
  })
  @IsOptional()
  @IsString()
  actualizado_por?: string;

  @ApiPropertyOptional({ 
    example: 'valor ejemplo', 
    description: 'Filtrar por estado' 
  })
  @IsOptional()
  @IsString()
  estado?: string;

}
