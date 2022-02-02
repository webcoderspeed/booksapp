### Dependencies used:

    "bcryptjs": "^2.4.3",
    "colors": "^1.4.0",
    "dotenv": "^15.0.0",
    "express": "^4.17.2",
    "express-async-handler": "^1.2.0",
    "jsonwebtoken": "^8.5.1",
    "mongoose": "^6.1.10",
    "morgan": "^1.10.0"
    "nodemon": "^2.0.15"

> Note: all the above mentioned dependencies are listed in the package.json file.****

## Instructions for use

### After cloning the file first install the node dependencies using the command:

> npm install

##### Now add the .env file in the project root directory

<img src='./folder structure.png' alt='folder structure' />
> The folder structure should look like above image
> Now add the .env file variables

      MONGO_URI = mongodb://localhost:27017/booksapp
      JWT_SECRET = mysecret

> Then run the application using the command
> npm run server
