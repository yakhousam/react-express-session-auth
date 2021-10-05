const express = require("express");
const passport = require("passport");
const Strategy = require("passport-local");
const cors = require("cors");
const session = require("express-session");

const app = express();
const port = process.env.PORT || 3001;

const users = [
  { id: "1", username: "yakhousam", password: "123456" },
  { id: "2", username: "abe", password: "123456" },
];

passport.use(
  new Strategy(function (username, password, done) {
    console.log(username, password);
    const user = users.find(
      (user) => user.username === username && user.password === password
    );
    if (!user) {
      return done(null, false, { message: "Incorrect username or password." });
    }
    return done(null, user);
  })
);
// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  The
// typical implementation of this is as simple as supplying the user ID when
// serializing, and querying the user record by ID from the database when
// deserializing.
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  const user = users.find((user) => user.id === id);
  done(null, user);
});

app.use(
  session({
    secret: "keyboard cat",
    cookie: {
      secure: false,
    },
    resave: false,
    saveUninitialized: true,
  })
);
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000", "https://cc2e-105-235-135-47.ngrok.io"],
    credentials: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.post("/login", passport.authenticate("local"), (req, res) => {
  res.json({ message: "login success", user: req.user });
});

app.get("/islogedin", (req, res) => {
  res.json({ isLoggedIn: req.isAuthenticated() });
});

function isAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.status(403).json({ message: "not authorized" });
  }
  {
    next();
  }
}
app.get("/greeting", isAuthenticated, (req, res) => {
  res.json({ message: `gretting from ${req.user?.username}` });
});

app.listen(port, () => console.log("server running on port ", port));
