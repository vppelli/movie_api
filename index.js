// index.js

const express = require('express'),
    morgan = require('morgan'),
    fs = require('fs'),
    path = require('path'),
    mongoose = require('mongoose'),
    Models = require('./models.js'),
    cors = require('cors'),
    Movies = Models.Movie,
    Users = Models.User,
    Genres = Models.Genre,
    Directors = Models.Director;

// mongoose.connect('mongodb://localhost:27017/cfDB', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const { title } = require('process');

const { check, validationResult } = require('express-validator');

const app = express();

// Setup the Logging, creates a write stream appends a log.txt file
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' })
app.use(morgan('combined', { stream: accessLogStream }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//allow specific set of origins to access your API
let allowedOrigins = ['http://localhost:8080', 'http://testsite.com', 'http://localhost:1234', 'https://moviemikes.netlify.app', 'http://localhost:4200', 'https://vppelli.github.io'];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) { // If a specific origin isn’t found on the list of allowed origins
            let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
            return callback(new Error(message), false);
        }
        return callback(null, true);
    }
}));

let auth = require('./auth')(app);

const passport = require('passport');

require('./passport');

// Setup static serve
app.use(express.static('public'));
app.use(express.static('out'));

// READ -----------------------------------------------------------------------
/**
* Gets the endpoint '/' and sends a response
* @returns Message saying "You Arrived to MovieMike's API!"
*/
app.get('/', (req, res) => {
    res.send('You Arrived to MovieMike\'s API!');
});

/**
* Gets the endpoint '/movies' and returns a list of movies in JSON
* @function getAllMovies - Calls a list of Movies.
* @async
* @param {Object} req - Express request object.
* @param {Object} res - Express response object.
* @throws {Error} - If there is an unexpected error during the process or if permission is denied.
* @returns {Object} - The list of movies in json response, on success.
*/
app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.find().populate(['Genre', 'Director'])
        .then((movies) => {
            res.status(200).json(movies);
        })
        .catch((err) => {
            res.status(500).send('Error: Get Movies, ' + err);
        });
});


/**
* Gets the endpoint '/movies/:Title' and returns the movie in JSON
* @function getOneMovie - Calls a requested Movie.
* @async
* @param {Object} req - Express request object.
* @param {string} req.params.Title - The title of the movie to retrieve from the database.
* @param {Object} res - Express response object.
* @throws {Error} - If there is an unexpected error during the process or if permission is denied.
* @returns {Object} - The requested movie in json response, on success.
*/
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.findOne({ Title: req.params.Title }).populate(['Genre', 'Director'])
        .then((movie) => {
            res.status(200).json(movie);
        })
        .catch((err) => {
            res.status(500).send('Error: Get Movie Name, ' + err);
        });
});

/**
* Gets the endpoint '/genres' and returns a list of genres in JSON
* @function getAllGenres - Calls a list of Genres.
* @async
* @param {Object} req - Express request object.
* @param {Object} res - Express response object.
* @throws {Error} - If there is an unexpected error during the process or if permission is denied.
* @returns {Object} - The list of genres in json response, on success.
*/
app.get('/genres', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Genres.find()
        .then((genres) => {
            res.status(200).json(genres);
        })
        .catch((err) => {
            res.status(500).send('Error: Get Genres, ' + err);
        });
});

/**
* Gets the endpoint '/genres/:Name' and returns the genre in JSON
* @function getOneGenre - Calls a requested Genre.
* @async
* @param {Object} req - Express request object.
* @param {string} req.params.Name - The name of the genre to retrieve from the database.
* @param {Object} res - Express response object.
* @throws {Error} - If there is an unexpected error during the process or if permission is denied.
* @returns {Object} - The requested genre in json response, on success.
*/
app.get('/genres/:Name', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Genres.findOne({ Name: req.params.Name })
        .then((genre) => {
            res.status(200).json(genre);
        })
        .catch((err) => {
            res.status(500).send('Error: Get Genre Name, ' + err);
        });
});

/**
* Gets the endpoint '/directors' and returns a list of directors in JSON
* @function getAllDirectors - Calls a list of Directors.
* @async
* @param {Object} req - Express request object.
* @param {Object} res - Express response object.
* @throws {Error} - If there is an unexpected error during the process or if permission is denied.
* @returns {Object} - The list of Directors in json response, on success.
*/
app.get('/directors', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Directors.find()
        .then((directors) => {
            res.status(200).json(directors);
        })
        .catch((err) => {
            res.status(500).send('Error: ' + err);
        });
});

/**
* Gets the endpoint '/directors/:Name' and returns the director in JSON
* @function getOneDirector - Calls a requested Director.
* @async
* @param {Object} req - Express request object.
* @param {string} req.params.Name - The name of the director to retrieve from the database.
* @param {Object} res - Express response object.
* @throws {Error} - If there is an unexpected error during the process or if permission is denied.
* @returns {Object} - The requested director in json response, on success.
*/
app.get('/directors/:Name', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Directors.findOne({ Name: req.params.Name })
        .then((director) => {
            res.status(200).json(director);
        })
        .catch((err) => {
            res.status(500).send('Error: ' + err);
        });
});

/**
* Gets the endpoint '/users/:Username' and returns a user in JSON
* @function getUser - Calls the requested User.
* @async
* @param {Object} req - Express request object.
* @param {string} req.params.Username - The name of the user to retrieve from the database.
* @param {Object} res - Express response object.
* @throws {Error} - If there is an unexpected error during the process or if permission is denied.
* @returns {Object} - The requested User in json response, on success.
*/
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Users.findOne({ Username: req.params.Username }).populate({path: 'FavoriteMovies', populate: ['Genre', 'Director']})
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// CREATE -----------------------------------------------------------------------
/**
* Get the endpoint '/users' creates a new User and sends it to the database.
* @function createUser - Calls the database and creates new User.
* @async
* @param {Object} req - Express request object.
* @param {string} req.params.Username - The name of the Username to refrence.
* @param {Object} res - Express response object.
* @throws {Error} - If there is an unexpected error during the process or if permission is denied.
* @returns {status} - The created User in status response, on success.
*/
app.post('/users', [
    check('Username', 'Username is required').isLength({ min: 4 }),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
], async (req, res) => {

    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    await Users.findOne({ Username: req.body.Username })
        .then((user) => {
            if (user) {
                return res.status(400).send(req.body.Username + ' already exists');
            } else {
                Users
                    .create({
                        Username: req.body.Username,
                        Password: hashedPassword,
                        Email: req.body.Email,
                        Birthday: req.body.Birthday
                    })
                    .then(() => {
                        res.status(201).send(req.body.Username + ' was Added');
                    })
                    .catch((error) => {
                        console.error(error);
                        res.status(500).send('Error: Creating User,' + error);
                    })
            }
        })

        .catch((error) => {
            console.error(error);
            res.status(500).send('Error: Requesting creation of User,' + error);
        });
});

/**
* Get the endpoint '/users/:Username/movies/:MovieID' adds a movie to Users favorites and sends it to the database.
* @function addFavorites - Adds a Favorite movie to Users database.
* @async
* @param {Object} req - Express request object.
* @param {string} req.params.Username - The name of the Username to refrence.
* @param {string} req.params.MovieID - The ID of the Movie to refrence.
* @param {string} req.user - The name of the Logged in User to refrence.
* @param {Object} res - Express response object.
* @throws {Error} - If there is an unexpected error during the process or if permission is denied.
* @returns {status} - The favorite movie added to User in status response, on success.
*/
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
    // CONDITION TO CHECK User is the User
    if (req.user.Username !== req.params.Username) {
        return res.status(400).send('Permission denied');
    }
    await Users.findOneAndUpdate({ Username: req.params.Username }, {
        $push: { FavoriteMovies: req.params.MovieID }
    },
        { new: true }) // This line makes sure that the updated document is returned
        .then((added) => {
            res.status(201).json(added);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// UPDATE -----------------------------------------------------------------------
/**
* Get the endpoint '/users/:Username' and updates Userdata and sends it to the database.
* @function updateUser - Calls a request to update Userdata.
* @async
* @param {Object} req - Express request object.
* @param {string} req.params.Username - The name of the Username to refrence.
* @param {Object} res - Express response object.
* @throws {Error} - If there is an unexpected error during the process or if permission is denied.
* @returns {status} - The updated User in json response, on success.
*/
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), [
    check('Username', 'Username is required').isLength({ min: 4 }),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
], async (req, res) => {
    // CONDITION TO CHECK User is the User
    if (req.user.Username !== req.params.Username) {
        return res.status(400).send('Permission denied');
    }
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    await Users.findOneAndUpdate({ Username: req.params.Username }, {
        $set:
        {
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday
        }
    },
        { new: true }) // This line makes sure that the updated document is returned
        .then((updatedUser) => {
            res.status(200).json(updatedUser);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: Could not update User, ' + err);
        })

});

// DELETE -----------------------------------------------------------------------
/**
* Gets the endpoint '/users/:Username' and deletes the user
* @function deleteUser - Calls a requested to delete the User.
* @async
* @param {Object} req - Express request object.
* @param {string} req.params.Username - The name of the user to retrieve from the database.
* @param {Object} res - Express response object.
* @throws {Error} - If there is an unexpected error during the process or if permission is denied.
* @returns {status} - The requested User was deleted in status response, on success.
*/
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
    // CONDITION TO CHECK User is the User
    if (req.user.Username !== req.params.Username) {
        return res.status(400).send('Permission denied');
    }
    await Users.findOneAndDelete({ Username: req.params.Username })
        .then((user) => {
            if (!user) {
                res.status(400).send(req.params.Username + ' was not found');
            } else {
                res.status(200).send(req.params.Username + ' was deleted.');
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

/**
* Get the endpoint '/users/:Username/movies/:MovieID' deletes a movie to Users favorites and sends it to the database.
* @function deleteFavorites - Deletes a Favorite movie to Users database.
* @async
* @param {Object} req - Express request object.
* @param {string} req.params.Username - The name of the Username to refrence.
* @param {string} req.params.MovieID - The ID of the Movie to refrence.
* @param {string} req.user - The name of the Logged in User to refrence.
* @param {Object} res - Express response object.
* @throws {Error} - If there is an unexpected error during the process or if permission is denied.
* @returns {status} - The favorite movie deleted from User in status response, on success.
*/
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
    // CONDITION TO CHECK User is the User
    if (req.user.Username !== req.params.Username) {
        return res.status(400).send('Permission denied');
    }
    await Users.findOneAndUpdate({ Username: req.params.Username }, {
        $pull: { FavoriteMovies: req.params.MovieID }
    },
        { new: true }) // This line makes sure that the updated document is returned
        .then((removed) => {
            res.status(201).json(removed);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Error-handling middleware function --------------------------------------------
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log('Listening on Port ' + port);
});
