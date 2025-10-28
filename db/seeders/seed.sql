-- ========= SEEDERS PARA CRM BANCO DE RESERVAS =========

-- ========= INSERTAR EJECUTIVOS =========
INSERT INTO crm_banco.ejecutivos (nombre, apellido, agregado_por, estado) VALUES
('Juan Carlos', 'Martínez', 'sistema', 'activo'),
('María Isabel', 'Rodríguez', 'sistema', 'activo'),
('Pedro Antonio', 'González', 'sistema', 'activo'),
('Ana Lucía', 'Pérez', 'sistema', 'activo'),
('Roberto José', 'Sánchez', 'sistema', 'activo'),
('Carmen Teresa', 'Díaz', 'sistema', 'activo'),
('Miguel Ángel', 'Ramírez', 'sistema', 'activo'),
('Laura Cristina', 'Jiménez', 'sistema', 'activo'),
('Francisco Javier', 'Torres', 'sistema', 'activo'),
('Patricia Elena', 'Vargas', 'sistema', 'activo'),
('Luis Alberto', 'Castillo', 'sistema', 'activo'),
('Sofía Alejandra', 'Morales', 'sistema', 'activo'),
('Carlos Eduardo', 'Herrera', 'sistema', 'activo'),
('Daniela María', 'Silva', 'sistema', 'activo'),
('José Manuel', 'Reyes', 'sistema', 'activo');



-- ========= INSERTAR TIPOS DE DOCUMENTOS =========
INSERT INTO crm_banco.tipo_documentos (nombre_documento, descripcion, agregado_por, estado) VALUES
('CED', 'Documento nacional de identidad', 'sistema', 'activo'),
('PAS', 'Documento de viaje internacional', 'sistema', 'activo'),
('RNC', 'Registro Nacional de Contribuyentes para empresas', 'sistema', 'activo');

-- ========= INSERTAR CLIENTES CON TIPO DE DOCUMENTO =========
INSERT INTO crm_banco.clientes (nombre, apellido, id_tipo_documento, documento, direccion, telefono, agregado_por, estado) VALUES
-- Clientes Corporativos/Empresariales (usamos RNC)
('Grupo Industrial', 'Dominicano SA', 3, '131234567', 'Av. Winston Churchill 1099, Torre Citigroup', '809-555-0101', 'sistema', 'activo'),
('Constructora', 'Del Este SRL', 3, '131234568', 'Av. Abraham Lincoln 1003, Piantini', '809-555-0102', 'sistema', 'activo'),
('Importadora', 'Caribe SA', 3, '131234569', 'Av. 27 de Febrero 421, Naco', '809-555-0103', 'sistema', 'activo'),
('Distribuidora', 'Nacional SRL', 3, '131234570', 'Av. Sarasota 39, Bella Vista', '809-555-0104', 'sistema', 'activo'),
('Tecnología', 'Avanzada SA', 3, '131234571', 'Av. Gustavo Mejía Ricart 102, Ensanche Julieta', '809-555-0105', 'sistema', 'activo'),

-- Clientes Personas Físicas
('John', 'Smith', 2, 'P1234567', '123 Main St, New York, USA', '1-212-555-0101', 'sistema', 'activo'),
('Rafael', 'Estrella Pérez', 1, '00123456789', 'C/ El Conde 203, Zona Colonial', '809-555-0201', 'sistema', 'activo'),

('Fernando', 'Báez Rodríguez', 1, '00123456791', 'C/ José Contreras 85, Gazcue', '809-555-0203', 'sistema', 'activo'),
('Lucía', 'Vásquez Díaz', 1, '00123456792', 'Av. Anacaona 101, Bella Vista', '809-555-0204', 'sistema', 'activo'),
('Alberto', 'Mejía Santos', 1, '00123456793', 'Av. Núñez de Cáceres 303, El Millón', '809-555-0205', 'sistema', 'activo'),
('Noah', 'Jones', 2, 'P5678901', '654 Maple St, Berlin, Germany', '49-30-555-0105', 'sistema', 'activo'),

('Emma', 'Johnson', 2, 'P2345678', '456 Elm St, London, UK', '44-20-555-0102', 'sistema', 'activo'),
('Liam', 'Williams', 2, 'P3456789', '789 Oak St, Toronto, Canada', '1-416-555-0103', 'sistema', 'activo'),
('Cristina', 'Marte González', 1, '00123456790', 'Av. Roberto Pastoriza 420, Naco', '809-555-0202', 'sistema', 'activo'),
('Olivia', 'Brown', 2, 'P4567890', '321 Pine St, Sydney, Australia', '61-2-555-0104', 'sistema', 'activo'),

('Ava', 'Garcia', 2, 'P6789012', '987 Cedar St, Madrid, Spain', '34-91-555-0106', 'sistema', 'activo'),
('Ethan', 'Martinez', 2, 'P7890123', '135 Spruce St, Mexico City, Mexico', '52-55-555-0107', 'sistema', 'activo'),
('Sophia', 'Rodriguez', 2, 'P8901234', '246 Birch St, Buenos Aires, Argentina', '54-11-555-0108', 'sistema', 'activo'),
('Mason', 'Lopez', 2, 'P9012345', '357 Walnut St, Lima, Peru', '51-1-555-0109', 'sistema', 'activo'),
('Isabella', 'Gonzalez', 2, 'P0123456', '468 Chestnut St, Santiago, Chile', '56-2-555-0110', 'sistema', 'activo');






-- ========= INSERTAR USUARIOS (vinculados a ejecutivos) =========
-- Generar passwords hash de ejemplo (en producción usar bcrypt real)
INSERT INTO crm_banco.usuarios (username, email, password_hash, salt, id_rol, telefono, agregado_por, estado) VALUES
('jmartinez', 'jmartinez@banreservas.com', '$2b$10$YourHashHere1', 'salt1', 3, '809-555-1001', 'sistema', 'activo'),
('mrodriguez', 'mrodriguez@banreservas.com', '$2b$10$YourHashHere2', 'salt2', 3, '809-555-1002', 'sistema', 'activo'),
('pgonzalez', 'pgonzalez@banreservas.com', '$2b$10$YourHashHere3', 'salt3', 3, '809-555-1003', 'sistema', 'activo'),
('aperez', 'aperez@banreservas.com', '$2b$10$YourHashHere4', 'salt4', 3, '809-555-1004', 'sistema', 'activo'),
('rsanchez', 'rsanchez@banreservas.com', '$2b$10$YourHashHere5', 'salt5', 3, '809-555-1005', 'sistema', 'activo'),
('cdiaz', 'cdiaz@banreservas.com', '$2b$10$YourHashHere6', 'salt6', 3, '809-555-1006', 'sistema', 'activo'),
('mramirez', 'mramirez@banreservas.com', '$2b$10$YourHashHere7', 'salt7', 3, '809-555-1007', 'sistema', 'activo'),
('ljimenez', 'ljimenez@banreservas.com', '$2b$10$YourHashHere8', 'salt8', 3, '809-555-1008', 'sistema', 'activo'),
('ftorres', 'ftorres@banreservas.com', '$2b$10$YourHashHere9', 'salt9', 2, '809-555-1009', 'sistema', 'activo'),
('pvargas', 'pvargas@banreservas.com', '$2b$10$YourHashHere10', 'salt10', 2, '809-555-1010', 'sistema', 'activo'),
('admin', 'admin@banreservas.com', '$2b$10$YourHashHere11', 'salt11', 1, '809-555-1011', 'sistema', 'activo'),
('auditor', 'auditor@banreservas.com', '$2b$10$YourHashHere12', 'salt12', 4, '809-555-1012', 'sistema', 'activo');

-- ========= INSERTAR VISITAS (últimos 6 meses) =========
INSERT INTO crm_banco.visitas (id_cliente, id_ejecutivo, fecha_visita, resultado, agregado_por, estado) 
SELECT 
    c.id,
    e.id,
    timestamp '2024-06-01' + (random() * (timestamp '2024-12-31' - timestamp '2024-06-01')),
    CASE (random() * 5)::INT
        WHEN 0 THEN 'Visita exitosa - Cliente interesado en productos'
        WHEN 1 THEN 'Visita completada - Documentación entregada'
        WHEN 2 THEN 'Cliente no disponible - Reagendar'
        WHEN 3 THEN 'Presentación de productos realizada'
        WHEN 4 THEN 'Visita exitosa - Posible venta'
        ELSE 'Seguimiento requerido'
    END,
    'sistema',
    'activo'
FROM 
    (SELECT id FROM crm_banco.clientes ORDER BY random() LIMIT 35) c
CROSS JOIN 
    (SELECT id FROM crm_banco.ejecutivos ORDER BY random() LIMIT 15) e
WHERE random() < 0.3;

-- Agregar más visitas para algunos ejecutivos específicos (productividad variable)
INSERT INTO crm_banco.visitas (id_cliente, id_ejecutivo, fecha_visita, resultado, agregado_por, estado)
SELECT 
    (SELECT id FROM crm_banco.clientes ORDER BY random() LIMIT 1),
    ejecutivo_id,
    fecha,
    resultado,
    'sistema',
    'activo'
FROM (
    SELECT 
        (random() * 14 + 1)::INT as ejecutivo_id,
        timestamp '2024-10-01' + (random() * interval '90 days') as fecha,
        CASE (random() * 3)::INT
            WHEN 0 THEN 'Visita exitosa - Venta cerrada'
            WHEN 1 THEN 'Visita exitosa - Cliente satisfecho'
            ELSE 'Presentación completada'
        END as resultado
    FROM generate_series(1, 150)
) AS generated_visits;

-- ========= INSERTAR VENTAS =========
-- Ventas relacionadas con visitas exitosas
INSERT INTO crm_banco.ventas (id_cliente, fecha_venta, monto, producto, agregado_por, estado)
SELECT DISTINCT ON (v.id_cliente, date_trunc('day', v.fecha_visita))
    v.id_cliente,
    v.fecha_visita + interval '1 day' * (random() * 7)::INT,
    (random() * 50000 + 5000)::DECIMAL(12,2),
    CASE (random() * 7)::INT
        WHEN 0 THEN 'Préstamo Personal'
        WHEN 1 THEN 'Tarjeta de Crédito Gold'
        WHEN 2 THEN 'Cuenta de Ahorros Premium'
        WHEN 3 THEN 'Certificado Financiero'
        WHEN 4 THEN 'Préstamo Vehicular'
        WHEN 5 THEN 'Tarjeta de Crédito Platinum'
        WHEN 6 THEN 'Seguro de Vida'
        ELSE 'Inversión a Plazo Fijo'
    END,
    'sistema',
    'activo'
FROM crm_banco.visitas v
WHERE v.resultado LIKE '%exitosa%' OR v.resultado LIKE '%Venta%'
ORDER BY v.id_cliente, date_trunc('day', v.fecha_visita), random();

-- Agregar ventas adicionales para algunos clientes frecuentes
INSERT INTO crm_banco.ventas (id_cliente, fecha_venta, monto, producto, agregado_por, estado)
SELECT 
    c.id,
    timestamp '2024-09-01' + (random() * interval '120 days'),
    (random() * 100000 + 10000)::DECIMAL(12,2),
    CASE (random() * 5)::INT
        WHEN 0 THEN 'Préstamo Hipotecario'
        WHEN 1 THEN 'Línea de Crédito Empresarial'
        WHEN 2 THEN 'Préstamo PYME'
        WHEN 3 THEN 'Factoring'
        WHEN 4 THEN 'Leasing Vehicular'
        ELSE 'Cuenta Corriente Empresarial'
    END,
    'sistema',
    'activo'
FROM crm_banco.clientes c
WHERE c.nombre LIKE '%Grupo%' OR c.nombre LIKE '%Empresa%' OR c.nombre LIKE '%Constructora%'
ORDER BY random()
LIMIT 20;



