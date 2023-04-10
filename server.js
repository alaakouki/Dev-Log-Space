const path = require("path");
const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
const routes = require("./controllers");
const helpers = require("./utils/helpers");
// const bcrypt = require("bcrypt");

const sequelize = require("./config/connection");
const SequelizeStore = require("connect-session-sequelize")(session.Store);


const app = express();
const PORT = process.env.PORT || 3001;

// for set up Handlebars.js template engine with custom helpers so we can use the ( our custom and built-in helpers )
const hbs = exphbs.create({helpers});

// var secret = bcrypt.hashSync( , 10);

const sess = {
secret: "once upon a time",
// secret,
cookie: {
    maxAge: 300000,
    httpOnly: true,
    secure: false,
    sameSite: "strict",
},
resave: false,
saveUninitialized: true,
store: new SequelizeStore({
    db: sequelize
})
};

app.use(session(sess));

// this is how we set up our template angine and inform express that we using handlebars as template engine.
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static(path.join(__dirname,"pablic")));

app.use(routes);

sequelize.sync({force: false}).then(() => {
app.listen(PORT, () => console.log(
    `Server is running on http://localhost:${PORT}`));
});