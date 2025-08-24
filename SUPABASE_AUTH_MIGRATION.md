# Migración a Supabase Auth - Completada

## Resumen
Se ha completado la migración del sistema de autenticación JWT personalizado a Supabase Auth para el panel de administración.

## Cambios Realizados

### 1. Dependencias Removidas
- `bcryptjs` - Ya no necesario, Supabase maneja el hashing de contraseñas
- `jsonwebtoken` - Reemplazado por tokens de Supabase
- `@types/bcryptjs` y `@types/jsonwebtoken` - Tipos ya no necesarios

### 2. Archivos Modificados

#### Autenticación
- `lib/auth.ts` - Ya usa Supabase Auth completamente
- `middleware.ts` - Actualizado para usar Supabase Auth
- `lib/services/admin.ts` - Marcado como deprecado
- `lib/auth-jwt.ts` - Removido/deprecado

#### API Routes
- `app/api/admin/auth/login/route.ts` - Migrado a Supabase Auth
- `app/api/admin/auth/logout/route.ts` - Nuevo endpoint para logout
- `app/api/admin/auth/me/route.ts` - Nuevo endpoint para obtener usuario actual
- `app/api/admin/setup/route.ts` - Migrado a Supabase Auth

#### Base de Datos
- `lib/db/schema.ts` - Removida tabla `admin_users` y schemas relacionados
- `scripts/drop-admin-users-table.sql` - Script para limpiar la BD

### 3. Archivos que YA estaban usando Supabase Auth
- `app/admin/login/page.tsx` - ✅ Ya funcionando
- `app/admin/layout.tsx` - ✅ Ya funcionando  
- `app/admin/page.tsx` - ✅ Ya funcionando
- `components/admin/admin-sidebar.tsx` - ✅ Ya funcionando
- `app/admin/setup/page.tsx` - ✅ Ya funcionando

## Configuración de Usuarios Admin

### Crear Primer Admin (Setup)
1. Visita `/admin/setup` para crear el primer superadmin
2. El sistema verificará que no existan admins previos
3. Se creará un usuario en Supabase con `user_metadata.role = 'superadmin'`

### Crear Admins Adicionales
Para crear usuarios admin adicionales, usa el Admin Panel de Supabase:

1. Ve a Authentication > Users en tu proyecto Supabase
2. Crea un nuevo usuario
3. En la sección "User Metadata", agrega:
   ```json
   {
     "role": "admin",
     "username": "nombre_usuario"
   }
   ```

### Roles Disponibles
- `superadmin` - Acceso completo al sistema
- `admin` - Acceso estándar al panel de administración

## Limpieza de Base de Datos

Para limpiar la tabla `admin_users` obsoleta:

```sql
-- Ejecutar en tu base de datos PostgreSQL
DROP TABLE IF EXISTS admin_users CASCADE;
```

O usar el script proporcionado:
```bash
psql $DATABASE_URL -f scripts/drop-admin-users-table.sql
```

## Verificación

### Funcionalidades que deben funcionar:
- ✅ Login de admin en `/admin/login`
- ✅ Setup inicial en `/admin/setup`
- ✅ Dashboard de admin en `/admin`
- ✅ Gestión de productos en `/admin/products`
- ✅ Gestión de órdenes en `/admin/orders`
- ✅ Logout desde el sidebar
- ✅ Middleware de protección de rutas admin
- ✅ Verificación de roles (admin/superadmin)

### Variables de Entorno Requeridas
```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
```

## Notas Importantes

1. **Migración de Usuarios Existentes**: Los usuarios admin existentes en la tabla `admin_users` necesitarán ser recreados en Supabase Auth manualmente.

2. **Seguridad**: Supabase Auth maneja automáticamente:
   - Hashing seguro de contraseñas
   - Tokens JWT seguros
   - Renovación automática de sesiones
   - Protección contra ataques comunes

3. **Sesiones**: Las sesiones se manejan automáticamente por Supabase y se sincronizan entre pestañas.

4. **Middleware**: El middleware ahora usa Supabase para verificar autenticación y roles.

## Próximos Pasos

1. Ejecutar el script de limpieza de BD para remover `admin_users`
2. Verificar que todos los admins existentes puedan acceder
3. Probar todas las funcionalidades del panel admin
4. Considerar implementar recuperación de contraseña si es necesario