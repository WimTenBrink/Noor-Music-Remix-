export interface EpicLevelStep {
  level: number;
  label: string;
  description: string;
}

export const EPIC_STEPS: EpicLevelStep[] = [
  {
    level: 0,
    label: "Basic Pop Minimalist",
    description: "Sparsely arranged, intimate pop with minimal instrumentation, focusing on a clean and direct vocal line."
  },
  {
    level: 1,
    label: "Acoustic Lounge Pop",
    description: "Soft acoustic tones, casual string strumming, and a relaxed, laid-back pop rhythm."
  },
  {
    level: 2,
    label: "Indie Pop Groove",
    description: "Light electronic beats, minor syncopation, and organic indie-pop instrument accents."
  },
  {
    level: 3,
    label: "Upbeat Synth Dance",
    description: "Playful electronic drums, vintage keyboard arpeggios, and standard catchy synth-pop vibes."
  },
  {
    level: 4,
    label: "Sophisticated Horn Pop",
    description: "Polished brass details, sophisticated vocal layers, and steady, mature production."
  },
  {
    level: 5,
    label: "Dynamic Electro Rock",
    description: "Driving syncopated synthesizer bass, crisp electric guitars, and energizing mid-tempo rock beats."
  },
  {
    level: 6,
    label: "Ornate Baroque Pop",
    description: "Classical harpsichord runs, delicate chamber string arrangements, and a touch of aristocratic drama."
  },
  {
    level: 7,
    label: "Melodramatic Ballad",
    description: "Key modulations, lush swelling vocal harmonies, and highly theatrical piano backing."
  },
  {
    level: 8,
    label: "Chamber Pop Drama",
    description: "Intense orchestral backing focusing on deep double bass, cellos, woodwinds, and delicate harps."
  },
  {
    level: 9,
    label: "Theatrical Rock Opera",
    description: "Bohemian-style vocal harmonies, sweeping electric guitar solo waves, and high stage-show energy."
  },
  {
    level: 10,
    label: "Industrial Synth-Rock",
    description: "Pistonic metallic clangors, heavy driving rhythms, and dark, pulsing electronic wave synthesis."
  },
  {
    level: 11,
    label: "Gothic Cathedral Darkwave",
    description: "Mysterious pipe organ textures, dark droning synthesizers, and solemn, low-pitched choral backdrops."
  },
  {
    level: 12,
    label: "Symphonic Power Ballad",
    description: "Broad string ensembles, brilliant brass chords, and thundering timpanis driving a massive ballad scale."
  },
  {
    level: 13,
    label: "Symphonic Power Metal",
    description: "Heroic double-bass drumming, roaring symphonic backing, and blistering guitar riffs."
  },
  {
    level: 14,
    label: "Epic Pipe Organ & Brass",
    description: "Extremely quiet verses that explode into colossal, magnificent church organ and brass fanfares."
  },
  {
    level: 15,
    label: "Dramatic Operatic Symphony",
    description: "Rapid florid operatic trills, high soprano vocal leaps, and intensely fast theatrical segments."
  },
  {
    level: 16,
    label: "High-Stakes Cinematic Score",
    description: "Aggressive staccato stabs, ticking suspense elements, and sudden booming low brass swells."
  },
  {
    level: 17,
    label: "Colossal Heroic Orchestral",
    description: "Sweeping brass fanfares, colossal sub-bass thumps, and majestic, cinematic orchestral heights."
  },
  {
    level: 18,
    label: "Apocalyptic Choral Requiem",
    description: "Dark, ominous full choir chanting in Latin, heavy pipe organ, and colossal dramatic string sweeps."
  },
  {
    level: 19,
    label: "Cosmic Interstellar Anthem",
    description: "Swirling astronomical synthesizers, infinite space delays, and an explosive, universe-bending climax."
  },
  {
    level: 20,
    label: "Mythic Pre-Christian Folk",
    description: "Heavy ritualistic hand drums, wooden woodwinds, and raw, primal pagan war chanting."
  },
  {
    level: 21,
    label: "Violent Gothic Opera",
    description: "Screaming, highly distorted violin solos, thunderous church bells, and spectacular tempo shifts."
  },
  {
    level: 22,
    label: "Ultimate Orchestral Crescendo",
    description: "A colossal, staggering wall of symphonic sound that layers section upon section, building to an endless peak."
  },
  {
    level: 23,
    label: "Colossal Epic Masterpiece",
    description: "The peak of theatricality: roaring full choir chanting in unison, massive timpani strikes, and tragic-heroic tension."
  }
];

export const getEpicStep = (level: number): EpicLevelStep => {
  const normalized = Math.max(0, Math.min(EPIC_STEPS.length - 1, Math.round(level)));
  return EPIC_STEPS[normalized];
};
