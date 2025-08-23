# Guía de Estilo - Cristo La Solución

Esta guía de estilo define los estándares de diseño y desarrollo para mantener la consistencia visual y funcional en el sitio web de Cristo La Solución.

## Paleta de Colores

### Colores Primarios

- **Azul Principal**: `#2563eb` - Color principal de la marca
- **Azul Oscuro**: `#1e40af` - Para hover y elementos activos
- **Azul Claro**: `#3b82f6` - Para elementos secundarios

### Colores Secundarios

- **Gris Oscuro**: `#1f2937` - Para textos principales
- **Gris Medio**: `#4b5563` - Para textos secundarios
- **Gris Claro**: `#9ca3af` - Para bordes y separadores

### Colores de Acento

- **Verde**: `#10b981` - Para elementos de éxito
- **Rojo**: `#ef4444` - Para errores y alertas
- **Amarillo**: `#f59e0b` - Para advertencias

### Fondos

- **Blanco**: `#ffffff` - Fondo principal
- **Gris Muy Claro**: `#f8fafc` - Fondo secundario
- **Azul Muy Claro**: `#eff6ff` - Fondo para secciones destacadas

## Tipografía

### Fuentes

- **Poppins**: Fuente principal para títulos y encabezados
  - Pesos: 300 (Light), 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
- **Inter**: Fuente secundaria para cuerpo de texto
  - Pesos: 400 (Regular), 500 (Medium)

### Jerarquía de Texto

- **H1**: 48px/60px (móvil: 36px/44px), Poppins Light
- **H2**: 36px/44px (móvil: 30px/38px), Poppins Light
- **H3**: 24px/32px (móvil: 20px/28px), Poppins Medium
- **H4**: 20px/28px (móvil: 18px/26px), Poppins Medium
- **Cuerpo Grande**: 18px/28px, Inter Regular
- **Cuerpo**: 16px/24px, Inter Regular
- **Cuerpo Pequeño**: 14px/20px, Inter Regular
- **Pie de Página**: 12px/16px, Inter Regular

## Componentes UI

### Botones

#### Variantes

1. **Primario**
   - Fondo: Azul Principal (`#2563eb`)
   - Texto: Blanco
   - Hover: Azul Oscuro (`#1e40af`)
   - Bordes: Ninguno
   - Sombra: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`

2. **Secundario**
   - Fondo: Blanco
   - Texto: Azul Principal (`#2563eb`)
   - Hover: Gris Muy Claro (`#f8fafc`)
   - Bordes: 1px Azul Principal (`#2563eb`)
   - Sombra: `0 1px 2px 0 rgba(0, 0, 0, 0.05)`

3. **Terciario**
   - Fondo: Transparente
   - Texto: Gris Oscuro (`#1f2937`)
   - Hover: Gris Muy Claro (`#f8fafc`)
   - Bordes: Ninguno
   - Sombra: Ninguna

#### Tamaños

- **Pequeño**: Padding 8px 16px, Texto 14px
- **Mediano**: Padding 12px 20px, Texto 16px
- **Grande**: Padding 16px 24px, Texto 18px

### Tarjetas

- **Bordes**: Radio 8px
- **Sombra**: `0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`
- **Padding**: 24px
- **Fondo**: Blanco
- **Bordes**: 1px Gris Claro (`#e5e7eb`)

### Formularios

#### Campos de Entrada

- **Altura**: 44px
- **Padding**: 12px 16px
- **Bordes**: 1px Gris Claro (`#d1d5db`)
- **Radio**: 6px
- **Foco**: Borde Azul Principal (`#2563eb`), Sombra `0 0 0 3px rgba(37, 99, 235, 0.1)`
- **Error**: Borde Rojo (`#ef4444`), Sombra `0 0 0 3px rgba(239, 68, 68, 0.1)`

#### Áreas de Texto

- **Padding**: 12px 16px
- **Bordes**: 1px Gris Claro (`#d1d5db`)
- **Radio**: 6px
- **Altura Mínima**: 120px

#### Selectores

- **Altura**: 44px
- **Padding**: 12px 16px
- **Bordes**: 1px Gris Claro (`#d1d5db`)
- **Radio**: 6px
- **Icono**: Chevron Down en Gris Medio (`#4b5563`)

## Espaciado

### Sistema de Espaciado

- **4px**: Espaciado mínimo
- **8px**: Espaciado muy pequeño
- **12px**: Espaciado pequeño
- **16px**: Espaciado base
- **24px**: Espaciado medio
- **32px**: Espaciado grande
- **48px**: Espaciado muy grande
- **64px**: Espaciado extra grande
- **96px**: Espaciado máximo

### Márgenes de Sección

- **Margen Superior**: 64px (móvil: 48px)
- **Margen Inferior**: 64px (móvil: 48px)
- **Padding Horizontal**: 24px (móvil: 16px)

## Iconografía

- **Biblioteca**: Lucide React
- **Tamaños**:
  - Pequeño: 16px
  - Mediano: 20px
  - Grande: 24px
- **Colores**: Heredados del texto o específicos según contexto
- **Stroke**: 2px

## Imágenes

### Héroes y Banners

- **Relación de Aspecto**: 16:9 o 21:9
- **Resolución Mínima**: 1920x1080px
- **Formato**: JPEG para fotografías, PNG para gráficos con transparencia
- **Optimización**: Usar el componente Image de Next.js

### Miniaturas y Tarjetas

- **Relación de Aspecto**: 16:9 o 1:1 (cuadrado)
- **Resolución**: 600x600px para cuadradas, 600x338px para 16:9
- **Radio de Bordes**: 8px

### Productos

- **Relación de Aspecto**: 1:1 (cuadrado)
- **Resolución**: 800x800px
- **Fondo**: Blanco o transparente
- **Estilo**: Consistente en iluminación y ángulo

## Animaciones y Transiciones

### Duración

- **Rápida**: 150ms
- **Media**: 300ms
- **Lenta**: 500ms

### Curvas de Aceleración

- **Estándar**: `cubic-bezier(0.4, 0, 0.2, 1)`
- **Entrada**: `cubic-bezier(0.0, 0, 0.2, 1)`
- **Salida**: `cubic-bezier(0.4, 0, 1, 1)`

### Hover y Focus

- **Escala**: Transform scale(1.05)
- **Opacidad**: Transition opacity
- **Color**: Transition color

## Responsive Design

### Breakpoints

- **sm**: 640px (Móviles grandes)
- **md**: 768px (Tablets)
- **lg**: 1024px (Laptops)
- **xl**: 1280px (Desktops)
- **2xl**: 1536px (Pantallas grandes)

### Estrategias

- **Mobile First**: Diseñar primero para móviles y luego expandir
- **Flexbox/Grid**: Usar para layouts adaptables
- **Imágenes Responsivas**: Usar srcset y sizes con el componente Image
- **Texto Responsivo**: Ajustar tamaños de fuente en breakpoints clave

## Accesibilidad

### Contraste

- **Texto Normal**: Ratio mínimo 4.5:1
- **Texto Grande**: Ratio mínimo 3:1
- **Elementos UI**: Ratio mínimo 3:1

### Enfoque

- **Outline**: Visible en todos los elementos interactivos
- **Skip Links**: Implementar para navegación por teclado

### Semántica

- **HTML Semántico**: Usar elementos apropiados (nav, main, section, etc.)
- **ARIA**: Implementar roles y atributos cuando sea necesario
- **Alt Text**: Proporcionar para todas las imágenes

## Convenciones de Código

### CSS/Tailwind

- Usar clases utilitarias de Tailwind
- Agrupar clases por categoría (layout, spacing, typography, etc.)
- Extraer componentes para patrones repetitivos

### Componentes React

- Un componente por archivo
- Nombres en PascalCase
- Props tipadas con TypeScript
- Comentarios para funcionalidades complejas

### Estructura de Archivos

- Organizar por funcionalidad o tipo
- Mantener componentes relacionados juntos
- Usar index.ts para exportaciones

---

Esta guía de estilo debe ser seguida por todos los desarrolladores que trabajen en el proyecto para mantener la consistencia visual y funcional del sitio web de Cristo La Solución.