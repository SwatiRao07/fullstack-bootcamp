import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task Notes API",
      version: "1.0.0",
      description:
        "A REST API for managing tasks and notes with full CRUD support, structured logging, and metrics.",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    components: {
      schemas: {
        Task: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            title: { type: "string", example: "Buy groceries" },
            description: { type: "string", example: "Milk, bread, and eggs" },
            status: {
              type: "string",
              enum: ["todo", "in-progress", "done"],
              default: "todo",
            },
            priority: {
              type: "string",
              enum: ["low", "medium", "high"],
              default: "medium",
            },
            dueDate: { type: "string", format: "date-time" },
            tags: { type: "array", items: { type: "string" } },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Error: {
          type: "object",
          properties: {
            type: { type: "string" },
            title: { type: "string" },
            status: { type: "integer" },
            detail: { type: "string" },
            instance: { type: "string" },
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  path: { type: "string" },
                  message: { type: "string" },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"], // Path to the API docs
};

export const openapiSpec = swaggerJsdoc(options);
