
CREATE OR REPLACE FUNCTION crm_banco.sp_analizar_productividad_ejecutivo(
    p_fecha_inicio DATE DEFAULT NULL,
    p_fecha_fin DATE DEFAULT NULL,
    p_id_ejecutivo INTEGER DEFAULT NULL,
    p_estado VARCHAR DEFAULT 'activo'
)
RETURNS TABLE (
    id_ejecutivo INTEGER,
    nombre_ejecutivo VARCHAR,
    apellido_ejecutivo VARCHAR,
    total_visitas BIGINT,
    visitas_exitosas BIGINT,
    tasa_exito_visitas NUMERIC,
    total_clientes_visitados BIGINT,
    promedio_visitas_por_cliente NUMERIC,
    total_ventas_relacionadas BIGINT,
    monto_total_ventas NUMERIC,
    monto_promedio_venta NUMERIC,
    tasa_conversion_visita_venta NUMERIC,
    efectividad_ejecutivo NUMERIC,
    dias_activo INTEGER,
    promedio_visitas_diarias NUMERIC,
    periodo_analisis TEXT
) 
LANGUAGE plpgsql
AS $$
DECLARE
    v_fecha_inicio DATE;
    v_fecha_fin DATE;
BEGIN

    v_fecha_inicio := COALESCE(p_fecha_inicio, CURRENT_DATE - INTERVAL '30 days');
    v_fecha_fin := COALESCE(p_fecha_fin, CURRENT_DATE);
    
    RETURN QUERY
    WITH visitas_ejecutivo AS (

        SELECT 
            e.id AS id_ejecutivo,
            e.nombre,
            e.apellido,
            v.id AS id_visita,
            v.id_cliente,
            v.fecha_visita,
            v.resultado,
            CASE 
                WHEN LOWER(v.resultado) LIKE '%exitosa%' 
                  OR LOWER(v.resultado) LIKE '%positiv%'
                  OR LOWER(v.resultado) LIKE '%venta%'
                THEN 1 
                ELSE 0 
            END AS visita_exitosa
        FROM crm_banco.ejecutivos e
        LEFT JOIN crm_banco.visitas v ON e.id = v.id_ejecutivo
            AND v.fecha_visita::DATE BETWEEN v_fecha_inicio AND v_fecha_fin
            AND v.estado = p_estado
        WHERE e.estado = p_estado
            AND (p_id_ejecutivo IS NULL OR e.id = p_id_ejecutivo)
    ),
    ventas_periodo AS (

        SELECT 
            ve.id_ejecutivo,
            vt.id AS id_venta,
            vt.id_cliente,
            vt.monto,
            vt.fecha_venta,
            vt.producto
        FROM visitas_ejecutivo ve
        INNER JOIN crm_banco.ventas vt ON ve.id_cliente = vt.id_cliente
            AND vt.fecha_venta::DATE BETWEEN v_fecha_inicio AND v_fecha_fin
            AND vt.estado = p_estado
        WHERE ve.id_visita IS NOT NULL
    ),
    metricas_agregadas AS (
        
        SELECT 
            ve.id_ejecutivo,
            ve.nombre,
            ve.apellido,
            COUNT(DISTINCT ve.id_visita) AS total_visitas,
            SUM(ve.visita_exitosa) AS visitas_exitosas,
            COUNT(DISTINCT ve.id_cliente) AS total_clientes_visitados,
            COUNT(DISTINCT vp.id_venta) AS total_ventas_relacionadas,
            COALESCE(SUM(vp.monto), 0) AS monto_total_ventas,
            (v_fecha_fin - v_fecha_inicio + 1) AS dias_periodo
        FROM visitas_ejecutivo ve
        LEFT JOIN ventas_periodo vp ON ve.id_ejecutivo = vp.id_ejecutivo
        GROUP BY ve.id_ejecutivo, ve.nombre, ve.apellido
    )

    SELECT 
        ma.id_ejecutivo::INTEGER,
        ma.nombre::VARCHAR,
        ma.apellido::VARCHAR,
        ma.total_visitas::BIGINT,
        ma.visitas_exitosas::BIGINT,
        CASE 
            WHEN ma.total_visitas > 0 
            THEN ROUND((ma.visitas_exitosas::NUMERIC / ma.total_visitas) * 100, 2)
            ELSE 0 
        END AS tasa_exito_visitas,
        ma.total_clientes_visitados::BIGINT,
        CASE 
            WHEN ma.total_clientes_visitados > 0 
            THEN ROUND(ma.total_visitas::NUMERIC / ma.total_clientes_visitados, 2)
            ELSE 0 
        END AS promedio_visitas_por_cliente,
        ma.total_ventas_relacionadas::BIGINT,
        ROUND(ma.monto_total_ventas, 2) AS monto_total_ventas,
        CASE 
            WHEN ma.total_ventas_relacionadas > 0 
            THEN ROUND(ma.monto_total_ventas / ma.total_ventas_relacionadas, 2)
            ELSE 0 
        END AS monto_promedio_venta,
        CASE 
            WHEN ma.total_visitas > 0 
            THEN ROUND((ma.total_ventas_relacionadas::NUMERIC / ma.total_visitas) * 100, 2)
            ELSE 0 
        END AS tasa_conversion_visita_venta,
        CASE 
            WHEN ma.total_visitas > 0 
            THEN ROUND(
                (
                    (ma.visitas_exitosas::NUMERIC / ma.total_visitas * 0.3) +
                    (ma.total_ventas_relacionadas::NUMERIC / NULLIF(ma.total_visitas, 0) * 0.4) +
                    (LEAST(ma.monto_total_ventas / 100000, 1) * 0.3)
                ) * 100, 2
            )
            ELSE 0 
        END AS efectividad_ejecutivo,
        ma.dias_periodo::INTEGER AS dias_activo,
        CASE 
            WHEN ma.dias_periodo > 0 
            THEN ROUND(ma.total_visitas::NUMERIC / ma.dias_periodo, 2)
            ELSE 0 
        END AS promedio_visitas_diarias,
        FORMAT('%s al %s', v_fecha_inicio, v_fecha_fin)::TEXT AS periodo_analisis
    FROM metricas_agregadas ma
    ORDER BY ma.monto_total_ventas DESC, ma.total_visitas DESC;
END;
$$;


CREATE OR REPLACE FUNCTION crm_banco.sp_productividad_ejecutivo_simple(
    p_id_ejecutivo INTEGER DEFAULT NULL
)
RETURNS TABLE (
    id_ejecutivo INTEGER,
    nombre_completo TEXT,
    total_visitas BIGINT,
    total_clientes BIGINT,
    total_ventas NUMERIC,
    efectividad_porcentaje NUMERIC
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        e.id AS id_ejecutivo,
        CONCAT(e.nombre, ' ', e.apellido) AS nombre_completo,
        COUNT(DISTINCT v.id) AS total_visitas,
        COUNT(DISTINCT v.id_cliente) AS total_clientes,
        COALESCE(SUM(vt.monto), 0) AS total_ventas,
        CASE 
            WHEN COUNT(DISTINCT v.id) > 0 
            THEN ROUND(
                (COUNT(DISTINCT vt.id)::NUMERIC / COUNT(DISTINCT v.id)) * 100, 
                2
            )
            ELSE 0 
        END AS efectividad_porcentaje
    FROM crm_banco.ejecutivos e
    LEFT JOIN crm_banco.visitas v ON e.id = v.id_ejecutivo
        AND v.estado = 'activo'
    LEFT JOIN crm_banco.ventas vt ON v.id_cliente = vt.id_cliente
        AND vt.fecha_venta >= v.fecha_visita
        AND vt.estado = 'activo'
    WHERE e.estado = 'activo'
        AND (p_id_ejecutivo IS NULL OR e.id = p_id_ejecutivo)
    GROUP BY e.id, e.nombre, e.apellido
    ORDER BY total_ventas DESC;
END;
$$;

