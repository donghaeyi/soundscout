const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const app = express();

// Configure Handlebars
const hbs = exphbs.create({
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    partialsDir: path.join(__dirname, 'views', 'partials'),
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Route
app.get('/', (req, res) => {
    res.render('pages/home', { name: 'World' });
});

app.listen(3000, () => console.log('Server listening on port 3000'));
