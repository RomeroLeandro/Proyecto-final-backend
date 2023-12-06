# My Backend App

This is a simple backend application built with Express.js and MongoDB. It provides CRUD operations for products.

## Project Structure

```
my-backend-app
├── src
│   ├── server.js
│   ├── dao
│   │   └── product.dao.js
│   ├── models
│   │   └── product.model.js
│   ├── services
│   │   └── product.service.js
│   ├── controllers
│   │   └── product.controller.js
│   └── routes
│       └── product.routes.js
├── package.json
└── README.md
```

## Description

- `src/server.js`: This file is the entry point of the application. It sets up the express app, connects to the MongoDB database, and sets up the routes for the application.

- `src/dao/product.dao.js`: This file exports a class `ProductDao` which interacts with the MongoDB database. It has methods for creating, reading, updating, and deleting products in the database.

- `src/models/product.model.js`: This file exports a Mongoose model `Product` for the product document in the MongoDB database. It defines the schema for the product document.

- `src/services/product.service.js`: This file exports a class `ProductService` which uses `ProductDao` to perform CRUD operations. It contains the business logic for handling products.

- `src/controllers/product.controller.js`: This file exports a class `ProductController` which uses `ProductService` to handle HTTP requests related to products. It has methods for handling requests for creating, reading, updating, and deleting products.

- `src/routes/product.routes.js`: This file exports a function `setProductRoutes` which sets up the routes for handling products. It uses `ProductController` to handle these routes.

- `package.json`: This file is the configuration file for npm. It lists the dependencies and scripts for the project.

## Installation

1. Clone the repository: `git clone https://github.com/username/my-backend-app.git`
2. Navigate to the project directory: `cd my-backend-app`
3. Install the dependencies: `npm install`
4. Start the server: `npm start`

## Usage

The application provides the following endpoints:

- `GET /products`: Fetch all products
- `GET /products/:id`: Fetch a single product by id
- `POST /products`: Create a new product
- `PUT /products/:id`: Update a product by id
- `DELETE /products/:id`: Delete a product by id

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)