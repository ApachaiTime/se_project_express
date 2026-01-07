const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");

const { PORT = 3001 } = process.env;
mongoose.connect("mongodb://127.0.0.1:27017/wtwr_db");
app.use(express.json());

const clothingItemsRoutes = require("./routes/clothingItems");
const likeRoutes = require("./routes/likes");
const usersRoutes = require("./routes/users");

app.use(cors());
app.use("/", usersRoutes);
app.use("/items", clothingItemsRoutes);
app.use("/items", likeRoutes);

app.use((req, res) => {
  res.status(404).send({ message: "Requested resource not found" });
});
app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
