const Universe = require('../models/character.js');
const sql = require("mysql2");

exports.getUniverses = async (req, res) => {
    const universes = await Universe.findAll();
    return res.status(200).json(universes);
}

exports.createUniverse = (req, res) => {
    let {name, creatorId} = req.body;
    // generate description with name and store in variable
    // generate prompt to get image from Stable
    

    let universe = new Universe(name, creatorId);
    // OPenAI => description;
    universe.addToDatabase();


    // connection.query(`INSERT INTO universes (name, imageUrl, description) VALUES ('${req.body.name}, ${req.body.imageUrl}, ${req.body.description}')`, (err, result) => {
    //     if (err) {
    //         console.log(err);
    //     } else {
    //         res.json(result);
    //     }
    // });
    console.log(req);
}

exports.updateUniverse = (req, res) => {
    console.log(req);
}

exports.deleteUniverse = (req, res) => {
    connection.query(`DELETE FROM universes WHERE id = ${req.params.id}`, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.json(result);
        }
    });
}

exports.getUniverse = (req, res) => {
    connextion.query(`SELECT * FROM universes WHERE id = ${req.params.id}`, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.json(result);
        }
    });
}