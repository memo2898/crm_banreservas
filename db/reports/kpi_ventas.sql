-- ===============================================
-- 1.1 TOTAL DE VENTAS
-- ===============================================
SELECT COUNT(*) AS total_ventas
FROM crm_banco.ventas
WHERE estado = 'activo';

-- ===============================================
-- 1.2 MONTO TOTAL VENDIDO
-- ===============================================
SELECT COALESCE(SUM(monto), 0) AS monto_total_vendido
FROM crm_banco.ventas
WHERE estado = 'activo';

-- ===============================================
-- 1.3 MONTO PROMEDIO POR VENTA
-- ===============================================
SELECT ROUND(AVG(monto), 2) AS monto_promedio_por_venta
FROM crm_banco.ventas
WHERE estado = 'activo';

-- ===============================================
-- 1.4 MONTO TOTAL VENDIDO POR PRODUCTO
-- ===============================================
SELECT 
    producto,
    COUNT(*) AS cantidad_ventas,
    SUM(monto) AS monto_total
FROM crm_banco.ventas
WHERE estado = 'activo'
GROUP BY producto
ORDER BY monto_total DESC;

-- ===============================================
-- 1.5 VENTAS POR CLIENTE
-- ===============================================
SELECT 
    c.id AS id_cliente,
    c.nombre || ' ' || c.apellido AS cliente,
    COUNT(v.id) AS total_ventas,
    SUM(v.monto) AS monto_total
FROM crm_banco.ventas v
JOIN crm_banco.clientes c ON c.id = v.id_cliente
WHERE v.estado = 'activo'
GROUP BY c.id
ORDER BY monto_total DESC;


-- ===============================================
-- 1.7 MONTO PROMEDIO MENSUAL
-- ===============================================
SELECT 
    TO_CHAR(DATE_TRUNC('month', fecha_venta), 'YYYY-MM') AS mes,
    SUM(monto) AS monto_total_mes,
    ROUND(AVG(monto), 2) AS monto_promedio_mes
FROM crm_banco.ventas
WHERE estado = 'activo'
GROUP BY DATE_TRUNC('month', fecha_venta)
ORDER BY mes;

-- ===============================================
-- 1.8 CRECIMIENTO MENSUAL (%)
-- ===============================================
WITH ventas_mensuales AS (
    SELECT 
        DATE_TRUNC('month', fecha_venta) AS mes,
        SUM(monto) AS monto_total
    FROM crm_banco.ventas
    WHERE estado = 'activo'
    GROUP BY DATE_TRUNC('month', fecha_venta)
)
SELECT 
    TO_CHAR(mes, 'YYYY-MM') AS mes,
    monto_total,
    ROUND(
        ((monto_total - LAG(monto_total) OVER (ORDER BY mes)) 
         / NULLIF(LAG(monto_total) OVER (ORDER BY mes), 0)) * 100,
        2
    ) AS crecimiento_pct
FROM ventas_mensuales
ORDER BY mes;
