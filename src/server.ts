import "./pkg/database";
import app from "./app";
import { AppEnv } from "./pkg/env/env";

const PORT = Number(AppEnv.PORT);

require("dotenv").config();

app.listen(PORT, () => {
  console.log(`Server run at http://localhost:${PORT}`);
});
