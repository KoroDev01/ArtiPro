const session = require("express-session");
const MongoStore = require("connect-mongo").default;

const { app } = require("../app");

const sessionSecret =
  process.env.SESSION_SECRET ||
  (process.env.NODE_ENV === "production" ? null : "dev-only-not-for-production");

if (!sessionSecret) {
  throw new Error("SESSION_SECRET est requis.");
}

app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 14,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
    store: MongoStore.create({
      client: require("mongoose").connection.getClient(),
      ttl: 60 * 60 * 24 * 14,
    }),
  }),
);
