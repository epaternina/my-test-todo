# To-Do App - Prueba Técnica (Ionic & Angular)

Esta es una aplicación de gestión de tareas (To-Do List) desarrollada como parte de una prueba técnica. La aplicación permite gestionar tareas y categorías, con persistencia de datos local y configuración remota.

## 🚀 Funcionalidades

- **Gestión de Tareas**: Crear, completar y eliminar tareas.
- **Categorías Personalizadas**: Sistema completo para añadir, editar y eliminar categorías para organizar las tareas.
- **Persistencia Local**: Uso de `@ionic/storage-angular` para que los datos no se pierdan al cerrar la app.
- **Filtrado**: Visualización de tareas por categorías.
- **Feature Flags**: Integración con **Firebase Remote Config** para controlar la funcionalidad de borrado de forma remota.

## 🛠️ Tecnologías Utilizadas

- **Ionic Framework** (v7+)
- **Angular**
- **Firebase** (Remote Config)
- **Capacitor** (Para despliegue nativo)
- **Ionic Storage** (Persistencia)

## 📦 Instalación y Configuración

## Configuración de Firebase
El proyecto requiere un archivo `src/environments/environment.ts` con las credenciales de Firebase y el parámetro `task_delete_enabled` configurado en Remote Config.


## Instalación
1. Clonar el repositorio.  git clone https://github.com/epaternina/my-test-todo.git
2. Navegar a la carpeta   cd my-test-todo
3. Ejecutar `npm install`.
4. Ejecutar `ionic serve` para ver en el navegador.

