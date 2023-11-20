const { default: mongoose } = require("mongoose");

let movieSchema = mongoose.Schema({
    Title: { type: String, required: true },
    Description: { type: String, required: true },
    Released: { type: String, required: true },
    Genre: [ String ],
    Director: [ String ],
    ImagePath: String,
    Featured: Boolean
});

let userSchema = mongoose.Schema({
    Username: { type: String, required: true },
    Password: { type: String, required: true },
    Email: { type: String, required: true },
    Birthday: Date,
    FavoriteMovies: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Movie' } ]
});

let genreSchema = mongoose.Schema({
    Name: { type: String, required: true },
    About: String
});

let directorSchema = mongoose.Schema({
    Name: { type: String, required: true },
    Bio: String,
    Born: String,
    Dead: String
});

let Movie = mongoose.model('Movie', movieSchema);
let Genre = mongoose.model('Genre', genreSchema);
let Director = mongoose.model('Director', directorSchema);
let User = mongoose.model('User', userSchema);

module.exports.Movie = Movie;
module.exports.Genre = Genre;
module.exports.Director = Director;
module.exports.User = User;