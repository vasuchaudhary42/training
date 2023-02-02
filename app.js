const express = require('express');
const app = express();
const hostname = '127.0.0.1';
const port = process.env.PORT || 4001;

const routes = require('./routes');
app.use(express.json());
app.use(
    express.urlencoded({
        extended: false
    })
);

app.use('/', routes);

app.listen(port, hostname, () => console.log(`Server running at http://${hostname}:${port}/`));