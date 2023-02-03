const express = require('express');
const app = express();

const authRoutes = require('./auth');
const userRoutes = require('./user');

app.use('/', authRoutes);
app.use('/', userRoutes)
module.exports = app;