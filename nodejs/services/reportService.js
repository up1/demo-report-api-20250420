const OpenAI = require('openai');
const db = require('../database/db');

let openai;
function getOpenAIClient() {
  if (!openai) {
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openai;
}

const SYSTEM_PROMPT = `As expert SQL Generator, create SELECT statement from tables in section [[TABLES]] only

and following from rules in section [[RULES]]



[[TABLES]]

CREATE TABLE IF NOT EXISTS employees (
        id INTEGER PRIMARY KEY,
        name TEXT,
        department TEXT,
        salary INTEGER)


[[RULES]]

Output show only SQL statement and not show other information

Generate on SELECT statement

If user want to other operations, the return value "No No No !!"`;

async function generateSQL(question) {
  const response = await getOpenAIClient().chat.completions.create({
    model: 'gpt-5.4-nano',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: question },
    ],
  });

  const sql = response.choices[0].message.content.trim();

  if (!/^\s*SELECT\b/i.test(sql)) {
    throw new Error('Invalid SQL: not a SELECT statement');
  }

  return sql;
}

function executeQuery(sql) {
  const stmt = db.prepare(sql);
  return stmt.all();
}

module.exports = { generateSQL, executeQuery };
