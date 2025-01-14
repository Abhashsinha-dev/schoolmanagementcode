School Management System API
Overview
The School Management System API is a RESTful API designed for managing schools, classrooms, and students. This API allows Superadmins and School Administrators to manage entities such as schools, classrooms, and student data with appropriate role-based access control (RBAC).

Technologies Used
Node.js: Backend runtime environment.
Express.js: Web framework for building the API.
MongoDB: NoSQL database for data persistence.
JWT (JSON Web Token): For authentication.
Mongoose: ODM for MongoDB.
bcryptjs: For password hashing.
dotenv: To manage environment variables.
Jest: For unit testing.
Rate Limiting: express-rate-limit package for API rate limiting.
Running the API Locally
Follow the steps below to run the School Management System API on your local machine:

1. Clone the Repository
Clone the repository to your local machine using the following command:

bash
Copy code
git clone <repository-url>
Navigate to the project folder:

bash
Copy code
cd <project-directory>
2. Install Dependencies
Navigate to the API folder and install the required dependencies by running:

bash
Copy code
npm install
3. Restore the Database
You can restore the database from the database folder located in the root of the repository. Ensure MongoDB is running on your local machine or set up a MongoDB instance to connect to.

Copy the database files from the database folder to your local MongoDB instance (if applicable).
4. Set Up Environment Variables
Create a .env file in the root of the project directory and configure the following environment variables:

bash
Copy code
MONGO_URI=<your-mongo-uri>
JWT_SECRET=<your-jwt-secret>
Ensure that the MongoDB URI points to your local or cloud MongoDB instance.

5. Running the API
Start the application by running:

bash
Copy code
npm start
This will start the API server on the default port (usually 3000).

6. Testing the Endpoints
There is a Postman test collection available in the repository that contains tests for all API endpoints. You can import the collection into Postman and run the tests for each API endpoint.

7. Running Test Cases
To run the unit tests for the API, use the following command:

bash
Copy code
npm run test
This will execute the test cases defined in the tests folder using Jest.
