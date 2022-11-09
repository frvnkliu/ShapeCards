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

app.get('/', (req,res)=>{
    req.redirect = ('/login');
    //req.redirect = ('/cards');
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
