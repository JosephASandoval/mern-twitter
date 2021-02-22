const express = require("express");
const app = express();
const mongoose = require("mongoose");
const db = require("./config/keys").mongoURI;

const User = require("./models/User");
const bodyParser = require("body-parser");
const passport = require("passport");

const users = require("./routes/api/users");
const tweets = require("./routes/api/tweets");

mongoose
  .connect(db, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  const user = new User({
    handle: "jim",
    email: "jim@gmail.com",
    password: "password",
  });
  user.save();
  res.send("Hello World!!");
});
// request object and response object

app.use(passport.initialize());
require("./config/passport")(passport);

app.use("/api/users", users);
app.use("/api/tweets", tweets);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
