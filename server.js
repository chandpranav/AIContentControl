/*******************************
 *  backend/index.js (or server.js)
 *******************************/
require('dotenv').config();
const express  = require('express');
const axios    = require('axios');
const cors     = require('cors');
const logger   = require('./backend/middleware/logger');
const authRoutes = require('./backend/routes/authRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(logger);
app.use('/api/auth', authRoutes);

/* ---------- OpenAI ---------- */
const API_URL = 'https://api.openai.com/v1/chat/completions';
const API_KEY = process.env.OPENAI_API_KEY;
if (!API_KEY) {
  console.error('❌ OPENAI_API_KEY not found');
  process.exit(1);
}
const normalise = (s = '') => s.toLowerCase().trim();

/* ---- basic safety filter -------------------------------------- */
const BAD_CONTENT_RX = /\b(?:porn|sex|sexual|xxx|nude|explicit|adult|hate|racist|terror|kill|rape|violence)\b/i;

/* ---- reset-step templates ------------------------------------- */
const INSTAGRAM_RESET_TEMPLATE = [
  { label: 'Open profile',            meta: 'Profile → ≡ menu',          description: 'Tap your avatar, then the three-line menu in the top-right corner.' },
  { label: 'Content preferences',     meta: 'Menu option',               description: 'Choose “Content preferences” from the list.' },
  { label: 'Reset suggested content', meta: 'One-tap reset',             description: 'Tap “Reset suggested content”, review the notice, then confirm to wipe your Reels & Explore history.' }
];
const FACEBOOK_RESET_TEMPLATE = [
  { label: 'Open settings',        meta: '☰ → Settings & Privacy', description: 'Tap the menu icon, scroll to Settings & Privacy.' },
  { label: 'Activity preferences', meta: 'Settings → Ad preferences', description: 'Navigate to Ad preferences under Settings.' },
  { label: 'Clear watch & search', meta: 'Privacy → Your activity',    description: 'Under Your activity, clear Watch and Search history.' }
];
const YOUTUBE_RESET_TEMPLATE = [
  { label: 'Go to history',         meta: '☰ → History',                      description: 'Tap the menu and select History.' },
  { label: 'Manage all history',    meta: 'History → Manage all history',     description: 'Click on Manage all history to open Google Activity.' },
  { label: 'Delete watch & search', meta: 'Delete activity by → All time',    description: 'Choose All time and delete YouTube watch & search data.' }
];
const PLATFORM_TEMPLATES = {
  instagram: INSTAGRAM_RESET_TEMPLATE,
  facebook:  FACEBOOK_RESET_TEMPLATE,
  youtube:   YOUTUBE_RESET_TEMPLATE
};

/* ---- helpers --------------------------------------------------- */
function injectPlatformSteps(strat, pf) {
  if (!Array.isArray(strat.sections)) strat.sections = [];
  const template = PLATFORM_TEMPLATES[normalise(pf)];
  if (!template) return strat;

  const idx = strat.sections.findIndex(s => normalise(s.name) === 'platform reset steps');
  const items = template.map(x => x);

  if (idx >= 0) strat.sections[idx].items = items;
  else {
    if (strat.sections.length >= 6) strat.sections.pop();
    strat.sections.push({ name: 'Platform Reset Steps', items });
  }
  return strat;
}

function ensureAllSections(strat, pf) {
  const map = {
    instagram: ['Accounts to Follow', 'Hashtags to Explore', 'Search Queries', 'Engagement Actions', 'Actions to Avoid', 'Platform Reset Steps'],
    facebook:  ['Pages to Follow', 'Groups to Join', 'Search Queries', 'Engagement Actions', 'Actions to Avoid', 'Platform Reset Steps'],
    youtube:   ['Channels to Subscribe', 'Keywords to Search', 'Playlists to Explore', 'Engagement Actions', 'Actions to Avoid', 'Platform Reset Steps']
  };
  const expected = map[normalise(pf)] || [];
  expected.forEach(name => {
    if (!strat.sections.some(s => normalise(s.name) === normalise(name))) {
      strat.sections.push({ name, items: [] });
    }
  });
  strat.sections.sort((a, b) => expected.indexOf(a.name) - expected.indexOf(b.name));
  return strat;
}

/* ---- prompt builder ------------------------------------------- */
function getPromptForPlatform(pf, title, inA, outB) {
  const guard = `If either "${inA}" or "${outB}" is explicit, hateful or adult in nature, reply **exactly** with: {"error":"explicit_content"} and nothing else.`;
  const footer = `
Respond with valid JSON **exactly** in this form:
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
Each of the 6 sections **must** appear, each "items" **must** contain exactly 3 objects. No markdown fences. No extra fields.
${guard}`;

  switch (normalise(pf)) {
    case 'instagram':
      return `
You are a senior Instagram growth strategist (2025). Using only current, public-facing data and platform policy knowledge, 
build an **action-focused** recommendation card entitled **${title}** that will deliberately retrain the feed from "${inA}" toward "${outB}".  
For every suggestion, be concrete—provide real handles, approximate follower counts, and crisp one-line explanations. Avoid placeholders or generic advice.

Return exactly these 6 sections, each with 3 items:
1. Accounts to Follow – handle, follower count, one-line desc  
2. Hashtags to Explore – #tag, why it matters  
3. Search Queries – phrase, what it surfaces  
4. Engagement Actions – action, frequency/tip  
5. Actions to Avoid – action, negative impact  
6. Platform Reset Steps – step name, how to perform it
${footer}`;

    case 'facebook':
      return `
You are a senior Facebook community strategist (2025). Using current data and policy knowledge, build an **action-focused** card titled **${title}** that shifts timeline signals from "${inA}" toward "${outB}".  
Provide concrete page/group names with realistic member counts and clear rationale.

Return exactly these 6 sections, each with 3 items:
1. Pages to Follow – page name, follower count, one-line desc  
2. Groups to Join – group name, members count, reason to join  
3. Search Queries – phrase, what it surfaces  
4. Engagement Actions – action, frequency/tip  
5. Actions to Avoid – action, negative impact  
6. Platform Reset Steps – step name, how to perform it
${footer}`;

    case 'youtube':
      return `
You are a YouTube discovery strategist (2025). With a focus on watch-time and content quality signals, create an **action-focused** card titled **${title}** that steers recommendations from "${inA}" toward "${outB}".  
List real channels/keywords/playlists and justify each choice succinctly.

Return exactly these 6 sections, each with 3 items:
1. Channels to Subscribe – channel name, subs count, one-line desc  
2. Keywords to Search – keyword, why it matters  
3. Playlists to Explore – playlist title, video count, reason to watch  
4. Engagement Actions – action, frequency/tip  
5. Actions to Avoid – action, negative impact  
6. Platform Reset Steps – step name, how to perform it
${footer}`;

    default:
      throw new Error(`Unsupported platform: ${pf}`);
  }
}

/* ---- main route ------------------------------------------------ */
app.post('/api/get-strategy', async (req, res) => {
  const { platform, userInterest, targetInterest } = req.body;
  if (!platform || !userInterest || !targetInterest)
    return res.status(400).json({ error: 'Missing fields.' });

  /* -- explicit/hateful filter -- */
  if (BAD_CONTENT_RX.test(userInterest) || BAD_CONTENT_RX.test(targetInterest)) {
    return res.status(400).json({ error: 'Explicit or hateful content detected.' });
  }

  const title  = `Shifting ${platform} Algorithm From ${userInterest} to ${targetInterest}`;
  const prompt = getPromptForPlatform(platform, title, userInterest, targetInterest);

  try {
    const resp = await axios.post(
      API_URL,
      {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a social media expert.' },
          { role: 'user',   content: prompt }
        ],
        temperature: 0.7
      },
      { headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        } }
    );

    const raw   = resp.data.choices[0].message.content.trim();
    let   strat = JSON.parse(raw);                 // may throw → handled below
    strat       = injectPlatformSteps(strat, platform);
    strat       = ensureAllSections(strat, platform);

    return res.json({ strategy: strat });
  } catch (err) {
    console.error(err?.response?.data || err.message);
    return res.status(500).json({ error: 'Strategy fetch failed.' });
  }
});

app.use(express.static('public'));
app.listen(process.env.PORT || 5000, () => console.log('🚀  Server listening on 5000'));
