import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const app = express();
const options = {
  definition: {
    openapi: "3.0.0",
    info: { title: "Mini API", version: "1" },
    components: {
      schemas: {
        Task: { type: "object", properties: { id: { type: "integer" } } },
      },
    },
  },
  apis: ["./src/rest-apis/drill-07.ts"],
};

const spec = swaggerJsdoc(options);
app.get("/docs/openapi.json", (req, res) => res.json(spec));
app.use("/docs", swaggerUi.serve, swaggerUi.setup(spec));

/**
 * @openapi
 * /tasks:
 *   get:
 *     responses:
 *       200: { content: { application/json: { schema: { $ref: '#/components/schemas/Task' } } } }
 */
app.get("/tasks", (req, res) => res.json({ id: 1 }));

app.listen(3006);
