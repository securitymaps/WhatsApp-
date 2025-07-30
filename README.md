# 📲 NKD WhatsApp API

Este proyecto permite recibir mensajes de WhatsApp vía Webhook y responder automáticamente usando la API de WhatsApp Cloud.

## 🚀 Cómo desplegar en Render

1. Crea una cuenta en https://render.com
2. Conecta tu GitHub con el repositorio de este proyecto
3. En Render, crea un nuevo "Web Service"
4. Render detectará el archivo `render.yaml`
5. Agrega las siguientes variables de entorno:

| Variable         | Valor |
|------------------|-------|
| TOKEN            | Tu token de acceso permanente |
| PHONE_NUMBER_ID  | 138339792706281 |
| VERIFY_TOKEN     | miverificacionsupersegura |

6. Una vez desplegado, copia tu URL (ej: `https://nkd-whatsapp-api.onrender.com/webhook`)
7. Ve a tu app en [Meta Developers](https://developers.facebook.com)
8. Configura el Webhook con esa URL y el mismo verify token
9. ✅ Listo, ahora puedes recibir y responder mensajes

## 🛠 Personaliza
- Puedes editar los mensajes automáticos en `server.js`
- Puedes agregar lógica más avanzada según tus necesidades
