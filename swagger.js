/*This file automatically generates the Swagger documentation for the REST API*/

// import swagger-autogen
const swaggerAutogen = require('swagger-autogen')();
// pass general information about the API to the swagger-autogen function
const doc = {
    info: {
        title: 'My API',
        description: 'Project 02: API for CSE341'
    },
    host: 'localhost:3000',    // In the swagger.JSON, change for the render url containing my project  
    schemes: ['http', 'https']
};

// create an output file in the root directory to save the documentation
const outputFile = './swagger.json';
// tell swagger-autogen where to look for the endpoints to document
const endpointsFiles = ['./server.js'];
// call the swagger built-in function to generate the swagger documentation
swaggerAutogen(outputFile, endpointsFiles, doc);
