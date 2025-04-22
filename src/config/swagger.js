// src/config/swagger.js
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TFB STUDIOS API',
      version: '1.0.0',
      description: 'API documentation for TFB STUDIOS backend system',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local Development Server',
      },
      {
        url: 'https://api.tfbstudios.com',
        description: 'Production Server',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // <-- All route files will be scanned for Swagger JSDoc
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };
