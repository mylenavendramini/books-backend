const express = require("express");
const app = express();
const PORT = 8001;
const db = require("./config/db");

db.on("connected", () => {
  console.log("connect");
});

db.on("disconnected", () => {
  console.log("disconnected");
});

db.on("error", (error) => {
  console.log("connection error:" + error);
});

app.use(express.json());

// call function - import
require("./config/routes")(app);

app.listen(process.env.PORT || PORT, () => {
  console.log(`Server is running on PORT ${PORT}!`);
});
