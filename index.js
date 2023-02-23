// Libraries
const express = require('express')
const router = express.Router();
const pug = require('pug')
const path = require("path");
const session = require("express-session")

path.join(__dirname, "./template")
path.join(__dirname, "./repo")
path.join(__dirname, "./public")
path.join(__dirname, "./template")

// Repos
const Database = require("./repo/db")
const GameRepo = require("./repo/game")
const {bounceIn} = require("svelte/easing");

// Init
const app = express()
const homeTemp = pug.compileFile("./template/home.pug")
const gameTemp = pug.compileFile("./template/game.pug")
const searchTemp = pug.compileFile("./template/search.pug")
const loginTemp = pug.compileFile("./template/login.pug")
const signupTemp = pug.compileFile("./template/signup.pug")
const listTemp = pug.compileFile("./template/list.pug")
const dbManTemp = pug.compileFile("./template/db_manager.pug")

// Config values
const port = 3000

//Session
app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true
}))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, "static")))

// Serve files from folder public
app.use("/public", express.static("public"))

app.get("/home", async (req, res) => {
    let pad = (x) => String(x).padStart(4, '0')

    try {
        let picks = await GameRepo.getPicksPromise()
        let current = await GameRepo.getCurrentsPromise()
        let currentBest = await GameRepo.getCurrentBestPromise()
        res.send(homeTemp({picks, current, currentBest, pad, session: req.session}))
    } catch (e) {
        console.log("Async Res Error or Pug Error: /home")
    }
})

app.get("/login", (req, res) => {
    try {
        res.send(loginTemp({session: req.session}))
    } catch (e) {
        console.log(e)
        console.log("Res Error or Pug Error: /login")
    }
})

app.post("/login", (req, res) => {
    let username = req.body.username
    let password = req.body.password
    if (username && password) {
        Database.all("SELECT * FROM user WHERE username = ? AND password = ?", [username, password], function (error, results, fields) {
            if (error) throw error
            if (results.length > 0) {
                req.session.loggedin = true
                req.session.username = username
                res.redirect("/home")
            } else {
                res.send("Incorrect Username and / or password")
            }
            res.end()
        })
    } else {
        res.send("Please enter Username and Password")
        res.end()
    }
})

app.get("/signup", (req, res) => {
    try {
        res.send(signupTemp({session: req.session}))
    } catch (e) {
        console.log(e)
        console.log("Res Error or Pug Error: /signup")
    }
})

app.post("/signup", (req, res) => {
    let username = req.body.username
    let password = req.body.password
    if (username && password) {
        Database.all("SELECT * FROM user WHERE username = ? AND password = ?", [username, password], function (error, results, fields) {
            if (error) throw error
            if (results.length > 0) {
                res.send("User bereits vorhanden")
                res.redirect("/signup")
            } else {
                Database.all("INSERT INTO user (username, password) VALUES (?, ?)", [username, password], function (error, fields) {
                    res.redirect("/home")
                })
            }
        })
    } else {
        res.send("Please enter Username and Password")
    }
})

app.get("/search", async (req, res) => {
    let pad = (x) => String(x).padStart(4, '0')
    let gameTitle = req.query.s
    console.log(gameTitle)
    let games = []
    try {
        games = await GameRepo.getSearchPromise(gameTitle)
        console.log(games)
        res.send(searchTemp({games, pad, session: req.session}))
    } catch (e) {
        res.send(searchTemp({games, pad, session: req.session}))
    }
})

app.get("/list/:user", async (req, res) => {
    let pad = (x) => String(x).padStart(4, '0')
    let user = req.params.user
    let statSelect = req.query
    try {
        Database.all("SELECT * FROM user WHERE username = ?", user, async function (error, results, fields) {
            if (error) throw error
            if (results.length == 1) {
                let list = await GameRepo.getListPromise(user)
                res.send(listTemp({
                    list,
                    user,
                    statSelect: parseInt(statSelect["selection"]),
                    pad,
                    session: req.session
                }))
            }
        })
    } catch (e) {
        console.log("Async Res Error or Pug Error: /list/:user or user not existinga")
    }
})

app.get("/admin/edit/game/:gameTitle", async (req, res) => {
    let pad = (x) => String(x).padStart(4, '0')
    let date = (x) => String(x).split("-")[2] + "." + String(x).split("-")[1] + "." + String(x).split("-")[0]
    let gameTitle = req.params.gameTitle
    console.log(gameTitle)
    let game = []
    try {
        game = await GameRepo.getGamePromise(gameTitle)
        let seriesPlatform = await GameRepo.getGameSeriesPlatformPromise(gameTitle)
        let developers = await GameRepo.getDeveloperPromise(gameTitle)
        let publishers = await GameRepo.getPublisherPromise(gameTitle)
        let genres = await GameRepo.getGenrePromise(gameTitle)
        let modes = await GameRepo.getModePromise(gameTitle)
        let prequels = await GameRepo.getPrequelPromise(gameTitle)
        let sequels = await GameRepo.getSequelPromise(gameTitle)
        let ports = await GameRepo.getPortPromise(gameTitle)
        let remakes = await GameRepo.getRemakePromise(gameTitle)
        let remasters = await GameRepo.getRemasterPromise(gameTitle)
        res.send(dbManTemp({
            game,
            seriesPlatform,
            developers,
            publishers,
            genres,
            modes,
            prequels,
            sequels,
            ports,
            remakes,
            remasters,
            pad,
            date,
            session: req.session
        }))
    } catch (e) {
        throw e
    }
})

app.post("/admin/edit/game/:gameTitle", (req, res) => {
    let input = req.body
    let gameTitle = req.params.gameTitle
    let gNo = 0
    let pNo = 0

    console.log(Object.keys(input)[0])

    Database.get("SELECT gNo FROM game WHERE title = ?", [gameTitle], (err, row) => {
        if (err) throw err
        gNo = row.gNo
        if (row) {
            switch (Object.keys(input)[0]) {
                case "title":
                    Database.all("UPDATE game SET title = ? WHERE gNo = ?", [input.title, gNo], function (error) {
                        if (err) throw err
                    })
                    break;
                case "orgTitle":
                    Database.all("UPDATE game SET orgTitle = ? WHERE gNo = ?", [input.orgTitle, gNo], function (error) {
                        if (err) throw err
                    })
                    break;
                case "synTitles":
                    Database.all("UPDATE game SET synTitles = ? WHERE gNo = ?", [input.synTitles, gNo], function (error) {
                        if (err) throw err
                    })
                    break;
                case "platform":
                    Database.all("UPDATE game SET orgPlatform = ? WHERE gNo = ?", [input.platform, gNo], function (error) {
                        if (err) throw err
                    })
                    break;
                case "series":
                    Database.all("UPDATE game SET refSeries = ? WHERE gNo = ?", [input.series, gNo], function (error) {
                        if (err) throw err
                    })
                    break;
                case "metaScore":
                    Database.all("UPDATE game SET metaScore = ? WHERE gNo = ?", [input.metaScore, gNo], function (error) {
                        if (err) throw err
                    })
                    break;
                case "synopsis":
                    Database.all("UPDATE game SET synopsis = ? WHERE gNo = ?", [input.synopsis, gNo], function (error) {
                        if (err) throw err
                    })
                    break;
            }

        }
    })
    return res.redirect(req.originalUrl)
})

app.get("/:gameTitle", async (req, res) => {
    let pad = (x) => String(x).padStart(4, '0')
    let date = (x) => String(x).split("-")[2] + "." + String(x).split("-")[1] + "." + String(x).split("-")[0]
    let gameTitle = req.params.gameTitle
    try {
        let games = await GameRepo.getGamePromise(gameTitle)
        let developers = await GameRepo.getDeveloperPromise(gameTitle)
        let publishers = await GameRepo.getPublisherPromise(gameTitle)
        let genres = await GameRepo.getGenrePromise(gameTitle)
        let modes = await GameRepo.getModePromise(gameTitle)
        let prequels = await GameRepo.getPrequelPromise(gameTitle)
        let sequels = await GameRepo.getSequelPromise(gameTitle)
        let ports = await GameRepo.getPortPromise(gameTitle)
        let remakes = await GameRepo.getRemakePromise(gameTitle)
        let remasters = await GameRepo.getRemasterPromise(gameTitle)
        let listEntry = await GameRepo.getListEntryPromise(req.session.username, gameTitle)
        console.log(games, developers, publishers, genres, modes, prequels, sequels, ports, remakes, remasters, listEntry)
        res.send(gameTemp({
            games,
            developers,
            publishers,
            genres,
            modes,
            prequels,
            sequels,
            ports,
            remakes,
            remasters,
            listEntry,
            pad,
            date,
            session: req.session
        }))
    } catch (e) {
        console.log("Async Res Error or Pug Error: /:gameTitle")
    }
})

app.post("/:gameTitle", (req, res) => {
    let gameTitle = req.params.gameTitle
    let input = req.body
    let gNo = 0
    let uId = 0
    Database.get("SELECT gNo FROM game WHERE title = ?", [gameTitle], (err, row) => {
        if (err) throw err
        gNo = row.gNo
        Database.get("SELECT uNo FROM user WHERE username = ?", [req.session.username], (err, row) => {
            if (err) throw err
            uId = row.uNo
            if (input.listAdd === "1") {
                Database.all("INSERT INTO list (refGame, refStatus, refUser) VALUES (?, ?, ?)", [gNo, 6, uId], function (error, results, fields) {

                })
            }
            if (input.listRemove === "1") {
                Database.all("DELETE FROM list WHERE refGame = ? AND refUser = ?", [gNo, uId], function (error, results, fields) {

                })
            }
            if (input.score) {
                Database.all("UPDATE list SET score = ? WHERE refUser = ? AND refGame = ?", [input.score, uId, gNo], function (error, results, fields) {

                })
            }
            if (input.listStatus) {
                Database.all("UPDATE list SET refStatus = ? WHERE refUser = ? AND refGame = ?", [input.listStatus, uId, gNo], function (error, results, fields) {

                })
            }
        })
    })
    return res.redirect(req.originalUrl)
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})