import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class ProductividadService {
  private readonly logger = new Logger(ProductividadService.name);

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  /**
   * Ejecuta sp_analizar_productividad_ejecutivo
   */
  async analisisCompleto(
    fechaInicio?: string,
    fechaFin?: string,
    idEjecutivo?: number,
  ) {
    try {
      const query = `
        SELECT * FROM crm_banco.sp_analizar_productividad_ejecutivo($1::DATE, $2::DATE, $3::INTEGER, $4::VARCHAR)
      `;

      const params = [
        fechaInicio || null,
        fechaFin || null,
        idEjecutivo || null,
        'activo',
      ];

      const result = await this.dataSource.query(query, params);

      this.logger.log(
        `Análisis completo ejecutado: ${result.length} registros`,
      );

      return {
        success: true,
        data: result,
        total: result.length,
      };
    } catch (error) {
      this.logger.error('Error en análisis completo:', error);
      throw error;
    }
  }

  /**
   * Ejecuta sp_productividad_ejecutivo_simple
   */
  async analisisSimple(idEjecutivo?: number) {
    try {
      const query = `
        SELECT * FROM crm_banco.sp_productividad_ejecutivo_simple($1::INTEGER)
      `;

      const result = await this.dataSource.query(query, [idEjecutivo || null]);

      this.logger.log(`Análisis simple ejecutado: ${result.length} registros`);

      return {
        success: true,
        data: result,
        total: result.length,
      };
    } catch (error) {
      this.logger.error('Error en análisis simple:', error);
      throw error;
    }
  }
}
