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

    static getGame(search, cb) {
        db.all("SELECT g.gNo, g.title, g.metaScore, g.orgTitle, g.synTitle, g.releaseDate, g.synopsis, s.name AS series, p.name AS platform FROM game g, platform p, series s WHERE g.orgPlatform = p.pNo AND g.refSeries = s.sNo AND g.title = ?", search, cb)
    }


    static async getDeveloperPromise(search) {
        return new Promise((resolve, reject) => {
            this.getDeveloper(search, (err, res) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    }

    static getDeveloper(search, cb) {
        db.all("SELECT d.name FROM developer d, game g, game_developer gd WHERE gd.refGame = g.gNo AND gd.refDeveloper = d.devNo AND g.title = ?", search, cb)
    }


    static async getPublisherPromise(search) {
        return new Promise((resolve, reject) => {
            this.getPublisher(search, (err, res) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    }

    static getPublisher(search, cb) {
        db.all("SELECT pub.name FROM publisher pub, game g, game_publisher gp WHERE gp.refGame = g.gNo AND gp.refPublisher = pub.pubNo AND g.title = ?", search, cb)
    }


    static async getGenrePromise(search) {
        return new Promise((resolve, reject) => {
            this.getGenre(search, (err, res) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    }

    static getGenre(search, cb) {
        db.all("SELECT gen.name FROM genre gen, game g, game_genre ggen WHERE ggen.refGame = g.gNo AND ggen.refGenre = gen.genNo AND g.title = ?", search, cb)
    }


    static async getModePromise(search) {
        return new Promise((resolve, reject) => {
            this.getMode(search, (err, res) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    }

    static getMode(search, cb) {
        db.all("SELECT m.name FROM mode m, game g, game_mode gm WHERE gm.refGame = g.gNo AND gm.refMode = m.modeNo AND g.title = ?", search, cb)
    }


    static async getPicksPromise() {
        return new Promise((resolve, reject) => {
            this.getPicks((err, res) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    }

    static getPicks(cb) {
        db.all("SELECT gNo, title FROM game ORDER BY RANDOM() LIMIT 10", cb)
    }


    static async getCurrentsPromise() {
        return new Promise((resolve, reject) => {
            this.getCurrents((err, res) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    }

    static getCurrents(cb) {
        db.all("SELECT gNo, title FROM game ORDER BY releaseDate DESC LIMIT 10", cb)
    }


    static async getCurrentBestPromise() {
        return new Promise((resolve, reject) => {
            this.getCurrentBest((err, res) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            })
        })
    }

    static getCurrentBest(cb) {
        db.all("SELECT g.gNo, g.title, p.pNo, p.name FROM game g, platform p WHERE g.releaseDate IS NOT NULL AND g.orgPlatform = p.pNo AND g.releaseDate < DATE() AND (julianday(DATE('now')) - julianday(g.releaseDate)) < 600 ORDER BY g.metaScore DESC LIMIT 3", cb)
    }
}

module.exports = GameRepo