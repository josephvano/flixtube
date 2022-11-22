import amqp, {
  Channel,
  ConsumeMessage
} from 'amqplib';
import debug                  from "debug";

const log = debug("history:messaging");

type MessagingServiceOptions = {
  host: string;
  queueName: string;
}

async function createChannel(options: MessagingServiceOptions): Promise<Channel> {
  if (!options.host) {
    throw new Error(`please provide a "host"`)
  }

  if (!options.queueName) {
    throw new Error(`please provide a "queueName"`)
  }

  log(`connecting to messaging service`);

  const connection = await amqp.connect(options.host);

  log(`creating channel`);
  const messageChannel = await connection.createChannel();


  log(`checking queue ${options.queueName}`);
  await messageChannel.assertQueue(options.queueName, {});

  return messageChannel;
}

export {
  createChannel
}