const express = require('express');

const cors = require('cors');

const axios = require('axios');

require('dotenv').config();

const server = express();

server.use(cors());

server.use(express.json());

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/fruits');
PORT = process.env.PORT || 8000

/////////////////////
// http://localhost:4000/test
server.get("/test", (req, res) => {
    res.send("hellloooooooooo")
})


///////////////////////
const fruitSchema = new mongoose.Schema({
    name: String,
    image: String,
    price: Number,

});

const userSchema = new mongoose.Schema({
    email: { type: String, unique: true },
    array: [fruitSchema]

});
const fruitModel = mongoose.model('user', userSchema);

const seedFunction = () => {
    const users = [
        {
            email: 'alaabaroud783@gmail.com',
            array: [
                {
                    name: "test",
                    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Test-Logo.svg/1200px-Test-Logo.svg.png",
                    price: 2
                }
            ]

        },
        {
            /// please add your right email here or it won't work!! 
            email: 't.hamoudi@ltuc.com',
            array: [
                {
                    name: "test",
                    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Test-Logo.svg/1200px-Test-Logo.svg.png",
                    price: 2
                }
            ]

        }

    ]
    fruitModel.create(users);
}

// seedFunction();


server.get('/getApi', getApi);
server.post('/addFav', addFav);
server.get('/getFav', getFav);
server.put('/updateFav/:id', updateFav);
server.delete ('/deleteFav/:id', deleteFav)



async function getApi(req, res) {
    axios.get("https://fruit-api-301.herokuapp.com/getFruit").then(result => {
        res.send(result.data.fruits)
    }).catch(err => {
        console.log(err);
    })
}

async function addFav(req, res) {
    const { email, name, image, price } = req.body;
    await fruitModel.findOne({ email: email }, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            result.array.push({ name: name, image: image, price: price })
            result.save();
            res.status(201).send('')
        }

    })
}

async function getFav (req, res) {
    const email = req.query.email;
    await fruitModel.findOne({email:email}, (err, result)=>{
        if (err) {
            console.log(err);
        }else{
            res.send(result.array)
        }
    })
}
async function updateFav (req, res) {
    const id = req.params.id;
    const {email ,name, image, price}= req.body
    await fruitModel.findOne({email:email}, (err, result)=>{
        if(err) {
            console.log(err);
        }else {
            const newArr = result.array.map ((item ) =>{
                if (item._id == id) {
                    item ={
                        name: name,
                        image: image,
                        price: price,
                    }
                    return item
                } else {
                    return item
                }
            })
            result.array = newArr;
            result.save();
            res.send(result.array)
        }
    })

}

async function deleteFav (req, res) {
    const email = req.query.email;
    const id = req.params.id;
    // console.log(id);
await fruitModel.findOne({email:email}, (err, result) =>{
    if (err) {
        console.log(err);
    }else {
        const newArr = result.array.filter((item)=>
           item._id == id ? false: true
        )
        result.array = newArr;
        result.save();
        res.send(result.array)
    }
})

}


server.listen(PORT, () => { console.log(`hello ${PORT}`); })