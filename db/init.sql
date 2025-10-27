
CREATE SCHEMA IF NOT EXISTS crm_banco;


CREATE TABLE IF NOT EXISTS crm_banco.roles (
    id_rol SERIAL PRIMARY KEY,
    nombre_rol VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    agregado_por VARCHAR(100),
    agregado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_por VARCHAR(100),
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) DEFAULT 'activo'
);


CREATE TABLE IF NOT EXISTS crm_banco.usuarios (
    id_usuario SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    salt VARCHAR(100) NOT NULL,
    id_rol INTEGER NOT NULL,
    telefono VARCHAR(20),
    avatar_url TEXT,
    ultimo_acceso TIMESTAMP,
    intentos_fallidos INTEGER DEFAULT 0,
    bloqueado_hasta TIMESTAMP,
    token_reset_password VARCHAR(255),
    token_reset_expira TIMESTAMP,
    debe_cambiar_password BOOLEAN DEFAULT false,
    fecha_ultimo_cambio_password TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    agregado_por VARCHAR(100) NOT NULL,
    agregado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_por VARCHAR(100),
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) DEFAULT 'activo',
    CONSTRAINT fk_usuario_rol FOREIGN KEY (id_rol) 
        REFERENCES crm_banco.roles(id_rol) ON DELETE RESTRICT
);


CREATE TABLE IF NOT EXISTS crm_banco.ejecutivos (
    id_ejecutivo SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    agregado_por VARCHAR(100),
    agregado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_por VARCHAR(100),
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) DEFAULT 'activo'
);


CREATE TABLE IF NOT EXISTS crm_banco.clientes (
    id_cliente SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    direccion TEXT,
    telefono VARCHAR(20),
    agregado_por VARCHAR(100),
    agregado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_por VARCHAR(100),
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) DEFAULT 'activo'
);


CREATE TABLE IF NOT EXISTS crm_banco.visitas (
    id_visita SERIAL PRIMARY KEY,
    id_cliente INTEGER NOT NULL,
    id_ejecutivo INTEGER NOT NULL,
    fecha_visita TIMESTAMP NOT NULL,
    resultado VARCHAR(200),
    agregado_por VARCHAR(100),
    agregado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_por VARCHAR(100),
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) DEFAULT 'activo',
    CONSTRAINT fk_visita_cliente FOREIGN KEY (id_cliente) 
        REFERENCES crm_banco.clientes(id_cliente) ON DELETE CASCADE,
    CONSTRAINT fk_visita_ejecutivo FOREIGN KEY (id_ejecutivo) 
        REFERENCES crm_banco.ejecutivos(id_ejecutivo) ON DELETE RESTRICT
);


CREATE TABLE IF NOT EXISTS crm_banco.ventas (
    id_venta SERIAL PRIMARY KEY, 
    id_cliente INTEGER NOT NULL,
    fecha_venta TIMESTAMP NOT NULL,
    monto DECIMAL(12,2) NOT NULL,
    producto VARCHAR(100) NOT NULL,
    agregado_por VARCHAR(100),
    agregado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_por VARCHAR(100),
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) DEFAULT 'activo',
    CONSTRAINT fk_venta_cliente FOREIGN KEY (id_cliente) 
        REFERENCES crm_banco.clientes(id_cliente) ON DELETE RESTRICT,
    CONSTRAINT chk_monto_positivo CHECK (monto > 0)
);






--! ========= aLGUNAS cONFIG para 
-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_visitas_cliente ON crm_banco.visitas(id_cliente);
CREATE INDEX idx_visitas_ejecutivo ON crm_banco.visitas(id_ejecutivo);
CREATE INDEX idx_visitas_fecha ON crm_banco.visitas(fecha_visita);
CREATE INDEX idx_ventas_cliente ON crm_banco.ventas(id_cliente);
CREATE INDEX idx_ventas_fecha ON crm_banco.ventas(fecha_venta);
CREATE INDEX idx_usuarios_email ON crm_banco.usuarios(email);
CREATE INDEX idx_usuarios_username ON crm_banco.usuarios(username);

-- Insertar roles básicos
INSERT INTO crm_banco.roles (nombre_rol, descripcion, agregado_por) VALUES
('administrador', 'Acceso total al sistema', 'sistema'),
('gerente', 'Acceso a reportes y supervisión', 'sistema'),
('ejecutivo', 'Acceso a gestión de clientes', 'sistema'),
('auditor', 'Acceso solo lectura', 'sistema');

-- Crear función para auditoría automática de actualización
CREATE OR REPLACE FUNCTION crm_banco.fn_actualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.actualizado_en = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear triggers para actualización automática de timestamp
CREATE TRIGGER trg_actualizar_timestamp_usuarios
    BEFORE UPDATE ON crm_banco.usuarios
    FOR EACH ROW EXECUTE FUNCTION crm_banco.fn_actualizar_timestamp();

CREATE TRIGGER trg_actualizar_timestamp_clientes
    BEFORE UPDATE ON crm_banco.clientes
    FOR EACH ROW EXECUTE FUNCTION crm_banco.fn_actualizar_timestamp();

CREATE TRIGGER trg_actualizar_timestamp_ejecutivos
    BEFORE UPDATE ON crm_banco.ejecutivos
    FOR EACH ROW EXECUTE FUNCTION crm_banco.fn_actualizar_timestamp();

CREATE TRIGGER trg_actualizar_timestamp_visitas
    BEFORE UPDATE ON crm_banco.visitas
    FOR EACH ROW EXECUTE FUNCTION crm_banco.fn_actualizar_timestamp();

CREATE TRIGGER trg_actualizar_timestamp_ventas
    BEFORE UPDATE ON crm_banco.ventas
    FOR EACH ROW EXECUTE FUNCTION crm_banco.fn_actualizar_timestamp();

-- Comentarios en las tablas
COMMENT ON TABLE crm_banco.clientes IS 'Tabla de clientes del banco';
COMMENT ON TABLE crm_banco.ejecutivos IS 'Tabla de ejecutivos de cuenta';
COMMENT ON TABLE crm_banco.visitas IS 'Registro de visitas de ejecutivos a clientes';
COMMENT ON TABLE crm_banco.ventas IS 'Registro de ventas realizadas';
COMMENT ON TABLE crm_banco.usuarios IS 'Usuarios del sistema con credenciales de acceso';
COMMENT ON TABLE crm_banco.roles IS 'Roles y permisos del sistema';