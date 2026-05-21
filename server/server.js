const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));
app.post('/api/chat', async (req, res) => {
 try {
   const body = req.body;
   const model = body.model || 'claude-sonnet-4-5';
   const messages = body.messages;
   const system = body.system;
   const max_tokens = body.max_tokens || 1000;
   const response = await fetch('https://api.anthropic.com/v1/messages', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'x-api-key': process.env.ANTHROPIC_API_KEY,
       'anthropic-version': '2023-06-01'
     },
     body: JSON.stringify({ model: model, max_tokens: max_tokens, system: system, messages: messages })
   });
   const data = await response.json();
   res.json(data);
 } catch (err) {
   res.status(500).json({ error: err.message });
 }
});
app.get('/health', function(req, res) {
 res.json({ status: 'ok' });
});
app.listen(PORT, function() {
 console.log('Running on port ' + PORT);
});
