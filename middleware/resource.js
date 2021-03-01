module.exports = () => {
    const path = require('path');
    const db = require('../plugins/db');
    const { Model, DataTypes } = require('sequelize');
    return async (req, res, next) => {
        const { resource } = req.params;
        const inflection = require('inflection');
        const modelName = inflection.classify(resource);
        const file = path.join(__dirname, `../models/${modelName}`);
        console.log(modelName, file);
        req.Model = require(file)(db, Model, DataTypes);
        await req.Model.sync();
        next();
    };
};
// const file = fs
//     .readdirSync(path.join(__dirname, '../model/'))
//     .filter((file) => {
//         return file.slice(-3) === '.js';
//     })
//     .map((file) => {
//         const f = path.join(__dirname, `../model/${file}`);
//         const model = require(f);
//         return model;
//     });
