// index.js (server-side)
const express = require('express');
const exphbs = require('express-handlebars');
const app = express();

// Configure Handlebars as the templating engine
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

// Define a route that renders an HBS template
app.get('/', (req, res) => {
    const data = {
        name: 'World'
    };
    res.render('home', data); // Renders views/home.handlebars with the 'data' object
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});