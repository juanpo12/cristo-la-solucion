# 🗄️ Configuración de Supabase + Drizzle ORM

Esta guía te ayudará a configurar Supabase como base de datos para la tienda de Cristo la Solución.

## 1. Crear Proyecto en Supabase

### Paso 1: Crear cuenta
1. Ve a [Supabase](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Haz clic en "New Project"

### Paso 2: Configurar proyecto
1. **Nombre del proyecto**: "cristo-la-solucion-tienda"
2. **Contraseña de la base de datos**: Genera una contraseña segura (guárdala)
3. **Región**: Selecciona la más cercana (South America - São Paulo)
4. **Plan**: Free (suficiente para empezar)

### Paso 3: Obtener credenciales
Una vez creado el proyecto, ve a **Settings > API**:

```bash
# Variables de entorno necesarias
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-aqui
DATABASE_URL=postgresql://postgres:[password]@db.[proyecto].supabase.co:5432/postgres
```

## 2. Configurar Variables de Entorno

Actualiza tu archivo `.env.local`:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
DATABASE_URL=postgresql://postgres:[password]@db.xxxxxxxxxxx.supabase.co:5432/postgres
```

## 3. Ejecutar Migraciones

### Generar migraciones
```bash
npm run db:generate
```

### Aplicar migraciones
```bash
npm run db:push
```

### Poblar con datos iniciales
```bash
npm run db:seed
```

## 4. Verificar Instalación

### Abrir Drizzle Studio (opcional)
```bash
npm run db:studio
```

### Verificar en Supabase Dashboard
1. Ve a tu proyecto en Supabase
2. Navega a **Table Editor**
3. Deberías ver las tablas:
   - `products`
   - `orders`
   - `order_items`
   - `categories`
   - `store_config`

## 5. Estructura de la Base de Datos

### Tabla `products`
- Información de productos (libros)
- Precios, stock, categorías
- Ratings y reseñas
- Estados (activo/inactivo, destacado)

### Tabla `orders`
- Órdenes de compra
- Información del comprador
- Estados de pago
- Integración con Mercado Pago

### Tabla `order_items`
- Items individuales de cada orden
- Relación muchos-a-muchos entre orders y products
- Snapshot de precios al momento de la compra

### Tabla `categories`
- Categorías de productos
- Iconos y descripciones

### Tabla `store_config`
- Configuración general de la tienda
- Información de contacto
- Parámetros personalizables

## 6. Comandos Útiles

```bash
# Desarrollo
npm run dev                 # Iniciar servidor de desarrollo

# Base de datos
npm run db:generate        # Generar migraciones
npm run db:push           # Aplicar cambios a la BD
npm run db:studio         # Abrir Drizzle Studio
npm run db:seed           # Poblar con datos iniciales

# Producción
npm run build             # Build de producción
npm run start             # Iniciar servidor de producción
```

## 7. APIs Disponibles

### Productos
- `GET /api/products` - Listar productos
- `GET /api/products/[id]` - Obtener producto
- `POST /api/products` - Crear producto
- `PUT /api/products/[id]` - Actualizar producto
- `DELETE /api/products/[id]` - Eliminar producto

### Órdenes
- `GET /api/orders` - Listar órdenes
- `GET /api/orders/[id]` - Obtener orden
- `POST /api/orders` - Crear orden

## 8. Seguridad

### Row Level Security (RLS)
Supabase incluye RLS por defecto. Para desarrollo, puedes deshabilitarlo temporalmente:

1. Ve a **Authentication > Policies**
2. Deshabilita RLS para las tablas necesarias
3. **IMPORTANTE**: Habilítalo en producción

### Políticas recomendadas para producción:
```sql
-- Productos: Solo lectura pública
CREATE POLICY "Public read access" ON products
FOR SELECT USING (active = true);

-- Órdenes: Solo el propietario puede ver sus órdenes
CREATE POLICY "Users can view own orders" ON orders
FOR SELECT USING (payer_email = auth.jwt() ->> 'email');
```

## 9. Backup y Mantenimiento

### Backup automático
Supabase hace backups automáticos diarios en el plan gratuito.

### Backup manual
```bash
# Exportar datos
pg_dump $DATABASE_URL > backup.sql

# Restaurar datos
psql $DATABASE_URL < backup.sql
```

## 10. Monitoreo

### Dashboard de Supabase
- **Database**: Métricas de uso
- **API**: Logs de requests
- **Auth**: Usuarios y sesiones
- **Storage**: Archivos subidos

### Logs importantes
- Errores de conexión
- Queries lentas
- Límites de rate limiting

## 11. Límites del Plan Gratuito

- **Base de datos**: 500 MB
- **Bandwidth**: 5 GB/mes
- **API requests**: 50,000/mes
- **Auth users**: 50,000 MAU

## 12. Migración a Producción

### Actualizar variables de entorno
```bash
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto-prod.supabase.co
DATABASE_URL=postgresql://postgres:[password]@db.tu-proyecto-prod.supabase.co:5432/postgres
```

### Habilitar RLS
1. Configura políticas de seguridad
2. Habilita RLS en todas las tablas
3. Prueba el acceso con diferentes usuarios

### Configurar dominios personalizados (opcional)
1. Ve a **Settings > Custom Domains**
2. Configura tu dominio personalizado
3. Actualiza las variables de entorno

¡Tu base de datos está lista para manejar la tienda! 🎉