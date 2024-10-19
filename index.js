const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 3000;

// cors
const cors = require("cors");
const corsOption = {
  origin: process.env.FRONTEND_URL,
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOption));

const db = require("./models/index");
db.sequelize
  .sync({ force: false })
  .then(() => {
    // initRoles();
    console.log("Database & tables created!");
  })
  .catch((error) => {
    console.error("Error syncing database:", error);
  });
const initRoles = () => {
  const role = db.Role;
  role.create({
    id: 0,
    name: "admin",
  });
  role.create({
    id: 1,
    name: "user",
  });
};
//Route
//auth
const authRoute = require("./routes/auth.route");
app.use("/api/auth", authRoute);
//store
const storeRoute = require("./routes/store.route");
app.use("/api/store", storeRoute);



app.get("/", (req, res) => {
  res.send("<h1>Hello API</h1>");
});

app.listen(PORT, () => {
  console.log("Listening to port " + PORT);
});