const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const FAQ = require("./models/FAQ.js");

const app = express();
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/faqs", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create FAQ
app.post("/faqs", async (req, res) => {
  try {
    const faq = new FAQ(req.body);
    await faq.save();
    res.status(201).json(faq);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get FAQs with language selection (?lang=hi or ?lang=bn)
app.get("/faqs", async (req, res) => {
  try {
    const lang = req.query.lang || "en";
    const faqs = await FAQ.find();
    const translatedFaqs = faqs.map((faq) => faq.getTranslatedText(lang));
    res.json(translatedFaqs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
