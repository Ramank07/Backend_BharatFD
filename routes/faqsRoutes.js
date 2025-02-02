const express = require("express");
const FAQ = require("../models/FAQ");
const {translate} = require('@google-cloud/translate').v2;

const router = express.Router();
const LANGUAGES = ["en", "hi", "bn", "fr"];

// ✅ Get all FAQs (with language support)
router.get("/", async (req, res) => {
  try {
    const lang = req.query.lang || "en"; // Default to English
    const faqs = await FAQ.find();

    const translatedFAQs = faqs.map((faq) => ({
      id: faq._id,
      question: faq.translations[lang] || faq.translations["en"], // Fallback to English
      answer: faq.translations[lang] || faq.translations["en"],
    }));

    res.json(translatedFAQs);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Create a new FAQ with automatic translations
router.post("/", async (req, res) => {
  try {
    const { question, answer } = req.body;
    const translations = {};

    // Generate translations for each language
    for (const lang of LANGUAGES) {
      const translatedQuestion = await translate(question, { to: lang });
      const translatedAnswer = await translate(answer, { to: lang });

      translations[lang] = translatedQuestion.text;
      translations[lang] = translatedAnswer.text;
    }

    const newFAQ = new FAQ({ ...translations });
    await newFAQ.save();

    res.status(201).json(newFAQ);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
