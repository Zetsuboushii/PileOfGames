const db = require("./db")
const {query} = require("express");

class GameRepo {

    static getGame(search, cb) {
        db.all("SELECT g.gNo, g.title, g.metaScore, g.orgTitle, g.synTitle, g.releaseDate, g.synopsis, s.name AS series, p.name AS platform, (SELECT RANK() OVER (ORDER BY metaScore DESC) FROM game WHERE releaseDate < DATE('now') ORDER BY gNo LIMIT 1 OFFSET (SELECT gNo FROM game WHERE title = ?) - 1) AS rank, (SELECT AVG(score) FROM list WHERE refGame = (SELECT gNo FROM game WHERE title = ?)) AS usrscore FROM game g, platform p, series s WHERE g.orgPlatform = p.pNo AND g.refSeries = s.sNo AND g.title = ?", search, search, search, cb)
    }

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


    static getDeveloper(search, cb) {
        db.all("SELECT d.name AS developer FROM developer d, game g, game_developer gd WHERE gd.refGame = g.gNo AND gd.refDeveloper = d.devNo AND g.title = ?", search, cb)
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


    static getPublisher(search, cb) {
        db.all("SELECT pub.name AS publisher FROM publisher pub, game g, game_publisher gp WHERE gp.refGame = g.gNo AND gp.refPublisher = pub.pubNo AND g.title = ?", search, cb)
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


    static getGenre(search, cb) {
        db.all("SELECT gen.name AS genre FROM genre gen, game g, game_genre ggen WHERE ggen.refGame = g.gNo AND ggen.refGenre = gen.genNo AND g.title = ?", search, cb)
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


    static getMode(search, cb) {
        db.all("SELECT m.name AS mode FROM mode m, game g, game_mode gm WHERE gm.refGame = g.gNo AND gm.refMode = m.modeNo AND g.title = ?", search, cb)
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


    static getPort(search, cb) {
        db.all("SELECT p.name AS port FROM game g, port, platform p WHERE port.refGame = g.gNo AND port.refPlatform = p.pNo AND g.title = ?", search, cb)
    }

    static async getPortPromise(search) {
        return new Promise((resolve, reject) => {
            this.getPort(search, (err, res) => {
                if (err) {
                    resolve(["null"])
                } else {
                    resolve(res)
                }
            })
        })
    }


    static getPrequel(search, cb) {
        db.all("SELECT g.title, g.gNo FROM game g, prequel p WHERE p.refOrigin = (SELECT gNo FROM game WHERE title = ?) AND p.refPrequel = g.gNo", search, cb)
    }

    static async getPrequelPromise(search) {
        return new Promise((resolve, reject) => {
            this.getPrequel(search, (err, res) => {
                if (err) {
                    resolve()
                } else {
                    resolve(res)
                }
            })
        })
    }


    static getSequel(search, cb) {
        db.all("SELECT g.title, g.gNo FROM game g, prequel p WHERE p.refPrequel = (SELECT gNo FROM game WHERE title = ?) AND p.refOrigin = g.gNo", search, cb)
    }

    static async getSequelPromise(search) {
        return new Promise((resolve, reject) => {
            this.getSequel(search, (err, res) => {
                if (err) {
                    resolve(["null"])
                } else {
                    resolve(res)
                }
            })
        })
    }


    static getRemake(search, cb) {
        db.all("SELECT g.title, g.gNo FROM game g, remake r WHERE r.refOrigin = (SELECT gNo FROM game WHERE title = ?) AND r.refRemake = g.gNo", search, cb)
    }

    static async getRemakePromise(search) {
        return new Promise((resolve, reject) => {
            this.getRemake(search, (err, res) => {
                if (err) {
                    resolve(["null"])
                } else {
                    resolve(res)
                }
            })
        })
    }

    static getRemaster(search, cb) {
        db.all("SELECT g.title, g.gNo FROM game g, remaster r WHERE r.refOrigin = (SELECT gNo FROM game WHERE title = ?) AND r.refRemaster = g.gNo", search, cb)
    }

    static async getRemasterPromise(search) {
        return new Promise((resolve, reject) => {
            this.getRemaster(search, (err, res) => {
                if (err) {
                    resolve(null)
                } else {
                    resolve(res)
                }
            })
        })
    }




    static getSearch(search, cb) {
        db.all("SELECT g.title, g.gNo FROM game g WHERE g.title LIKE '%' || ? || '%' ORDER BY g.releaseDate", search, cb)
    }

    static async getSearchPromise(search) {
        return new Promise((resolve, reject) => {
            this.getSearch(search, (err, res) => {
                console.log(res, err)
                if (err) {
                    resolve(null)
                } else {
                    resolve(res)
                }
            })
        })
    }




    static getPicks(cb) {
        db.all("SELECT gNo, title FROM game ORDER BY RANDOM() LIMIT 10", cb)
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


    static getCurrents(cb) {
        db.all("SELECT gNo, title FROM game ORDER BY releaseDate DESC LIMIT 10", cb)
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


    static getCurrentBest(cb) {
        db.all("SELECT g.gNo, g.title, p.pNo, p.name FROM game g, platform p WHERE g.releaseDate IS NOT NULL AND g.orgPlatform = p.pNo AND g.releaseDate < DATE() AND (julianday(DATE('now')) - julianday(g.releaseDate)) < 600 ORDER BY g.metaScore DESC LIMIT 3", cb)
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
}

module.exports = GameRepo