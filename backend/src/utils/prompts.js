/**
 * AI Prompt templates for different platforms
 */

/**
 * Build prompt for a specific platform
 */
const buildPromptForPlatform = (platform, title, currentInterest, targetInterest) => {
    const guard = `If either "${currentInterest}" or "${targetInterest}" is explicit, hateful or adult in nature, reply **exactly** with: {"error":"explicit_content"} and nothing else.`;

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

    const prompts = {
        instagram: `
You are a senior Instagram growth strategist (2025). Using only current, public-facing data and platform policy knowledge, 
build an **action-focused** recommendation card entitled **${title}** that will deliberately retrain the feed from "${currentInterest}" toward "${targetInterest}".  
For every suggestion, be concrete—provide real handles, approximate follower counts, and crisp one-line explanations. Avoid placeholders or generic advice.

Return exactly these 6 sections, each with 3 items:
1. Accounts to Follow – handle, follower count, one-line desc  
2. Hashtags to Explore – #tag, why it matters  
3. Search Queries – phrase, what it surfaces  
4. Engagement Actions – action, frequency/tip  
5. Actions to Avoid – action, negative impact  
6. Platform Reset Steps – step name, how to perform it
${footer}`,

        facebook: `
You are a senior Facebook community strategist (2025). Using current data and policy knowledge, build an **action-focused** card titled **${title}** that shifts timeline signals from "${currentInterest}" toward "${targetInterest}".  
Provide concrete page/group names with realistic member counts and clear rationale.

Return exactly these 6 sections, each with 3 items:
1. Pages to Follow – page name, follower count, one-line desc  
2. Groups to Join – group name, members count, reason to join  
3. Search Queries – phrase, what it surfaces  
4. Engagement Actions – action, frequency/tip  
5. Actions to Avoid – action, negative impact  
6. Platform Reset Steps – step name, how to perform it
${footer}`,

        youtube: `
You are a YouTube discovery strategist (2025). With a focus on watch-time and content quality signals, create an **action-focused** card titled **${title}** that steers recommendations from "${currentInterest}" toward "${targetInterest}".  
List real channels/keywords/playlists and justify each choice succinctly.

Return exactly these 6 sections, each with 3 items:
1. Channels to Subscribe – channel name, subs count, one-line desc  
2. Keywords to Search – keyword, why it matters  
3. Playlists to Explore – playlist title, video count, reason to watch  
4. Engagement Actions – action, frequency/tip  
5. Actions to Avoid – action, negative impact  
6. Platform Reset Steps – step name, how to perform it
${footer}`,
    };

    const prompt = prompts[platform.toLowerCase()];
    if (!prompt) {
        throw new Error(`Unsupported platform: ${platform}`);
    }

    return prompt;
};

/**
 * System message for OpenAI
 */
const SYSTEM_MESSAGE = 'You are a social media expert.';

module.exports = {
    buildPromptForPlatform,
    SYSTEM_MESSAGE,
};
