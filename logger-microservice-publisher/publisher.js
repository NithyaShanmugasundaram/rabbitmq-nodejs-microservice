const amqp = require('amqplib');
const config = require('./config');
class Publisher {
    constructor(config) {
        this.config = config;
        this.channel = null;
    }
    async connect() {
        try {
            const connection = await amqp.connect(this.config.rabbitmq.url);
            this.channel = await connection.createChannel();
            await this.channel.assertExchange(this.config.rabbitmq.exchange, 'direct', { durable: false });
            console.log('Connected to RabbitMQ');
        } catch (error) {
            console.error('Error connecting to RabbitMQ', error);
        }
    }
    async publish(routingKey,message) {
        console.log('Publishing message:', message);
        try {
            if (!this.channel) {
                this.connect()
            }
           await this.channel.assertExchange(this.config.rabbitmq.exchange, 'direct', { durable: false });
            this.channel.publish(this.config.rabbitmq.exchange, routingKey, Buffer.from(JSON.stringify({routingKey:routingKey,
                message:message,datetime:new Date().toISOString()})));
            console.log(`Message sent: ${message}  ${routingKey}`);
        } catch (error) {   
            console.error('Error publishing message', error);
        }
    }
}
module.exports = Publisher;