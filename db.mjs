import mongoose from 'mongoose'
import mongooseSlugPlugin from 'mongoose-slug-plugin';


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

const ShapeSchema = new mongoose.Schema({
    type: String,
    pos: {x: Number, y: Number},
    color: {r: Number, g: Number, b: Number}
});

const CardSchema = new mongoose.Schema({
	name: String,
	backgroundcolor: {r: Number, g: Number, b: Number},
	shapes: [ShapeSchema]
});

const UserSchema = new mongoose.Schema({
    username: String,
    hash: String,
    Cards: [CardSchema],
    profilePicIndex: Number
});

mongoose.model('User', UserSchema);
mongoose.model('Card', CardSchema);
mongoose.model('Shape', ShapeSchema);