# Colmado Gutierrez - Aplicación de Seguimiento de Deudas

## Descripción

Colmado Gutierrez es una simple aplicación móvil desarrollada en React Native diseñada para ayudar a pequeños negocios, particularmente colmados, a gestionar eficientemente las deudas de los clientes. Esta aplicación permite a los dueños de tiendas agregar clientes, realizar un seguimiento de sus deudas, registrar transacciones y ver historiales detallados de transacciones.

## Características

- Agregar nuevos clientes con deuda inicial y número de teléfono (opcional)
- Ver una lista de clientes ordenada por monto de deuda
- Buscar clientes por nombre
- Agregar transacciones de deuda o pago para cada cliente
- Ver historial detallado de transacciones para cada cliente
- Mostrar deuda total y número de clientes con deuda
- Almacenamiento persistente de datos usando AsyncStorage
- Se puede implementar facilmente una API editando el archivo `src/context/ClientContext.tsx`

## Tecnologías Utilizadas

- React Native
- Expo
- React Navigation
- AsyncStorage para persistencia local de datos
- Context API para gestión de estado

## Instalación

1. Clonar el repositorio:
   ```
   git clone https://github.com/leon4rdo-sh/Colmado-Gutierrez
   ```

2. Navegar al directorio del proyecto:
   ```
   cd Colmado-Gutierrez
   ```

3. Instalar dependencias:
   ```
   npm install
   ```

4. Iniciar el servidor de desarrollo de Expo:
   ```
   expo start
   ```

5. Usar la aplicación Expo Go en tu dispositivo móvil para escanear el código QR y ejecutar la aplicación, o usar un emulador.

## Estructura del Proyecto

- `App.tsx`: Componente principal y configuración de navegación
- `src/screens/`:
  - `HomeScreen.tsx`: Pantalla principal con lista de clientes y resumen
  - `AddClientScreen.tsx`: Pantalla para agregar nuevos clientes
  - `ClientDetailScreen.tsx`: Vista detallada de transacciones del cliente
- `src/components/`:
  - `NavBar.tsx`: Barra de navegación con funcionalidad de búsqueda
  - `ClientSummary.tsx`: Muestra deuda total y número de clientes con deuda
  - `ClientCard.tsx`: Tarjeta individual de cliente para la lista
  - `ui/AddClient.tsx`: Botón para agregar nuevos clientes
  - `ui/Notification.tsx`: Componente de notificación para retroalimentación del usuario
- `src/context/ClientContext.tsx`: Contexto para gestionar datos de clientes
- `src/types/RootStackParamList.ts`: Definiciones de TypeScript para navegación

## Uso

1. **Pantalla de Inicio**: Ver todos los clientes con deuda, buscar clientes y ver un resumen de la deuda total.
2. **Agregar Cliente**: Hacer clic en el botón "Agregar Cliente" para agregar un nuevo cliente con su nombre, deuda inicial y número de teléfono.
3. **Detalles del Cliente**: Tocar una tarjeta de cliente para ver su historial de transacciones y agregar nuevas transacciones (deudas o pagos).

## Contribuir

¡Las contribuciones son bienvenidas! Por favor, siéntete libre de enviar un Pull Request.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para más detalles.
