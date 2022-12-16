// Library's
const express = require('express')
const pug = require('pug')
const path = require("path");

path.join(__dirname, "./template")
path.join(__dirname, "./repo")
path.join(__dirname, "./public")
path.join(__dirname, "./template")

// Repos
const GameRepo = require("./repo/game")

// Init
const app = express()
const navbarTemp = pug.compileFile("./template/navbar.pug")
const homeTemp = pug.compileFile("./template/home.pug")
const gameTemp = pug.compileFile("./template/game.pug")


// Config values
const port = 3000

// Serve files from folder public
app.use("/public", express.static("public"))

app.get("/home", async (req, res) => {
    let pad = (x) => String(x).padStart(4, '0')

    try {
        let picks = await GameRepo.getPicksPromise()
        let current = await GameRepo.getCurrentsPromise()
        let currentBest = await GameRepo.getCurrentBestPromise()

        res.send(homeTemp({picks, current, currentBest, pad}))
    } catch (e) {
        console.log("Async Res Error or Pug Error: /home")
    }
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
        console.log(games, developers, publishers, genres, modes, prequels, sequels, ports)
        res.send(gameTemp({games, developers, publishers, genres, modes, prequels, sequels, ports, pad, date}))
    } catch (e) {
        console.log("Async Res Error or Pug Error: /:gameTitle")
    }
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})