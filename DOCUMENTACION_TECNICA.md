# Documentación Técnica - Cristo La Solución

Este documento proporciona información técnica detallada sobre el sitio web de Cristo La Solución para desarrolladores y colaboradores del proyecto.

## Arquitectura del Proyecto

### Tecnologías Principales

- **Framework**: Next.js 15 (App Router)
- **Biblioteca UI**: React 19
- **Estilos**: Tailwind CSS con configuración personalizada
- **Componentes UI**: Componentes personalizados basados en Radix UI
- **Animaciones**: Framer Motion
- **Gestión de Estado**: Hooks personalizados (useReducer, useState)
- **Envío de Emails**: Integración con Resend API

## Estructura de Directorios

### `/app` - Estructura de Rutas (Next.js App Router)

- **`/app/layout.tsx`**: Layout principal que incluye configuración de fuentes (Inter, Poppins) y metadatos.
- **`/app/page.tsx`**: Página principal que compone los diferentes componentes de la landing page.
- **`/app/contacto`**: Página de contacto con formulario.
- **`/app/grupos`**: Sección de grupos y ministerios.
- **`/app/pastores`**: Información sobre los pastores.
- **`/app/tienda`**: Tienda en línea con productos.
- **`/app/videos`**: Sección de videos y recursos multimedia.
- **`/app/api`**: API Routes para funcionalidades de backend.
  - **`/app/api/contact`**: Endpoint para el formulario de contacto.
  - **`/app/api/youtube`**: Integración con YouTube API.

### `/components` - Componentes Reutilizables

- **`/components/ui`**: Componentes UI base (Button, Card, Input, etc.)
- **`/components/header.tsx`**: Navegación principal con lógica de scroll y menú móvil.
- **`/components/hero.tsx`**: Sección principal con imagen de fondo y CTA.
- **`/components/store-showcase.tsx`**: Muestra de productos de la tienda.
- **`/components/contact-form.tsx`**: Formulario de contacto reutilizable.
- **`/components/footer.tsx`**: Pie de página con información de contacto.
- **`/components/vision.tsx`**: Sección de visión y misión.
- **`/components/groups.tsx`**: Componente para mostrar grupos y ministerios.
- **`/components/meetings.tsx`**: Horarios de reuniones.
- **`/components/prayer.tsx`**: Sección de oración.
- **`/components/giving-section.tsx`**: Información sobre donaciones.

### `/lib` - Utilidades y Hooks

- **`/lib/hooks/use-cart.ts`**: Hook para gestionar el carrito de compras.
- **`/lib/hooks/use-contact-form.ts`**: Hook para manejar el formulario de contacto.
- **`/lib/hooks/use-favorites.ts`**: Hook para gestionar productos favoritos.
- **`/lib/hooks/use-share.ts`**: Hook para compartir contenido.
- **`/lib/utils.ts`**: Funciones de utilidad generales.

## Configuración de Tailwind CSS

El proyecto utiliza Tailwind CSS con una configuración personalizada en `tailwind.config.ts` que incluye:

- Fuentes personalizadas (Poppins)
- Colores personalizados para la iglesia
- Extensiones para animaciones
- Configuración de contenedores

## Gestión de Estado

### Carrito de Compras

El carrito de compras utiliza un patrón de reducer con las siguientes acciones:

- `ADD_ITEM`: Añadir un producto al carrito
- `REMOVE_ITEM`: Eliminar un producto del carrito
- `UPDATE_QUANTITY`: Actualizar la cantidad de un producto
- `CLEAR_CART`: Vaciar el carrito
- `LOAD_CART`: Cargar el carrito desde localStorage

Los datos del carrito se persisten en localStorage para mantener el estado entre sesiones.

### Formulario de Contacto

El formulario de contacto utiliza un hook personalizado que maneja:

- Validación de campos
- Envío de datos a la API
- Gestión de estados de carga y éxito
- Manejo de errores

## API Routes

### `/api/contact`

Endpoint para el formulario de contacto que:

1. Recibe datos del formulario (nombre, email, teléfono, asunto, mensaje, tipo)
2. Valida los datos recibidos
3. Envía un email utilizando Resend API
4. Devuelve una respuesta de éxito o error

### `/api/youtube`

Endpoint para integración con YouTube que:

1. Obtiene videos del canal de la iglesia
2. Formatea los datos para su uso en el frontend
3. Implementa caché para optimizar rendimiento

## Componentes UI Personalizados

Los componentes UI base están en `/components/ui` y siguen un patrón consistente:

- Utilizan Tailwind CSS para estilos
- Implementan variantes con `class-variance-authority`
- Son accesibles siguiendo las mejores prácticas de WAI-ARIA
- Utilizan `clsx` y `tailwind-merge` para combinar clases de manera eficiente

## Navegación y Routing

El sitio utiliza el App Router de Next.js 15 con las siguientes características:

- Navegación entre páginas con `Link` y `useRouter`
- Scroll suave a secciones con offset para el header fijo
- Detección de sección activa basada en la posición de scroll
- Soporte para navegación con hash desde otras páginas

## Responsive Design

El diseño es completamente responsive con breakpoints en:

- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

Se utilizan clases de Tailwind como `sm:`, `md:`, `lg:` para adaptar el diseño a diferentes tamaños de pantalla.

## Optimización de Rendimiento

- Imágenes optimizadas con el componente `Image` de Next.js
- Carga diferida de componentes no críticos
- Optimización de fuentes con `next/font`
- Minimización de JavaScript con el compilador de Next.js

## Convenciones de Código

- **Nomenclatura**: PascalCase para componentes, camelCase para funciones y variables
- **Tipado**: TypeScript estricto para todos los componentes y funciones
- **Estilos**: Tailwind CSS con clases semánticas
- **Componentes**: Componentes funcionales con hooks

## Guía de Contribución

### Flujo de Trabajo

1. Crear una rama desde `main` para la nueva funcionalidad
2. Desarrollar y probar localmente
3. Asegurar que el código pasa el linting (`npm run lint`)
4. Crear un Pull Request a `main`
5. Esperar revisión y aprobación

### Convenciones de Commits

Utilizar mensajes de commit descriptivos con el siguiente formato:

```
<tipo>(<alcance>): <descripción>

[cuerpo opcional]

[pie opcional]
```

Donde `<tipo>` puede ser:
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Cambios que no afectan el código (formato, espacios, etc)
- `refactor`: Refactorización de código
- `test`: Adición o corrección de tests
- `chore`: Cambios en el proceso de build o herramientas auxiliares

## Variables de Entorno

El proyecto utiliza las siguientes variables de entorno:

- `RESEND_API_KEY`: Clave API para el servicio de envío de emails

Estas variables deben configurarse en un archivo `.env.local` para desarrollo local y en el panel de configuración del proveedor de hosting para producción.

## Despliegue

### Vercel (Recomendado)

1. Conectar el repositorio a Vercel
2. Configurar las variables de entorno
3. Desplegar automáticamente con cada push a `main`

### Hosting Alternativo

Para desplegar en otros proveedores:

1. Construir el proyecto: `npm run build`
2. Iniciar el servidor: `npm start`
3. Configurar las variables de entorno en el proveedor

## Mantenimiento

### Actualizaciones

Para mantener el proyecto actualizado:

1. Actualizar dependencias regularmente: `npm update`
2. Revisar actualizaciones de seguridad: `npm audit`
3. Mantener Next.js y React en versiones estables

### Monitoreo

Se recomienda implementar:

- Analytics para seguimiento de usuarios
- Monitoreo de errores con herramientas como Sentry
- Pruebas de rendimiento periódicas

---

Esta documentación técnica está destinada a desarrolladores y colaboradores del proyecto. Para información general sobre el sitio, consultar el archivo README.md.