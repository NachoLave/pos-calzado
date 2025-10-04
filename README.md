# Sistema de Punto de Venta para Calzado

Sistema completo de gestión de punto de venta diseñado específicamente para tiendas de calzado con múltiples sucursales.

## Características Principales

- **Gestión de Usuarios y Permisos**: Sistema de roles (dueño/empleado) con permisos granulares
- **Multi-Sucursal**: Gestión de múltiples sucursales con stock independiente
- **Productos con Variantes Dinámicas**: Define tus propias variantes (talle, color, peso, etc.)
- **Listas de Precio**: Crea múltiples listas de precio con descuentos o recargos
- **Gestión de Proveedores**: Administra tus proveedores y tipos de producto
- **Dashboard en Tiempo Real**: Estadísticas de ventas y reportes
- **Control de Stock**: Gestión de inventario por sucursal

## Requisitos Previos

- Node.js 18+ 
- MongoDB (local o Atlas)
- npm o yarn

## Instalación Local

1. **Clonar o descargar el proyecto**

2. **Instalar dependencias**
\`\`\`bash
npm install
\`\`\`

3. **Configurar variables de entorno**

Crea un archivo `.env.local` en la raíz del proyecto con las siguientes variables:

\`\`\`env
MONGODB_URI=mongodb://localhost:27017/pos-calzado
# O si usas MongoDB Atlas:
# MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/pos-calzado

JWT_SECRET=tu-secreto-jwt-super-seguro-cambialo-en-produccion
\`\`\`

4. **Inicializar la base de datos**

Ejecuta el proyecto:
\`\`\`bash
npm run dev
\`\`\`

Luego visita: `http://localhost:3000/admin/init-db`

Haz clic en "Crear Índices y Datos de Prueba" para inicializar la base de datos con datos de ejemplo.

5. **Iniciar sesión**

Usa las credenciales por defecto:
- **Usuario**: `admin`
- **Contraseña**: `admin.123`

## Estructura del Proyecto

\`\`\`
├── app/                      # Páginas y rutas de Next.js
│   ├── api/                 # API Routes
│   │   ├── auth/           # Autenticación
│   │   ├── products/       # Gestión de productos
│   │   ├── stock/          # Control de inventario
│   │   └── ...
│   ├── login/              # Página de login
│   ├── stock/              # Gestión de productos
│   ├── ventas/             # Punto de venta
│   ├── configuracion/      # Configuración del sistema
│   └── page.tsx            # Dashboard principal
├── components/              # Componentes React
│   ├── ui/                 # Componentes de UI (shadcn)
│   ├── products/           # Componentes de productos
│   └── config/             # Componentes de configuración
├── lib/                     # Utilidades y configuración
│   ├── auth/               # Sistema de autenticación
│   ├── db/                 # Modelos y esquemas de MongoDB
│   └── mongodb.ts          # Conexión a MongoDB
└── public/                  # Archivos estáticos
\`\`\`

## Tecnologías Utilizadas

- **Framework**: Next.js 15 (App Router)
- **Base de Datos**: MongoDB
- **Autenticación**: JWT con bcryptjs
- **UI**: shadcn/ui + Tailwind CSS
- **Iconos**: Lucide React
- **Gráficos**: Recharts

## Funcionalidades por Módulo

### Dashboard
- Ventas del día y del mes
- Ventas por sucursal
- Proveedor más vendido
- Gráficos de ventas mensuales

### Stock
- Listado de productos con variantes
- Búsqueda y filtrado
- Creación de productos con variantes dinámicas
- Gestión de stock por sucursal
- Control de costos (con permisos)

### Ventas
- Interfaz de punto de venta
- Búsqueda rápida de productos
- Múltiples métodos de pago
- Registro de depósitos

### Configuración
- Gestión de proveedores
- Tipos de producto con descuento en efectivo
- Listas de precio personalizadas

## Permisos del Sistema

El sistema incluye los siguientes permisos configurables:

- `verDatosInicio`: Ver dashboard principal
- `verReportes`: Acceder a reportes
- `verVentasTodasSucursales`: Ver ventas de todas las sucursales
- `administrarCostos`: Ver y editar costos de productos
- `verVentasOtrasSucursales`: Ver ventas de otras sucursales
- `verVentasTiendaNube`: Ver ventas de Tienda Nube
- `administrarStockOtrasSucursales`: Gestionar stock de otras sucursales

## Desarrollo

\`\`\`bash
# Modo desarrollo
npm run dev

# Build para producción
npm run build

# Iniciar en producción
npm start
\`\`\`

## Notas Importantes

- El usuario admin tiene todos los permisos habilitados
- Los datos de prueba incluyen 2 sucursales, 3 productos base con múltiples variantes
- El sistema respeta los permisos de usuario en todas las operaciones
- Las contraseñas se almacenan hasheadas con bcrypt
- Las sesiones usan JWT con expiración de 7 días

## Soporte

Para problemas o preguntas, revisa la documentación del código o contacta al equipo de desarrollo.
