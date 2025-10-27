CREATE SCHEMA IF NOT EXISTS crm_banco;

CREATE TABLE IF NOT EXISTS crm_banco.roles (
    id SERIAL PRIMARY KEY,
    nombre_rol VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    agregado_por VARCHAR(100),
    agregado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_por VARCHAR(100),
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) DEFAULT 'activo'
);

CREATE TABLE IF NOT EXISTS crm_banco.usuarios (
    id SERIAL PRIMARY KEY,
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
        REFERENCES crm_banco.roles(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS crm_banco.ejecutivos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    agregado_por VARCHAR(100),
    agregado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    actualizado_por VARCHAR(100),
    actualizado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado VARCHAR(20) DEFAULT 'activo'
);

CREATE TABLE IF NOT EXISTS crm_banco.clientes (
    id SERIAL PRIMARY KEY,
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
    id SERIAL PRIMARY KEY,
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
        REFERENCES crm_banco.clientes(id) ON DELETE CASCADE,
    CONSTRAINT fk_visita_ejecutivo FOREIGN KEY (id_ejecutivo) 
        REFERENCES crm_banco.ejecutivos(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS crm_banco.ventas (
    id SERIAL PRIMARY KEY, 
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
        REFERENCES crm_banco.clientes(id) ON DELETE RESTRICT,
    CONSTRAINT chk_monto_positivo CHECK (monto > 0)
);

-- ========= CONFIGURACIÓN ADICIONAL =========
-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_visitas_cliente ON crm_banco.visitas(id_cliente);
CREATE INDEX idx_visitas_ejecutivo ON crm_banco.visitas(id_ejecutivo);
CREATE INDEX idx_visitas_fecha ON crm_banco.visitas(fecha_visita);
CREATE INDEX idx_ventas_cliente ON crm_banco.ventas(id_cliente);
CREATE INDEX idx_ventas_fecha ON crm_banco.ventas(fecha_venta);
CREATE INDEX idx_usuarios_email ON crm_banco.usuarios(email);
CREATE INDEX idx_usuarios_username ON crm_banco.usuarios(username);
CREATE INDEX idx_usuarios_rol ON crm_banco.usuarios(id_rol);

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

CREATE TRIGGER trg_actualizar_timestamp_roles
    BEFORE UPDATE ON crm_banco.roles
    FOR EACH ROW EXECUTE FUNCTION crm_banco.fn_actualizar_timestamp();

