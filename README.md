# Proyecto Backend: Monolito con Next.js y Node.js

## Descripción del Proyecto

Este proyecto consiste en una aplicación backend construida utilizando Next.js junto con Node.js, implementando una estructura monolítica y soportada por Docker para facilitar la configuración del entorno de desarrollo y la implementación. La aplicación tiene como característica principal la autorización mediante JWT (JSON Web Token), permitiendo un manejo seguro de autenticación y autorización de usuarios.

La arquitectura del proyecto sigue un enfoque modular, en el cual se han organizado funcionalidades clave (como autenticación, productos, usuarios, pedidos, etc.) en módulos independientes dentro de la carpeta `src/app/modules`.

## Tabla de Contenidos

1. [Arquitectura y Planificación](#arquitectura-y-planificación)
2. [Instalación y Configuración](#instalación-y-configuración)
3. [Uso de Docker](#uso-de-docker)
4. [Desarrollo del Backend](#desarrollo-del-backend)
5. [Prácticas de DevOps](#prácticas-de-devops)
6. [Integración en la Nube](#integración-en-la-nube)
7. [Conclusión](#conclusión)

## Arquitectura y Planificación

La arquitectura del proyecto sigue un enfoque monolítico modular, que permite mantener una estructura clara y organizada mientras se centralizan los servicios backend. Este enfoque se seleccionó por las siguientes razones:

- **Simplicidad**: Un monolito facilita el desarrollo inicial al tener todo el código en una sola aplicación, especialmente cuando el equipo es pequeño.
- **Mantenimiento Modular**: Cada módulo (por ejemplo, `auth`, `product`, `order`) tiene sus propias responsabilidades y lógica, facilitando el mantenimiento y la escalabilidad futura.
- **Facilidad de Uso**: Al no tener que lidiar con la comunicación entre microservicios, se minimizan problemas de latencia y se acelera el desarrollo.

### Módulos y Componentes

- **Auth**: Responsable de la autenticación y autorización de usuarios, implementando JWT para asegurar las transacciones.
- **Product, Cart, Order, User, etc.**: Cada uno maneja funcionalidades específicas dentro de la aplicación. Cada módulo tiene controladores, servicios y, en algunos casos, repositorios para manejar la lógica de negocio.
- **Shared**: Contiene utilidades comunes que son compartidas entre los diferentes módulos.

## Instalación y Configuración

### Prerrequisitos

- **Node.js**: Versión 14+.
- **Yarn**: Para la administración de paquetes.
- **Docker**: Para la orquestación de contenedores.

### Instalación

1. Clonar el repositorio:

   ```bash
   git clone
   cd backend/monolithic
   ```

2. Instalar dependencias:

   ```bash
   yarn install
   ```

3. Configurar las variables de entorno:

   - Copiar el archivo `.env.example` a `.env` y llenar las variables necesarias, incluyendo las claves secretas de JWT.

4. Construcción de la aplicación:

   ```bash
   yarn build
   ```

### Ejecución en Desarrollo

```bash
yarn start:dev
```

## Uso de Docker

El proyecto cuenta con un entorno de contenedores Docker, que simplifica el proceso de despliegue y la replicabilidad del entorno de desarrollo.

### Archivos de Configuración

- **Dockerfile**: Define la imagen para el proyecto. Contiene instrucciones para instalar las dependencias y construir la aplicación.
- **docker-compose.yml**: Orquesta la configuración de servicios (por ejemplo, base de datos, backend). Esto facilita la creación y ejecución de múltiples contenedores.

### Comandos Docker

1. Construir la imagen:

   ```bash
   docker build -t backend-app .
   ```

2. Ejecutar la aplicación utilizando Docker Compose:

   ```bash
   docker-compose up
   ```

Esto iniciará los servicios definidos en el `docker-compose.yml`, incluyendo la base de datos y el servidor de backend.

## Desarrollo del Backend

El backend está diseñado utilizando **Next.js** con **Node.js**, siguiendo las mejores prácticas de desarrollo de software para garantizar una aplicación robusta y escalable.

### Endpoints RESTful

Cada módulo expone endpoints RESTful. Un ejemplo sería:

- **Autenticación** (`auth`):
  - `POST /auth/login`: Inicia sesión y devuelve un token JWT.
  - `POST /auth/register`: Registra a un nuevo usuario.

Los endpoints están desarrollados siguiendo los principios REST, permitiendo operaciones CRUD sobre los recursos de la aplicación.

### Autorización con JWT

La autenticación utiliza **JWT** (JSON Web Tokens). Después de un inicio de sesión exitoso, el usuario recibe un token que debe ser enviado en los encabezados (`Authorization: Bearer <token>`) para acceder a recursos protegidos.

## Prácticas de DevOps

El proyecto incluye varias prácticas de **DevOps** para asegurar la calidad del código y la eficiencia del desarrollo:

- **Husky**: Utilizado para ejecutar hooks de Git, como verificaciones de `lint` antes de los commits.
- **Docker**: Para garantizar que el entorno de desarrollo y producción sean consistentes.
- **.env**: Uso de variables de entorno para configurar el sistema sin tener que modificar el código fuente.

## Integración en la Nube

La integración en la nube no está incluida directamente en este proyecto, pero la configuración Docker permite un despliegue sencillo en plataformas como **AWS**, **GCP**, o **Azure**. Es posible utilizar **ECS (Elastic Container Service)** para desplegar los contenedores y escalar la aplicación según sea necesario.
