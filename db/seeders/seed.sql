-- ========= SEEDERS PARA CRM BANCO DE RESERVAS =========
-- Limpiar datos existentes (opcional, comentar en producción)
-- TRUNCATE TABLE crm_banco.ventas CASCADE;
-- TRUNCATE TABLE crm_banco.visitas CASCADE;
-- TRUNCATE TABLE crm_banco.clientes CASCADE;
-- TRUNCATE TABLE crm_banco.ejecutivos CASCADE;
-- TRUNCATE TABLE crm_banco.usuarios CASCADE;

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

-- ========= INSERTAR CLIENTES =========
INSERT INTO crm_banco.clientes (nombre, apellido, direccion, telefono, agregado_por, estado) VALUES
-- Clientes Corporativos/Empresariales
('Grupo Industrial', 'Dominicano SA', 'Av. Winston Churchill 1099, Torre Citigroup', '809-555-0101', 'sistema', 'activo'),
('Constructora', 'Del Este SRL', 'Av. Abraham Lincoln 1003, Piantini', '809-555-0102', 'sistema', 'activo'),
('Importadora', 'Caribe SA', 'Av. 27 de Febrero 421, Naco', '809-555-0103', 'sistema', 'activo'),
('Distribuidora', 'Nacional SRL', 'Av. Sarasota 39, Bella Vista', '809-555-0104', 'sistema', 'activo'),
('Tecnología', 'Avanzada SA', 'Av. Gustavo Mejía Ricart 102, Ensanche Julieta', '809-555-0105', 'sistema', 'activo'),
('Farmacia', 'Central SRL', 'Av. Independencia 2253, Gazcue', '809-555-0106', 'sistema', 'activo'),
('Supermercados', 'Unidos SA', 'Av. John F. Kennedy Km 5½', '809-555-0107', 'sistema', 'activo'),
('Textiles', 'Del Sur SRL', 'Av. Máximo Gómez 72, Villa Juana', '809-555-0108', 'sistema', 'activo'),
('Agroindustrial', 'Dominicana SA', 'Av. Los Próceres, Arroyo Hondo', '809-555-0109', 'sistema', 'activo'),
('Hotelera', 'Del Caribe SA', 'Av. George Washington 500, Malecón', '809-555-0110', 'sistema', 'activo'),

-- Clientes Personas Físicas
('Rafael', 'Estrella Pérez', 'C/ El Conde 203, Zona Colonial', '809-555-0201', 'sistema', 'activo'),
('Cristina', 'Marte González', 'Av. Roberto Pastoriza 420, Naco', '809-555-0202', 'sistema', 'activo'),
('Fernando', 'Báez Rodríguez', 'C/ José Contreras 85, Gazcue', '809-555-0203', 'sistema', 'activo'),
('Lucía', 'Vásquez Díaz', 'Av. Anacaona 101, Bella Vista', '809-555-0204', 'sistema', 'activo'),
('Alberto', 'Mejía Santos', 'Av. Núñez de Cáceres 303, El Millón', '809-555-0205', 'sistema', 'activo'),
('Sandra', 'Peña Martínez', 'C/ Caonabo 33, Gascue', '809-555-0206', 'sistema', 'activo'),
('Diego', 'Hernández López', 'Av. Rómulo Betancourt 1512, Bella Vista', '809-555-0207', 'sistema', 'activo'),
('Valentina', 'Acosta Méndez', 'Av. Tiradentes 14, Naco', '809-555-0208', 'sistema', 'activo'),
('Andrés', 'Guerrero Pérez', 'C/ Santiago 153, Gazcue', '809-555-0209', 'sistema', 'activo'),
('Carolina', 'Rosario Gil', 'Av. Abraham Lincoln 605, Piantini', '809-555-0210', 'sistema', 'activo'),
('Manuel', 'Cabrera Torres', 'Av. Las Américas Km 11, Santo Domingo Este', '809-555-0211', 'sistema', 'activo'),
('Isabella', 'Polanco Cruz', 'C/ Paseo de los Locutores 31, Piantini', '809-555-0212', 'sistema', 'activo'),
('Alejandro', 'Medina Vargas', 'Av. España 65, Villa Duarte', '809-555-0213', 'sistema', 'activo'),
('Gabriela', 'Santana Ruiz', 'C/ Arzobispo Meriño 302, Zona Colonial', '809-555-0214', 'sistema', 'activo'),
('Ricardo', 'Castillo Matos', 'Av. Bolívar 507, Gazcue', '809-555-0215', 'sistema', 'activo'),
('Natalia', 'Fernández Ramos', 'Av. Francia 125, Gazcue', '809-555-0216', 'sistema', 'activo'),
('Sebastián', 'Rivera Álvarez', 'C/ Luis F. Thomen 110, Evaristo Morales', '809-555-0217', 'sistema', 'activo'),
('Victoria', 'Guzmán Espinal', 'Av. Lope de Vega 29, Naco', '809-555-0218', 'sistema', 'activo'),
('Eduardo', 'Domínguez Soto', 'C/ César Nicolás Penson 70, Gazcue', '809-555-0219', 'sistema', 'activo'),
('Camila', 'Pimentel Ortiz', 'Av. 27 de Febrero 247, El Vergel', '809-555-0220', 'sistema', 'activo'),
('Jorge', 'Valdez Luna', 'C/ Mercedes 505, Zona Colonial', '809-555-0221', 'sistema', 'activo'),
('Mariana', 'Cuevas Brito', 'Av. Mirador Sur 8, Mirador Sur', '809-555-0222', 'sistema', 'activo'),
('Pablo', 'Romero Félix', 'C/ Gustavo Mejía Ricart 74, Piantini', '809-555-0223', 'sistema', 'activo'),
('Elena', 'Suárez Montero', 'Av. Pedro Henríquez Ureña 137, La Esperilla', '809-555-0224', 'sistema', 'activo'),
('Rodrigo', 'Herrera Castro', 'C/ Fantino Falco 48, Naco', '809-555-0225', 'sistema', 'activo');

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



