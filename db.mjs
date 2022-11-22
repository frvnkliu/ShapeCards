import mongoose, { Schema } from 'mongoose'

// is the environment variable, NODE_ENV, set to PRODUCTION? 
import fs from 'fs';
import path from 'path';
import url from 'url';
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));


let dbconf;
if (process.env.NODE_ENV === 'PRODUCTION') {
 // if we're in PRODUCTION mode, then read the configration from a file
 // use blocking file io to do this...
 const fn = path.join(__dirname, 'config.json');
 const data = fs.readFileSync(fn);

 // our configuration file will be in json, so parse it and set the
 // conenction string appropriately!
 const conf = JSON.parse(data);
 dbconf = conf.dbconf;
} else {
 // if we're not in PRODUCTIONmihjse  mode, then use
 dbconf = 'mongodb://localhost/final-project';
}

mongoose.connect(dbconf);

const colorSchema = new mongoose.Schema({
    r: Number,
    g: Number,
    b: Number
})

const ShapeSchema = new mongoose.Schema({
    type: String,
    pos: {x: Number, y: Number},
    color: colorSchema
});

const CardSchema = new mongoose.Schema({
	userId: {type: mongoose.Types.ObjectId}, 
    name: {type: String},
	backgroundcolor: colorSchema,
	shapes: [ShapeSchema]
}, { timestamps: true });

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true},
    hash: {type: String, required: true},
    profilePicIndex: Number
});


CardSchema.index({userId: 1, name: 1}, {unique: true});

mongoose.model('User', UserSchema);
mongoose.model('Card', CardSchema);
mongoose.model('Shape', ShapeSchema);