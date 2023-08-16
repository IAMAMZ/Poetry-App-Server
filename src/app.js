const express = require("express");
const mongoose = require("mongoose");
const Poem = require("../models/Poem");
const cookieParser = require("cookie-parser");

const cors = require("cors");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
mongoose.set("strictQuery", false);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const PORT = process.env.PORT || 3000;

const connection = process.env.CONNECTION;

app.use("/api/poems", require("../routes/api/poems"));
app.use("/api/poems/:id", require("../routes/api/poems"));
app.use("/login", require("../routes/login"));
app.use("/register", require("../routes/register"));
app.use("/refresh", require("../routes/refresh"));

app.put("/api/customers/:id", async (req, res) => {
  try {
    const customerId = req.params.id;
    const customer = await Customer.findOneAndReplace(
      { _id: customerId },
      req.body,
      { new: true }
    );
    res.json({ customer });
  } catch (e) {
    res.status(500).json({ error: "Something went wront" });
  }
});

app.patch("/api/customers/:id", async (req, res) => {
  try {
    const customerId = req.params.id;
    const customer = await Customer.findOneAndUpdate(
      { _id: customerId },
      req.body,
      { new: true }
    );
    res.json({ customer });
  } catch (e) {
    res.status(500).json({ error: "Something went wront" });
  }
});

app.patch("/api/orders/:id", async (req, res) => {
  console.log(req.params);
  const orderId = req.params.id;
  req.body._id = orderId;
  try {
    const result = await Customer.findOneAndUpdate(
      { "orders._id": orderId },
      { $set: { "orders.$": req.body } },
      { new: true }
    );
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ error: "something went wrong" });
    }
  } catch (e) {
    res.status(404).json({ error: e.messege });
  }
});

const start = async () => {
  try {
    await mongoose.connect(connection);

    app.listen(PORT, () => {
      console.log("App is listening on port " + PORT);
    });
  } catch (e) {
    console.log(e);
  }
};

start();
