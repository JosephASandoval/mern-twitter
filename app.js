const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Pusher = require("pusher");
const cors = require("cors");
const db = require("./config/keys").mongoURI;
const users = require("./routes/api/users");
const tweets = require("./routes/api/tweets");
const bodyParser = require("body-parser");
const User = require("./models/User");
const mongoData = require("./models/mongoData");
const passport = require("passport");
const path = require("path");

if (process.env.NODE_ENV === "production") {
  app.use(express.static("frontend/build"));
  app.get("/", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"));
  });
}

app.use(passport.initialize());
require("./config/passport")(passport);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

//db config
mongoose
  .connect(db, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log(err));

// api routes
app.get("/", (req, res) => res.status(200).send("Hello World!!"));

app.post("/new/channel", (req, res) => {
  const dbData = req.body;
  mongoData.create(dbData, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});

app.post("/new/message", (req, res) => {
  const id = req.query.id;
  const newMessage = req.body;

  mongoData.updateMany(
    { _id: id },
    { $push: (conversation: newMessage) },
    (err, data) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(201).send(data);
      }
    }
  );
});

app.get("/get/channelList", (req, res) => {
  mongoData.find((err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      let channels = [];

      data.map((channelData) => {
        const channelInfo = {
          id: channelData._id,
          name: channelData.channelName,
        };

        channels.push(channelInfo);
      });

      res.status(200).send(channels);
    }
  });
});

app.get("/get/conversation", (req, res) => {
  const id = req.query.id;

  mongoData.find({ _id: id }, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

app.use("/api/users", users);
app.use("/api/tweets", tweets);

// listen
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
