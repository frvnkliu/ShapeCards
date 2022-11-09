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
const Shape = mongoose.model('Shape');
const Card = mongoose.model('Card');

app.use(express.static(path.join(__dirname, '/')));

app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}));

//Middlware
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
    //res.render('shapeform',{});
    req.redirect = ('/shapeform');
    //req.redirect = ('/cards');
});

app.get('/shapeform', (req,res)=>{
    res.render('shapeform',{});
});

app.post('/shapeform', (req, res) => {
    console.log(req.body);
    const newShape = new Shape({type: req.body.shape, pos: {x: req.body.x, y: req.body.y} ,  color: {r: req.body.x, g: req.body.x, b: req.body.y}});
    newShape.save(function(err){
        if(err){
        console.log(err);
            res.render('/shapeform', {}); 
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
