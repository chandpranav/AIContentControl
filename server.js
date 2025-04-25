require('dotenv').config();
const express = require('express');
const axios   = require('axios');
const cors    = require('cors');
const logger  = require('./backend/middleware/logger');
const authRoutes = require('./backend/routes/authRoutes');

const app = express();

/* ───────────────  MIDDLEWARE  ─────────────── */
app.use(cors());
app.use(express.json());
app.use(logger);

/* ───────────────  AUTH ROUTES  ─────────────── */
app.use('/api/auth', authRoutes);

/* ───────────────  ENV & CONSTANTS  ─────────────── */
const API_URL = 'https://api.openai.com/v1/chat/completions';
const API_KEY = process.env.OPENAI_API_KEY;

if (!API_KEY) {
  console.error('❌ OPENAI_API_KEY not found in .env file.');
  process.exit(1);
}

const normalise = (str = '') => str.toLowerCase().replace(/\s+/g, ' ').trim();

const INSTAGRAM_RESET_TEMPLATE = [
  {
    label: 'Open profile',
    meta:  'Profile → ≡ menu',
    description: 'Tap your avatar, then the three-line menu in the top-right corner.',
  },
  {
    label: 'Content preferences',
    meta:  'Menu option',
    description: 'Choose “Content preferences” from the list.',
  },
  {
    label: 'Reset suggested content',
    meta:  'One-tap reset',
    description: 'Tap “Reset suggested content”, review the notice, then confirm to wipe your Reels & Explore history.',
  },
];

const injectResetSteps = (strategyObj, platform) => {
  if (normalise(platform) !== 'instagram') return strategyObj;

  const idx = strategyObj.sections.findIndex(
    (s) => normalise(s.name) === 'platform reset steps'
  );

  const formatted = INSTAGRAM_RESET_TEMPLATE.map(({ label, meta, description }) => ({
    label, meta, description,
  }));

  if (idx >= 0) {
    strategyObj.sections[idx].items = formatted;              // overwrite GPT section
  } else {
    if (strategyObj.sections.length >= 6) strategyObj.sections.pop(); // keep total = 6
    strategyObj.sections.push({ name: 'Platform Reset Steps', items: formatted });
  }
  return strategyObj;
};

/* ───────────────  STRATEGY ROUTE  ─────────────── */
app.post('/api/get-strategy', async (req, res) => {
  const { platform, userInterest, targetInterest } = req.body;
  if (!platform || !userInterest || !targetInterest) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  const title = `Shifting ${platform} Algorithm From ${userInterest} to ${targetInterest}`;

  const prompt = `
You are a social-media strategist.

Build an "AI Recommendations" card titled:
**${title}**

Your task is to help the user shift their content algorithm on ${platform} by mimicking human behavior — gradually moving from engaging with "${userInterest}" to "${targetInterest}".

Return 6 sections with 3 items each:

1. **Accounts to Follow**
  - format: handle – follower count – one-line description
2. **Hashtags to Explore**
  - format: #tag – why it matters
3. **Search Queries**
  - format: query phrase – what it surfaces
4. **Engagement Actions**
  - format: action – recommended frequency or tip
5. **Actions to Avoid**
  - format: action – negative impact on algorithm
6. **Platform Reset Steps**
  - format: step name – how to perform it

Respond with valid JSON only. No \`\`\`json fences. No explanations.
The structure should be:

{
  "title": "${title}",
  "sections": [
    {
      "name": string,
      "items": [
        { "label": string, "meta": string, "description": string }
      ]
    }
  ]
}
`;

  try {
    const openaiResponse = await axios.post(
      API_URL,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a social media expert helping users manipulate recommendation systems.' },
          { role: 'user',   content: prompt },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    let raw = openaiResponse.data.choices[0].message.content;
    if (raw.startsWith('```')) raw = raw.replace(/```json?|```/g, '').trim();

    let strategy = JSON.parse(raw);
    strategy = injectResetSteps(strategy, platform);

    res.json({ strategy });
  } catch (err) {
    console.error('❌ Strategy generation failed:', err?.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch strategy. Please try again later.' });
  }
});

/* ───────────────  STATIC FILES  ─────────────── */
app.use(express.static('public'));

/* ───────────────  START SERVER  ─────────────── */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
