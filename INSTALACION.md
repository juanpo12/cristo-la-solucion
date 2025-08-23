# Guía de Instalación y Configuración - Cristo La Solución

Esta guía proporciona instrucciones detalladas para configurar el entorno de desarrollo y comenzar a trabajar en el sitio web de Cristo La Solución.

## Requisitos Previos

- **Node.js**: Versión 18.0 o superior
- **npm** o **yarn**: Gestor de paquetes de Node.js
- **Git**: Para control de versiones
- **Editor de código**: Visual Studio Code (recomendado)

## Instalación

### 1. Clonar el Repositorio

```bash
# Usando HTTPS
git clone https://github.com/tu-usuario/cristo-la-solucion.git

# O usando SSH
git clone git@github.com:tu-usuario/cristo-la-solucion.git

# Navegar al directorio del proyecto
cd cristo-la-solucion
```

### 2. Instalar Dependencias

```bash
# Usando npm
npm install

# O usando yarn
yarn install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

```
RESEND_API_KEY=tu_clave_api_resend
```

Para obtener una clave API de Resend:
1. Regístrate en [Resend](https://resend.com)
2. Crea una nueva API key en el dashboard
3. Copia la clave y pégala en el archivo `.env.local`

### 4. Iniciar el Servidor de Desarrollo

```bash
# Usando npm
npm run dev

# O usando yarn
yarn dev
```

El servidor de desarrollo estará disponible en [http://localhost:3000](http://localhost:3000).

## Estructura del Proyecto

Familiarízate con la estructura principal del proyecto:

- `/app`: Rutas y páginas (Next.js App Router)
- `/components`: Componentes reutilizables
- `/lib`: Utilidades y hooks personalizados
- `/public`: Archivos estáticos

## Extensiones Recomendadas para VS Code

Para mejorar tu experiencia de desarrollo, instala estas extensiones:

- **ESLint**: Para linting de código
- **Prettier**: Para formateo de código
- **Tailwind CSS IntelliSense**: Para autocompletado de clases de Tailwind
- **PostCSS Language Support**: Para soporte de sintaxis PostCSS
- **TypeScript**: Para soporte de TypeScript

## Comandos Útiles

```bash
# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Iniciar servidor de producción
npm start

# Ejecutar linting
npm run lint
```

## Flujo de Trabajo de Desarrollo

1. **Crear una Rama**: Antes de comenzar a trabajar en una nueva funcionalidad o corrección, crea una rama desde `main`:
   ```bash
   git checkout -b feature/nombre-de-la-funcionalidad
   ```

2. **Desarrollo**: Implementa los cambios necesarios siguiendo las convenciones de código y la guía de estilo.

3. **Pruebas Locales**: Asegúrate de que tus cambios funcionan correctamente en tu entorno local.

4. **Linting**: Ejecuta `npm run lint` para verificar que tu código cumple con los estándares del proyecto.

5. **Commit**: Realiza commits con mensajes descriptivos:
   ```bash
   git add .
   git commit -m "feat: añadir funcionalidad X"
   ```

6. **Push**: Sube tus cambios al repositorio remoto:
   ```bash
   git push origin feature/nombre-de-la-funcionalidad
   ```

7. **Pull Request**: Crea un Pull Request a `main` y espera revisión.

## Solución de Problemas Comunes

### Error: Cannot find module

Si encuentras errores de módulos no encontrados:

```bash
# Limpiar caché de npm
npm cache clean --force

# Reinstalar dependencias
rm -rf node_modules
npm install
```

### Errores de TypeScript

Si encuentras errores de TypeScript que no puedes resolver:

1. Verifica que estás usando la versión correcta de TypeScript
2. Ejecuta `npx tsc --noEmit` para verificar errores de tipo
3. Consulta la documentación de TypeScript para soluciones específicas

### Problemas con Next.js

Si encuentras problemas específicos de Next.js:

1. Verifica que estás siguiendo las convenciones del App Router
2. Consulta la [documentación oficial de Next.js](https://nextjs.org/docs)
3. Limpia la caché de Next.js: `rm -rf .next`

## Recursos Adicionales

- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de React](https://react.dev/)
- [Documentación de Tailwind CSS](https://tailwindcss.com/docs)
- [Documentación de TypeScript](https://www.typescriptlang.org/docs/)

## Contacto y Soporte

Si tienes preguntas o problemas, contacta al equipo de desarrollo:

- **Email**: [correo-del-equipo@ejemplo.com]
- **Slack**: Canal #cristo-la-solucion

---

Esta guía de instalación está diseñada para ayudarte a comenzar rápidamente con el desarrollo del sitio web de Cristo La Solución. Si encuentras algún problema o tienes sugerencias para mejorar esta guía, por favor comunícate con el equipo de desarrollo.