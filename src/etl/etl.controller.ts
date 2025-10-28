import {
  Controller,
  Post,
  Get,
  UseInterceptors,
  UploadedFile,
  Body,
  BadRequestException,
  // UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EtlService } from './etl.service';
import { ETLOptionsDto, ETLResultDto } from './dto/create-etl.dto';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiResponse,
  // ApiBearerAuth,
} from '@nestjs/swagger';
//import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'; // Ajusta según tu guard

@ApiTags('ETL')
@Controller('etl')
//@UseGuards(JwtAuthGuard) // Proteger con autenticación
//@ApiBearerAuth()
export class EtlController {
  constructor(private readonly etlService: EtlService) {}

  @Post('ventas/upload')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Cargar ventas y clientes desde Excel o CSV',
    description:
      'Procesa un archivo Excel (.xlsx, .xls) o CSV con información de ventas y clientes. ' +
      'El archivo debe contener las columnas: id_transaccion, nombre, apellido, tipo_documento, ' +
      'documento, fecha_venta, monto, producto',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Archivo Excel o CSV',
        },
        agregado_por: {
          type: 'string',
          description: 'Usuario que realiza la carga',
          example: 'admin@banco.com',
        },
        skip_duplicates: {
          type: 'boolean',
          description: 'Omitir ventas duplicadas',
          default: false,
        },
        update_existing: {
          type: 'boolean',
          description: 'Actualizar clientes existentes',
          default: true,
        },
      },
      required: ['file'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Archivo procesado exitosamente',
    schema: {
      type: 'object',
      properties: {
        total_registros: { type: 'number', example: 28 },
        exitosos: { type: 'number', example: 26 },
        fallidos: { type: 'number', example: 2 },
        clientes_creados: { type: 'number', example: 20 },
        clientes_actualizados: { type: 'number', example: 6 },
        ventas_creadas: { type: 'number', example: 26 },
        errores: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              fila: { type: 'number' },
              id_transaccion: { type: 'string' },
              error: { type: 'string' },
            },
          },
        },
        tiempo_procesamiento_ms: { type: 'number', example: 1234 },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Archivo inválido o formato incorrecto',
  })
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
      fileFilter: (req, file, callback) => {
        const allowedExtensions = ['.csv', '.xlsx', '.xls'];
        const extension = file.originalname
          .substring(file.originalname.lastIndexOf('.'))
          .toLowerCase();

        if (!allowedExtensions.includes(extension)) {
          return callback(
            new BadRequestException(
              'Solo se permiten archivos CSV, XLS o XLSX',
            ),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  async cargarVentas(
    @UploadedFile() file: Express.Multer.File,
    @Body() options: ETLOptionsDto,
  ): Promise<ETLResultDto> {
    if (!file) {
      throw new BadRequestException('Debe proporcionar un archivo');
    }

    return await this.etlService.procesarArchivoVentas(file, options);
  }
}
