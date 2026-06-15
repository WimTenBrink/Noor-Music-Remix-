export interface InstrumentRegistryEntry {
  name: string;
  description: string;
  groups: string[];
}

export const ALL_INSTRUMENTS: InstrumentRegistryEntry[] = [
  // --- CELTIC ORIGIN ---
  {
    name: "Bagpipes",
    description: "Traditional bellows-blown reed pipes of Celtic/Scottish heritage with constant air drones.",
    groups: ["Celtic Heritage", "Norse & Baltic Folk", "Woodwinds & Free Reeds"]
  },
  {
    name: "Bodhrán",
    description: "Traditional Irish handheld frame drum beaten with a double-headed wooden tipper.",
    groups: ["Celtic Heritage", "Norse & Baltic Folk", "Drums & Deep Skins"]
  },
  {
    name: "Crwth",
    description: "Ancient Celtic six-string bowed lyre originating from medieval Wales.",
    groups: ["Celtic Heritage", "Acoustic Plucked Strings", "Ancient & Mythological", "Classical Bowed Strings"]
  },
  {
    name: "Carnyx",
    description: "Iron Age Celtic bronze war trumpet with a bell shaped like an open-mouthed wild boar.",
    groups: ["Celtic Heritage", "Brass & Fanfare Horns", "Ancient & Mythological"]
  },
  {
    name: "Celtic Harp",
    description: "A wire-strung triangular harp centerpiece of traditional Irish and Scottish folklore.",
    groups: ["Celtic Heritage", "Acoustic Plucked Strings", "Ancient & Mythological"]
  },
  {
    name: "Tin Whistle",
    description: "Simple six-holed metal wind flute providing high penny-whistle melodies.",
    groups: ["Celtic Heritage", "Norse & Baltic Folk", "Woodwinds & Free Reeds"]
  },
  {
    name: "Irish Bouzouki",
    description: "Folk variant of the Greek bouzouki with a flat back, producing a ringing, bright string chime.",
    groups: ["Celtic Heritage", "Acoustic Plucked Strings"]
  },

  // --- ROMAN & MEDITERRANEAN ---
  {
    name: "Cornu",
    description: "Circular, massive G-shaped ancient Roman army brass horn about 3 meters long.",
    groups: ["Roman & Mediterranean", "Brass & Fanfare Horns", "Ancient & Mythological"]
  },
  {
    name: "Lituus",
    description: "Ancient Etruscan and Roman long bronze signaling trumpet curved at the end like a staff.",
    groups: ["Roman & Mediterranean", "Brass & Fanfare Horns", "Ancient & Mythological"]
  },
  {
    name: "Buccina",
    description: "High-pitched ancient Roman tactical horn wrapped in a tight spiral shell shape.",
    groups: ["Roman & Mediterranean", "Brass & Fanfare Horns", "Ancient & Mythological"]
  },
  {
    name: "Roman Tuba",
    description: "Straight, cylindrical heavy-bronze military trumpet of the Roman legions.",
    groups: ["Roman & Mediterranean", "Brass & Fanfare Horns", "Ancient & Mythological"]
  },
  {
    name: "Tympanum",
    description: "Large shallow Roman hand-held frame drum beaten with a stick or fingers.",
    groups: ["Roman & Mediterranean", "Drums & Deep Skins"]
  },
  {
    name: "Sistrum Romanum",
    description: "Metal rattle of ancient Egyptian origin, heavily used in Roman mystery cults.",
    groups: ["Roman & Mediterranean", "Percussion & Bells", "Ancient & Mythological"]
  },

  // --- EAST ASIAN ---
  {
    name: "Guzheng",
    description: "Cascading, expressive Chinese plucked zither with 21 strings and movable bridges.",
    groups: ["East Asian Traditional", "Acoustic Plucked Strings"]
  },
  {
    name: "Pipa",
    description: "Four-stringed pear-shaped Chinese plucked lute played with fluid finger dexterity.",
    groups: ["East Asian Traditional", "Acoustic Plucked Strings"]
  },
  {
    name: "Erhu",
    description: "Expressive, sorrowful two-stringed Chinese spike fiddle played with an interwoven bow.",
    groups: ["East Asian Traditional", "Classical Bowed Strings"]
  },
  {
    name: "Dizi",
    description: "Traditional Chinese transverse bamboo flute featuring a buzzing membrane.",
    groups: ["East Asian Traditional", "Woodwinds & Free Reeds"]
  },
  {
    name: "Sheng",
    description: "Ancient Chinese multi-pipe free-reed mouth-blown organ producing polyphonic chords.",
    groups: ["East Asian Traditional", "Woodwinds & Free Reeds"]
  },
  {
    name: "Guqin",
    description: "A plucked seven-string Chinese zither embodying scholarly contemplation and refined slides.",
    groups: ["East Asian Traditional", "Acoustic Plucked Strings", "Ancient & Mythological"]
  },

  // --- STEPPE & MONGOLIAN ---
  {
    name: "Morin Khuur",
    description: "Plaintive two-stringed Mongolian horsehead fiddle producing warm, cello-like tones.",
    groups: ["Steppe & Mongolian", "Classical Bowed Strings"]
  },
  {
    name: "Yatga",
    description: "Traditional Mongolian plucked zither with movable bridges and soaring slide orchestration.",
    groups: ["Steppe & Mongolian", "Acoustic Plucked Strings"]
  },
  {
    name: "Tovshuur",
    description: "Two-stringed West Mongolian plucked lute traditionally used to accompany epic storytellers.",
    groups: ["Steppe & Mongolian", "Acoustic Plucked Strings"]
  },
  {
    name: "Tsuur",
    description: "Ancient end-blown wooden flute associated with summoning nature, water, and animal spirits.",
    groups: ["Steppe & Mongolian", "Woodwinds & Free Reeds", "Ancient & Mythological"]
  },
  {
    name: "Shanz",
    description: "Three-stringed Mongolian plucked lute with a snake-skin resonator, delivering sharp twangs.",
    groups: ["Steppe & Mongolian", "Acoustic Plucked Strings"]
  },
  {
    name: "Ikh Khuur",
    description: "Large, deep-voiced bass horsehead fiddle providing rumbling acoustic registers.",
    groups: ["Steppe & Mongolian", "Classical Bowed Strings"]
  },
  {
    name: "Mongolian Aman Khuur",
    description: "Traditional metal mouth jaw harp producing bouncing, rubbery overtone vibrations.",
    groups: ["Steppe & Mongolian", "Percussion & Bells"]
  },

  // --- AFRICAN & TRIBAL ---
  {
    name: "Djembe",
    description: "Rope-tuned goblet drum covered in goatskin, played with hands for high slaps and deep bass.",
    groups: ["African & Tribal Beats", "Drums & Deep Skins"]
  },
  {
    name: "Kora",
    description: "West African 21-string harp-lute with a large calabash resonator and cascading harp-like tones.",
    groups: ["African & Tribal Beats", "Acoustic Plucked Strings"]
  },
  {
    name: "Kalimba",
    description: "Handheld African thumb piano consisting of metal tines mounted on a resonant wooden box.",
    groups: ["African & Tribal Beats", "Percussion & Bells"]
  },
  {
    name: "Balafon",
    description: "West African wooden pitched xylophone featuring hollow gourd resonators underneath.",
    groups: ["African & Tribal Beats", "Percussion & Bells"]
  },
  {
    name: "Talking Drum",
    description: "Squeezable pitch-shifting hourglass drum mimicking vocal inflections.",
    groups: ["African & Tribal Beats", "Drums & Deep Skins"]
  },
  {
    name: "Udu",
    description: "Traditional Nigerian baked clay vessel side-hole pot drum creating deep water-drop thuds.",
    groups: ["African & Tribal Beats", "Drums & Deep Skins"]
  },
  {
    name: "Shekere",
    description: "Dried gourd instrument covered in a woven net of seeds/beads for crisp shakes.",
    groups: ["African & Tribal Beats", "Percussion & Bells"]
  },

  // --- AMERICAS & ANDEAN ---
  {
    name: "Native American Flute",
    description: "Atmospheric, air-flowing wooden flute featuring a dual-chamber sound mechanism.",
    groups: ["Americas & Tribal Winds", "Woodwinds & Free Reeds"]
  },
  {
    name: "Hoop Drum",
    description: "Traditional raw-hide skin single-headed shallow frame drum beaten with a padded mallet.",
    groups: ["Americas & Tribal Winds", "Drums & Deep Skins"]
  },
  {
    name: "Water Drum",
    description: "Clay or wooden water-filled drum providing a high-resonance splashy thud sound.",
    groups: ["Americas & Tribal Winds", "Drums & Deep Skins"]
  },
  {
    name: "Deer Hoof Rattle",
    description: "Authentic rattle made of clustered deer hooves producing a dry wood click-clack.",
    groups: ["Americas & Tribal Winds", "Percussion & Bells"]
  },
  {
    name: "Zampona / Siku",
    description: "Andean panpipe of multiple hollow bamboo tubes aligned in rows, played in pairs.",
    groups: ["Americas & Tribal Winds", "Woodwinds & Free Reeds"]
  },
  {
    name: "Charango",
    description: "Small ten-stringed Andean guitar historically made with an armadillo shell body.",
    groups: ["Americas & Tribal Winds", "Acoustic Plucked Strings"]
  },
  {
    name: "Bombo Legüero",
    description: "Argentine deep hollowed tree trunk drum covered in sheepskin with hair on.",
    groups: ["Americas & Tribal Winds", "Drums & Deep Skins"]
  },
  {
    name: "Quena",
    description: "Wooden end-notched flute of the Andes with a sweet, highly expressive breath sound.",
    groups: ["Americas & Tribal Winds", "Woodwinds & Free Reeds"]
  },

  // --- MIDDLE EASTERN & INDIAN ---
  {
    name: "Oud",
    description: "Classical pear-shaped fretless short-necked lute widely used in Arabic musical suites.",
    groups: ["Middle Eastern & Indian", "Roman & Mediterranean", "Acoustic Plucked Strings"]
  },
  {
    name: "Darbuka",
    description: "Middle Eastern hourglass hand drum providing crisp metallic rim clacks and round bass thuds.",
    groups: ["Middle Eastern & Indian", "Roman & Mediterranean", "Drums & Deep Skins"]
  },
  {
    name: "Middle-Eastern Ney",
    description: "Ancient Persian end-blown cane flute producing highly breathy, mystical, layered overtones.",
    groups: ["Middle Eastern & Indian", "Woodwinds & Free Reeds"]
  },
  {
    name: "Kanun",
    description: "Trapezoidal lap zither with 72 strings and metallic levers to shift microtonal maqams.",
    groups: ["Middle Eastern & Indian", "Roman & Mediterranean", "Acoustic Plucked Strings"]
  },
  {
    name: "Riq",
    description: "An ornate Middle Eastern tambourine featuring thick brass jingles and tight skin play.",
    groups: ["Middle Eastern & Indian", "Percussion & Bells"]
  },
  {
    name: "Sitar",
    description: "Plucked stringed Indian classical instrument with a gourd resonator and sympathetic buzzing wires.",
    groups: ["Middle Eastern & Indian", "Acoustic Plucked Strings"]
  },
  {
    name: "Tabla",
    description: "Pairs of hand-played tuned copper and wood Indian kettledrums with iron-sand centers.",
    groups: ["Middle Eastern & Indian", "Drums & Deep Skins"]
  },
  {
    name: "Indian Harmonium",
    description: "Hand-pumped bellow-driven keyboard reed instrument widely used in Indian devotional chants.",
    groups: ["Middle Eastern & Indian", "Modern Electronic & Synths"]
  },
  {
    name: "Bansuri",
    description: "Traditional Indian side-blown transverse bamboo flute of soft, warm, expressive qualities.",
    groups: ["Middle Eastern & Indian", "Woodwinds & Free Reeds"]
  },
  {
    name: "Sarod",
    description: "Fretless classical Indian string instrument with a metal fingerboard producing deep slide chimes.",
    groups: ["Middle Eastern & Indian", "Acoustic Plucked Strings"]
  },
  {
    name: "Tanpura",
    description: "Plucked drone lute with four or five wire strings producing an atmospheric harmonic backdrop.",
    groups: ["Middle Eastern & Indian", "Acoustic Plucked Strings"]
  },

  // --- NORSE & BALTIC ---
  {
    name: "Tagelharpa",
    description: "Traditional horsehair bowed lyre of Scandinavia producing ancient buzzy overtones.",
    groups: ["Norse & Baltic Folk", "Celtic Heritage", "Classical Bowed Strings", "Ancient & Mythological"]
  },
  {
    name: "Bukkehorn",
    description: "Traditional wind instrument carved from a goat's horn with fingerholes.",
    groups: ["Norse & Baltic Folk", "Woodwinds & Free Reeds", "Ancient & Mythological"]
  },
  {
    name: "Kravik Lyre",
    description: "Medieval Scandinavian seven-string lyre reconstructed from archeological Norse finds.",
    groups: ["Norse & Baltic Folk", "Celtic Heritage", "Acoustic Plucked Strings", "Ancient & Mythological"]
  },
  {
    name: "Gjallarhorn",
    description: "Large, booming horn used to make loud, calling signals across landscapes and mountains.",
    groups: ["Norse & Baltic Folk", "Brass & Fanfare Horns"]
  },

  // --- JAPANESE OR ASIA ---
  {
    name: "Taiko Drums",
    description: "Large, thunderous Japanese ritual barrel drums played with wooden bachi mallets.",
    groups: ["East Asian Traditional", "Drums & Deep Skins"]
  },
  {
    name: "Shamisen",
    description: "Three-stringed Japanese lute with a square skin body plucked with a large plectrum.",
    groups: ["East Asian Traditional", "Acoustic Plucked Strings"]
  },
  {
    name: "Koto",
    description: "Thirteen-stringed Japanese national zither featuring movable bridges and pristine chirps.",
    groups: ["East Asian Traditional", "Acoustic Plucked Strings"]
  },
  {
    name: "Shakuhachi",
    description: "Traditional Japanese end-blown bamboo flute used by Zen monks for breath meditation.",
    groups: ["East Asian Traditional", "Woodwinds & Free Reeds"]
  },

  // --- ABORIGINAL ---
  {
    name: "Didgeridoo",
    description: "Deep, resonant hollowed eucalyptus drone wind instrument of northern Australia.",
    groups: ["African & Tribal Beats", "Woodwinds & Free Reeds", "Drums & Deep Skins"]
  },
  {
    name: "Clapsticks / Bilma",
    description: "Traditional Australian hardwood rhythm sticks struck together to maintain tribal vocal beats.",
    groups: ["African & Tribal Beats", "Percussion & Bells"]
  },
  {
    name: "Bullroarer",
    description: "Spinning wooden blade swung on a cord, producing low whistling atmospheric roars.",
    groups: ["African & Tribal Beats", "Percussion & Bells"]
  },

  // --- VOCAL STYLES ---
  {
    name: "Operatic Soprano",
    description: "Classical sweeping vocal style representing dramatic, soaring female high ranges.",
    groups: ["Vocal Cues & Styles"]
  },
  {
    name: "Ethereal & Airy",
    description: "Delicate, light, fairy-like and atmospheric vocal performance guidelines.",
    groups: ["Vocal Cues & Styles"]
  },
  {
    name: "Growling (Guttural)",
    description: "Harsh, throaty vocal growl widely used in heavy metal and raw folk cues.",
    groups: ["Vocal Cues & Styles"]
  },
  {
    name: "Screaming & Screamo",
    description: "Intense, high-pitched emotional vocal projection of extreme rock registers.",
    groups: ["Vocal Cues & Styles"]
  },
  {
    name: "Gregorian Chant Vocal",
    description: "Unaccompanied monophonic spiritual chant mimicking ancient church acoustics.",
    groups: ["Vocal Cues & Styles"]
  },
  {
    name: "Mongolian Throat Vocal",
    description: "Vocal manipulation of throat resonances producing dual overtone drones.",
    groups: ["Vocal Cues & Styles", "Steppe & Mongolian"]
  },
  {
    name: "Celt-Folk Lilting Mouth",
    description: "Rhythmic Gaelic mouth-music of upbeat, syncopated vocalizations.",
    groups: ["Vocal Cues & Styles"]
  },
  {
    name: "Torch-Song Cabaret",
    description: "Theatrical, heavy-hearted vocal style delivering dramatic narrative leaps.",
    groups: ["Vocal Cues & Styles"]
  },
  {
    name: "Sultry Jazz Coo",
    description: "Very quiet, warm, and breathy low-register swing vocal styling.",
    groups: ["Vocal Cues & Styles"]
  },
  {
    name: "Spoken Word Poetics",
    description: "Highly rhythmic spoken recitation delivered directly over ambient backing tracks.",
    groups: ["Vocal Cues & Styles"]
  },
  {
    name: "Vocal Fry Creak",
    description: "Low gravelly creaky vocal delivery focusing on low register tones.",
    groups: ["Vocal Cues & Styles"]
  },

  // --- BRASS STANDARDS ---
  {
    name: "Trumpet",
    description: "High-pitched brilliant metal brass instrument with valve play.",
    groups: ["Brass & Fanfare Horns"]
  },
  {
    name: "Trombone",
    description: "Lower register brass instrument using a sliding tube mechanism.",
    groups: ["Brass & Fanfare Horns"]
  },
  {
    name: "Tuba",
    description: "Massive, extremely low-register foundational brass wind horn.",
    groups: ["Brass & Fanfare Horns"]
  },
  {
    name: "French Horn",
    description: "Coiled circular conical valve horn of warm, mellow orchestral quality.",
    groups: ["Brass & Fanfare Horns"]
  },

  // --- BOWED STRINGS STANDARDS ---
  {
    name: "Violin",
    description: "High-pitched four-string bowed classical orchestral instrument.",
    groups: ["Classical Bowed Strings"]
  },
  {
    name: "Viola",
    description: "Slightly larger, warmer, and deeper medium-register bowed string instrument.",
    groups: ["Classical Bowed Strings"]
  },
  {
    name: "Cello",
    description: "Rich, soulful, highly resonant low-register bowed string giant.",
    groups: ["Classical Bowed Strings"]
  },
  {
    name: "Double Bass",
    description: "Gigantic, deepest, and lowest orchestral bowed wooden string body.",
    groups: ["Classical Bowed Strings"]
  },

  // --- ACOUSTIC STRINGS STANDARDS ---
  {
    name: "Acoustic Guitar",
    description: "Rich resonance classical plucked string instrument with hollow body sound.",
    groups: ["Acoustic Plucked Strings"]
  },
  {
    name: "Lute",
    description: "Plucked string instrument of Renaissance history with a rounded wooden body.",
    groups: ["Acoustic Plucked Strings", "Ancient & Mythological"]
  },
  {
    name: "Harp",
    description: "Plucked multi-string frame instrument of ancient and orchestral prestige.",
    groups: ["Acoustic Plucked Strings"]
  },
  {
    name: "Mandolin",
    description: "High-pitched doubled plucked string instrument of folk and bluegrass setups.",
    groups: ["Acoustic Plucked Strings"]
  },
  {
    name: "Banjo",
    description: "Twangy plucked string instrument with a skin drum-like body.",
    groups: ["Acoustic Plucked Strings"]
  },
  {
    name: "Dulcimer",
    description: "Zither-like folk strings beaten with tiny wooden mallets.",
    groups: ["Acoustic Plucked Strings"]
  },

  // --- WOODWINDS STANDARDS ---
  {
    name: "Flute",
    description: "Silver transverse orchestral woodwind creating bright, airy, clean tones.",
    groups: ["Woodwinds & Free Reeds"]
  },
  {
    name: "Oboe",
    description: "Exquisite double-reed woodwind of intense, focused, and reedy character.",
    groups: ["Woodwinds & Free Reeds"]
  },
  {
    name: "Clarinet",
    description: "Cylindrical woodwind with a rich, smooth, and extensive range.",
    groups: ["Woodwinds & Free Reeds"]
  },
  {
    name: "Bassoon",
    description: "Deepest classical double-reed bass woodwind of rich, reedy woody hums.",
    groups: ["Woodwinds & Free Reeds"]
  },
  {
    name: "Accordion",
    description: "Squeezebox free-reed keyboard instrument driven by manual air blowing bellows.",
    groups: ["Woodwinds & Free Reeds"]
  },

  // --- DRUMS & SNARE STANDARDS ---
  {
    name: "Snare Drum",
    description: "Loud, snapping drum utilizing bottom metal strands to create a rattling sound.",
    groups: ["Drums & Deep Skins"]
  },
  {
    name: "Bass Drum / Kick",
    description: "Massive, deep booming low-end rhythmic foundation.",
    groups: ["Drums & Deep Skins"]
  },
  {
    name: "Timpani",
    description: "Large copper orchestral bowls tuned to precise musical pitches.",
    groups: ["Drums & Deep Skins"]
  },

  // --- PERCUSSION & METAL STANDARDS ---
  {
    name: "Tambourine",
    description: "Handheld frame wood drum with high-ringing metal jingles.",
    groups: ["Percussion & Bells"]
  },
  {
    name: "Triangle",
    description: "High ringing metal bar of great pitch clarity.",
    groups: ["Percussion & Bells"]
  },
  {
    name: "Wind Chimes",
    description: "Delicate wind-blown hanging metal rods of high shimmer.",
    groups: ["Percussion & Bells"]
  },
  {
    name: "Glockenspiel",
    description: "Set of tuned metallic bars played with hard mallets.",
    groups: ["Percussion & Bells"]
  },
  {
    name: "Cymbals",
    description: "Crashing or riding round thin metal plates.",
    groups: ["Percussion & Bells"]
  },
  {
    name: "Castanets",
    description: "Clicking wooden rhythmic shells held in the fingers.",
    groups: ["Percussion & Bells"]
  },
  {
    name: "Cowbell",
    description: "Clunky rustic hollow metal percussion vessel.",
    groups: ["Percussion & Bells"]
  },
  {
    name: "Glass Harmonica",
    description: "Atmospheric rubbing friction-played spinning glass bowls.",
    groups: ["Percussion & Bells", "Ancient & Mythological"]
  },

  // --- ELECTRONIC & MODERN ---
  {
    name: "Electric Guitar",
    description: "Solid-body guitar needing electronic amplification for infinite rock expression.",
    groups: ["Modern Electronic & Synths"]
  },
  {
    name: "Bass Guitar",
    description: "Heavy, long-profile low-register electronic four-to-six string guitar.",
    groups: ["Modern Electronic & Synths"]
  },
  {
    name: "Synthesizer",
    description: "Universal electronic keyboard generating synthetic sound wave oscillators.",
    groups: ["Modern Electronic & Synths"]
  },
  {
    name: "Drum Machine",
    description: "Electronic beat controller compiling programmable computer drum triggers.",
    groups: ["Modern Electronic & Synths"]
  },
  {
    name: "Keytar",
    description: "Synthesizer outfitted with a leather guitar strap and vertical key interface.",
    groups: ["Modern Electronic & Synths"]
  },
  {
    name: "Theremin",
    description: "Early contactless synth played by waving hands near electromagnetic antennas.",
    groups: ["Modern Electronic & Synths"]
  },
  {
    name: "Mellotron",
    description: "Retro keyboard compiling tape loop playbacks of acoustic flutes or choral textures.",
    groups: ["Modern Electronic & Synths"]
  }
];

// Dynamically extract all unique group names across instruments and sort alphabetically
const groupsSet = new Set<string>();
ALL_INSTRUMENTS.forEach(inst => {
  inst.groups.forEach(g => groupsSet.add(g));
});

export const INSTRUMENT_GROUPS_LIST = Array.from(groupsSet).sort();

// Reconstruct the nested array structure expected by the Band Instruments selectors
export const INSTRUMENTS = INSTRUMENT_GROUPS_LIST.map(groupName => {
  const matching = ALL_INSTRUMENTS.filter(inst => inst.groups.includes(groupName));
  return {
    type: groupName,
    instruments: matching.map(inst => ({
      name: inst.name,
      description: inst.description
    }))
  };
});

// Reconstruct a flat structured array for Single Singer Solo views
export const SINGLE_SINGER_INSTRUMENTS = ALL_INSTRUMENTS.map(inst => ({
  name: inst.name,
  description: inst.description,
  // Fallback map to preserve direct .group checks if needed (or we check groups directly)
  group: inst.groups[0] || "Acoustic Plucked Strings",
  groups: inst.groups
}));
