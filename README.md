# Robots Autónomos - Dashboard de Inversores

## URLs de acceso

**Página Pública (presentación del proyecto):**
```
https://franjalopez81-loli.github.io/robots-autonomos/public.html
```

**Acceso Privado (inversores confirmados):**
```
https://franjalopez81-loli.github.io/robots-autonomos/login.html
```

**Contraseña de acceso:** `robots2026`

---

## Estructura de archivos

| Archivo | Propósito |
|---------|-----------|
| `public.html` | Página pública informativa para visitantes e interesados |
| `login.html` | Autenticación para acceso al área privada |
| `index.html` | Dashboard privado con métricas, carteras de aportación y chat |
| `data.json` | Datos del proyecto (financiación, niveles, wallets) |
| `chat-messages.json` | Almacenamiento de mensajes del chat |
| `server.js` | Servidor Node.js para el dashboard con API de chat |
| `chat-api.js` | Módulo de API para gestión de mensajes (opcional) |

---

## Características

### Vista pública
- Presentación del proyecto y modelo de financiación
- Progreso de hitos en tiempo real
- Niveles de inversión y beneficios
- Llamadas a contacto para inversores potenciales

### Área privada
- Autenticación por sesión (sessionStorage)
- Métricas de financiación actualizadas
- Estructura completa de niveles de inversión
- Carteras de aportación con QR para BTC, USDT, XRP y SOL
- Copiado de direcciones con un clic
- **Chat en tiempo real** para inversores (polling cada 8 segundos)

---

## Chat de inversores

El dashboard incluye un chat en tiempo real donde los inversores pueden:
- Enviar y recibir mensajes
- Ver nombre de usuario y timestamp de cada mensaje
- Conversar con otros inversores en el panel

### Ejecutar con servidor (recomendado)

Para que el chat funcione correctamente entre múltiples usuarios:

```bash
cd /data/.openclaw/workspace/fundraising/dashboard
node server.js
```

El servidor se ejecutará en `http://localhost:3000` (o el puerto definido en `CHAT_PORT`).

### Características del chat
- Mensajes persistentes en `chat-messages.json`
- Polling automático cada 8 segundos
- Límite de 100 mensajes (los más recientes)
- Máximo 500 caracteres por mensaje
- Sanitización básica de entrada

---

## Datos actualizables

El archivo `data.json` contiene:
- Información del proyecto (nombre, tagline, versión)
- Estado de financiación (total, inversores, hitos)
- Niveles de inversión con beneficios
- Carteras de criptomonedas para aportaciones
- Contacto para consultas

---

## Contacto

**Email:** franjalopez81@gmail.com

---

*Plataforma de desarrollo de robótica física open source*
