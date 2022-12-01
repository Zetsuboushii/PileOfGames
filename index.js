// Library's
const express = require('express')
const pug = require('pug')

// Repos
const GameRepo = require("./repo/game")

// Init
const app = express()
const home = pug.compileFile("./template/home.pug")
const hotbar = pug.compileFile("./template/hotbar.pug")


// Config values
const port = 3000

// Serve files from folder public
app.use("/public", express.static("public"))

app.get("/home", (req, res) => {
    let pad = (x) => String(x).padStart(4, '0')
    GameRepo.getRecommends((err, recomm) => {
        if (err) {
            console.log(err)
            res.send("Random Error, ig")
            return
        } else if (recomm.length == 0) {
            res.send("Empty Query")
            return
        } else {
            //res.send(home({recomm, pad: (x) => String(x).padStart(4, '0')}))
            GameRepo.getCurrents((err, curr) => {
                if (err) {
                    console.log(err)
                    res.send("Random Error, ig")
                    return
                } else if (curr.length == 0) {
                    res.send("Empty Query")
                    return
                } else {
                    //res.send(home({recomm:recomm,curr:curr, pad:pad}))
                    GameRepo.getCurrentBest((err, currB) => {
                        if (err) {
                            console.log(err)
                            res.send("Random Error, ig")
                        } else if (currB.length == 0) {
                            res.send("Empty Query")
                        } else {
                            console.log(currB)
                            res.send(home({recomm:recomm, curr:curr, currB:currB, pad:pad}))
                        }
                    })
                }
            })
        }
    })
})

/**
 app.get("/games",(req,res) => {
    GameRepo.getGames((err,games) => {
        if(err){
            res.send("fuck you")
        }else if (games.length == 0){
            res.send("you get nothing 404")
        }else{
            console.log(games)
            res.send(home({games, marcel: () => console.log("this is cursed")}))
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
            res.send(home({row}))
        }
    })
})
 */

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})