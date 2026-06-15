export interface WildnessLevelStep {
  level: number;
  label: string;
  description: string;
}

export const WILDNESS_STEPS: WildnessLevelStep[] = [
  {
    level: 0,
    label: "Absolute Stillness",
    description: "Zero dynamic changes, purely a still and silent minimal atmosphere."
  },
  {
    level: 1,
    label: "Whispered Calm",
    description: "Extremely low-energy, delicate soft acoustic breathing and warm gentle ambiance."
  },
  {
    level: 2,
    label: "Gentle Breeze",
    description: "Very calm, smooth rhythmic patterns and polite, steady pacing."
  },
  {
    level: 3,
    label: "Serene Horizon",
    description: "Clear, peaceful, stable acoustic foundation with minimal, predictable layers."
  },
  {
    level: 4,
    label: "Mellow Flow",
    description: "Slightly moving tempo, warm and predictable, non-disruptive instruments."
  },
  {
    level: 5,
    label: "Soft Pulse",
    description: "Rhythmic gentle pulse, relaxed and cozy tempo matching a resting heartbeat."
  },
  {
    level: 6,
    label: "Light Play",
    description: "Splashes of bright acoustic sparkles, minor variations without disrupting the theme."
  },
  {
    level: 7,
    label: "Active Flow",
    description: "Fluid, moving acoustic and vocal play, gentle standard development."
  },
  {
    level: 8,
    label: "Steady Groove",
    description: "Constant, predictable mid-tempo rhythm, balanced and pleasant."
  },
  {
    level: 9,
    label: "Bright Energy",
    description: "Upbeat and cheerful dynamic, light tempo shifts and playful phrasing."
  },
  {
    level: 10,
    label: "Dynamic Accent",
    description: "Adds accented drum hits, unexpected chord changes, and active development."
  },
  {
    level: 11,
    label: "Playful Bounce",
    description: "Lighthearted, bouncy, highly energetic tempo with vibrant solo additions."
  },
  {
    level: 12,
    label: "Spirited Spark",
    description: "High energy, bright brass entries and sweeping vocal melodies."
  },
  {
    level: 13,
    label: "Intense Drive",
    description: "Steady, high-powered driving rhythms with heavy synthesizer and drum syncopations."
  },
  {
    level: 14,
    label: "Stormy Tension",
    description: "Deep theatrical building, ominous minor chords, and intense string rolls."
  },
  {
    level: 15,
    label: "Dramatic Leap",
    description: "Sudden dramatic pauses, operatic leaps, and highly dynamic section changes."
  },
  {
    level: 16,
    label: "Wild Heat",
    description: "Passionate, fast-tempo, intense instrumental solos like shrieking violin or pipes."
  },
  {
    level: 17,
    label: "Thunderous Roar",
    description: "Exploding climaxes, heavy gongs, thundering bass drums, and roaring choir cues."
  },
  {
    level: 18,
    label: "Frenetic Dance",
    description: "Fast, irregular rhythmic pulses, shifting time signatures, and high tension."
  },
  {
    level: 19,
    label: "Electric Vortex",
    description: "Swirling, rapid synthesized filter sweeps, heavy laser effects and pounding beats."
  },
  {
    level: 20,
    label: "Chaotic Fervor",
    description: "Unpredictable arrangement jumps, sudden changes in tempo and genre, very high energy."
  },
  {
    level: 21,
    label: "Pagan Ritual",
    description: "Deep, primal, frantic acoustic pacing with screaming vocals and non-stop percussion."
  },
  {
    level: 22,
    label: "Ultimate Madness",
    description: "Siren calls, heavy clashing metal drums, screaming woodwinds, and wild pitch-bends."
  },
  {
    level: 23,
    label: "Complete Chaos",
    description: "The absolute peak of wildness: non-stop tempo shifts, screaming choirs, thunderous percussion, gongs, and ultimate sonic disorder!"
  }
];

export function getWildnessStep(level: number): WildnessLevelStep {
  const normalized = Math.max(0, Math.min(WILDNESS_STEPS.length - 1, Math.round(level)));
  return WILDNESS_STEPS[normalized];
}
