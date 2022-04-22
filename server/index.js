require('dotenv').config();
const express = require('express')
const next = require('next')
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const port = process.env.PORT || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })

const logger = require("./utils/logger");
const payRoute = require('./routes/pay');
const formRoute = require('./routes/form');
const { connectToPaytm } = require('./modules/paytm');

const handle = app.getRequestHandler()



app.prepare().then(() => {
    const server = express()
    connectToPaytm()

    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({ extended: true }))
    server.route('/files/*').get((req, res) => {
      res.sendFile(process.cwd() + decodeURI(req.url));
    })

    server.get("/api/test", (req, res) => {
        return res.send("Hi")
    })
    server.use("/api/pay", payRoute);
    server.use("/api/form", formRoute);

    // This code should be in the last portion
    server.all('*', (req, res) => {
        return handle(req, res)
    })
    // server.use('/static', express.static(path.join(__dirname, './public')));
    // server.use(cors());
    // server.options("*", cors());
    mongoose.connect(process.env.dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => server.listen(port, (err) => {
            logger.info(`> Connected to MongoDB`)
            if (err) throw err
            logger.info(`> Ready on http://localhost:${port}`)
        }))
        .catch((err) => logger.error(err))


})
