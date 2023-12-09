const express = require('express');
require('./src/config/db/db');
const productRouter = require('./src/routes/product.router');
const cartRouter = require('./src/routes/cart.router');
const sessionRouter = require('./src/routes/session.router');
const env = require('./src/config/env/env');
const passport = require('./src/config/passport/passport.config');
const app = express();

app.use(express.json());
app.use(passport.initialize());
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/api/session', sessionRouter);


const PORT = env.url.port || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));