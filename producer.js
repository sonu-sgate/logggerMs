const amqp = require("amqplib");
const config = require("./config");

let channel;

// Function to create a channel and connect to RabbitMQ
async function createChannel() {
  const connection = await amqp.connect(config.rabbitMQ.url);
  channel = await connection.createChannel();
}

// Function to publish a message to RabbitMQ
async function publishMessage(routingKey, message) {
  // Check if the channel exists, create one if not
  if (!channel) {
    await createChannel();
  }

  const exchangeName = config.rabbitMQ.exchangeName;

  // Assert the exchange on RabbitMQ
  await channel.assertExchange(exchangeName, "direct");

  const logDetails = {
    logType: routingKey,
    message: message,
    dateTime: new Date(),
  };

  // Publish the message to the exchange with the specified routing key
  await channel.publish(
    exchangeName,
    routingKey,
    Buffer.from(JSON.stringify(logDetails))
  );
  console.log(`The message ${message} is sent to exchange ${exchangeName}`);
}

module.exports = {
  publishMessage,
};
