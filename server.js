const express = require('express');
const exphbs = require('express-handlebars').engine;
require('./src/config/db/db');
const productRouter = require('./src/routes/product.router');
const cartRouter = require('./src/routes/cart.router');
const sessionRouter = require('./src/routes/session.router');
const env = require('./src/config/env/env');
const passport = require('./src/config/passport/passport.config');
const cookieParser = require('cookie-parser');

const productViewRouter = require('./src/routes/product.view.router');
const sessionViewRouter = require('./src/routes/session.view.router');
const app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', './src/views/');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(cookieParser());
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/api/session', sessionRouter);
app.use('/products', productViewRouter);
app.use('/session', sessionViewRouter);


const PORT = env.url.port || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));