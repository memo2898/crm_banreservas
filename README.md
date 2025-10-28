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
6. [Parte 2: Proceso ETL](#6-parte-2-proceso-etl)
7. [Parte 3: Reportes y KPIs](#7-parte-3-reportes-y-kpis)
8. [Parte 4: API REST](#8-parte-4-api-rest)
9. [Pruebas y Validación](#9-pruebas-y-validación)
10. [Solución de Problemas](#10-solución-de-problemas)
11. [Anexos](#11-anexos)

---

## 1. Introducción

### 1.1 Descripción del Proyecto

Este proyecto implementa una solución integral para la gestión de actividad comercial en el CRM del Banco de Reservas, integrando datos de visitas, ventas y ejecutivos desde múltiples fuentes de datos.

### 1.2 Alcance

La solución cubre:
- ✅ Integración de datos de PostgreSQL y archivos CSV/Excel
- ✅ Consultas analíticas de productividad
- ✅ Proceso ETL automatizado con validaciones
- ✅ API REST para consumo de datos
- ✅ Reportes parametrizados con KPIs

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
git clone https://github.com/[tu-usuario]/api-crm-banreservas.git
cd api-crm-banreservas
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
# Base de Datos PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_password_postgres
DB_DATABASE=crm_banreservas

# Aplicación
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=tu_secret_key_super_segura_aqui_cambiar_en_produccion
JWT_EXPIRES_IN=24h

# Configuraciones adicionales
CORS_ORIGIN=*
MAX_FILE_SIZE=5242880
```

⚠️ **IMPORTANTE:** Cambia `JWT_SECRET` y `DB_PASSWORD` por valores seguros en producción.

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
npm run start:dev
```

**Características del modo desarrollo:**
- ✅ Auto-reload cuando cambias código
- ✅ Logs detallados en consola
- ✅ Muestra errores completos con stack trace
- ✅ No requiere compilación manual

**Salida esperada:**
```
[Nest] 12345  - 27/10/2024, 10:30:00   LOG [NestFactory] Starting Nest application...
[Nest] 12345  - 27/10/2024, 10:30:01   LOG [InstanceLoader] AppModule dependencies initialized
[Nest] 12345  - 27/10/2024, 10:30:01   LOG [InstanceLoader] TypeOrmModule dependencies initialized
[Nest] 12345  - 27/10/2024, 10:30:02   LOG [RoutesResolver] AppController {/}:
[Nest] 12345  - 27/10/2024, 10:30:02   LOG [RouterExplorer] Mapped {/, GET} route
[Nest] 12345  - 27/10/2024, 10:30:02   LOG [NestApplication] Nest application successfully started
[Nest] 12345  - 27/10/2024, 10:30:02   LOG Application is running on: http://localhost:3000
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
curl http://localhost:3000
```

**Respuesta esperada:**
```json
{
  "message": "CRM BanReservas API está funcionando",
  "version": "1.0.0"
}
```

**2. Documentación Swagger:**

Abre en tu navegador:
```
http://localhost:3000/api
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
- 🟢 **Inicialización** de módulos
- 🔵 **Rutas** registradas
- 🟡 **Peticiones** HTTP entrantes
- 🔴 **Errores** si ocurren
- 🟢 **Conexión** a base de datos

#### 3.5.6 Detener el Backend

Para detener el servidor:
- Presiona `Ctrl + C` en la terminal

### 3.6 Verificar Instalación

Una vez iniciada la aplicación, verifica:

1. **API funcionando:**
   ```
   http://localhost:3000
   ```

2. **Documentación Swagger:**
   ```
   http://localhost:3000/api
   ```

3. **Health Check:**
   ```bash
   curl http://localhost:3000/
   ```

---

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
CREATE PROCEDURE sp_ObtenerProductividadEjecutivos
    @FechaInicio DATE = NULL,
    @FechaFin DATE = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        E.IdEjecutivo,
        E.Nombre + ' ' + E.Apellido AS NombreEjecutivo,
        COUNT(DISTINCT V.IdVisita) AS TotalVisitas,
        COUNT(DISTINCT VT.IdVenta) AS TotalVentas,
        ISNULL(SUM(VT.Monto), 0) AS MontoTotalVentas,
        CASE 
            WHEN COUNT(DISTINCT V.IdVisita) > 0 
            THEN CAST(COUNT(DISTINCT VT.IdVenta) AS FLOAT) / COUNT(DISTINCT V.IdVisita) * 100
            ELSE 0 
        END AS TasaConversion,
        CASE 
            WHEN COUNT(DISTINCT VT.IdVenta) > 0 
            THEN SUM(VT.Monto) / COUNT(DISTINCT VT.IdVenta)
            ELSE 0 
        END AS TicketPromedio
    FROM 
        Ejecutivos E
    LEFT JOIN 
        Visitas V ON E.IdEjecutivo = V.IdEjecutivo
    LEFT JOIN 
        Ventas VT ON V.IdCliente = VT.IdCliente 
        AND VT.FechaVenta >= V.FechaVisita
        AND VT.FechaVenta <= DATEADD(DAY, 30, V.FechaVisita)
    WHERE 
        (@FechaInicio IS NULL OR V.FechaVisita >= @FechaInicio)
        AND (@FechaFin IS NULL OR V.FechaVisita <= @FechaFin)
    GROUP BY 
        E.IdEjecutivo, E.Nombre, E.Apellido
    ORDER BY 
        MontoTotalVentas DESC;
END;
GO
```

#### 5.1.3 Ejecutar la Consulta

**Método 1: Desde SQL Server Management Studio**

```sql
-- Sin parámetros (todos los registros)
EXEC sp_ObtenerProductividadEjecutivos;

-- Con rango de fechas
EXEC sp_ObtenerProductividadEjecutivos 
    @FechaInicio = '2024-01-01', 
    @FechaFin = '2024-12-31';
```

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
- ✅ Validación de estructura del archivo
- ✅ Detección de registros duplicados
- ✅ Validación de datos (fechas, montos, referencias foráneas)
- ✅ Manejo de errores con reporte detallado
- ✅ Transacciones seguras (rollback en caso de error)
- ✅ Registro de auditoría

### 6.2 Formato del Archivo CSV

**Ubicación de archivos de prueba:** `excel_csv/`

El proyecto incluye dos archivos CSV de ejemplo que puedes usar para probar el ETL:
- `ventas_otro_sistema.csv`
- `ventas_otro_sistema_2.csv`

Estos archivos ya están listos para ser cargados en el sistema.

#### 6.2.1 Estructura Requerida

```csv
IdCliente,FechaVenta,Monto,Producto
1,2024-10-15,45000.50,Tarjeta de Crédito
2,2024-10-16,120000.00,Préstamo Personal
3,2024-10-17,85000.75,Cuenta de Ahorro
```

#### 6.2.2 Especificaciones

| Campo | Tipo | Obligatorio | Validaciones |
|-------|------|-------------|--------------|
| IdCliente | Entero | Sí | Debe existir en tabla Clientes |
| FechaVenta | Fecha | Sí | Formato: YYYY-MM-DD, no futuras |
| Monto | Decimal | Sí | Mayor a 0 |
| Producto | Texto | Sí | Máximo 100 caracteres |

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
POST http://localhost:3000/etl/cargar-ventas
Content-Type: multipart/form-data

Cuerpo:
- file: [Seleccionar archivo CSV]
```

**Método 2: Usando cURL**

Puedes usar cualquiera de los dos archivos CSV disponibles:

```bash
# Opción 1: Usando el primer archivo CSV
curl -X POST http://localhost:3000/etl/cargar-ventas \
  -H "Authorization: Bearer TU_TOKEN_JWT" \
  -F "file=@excel_csv/ventas_otro_sistema.csv"

# Opción 2: Usando el segundo archivo CSV
curl -X POST http://localhost:3000/etl/cargar-ventas \
  -H "Authorization: Bearer TU_TOKEN_JWT" \
  -F "file=@excel_csv/ventas_otro_sistema_2.csv"
```

**Método 3: Usando la Documentación Swagger**

1. Abre: `http://localhost:3000/api`
2. Navega a: `ETL > POST /etl/cargar-ventas`
3. Click en "Try it out"
4. Selecciona tu archivo CSV
5. Click en "Execute"

### 6.4 Respuesta del ETL

#### 6.4.1 Carga Exitosa

```json
{
  "success": true,
  "message": "Proceso ETL completado exitosamente",
  "data": {
    "registrosProcesados": 150,
    "registrosInsertados": 145,
    "registrosDuplicados": 3,
    "registrosConError": 2,
    "duracionMs": 1245
  },
  "errores": [
    {
      "fila": 23,
      "campo": "IdCliente",
      "valor": "999",
      "error": "Cliente no existe en la base de datos"
    },
    {
      "fila": 87,
      "campo": "Monto",
      "valor": "-500",
      "error": "El monto debe ser mayor a 0"
    }
  ]
}
```

#### 6.4.2 Carga con Errores

Si hay errores críticos, la transacción se revierte completamente:

```json
{
  "success": false,
  "message": "Error en el proceso ETL: Formato de archivo inválido",
  "error": "El archivo debe contener las columnas: IdCliente, FechaVenta, Monto, Producto"
}
```

### 6.5 Validaciones Implementadas

#### 6.5.1 Validaciones de Estructura

- ✅ Archivo debe ser CSV o Excel (.csv, .xlsx)
- ✅ Debe contener las columnas requeridas
- ✅ Tamaño máximo: 5 MB

#### 6.5.2 Validaciones de Datos

- ✅ **IdCliente:** Debe existir en la tabla Clientes
- ✅ **FechaVenta:** 
  - Formato válido (YYYY-MM-DD)
  - No puede ser fecha futura
  - No puede ser anterior al año 2000
- ✅ **Monto:** 
  - Debe ser numérico
  - Mayor a 0
  - Máximo 2 decimales
- ✅ **Producto:** 
  - No puede estar vacío
  - Máximo 100 caracteres

#### 6.5.3 Validaciones de Duplicados

```sql
-- Se considera duplicado si existe un registro con:
-- - Mismo IdCliente
-- - Misma FechaVenta
-- - Mismo Monto
-- - Mismo Producto
```

### 6.6 Logs y Auditoría

Cada ejecución del ETL se registra en:

**Base de Datos:**
```sql
SELECT * FROM LogsETL 
ORDER BY FechaEjecucion DESC;
```

**Archivos de Log:** (si configurado)
```
logs/etl_2024-10-27_14-30-00.log
```

---

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

```json
{
  "periodo": {
    "inicio": "2024-01-01",
    "fin": "2024-12-31"
  },
  "kpis": {
    "totalVisitas": 1247,
    "totalVentas": 892,
    "montoTotal": 45678900.50,
    "ticketPromedio": 51211.32,
    "tasaConversion": 71.53,
    "clientesActivos": 634
  }
}
```

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
- ✅ Arquitectura modular
- ✅ Autenticación JWT
- ✅ Validación de datos con class-validator
- ✅ Documentación automática con Swagger
- ✅ Paginación en listados
- ✅ Manejo de errores centralizado
- ✅ CORS habilitado

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

## 9. Parte 5: Visualización Power BI

### 9.1 Descripción

Dashboard interactivo en Power BI que visualiza tendencias y comparativas de la actividad comercial.

### 9.2 Requisitos

- Power BI Desktop (versión más reciente)
- Conexión a SQL Server
- Credenciales de base de datos

### 9.3 Configuración del Dashboard

#### 9.3.1 Abrir el Archivo

**Ubicación:** `powerbi/Dashboard_CRM_BanReservas.pbix`

1. Abre Power BI Desktop
2. File > Open
3. Selecciona `Dashboard_CRM_BanReservas.pbix`

#### 9.3.2 Configurar Conexión a Datos

Si es la primera vez:

1. En Power BI, ve a: **Home > Transform data > Data source settings**
2. Selecciona la conexión SQL Server
3. Click en "Change Source..."
4. Actualiza:
   - Server: `localhost` (o tu servidor)
   - Database: `CRM_BanReservas`
5. Click OK
6. Ingresa credenciales cuando se solicite
7. Click en "Refresh"

### 9.4 Páginas del Dashboard

#### 9.4.1 Página 1: Overview General

**Visualizaciones:**
- 📊 Tarjetas de KPIs principales
  - Total Visitas
  - Total Ventas
  - Monto Total Vendido
  - Tasa de Conversión
- 📈 Gráfico de línea: Tendencia mensual de ventas
- 📊 Gráfico de barras: Top 10 productos más vendidos
- 🥧 Gráfico circular: Distribución de ventas por producto

#### 9.4.2 Página 2: Análisis por Ejecutivo

**Visualizaciones:**
- 📊 Tabla: Productividad por ejecutivo
  - Visitas, Ventas, Monto, Conversión
- 📊 Gráfico de barras apiladas: Comparativa de ejecutivos
- 📈 Gráfico de área: Evolución mensual por ejecutivo
- 🎯 Gauge: Cumplimiento de metas

**Filtros Disponibles:**
- Rango de fechas
- Ejecutivo específico
- Tipo de producto

#### 9.4.3 Página 3: Análisis por Cliente

**Visualizaciones:**
- 📊 Tabla: Top clientes por monto
- 🗺️ Mapa: Distribución geográfica de clientes
- 📊 Gráfico de dispersión: Relación visitas vs ventas
- 📊 Histograma: Distribución de tickets de venta

#### 9.4.4 Página 4: Tendencias y Comparativas

**Visualizaciones:**
- 📈 Gráfico de líneas múltiples: Comparativa año sobre año
- 📊 Matriz: Heatmap de ventas por mes y ejecutivo
- 📊 Waterfall: Descomposición del crecimiento de ventas
- 📊 KPI: Crecimiento % vs periodo anterior

### 9.5 Interactividad

**Filtros Globales:**
- 📅 Rango de fechas
- 👤 Ejecutivo
- 📦 Producto
- 👥 Cliente

**Cross-filtering:**
- Click en cualquier elemento para filtrar los demás visuales
- Ctrl+Click para selección múltiple

### 9.6 Actualización de Datos

#### 9.6.1 Manual

```
Home > Refresh
```

#### 9.6.2 Automática (Power BI Service)

1. Publica el dashboard al servicio de Power BI
2. Configura el gateway de datos
3. Programa actualizaciones automáticas

### 9.7 Exportar Dashboard

**PDF:**
```
File > Export > Export to PDF
```

**PowerPoint:**
```
File > Export > Export to PowerPoint
```

**Publicar al Servicio:**
```
Home > Publish > Select workspace
```

---

## 10. Pruebas y Validación

### 10.1 Pruebas de la Base de Datos

#### 10.1.1 Verificar Tablas Creadas

```sql
-- Listar todas las tablas
SELECT TABLE_NAME 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_TYPE = 'BASE TABLE'
ORDER BY TABLE_NAME;

-- Verificar datos de prueba
SELECT COUNT(*) AS TotalClientes FROM Clientes;
SELECT COUNT(*) AS TotalEjecutivos FROM Ejecutivos;
SELECT COUNT(*) AS TotalVisitas FROM Visitas;
SELECT COUNT(*) AS TotalVentas FROM Ventas;
```

#### 10.1.2 Probar Stored Procedures

```sql
-- Probar procedimiento de productividad
EXEC sp_ObtenerProductividadEjecutivos;

-- Probar con parámetros
EXEC sp_ObtenerProductividadEjecutivos 
    @FechaInicio = '2024-01-01', 
    @FechaFin = '2024-12-31';
```

### 10.2 Pruebas de la API

#### 10.2.1 Health Check

```bash
curl http://localhost:3000
```

**Respuesta esperada:**
```json
{
  "message": "CRM BanReservas API está funcionando correctamente",
  "version": "1.0.0",
  "timestamp": "2024-10-27T14:30:00.000Z"
}
```

#### 10.2.2 Flujo Completo de Prueba

**1. Autenticación**
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin123!"}'
```

**2. Listar Clientes**
```bash
curl -X GET http://localhost:3000/clientes?page=1&limit=5 \
  -H "Authorization: Bearer TOKEN_AQUI"
```

**3. Obtener Productividad**
```bash
curl -X GET "http://localhost:3000/productividad?fechaInicio=2024-01-01" \
  -H "Authorization: Bearer TOKEN_AQUI"
```

**4. Cargar CSV**
```bash
curl -X POST http://localhost:3000/etl/cargar-ventas \
  -H "Authorization: Bearer TOKEN_AQUI" \
  -F "file=@excel_csv/ventas_otro_sistema.csv"
```

**5. Obtener Dashboard**
```bash
curl -X GET "http://localhost:3000/reportes/dashboard" \
  -H "Authorization: Bearer TOKEN_AQUI"
```

### 10.3 Suite de Pruebas Automatizadas

#### 10.3.1 Ejecutar Pruebas Unitarias

```bash
npm run test
```

#### 10.3.2 Ejecutar Pruebas E2E

```bash
npm run test:e2e
```

#### 10.3.3 Cobertura de Código

```bash
npm run test:cov
```

### 10.4 Casos de Prueba del ETL

| Caso | Archivo | Resultado Esperado |
|------|---------|-------------------|
| CSV Válido | `ventas_otro_sistema.csv` | Todos los registros insertados |
| CSV con Duplicados | `ventas_duplicadas.csv` | Duplicados rechazados |
| CSV con Errores | `ventas_invalidas.csv` | Errores reportados, ningún registro insertado |
| Cliente Inexistente | `ventas_cliente_invalido.csv` | Error de validación |
| Fechas Futuras | `ventas_fecha_invalida.csv` | Error de validación |

### 10.5 Checklist de Validación

Antes de entregar, verifica:

- [ ] Base de datos creada correctamente
- [ ] Datos de prueba cargados
- [ ] API inicia sin errores
- [ ] Documentación Swagger accesible
- [ ] Autenticación funciona
- [ ] Todos los endpoints responden
- [ ] Proceso ETL carga archivos CSV
- [ ] Stored procedures ejecutan correctamente
- [ ] Dashboard Power BI abre y muestra datos
- [ ] README.md está completo

---

## 11. Solución de Problemas

### 11.1 Problemas Comunes de Instalación

#### 11.1.1 Error: "Cannot connect to database"

**Síntomas:**
```
Error: Connection failed: ECONNREFUSED
```

**Soluciones:**
1. Verifica que SQL Server esté corriendo:
   ```bash
   # Windows
   services.msc > SQL Server (MSSQLSERVER)
   
   # Linux
   sudo systemctl status mssql-server
   ```

2. Verifica las credenciales en `.env`:
   ```env
   DB_HOST=localhost
   DB_PORT=1433
   DB_USERNAME=sa
   DB_PASSWORD=TuPasswordAqui
   ```

3. Verifica que el puerto 1433 esté abierto:
   ```bash
   telnet localhost 1433
   ```

#### 11.1.2 Error: "Port 3000 already in use"

**Síntomas:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Soluciones:**
1. Cambia el puerto en `.env`:
   ```env
   PORT=3001
   ```

2. O detén el proceso que usa el puerto:
   ```bash
   # Windows
   netstat -ano | findstr :3000
   taskkill /PID [PID_NUMBER] /F
   
   # Linux/Mac
   lsof -i :3000
   kill -9 [PID]
   ```

#### 11.1.3 Error: "Module not found"

**Síntomas:**
```
Error: Cannot find module '@nestjs/core'
```

**Solución:**
```bash
# Borra node_modules y reinstala
rm -rf node_modules package-lock.json
npm install
```

### 11.2 Problemas con el ETL

#### 11.2.1 Error: "File format not supported"

**Síntomas:**
```json
{
  "error": "Formato de archivo no soportado"
}
```

**Solución:**
- Asegúrate de que el archivo sea CSV o XLSX
- Verifica que el archivo no esté corrupto
- Abre el CSV en un editor de texto para verificar el formato

#### 11.2.2 Error: "Missing required columns"

**Síntomas:**
```json
{
  "error": "El archivo debe contener: IdCliente, FechaVenta, Monto, Producto"
}
```

**Solución:**
- Verifica que el CSV tenga exactamente estas columnas
- Los nombres deben coincidir exactamente (case-sensitive)
- La primera fila debe ser el encabezado

#### 11.2.3 Archivo CSV muy grande

**Síntomas:**
```json
{
  "error": "File too large"
}
```

**Solución:**
1. Divide el archivo en partes más pequeñas
2. O aumenta el límite en `.env`:
   ```env
   MAX_FILE_SIZE=10485760  # 10 MB
   ```

### 11.3 Problemas con Power BI

#### 11.3.1 Error: "Cannot refresh data"

**Síntomas:**
- Dashboard muestra datos antiguos
- Mensaje de error al refrescar

**Soluciones:**
1. Verifica la conexión a SQL Server
2. Actualiza credenciales:
   ```
   Home > Transform data > Data source settings > Edit Permissions
   ```

3. Verifica que la base de datos tenga datos:
   ```sql
   SELECT COUNT(*) FROM Ventas;
   ```

#### 11.3.2 Visuales no se Actualizan

**Solución:**
```
1. Click en visual > Visualizations pane
2. Verifica que los campos estén correctamente mapeados
3. Remove y vuelve a agregar los campos
```

### 11.4 Problemas de Autenticación

#### 11.4.1 Token Expirado

**Síntomas:**
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

**Solución:**
- Genera un nuevo token haciendo login nuevamente
- Verifica la configuración de expiración en `.env`:
  ```env
  JWT_EXPIRES_IN=24h
  ```

#### 11.4.2 Usuario o Contraseña Incorrectos

**Credenciales por defecto:**
```
Username: admin
Password: Admin123!
```

Para crear nuevos usuarios:
```sql
INSERT INTO Usuarios (Username, Email, Password, IdRol)
VALUES ('nuevo_usuario', 'email@example.com', 'Password123!', 1);
```

### 11.5 Logs y Debugging

#### 11.5.1 Ver Logs de la Aplicación

**Modo desarrollo:**
```bash
npm run start:dev
# Los logs aparecen en la consola
```

**Modo producción:**
```bash
# Logs se guardan en archivos
tail -f logs/application.log
```

#### 11.5.2 Nivel de Logging

Ajusta el nivel en `.env`:
```env
LOG_LEVEL=debug  # debug, info, warn, error
```

#### 11.5.3 Debugging en VSCode

Crea `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug NestJS",
      "runtimeArgs": ["--nolazy", "-r", "ts-node/register"],
      "args": ["${workspaceFolder}/src/main.ts"],
      "env": {
        "NODE_ENV": "development"
      },
      "console": "integratedTerminal"
    }
  ]
}
```

### 11.6 Soporte y Recursos

**Documentación Oficial:**
- NestJS: https://docs.nestjs.com
- TypeORM: https://typeorm.io
- Power BI: https://docs.microsoft.com/power-bi

**Contacto:**
- Email: soporte@banreservas.com
- Repositorio: [URL del repositorio]
- Issues: [URL]/issues

---

## 12. Anexos

### 12.1 Script Completo de Base de Datos

**Archivo:** `db/init.sql`

Contiene:
- Creación de todas las tablas
- Índices y llaves foráneas
- Stored procedures
- Funciones auxiliares

### 12.2 Diagrama de Flujo del ETL

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

### 12.3 Ejemplo de Datos de Prueba

**Archivo:** `db/seeders/seed.sql`

Contiene:
- 100 clientes
- 10 ejecutivos
- 500 visitas
- 350 ventas
- 3 roles
- 2 usuarios de prueba

### 12.4 Variables de Entorno Completas

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

### 12.5 Comandos Útiles

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

### 12.6 Glosario de Términos

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

### 12.7 Referencias y Recursos Adicionales

**Documentación Técnica:**
- [NestJS Documentation](https://docs.nestjs.com)
- [TypeORM Documentation](https://typeorm.io)
- [SQL Server Documentation](https://docs.microsoft.com/sql)
- [Power BI Documentation](https://docs.microsoft.com/power-bi)

**Tutoriales:**
- [Building REST APIs with NestJS](https://www.youtube.com/nestjs-tutorial)
- [SQL Server Basics](https://www.sqlservertutorial.net)
- [Power BI for Beginners](https://powerbi.microsoft.com/learning)

**Herramientas Recomendadas:**
- [Postman](https://www.postman.com) - Pruebas de API
- [DBeaver](https://dbeaver.io) - Cliente SQL multiplataforma
- [VS Code](https://code.visualstudio.com) - Editor de código
- [Git](https://git-scm.com) - Control de versiones

### 12.8 Licencia

Este proyecto es propiedad de Banco de Reservas de la República Dominicana.

**Uso interno únicamente.**

---

## 13. Conclusión

Este manual proporciona toda la información necesaria para instalar, configurar y utilizar el sistema CRM de Banco de Reservas. 

### 13.1 Resumen de la Solución

✅ **Parte 1:** Consulta SQL implementada en stored procedure `sp_ObtenerProductividadEjecutivos`

✅ **Parte 2:** Proceso ETL completo con validaciones en endpoint `/etl/cargar-ventas`

✅ **Parte 3:** Reportes parametrizados con 6 KPIs principales en módulo `/reportes`

✅ **Parte 4:** API REST completa con NestJS, documentada con Swagger

✅ **Parte 5:** Dashboard Power BI con 4 páginas de análisis interactivo

### 13.2 Próximos Pasos

Para poner en producción:
1. Cambiar todas las contraseñas y secrets
2. Configurar SSL/HTTPS
3. Implementar backups automáticos
4. Configurar monitoreo y alertas
5. Realizar pruebas de carga
6. Documentar procedimientos operativos

### 13.3 Soporte

Para cualquier pregunta o problema:
- 📧 Email: soporte-crm@banreservas.com
- 📱 Teléfono: +1 (809) 555-1234
- 🌐 Portal: https://soporte.banreservas.com

---

**Fin del Manual de Usuario**

*Versión 1.0 - Octubre 2025*  
*© 2025 Banco de Reservas de la República Dominicana*