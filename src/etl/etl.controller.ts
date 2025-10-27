import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { EtlService } from './etl.service';
import { CreateEtlDto } from './dto/create-etl.dto';
import { UpdateEtlDto } from './dto/update-etl.dto';

@ApiTags('ETL')
@Controller('etl')
export class EtlController {
  constructor(private readonly etlService: EtlService) {}

  @Post('upload-ventas')
  @ApiOperation({ summary: 'Subir ventas desde un archivo (CSV o Excel)' })
  @ApiResponse({ status: 201, description: 'Ventas creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error en los datos enviados.' })
  upload(@Body() createEtlDto: CreateEtlDto) {
    return this.etlService.create(createEtlDto);
  }
}
