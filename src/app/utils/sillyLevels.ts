export interface SillyLevelStep {
  level: number;
  label: string;
  description: string;
}

export const SILLY_STEPS: SillyLevelStep[] = [
  {
    level: 0,
    label: "Serious & Somber",
    description: "Deeply profound, completely serious lyrics with zero nonsense."
  },
  {
    level: 1,
    label: "Thoughtful Reflection",
    description: "Steady, meaningful, highly conscious mood, very light witty phrasing."
  },
  {
    level: 2,
    label: "Polished Wit",
    description: "Sophisticated dry humor or light playful metaphor; highly coherent and sensible."
  },
  {
    level: 3,
    label: "Subtle Irony",
    description: "Wry observation or ironical commentary with an intelligent, under-the-surface tone."
  },
  {
    level: 4,
    label: "Light-Hearted",
    description: "Cheerful lyrics, warm smiles, completely sane but bright and bubbly."
  },
  {
    level: 5,
    label: "Playful Spark",
    description: "Bouncy cadence, sparkling phrasing, and a few slight whimsical rhymes."
  },
  {
    level: 6,
    label: "Cheeky",
    description: "Tongue-in-cheek jokes, minor double entendres, smiling and bantering attitude."
  },
  {
    level: 7,
    label: "Quirky",
    description: "Eccentric metaphors or unusual song subjects that make you think twice."
  },
  {
    level: 8,
    label: "Kooky",
    description: "Slightly weird connections, charms of offbeat logic and odd comparisons."
  },
  {
    level: 9,
    label: "Campy",
    description: "Over-the-top dramatic cliches, funny retro theatricality and exaggeration."
  },
  {
    level: 10,
    label: "Goofy",
    description: "Explicitly funny, cartoon-like sound words, and amusing situational comedy."
  },
  {
    level: 11,
    label: "Silly",
    description: "Full comedic focus, joyful silly puns and lighthearted humorous lines."
  },
  {
    level: 12,
    label: "Zany",
    description: "Rushed, wild, energetic, comical chaos with amusing non-sequiturs."
  },
  {
    level: 13,
    label: "Slapstick",
    description: "Physical comedy tropes, exaggerated descriptions of accidental trips, slips, or crashes."
  },
  {
    level: 14,
    label: "Absurdist",
    description: "Surreal elements like speaking household appliances or clouds that rain soup."
  },
  {
    level: 15,
    label: "Dadaist",
    description: "Highly unconventional combinations, rejecting standard narrative meaning for direct playful impressions."
  },
  {
    level: 16,
    label: "Wacky Nonsense",
    description: "High frequency of absurd words, funny gibberish, and rapid logic jumps."
  },
  {
    level: 17,
    label: "Madcap Chaos",
    description: "Completely hyperactive, unexpected narrative changes everyverse, keeping the listener guessing."
  },
  {
    level: 18,
    label: "Bizarre Fantasy",
    description: "Mythical ridiculous creatures and logically impossible whimsical scenarios."
  },
  {
    level: 19,
    label: "Fever Dream",
    description: "Surreal shifts, melting reality, dreamlike flow with a highly humorous, absurd tilt."
  },
  {
    level: 20,
    label: "Surreal Gibberish",
    description: "Combining bizarre word-salads with high dramatic or emotional vocal intensity."
  },
  {
    level: 21,
    label: "Outrageous Absurdity",
    description: "Lyrics that actively defy all laws of physics, time, and common sense."
  },
  {
    level: 22,
    label: "Utter Gobbledygook",
    description: "Silly portmanteaus, nonsense poetry names (like Jabberwocky), and melodic funny language."
  },
  {
    level: 23,
    label: "Total Nonsense",
    description: "Complete linguistic playground, maximum silliness, and beautiful, pure, chaotic nonsense!"
  }
];

export const getSillyStep = (level: number): SillyLevelStep => {
  const normalized = Math.max(0, Math.min(SILLY_STEPS.length - 1, Math.round(level)));
  return SILLY_STEPS[normalized];
};
