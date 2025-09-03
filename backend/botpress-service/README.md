# Botpress Service

Chatbot and conversational AI service using Botpress.

## Features

- Conversational AI chatbot
- Multi-channel support
- Natural Language Processing
- Integration with other services
- Analytics and monitoring

## Configuration

This service uses the official Botpress Docker image.

## Port

This service runs on port **3000**

## Docker

The service is configured in docker-compose.yml to use the official Botpress image:

```yaml
botpress:
  image: botpress/server:latest
  container_name: botpress-service
  ports:
    - "3000:3000"
  volumes:
    - ./backend/botpress-service/data:/botpress/data
    - ./backend/botpress-service/config:/botpress/config
  environment:
    - BP_HOST=0.0.0.0
    - BP_PORT=3000
```

## API Endpoints

### Chatbot
- `POST /api/v1/bots/{botId}/converse/{userId}` - Send message to bot
- `GET /api/v1/bots` - List available bots

### Webhooks
- `POST /api/v1/bots/{botId}/webhook` - Webhook endpoint

For more information, see [Botpress Documentation](https://botpress.com/docs)
