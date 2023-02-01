const express = require('express');
const app = express();
const hostname = '127.0.0.1';
const port = process.env.PORT || 4001;

app.use(express.json());
app.use(
    express.urlencoded({
        extended: false
    })
);

app.get('/', (req, res) => {
    res.json({'message': 'ok'});
});

app.use((err, req, res) => res.status(err.statusCode || 500).json({'message': err.message}));

app.listen(port, hostname, () => console.log(`Server running at http://${hostname}:${port}/`));