const mongoose = require('mongoose'),
	URLSlugs = require('mongoose-url-slugs');

const Shape = new mongoose.Schema({
    type: String,
    pos: {x: Integer, y: Integer},
    color: {r: Integer, g: Integer, b: Integer}
});

const Card = new mongoose.Schema({
	name: String,
	backgroundcolor: {r: Integer, g: Integer, b: Integer},
	shapes: [Shape]
});

const User = new mongoose.Schema({
    username: String,
    hash: String,
    Cards: [Card],
    profilePicIndex: Integer
});