import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsDateString,
  IsOptional,
  IsEnum,
  Matches,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum TipoDocumento {
  CED = 'CED',
  RNC = 'RNC',
  PAS = 'PAS',
}

export class VentaClienteRowDto {
  @IsNotEmpty({ message: 'El ID de transacción es requerido' })
  @IsString()
  id_transaccion: string;

  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  apellido?: string;

  @IsNotEmpty({ message: 'El tipo de documento es requerido' })
  @IsEnum(TipoDocumento, {
    message: 'Tipo de documento inválido (CED, RNC, PAS)',
  })
  tipo_documento: TipoDocumento;

  @IsNotEmpty({ message: 'El documento es requerido' })
  //@IsString()
  // @Matches(/^[0-9]{11}$/, { message: 'El documento debe tener 11 dígitos' })
  documento: string;

  @IsNotEmpty({ message: 'La fecha de venta es requerida' })
  @IsDateString({}, { message: 'Formato de fecha inválido' })
  fecha_venta: string;

  @IsNotEmpty({ message: 'El monto es requerido' })
  @Type(() => Number)
  @IsNumber({}, { message: 'El monto debe ser un número' })
  @Min(0.01, { message: 'El monto debe ser mayor a 0' })
  monto: number;

  @IsNotEmpty({ message: 'El producto es requerido' })
  @IsString()
  producto: string;
}

export class ETLResultDto {
  total_registros: number;
  exitosos: number;
  fallidos: number;
  clientes_creados: number;
  clientes_actualizados: number;
  ventas_creadas: number;
  errores: Array<{
    fila: number;
    id_transaccion?: string;
    error: string;
  }>;
  tiempo_procesamiento_ms: number;
}

export class ETLOptionsDto {
  @IsOptional()
  @IsString()
  agregado_por?: string;

  @IsOptional()
  skip_duplicates?: boolean;

  @IsOptional()
  update_existing?: boolean;
}
