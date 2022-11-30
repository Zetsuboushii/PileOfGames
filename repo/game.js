const db = require("./db")

class GameRepo {

    static getGames(cb) {
        db.all("SELECT * FROM game", cb)
    }

    static getRecommends(cb) {
        db.all("SELECT gNo, title FROM game ORDER BY RANDOM() LIMIT 10", cb)
    }
}

module.exports = GameRepo