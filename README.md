# Swapster

Este repositorio contiene una aplicación web para la compra-venta de productos mediante la publicación de anuncios. Correspondiente al proyecto de la asignatura de Ingeniería Web de 3º de Ingeniería Informática.

## Requisitos Previos

Antes de comenzar, asegúrese de tener instalados los siguientes programas en su máquina:

- [Node.js](https://nodejs.org/) (versión 12 o superior)
- [npm](https://www.npmjs.com/) (incluido con Node.js)


Clone este repositorio en su máquina local:

    git clone https://github.com/i12cacrm/Swapster
    cd api

## Servidor

### Instalación


1. Navegue a la carpeta `api` situada en la carpeta raíz del proyecto:

    ```bash
    cd api
    ```

2. Incluya en el archivo `.env` lo siguiente en caso de que no se encuentre:

    ```env
    DB_URI = mongodb+srv://admin:root1234@cluster-iw.miy9lgu.mongodb.net/Swapster2
    ```

3. Instale las dependencias del servidor:

    ```bash
    npm install
    ```

#### Ejecución

1. Inicie el servidor:

    ```bash
    npm run start
    ```

El servidor debería estar ejecutándose en `http://localhost:5000`.



## Cliente

### Instalación

1. Navegue a la carpeta `client` situada en la carpeta raíz del proyecto:

    ```bash
    cd client
    ```

2. Instale las dependencias del cliente:

    ```bash
    npm install
    ```

### Ejecución

1. Inicie el cliente:

    ```bash
    npm start
    ```

La aplicación cliente debería abrirse automáticamente en `http://localhost:3000`.


## Tests

Para ejecutar los tests del proyecto, siga estos pasos:

1. Sitúese en la carpeta raíz del proyecto y asegúrese de que la variable `DB_URI` en el archivo `.env` está configurada correctamente para conectarse a la base de datos de pruebas:

    ```env
        DB_URI = mongodb+srv://test:test@cluster-iw.miy9lgu.mongodb.net/Test_bd
    ```

2. Diríjase hacia la carpeta raíz del proyecto y una vez ahí ingrese en el directorio `tests`:
    ```bash
    cd ../tests
    ```

3. Instale las dependencias necesarias:

    ```bash
    npm install
    ```

4. Ejecute los tests:

    ```bash
    npm test
    ```

## Estructura del Proyecto

- `api/`: Contiene el código del servidor (API).
- `client/`: Contiene el código del cliente (frontend).
- `tests/`: Contiene los archivos de test.



## Contacto

Si tiene alguna pregunta o sugerencia, por favor contacte a:
- [Manuel Cabrera Crespo](mailto:i12cacrm@uco.es)
- [Francisco Javier Fernández Pastor](mailto:i12fepaf@uco.es)
- [Antonio Javier Quintero García](mailto:i12qugaa@uco.es)



