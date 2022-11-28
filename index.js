const express = require('express')
const pug = require('pug')
const {request} = require("express");

const app = express()
const port = 3000

const indexT = pug.compileFile("./template/index.pug")

const sqlite3 = require("sqlite3").verbose();

let db = new sqlite3.Database('pog.sqlite', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to PoG');
});

app.get('/:kek', (req, res) => {
    getGame(req.params.kek, (err, row) => {
        if (err) {
            res.send("fuck off")
        } else {
            console.log(row)
            res.send(indexT({row}))
        }
    })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})

function getGame(title, cb) {
    db.each("SELECT orgTitle FROM game WHERE title IS ?", title, cb)
}