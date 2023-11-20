const express = require('express'),
    morgan = require('morgan'),
    fs = require('fs'),
    path = require('path'),
    uuid = require('uuid'),
    mongoose = require('mongoose'),
    Models = require('./models.js'),
    Movies = Models.Movie,
    Users = Models.User,
    Genres = Models.Genre,
    Directors = Models.Director;

mongoose.connect('mongodb://localhost:27017/cfDB', { useNewUrlParser: true, useUnifiedTopology: true });

const { title } = require('process');

const app = express();

// Setup the Logging, creates a write stream appends a log.txt file
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' })
app.use(morgan('combined', { stream: accessLogStream }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup static serve
app.use(express.static('public'));

// READ -----------------------------------------------------------------------
// Gets the endpoint '/' and sends a response
app.get('/', (req, res) => {
    res.send('You Arrived!');
});

// Gets the endpoint '/movies' and returns a list of movies in JSON
app.get('/movies', (req, res) => {
    Movies.find()
        .then((movies) => {
            res.status(200).json(movies);
        })
        .catch((err) => {
            res.status(500).send('Error: ' + err);
        });
});

// Gets requested movie, returns it in JSON
app.get('/movies/:Title', (req, res) => {
    Movies.findOne({ Title: req.params.Title })
        .then((movie) => {
            res.status(200).json(movie);
        })
        .catch((err) => {
            res.status(500).send('Error: ' + err);
        });
});

// Gets the endpoint '/genres' and returns a list of genres in JSON
app.get('/genres', (req, res) => {
    Genres.find()
        .then((genres) => {
            res.status(200).json(genres);
        })
        .catch((err) => {
            res.status(500).send('Error: ' + err);
        });
});

// Gets requested genre, returns it in JSON
app.get('/genres/:Name', (req, res) => {
    Genres.findOne({ Name: req.params.Name })
        .then((genre) => {
            res.status(200).json(genre);
        })
        .catch((err) => {
            res.status(500).send('Error: ' + err);
        });
});

// Gets the endpoint '/genres' and returns a list of genres in JSON
app.get('/directors', (req, res) => {
    Directors.find()
        .then((directors) => {
            res.status(200).json(directors);
        })
        .catch((err) => {
            res.status(500).send('Error: ' + err);
        });
});

// Gets requested genre, returns it in JSON
app.get('/directors/:Name', (req, res) => {
    Directors.findOne({ Name: req.params.Name })
        .then((director) => {
            res.status(200).json(director);
        })
        .catch((err) => {
            res.status(500).send('Error: ' + err);
        });
});

// Gets the endpoint '/users' and returns a List of Users in JSON
app.get('/users', async (req, res) => {
    await Users.find()
        .then((users) => {
            res.status(200).json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// Gets a users info and returns it in JSON
app.get('/users/:Username', async (req, res) => {
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
app.post('/users', async (req, res) => {
    await Users.findOne({ Username: req.body.Username })
        .then((user) => {
            if (user) {
                return res.status(400).send(req.body.Username + ' already exists');
            } else {
                Users
                    .create({
                        Username: req.body.Username,
                        Password: req.body.Password,
                        Email: req.body.Email,
                        Birthday: req.body.Birthday
                    })
                    .then((user) => {
                        res.status(201).json(user);
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
app.post('/users/:Username/movies/:MovieID', async (req, res) => {
    await Users.findOneAndUpdate({ Username: req.params.Username }, {
        $push: { FavoriteMovies: req.params.MovieID }
    },
        { new: true }) // This line makes sure that the updated document is returned
        .then((updatedUser) => {
            res.status(201).send(updatedUser + ' Added');
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// UPDATE -----------------------------------------------------------------------
// Updates a users info and returns a Message + JSON
app.put('/users/:Username', async (req, res) => {
    await Users.findOneAndUpdate({ Username: req.params.Username }, {
        $set:
        {
            Username: req.body.Username,
            Password: req.body.Password,
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
app.delete('/users/:Username', async (req, res) => {
    await Users.findOneAndRemove({ Username: req.params.Username })
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

app.delete('/users/:Username/movies/:MovieID', async (req, res) => {
    await Users.findOneAndUpdate({ Username: req.params.Username }, {
        $pull: { FavoriteMovies: req.params.MovieID }
    },
        { new: true }) // This line makes sure that the updated document is returned
        .then((updatedUser) => {
            res.status(201).send(updatedUser + ' Removed');
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

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});
