const express = require("express");
const exphbs = require("express-handlebars");
const path = require("path");
const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "resources")));

// Configure Handlebars
const hbs = exphbs.create({
  extname: ".hbs",
  layoutsDir: path.join(__dirname, "views", "layouts"),
  partialsDir: path.join(__dirname, "views", "partials"),
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// Route
app.get('/', (req, res) => {
    res.render('pages/home');
});

app.get('/home', (req, res) => {
    res.render('pages/home');
});

app.get('/recognition', (req,res) => {
    res.render('pages/recognition')
app.get("/", (req, res) => {
  res.render("pages/home");
});

app.get("/recognition", (req, res) => {
  res.render("pages/recognition");
});

app.get("/learnmore", (req, res) => {
  res.render("pages/learnmore");
});

app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
