import express from "express";
import { CORS } from "./middleware/cors";

import { MembershipRoutes } from "./routes/membership/membership";
import { InformationRoutes } from "./routes/information/information";
import { TransactionRoutes } from "./routes/transaction/transaction";

const app = express();

app.use(CORS);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Nutech API running");
});

const api = express.Router();

api.use("/membership", MembershipRoutes());
api.use("/information", InformationRoutes());
api.use("/transaction", TransactionRoutes());

app.use("/api", api);

export default app;
