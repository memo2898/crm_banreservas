-- ===============================================
-- 3.1 TOTAL DE VISITAS
-- ===============================================
SELECT COUNT(*) AS total_visitas
FROM crm_banco.visitas
WHERE estado = 'activo';

-- ===============================================
-- 3.2 VISITAS POR EJECUTIVO
-- ===============================================
SELECT 
    e.id AS id_ejecutivo,
    e.nombre || ' ' || e.apellido AS ejecutivo,
    COUNT(v.id) AS total_visitas
FROM crm_banco.visitas v
JOIN crm_banco.ejecutivos e ON e.id = v.id_ejecutivo
WHERE v.estado = 'activo'
GROUP BY e.id
ORDER BY total_visitas DESC;

-- ===============================================
-- 3.3 VISITAS POR CLIENTE
-- ===============================================
SELECT 
    c.id AS id_cliente,
    c.nombre || ' ' || c.apellido AS cliente,
    COUNT(v.id) AS total_visitas
FROM crm_banco.visitas v
JOIN crm_banco.clientes c ON c.id = v.id_cliente
WHERE v.estado = 'activo'
GROUP BY c.id
ORDER BY total_visitas DESC;

-- ===============================================
-- 3.4 VENTAS POR EJECUTIVO
-- (usando campo agregado_por como referencia del ejecutivo)
-- ===============================================
SELECT 
    v.agregado_por AS ejecutivo,
    COUNT(v.id) AS total_ventas,
    SUM(v.monto) AS monto_total
FROM crm_banco.ventas v
WHERE v.estado = 'activo'
GROUP BY v.agregado_por
ORDER BY monto_total DESC;

-- ===============================================
-- 3.5 PROMEDIO DE VENTAS POR CLIENTE
-- ===============================================
SELECT 
    ROUND(SUM(monto)::numeric / COUNT(DISTINCT id_cliente), 2) AS promedio_ventas_por_cliente
FROM crm_banco.ventas
WHERE estado = 'activo';
