import express from 'express'
import path from 'path'
import mongoose from 'mongoose';
import session from 'express-session';
import { fileURLToPath } from 'url';
import './db.mjs';
import { createReadStream } from 'fs';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('view engine', 'hbs');

const User = mongoose.model('User');
const Shape = mongoose.model('Shape');
const Card = mongoose.model('Card');

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}));

app.use(express.json());

//Middleware
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
  });
  
// logging
app.use((req, res, next) => {
console.log(req.method, req.path, req.body);
next();
});
//

app.get('/', (req,res)=>{
    res.sendFile(__dirname + "public/index.html");
});

app.get('/cards', (req,res)=>{
    res.sendFile(__dirname + "public/cards.html");
})

app.post('/api/shape', (req, res) => {
    //will implement session stuff later
    Card.findOne({userId: '637c773b4d1612b0bc651fff', name: req.body.cardName}, (err, card)=>{
        if(err){
            console.log(err);
        }else if(card){
            //const newShape = new Shape({type: req.body.shape, pos: {x: req.body.x, y: req.body.y} ,  color: {r: req.body.x, g: req.body.x, b: req.body.y}});
            const newShape = req.body.shape;
            //console.log("hello");
            card.shapes.push(newShape);
            card.save(function(err){
                if(err){
                    console.log(err);
                }
            });
        }else{
            console.log("Not Found");
        }
    });
});

app.post('/api/card', (req, res)=>{
    console.log(req.body);
    const userId = '637c773b4d1612b0bc651fff';
    req.body.userId = userId;
    const newCard = new Card(req.body);
    newCard.save(function(err){
        if(err) console.log(err);
    });
});


app.get('/api/card', (req, res)=>{
    Result.find().sort('-createdAt').limit(5).exec((err, result) => {
        res.json(result);
    }); 
});

app.get('/login', (req,res)=>{
});

app.listen(process.env.PORT || 3000);
