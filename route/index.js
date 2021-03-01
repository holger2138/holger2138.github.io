const express = require('express');
const router = express.Router();
const resourceMiddleware = require('../middleware/resource');

module.exports = (app) => {
    router.get('/', async (req, res) => {
        const data = await req.Model.findAll();
        res.send(data);
    });
    router.post('/add', async (req, res) => {
        const data = await req.Model.create(req.body);
        res.send(data);
    });
    router.get('/:id', async (req, res) => {
        const { id } = req.params;
        const data = await req.Model.findByPk(id);
        res.send(data);
    });
    app.use('/:resource', resourceMiddleware(), router);
};
