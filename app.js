const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const ejs = require("ejs")
const app = express()
const dotenv = require("dotenv").config();

const db_user = process.env.DB_USERNAME
const db_password = process.env.DB_PASSWORD

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))


const mongoDB = `mongodb+srv://${db_user}:${db_password}@cluster0.soaw7.mongodb.net/wikiDB`

// const mongoDB = `mongodb+srv://admin-wayne:ymw123@cluster0.soaw7.mongodb.net/wikiDB`

// const mongoDB = 'mongodb://localhost:27017/wikiDB'

mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true })

const articleSchema = {
    title: String,
    content: String
}

//mongose will lowercase model name
const Article = mongoose.model("Article", articleSchema)

//////////////////////////Request targeting all articles////////////////////////
//.route chain method
app.route("/articles")

    .get(function (req, res) {

        Article.find({}, function (err, foundArticle) {
            if (!err) {
                res.send(foundArticle)
            }
            else {
                res.send(err)
            }
        })

    })


    .post(function (req, res) {
        // console.log(req.body.title)
        // console.log(req.body.content)

        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        })

        newArticle.save(function (err) {
            if (!err) {
                res.send("Successfully added a new article")
            } else {
                res.send(err)
            }
        })

    })


    .delete(function (req, res) {

        Article.deleteMany({}, function (err) {
            if (!err) {
                res.send("Documents successfully deleted!")
            } else {
                res.send(err)
            }
        })
    })

//////////////////////////Request targeting particular articles////////////////////////

app.route("/articles/:articleTitle")

    // req.params.articleTitle = 'jQuery'

    .get(function (req, res) {

        Article.findOne(
            { title: req.params.articleTitle }, 
            function (err, foundTitle) {
            if (foundTitle) {
                res.send(foundTitle)
            } else {
                res.send("No articles matching that title was found")
            }


        })
    })

    .put(function (req, res) {

        Article.update(
            { title: req.params.articleTitle },
            { title: req.body.title, content: req.body.content }, //update
            { overwrite: true },
            function (err) {
                if (!err) {
                    res.send("Succesfully updated article")
                }
            }
        )
    })

    .patch(function (req, res) {

        Article.update(
            { title: req.params.articleTitle },
            { $set: req.body },
            function (err) {
                if (!err) {
                    res.send("Successfully updated article")
                } else {
                    res.send(err)
                }
            }
        )
    })

    .delete(function (req, res) {
        Article.deleteOne(
            { title: req.params.articleTitle },
            function (err) {
                if (!err) {
                    res.send("Succesfully deleted the corresponding article")
                } else {
                    res.send(err)
                }
            }
        )
    })


app.listen(3000, function () {
    console.log("Server is up and running at port 3000.")
})