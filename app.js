require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { errors } = require("celebrate");
const mongoose = require("mongoose");
const errorHandler = require("./middlewares/error-handler");

const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();

const { NOT_FOUND_ERROR } = require("./utils/errors");

const { PORT = 3001, MONGODB_URI = "mongodb://127.0.0.1:27017/wtwr_db" } =
  process.env;
mongoose.connect(MONGODB_URI);
app.use(express.json());

const clothingItemsRoutes = require("./routes/clothingItems");
const likeRoutes = require("./routes/likes");
const usersRoutes = require("./routes/users");

app.use(requestLogger);
app.use(cors());
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});
app.use("/", usersRoutes);
app.use("/items", clothingItemsRoutes);
app.use("/items", likeRoutes);

app.use((req, res, next) => {
  res.status(NOT_FOUND_ERROR).send({ message: "Requested resource not found" });
});
app.use(errorLogger);
app.use(errors());

app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
