# Servicio de notificaciones por servicio
Servicio en TS que permite enviar notificaciones a distintos canales de slack dependiendo el servicio/aplicacion configurado en la Mongo DB `services`

## Variables de entorno necesarias
   - PORT
   - MONGO_USERNAME
   - MONGO_PASSWORD
   - MONGO_HOST
   - API_KEY

## Middleware autenticación
Para interactuar con el servicio mediante API es necesario configurar la API_KEY por variable de entorno para luego poder realizar los request enviando como header `x-api-key` y no obtener errores 403 Unauthorized
```
{
    "status": "false",
    "message": "Unauthorized"
}
```

## Crear Servicio
Para crear un servicio y vincular la notificación hacia slack es necesario crearlo desde la DB(actualmente no está por API)
Para ello puede utilizar [services.json](./init/services.json)

## Enviar Notificación
Para enviar un evento es necesario los siguientes datos en el `Body`:

- serviceName: Nombre del servicio que hacemos referencia
- notificationTitle: Titulo descriptivo de la notificación a enviar.
- notificationDescription: Descripcion detallada de la notificación a enviar.
- notificationUrl: URL para acceder a mas detalles de la notificación en caso de existir(ejemplo una alerta de la aplicacion en Elastic/Grafana/new relic/ etc...)
- channels: SLACK(unico conector funcional), es un array y se podrían agregar nuevos conectores al codigo para soportar TELEGRAM,WP,etc...
```
Method: `POST`
Url: http://localhost:3000/api/events
Body: {
"serviceName":"payments",
"notificationTitle": "Traefik",
"notificationDescription": "Mas de 5000 errores encontrados en los siguientes hosts: \n - payments.mi-dominio1.com\n - service-payments.mi-dominio2.com \n - lalala.mi-dominio3.com",
"notificationUrl": "https://giphy.com/gifs/code-coding-seamless-xT9IgzoKnwFNmISR8I/fullscreen",
"channels":["slack"]
}
Headers: `x-api-key`
```

Respuesta:
```
{
    "eventId": "637afdb00b04d40852b13777",
    "serviceName": "payments",
    "notificationTitle": "Traefik",
    "notificationDescription": "Mas de 5000 errores encontrados en los siguientes hosts: \n - payments.mi-dominio1.com\n - service-payments.mi-dominio2.com \n - lalala.mi-dominio3.com ",
    "channels": [
        "slack"
    ],
    "status": "Processing..."
}
```
## Obtener status de la notificación
Se le debe pasar como parámetro el `eventId` obtenido de la respuesta en el send event POST
```
Method: `GET`
Url: http://localhost:3000/api/events?eventId=637aed65b5ccdbbe86d4e22c
```
Respuesta:
```
{
    "event": {
        "_id": "637affd90b04d40852b1377d",
        "serviceName": "payments",
        "notificationTitle": "Traefik",
        "notificationDescription": "Mas de 5000 errores encontrados en los siguientes hosts: \n - payments.dominio.com\n - service-payments.dominio.com \n - lalala.dominio.com ",
        "channels": [
            "slack"
        ],
        "status": {
            "provider": [
                {
                    "name": "slack",
                    "webhooks": [
                        {
                            "name": "all-alerts",
                            "status": "Delivered",
                            "statusDescription": "-"
                        }
                    ]
                },
                {
                    "name": "slack",
                    "webhooks": [
                        {
                            "name": "payments-alerts",
                            "status": "Delivered",
                            "statusDescription": "-"
                        }
                    ]
                }
            ]
        }
    }
}
```


## Listar los servicios configurados.
Retorna la lista de servicios configurados
```
Method: Get
Url: http://localhost:3000/api/services
```
Respuesta:
```
{
    "services": [
        {
            "_id": "6359e204274aaaa69b115cd7",
            "serviceName": "payments",
            "description": "servicio de pagos",
            "notification": {
                "providers": [
                    {
                        "name": "SLACK",
                        "webhooks": [
                            {
                                "name": "payments-alerts",
                                "webhook": "https://hooks.slack.com/services/1",
                                "enable": true
                            },
                            {
                                "name": "all-alerts",
                                "webhook": "https://hooks.slack.com/services/2",
                                "enable": true
                            }
                        ]
                    }
                ]
            }
        }
    ]
}
```


## Healtcheck
```
Method: Get
Url: http://localhost:3000/api/healthcheck
```

Respuesta:
```
{
    "uptime": 2239.74231255,
    "status": "OK :)"
}
```
