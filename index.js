const express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    path = require('path'),
    uuid = require('uuid');
const { title } = require('process');

const app = express();

// Setup the Logging, creates a write stream appends a log.txt file
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), { flags: 'a' })
app.use(morgan('combined', { stream: accessLogStream }));

app.use(bodyParser.json());

// List of Users
let users = [
    {
        id: 1,
        name: "Willy",
        favoriteMovies: ['Deadpool']
    },
    {
        id: 2,
        name: "Timmy",
        favoriteMovies: ['Gladiator']
    }
];

// List of top 10 movies
let topMovies = [
    {
        title: 'Gladiator',
        genre: {
            name: 'Adventure',
            info: 'Adventure fiction is a type of fiction that usually presents danger, or gives the reader a sense of excitement.'
        },
        genreAssist: {
            name: 'Action',
            info: 'Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.'
        },
        discription: {
            released: 'May 5, 2000',
            about: 'Set in Roman times, the story of a once-powerful general forced to become a common gladiator. The emperor\'s son is enraged when he is passed over as heir in favour of his father\'s favourite general. He kills his father and arranges the murder of the general\'s family, and the general is sold into slavery to be trained as a gladiator - but his subsequent popularity in the arena threatens the throne.'
        },
        director: {
            name: 'Ridley Scott',
            birth: 1937,
            about: 'Sir Ridley Scott is an English filmmaker. He is best known for directing films in the science fiction, crime, and historical drama genres. His work is known for its atmospheric and highly concentrated visual style.'
        },
        coverArt: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcS_kenAC7V_GCDzYEeAwSw_dCFPa7ahAM_YgaHpPNpbzR_Z8tnC'
    },
    {
        title: 'Saving Private Ryan',
        genre: {
            name: 'War',
            info: 'War film is a film genre concerned with warfare, typically about naval, air, or land battles, with combat scenes central to the drama.'
        },
        genreAssist: {
            name: 'Action',
            info: 'Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.'
        },
        discription: {
            released: 'July 24, 1998',
            about: 'Captain John Miller (Tom Hanks) takes his men behind enemy lines to find Private James Ryan, whose three brothers have been killed in combat. Surrounded by the brutal realties of war, while searching for Ryan, each man embarks upon a personal journey and discovers their own strength to triumph over an uncertain future with honor, decency and courage.'
        },
        director: {
            name: 'Steven Spielberg',
            birth: 1946,
            about: 'Steven Allan Spielberg is an American film director, producer and screenwriter. A major figure of the New Hollywood era and pioneer of the modern blockbuster, he is the most commercially successful director in history.'
        },
        coverArt: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRQ89HMuHlCxJwu68S3e0JQLtY3o_uc2woCAF8Vbq3Y3JzWJMto'
    },
    {
        title: 'The Matrix',
        genre: {
            name: 'Sci-fi',
            info: 'Science fiction is a genre of speculative fiction, which typically deals with imaginative and futuristic concepts such as advanced science and technology, space exploration, time travel, parallel universes, and extraterrestrial life.'
        },
        genreAssist: {
            name: 'Action',
            info: 'Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.'
        },
        discription: {
            released: 'March 31, 1999',
            about: 'Neo (Keanu Reeves) believes that Morpheus (Laurence Fishburne), an elusive figure considered to be the most dangerous man alive, can answer his question -- What is the Matrix? Neo is contacted by Trinity (Carrie-Anne Moss), a beautiful stranger who leads him into an underworld where he meets Morpheus. They fight a brutal battle for their lives against a cadre of viciously intelligent secret agents. It is a truth that could cost Neo something more precious than his life.'
        },
        director: {
            name: 'Lana Wachowski',
            birth: 1965,
            about: 'Lana is known to be extremely well-read, loves comic books and exploring ideas of imaginary worlds,'
        },
        coverArt: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYrWt93X1W1_3diBmpiCWWyahENZadLzbsG2ZjsQSDeyTuHKd3'
    },
    {
        title: 'Alien',
        genre: {
            name: 'Horror',
            info: 'Horror is a film genre that seeks to elicit fear or disgust in its audience for entertainment purposes.'
        },
        genreAssist: {
            name: 'Sci-fi',
            info: 'Science fiction is a genre of speculative fiction, which typically deals with imaginative and futuristic concepts such as advanced science and technology, space exploration, time travel, parallel universes, and extraterrestrial life.'
        },
        discription: {
            released: 'May 25, 1979',
            about: 'In deep space, the crew of the commercial starship Nostromo is awakened from their cryo-sleep capsules halfway through their journey home to investigate a distress call from an alien vessel. The terror begins when the crew encounters a nest of eggs inside the alien ship. An organism from inside an egg leaps out and attaches itself to one of the crew, causing him to fall into a coma.'
        },
        director: {
            name: 'Ridley Scott',
            birth: 1937,
            about: 'Sir Ridley Scott is an English filmmaker. He is best known for directing films in the science fiction, crime, and historical drama genres. His work is known for its atmospheric and highly concentrated visual style.'
        },
        coverArt: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTgS4EaCIATEXUnDBg-FkJui_Tkjh1YiS_zhWvOpcGostwp9SQp'
    },
    {
        title: 'Predator',
        genre: {
            name: 'Sci-fi',
            info: 'Science fiction is a genre of speculative fiction, which typically deals with imaginative and futuristic concepts such as advanced science and technology, space exploration, time travel, parallel universes, and extraterrestrial life.'
        },
        genreAssist: {
            name: 'Action',
            info: 'Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.'
        },
        discription: {
            released: 'June 12, 1987',
            about: 'Dutch (Arnold Schwarzenegger), a soldier of fortune, is hired by the U.S. government to secretly rescue a group of politicians trapped in Guatemala. But when Dutch and his team, which includes weapons expert Blain (Jesse Ventura) and CIA agent George (Carl Weathers), land in Central America, something is gravely wrong. After finding a string of dead bodies, the crew discovers they are being hunted by a brutal creature with superhuman strength and the ability to disappear into its surroundings.'
        },
        director: {
            name: 'John McTiernan',
            birth: 1951,
            about: 'John Campbell McTiernan Jr. is an American filmmaker. He is best known for his action films, including Predator, Die Hard, and The Hunt for Red October.'
        },
        coverArt: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoQEZpyIPUtZXZWIw6xRip_3ejcwgRuMb7fgKb2yrqMG-pevDj'
    },
    {
        title: 'The Fast and the Furious: Tokyo Drift',
        genre: {
            name: 'Drama',
            info: 'Drama as a Genre. Like fiction, drama—sometimes referred to as a play—features characters caught up in a plot, or series of events in a storyline.'
        },
        genreAssist: {
            name: 'Action',
            info: 'Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.'
        },
        discription: {
            released: 'June 16, 2006',
            about: 'Sean Boswell (Lucas Black) always feels like an outsider, but he defines himself through his victories as a street racer. His hobby makes him unpopular with the authorities, so he goes to live with his father in Japan. Once there and even more alienated, he learns about an exciting, but dangerous, new style of the sport. The stakes are high when Sean takes on the local champion and falls for the man\'s girlfriend.#'
        },
        director: {
            name: 'Justin Lin',
            birth: 1971,
            about: 'Justin Lin is a Taiwanese-born American film and television director, producer, and screenwriter. His films have grossed over $3 billion USD worldwide as of March 2017.'
        },
        coverArt: 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcQprJWtJkNo7sQtX-vTxOJ6v7M8LNcCDfq1JreVXrYFaskoSBnu'
    },
    {
        title: 'Back to the Future',
        genre: {
            name: 'Comedy',
            info: 'Comedy is a genre of fiction that consists of discourses or works intended to be humorous or amusing by inducing laughter, especially in theatre, film, stand-up comedy, television, radio, books, or any other entertainment medium.'
        },
        genreAssist: {
            name: 'Sci-Fi',
            info: 'Science fiction is a genre of speculative fiction, which typically deals with imaginative and futuristic concepts such as advanced science and technology, space exploration, time travel, parallel universes, and extraterrestrial life.'
        },
        discription: {
            released: 'July 3, 1985',
            about: 'In this 1980s sci-fi classic, small-town California teen Marty McFly (Michael J. Fox) is thrown back into the \'50s when an experiment by his eccentric scientist friend Doc Brown (Christopher Lloyd) goes awry. Traveling through time in a modified DeLorean car, Marty encounters young versions of his parents (Crispin Glover, Lea Thompson), and must make sure that they fall in love or he\'ll cease to exist. Even more dauntingly, Marty has to return to his own time and save the life of Doc Brown.'
        },
        director: {
            name: 'Robert Zemeckis',
            birth: 1952,
            about: 'Robert Lee Zemeckis is an American filmmaker. He first came to public attention as the director of the action-adventure romantic comedy Romancing the Stone, the science-fiction comedy Back to the Future film trilogy, and the live-action/animated comedy Who Framed Roger Rabbit.'
        },
        coverArt: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRXyvXDAYepgBTOGV0GC7iQ_rYap44J-X-vncJ1pztviM0ELmQ8'
    },
    {
        title: 'Deadpool',
        genre: {
            name: 'Action',
            info: 'Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.'
        },
        genreAssist: {
            name: 'Adventure',
            info: 'Adventure fiction is a type of fiction that usually presents danger, or gives the reader a sense of excitement.'
        },
        discription: {
            released: 'February 12, 2016#',
            about: 'Wade Wilson (Ryan Reynolds) is a former Special Forces operative who now works as a mercenary. His world comes crashing down when evil scientist Ajax (Ed Skrein) tortures, disfigures and transforms him into Deadpool. The rogue experiment leaves Deadpool with accelerated healing powers and a twisted sense of humor. With help from mutant allies Colossus and Negasonic Teenage Warhead (Brianna Hildebrand), Deadpool uses his new skills to hunt down the man who nearly destroyed his life.'
        },
        director: {
            name: 'Tim Miller',
            birth: 1964,
            about: 'Timothy Miller is an American filmmaker. He made his feature-film directing debut with Deadpool. He was nominated for the Academy Award for Best Animated Short Film as co-story writer and executive producer of the short animated film Gopher Broke.'
        },
        coverArt: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcQw1IlVEr7IFM65a3-3G_HZT5sCD48wjABqe0GeT4DqbjXNO8Lo'
    },
    {
        title: 'Spider-Man',
        genre: {
            name: 'Fantasy',
            info: 'Fantasy is a genre of speculative fiction involving magical elements, typically set in a fictional universe and usually inspired by mythology or folklore.'
        },
        genreAssist: {
            name: 'Action',
            info: 'Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.'
        },
        discription: {
            released: 'May 3, 2002',
            about: '"Spider-Man" centers on student Peter Parker (Tobey Maguire) who, after being bitten by a genetically-altered spider, gains superhuman strength and the spider-like ability to cling to any surface. He vows to use his abilities to fight crime, coming to understand the words of his beloved Uncle Ben: "With great power comes great responsibility."'
        },
        director: {
            name: 'Sam Raimi',
            birth: 1959,
            about: 'Samuel M. Raimi is an American filmmaker. He is best known for directing the first three films in the Evil Dead franchise and the Spider-Man trilogy.'
        },
        coverArt: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcRnTcyXlF38VmQJozasV7WqliCvMbU3r-A8p5hJoJzttfkqD1KI'
    },
    {
        title: 'The Avengers',
        genre: {
            name: 'Adventure',
            info: 'Adventure fiction is a type of fiction that usually presents danger, or gives the reader a sense of excitement.'
        },
        genreAssist: {
            name: 'Action',
            info: 'Action film is a film genre in which the protagonist is thrust into a series of events that typically involve violence and physical feats.'
        },
        discription: {
            released: 'May 4, 2012',
            about: 'When Thor\'s evil brother, Loki (Tom Hiddleston), gains access to the unlimited power of the energy cube called the Tesseract, Nick Fury (Samuel L. Jackson), director of S.H.I.E.L.D., initiates a superhero recruitment effort to defeat the unprecedented threat to Earth. Joining Fury\'s "dream team" are Iron Man (Robert Downey Jr.), Captain America (Chris Evans), the Hulk (Mark Ruffalo), Thor (Chris Hemsworth), the Black Widow (Scarlett Johansson) and Hawkeye (Jeremy Renner).'
        },
        director: {
            name: 'Joss Whedon',
            birth: 1964,
            about: 'Joseph Hill Whedon is an American screenwriter, director, producer, comic book writer, and composer.'
        },
        coverArt: 'https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcTp0qlAoWcOOswIkL_qpjYzJqCCDmWXiBzCXiqbE43Obo8c0Z-s'
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
    res.status(200).json(topMovies);
});
// Gets the endpoint '/users/list' and returns a JSON
app.get('/users', (req, res) => {
    res.status(200).json(users);
});

// CREATE
app.post('/users', (req, res) => {
    const newUser = req.body;

    if (newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).send(newUser.name + ' has been created with ID:' + newUser.id);
    } else {
        res.status(400).send('users need names');
    }
});

app.post('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find( user => user.id == id);

    if (user) {
        user.favoriteMovies.push(movieTitle);
        res.status(200).send(movieTitle + ' has been added to user ' + user.name + ' with the ID:' + id)
    } else {
        res.status(400).send('no such user');
    }
});

// UPDATE
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const updateUser = req.body;

    let user = users.find( user => user.id == id);

    if (user) {
        user.name = updateUser.name;
        res.status(200).json(user);
    } else {
        res.status(400).send('no such user');
    }
});

// DELETE
app.delete('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;

    let user = users.find( user => user.id == id);

    if (user) {
        user.favoriteMovies = user.favoriteMovies.filter( title => title !== movieTitle);
        res.status(200).send(movieTitle + ' has been removed to user ' + user.name + ' with the ID:' + id);
    } else {
        res.status(400).send('no such user');
    }
});

app.delete('/users/:id', (req, res) => {
    const { id } = req.params;

    let user = users.find( user => user.id == id);

    if (user) {
        users = users.filter( user => user.id != id);
        res.status(200).send('User ' + user.name + ' ID:' + user.id + ' has been removed');
    } else {
        res.status(400).send('no such user');
    }
});

// READ
app.get('/users/:id', (req, res) => {
    const { id } = req.params;

    let user = users.find( user => user.id == id);

    if (user) {
        res.status(200).json(user);
    } else {
        res.status(400).send('no such user');
    }
});

app.get('/movies/:title', (req, res) => {
    const { title } = req.params;
    const movie = topMovies.find( movie => movie.title === title );

    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(404).send('Could not find "' + title + '" May be writen wrong or Unavalible.');
    }
});

app.get('/movies/genre/:genreName', (req, res) => {
    const { genreName } = req.params;
    const movieGenre = topMovies.find( name => name.genre.name === genreName ).genre;

    if (movieGenre) {
        res.status(200).json(movieGenre);
    } else {
        res.status(404).send('Unknown Genre');
    }
});

app.get('/movies/director/:directorName', (req, res) => {
    const { directorName } = req.params;
    const directors = topMovies.find( name => name.director.name === directorName ).director;

    if (directors) {
        res.status(200).json(directors);
    } else {
        res.status(404).send('Unknown director');
    }
});

// Error-handling middleware function
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});
