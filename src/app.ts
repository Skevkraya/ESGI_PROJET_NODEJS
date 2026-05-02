import express from "express";
import routes from "./routes/index.ts";
import {
  errorMiddleware,
  notFoundMiddleware,
} from "./middlewares/error.middleware.ts";

const app = express();

app.use(express.json());
app.use(routes);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
