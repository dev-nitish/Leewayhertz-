require('./config/config');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}, (err) => {
    if (!err) { console.log('MongoDB connected Sucessfully!'); }
    else {
        console.log('Error in MongoDB connection :' + JSON.stringify(err, undefined, 2));
    }
});


const express = require('express');
const cors = require('cors');

var app = express();

app.use(express.json());
app.use(cors());

const User = mongoose.model('User', {
    name: {
        first: String,
        last: String
    },
    username: String,
    email: String,
    phone: [],
    date: Date
})

app.get('/api/users', (req, res) => {
    User.find((err, doc) => {
        if (!err) {
            res.status(200).send(doc);
        }
        else {
            res.status(422).send(err);
        }
    })
})

app.post('/api/users', (req, res) => {

    const data = new User({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        phone: req.body.phone,
        date: new Date()
    })
    console.log(data);

    data.save((err, doc) => {
        if (!err) { res.status(200).send(doc) }
        else res.status(422).send(err)
    });
})

app.get('/api/users/:name', (req, res) => {
    User.find((err, doc) => {
        if (!err) {
            let result = doc.filter(user => (user.name.first === req.params.name)
            );
            res.status(200).send(result);
        }
        else {
            res.status(422).send(err);
        }
    })
})



app.listen(process.env.PORT, () => {
    console.log(`Server started at http://localhost:${process.env.PORT}`)
})