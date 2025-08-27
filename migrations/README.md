# Migraciones de Base de Datos

Este directorio contiene las migraciones de base de datos para el proyecto.

## Cómo ejecutar las migraciones

### Opción 1: Usando psql (PostgreSQL)

```bash
# Conectarse a la base de datos
psql -h localhost -U tu_usuario -d tu_base_de_datos

# Ejecutar la migración
\i migrations/001_create_contacts_table.sql
```

### Opción 2: Usando Drizzle Kit

```bash
# Generar migración desde el schema
npx drizzle-kit generate:pg

# Ejecutar migraciones
npx drizzle-kit push:pg
```

### Opción 3: Desde tu cliente de base de datos

Copia y pega el contenido del archivo SQL en tu cliente de base de datos preferido (pgAdmin, DBeaver, etc.)

## Migraciones disponibles

- `001_create_contacts_table.sql`: Crea la tabla de contactos/peticiones con índices y comentarios

## Notas importantes

- Siempre haz un backup de tu base de datos antes de ejecutar migraciones
- Las migraciones deben ejecutarse en orden secuencial
- Verifica que la migración se ejecutó correctamente antes de continuar

## Verificar que la tabla se creó correctamente

```sql
-- Verificar que la tabla existe
\dt contacts

-- Ver la estructura de la tabla
\d contacts

-- Verificar índices
\di contacts*
```