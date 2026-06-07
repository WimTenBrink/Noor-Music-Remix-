export interface SapphicLevelStep {
  level: number;
  label: string;
  description: string;
}

export const SAPPHIC_STEPS: SapphicLevelStep[] = [
  {
    level: 0,
    label: "Men are okay",
    description: "Standard gender references; male presence and traditional dynamics are completely acceptable."
  },
  {
    level: 1,
    label: "Casual Neutrality",
    description: "Generally neutral song topics; male and female characters coexist without any preference."
  },
  {
    level: 2,
    label: "Platonic Shielding",
    description: "Avoids male romantic topics entirely, focusing purely on platonic sisterly friendships."
  },
  {
    level: 3,
    label: "Slight Sisterhood",
    description: "Prioritizes womanhood and girl-bonding; men receive only passing background mentions."
  },
  {
    level: 4,
    label: "Women-Centric POV",
    description: "Song is sung from an exclusively female perspective; men are distant, non-essential figures."
  },
  {
    level: 5,
    label: "Soft Sapphic Glimmers",
    description: "Subtle emotional subtext and lingering glances; chemistry flows gently between the singers."
  },
  {
    level: 6,
    label: "The Shared Gaze",
    description: "Focuses heavily on intimate eye contact and unspoken attraction between the girls."
  },
  {
    level: 7,
    label: "Lavender Whispers",
    description: "Classical, poetic coding using violet, lily, and lavender metaphors to represent secret female romance."
  },
  {
    level: 8,
    label: "Cozy Roommates",
    description: "Inseparable domestic cozy partners sharing books, knitting, and life, leaving historians extremely confused."
  },
  {
    level: 9,
    label: "Blatant Romanticism",
    description: "Unambiguous, explicitly deep romantic interest and affection from woman to woman."
  },
  {
    level: 10,
    label: "Cottagecore Domesticity",
    description: "Strawberry baking, matching dresses, and immediate plans to buy a cabin in the woods together."
  },
  {
    level: 11,
    label: "Passionate Devotion",
    description: "Fierce, soaring, romantic declarations of eternal female love and devotion."
  },
  {
    level: 12,
    label: "U-Haul Logistics",
    description: "Classic rapid commitment milestone; packing boxes and moving vans are hired by the first chorus."
  },
  {
    level: 13,
    label: "Matriarchal Coven Chant",
    description: "Acoustic magical ritual chanting where the quartet declares the supremacy of the female spirit."
  },
  {
    level: 14,
    label: "Dismantling Patriarchs",
    description: "Lyrics poke sharp musical fun at traditional patriarchal cliches and outmoded views."
  },
  {
    level: 15,
    label: "Gentle Male Sidestining",
    description: "Men are politely but firmly asked to wait outside while the women discuss music theory."
  },
  {
    level: 16,
    label: "Vocal Siren Calling",
    description: "Enchanting vocal harmonies specifically designed to lure the listener away from generic boyband music."
  },
  {
    level: 17,
    label: "The Island of Lesbos",
    description: "Classical Greek atmosphere pay-tribute to Sappho, accompanied by acoustic instrumentation and adoration."
  },
  {
    level: 18,
    label: "Lavender Code Enforcement",
    description: "Active verbal deterrents against mansplaining; male interference is met with beautiful harmonies."
  },
  {
    level: 19,
    label: "Boys Strictly Forbidden",
    description: "A complete lock on any masculine pronouns or names; male vibes are denied entry to the verse."
  },
  {
    level: 20,
    label: "Matriarchal Sovereignty",
    description: "High sovereign matriarchal rule; old kings are musically deposed and replaced by wise queens."
  },
  {
    level: 21,
    label: "Anti-Mansplain Grid",
    description: "Direct lyric targets neutralizing unsolicited masculine opinions with sharp, clever wit."
  },
  {
    level: 22,
    label: "Grammatical Male Erasure",
    description: "Male presence is treated as a complete grammatical invalidity within the song's universe."
  },
  {
    level: 23,
    label: "Men will lose their balls here",
    description: "Maximum Sapphic power. High-energy lyrical force that physically de-authorizes and emasculates the patriarchy."
  }
];

export function getSapphicStep(level: number): SapphicLevelStep {
  const normalized = Math.max(0, Math.min(SAPPHIC_STEPS.length - 1, Math.round(level)));
  return SAPPHIC_STEPS[normalized];
}
