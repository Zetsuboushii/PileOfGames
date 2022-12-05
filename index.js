// Library's
const express = require('express')
const pug = require('pug')

// Repos
const GameRepo = require("./repo/game")

// Init
const app = express()
const homeTemp = pug.compileFile("./template/home.pug")
const hotbarTemp = pug.compileFile("./template/hotbar.pug")
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
        console.log("Async Res Error: /home")
    }

    /**
    GameRepo.getRecommends((err, recomm) => {
        if (err) {
            console.log(err)
            res.send("Random Error, ig")
            return
        } else if (recomm.length == 0) {
            res.send("Empty Query")
            return
        } else {
            //res.send(homeTemp({recomm, pad: (x) => String(x).padStart(4, '0')}))
            GameRepo.getCurrents((err, curr) => {
                if (err) {
                    console.log(err)
                    res.send("Random Error, ig")
                    return
                } else if (curr.length == 0) {
                    res.send("Empty Query")
                    return
                } else {
                    //res.send(homeTemp({recomm:recomm,curr:curr, pad:pad}))
                    GameRepo.getCurrentBest((err, currB) => {
                        if (err) {
                            console.log(err)
                            res.send("Random Error, ig")
                        } else if (currB.length == 0) {
                            res.send("Empty Query")
                        } else {

                        }
                    })
                }
            })
        }
    })
    */
})

app.get("/:gameTitle", async (req, res) => {
    let pad = (x) => String(x).padStart(4, '0')
    let gameTitle = req.params.gameTitle
    try {
        let game = await GameRepo.getGamePromise(gameTitle)
        let developer = await GameRepo.getDeveloperPromise(gameTitle)
        let publisher = await GameRepo.getPublisherPromise(gameTitle)
        let genre = await GameRepo.getGenrePromise(gameTitle)
        let mode = await GameRepo.getModePromise(gameTitle)

        res.send(gameTemp({game, developer, publisher, genre, mode, pad}))
    } catch (e) {
        console.log("Async Res Error: /:gameTitle")
    }
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})


/**
 GameRepo.getGame(gameTitle, (err, game) => {
        if (err) {
            console.log(err)
            res.send("Random Error, ig")
            return
        } else if (game.length == 0) {
            res.send("Empty Query")
            return
        } else {
            GameRepo.getDeveloper(gameTitle, (err, dev) => {
                if (err) {
                    console.log(err)
                    res.send("Random Error, ig ejktgeo")
                    return
                } else if (dev.length == 0) {
                    res.send("Empty Query")
                    return
                } else {
                    GameRepo.getPublisher(gameTitle, (err, pub) => {
                        if (err) {
                            console.log(err)
                            res.send("Random Error, ig")
                            return
                        } else if (pub.length == 0) {
                            res.send("Empty Query")
                            return
                        } else {
                            GameRepo.getGenre(gameTitle, (err, genre) => {
                                if (err) {
                                    console.log(err)
                                    res.send("Random Error, ig")
                                    return
                                } else if (genre.length == 0) {
                                    res.send("Empty Query")
                                    return
                                } else {
                                    GameRepo.getMode(gameTitle, (err, mode) => {
                                        if (err) {
                                            console.log(err)
                                            res.send("Random Error, ig")
                                            return
                                        } else if (mode.length == 0) {
                                            res.send("Empty Query")
                                            return
                                        } else {
                                            res.send(gameTemp({game:game, dev:dev, pub:pub, genre:genre, mode:mode, pad:pad}))
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            })
        }
    })
})
 */

/**
 app.get("/games",(req,res) => {
    GameRepo.getGames((err,games) => {
        if(err){
            res.send("fuck you")
        }else if (games.length == 0){
            res.send("you get nothing 404")
        }else{
            console.log(games)
            res.send(homeTemp({games, marcel: () => console.log("this is cursed")}))
        }
    })
})
 */

/**
 app.get('/:gameTitle', (req, res) => {
    GameRepo.getGame(req.params.gameTitle, (err, row) => {
        if (err) {
            res.send("fuck off")
        } else if (!row) {
            res.send("not found you whore")
        } else {
            res.send(homeTemp({row}))
        }
    })
})
 */