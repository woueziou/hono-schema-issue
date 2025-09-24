import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { z } from "zod";
import {
    validator as zValidator,
    resolver,
    describeRoute,
    openAPIRouteHandler,
} from "hono-openapi";
const app = new Hono()

const querySchema = z.object({
    name: z.string().optional(),
}).meta({ ref: "QueryParams",title: "Query Parameters" ,id: "QueryParams"});
const responseSchema = z.object({
    message: z.string(),
}).meta({ ref: "Response", title: "Response Body", id: "ResponseSchema" });

app.get("/", describeRoute({
    responses: {
        200: {
            description: "Successful response",
            content: {
                "application/json": {
                    schema: resolver(responseSchema),
                },
            },
        },
    },
}),
    zValidator("query", querySchema), (c) => {
        const query = c.req.valid("query");
        return c.text(`Hello ${query?.name ?? "Hono"}!`);
    });


app.get(
    "/openapi.json",
    openAPIRouteHandler(app, {
        documentation: {
            info: {
                title: "Hono",
                version: "1.0.0",
                description: "API for greeting users",
            },
        },
    }),
);
serve({
    fetch: app.fetch,
    port: 3400,
}

)

console.log("Server is running on http://localhost:3400");