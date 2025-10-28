-- ============================================
-- PARTE 3: KPIs GENERALES
-- ============================================
CREATE OR REPLACE FUNCTION crm_banco.sp_kpis_dashboard(
    p_fecha_inicio DATE DEFAULT NULL,
    p_fecha_fin DATE DEFAULT NULL
)
RETURNS TABLE(
    -- KPIs de Ventas
    total_ventas BIGINT,
    monto_total_ventas NUMERIC,
    venta_promedio NUMERIC,
    
    -- KPIs de Visitas
    total_visitas BIGINT,
    
    -- KPIs de Clientes
    total_clientes BIGINT,
    clientes_con_ventas BIGINT,
    promedio_ventas_por_cliente NUMERIC,
    
    -- KPIs de Conversión
    tasa_conversion_global NUMERIC,
    
    -- KPIs de Ejecutivos
    total_ejecutivos BIGINT,
    ejecutivos_activos BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        -- Ventas
        (SELECT COUNT(*) 
         FROM crm_banco.ventas v
         WHERE v.estado = 'activo'
           AND (p_fecha_inicio IS NULL OR v.fecha_venta >= p_fecha_inicio)
           AND (p_fecha_fin IS NULL OR v.fecha_venta <= p_fecha_fin)
        )::BIGINT AS total_ventas,
        
        (SELECT COALESCE(SUM(monto), 0)
         FROM crm_banco.ventas v
         WHERE v.estado = 'activo'
           AND (p_fecha_inicio IS NULL OR v.fecha_venta >= p_fecha_inicio)
           AND (p_fecha_fin IS NULL OR v.fecha_venta <= p_fecha_fin)
        ) AS monto_total_ventas,
        
        (SELECT ROUND(AVG(monto), 2)
         FROM crm_banco.ventas v
         WHERE v.estado = 'activo'
           AND (p_fecha_inicio IS NULL OR v.fecha_venta >= p_fecha_inicio)
           AND (p_fecha_fin IS NULL OR v.fecha_venta <= p_fecha_fin)
        ) AS venta_promedio,
        
        -- Visitas
        (SELECT COUNT(*)
         FROM crm_banco.visitas vis
         WHERE vis.estado = 'activo'
           AND (p_fecha_inicio IS NULL OR vis.fecha_visita >= p_fecha_inicio)
           AND (p_fecha_fin IS NULL OR vis.fecha_visita <= p_fecha_fin)
        )::BIGINT AS total_visitas,
        
        -- Clientes
        (SELECT COUNT(*)
         FROM crm_banco.clientes c
         WHERE c.estado = 'activo'
        )::BIGINT AS total_clientes,
        
        (SELECT COUNT(DISTINCT id_cliente)
         FROM crm_banco.ventas v
         WHERE v.estado = 'activo'
           AND (p_fecha_inicio IS NULL OR v.fecha_venta >= p_fecha_inicio)
           AND (p_fecha_fin IS NULL OR v.fecha_venta <= p_fecha_fin)
        )::BIGINT AS clientes_con_ventas,
        
        (SELECT ROUND(SUM(monto)::NUMERIC / NULLIF(COUNT(DISTINCT id_cliente), 0), 2)
         FROM crm_banco.ventas v
         WHERE v.estado = 'activo'
           AND (p_fecha_inicio IS NULL OR v.fecha_venta >= p_fecha_inicio)
           AND (p_fecha_fin IS NULL OR v.fecha_venta <= p_fecha_fin)
        ) AS promedio_ventas_por_cliente,
        
        -- Conversión
        (SELECT ROUND(
            (SELECT COUNT(*)::NUMERIC FROM crm_banco.ventas WHERE estado = 'activo') / 
            NULLIF((SELECT COUNT(*)::NUMERIC FROM crm_banco.visitas WHERE estado = 'activo'), 0) * 100,
            2
         )
        ) AS tasa_conversion_global,
        
        -- Ejecutivos
        (SELECT COUNT(*)
         FROM crm_banco.ejecutivos
        )::BIGINT AS total_ejecutivos,
        
        (SELECT COUNT(*)
         FROM crm_banco.ejecutivos e
         WHERE e.estado = 'activo'
        )::BIGINT AS ejecutivos_activos;
END;
$$ LANGUAGE plpgsql;