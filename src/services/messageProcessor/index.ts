import { slackSender } from "../slackSender";
import Logging from "../../library/Logging";

const messageProcessor = (
  serviceConfiguration: Object,
  notificationTitle: string,
  notificationDescription: string,
  notificationUrl: string,
  channels: Array<String>,
  eventId: string
) => {
  Logging.info(serviceConfiguration);
  const { notification } = JSON.parse(JSON.stringify(serviceConfiguration));
  const { serviceName } = JSON.parse(JSON.stringify(serviceConfiguration));
  const { providers } = notification;

  Logging.info(`Channels: ${channels}`);

  // send message by channel
  channels.forEach(async (channel) => {
    if (channel.toUpperCase() === "SLACK") {
      const slackProvider = providers.filter(
        (x: { name: string }) => x.name === "SLACK"
      );
      Logging.info(
        `[sendMessage] - Slack Provider: ${JSON.stringify(slackProvider)}`
      );
      Logging.info(`[sendMessage] - Slack ServiceName: ${serviceName}`);
      Logging.info(`[sendMessage] - Slack Message: ${notificationTitle}-${notificationDescription}}`);

      const slackSenderStatus = await slackSender(
        notificationTitle,
        notificationDescription,
        notificationUrl,
        slackProvider,
        serviceName,
        eventId
      )
      .catch((error:any) => {
        if (error.message) {
          Logging.error(error);
        }
      });
    }

    if (channel.toUpperCase() === "TELEGRAM") {
      const telegramProvider = providers.filter(
        (x: { name: string }) => x.name === "TELEGRAM"
      );
      Logging.info(`Telegram Provider: ${JSON.stringify(telegramProvider)}`);
    }
  });


};

// function checkIfChannelExist(value: String): Boolean{
//     return Object.keys(enumChannel).includes(value.toUpperCase())
// }

export { messageProcessor };
