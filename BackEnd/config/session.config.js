const session = require("express-session");
const MongoStore = require("connect-mongo").default;

const { app } = require("../app");

app.use(
  session({
    secret: process.env.SESSION_SECRET || "cersei",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 14,
      secure: true,
      sameSite: "none",
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI || "mongodb://localhost:27017/ArtiPro",
      ttl: 60 * 60 * 24 * 14,
    }),
  }),
);
