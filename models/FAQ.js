const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema({
  question_en: { type: String, required: true },
  answer_en: { type: String, required: true },
  question_hi: { type: String },
  answer_hi: { type: String },
  question_bn: { type: String },
  answer_bn: { type: String },
  question_fr: { type: String },
  answer_fr: { type: String },
});

// Method to get translated text dynamically
faqSchema.methods.getTranslation = function (lang) {
  return {
    question: this[`question_${lang}`] || this.question_en,
    answer: this[`answer_${lang}`] || this.answer_en,
  };
};

const FAQ = mongoose.model("FAQ", faqSchema);
module.exports = FAQ;
