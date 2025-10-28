# Manual de Usuario - Sistema CRM Banco de Reservas
## Integración y Reporte de Actividad Comercial

**Versión:** 1.0  
**Fecha:** Octubre 2025  
**Propósito:** Manual técnico para instalación, configuración y uso del sistema CRM

---

## 📋 Tabla de Contenidos

1. [Introducción](#1-introducción)
2. [Requisitos del Sistema](#2-requisitos-del-sistema)
3. [Instalación y Configuración](#3-instalación-y-configuración)
4. [Arquitectura de la Solución](#4-arquitectura-de-la-solución)
5. [Parte 1: Consultas SQL](#5-parte-1-consultas-sql)
6. [Parte 2: Proceso ETL](#6-parte-2-proceso-etl)◊
7. [Parte 3: Reportes y KPIs](#7-parte-3-reportes-y-kpis)
8. [Parte 4: API REST](#8-parte-4-api-rest)
9. [Anexos](#9-anexos)
10. [Conclusión](#10-Conclusión)

---

## 1. Introducción

### 1.1 Descripción del Proyecto

Este proyecto implementa una solución integral para la gestión de actividad comercial en el CRM del Banco de Reservas, integrando datos de visitas, ventas y ejecutivos desde múltiples fuentes de datos.

### 1.2 Alcance

La solución cubre:
-  Integración de datos de PostgreSQL y archivos CSV/Excel
-  Consultas analíticas de productividad
-  Proceso ETL automatizado con validaciones
-  API REST para consumo de datos
-  Reportes parametrizados con KPIs

### 1.3 Stack Tecnológico

| Componente | Tecnología |
|------------|------------|
| Backend | NestJS + TypeScript |
| Base de Datos | PostgreSQL 14+ |
| ORM | TypeORM |
| Autenticación | JWT |
| Documentación API | Swagger/OpenAPI |
| ETL | Node.js + CSV Parser |

---

## 2. Requisitos del Sistema

### 2.1 Requisitos de Software

**Obligatorios:**
- Node.js v18.0.0 o superior
- npm v9.0.0 o superior
- PostgreSQL 14 o superior
- Git

**Opcionales:**
- Postman o Insomnia (para pruebas de API)
- Visual Studio Code (IDE recomendado)
- pgAdmin 4 (cliente gráfico para PostgreSQL)

### 2.2 Requisitos de Hardware

**Mínimos:**
- CPU: 2 cores
- RAM: 4 GB
- Disco: 10 GB disponibles

**Recomendados:**
- CPU: 4 cores
- RAM: 8 GB
- Disco: 20 GB disponibles

---

## 3. Instalación y Configuración

### 3.1 Clonar el Repositorio

```bash
git clone https://github.com/memo2898/crm_banreservas.git

```

### 3.2 Instalar Dependencias

```bash
npm install
```

### 3.3 Configuración de Base de Datos

#### 3.3.1 Crear Base de Datos

**Paso 1:** Conectarse a PostgreSQL como usuario postgres:

```bash
# Linux/Mac
psql -U postgres

# Windows (desde cmd)
psql -U postgres
```

**Paso 2:** Crear la base de datos:

```sql
CREATE DATABASE crm_banreservas;
```

**Paso 3:** Salir y conectarse a la nueva base de datos:

```bash
\q
psql -U postgres -d crm_banreservas
```

#### 3.3.2 Ejecutar Scripts en Orden

⚠️ **IMPORTANTE:** Los scripts deben ejecutarse en este orden exacto:

**1. Crear Estructura de Tablas** (`db/init.sql`)


```bash
psql -U postgres -d crm_banreservas -f db/init.sql
```
Manualmente puedes ir a la ruta: db/init.sql y copiar y pegar el codigo

Este script crea todas las tablas:
- Clientes
- Ejecutivos
- Visitas
- Ventas
- Usuarios
- Roles
- TipoDocumentos

**2. Insertar Datos Semilla** (`db/seeders/seed.sql`)

```bash
psql -U postgres -d crm_banreservas -f db/seeders/seed.sql
```

Manualmente puedes ir a la ruta: `db/seeders/seed.sql y copiar y pegar el codigo

Este script carga datos de prueba en todas las tablas.

**3. Crear Stored Procedures** (archivos en `db/stored_procedures/`)

```bash
# Ejecutar cada procedimiento almacenado
psql -U postgres -d crm_banreservas -f db/stored_procedures/1_sp_productividad.sql
psql -U postgres -d crm_banreservas -f db/stored_procedures/2_sp_kpis_dashboard.sql
```

**4. Crear Funciones de Reportes** (archivos en `db/reports/`)

```bash
# Ejecutar cada función de reporte
psql -U postgres -d crm_banreservas -f db/reports/kpi_clientes.sql
psql -U postgres -d crm_banreservas -f db/reports/kpi_ventas.sql
psql -U postgres -d crm_banreservas -f db/reports/kpi_visistas_ejecutivos.sql
```

#### 3.3.3 Verificar Instalación de BD

```sql
-- Conectarse a la base de datos
psql -U postgres -d crm_banreservas

-- Listar todas las tablas
\dt

-- Verificar datos
SELECT COUNT(*) FROM clientes;
SELECT COUNT(*) FROM ejecutivos;
SELECT COUNT(*) FROM visitas;
SELECT COUNT(*) FROM ventas;

-- Listar stored procedures
\df

-- Salir
\q
```

#### 3.3.4 Script Completo (Alternativa)

Si prefieres ejecutar todo de una vez desde la terminal:

```bash
# Crear base de datos
createdb -U postgres crm_banreservas

# Ejecutar todos los scripts en orden
psql -U postgres -d crm_banreservas -f db/init.sql
psql -U postgres -d crm_banreservas -f db/seeders/seed.sql
psql -U postgres -d crm_banreservas -f db/stored_procedures/1_sp_productividad.sql
psql -U postgres -d crm_banreservas -f db/stored_procedures/2_sp_kpis_dashboard.sql
psql -U postgres -d crm_banreservas -f db/reports/kpi_clientes.sql
psql -U postgres -d crm_banreservas -f db/reports/kpi_ventas.sql
psql -U postgres -d crm_banreservas -f db/reports/kpi_visistas_ejecutivos.sql

echo "Base de datos configurada exitosamente"
```

### 3.4 Configuración de Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# ==============================================
# CONFIGURACIÓN DE BASE DE DATOS POSTGRESQL
# ==============================================
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tucontrasena
DB_DATABASE=crm_banreservas

# Configuración adicional de TypeORM
DB_SYNCHRONIZE=false
DB_LOGGING=false

# ==============================================
# CONFIGURACIÓN DE AUTENTICACIÓN JWT
# ==============================================
JWT_SECRET=@@banreservas_crm_prueba_tecnica@@
JWT_EXPIRES_IN=24h

# ==============================================
# CONFIGURACIÓN DEL SERVIDOR
# ==============================================
PORT=3002
NODE_ENV=development
```

**IMPORTANTE:** Cambia `JWT_SECRET` y `DB_PASSWORD` por valores seguros en producción.

### 3.5 Iniciar el Backend (NestJS)

#### 3.5.1 Instalación de Dependencias

Primero, asegúrate de instalar todas las dependencias del proyecto:

```bash
# Desde la raíz del proyecto
npm install
```

Esto instalará:
- NestJS y sus módulos
- TypeORM para PostgreSQL
- Dependencias de autenticación (JWT, Passport)
- Librerías para manejo de archivos CSV
- Validadores y transformadores de datos
- Todas las demás dependencias necesarias

#### 3.5.2 Compilar el Proyecto

NestJS usa TypeScript, por lo que necesitas compilar antes de ejecutar en producción:

```bash
npm run build
```

Esto genera la carpeta `dist/` con el código JavaScript compilado.

#### 3.5.3 Modos de Ejecución

**Modo Desarrollo (Recomendado para pruebas):**

```bash
nest start --watch
```

**Características del modo desarrollo:**
-  Auto-reload cuando cambias código
-  Logs detallados en consola
-  Muestra errores completos con stack trace
-  No requiere compilación manual

**Salida esperada:**
```
[Nest] 21574  - 10/27/2025, 10:39:29 PM     LOG [RouterExplorer] Mapped {/api/tipo-documentos/:id, GET} route +0ms
[Nest] 21574  - 10/27/2025, 10:39:29 PM     LOG [RouterExplorer] Mapped {/api/tipo-documentos/:id, PATCH} route +0ms
[Nest] 21574  - 10/27/2025, 10:39:29 PM     LOG [RouterExplorer] Mapped {/api/tipo-documentos/:id, DELETE} route +0ms
[Nest] 21574  - 10/27/2025, 10:39:29 PM     LOG [NestApplication] Nest application successfully started +3ms
Aplicación ejecutándose en: http://[::1]:3002
Documentación Swagger UI: http://[::1]:3002/api
Swagger JSON: http://[::1]:3002/api/docs-json/swagger.json
Swagger YAML: http://[::1]:3002/api/docs-json/swagger.yaml

```

**Modo Producción:**

```bash
# Primero compilar
npm run build

# Luego ejecutar
npm run start:prod
```

**Modo Normal (sin watch):**

```bash
npm run start
```

#### 3.5.4 Verificar que el Backend está Corriendo

Una vez iniciado, verifica en tu navegador o con curl:

**1. Health Check:**
```bash
curl http://localhost:3002/api
```



**2. Documentación Swagger:**

Abre en tu navegador:
```
http://localhost:3002/api
```

Deberías ver la interfaz de Swagger con todos los endpoints documentados.

**3. Verificar Conexión a Base de Datos:**

Si ves este mensaje en los logs, la conexión es exitosa:
```
[TypeOrmModule] TypeORM dependencies initialized
```

Si hay error de conexión, verás:
```
[TypeOrmModule] Unable to connect to the database
```

#### 3.5.5 Estructura de Logs

El backend mostrará logs de:
-  **Inicialización** de módulos
-  **Rutas** registradas
-  **Peticiones** HTTP entrantes
-  **Errores** si ocurren
-  **Conexión** a base de datos

#### 3.5.6 Detener el Backend

Para detener el servidor:
- Presiona `Ctrl + C` en la terminal

### 3.6 Verificar Instalación

Una vez iniciada la aplicación, verifica:

1. **API funcionando:**
   ```
   http://localhost:3002
   ```

2. **Documentación Swagger:**
   ```
   http://localhost:3002/api
   ```


## 4. Arquitectura de la Solución

### 4.1 Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│                    CAPA DE PRESENTACIÓN                  │
│  ┌──────────────┐  ┌──────────────┐                    │
│  │  Swagger UI  │  │  Aplicaciones│                    │
│  └──────────────┘  └──────────────┘                    │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────┴────────────────────────────────┐
│                    CAPA DE APLICACIÓN                    │
│  ┌─────────────────────────────────────────────────┐   │
│  │              API REST (NestJS)                   │   │
│  ├──────────┬──────────┬──────────┬─────────────────┤   │
│  │ Autenti- │   ETL    │Productiv.│    Reportes     │   │
│  │ cación   │ Service  │ Service  │    Service      │   │
│  └──────────┴──────────┴──────────┴─────────────────┘   │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────┴────────────────────────────────┐
│                    CAPA DE DATOS                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │         PostgreSQL (crm_banreservas)            │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐      │   │
│  │  │ Clientes │  │ Visitas  │  │  Ventas  │      │   │
│  │  └──────────┘  └──────────┘  └──────────┘      │   │
│  │  ┌──────────┐  ┌──────────────────────┐        │   │
│  │  │Ejecutivos│  │  Stored Procedures   │        │   │
│  │  └──────────┘  └──────────────────────┘        │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
        ▲
        │
┌───────┴────────┐
│  Archivos CSV  │
│  /excel_csv    │
└────────────────┘
```

### 4.2 Estructura de Módulos

```
api-crm-banreservas/
├── src/
│   ├── auth/              # Autenticación JWT
│   ├── clientes/          # Gestión de clientes
│   ├── ejecutivos/        # Gestión de ejecutivos
│   ├── visitas/           # Gestión de visitas
│   ├── ventas/            # Gestión de ventas
│   ├── etl/               # Proceso ETL
│   ├── productividad/     # Análisis de productividad
│   ├── reportes/          # Generación de reportes
│   ├── usuarios/          # Gestión de usuarios
│   ├── roles/             # Gestión de roles
│   └── tipo_documentos/   # Catálogo de tipos de documento
├── db/
│   ├── init.sql           # Creación de tablas
│   ├── seeders/           # Datos de prueba
│   ├── stored_procedures/ # Procedimientos almacenados
│   └── reports/           # Consultas de reportes
└── excel_csv/             # Archivos CSV de entrada
```

### 4.3 Modelo de Datos

#### Diagrama Entidad-Relación

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│  Clientes   │         │  Ejecutivos │         │   Visitas   │
├─────────────┤         ├─────────────┤         ├─────────────┤
│ IdCliente PK│◄───────┐│IdEjecutivo  │◄───────┐│ IdVisita PK │
│ Nombre      │        ││ PK          │        ││ IdCliente FK│
│ Apellido    │        │└─────────────┘        ││ IdEjecutivo │
│ Direccion   │        │                       ││ FK          │
│ Telefono    │        │                       ││ FechaVisita │
└─────────────┘        │                       ││ Resultado   │
       │               │                       │└─────────────┘
       │               │                       │
       │               │       ┌───────────────┘
       └───────────────┼───────┤
                       │       │
                       │       │
                ┌──────▼───────▼──┐
                │     Ventas      │
                ├─────────────────┤
                │ IdVenta PK      │
                │ IdCliente FK    │
                │ FechaVenta      │
                │ Monto           │
                │ Producto        │
                └─────────────────┘
```

---

## 5. Parte 1: Consultas SQL

### 5.1 Consulta de Productividad por Ejecutivo

**Objetivo:** Combinar tablas para analizar la productividad de cada ejecutivo.

**Ubicación:** `db/stored_procedures/1_sp_productividad.sql`

#### 5.1.1 Descripción de la Consulta

La consulta realiza:
1. JOIN entre Ejecutivos, Visitas, Clientes y Ventas
2. Agrupación por ejecutivo
3. Cálculo de métricas:
   - Total de visitas realizadas
   - Total de ventas cerradas
   - Monto total vendido
   - Tasa de conversión (ventas/visitas)
   - Ticket promedio

#### 5.1.2 Stored Procedure

```sql

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


```

#### 5.1.3 Ejecutar la Consulta

**Método 1: Desde PostgreSQL Management Studio**


-- Productividad de todos los ejecutivos en los últimos 30 días
-- SELECT * FROM crm_banco.sp_analizar_productividad_ejecutivo();

-- Productividad de un ejecutivo específico en un rango de fechas
-- SELECT * FROM crm_banco.sp_analizar_productividad_ejecutivo('2024-01-01', '2024-12-31', 1);

-- Vista simplificada
-- SELECT * FROM crm_banco.sp_productividad_ejecutivo_simple();


**Método 2: Desde la API (ver sección 8.4)**

### 5.1.4 Resultado Esperado

| IdEjecutivo | NombreEjecutivo | TotalVisitas | TotalVentas | MontoTotalVentas | TasaConversion | TicketPromedio |
|-------------|-----------------|--------------|-------------|------------------|----------------|----------------|
| 1 | Juan Pérez | 45 | 32 | 1,250,000.00 | 71.11 | 39,062.50 |
| 2 | María González | 38 | 28 | 980,000.00 | 73.68 | 35,000.00 |

---

## 6. Parte 2: Proceso ETL

### 6.1 Descripción del Proceso ETL

El proceso ETL (Extract, Transform, Load) permite cargar archivos CSV/Excel con ventas de sistemas externos al CRM.

**Características:**
-  Validación de estructura del archivo
-  Detección de registros duplicados
-  Validación de datos (fechas, montos, referencias foráneas)
-  Manejo de errores con reporte detallado
-  Transacciones seguras (rollback en caso de error)
-  Registro de auditoría

### 6.2 Formato del Archivo CSV

**Ubicación de archivos de prueba:** `excel_csv/`

El proyecto incluye dos archivos CSV de ejemplo que puedes usar para probar el ETL:
- `ventas_otro_sistema.csv`
- `ventas_otro_sistema_2.csv`

Estos archivos ya están listos para ser cargados en el sistema.

#### 6.2.1 Estructura Requerida

```csv
id_transaccion,nombre,apellido,tipo_documento,documento,fecha_venta,monto,producto
TX1001,Diego,Rojas,CED,00123456789,2025-11-15,5386.2,PrestamoPersonal
TX1002,AgroindustrialSantaMaria,,RNC,402123457,2025-11-15,4712.48,CuentaAhorro
TX1003,Ana,Gomez,CED,00123456791,2025-11-05,1891.06,CuentaCorriente
```

#### 6.2.2 Especificaciones

| Campo              | Tipo    | Obligatorio | Validaciones                                                        |
| ------------------ | ------- | ----------- | ------------------------------------------------------------------- |
| **id_transaccion** | Texto   |  Sí        | Único, prefijo `"TX"` seguido de número correlativo (ej. `TX1001`)  |
| **nombre**         | Texto   |  Sí        | No vacío, solo letras                                               |
| **apellido**       | Texto   |  Sí        | No vacío, solo letras (si aplica; si es empresa puede quedar vacío) |
| **tipo_documento** | Texto   |  Sí        | Valores permitidos: `CED`, `RNC`, `PAS`                             |
| **documento**      | Texto   |  Sí        | Numérico, longitud adecuada según tipo de documento                 |
| **fecha_venta**    | Fecha   |  Sí        | Formato `YYYY-MM-DD`, no puede ser una fecha futura                 |
| **monto**          | Decimal |  Sí        | Mayor que 0                                                         |
| **producto**       | Texto   |  Sí        | Máximo 100 caracteres                                               |


### 6.3 Ejecutar el Proceso ETL

#### 6.3.1 Preparar el Archivo

El proyecto ya incluye dos archivos CSV listos para usar en la carpeta `excel_csv/`:
- `ventas_otro_sistema.csv`
- `ventas_otro_sistema_2.csv`

Puedes usar cualquiera de estos archivos para probar el proceso ETL.

Si deseas usar tu propio archivo:
1. Coloca tu archivo CSV en la carpeta `excel_csv/`
2. Asegúrate de que cumple con el formato especificado en la sección 6.2.1

#### 6.3.2 Ejecutar vía API

**Endpoint:** `POST /etl/cargar-ventas`

**Método 1: Usando Postman**

```
POST http://localhost:3002/api/etl/ventas/upload

Content-Type: multipart/form-data

Cuerpo:
- file: [Seleccionar archivo CSV]
```

**Método 2: Usando cURL**

Puedes usar cualquiera de los dos archivos CSV disponibles:

```bash
# Opción 1: Usando el primer archivo CSV
curl -X POST http://localhost:3002/api/etl/ventas/upload \
  -H "Authorization: Bearer TU_TOKEN_JWT" \
  -F "file=@excel_csv/ventas_otro_sistema.csv"

# Opción 2: Usando el segundo archivo CSV
curl -X POST http://localhost:3002/api/etl/ventas/upload \
  -H "Authorization: Bearer TU_TOKEN_JWT" \
  -F "file=@excel_csv/ventas_otro_sistema_2.csv"
```

**Método 3: Usando la Documentación Swagger**

1. Abre: `http://localhost:3000/api`
2. Navega a: `ETL > POST /api/etl/ventas/upload`
3. Click en "Try it out"
4. Selecciona tu archivo CSV
5. Click en "Execute"

### 6.4 Respuesta del ETL

#### 6.4.1 Carga Exitosa

```json
{
  "total_registros": 28,
  "exitosos": 26,
  "fallidos": 2,
  "clientes_creados": 20,
  "clientes_actualizados": 6,
  "ventas_creadas": 26,
  "errores": [
    {
      "fila": 0,
      "id_transaccion": "string",
      "error": "string"
    }
  ],
  "tiempo_procesamiento_ms": 1234
}
```

#### 6.4.2 Carga con Errores

Si hay errores críticos, la transacción NO GUARDARÁ:



### 6.5 Validaciones Implementadas

#### 6.5.1 Validaciones de Estructura

-  Archivo debe ser CSV o Excel (.csv, .xlsx)
-  Debe contener las columnas requeridas
-  Tamaño máximo: 5 MB



## 7. Parte 3: Reportes y KPIs

### 7.1 Descripción de Reportes

El sistema incluye reportes parametrizados con KPIs clave del negocio.

### 7.2 KPIs Disponibles

#### 7.2.1 Dashboard Principal

**Endpoint:** `GET /reportes/dashboard`

**KPIs Incluidos:**

| KPI | Descripción | Cálculo |
|-----|-------------|---------|
| Total Visitas | Número total de visitas realizadas | COUNT(Visitas) |
| Total Ventas | Número total de ventas cerradas | COUNT(Ventas) |
| Monto Total | Suma de todas las ventas | SUM(Ventas.Monto) |
| Ticket Promedio | Venta promedio por transacción | AVG(Ventas.Monto) |
| Tasa Conversión | % de visitas que resultan en venta | (Ventas/Visitas) * 100 |
| Clientes Activos | Clientes con al menos una venta | COUNT(DISTINCT ClientesConVentas) |

**Ejemplo de Uso:**

```bash
GET /reportes/dashboard?fechaInicio=2024-01-01&fechaFin=2024-12-31
```

**Respuesta:**


#### 7.2.2 Ventas por Ejecutivo

**Endpoint:** `GET /reportes/ventas-ejecutivo`

**Parámetros:**
- `idEjecutivo` (opcional): Filtrar por ejecutivo específico
- `fechaInicio` (opcional): Fecha inicial del rango
- `fechaFin` (opcional): Fecha final del rango

**Ejemplo:**

```bash
GET /reportes/ventas-ejecutivo?idEjecutivo=1&fechaInicio=2024-10-01&fechaFin=2024-10-31
```

**Respuesta:**

```json
{
  "ejecutivo": {
    "id": 1,
    "nombre": "Juan Pérez"
  },
  "periodo": {
    "inicio": "2024-10-01",
    "fin": "2024-10-31"
  },
  "metricas": {
    "totalVentas": 45,
    "montoTotal": 2340500.00,
    "ticketPromedio": 52011.11,
    "mejorVenta": 125000.00,
    "peorVenta": 15000.00
  }
}
```

#### 7.2.3 Ventas por Cliente

**Endpoint:** `GET /reportes/ventas-cliente`

**Parámetros:**
- `idCliente` (opcional): Filtrar por cliente específico
- `top` (opcional): Traer solo los top N clientes (por monto)

**Ejemplo:**

```bash
GET /reportes/ventas-cliente?top=10
```

#### 7.2.4 Ventas por Producto

**Endpoint:** `GET /reportes/ventas-producto`

**Respuesta:**

```json
{
  "productos": [
    {
      "producto": "Tarjeta de Crédito",
      "cantidadVentas": 345,
      "montoTotal": 15678900.00,
      "porcentajeDelTotal": 34.33
    },
    {
      "producto": "Préstamo Personal",
      "cantidadVentas": 289,
      "montoTotal": 13456700.00,
      "porcentajeDelTotal": 29.46
    }
  ]
}
```

#### 7.2.5 Tendencia Mensual

**Endpoint:** `GET /reportes/tendencia-mensual`

**Parámetros:**
- `año` (obligatorio): Año a consultar

**Ejemplo:**

```bash
GET /reportes/tendencia-mensual?año=2024
```

**Respuesta:**

```json
{
  "año": 2024,
  "tendencia": [
    {
      "mes": 1,
      "nombreMes": "Enero",
      "totalVentas": 78,
      "montoTotal": 3456789.00,
      "ticketPromedio": 44318.45
    },
    {
      "mes": 2,
      "nombreMes": "Febrero",
      "totalVentas": 82,
      "montoTotal": 3678900.00,
      "ticketPromedio": 44864.63
    }
    // ... resto de meses
  ]
}
```

### 7.3 Promedio de Ventas por Cliente

**Endpoint:** `GET /reportes/promedio-ventas-cliente`

**Descripción:** Calcula el promedio de ventas para cada cliente, útil para identificar clientes de alto valor.

**Respuesta:**

```json
{
  "clientes": [
    {
      "idCliente": 23,
      "nombreCliente": "Carlos Martínez",
      "cantidadVentas": 12,
      "montoTotal": 1456789.00,
      "promedioVenta": 121399.08,
      "clasificacion": "Premium"
    }
  ]
}
```

### 7.4 Consultas SQL de Reportes

Todas las consultas SQL están documentadas en:

```
db/reports/
├── kpi_clientes.sql
├── kpi_ventas.sql
└── kpi_visistas_ejecutivos.sql
```

### 7.5 Exportar Reportes

Los reportes pueden exportarse en diferentes formatos:

#### 7.5.1 JSON (por defecto)
```bash
GET /reportes/dashboard
```

#### 7.5.2 CSV
```bash
GET /reportes/dashboard?formato=csv
```

#### 7.5.3 Excel
```bash
GET /reportes/dashboard?formato=xlsx
```

---

## 8. Parte 4: API REST

### 8.1 Descripción de la API

API RESTful desarrollada con NestJS que expone todos los módulos del CRM.

**Características:**
-  Arquitectura modular
-  Autenticación JWT
-  Validación de datos con class-validator
-  Documentación automática con Swagger
-  Paginación en listados
-  Manejo de errores centralizado
-  CORS habilitado

### 8.2 Autenticación

#### 8.2.1 Obtener Token JWT

**Endpoint:** `POST /auth/login`

**Cuerpo de la Petición:**

```json
{
  "username": "admin",
  "password": "Admin123!"
}
```

**Respuesta Exitosa:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@banreservas.com",
    "role": "Admin"
  }
}
```

#### 8.2.2 Usar el Token

En cada petición, incluye el token en el header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 8.3 Endpoints Principales

#### 8.3.1 Módulo de Clientes

**Listar Clientes**
```
GET /clientes?page=1&limit=10
```

**Obtener Cliente**
```
GET /clientes/:id
```

**Crear Cliente**
```
POST /clientes
Body: {
  "nombre": "Juan",
  "apellido": "Pérez",
  "direccion": "Calle Principal 123",
  "telefono": "809-555-1234"
}
```

**Actualizar Cliente**
```
PATCH /clientes/:id
Body: { "telefono": "809-555-5678" }
```

**Eliminar Cliente**
```
DELETE /clientes/:id
```

#### 8.3.2 Módulo de Ejecutivos

**Listar Ejecutivos**
```
GET /ejecutivos?page=1&limit=10
```

**Crear Ejecutivo**
```
POST /ejecutivos
Body: {
  "nombre": "María",
  "apellido": "González"
}
```

#### 8.3.3 Módulo de Visitas

**Listar Visitas**
```
GET /visitas?page=1&limit=10
```

**Crear Visita**
```
POST /visitas
Body: {
  "idCliente": 1,
  "idEjecutivo": 2,
  "fechaVisita": "2024-10-27",
  "resultado": "Interesado en producto"
}
```

#### 8.3.4 Módulo de Ventas

**Listar Ventas**
```
GET /ventas?page=1&limit=10
```

**Crear Venta**
```
POST /ventas
Body: {
  "idCliente": 1,
  "fechaVenta": "2024-10-27",
  "monto": 45000.50,
  "producto": "Tarjeta de Crédito"
}
```

### 8.4 Módulo de Productividad (Parte 1)

**Endpoint:** `GET /productividad`

**Descripción:** Obtiene la productividad por ejecutivo (implementación de la Parte 1).

**Parámetros Opcionales:**
- `fechaInicio`: Fecha inicial (YYYY-MM-DD)
- `fechaFin`: Fecha final (YYYY-MM-DD)
- `idEjecutivo`: Filtrar por ejecutivo específico

**Ejemplo 1: Todos los ejecutivos, todo el tiempo**
```bash
GET /productividad
```

**Ejemplo 2: Con rango de fechas**
```bash
GET /productividad?fechaInicio=2024-01-01&fechaFin=2024-12-31
```

**Ejemplo 3: Un ejecutivo específico**
```bash
GET /productividad?idEjecutivo=1
```

**Respuesta:**

```json
{
  "success": true,
  "data": [
    {
      "idEjecutivo": 1,
      "nombreEjecutivo": "Juan Pérez",
      "totalVisitas": 45,
      "totalVentas": 32,
      "montoTotalVentas": 1250000.00,
      "tasaConversion": 71.11,
      "ticketPromedio": 39062.50
    },
    {
      "idEjecutivo": 2,
      "nombreEjecutivo": "María González",
      "totalVisitas": 38,
      "totalVentas": 28,
      "montoTotalVentas": 980000.00,
      "tasaConversion": 73.68,
      "ticketPromedio": 35000.00
    }
  ]
}
```

### 8.5 Documentación Swagger

**URL:** `http://localhost:3000/api`

La documentación Swagger proporciona:
- 📋 Lista completa de endpoints
- 📝 Descripción de cada endpoint
- 🔍 Modelos de datos (request/response)
- 🧪 Interfaz para probar endpoints
- 🔒 Autenticación integrada

**Captura de pantalla de Swagger:**

```
┌──────────────────────────────────────────────────┐
│  CRM BanReservas API                             │
│  Version: 1.0                                     │
├──────────────────────────────────────────────────┤
│  Auth                                             │
│    POST /auth/login - Iniciar sesión             │
│                                                   │
│  Clientes                                         │
│    GET  /clientes - Listar clientes              │
│    POST /clientes - Crear cliente                │
│    GET  /clientes/:id - Obtener cliente          │
│    PATCH /clientes/:id - Actualizar cliente      │
│    DELETE /clientes/:id - Eliminar cliente       │
│                                                   │
│  Productividad                                    │
│    GET /productividad - Obtener productividad    │
│                                                   │
│  ETL                                              │
│    POST /etl/cargar-ventas - Cargar CSV/Excel    │
│                                                   │
│  Reportes                                         │
│    GET /reportes/dashboard - Dashboard KPIs      │
│    GET /reportes/ventas-ejecutivo                │
│    GET /reportes/ventas-cliente                  │
│    GET /reportes/ventas-producto                 │
│    GET /reportes/tendencia-mensual               │
└──────────────────────────────────────────────────┘
```

### 8.6 Colección de Postman

**Archivo:** `postman/CRM_BanReservas.postman_collection.json`

**Importar en Postman:**
1. Abre Postman
2. Click en "Import"
3. Selecciona el archivo de colección
4. Configura el entorno (Environment) con tu URL base

**Variables de entorno sugeridas:**
```json
{
  "base_url": "http://localhost:3000",
  "token": "{{tu_token_jwt}}"
}
```

---


## 9. Anexos

### 9.1 Script Completo de Base de Datos

**Archivo:** `db/init.sql`

Contiene:
- Creación de todas las tablas
- Índices y llaves foráneas
- Stored procedures
- Funciones auxiliares

### 9.2 Diagrama de Flujo del ETL

```
┌─────────────┐
│ Inicio ETL  │
└──────┬──────┘
       │
       ▼
┌──────────────────┐
│ Recibir archivo  │
│ CSV/Excel        │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐     ┌────────────┐
│ ¿Formato válido? │─NO─►│ Retornar   │
│                  │     │ error      │
└──────┬───────────┘     └────────────┘
       │YES
       ▼
┌──────────────────┐
│ Parsear archivo  │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Para cada fila:  │
│ 1. Validar datos │
│ 2. Verificar     │
│    duplicados    │
│ 3. Validar FKs   │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐     ┌────────────┐
│ ¿Hay errores     │─YES─►│ Rollback   │
│ críticos?        │     │ Reportar   │
└──────┬───────────┘     └────────────┘
       │NO
       ▼
┌──────────────────┐
│ Insertar registros│
│ válidos          │
└──────┬───────────┘
       │
       ▼
┌──────────────────┐
│ Retornar resumen │
│ - Insertados     │
│ - Duplicados     │
│ - Errores        │
└──────┬───────────┘
       │
       ▼
┌─────────────┐
│  Fin ETL    │
└─────────────┘
```

### 9.3 Ejemplo de Datos de Prueba

**Archivo:** `db/seeders/seed.sql`

Contiene:
- 100 clientes
- 10 ejecutivos
- 500 visitas
- 350 ventas
- 3 roles
- 2 usuarios de prueba

### 9.4 Variables de Entorno Completas

```env
# ===========================================
# CONFIGURACIÓN BASE DE DATOS
# ===========================================
DB_HOST=localhost
DB_PORT=1433
DB_USERNAME=sa
DB_PASSWORD=YourStrongPassword123!
DB_DATABASE=CRM_BanReservas
DB_SYNCHRONIZE=false
DB_LOGGING=true

# ===========================================
# CONFIGURACIÓN APLICACIÓN
# ===========================================
PORT=3000
NODE_ENV=development
API_PREFIX=api
API_VERSION=v1

# ===========================================
# CONFIGURACIÓN JWT
# ===========================================
JWT_SECRET=super_secret_key_change_in_production_xyz123
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=refresh_secret_key_change_in_production_abc456
JWT_REFRESH_EXPIRES_IN=7d

# ===========================================
# CONFIGURACIÓN CORS
# ===========================================
CORS_ORIGIN=*
CORS_CREDENTIALS=true

# ===========================================
# CONFIGURACIÓN ARCHIVOS
# ===========================================
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
CSV_PATH=./excel_csv

# ===========================================
# CONFIGURACIÓN LOGGING
# ===========================================
LOG_LEVEL=debug
LOG_FILE=true
LOG_PATH=./logs

# ===========================================
# CONFIGURACIÓN RATE LIMITING
# ===========================================
RATE_LIMIT_TTL=60
RATE_LIMIT_MAX=100

# ===========================================
# CONFIGURACIÓN EMAIL (OPCIONAL)
# ===========================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@banreservas.com
```

### 9.5 Comandos Útiles

```bash
# Instalación
npm install

# Desarrollo
npm run start:dev

# Build
npm run build

# Producción
npm run start:prod

# Pruebas
npm run test
npm run test:e2e
npm run test:cov

# Linting
npm run lint
npm run lint:fix

# Formateo
npm run format

# Base de datos
npm run migration:generate -- MigrationName
npm run migration:run
npm run migration:revert

# Logs
npm run logs:clear

# Limpieza
npm run clean
rm -rf node_modules dist
npm install
```

### 9.6 Glosario de Términos

| Término | Definición |
|---------|-----------|
| **CRM** | Customer Relationship Management (Gestión de Relaciones con Clientes) |
| **ETL** | Extract, Transform, Load (Extraer, Transformar, Cargar) |
| **KPI** | Key Performance Indicator (Indicador Clave de Rendimiento) |
| **API REST** | Application Programming Interface - Representational State Transfer |
| **JWT** | JSON Web Token (Token de autenticación) |
| **Stored Procedure** | Procedimiento almacenado en base de datos |
| **DTO** | Data Transfer Object (Objeto de Transferencia de Datos) |
| **ORM** | Object-Relational Mapping (Mapeo Objeto-Relacional) |
| **Endpoint** | Punto de acceso de la API |
| **Middleware** | Componente intermedio que procesa peticiones |



**Uso interno únicamente.**

---

## 10. Conclusión

Este manual proporciona toda la información necesaria para instalar, configurar y utilizar el sistema CRM de Banco de Reservas. 

### 10.1 Resumen de la Solución

 **Parte 1:** Consulta SQL implementada en stored procedure `sp_ObtenerProductividadEjecutivos`

 **Parte 2:** Proceso ETL completo con validaciones en endpoint `/etl/cargar-ventas`

 **Parte 3:** Reportes parametrizados con 6 KPIs principales en módulo `/reportes`

 **Parte 4:** API REST completa con NestJS, documentada con Swagger

 **Parte 5:** Dashboard Power BI con 4 páginas de análisis interactivo



### 13.3 Duda:

Para cualquier pregunta o problema:
- Email: manuelmaldonado2898@gmail.com


---

**Fin del Manual de Usuario**

*Versión 1.0 - Octubre 2025*  
*© 2025 Prueba Tecnica | Banco de Reservas de la República Dominicana*