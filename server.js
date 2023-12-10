const express = require('express');
const exphbs = require('express-handlebars').engine;
require('./src/config/db/db');
const productRouter = require('./src/routes/product.router');
const cartRouter = require('./src/routes/cart.router');
const sessionRouter = require('./src/routes/session.router');
const env = require('./src/config/env/env');
const passport = require('./src/config/passport/passport.config');

const productViewRouter = require('./src/routes/product.view.router');
const app = express();

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.set('views', './src/views/');

app.use(express.json());
app.use(passport.initialize());
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/api/session', sessionRouter);
app.use('/products', productViewRouter);


const PORT = env.url.port || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));