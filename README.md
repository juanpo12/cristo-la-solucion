# Cristo La Solución - Sitio Web Oficial

## Descripción del Proyecto

Este proyecto es el sitio web oficial de la iglesia Cristo La Solución, desarrollado con Next.js 15 y React 19. El sitio web está diseñado para proporcionar información sobre la iglesia, sus actividades, grupos, pastores, y ofrecer recursos espirituales a través de una tienda en línea.

## Tecnologías Utilizadas

- **Frontend**: Next.js 15, React 19
- **Estilos**: Tailwind CSS, CSS Modules
- **UI Components**: Componentes personalizados basados en Radix UI
- **Animaciones**: Framer Motion
- **Formularios**: Gestión de estado personalizada con hooks
- **Email**: Integración con Resend API

## Estructura del Proyecto

```
├── app/                  # Estructura de rutas de Next.js App Router
│   ├── admin/            # Área de administración
│   ├── api/              # API Routes para backend
│   ├── contacto/         # Página de contacto
│   ├── grupos/           # Página de grupos
│   ├── pastores/         # Página de pastores
│   ├── tienda/           # Tienda en línea
│   ├── videos/           # Sección de videos
│   ├── layout.tsx        # Layout principal de la aplicación
│   └── page.tsx          # Página principal
├── components/           # Componentes reutilizables
│   ├── ui/               # Componentes UI básicos
│   └── [component].tsx   # Componentes específicos
├── lib/                  # Utilidades y hooks personalizados
│   ├── hooks/            # Custom hooks
│   └── utils.ts          # Funciones de utilidad
└── public/               # Archivos estáticos
```

## Características Principales

### 1. Página Principal
La página principal presenta secciones como:
- Hero con información de la iglesia
- Visión y misión
- Grupos y ministerios
- Horarios de reuniones
- Tienda de recursos
- Sección de oración
- Formulario de contacto

### 2. Navegación
El sitio cuenta con un header responsive que permite navegar entre las diferentes secciones y páginas del sitio.

### 3. Tienda en Línea
Una tienda que ofrece recursos espirituales como libros y materiales, con funcionalidades de:
- Carrito de compras (gestionado con hooks personalizados)
- Visualización de productos
- Categorías de productos

### 4. Formulario de Contacto
Formulario para enviar peticiones de oración, consultas y mensajes, integrado con API de envío de emails.

### 5. Secciones Informativas
Páginas dedicadas a información sobre pastores, grupos, ministerios y actividades de la iglesia.

## Configuración del Entorno de Desarrollo

### Requisitos Previos
- Node.js 18.0 o superior
- npm o yarn

### Instalación

1. Clonar el repositorio:
```bash
git clone [url-del-repositorio]
cd cristo-la-solucion
```

2. Instalar dependencias:
```bash
npm install
# o
yarn install
```

3. Variables de entorno:
Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:
```
RESEND_API_KEY=tu_clave_api_resend
```

4. Iniciar el servidor de desarrollo:
```bash
npm run dev
# o
yarn dev
```

5. Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

## Despliegue

El proyecto está configurado para ser desplegado en Vercel:

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno en el panel de Vercel
3. Despliega automáticamente con cada push a la rama principal

## Estructura de Componentes

### Componentes UI Base
- `Button`: Botones personalizados con variantes
- `Card`: Tarjetas para mostrar contenido
- `Input`: Campos de entrada estilizados
- `Select`: Componentes de selección
- `Textarea`: Áreas de texto para formularios

### Componentes de Página
- `Header`: Navegación principal
- `Hero`: Sección principal de la página de inicio
- `Vision`: Información sobre la visión de la iglesia
- `Groups`: Muestra los diferentes grupos y ministerios
- `Meetings`: Horarios de reuniones
- `StoreShowcase`: Muestra destacada de productos de la tienda
- `Prayer`: Sección de oración
- `GivingSection`: Información sobre donaciones
- `Footer`: Pie de página con información de contacto

## Hooks Personalizados

- `useCart`: Gestión del carrito de compras
- `useContactForm`: Manejo del formulario de contacto
- `useFavorites`: Gestión de productos favoritos
- `useShare`: Funcionalidad para compartir contenido

## API Routes

- `/api/contact`: Maneja el envío de formularios de contacto
- `/api/youtube`: Integración con YouTube para mostrar videos

## Contribución

1. Haz un fork del repositorio
2. Crea una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Haz commit de tus cambios (`git commit -m 'Add some amazing feature'`)
4. Push a la rama (`git push origin feature/amazing-feature`)
5. Abre un Pull Request

## Licencia

Este proyecto es propiedad de Cristo La Solución. Todos los derechos reservados.
