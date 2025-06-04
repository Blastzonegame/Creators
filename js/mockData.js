const mockItemDefinitions = [
    {
        id: 'recruit_default',
        name: 'Recruit',
        type: 'outfits',
        rarity: 'common',
        description: 'Ready for action.',
        preview: '/assets/characters/recruit_default.webp',
        icon: '/assets/icons/recruit_default.png',
        thumbnail: '/assets/icons/recruit_default_thumb.png',
        collectionId: 'starter'
    },
    {
        id: 'rifle_basic',
        name: 'Basic Rifle',
        type: 'weapons',
        rarity: 'common',
        description: 'A reliable weapon for any situation.',
        preview: '/assets/weapons/rifle_basic.webp',
        icon: '/assets/icons/rifle_basic.png',
        thumbnail: '/assets/icons/rifle_basic_thumb.png',
        collectionId: 'starter',
        stats: {
            damage: 24,
            fireRate: 5.5,
            accuracy: 75
        }
    },
    {
        id: 'ninja_stealth',
        name: 'Stealth Ninja',
        type: 'outfits',
        rarity: 'legendary',
        description: 'Master of shadows and precision.',
        preview: 'characters/ninja_stealth.png',
        icon: 'icons/ninja_stealth.png',
        collectionId: 'shadow_ops',
        variants: [
            {
                id: 'ninja_stealth_dark',
                name: 'Shadow',
                icon: 'icons/ninja_stealth_dark.png',
                unlocked: true
            },
            {
                id: 'ninja_stealth_gold',
                name: 'Golden Shadow',
                icon: 'icons/ninja_stealth_gold.png',
                unlocked: false
            }
        ]
    },
    {
        id: 'pulse_rifle',
        name: 'Pulse Rifle',
        type: 'weapons',
        rarity: 'epic',
        description: 'Advanced energy weapon with charging capabilities.',
        preview: 'weapons/pulse_rifle.png',
        icon: 'icons/pulse_rifle.png',
        collectionId: 'future_tech',
        stats: {
            damage: 45,
            fireRate: 3.2,
            accuracy: 85,
            chargeTime: 1.2
        },
        effects: {
            type: 'energy_pulse',
            color: '#44ffff'
        }
    },
    {
        id: 'dragon_glider',
        name: 'Storm Dragon',
        type: 'gliders',
        rarity: 'legendary',
        description: 'Ride the storms with this mythical beast.',
        preview: 'gliders/dragon_glider.png',
        icon: 'icons/dragon_glider.png',
        collectionId: 'dragon_master',
        effects: {
            trail: 'storm_lightning',
            sound: 'dragon_roar'
        }
    },
    {
        id: 'victory_dance',
        name: 'Victory Dance',
        type: 'emotes',
        rarity: 'epic',
        description: 'Celebrate in style!',
        preview: 'emotes/victory_dance.gif',
        icon: 'icons/victory_dance.png',
        collectionId: 'celebrations',
        duration: 4.2,
        music: 'victory_theme.mp3'
    }
];

const mockCollections = [
    {
        id: 'starter',
        name: 'Starter Pack',
        description: 'Essential items for new recruits.',
        banner: '/assets/collections/starter_pack_banner.webp',
        thumbnail: '/assets/collections/starter_pack_thumb.png',
        theme: {
            primary: '#4a90e2',
            accent: '#ffffff'
        }
    },
    {
        id: 'shadow_ops',
        name: 'Shadow Operations',
        description: 'Elite gear for covert missions.',
        image: 'collections/shadow_ops.png',
        theme: {
            primary: '#2a2a2a',
            accent: '#ff0066'
        }
    },
    {
        id: 'future_tech',
        name: 'Future Tech',
        description: 'Advanced weapons from tomorrow.',
        image: 'collections/future_tech.png',
        theme: {
            primary: '#00ffff',
            accent: '#ffffff'
        }
    },
    {
        id: 'dragon_master',
        name: 'Dragon Master',
        description: 'Harness the power of ancient dragons.',
        image: 'collections/dragon_master.png',
        theme: {
            primary: '#ff4400',
            accent: '#ffcc00'
        }
    }
];

// Mock user inventory state
const mockInventoryState = {
    owned: ['recruit_default', 'rifle_basic', 'ninja_stealth', 'victory_dance'],
    favorites: ['ninja_stealth'],
    loadouts: {
        default: {
            outfit: 'recruit_default',
            weapon: 'rifle_basic',
            glider: null,
            emote1: 'victory_dance',
            emote2: null,
            emote3: null,
            emote4: null
        },
        ninja: {
            outfit: 'ninja_stealth',
            weapon: 'rifle_basic',
            glider: null,
            emote1: 'victory_dance',
            emote2: null,
            emote3: null,
            emote4: null
        }
    }
};

// Export all mock data
export { mockItemDefinitions, mockCollections, mockInventoryState };