const session = require("express-session");
const MongoStore = require("connect-mongo").default;

const { app } = require("../app");

app.use(
  session({
    secret: process.env.SESSION_SECRET || "artipro_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 14,
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      ttl: 60 * 60 * 24 * 14,
    }),
  }),
);
