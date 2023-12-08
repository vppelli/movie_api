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
mongoose.connect( process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const { title } = require('process');

const { check, validationResult } = require('express-validator');

const app = express();

// Setup the Logging, creates a write stream appends a log.txt file
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' })
app.use(morgan('combined', { stream: accessLogStream }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let allowedOrigins = ['http://localhost:8080', 'http://testsite.com', 'http://localhost:1234'];
//allow specific set of origins to access your API
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            // If a specific origin isn’t found on the list of allowed origins
            let message = 'The CORS policy for this application doesn\'t allow access from origin ' + origin;
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

// READ -----------------------------------------------------------------------
// Gets the endpoint '/' and sends a response
app.get('/', (req, res) => {
    res.send('You Arrived!');
});

// Gets the endpoint '/movies' and returns a list of movies in JSON
app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.find()
        .then((movies) => {
            res.status(200).json(movies);
        })
        .catch((err) => {
            res.status(500).send('Error: ' + err);
        });
});

// Gets requested movie, returns it in JSON
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Movies.findOne({ Title: req.params.Title })
        .then((movie) => {
            res.status(200).json(movie);
        })
        .catch((err) => {
            res.status(500).send('Error: ' + err);
        });
});

// Gets the endpoint '/genres' and returns a list of genres in JSON
app.get('/genres', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Genres.find()
        .then((genres) => {
            res.status(200).json(genres);
        })
        .catch((err) => {
            res.status(500).send('Error: ' + err);
        });
});

// Gets requested genre, returns it in JSON
app.get('/genres/:Name', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Genres.findOne({ Name: req.params.Name })
        .then((genre) => {
            res.status(200).json(genre);
        })
        .catch((err) => {
            res.status(500).send('Error: ' + err);
        });
});

// Gets the endpoint '/genres' and returns a list of genres in JSON
app.get('/directors', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Directors.find()
        .then((directors) => {
            res.status(200).json(directors);
        })
        .catch((err) => {
            res.status(500).send('Error: ' + err);
        });
});

// Gets requested genre, returns it in JSON
app.get('/directors/:Name', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Directors.findOne({ Name: req.params.Name })
        .then((director) => {
            res.status(200).json(director);
        })
        .catch((err) => {
            res.status(500).send('Error: ' + err);
        });
});

// Gets a users info and returns it in JSON
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
    await Users.findOne({ Username: req.params.Username })
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// CREATE -----------------------------------------------------------------------
// Create a new user and returns it in JSON
app.post('/users', [
    check('Username', 'Username is required').isLength({min: 4}),
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
                    .then((user) => {
                        res.status(201).send(req.body.Username + ' was Added');
                    })
                    .catch((error) => {
                        console.error(error);
                        res.status(500).send('Error' + error);
                    })
            }
        })

        .catch((error) => {
            console.error(error);
            res.status(500).send('Error' + error);
        });
});

// Adds a favorite movie to user and returns a Message + JSON
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
    // CONDITION TO CHECK User is the User
    if(req.user.Username !== req.params.Username){
        return res.status(400).send('Permission denied');
    }
    await Users.findOneAndUpdate({ Username: req.params.Username }, {
        $push: { FavoriteMovies: req.params.MovieID }
    },
        { new: true }) // This line makes sure that the updated document is returned
        .then(() => {
            res.status(201).send('Movie added to Favorites');
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// UPDATE -----------------------------------------------------------------------
// Updates a users info and returns a Message + JSON
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), [
    check('Username', 'Username is required').isLength({min: 4}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
  ], async (req, res) => {
    // CONDITION TO CHECK User is the User
    if(req.user.Username !== req.params.Username){
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
            res.status(500).send('Error: ' + err);
        })

});

// DELETE -----------------------------------------------------------------------
// Deletes users from DB, returns a Message
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
    // CONDITION TO CHECK User is the User
    if(req.user.Username !== req.params.Username){
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

app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
    // CONDITION TO CHECK User is the User
    if(req.user.Username !== req.params.Username){
        return res.status(400).send('Permission denied');
    }
    await Users.findOneAndUpdate({ Username: req.params.Username }, {
        $pull: { FavoriteMovies: req.params.MovieID }
    },
        { new: true }) // This line makes sure that the updated document is returned
        .then(() => {
            res.status(201).send('Movie removed from Favorites');
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
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});
