const express = require('express');
const config = require('./config');
const Publisher = require('./publisher');

const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const cors = require('cors');
//create new instance of publisher

const publisherInstance = new Publisher(config);
//connect to rabbitmq
publisherInstance.connect();
//middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
//routes
app.post('/', async(req, res, next) => {
   
    await publisherInstance.publish(req.body.logtype,req.body.message);
    res.send();
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
}
);
