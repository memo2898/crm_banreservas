import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EtlService } from './etl.service';
import { EtlController } from './etl.controller';

import { Cliente } from '../clientes/entities/cliente.entity';
import { Venta } from '../ventas/entities/venta.entity';
import { TipoDocumento as TipoDocumentoEntity } from '../tipo_documentos/entities/tipo_documento.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cliente, Venta, TipoDocumentoEntity])],
  controllers: [EtlController],
  providers: [EtlService],
  exports: [EtlService],
})
export class EtlModule {}
