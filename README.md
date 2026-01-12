# Prospector LinkedIn

Aplicación web para gestionar y realizar seguimiento de leads de LinkedIn.

## Tecnologías

- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- shadcn/ui

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Iniciar el servidor de desarrollo:
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run preview` - Previsualiza la build de producción
- `npm run lint` - Ejecuta el linter

## Estructura del Proyecto

```
src/
├── components/          # Componentes React
│   ├── common/         # Componentes compartidos (Button, Card, etc.)
│   └── layout/         # Componentes de layout (Sidebar, Header, etc.)
├── hooks/              # Custom hooks
├── pages/              # Páginas/vistas principales
├── utils/              # Funciones utilitarias
├── types/              # Definiciones de tipos TypeScript
├── styles/             # Estilos globales
└── config/             # Archivos de configuración
```

## Características

- Dashboard con resumen de actividad
- Gestión de leads
- Sistema de campañas
- Navegación con sidebar
- Diseño responsive
- Tema moderno con Tailwind CSS
