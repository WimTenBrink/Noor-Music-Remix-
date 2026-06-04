export interface InnuendoStep {
  level: number;
  label: string;
  description: string;
}

export const INNUENDO_STEPS: InnuendoStep[] = [
  {
    level: 0,
    label: "Safe & Innocent",
    description: "Completely platonic and wholesome. Absolutely no hints of sensuality or suggestive metaphors."
  },
  {
    level: 1,
    label: "Platonic Friendship",
    description: "Warm companionable feelings, purely platonic boundaries without subtext."
  },
  {
    level: 2,
    label: "Scholarly Respect",
    description: "Distant admiration, respectful intellectual bond without romantic hints."
  },
  {
    level: 3,
    label: "Poetic Kinship",
    description: "Appreciating natural beauty together, holding a purely spiritual connection."
  },
  {
    level: 4,
    label: "Sweet Affinity",
    description: "Walking hand-in-hand in autumn, safe romantic warmth with no physical focus."
  },
  {
    level: 5,
    label: "Gentle Cozy Glow",
    description: "Sharing hot tea, reading books by the fireside, mutual emotional comfort."
  },
  {
    level: 6,
    label: "Sweet Romance",
    description: "Polite affection, admiration of a smile, light shoulder leaning."
  },
  {
    level: 7,
    label: "Poetic Whispers",
    description: "Lyrical focus on star-gazing, joint dreams, and soft emotional harmony."
  },
  {
    level: 8,
    label: "Warm Touch",
    description: "Holding hands, gentle brush of fingers, simple romantic sparks."
  },
  {
    level: 9,
    label: "Intimate Resonance",
    description: "Admiring each other's laughter, a soft, slow-fading gaze. High emotional intimacy."
  },
  {
    level: 10,
    label: "Barefoot Stroll",
    description: "Dancing barefoot, feeling the cool forest dew together. Cozy romantic intimacy."
  },
  {
    level: 11,
    label: "Mysterious Whisper",
    description: "Whispered secrets in the dark, soft candlelight setting. Start of deep sensory awareness."
  },
  {
    level: 12,
    label: "Electric Connection",
    description: "A sudden electric shiver when skin brushed skin. Sensual romantic tension."
  },
  {
    level: 13,
    label: "Velvet Shadows",
    description: "Lying close under soft blankets, matching breathing patterns. Comfortable warmth."
  },
  {
    level: 14,
    label: "Heartbeat Sync",
    description: "Listening to matching heartbeats, warm sighs in twilight. Deeply tender and sensual."
  },
  {
    level: 15,
    label: "Mild Double Entendres",
    description: "Playful nature-themed puns (gardening, sweet honey, hummingbirds) hinting at desire."
  },
  {
    level: 16,
    label: "Lyrical Flirtation",
    description: "Cheeky, highly flirtatious lines regarding buttons, tools, or musical strings."
  },
  {
    level: 17,
    label: "Enigmatic Innuendo",
    description: "Layered triple entendres about mechanical gears, pocket tricks, or instrument resonance."
  },
  {
    level: 18,
    label: "Passionate Devotion",
    description: "Yearning, close breathing, feeling the warmth of deep physical attraction."
  },
  {
    level: 19,
    label: "Seductive Allure",
    description: "Passionate touches on the waist, whispering close to the ear, playful undressing references."
  },
  {
    level: 20,
    label: "Intense Desire",
    description: "Heavy sensory descriptions of warm skin, breathless words, and tight embraces."
  },
  {
    level: 21,
    label: "Suggestive Unveiled",
    description: "Direct reference to physical passion and skin-to-skin touch, using vivid but elegant metaphors."
  },
  {
    level: 22,
    label: "Sultry Untamed Heat",
    description: "Overt, highly passionate lyrics emphasizing deep desire and unshielded romantic intensity."
  },
  {
    level: 23,
    label: "Absolutely Sexual",
    description: "Direct, transparent physical intimacy and intense sapphic passion without filters."
  }
];

export const getInnuendoStep = (level: number): InnuendoStep => {
  const normalized = Math.max(0, Math.min(INNUENDO_STEPS.length - 1, Math.round(level)));
  return INNUENDO_STEPS[normalized];
};
