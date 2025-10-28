-- ===============================================
-- 2.1 TOTAL DE CLIENTES
-- ===============================================
SELECT COUNT(*) AS total_clientes
FROM crm_banco.clientes
WHERE estado = 'activo';

-- ===============================================
-- 2.2 NUEVOS CLIENTES (ÚLTIMO MES)
-- ===============================================
SELECT COUNT(*) AS nuevos_clientes
FROM crm_banco.clientes
WHERE agregado_en >= (CURRENT_DATE - INTERVAL '30 days')
  AND estado = 'activo';

-- ===============================================
-- 2.3 CLIENTES CON VENTAS
-- ===============================================
SELECT COUNT(DISTINCT id_cliente) AS clientes_con_ventas
FROM crm_banco.ventas
WHERE estado = 'activo';

-- ===============================================
-- 2.4 DISTRIBUCIÓN POR TIPO DE DOCUMENTO
-- ===============================================
SELECT 
    td.nombre_documento,
    COUNT(c.id) AS cantidad_clientes
FROM crm_banco.clientes c
JOIN crm_banco.tipo_documentos td ON c.id_tipo_documento = td.id
WHERE c.estado = 'activo'
GROUP BY td.nombre_documento
ORDER BY cantidad_clientes DESC;
