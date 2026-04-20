const Joi = require('joi');
const { generateSQL, executeQuery } = require('../services/reportService');

const schema = Joi.object({
  question: Joi.string().required(),
});

async function createReport(req, res) {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { question } = req.body;

  let sql;
  try {
    sql = await generateSQL(question);
  } catch (err) {
    return res.status(500).json({ message: 'System error' });
  }

  let results;
  try {
    results = executeQuery(sql);
  } catch (err) {
    return res.status(500).json({ message: 'System error' });
  }

  if (!results || results.length === 0) {
    return res.status(404).json({ message: 'Data not found' });
  }

  return res.status(200).json({
    results,
    page_no: 1,
    size: 10,
  });
}

module.exports = { createReport };
