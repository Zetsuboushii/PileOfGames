const db = require("./db")
const {query} = require("express");

class GameRepo {

    static async getGamePromise(search) {
        return new Promise((resolve, reject) => {
            this.getGame(search, (err, res) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    }

    static async getDeveloperPromise(search) {
        return new Promise((resolve, reject) => {
            this.getDeveloper(search, (err,res) => {
                if(err){
                    reject(err)
                }else{
                    resolve(res)
                }
            })
        })
    }

    static async getPublisherPromise(search){
        return new Promise ((resolve, reject) => {
            this.getPublisher(search,(err,res) => {
                if(err){
                    
                }
            })
        })
    }

    static getGame(search, cb) {
        db.all("SELECT g.gNo, g.title, g.metaScore, g.orgTitle, g.synTitle, g.releaseDate, g.synopsis, s.name AS series, p.name AS platform FROM game g, platform p, series s WHERE g.orgPlatform = p.pNo AND g.refSeries = s.sNo AND g.title = ?", search, cb)
    }

    static getDeveloper(search, cb) {
        //db.all("SELECT d.name FROM developer d, game g, game_developer gd WHERE g.title = search AND gd.refGame = g.gNo AND gd.refDeveloper = d.devNo", search, cb)
    }

    static getPublisher(search, cb) {
        db.all("SELECT pub.name FROM publisher pub, game g, game_publisher gp WHERE g.title = search AND gp.refGame = g.gNo AND gp.refPublisher = pub.pubNo", search, cb)
    }

    static getGenre(search, cb) {
        //db.all("SELECT gen.name FROM genre gen, game g, game_genre ggen WHERE g.title = search AND ggen.refGame = g.gNo AND ggen.refGenre = gen.genNo", search, cb)
    }

    static getMode(search, cb) {
        //db.all("SELECT m.name FROM mode m, game g, game_mode gm WHERE g.title = search AND gm.refGame = g.gNo AND gm.refMode = m.modeNo", search, cb)
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