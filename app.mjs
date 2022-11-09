import express from 'express'
import path from 'path'
import mongoose from 'mongoose';
import session from 'express-session';
import { fileURLToPath } from 'url';
import './db.mjs';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('view engine', 'hbs');

const User = mongoose.model('User');
const Article = mongoose.model('Shape');
const Card = mongoose.model('Card');

app.get('/', (req,res)=>{
    req.redirect = ('/shapeform');
    //req.redirect = ('/cards');
});

app.get('/shapeform', (req,res)=>{
    res.render('shapeform',{});
});

app.post('/shapeform', (req, res) => {
    //
    const newShape = new Shape({type: req.body.shape, pos: {x: req.body.x, y: req.body.y} ,  color: {r: req.body.x, g: req.body.x, b: req.body.y}});
    newShape.save(function(err){
        if(err){
        console.log(err);
            res.render('/shapeform', {message: 'Error saving shape: ' + err}); 
        }else{
            res.redirect('/');
        }
    });
});



app.get('/login', (req,res)=>{
    res.render('login', {});
});

app.get('/register', (req,res)=>{
    res.render('register', {});
});

app.get('/cards', (req,res)=>{
    res.render('profile', {"cards": [1,2,3]});
});

app.get('/editor', (req,res)=>{
    res.render('editor', {"card": 1});
});

app.listen(process.env.PORT || 3000);
