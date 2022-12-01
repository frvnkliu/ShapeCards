import express from 'express'
import path from 'path'
import mongoose from 'mongoose';
import session from 'express-session';
import { fileURLToPath } from 'url';
import './db.mjs';
import passport from 'passport';
import connectEnsureLogin from 'connect-ensure-login';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const User = mongoose.model('User');
const Card = mongoose.model('Card');

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: false }));

app.use(session({
    secret: 'pineapple cow',
    resave: false,
    saveUninitialized: true,
    //cookie: { maxAge: 24*60 * 60 * 1000 } // uncomment for 24 hour cookies
}));

app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//Middleware
app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
  });
  
// logging
/*app.use((req, res, next) => {
    console.log(req.method, req.path, req.body);
    next();
});*/
//

app.get('/cards', connectEnsureLogin.ensureLoggedIn(), (req,res)=>{
    res.sendFile(__dirname + "/public/cards.html");
});

app.get('/login', (req,res)=>{
    res.sendFile(__dirname + "/public/login.html");
});

app.post('/login', passport.authenticate('local', { failureRedirect: '/login',  failureMessage: true }),  function(req, res) {
    res.redirect('/cards');
});

app.get('/register', (req,res)=>{
    //static file serve
    res.sendFile(__dirname + "/public/register.html");
});

app.post('/register', (req,res)=>{
    //Registers user using passport
    User.register({ username: req.body.username, active: false }, req.body.password, (err)=>{
        if(err && (err.name !== 'UserExistsError')) res.redirect('/register');
        else res.redirect('/login');
    });
});

app.get('/logout', function(req, res) {
    //passport
    req.logout((err) =>{
        res.redirect('/login');
    });
});

app.post('/api/shape', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
    //Find Card to add shape to it
    Card.findOne({userId: req.user._id, name: req.body.cardName}, (err, card)=>{
        if(err){
            console.log(err);
        }else if(card){
            const newShape = req.body.shape;
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

app.post('/api/cards', connectEnsureLogin.ensureLoggedIn(), (req, res)=>{
    //Adds new card to user
    const userId = req.user._id;
    req.body.userId = userId;
    //mongoose to save new Card
    const newCard = new Card(req.body);
    newCard.save(function(err){
        if(err){
            console.log(err);
            res.status(400).send('Duplicate Name');
        } else{
            res.status(200).send('Okay');
        }
    });
});

app.get('/api/cards', connectEnsureLogin.ensureLoggedIn(), (req, res)=>{
    //implement getting userId
    const userId = req.user._id;
    Card.find({userId: userId}).sort('-createdAt').exec((err, cards) => {
        res.json(cards);
    }); 
});

app.get('/api/card', connectEnsureLogin.ensureLoggedIn(), (req, res)=>{
    //Find a single card given a name in the query
    const name = req.query.name;
    const userId = req.user._id;
    Card.findOne({userId: userId, name: name}).exec((err, cards) => {
        res.json(cards);
    }); 
});

app.delete('/api/card', connectEnsureLogin.ensureLoggedIn(), (req, res)=>{
    //Deletes a single card given a name in the query
    const name = req.query.name;
    const userId = req.user._id;
    Card.findOneAndDelete({userId: userId, name: name}).exec((err) => {
        if(err){
            res.status(404).send('not found');
        }else{
            res.status(200).send('deleted');
        }
    }); 
});

app.listen(process.env.PORT || 3000);
