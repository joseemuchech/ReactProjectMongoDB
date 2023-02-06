const express = require('express')
const { ObjectId } = require('mongodb')
const { connectToDb, getDb} = require('./db')
//middleware
const app = express()
app.use(express.json())

let db

connectToDb((err) => { 
if(!err){
    app.listen(3000, () => {
        console.log('app listening on port 3000')
    })
    db = getDb()
}
})

// routes
app.get('/books', (req, res) => {
    let books = []
    db.collection('books')
     .find()
     .forEach(book => books.push(book))
     .then(()=> {
          res.status(200).json(books)
     })
     .catch(()=> {
        res.status(500).json({err:'could not fetch the document'})
     })
    })

    app.get('/books/:id', (req, res) => {

        if (ObjectId.isValid(req.params.id)) {
            db.collection('books')
            .findOne({_id: ObjectId(req.params.id)})
            .then(doc => {
             res.status(200).json(doc)
            })
            .catch(err => {
             res.status(500).json({err: 'Could not fetch the doc'})
            })
        } else{
            res.status(500).json({err: 'Not a valid id'})
        }
        
     })
 app.post('/books', (req, res) => {
      const book = req.body
      db.collection('books')
      .insertOne(book)
      .then(result => { 
        res.status(201).json(result)
      })
      .catch(err => {
        res.status(500).json({err: 'Could not create the doc'})
       })


 })
 app.delete('/books/:id', (req, res) => {

    if (ObjectId.isValid(req.params.id)) {
        db.collection('books')
        .deleteOne({_id: ObjectId(req.params.id)})
        .then(result => {
         res.status(200).json(result)
        })
        .catch(err => {
         res.status(500).json({err: 'Could not delete the doc'})
        })
    } else{
        res.status(500).json({err: 'Not a valid id'})
    }
    
 })

 app.patch('/books/:id', (req, res) => {
    const updates =req.body

    if (ObjectId.isValid(req.params.id)) {
        db.collection('books')
        .updateOne({_id: ObjectId(req.params.id)}, {$set: updates})
        .then(result => {
         res.status(200).json(result)
        })
        .catch(err => {
         res.status(500).json({err: 'Could not fetch the doc'})
        })
    } else{
        res.status(500).json({err: 'Not a valid id'})
    }
    
 })
