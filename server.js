const express = require("express");
const exphbs = require("express-handlebars").engine;
require("./src/config/db/db");
const productRouter = require("./src/routes/product.router");
const cartRouter = require("./src/routes/cart.router");
const sessionRouter = require("./src/routes/session.router");
const env = require("./src/config/env/env");
const passport = require("./src/config/passport/passport.config");
const cookieParser = require("cookie-parser");
const path = require("path");

const productViewRouter = require("./src/routes/product.view.router");
const sessionViewRouter = require("./src/routes/session.view.router");
const app = express();

app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main",
    extname: ".handlebars",
    helpers: {
      eq: function (a, b) {
        return a === b;
      },
      gt: function (a, b) {
        return a > b;
      },
      lt: function (a, b) {
        return a < b;
      },
      inc: function (a) {
        return a + 1;
      },
      dec: function (a) {
        return a - 1;
      },
    },
    engine: "handlebars",
  })
);

app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "src", "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(cookieParser());
app.use(
  "/public",
  express.static(
    path.join(__dirname, "public"),
    (setHeaders = (res, filePath) => {
      if (filePath.endsWith(".css")) {
        res.setHeader("Content-Type", "text/css");
      }
    })
  )
);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/session", sessionRouter);
app.use("/products", productViewRouter);
app.use("/session", sessionViewRouter);

const PORT = env.url.port || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
