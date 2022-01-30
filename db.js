const { MongoClient } = require('mongodb')
require('dotenv').config()
const url = process.env.DB_URL
const dbName = 'sc'

let _db

function _getDb() {
    return new Promise((resolve, reject) => {
        if (_db) {
            resolve(_db)
        } else {
            const url = process.env.DB_URL
            const client = new MongoClient(url)

            client
                .connect()
                .then((connected_client) => {
                    _db = connected_client.db("sc")
                    resolve(_db)
                })
                .catch((err) => reject(err))
        }
    })
}

function getProducts(query = "") {
    return _getDb()
        .then((db) => {
            const products = db.collection("designshop")
                .find(query)
                .toArray()
            return products
        })
}

function sampleProducts() {
    return _getDb()
        .then((db) => {
            const products = db.collection("designshop")
                .aggregate(
                    [{ $sample: { size: 6 } }]
                )
                .toArray()
            return products
        })
}

function addNewProduct(product) {
    return _getDb()
        .then((db) => {
            return db.collection("designshop")
                .insertOne(product)
        })
}

function updateProduct() {
    return _getDb()
        .then((db) => {
            return db.collection("designshop")
        })
}


module.exports = {
    _getDb,
    getProducts,
    addNewProduct,
    sampleProducts,
    updateProduct,
}