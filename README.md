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
│   ├── common/         # Componentes compartidos (Button, Card, Toast, etc.)
│   └── layout/         # Componentes de layout (Sidebar, Header, etc.)
├── context/            # Context API para gestión de estado
│   ├── LeadsContext.tsx
│   └── ToastContext.tsx
├── services/           # Servicios de persistencia y API
│   └── localStorage.ts
├── hooks/              # Custom hooks
├── pages/              # Páginas/vistas principales
├── utils/              # Funciones utilitarias
├── types/              # Definiciones de tipos TypeScript
├── styles/             # Estilos globales
└── config/             # Archivos de configuración
```

## Características

### Fase 3 - Gestión de Prospectos Completa (Implementada)

- **CRUD Completo de Leads**
  - Agregar nuevos leads con formulario validado
  - Editar leads existentes
  - Eliminar leads con confirmación
  - Formularios con validación en tiempo real

- **Sistema de Gestión de Estado**
  - Context API para gestión global de leads
  - Persistencia automática en localStorage
  - Sincronización en tiempo real

- **Sistema de Tags**
  - Agregar tags con Enter o coma
  - Filtrar leads por tags
  - Visualización de tags como badges

- **Búsqueda y Filtros Avanzados**
  - Búsqueda por nombre, empresa, cargo y email
  - Filtros por estado (Nuevo, Contactado, Respondió, etc.)
  - Filtros por tags dinámicos

- **Notificaciones Toast**
  - Sistema de notificaciones para feedback de acciones
  - Tipos: éxito, error, advertencia e información
  - Animaciones suaves

- **Estadísticas en Tiempo Real**
  - Total de leads
  - Nuevos leads (últimos 7 días)
  - Leads respondidos y convertidos
  - Tasa de conversión

- **Dashboard Actualizado**
  - Actividad reciente con datos reales
  - Próximas acciones basadas en el estado de los leads
  - Resumen de distribución por estado
  - Cálculos automáticos de métricas

- **Validaciones de Formulario**
  - Nombre y empresa requeridos (mínimo 2 caracteres)
  - Email con formato válido
  - URL de LinkedIn con formato válido
  - Teléfono con formato válido

- **Datos Iniciales de Demostración**
  - 4 leads de ejemplo pre-cargados
  - Estados variados para demostración
  - Tags de ejemplo

### Otras Características

- Navegación con sidebar
- Diseño responsive
- Tema moderno con Tailwind CSS
- TypeScript estricto
- Loading states
- Manejo de errores robusto

## Uso de la Aplicación

### Gestionar Leads

1. Navega a la sección "Leads" desde el sidebar
2. Haz clic en "Agregar Lead" para crear un nuevo contacto
3. Completa el formulario con la información del lead
4. Agrega tags presionando Enter o coma en el campo de tags
5. Haz clic en "Agregar Lead" para guardar

### Editar un Lead

1. En la lista de leads, haz clic en el icono de editar
2. Modifica la información necesaria
3. Haz clic en "Guardar Cambios"

### Eliminar un Lead

1. En la lista de leads, haz clic en el icono de eliminar
2. Confirma la eliminación en el diálogo

### Buscar y Filtrar

- Usa la barra de búsqueda para buscar por nombre, empresa, cargo o email
- Usa el selector de estado para filtrar por estado
- Usa el selector de tags para filtrar por tags específicos

## Persistencia de Datos

Los datos se almacenan automáticamente en localStorage del navegador bajo la clave `prospector-linkedin-leads`. Los datos persisten entre sesiones y recargas de página.
