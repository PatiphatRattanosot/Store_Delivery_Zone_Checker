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
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Hello API</title>
      <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
    </head>
    <body class="bg-gray-100 h-screen flex items-center justify-center">
      <div class="text-center">
        <h1 class="text-5xl font-bold text-blue-600">Welcome to the API</h1>
        <p class="text-lg mt-4 text-gray-700">This is the starting point of your awesome Express API!</p>
        <div class="mt-6">
          <a href="/api/auth" class="inline-block px-6 py-2 text-white bg-green-500 rounded-full hover:bg-green-600">Auth Route</a>
          <a href="/api/store" class="inline-block px-6 py-2 ml-4 text-white bg-blue-500 rounded-full hover:bg-blue-600">Store Route</a>
        </div>
      </div>
    </body>
    </html>
  `);
});


app.listen(PORT, () => {
  console.log("Listening to port " + PORT);
});