//connect rabbit mq server
//create new channal
//connect exchange
//create queue
//bind queue to exchange
//consume message from queue
//send message to exchange
//send message to queue
const amqp = require('amqplib');
const config = require('./config');
async function start() {
    const connection = await amqp.connect(config.rabbitmq.url);
    const channel = await connection.createChannel();
    const exchange = config.rabbitmq.exchange;
    await channel.assertExchange(exchange, 'direct', { durable: false });
    const queue = 'warn_and_error_consumer_queue';
    const q=await channel.assertQueue(queue, { durable: false });
 
    channel.bindQueue(queue, exchange, 'warn_consumer');
    channel.bindQueue(queue, exchange, 'error_consumer');
    channel.consume(queue, function(msg) {
        console.log(" [x] Received %s", msg.content.toString());
        const message = msg.content.toString();
        const data = JSON.parse(message);
        console.log(" [x] Received %s", data);
        channel.ack(msg);
    }
    );

}
start().catch(console.error);
