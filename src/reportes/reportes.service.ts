import { Injectable, Logger } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import {
  KpisDashboardDto,
  KpisDashboardQueryDto,
} from './dto/kpis-dashboard.dto';
import {
  TendenciaMensualDto,
  TendenciaMensualQueryDto,
} from './dto/tendencia-mensual.dto';
import {
  VentasProductoDto,
  VentasProductoQueryDto,
} from './dto/ventas-producto.dto';
import {
  VentasClienteDto,
  VentasClienteQueryDto,
} from './dto/ventas-cliente.dto';
import {
  VentasEjecutivoDto,
  VentasEjecutivoQueryDto,
} from './dto/ventas-ejecutivo.dto';
import {
  PromedioVentasClienteDto,
  PromedioVentasClienteQueryDto,
} from './dto/promedio-ventas-cliente.dto';

@Injectable()
export class ReportesService {
  private readonly logger = new Logger(ReportesService.name);

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  async getKpisDashboard(
    query: KpisDashboardQueryDto,
  ): Promise<KpisDashboardDto> {
    try {
      const { fecha_inicio, fecha_fin } = query;

      const sqlQuery = `
        SELECT * FROM crm_banco.sp_kpis_dashboard($1::DATE, $2::DATE)
      `;

      const params = [fecha_inicio || null, fecha_fin || null];

      const result = await this.dataSource.query(sqlQuery, params);

      this.logger.log(`KPIs dashboard obtenidos: ${result.length} registros`);

      if (result && result.length > 0) {
        return {
          total_ventas: parseInt(result[0].total_ventas),
          monto_total_ventas: parseFloat(result[0].monto_total_ventas),
          venta_promedio: parseFloat(result[0].venta_promedio),
          total_visitas: parseInt(result[0].total_visitas),
          total_clientes: parseInt(result[0].total_clientes),
          clientes_con_ventas: parseInt(result[0].clientes_con_ventas),
          promedio_ventas_por_cliente: parseFloat(
            result[0].promedio_ventas_por_cliente,
          ),
          tasa_conversion_global: parseFloat(result[0].tasa_conversion_global),
          total_ejecutivos: parseInt(result[0].total_ejecutivos),
          ejecutivos_activos: parseInt(result[0].ejecutivos_activos),
        };
      }

      throw new Error('No se pudieron obtener los KPIs del dashboard');
    } catch (error) {
      this.logger.error('Error al obtener KPIs del dashboard:', error);
      throw error;
    }
  }

  async getVentasPorProducto(
    query: VentasProductoQueryDto,
  ): Promise<VentasProductoDto[]> {
    try {
      const { fecha_inicio, fecha_fin } = query;

      let sqlQuery = `
        SELECT 
          producto,
          COUNT(*)::int AS cantidad_ventas,
          SUM(monto)::numeric AS monto_total
        FROM crm_banco.ventas
        WHERE estado = 'activo'
      `;

      const params: any[] = [];

      if (fecha_inicio) {
        params.push(fecha_inicio);
        sqlQuery += ` AND fecha_venta >= $${params.length}::DATE`;
      }

      if (fecha_fin) {
        params.push(fecha_fin);
        sqlQuery += ` AND fecha_venta <= $${params.length}::DATE`;
      }

      sqlQuery += `
        GROUP BY producto
        ORDER BY monto_total DESC
      `;

      const result = await this.dataSource.query(sqlQuery, params);

      this.logger.log(
        `Ventas por producto obtenidas: ${result.length} productos`,
      );

      return result.map((row: any) => ({
        producto: row.producto,
        cantidad_ventas: parseInt(row.cantidad_ventas),
        monto_total: parseFloat(row.monto_total),
      }));
    } catch (error) {
      this.logger.error('Error al obtener ventas por producto:', error);
      throw error;
    }
  }

  async getVentasPorCliente(
    query: VentasClienteQueryDto,
  ): Promise<VentasClienteDto[]> {
    try {
      const { fecha_inicio, fecha_fin } = query;

      let sqlQuery = `
        SELECT 
          c.id::int AS id_cliente,
          c.nombre || ' ' || c.apellido AS cliente,
          COUNT(v.id)::int AS total_ventas,
          SUM(v.monto)::numeric AS monto_total
        FROM crm_banco.ventas v
        JOIN crm_banco.clientes c ON c.id = v.id_cliente
        WHERE v.estado = 'activo'
      `;

      const params: any[] = [];

      if (fecha_inicio) {
        params.push(fecha_inicio);
        sqlQuery += ` AND v.fecha_venta >= $${params.length}::DATE`;
      }

      if (fecha_fin) {
        params.push(fecha_fin);
        sqlQuery += ` AND v.fecha_venta <= $${params.length}::DATE`;
      }

      sqlQuery += `
        GROUP BY c.id, c.nombre, c.apellido
        ORDER BY monto_total DESC
      `;

      const result = await this.dataSource.query(sqlQuery, params);

      this.logger.log(
        `Ventas por cliente obtenidas: ${result.length} clientes`,
      );

      return result.map((row: any) => ({
        id_cliente: parseInt(row.id_cliente),
        cliente: row.cliente,
        total_ventas: parseInt(row.total_ventas),
        monto_total: parseFloat(row.monto_total),
      }));
    } catch (error) {
      this.logger.error('Error al obtener ventas por cliente:', error);
      throw error;
    }
  }

  async getVentasPorEjecutivo(
    query: VentasEjecutivoQueryDto,
  ): Promise<VentasEjecutivoDto[]> {
    try {
      const { fecha_inicio, fecha_fin } = query;

      let sqlQuery = `
        SELECT 
          v.agregado_por AS ejecutivo,
          COUNT(v.id)::int AS total_ventas,
          SUM(v.monto)::numeric AS monto_total
        FROM crm_banco.ventas v
        WHERE v.estado = 'activo'
      `;

      const params: any[] = [];

      if (fecha_inicio) {
        params.push(fecha_inicio);
        sqlQuery += ` AND v.fecha_venta >= $${params.length}::DATE`;
      }

      if (fecha_fin) {
        params.push(fecha_fin);
        sqlQuery += ` AND v.fecha_venta <= $${params.length}::DATE`;
      }

      sqlQuery += `
        GROUP BY v.agregado_por
        ORDER BY monto_total DESC
      `;

      const result = await this.dataSource.query(sqlQuery, params);

      this.logger.log(
        `Ventas por ejecutivo obtenidas: ${result.length} ejecutivos`,
      );

      return result.map((row: any) => ({
        ejecutivo: row.ejecutivo,
        total_ventas: parseInt(row.total_ventas),
        monto_total: parseFloat(row.monto_total),
      }));
    } catch (error) {
      this.logger.error('Error al obtener ventas por ejecutivo:', error);
      throw error;
    }
  }

  async getPromedioVentasPorCliente(
    query: PromedioVentasClienteQueryDto,
  ): Promise<PromedioVentasClienteDto> {
    try {
      const { fecha_inicio, fecha_fin } = query;

      let sqlQuery = `
        SELECT 
          ROUND(SUM(monto)::numeric / COUNT(DISTINCT id_cliente), 2) AS promedio_ventas_por_cliente
        FROM crm_banco.ventas
        WHERE estado = 'activo'
      `;

      const params: any[] = [];

      if (fecha_inicio) {
        params.push(fecha_inicio);
        sqlQuery += ` AND fecha_venta >= $${params.length}::DATE`;
      }

      if (fecha_fin) {
        params.push(fecha_fin);
        sqlQuery += ` AND fecha_venta <= $${params.length}::DATE`;
      }

      const result = await this.dataSource.query(sqlQuery, params);

      this.logger.log('Promedio de ventas por cliente obtenido');

      if (result && result.length > 0) {
        return {
          promedio_ventas_por_cliente: parseFloat(
            result[0].promedio_ventas_por_cliente,
          ),
        };
      }

      return {
        promedio_ventas_por_cliente: 0,
      };
    } catch (error) {
      this.logger.error(
        'Error al obtener promedio de ventas por cliente:',
        error,
      );
      throw error;
    }
  }
}
