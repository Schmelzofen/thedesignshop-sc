require('dotenv').config()
const express = require('express')
const formidable = require("formidable")
const { getProducts, addNewProduct, sampleProducts, updateProduct } = require("./db")
const { ObjectId } = require("mongodb")
const app = express()


app.set("view engine", "ejs")
app.use(express.static(__dirname + "/public"))

app.get('/', function (req, res) {
    const products = getProducts()
        .then((products) => {
            res.render("pages/index", {
                products
            })
        })
})

app.get("/add", (req, res) => {
    const products = sampleProducts()
        .then((products) => {
            res.render("pages/addproduct", {
                products
            })
        })
})

app.post("/add", (req, res) => {
    const form = formidable({ multiples: true })
    form.parse(req, (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }
        let product = {
            ProductName: fields.ProductName,
            ProductLink: fields.ProductLink,
            Price: fields.Price,
            Company: fields.Company,
            Description: fields.Article
        }
        addNewProduct(product)
        res.redirect("/add")
    })
})

app.post("/editproduct", (req, res) => {
    const form = formidable({ multiples: true })
    form.parse(req, (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }
        updateProduct()
            .then((product => {
                product.updateOne(
                    {
                        "_id": ObjectId(`${fields.id}`)
                    },
                    {
                        "$set": {
                            "Price": fields.Price,
                            "ProductName": fields.ProductName,
                            "Company": fields.Company,
                            "ProductLink": fields.ProductLink,
                            "Description": fields.Description,
                            "LinkShop": fields.LinkShop,
                        }
                    },
                    {
                        upsert: true
                    })
                    .then((result) => {
                        console.log(result)
                        res.redirect("back")
                    })
            }))
    })
})

app.post("/delete/:id", (req, res) => {
    const id = req.params.id
    updateProduct()
        .then((product) => {
            product.deleteMany({ "_id": ObjectId(id) })
                .then((result) => {
                    console.log(result)
                    res.redirect("/")
                })
        })
})

app.get("/product/:id", (req, res) => {
    const id = req.params.id
    const o_id = ObjectId(id)
    const product = getProducts(o_id)
        .then((products) => {
            res.render("pages/detail", {
                products
            })
        })
})

app.get("/cheap", (req, res) => {
    const products = getProducts({ Price: { $lte: 30 } })
        .then((products) => {
            res.render("pages/cheap", {
                products
            })
        })
})

const PORT = process.env.PORT
app.listen(PORT, function () {
    console.log(`Server listening on ${PORT}`)
})