const express = require("express");
const mongoose = require("mongoose");
const Poem = require("./models/Poem");

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

app.get("/tshirt", (req, res) => {
  res.status(200).send({
    tshirt: "👕",
    size: "medium",
  });
});

app.post("/tshirt/:id", (req, res) => {
  const { id } = req.params;
  const { logo } = req.body;

  if (!logo) {
    res.status(418).send({ messege: "we need a logo" });
  }
  res.send({
    tshirt: `👕 with your ${logo} and ID of ${id}`,
  });
});

app.get("/", (req, res) => {
  res.send("welcome");
});

app.get("/api/poems", async (req, res) => {
  try {
    const result = await Poem.find();
    res.status(200).json({ poems: result });
  } catch (e) {
    res.status(500).json({ error: e.messege });
  }
});

app.get("/api/poems/:id", async (req, res) => {
  console.log({ requestParams: req.params, requestQuery: req.query });
  try {
    const { id: peomId } = req.params;
    console.log(poemId);
    const poem = await Poem.findById(poemId);
    console.log(customer);
    if (!customer) {
      res.status(404).json({ error: "user Not Found" });
    } else {
      res.json({ customer });
    }
  } catch (e) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.post("/api/customers", async (req, res) => {
  console.log(req.body);
  const customer = new Customer(req.body);

  try {
    console.log(req.body);
    await customer.save();
    res.status(201).json({ customer });
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

app.delete("/api/customers/:id", async (req, res) => {
  try {
    const customerId = req.params.id;
    const result = await Customer.deleteOne({ _id: customerId });
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
