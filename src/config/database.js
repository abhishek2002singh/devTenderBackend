const mongoose  = require('mongoose')

// Importing the environment variables using the dotenv library
// require("dotenv").config();
const dotenv = require('dotenv');

dotenv.config();

//use can use both 

// Defining a function to connect to the database
// const dbConnect = async() => {
// 	// Connecting to the database using the provided URL from the environment variables
// 	mongoose.connect(process.env.DATABASE_URL, {
// 			useNewUrlParser: true,
// 			useUnifiedTopology: true,
// 		})
// 		// If the connection is successful, log a success message
// 		.then(() => console.log("DB CONNECTION SUCCESS"))
// 		// If there are issues connecting to the database, log an error message and exit the process
// 		.catch((err) => {
// 			console.log(`DB CONNECTION ISSUES`);
// 			console.error(err.message);
// 			process.exit(1);
// 		});
// };


const dbConnect = async() => {
	// Connecting to the database using the provided URL from the environment variables
	try{ 
		await mongoose.connect(process.env.DATABASE_URL)
		console.log('Database connected successfully');

	}catch(error){
		console.error('Database connection error:', error);
        throw error;
		process.exit(1);
	}
	
};

// Exporting the dbConnect function for use in other files
module.exports = dbConnect;

