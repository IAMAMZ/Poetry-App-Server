const express = require("express");
const mongoose = require("mongoose");
const Poem = require("../models/Poem");

const cors = require("cors");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
mongoose.set("strictQuery", false);

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3000;

const connection = process.env.CONNECTION;

app.use("/api/poems", require("../routes/api/poems"));
app.get("/api/poems/:id", async (req, res) => {
  console.log({ requestParams: req.params, requestQuery: req.query });
  try {
    const { id: poemId } = req.params;
    console.log(poemId);
    const poem = await Poem.findById(poemId);
    if (!poem) {
      res.status(404).json({ error: "poem Not Found" });
    } else {
      res.json({ poem });
    }
  } catch (e) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.post("/api/poems", async (req, res) => {
  console.log(req.body);
  const poem = new Poem(req.body);

  try {
    console.log(req.body);
    await poem.save();
    res.status(201).json({ poem });
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: e.messege });
  }
});

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

app.delete("/api/poems/:id", async (req, res) => {
  try {
    const poemId = req.params.id;
    const result = await Poem.deleteOne({ _id: poemId });
    res.json({ deletedCount: result.deletedCount });
  } catch (e) {
    res.status(500).json({ error: e.messege });
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
