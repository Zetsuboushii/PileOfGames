const db = require("./db")
const {query} = require("express");

class GameRepo {

    static getGames(cb) {
        db.all("SELECT * FROM game", cb)
    }

    static getRecommends(cb) {
        db.all("SELECT gNo, title FROM game ORDER BY RANDOM() LIMIT 10", cb)
    }

    static getCurrents(cb) {
        db.all("SELECT gNo, title FROM game ORDER BY releaseDate DESC LIMIT 10", cb)
    }

    static getCurrentBest(cb) {
        db.all("SELECT g.gNo, g.title, p.pNo, p.name FROM game g, platform p WHERE g.releaseDate IS NOT NULL AND g.orgPlatform = p.pNo AND g.releaseDate < DATE() AND (julianday(DATE('now')) - julianday(g.releaseDate)) < 600 ORDER BY g.metaScore DESC LIMIT 3", cb)
    }

}

module.exports = GameRepo