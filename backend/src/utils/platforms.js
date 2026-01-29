/**
 * Platform-specific templates and configurations
 */

// Platform reset step templates
const PLATFORM_RESET_TEMPLATES = {
    instagram: [
        {
            label: 'Open profile',
            meta: 'Profile → ≡ menu',
            description: 'Tap your avatar, then the three-line menu in the top-right corner.',
        },
        {
            label: 'Content preferences',
            meta: 'Menu option',
            description: 'Choose "Content preferences" from the list.',
        },
        {
            label: 'Reset suggested content',
            meta: 'One-tap reset',
            description:
                'Tap "Reset suggested content", review the notice, then confirm to wipe your Reels & Explore history.',
        },
    ],
    facebook: [
        {
            label: 'Open settings',
            meta: '☰ → Settings & Privacy',
            description: 'Tap the menu icon, scroll to Settings & Privacy.',
        },
        {
            label: 'Activity preferences',
            meta: 'Settings → Ad preferences',
            description: 'Navigate to Ad preferences under Settings.',
        },
        {
            label: 'Clear watch & search',
            meta: 'Privacy → Your activity',
            description: 'Under Your activity, clear Watch and Search history.',
        },
    ],
    youtube: [
        {
            label: 'Go to history',
            meta: '☰ → History',
            description: 'Tap the menu and select History.',
        },
        {
            label: 'Manage all history',
            meta: 'History → Manage all history',
            description: 'Click on Manage all history to open Google Activity.',
        },
        {
            label: 'Delete watch & search',
            meta: 'Delete activity by → All time',
            description: 'Choose All time and delete YouTube watch & search data.',
        },
    ],
};

// Expected sections per platform
const PLATFORM_SECTIONS = {
    instagram: [
        'Accounts to Follow',
        'Hashtags to Explore',
        'Search Queries',
        'Engagement Actions',
        'Actions to Avoid',
        'Platform Reset Steps',
    ],
    facebook: [
        'Pages to Follow',
        'Groups to Join',
        'Search Queries',
        'Engagement Actions',
        'Actions to Avoid',
        'Platform Reset Steps',
    ],
    youtube: [
        'Channels to Subscribe',
        'Keywords to Search',
        'Playlists to Explore',
        'Engagement Actions',
        'Actions to Avoid',
        'Platform Reset Steps',
    ],
};

/**
 * Get reset template for a platform
 */
const getResetTemplate = (platform) => {
    return PLATFORM_RESET_TEMPLATES[platform.toLowerCase()] || [];
};

/**
 * Get expected sections for a platform
 */
const getExpectedSections = (platform) => {
    return PLATFORM_SECTIONS[platform.toLowerCase()] || [];
};

/**
 * Normalize string for comparison
 */
const normalize = (str = '') => str.toLowerCase().trim();

/**
 * Inject platform-specific reset steps into strategy
 */
const injectPlatformSteps = (strategy, platform) => {
    if (!Array.isArray(strategy.sections)) {
        strategy.sections = [];
    }

    const template = getResetTemplate(platform);
    if (!template.length) return strategy;

    const idx = strategy.sections.findIndex(
        (s) => normalize(s.name) === 'platform reset steps'
    );

    if (idx >= 0) {
        strategy.sections[idx].items = [...template];
    } else {
        // Ensure we don't exceed 6 sections
        if (strategy.sections.length >= 6) {
            strategy.sections.pop();
        }
        strategy.sections.push({
            name: 'Platform Reset Steps',
            items: [...template],
        });
    }

    return strategy;
};

/**
 * Ensure all expected sections exist in strategy
 */
const ensureAllSections = (strategy, platform) => {
    const expected = getExpectedSections(platform);

    expected.forEach((name) => {
        const exists = strategy.sections.some(
            (s) => normalize(s.name) === normalize(name)
        );
        if (!exists) {
            strategy.sections.push({ name, items: [] });
        }
    });

    // Sort by expected order
    strategy.sections.sort(
        (a, b) => expected.indexOf(a.name) - expected.indexOf(b.name)
    );

    return strategy;
};

module.exports = {
    PLATFORM_RESET_TEMPLATES,
    PLATFORM_SECTIONS,
    getResetTemplate,
    getExpectedSections,
    normalize,
    injectPlatformSteps,
    ensureAllSections,
};
