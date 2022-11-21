import { IncomingWebhook, IncomingWebhookResult } from "@slack/webhook";
import Logging from "../../library/Logging";
import Event from "../../models/Event";

const slackSender = async (
  notificationTitle: string,
  notificationDescription: string,
  notificationUrl: string,
  slackProvider: Object,
  serviceName: string,
  eventId: string
) => {
  Logging.info(
    `[slackSender] - slackProvider: ${JSON.stringify(slackProvider)}`
  );
  Logging.info(JSON.stringify(slackProvider));
  const json = JSON.parse(JSON.stringify(slackProvider))[0];
  const { webhooks } = json;

  Logging.info(webhooks);
  webhooks.forEach(
    async (webhook: { enable: boolean; webhook: string; name: string }) => {
      if (webhook.enable) {
        Logging.info(
          `Sending message to Slack using webhook: ${webhook.webhook}`
        );
        const slackSenderStatus = await send(
          eventId,
          notificationTitle,
          notificationDescription,
          notificationUrl,
          webhook.webhook,
          serviceName
        )
          /* 
        Message was sent OK
        */
          .then((response) => {
            Logging.info(
              `[slackSender] - Slack sender status: ${JSON.stringify(response)}`
            );
            /*
            Update StatusDB on Event collection
            
            */
            const newStatus = {
              name: webhook.name,
              status: "Delivered",
              statusDescription: "-",
            };

            Logging.info(webhook.name);
            Event.findOneAndUpdate(
              { 
                _id: eventId
              },
              {
                $push: {
                  "status.provider": {
                    name: "slack",
                    webhooks: [
                      newStatus
                    ]
                  }
                }
              }
              ).then((res)=>Logging.info(res))
              .catch((error)=>Logging.error(`error updating status: ${error}`))
          })
          .catch((error) => {
            Logging.error(
              `[slackSender] - Error sendind message to slack - Error Code :${error.code}-${error.message}`
            );
            const newStatus = {
              name: webhook.name,
              status: "Fail",
              statusDescription: `${error.code}-${error.message}`,
            };
            Event.findOneAndUpdate(
              { 
                _id: eventId
              },
              {
                $push: {
                  "status.provider": {
                    name: "slack",
                    webhooks: [
                      newStatus
                    ]
                  }
                }
              }
              ).then((res)=>Logging.info(res))
              .catch((error)=>Logging.error(`error updating status: ${error}`))
            
          });
      }
    }
  );
  return { status: "message proccessed....", statusCode: 201 };
  // store result into a DB...
};
const send = async (
  eventId: string,
  notificationTitle: string,
  notificationDescription: string,
  notificationUrl: string,
  slackWebhook: string,
  serviceName: string
): Promise<IncomingWebhookResult> => {
  const webhook = new IncomingWebhook(slackWebhook);
  const slack_block_message={
      "blocks": [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `:rotating_light: Alerta en servicio *${serviceName}* :rotating_light:`
          }
        },
        {
          "type": "divider"
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `*EventId:* ${eventId} \n *Titulo:* ${notificationTitle}\n *Descripcion:* ${notificationDescription} \n`
          },
          "accessory": {
            "type": "image",
            "image_url": "https://media.giphy.com/media/eImrJKnOmuBDmqXNUj/giphy.gif",
            "alt_text": "alert_emoji"
          }
        },
        {
          "type": "actions",
          "elements": [
            {
              "type": "button",
              "text": {
                "type": "plain_text",
                "text": "Ver alerta :exclamation:",
                "emoji": true
              },
              "value": "ir a alerta",
              "url": `${notificationUrl}`
            }
          ]
        }
      ]
    }
  const result = await webhook
    .send(slack_block_message)
    .catch((error) => {
      throw error;
    });

  return result;
  // Logging.info(`Message sent succesfully: ${message}`)
};
export { slackSender };
