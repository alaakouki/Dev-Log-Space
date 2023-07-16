const path = require("path");
const express = require("express");
const session = require("express-session");
const exphbs = require("express-handlebars");
const routes = require("./controllers");
const helpers = require("./utils/helpers");
// const bcrypt = require("bcrypt");

const sequelize = require("./config/connection");
// To initialize sequelize with session store
const SequelizeStore = require("connect-session-sequelize")(session.Store);


const app = express();
const PORT = process.env.PORT || 5000;

// For set up Handlebars.js template engine with custom helpers so we can use the ( our custom and built-in helpers )
const hbs = exphbs.create({helpers});

// var secret = bcrypt.hashSync( , 10);

const sess = {
secret: "once upon a time I was frustrating but now I'm a full stack developer",
// secret,
cookie: {
    maxAge: 300000,
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    expires: 10 * 60 * 1000 // session will automatically expires after 10 mins.
},
resave: true,
saveUninitialized: true,
rolling: true, // To allow the session identifier cookie to expire in maxAge since the last response was sent instead of in maxAge since the session was last modified by the server.
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
app.use(express.static(path.join(__dirname,"public")));

app.use(routes);

sequelize.sync({force: false}).then(() => {
app.listen(PORT, () => console.log(
    `Server is running on http://localhost:${PORT}`));
});