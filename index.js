const express = require('express');
const morgan = require('morgan'),
    fs = require('fs'),
    path = require('path');
const app = express();
// Setup the Logging, creates a write stream appends a log.txt file
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' })
app.use(morgan('combined', { stream: accessLogStream }));

// List of top 10 movies
let topMovies = [
    {
        title: 'Gladiator',
        director: 'Ridley Scott',
        released: 'May 5, 2000'
    },
    {
        title: 'Saving Private Ryan',
        director: 'Steven Spielberg',
        released: 'July 24, 1998'
    },
    {
        title: 'The Matrix',
        director: 'Lana Wachowski, Lilly Wachowski',
        released: 'March 31, 1999'
    },
    {
        title: 'Alien',
        director: 'Ridley Scott',
        released: 'May 25, 1979'
    },
    {
        title: 'Predator',
        director: 'John McTiernan',
        released: 'June 12, 1987'
    },
    {
        title: 'The Fast and the Furious: Tokyo Drift',
        director: 'Justin Lin',
        released: 'June 16, 2006'
    },
    {
        title: 'Back to the Future',
        director: 'Robert Zemeckis',
        released: 'July 3, 1985'
    },
    {
        title: 'Deadpool',
        director: 'Tim Miller',
        released: 'February 12, 2016'
    },
    {
        title: 'Spider-Man',
        director: 'Sam Raimi',
        released: 'May 3, 2002'
    },
    {
        title: 'The Avengers',
        director: 'Joss Whedon',
        released: 'May 4, 2012'
    }
];

// Setup static serve
app.use(express.static('public'));

// Gets the endpoint '/' and sends a response
app.get('/', (req, res) => {
    res.send('You Arrived!');
});

// Gets the endpoint '/movies' and returns a JSON
app.get('/movies', (req, res) => {
    res.json(topMovies);
});

// Error-handling middleware function
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});
