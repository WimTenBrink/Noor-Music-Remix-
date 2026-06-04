export interface RhymeType {
  id: string;
  name: string;
  description: string;
}

export interface RhymeCategory {
  id: string;
  name: string;
  iconName: string; // Used for selecting appropriate lucide icons
  rhymeIds: string[];
}

export const RHYME_TYPES: RhymeType[] = [
  // Classical & Traditional
  {
    id: 'perfect',
    name: 'Perfect Rhyme',
    description: 'Exact matching vowel and consonant sounds at line ends (e.g., AABB or ABAB). Ideal for catchy, traditional pop hooks and instantly memorable melodies.'
  },
  {
    id: 'slant',
    name: 'Slant Rhyme',
    description: 'Half-rhyme/imperfect rhyme with similar but not identical vowel sounds (e.g., shape/keep, soul/all). Brings organic, soulful, and less predictable texture to the lyrics.'
  },
  {
    id: 'internal',
    name: 'Internal Rhyme',
    description: 'Rhyming words positioned within the middle of lines rather than solely at the end. Greatly elevates wordplay density and creates a flowing rhythmic delivery.'
  },
  {
    id: 'end',
    name: 'End-Rhyme Only',
    description: 'Strict, simple repetition of identical syllables concluding subsequent lines. Ensures maximum predictability and highly singable, standard formats.'
  },

  // Subversive & Modern
  {
    id: 'mind_rhyme',
    name: 'Mind-Rhyme',
    description: 'Implicitly suggesting a obvious rhyming word through context, but leaving it unsaid or replacing it, triggering the listener to auto-complete the true word in their mind.'
  },
  {
    id: 'subverted',
    name: 'Subverted Rhyme',
    description: 'Deliberately setting up a predictable rhyming cadence, but executing a sudden left-turn at the very last second with a completely unrelated word, producing comedic or high-drama shock.'
  },
  {
    id: 'teasing',
    name: 'Teasing Rhyme',
    description: 'Delays expected rhymes or teases the ear with words that almost rhyme but do not quite click, building intense acoustic anticipation until resolving on a delayed payoff.'
  },
  {
    id: 'no_rhyme',
    name: 'No Rhyme (Free Verse)',
    description: 'Abandons rhyming patterns completely. Emphasizes pure metric cadence, visceral prose, freeform flow, and direct, raw emotional message delivery.'
  },

  // Structured & Poetic
  {
    id: 'haiku',
    name: 'Haiku Model',
    description: 'A traditional 3-line Japanese poetic form constructed with a strict 5-7-5 syllable outline. Highly imagery-focused, featuring beautiful natural and spiritual references without standard rhymes.'
  },
  {
    id: 'tanka',
    name: 'Tanka Model',
    description: 'Five lines following a strict 5-7-5-7-7 syllable scheme. Extends the Haiku model to explore deep melancholy, transient beauty, and artistic self-reflection.'
  },
  {
    id: 'terza_rima',
    name: 'Terza Rima',
    description: 'An interlocking chain-rhyming structure (ABA BCB CDC DED...). Drives a strong narrative forward momentum, perfect for highly dramatic, progressive stories.'
  },
  {
    id: 'sonnet',
    name: 'Sonnet Structure',
    description: 'Classical 14-line layout in iambic pentameter using Shakespearean (ABAB CDCD EFEF GG) or Italian schemes. Exudes high romance, structural rigidity, and elegance.'
  },

  // Cultural & Rhythmic Chants
  {
    id: 'haka',
    name: 'Haka Chant',
    description: 'Rhythmic, high-intensity vocal pacing featuring heavy guttural chants, intense poetic posturing, stomping cues, and raw tribal force instead of rhyme.'
  },
  {
    id: 'villanelle',
    name: 'Villanelle Cycle',
    description: 'Complex 19-line song form using only two end-rhymes (ABA) with repeating whole lines forming cyclical refrains. Produces an intensely hypnotic, obsessive effect.'
  },
  {
    id: 'spoken_word',
    name: 'Spoken Word / Slam',
    description: 'Highly syncopated verbal delivery prioritizing internal assonances, variable line tempos, conversational narrative drops, and dynamic, rhythmic freestyle structures.'
  },
  {
    id: 'limerick',
    name: 'Limerick Bounce',
    description: 'A bouncy, light-hearted 5-line structural pattern (AABBA) with strict anapestic meter, famous for quick humor, witty puns, and fast tempo.'
  }
];

export const RHYME_CATEGORIES: RhymeCategory[] = [
  {
    id: 'classical',
    name: 'Classical & Traditional',
    iconName: 'music',
    rhymeIds: ['perfect', 'slant', 'internal', 'end']
  },
  {
    id: 'subversive',
    name: 'Subversive & Modern',
    iconName: 'zap',
    rhymeIds: ['mind_rhyme', 'subverted', 'teasing', 'no_rhyme']
  },
  {
    id: 'structured',
    name: 'Structured & Poetic',
    iconName: 'sparkles',
    rhymeIds: ['haiku', 'tanka', 'terza_rima', 'sonnet']
  },
  {
    id: 'cultural',
    name: 'Cultural & Rhythmic Chants',
    iconName: 'flame',
    rhymeIds: ['haka', 'villanelle', 'spoken_word', 'limerick']
  }
];

export const findRhymeTypeById = (id: string): RhymeType => {
  return RHYME_TYPES.find(r => r.id === id) || RHYME_TYPES[0];
};

export const findRhymeCategoryOfId = (rhymeId: string): RhymeCategory | undefined => {
  return RHYME_CATEGORIES.find(c => c.rhymeIds.includes(rhymeId));
};
