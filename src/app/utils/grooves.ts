export interface GrooveCategory {
  id: string;
  name: string;
  description: string;
}

export interface GrooveItem {
  name: string;
  category: string;
}

export const GROOVE_CATEGORIES: GrooveCategory[] = [
  {
    id: "electronic",
    name: "Electronic, Dance & Beats",
    description: "High-octane synths, heavy kicks, retro chiptunes, and futuristic digital sequencing."
  },
  {
    id: "robotic-synthwave",
    name: "Robotic & Synthwave Beats",
    description: "Quantized machine beats, vocoder sweeps, retro outrun neon basslines, and digital cybernetic clicks."
  },
  {
    id: "folk-world",
    name: "Folk, World & Acoustic",
    description: "Ancient and global traditional acoustic strings, hand drums, and sacred chants."
  },
  {
    id: "rock-indie",
    name: "Rock, Indie & Alternative",
    description: "Warped walls of guitar, driving electric basslines, and retro rock energy."
  },
  {
    id: "metal-gothic",
    name: "Heavy Metal & Dark Gothic",
    description: "Aggressive drop-tuned guitars, gothic choruses, blastbeats, and dark neoclassical organs."
  },
  {
    id: "lo-fi-ambient",
    name: "Lo-Fi, Ambient & Chill",
    description: "Mellow atmospheric pads, crackly vinyl hiss, sub-bass washes, and comforting space-dust delays."
  },
  {
    id: "jazz-soul",
    name: "Jazz, Soul, R&B & Grooves",
    description: "Laidback electric pianos, brass sections, boom-bap, swing, and dubwise offbeats."
  },
  {
    id: "classical-orchestral",
    name: "Classical, Orchestral & Cinematic",
    description: "Epic dramatic orchestral brass layers, chamber harpsichords, and haunting drones."
  },
  {
    id: "loud-drums-gongs",
    name: "Loud Drums & Gongs",
    description: "Thunderous, explosive, high-impact percussion, ceremonial gongs, and driving war drums."
  },
  {
    id: "vocal-tempo",
    name: "Vocal Carriage, Mood & Tempo",
    description: "Spoken recitations, conversational rhythms, and ethereal or melodramatic meters."
  },
  {
    id: "angelic-demonic",
    name: "Angelic & Demonic Variants",
    description: "Transcendent divine harmonies, heavenly sweeps, contrasting with dark abyssal chants, guttural drones, and hellfire beats."
  },
  {
    id: "cowboy-western",
    name: "Cowboy & Western Beats",
    description: "Dusty galloping rhythms, howling country slides, saloon honky-tonk piano, and cinematic desert-frontier wind."
  },
  {
    id: "romantic-sensual",
    name: "Romantic & Sensual Grooves",
    description: "Intimate, slow-burning rhapsodies, velvety R&B basslines, warm sax sweeps, and passionate string swells."
  },
  {
    id: "gregorian-chant",
    name: "Gregorian Chants & Divine Vocals",
    description: "Monastic vocal unisons, soaring polyphonic organum, melismatic liturgies, and sacred breathing disciplines."
  },
  {
    id: "caribbean-aboriginal",
    name: "Caribbean & Aboriginal Grooves",
    description: "Laidback Caribbean offbeat skanks, Soca, and Calypso alongside ancient Aboriginal clapstick beats and Didgeridoo drones."
  }
];

export const GROOVE_MAPPINGS: Record<string, string> = {
  "Euro-Bounce": "electronic",
  "Synth-Pop": "electronic",
  "4-on-the-Floor": "electronic",
  "Techno": "electronic",
  "Industrial": "electronic",
  "Hyperpop": "electronic",
  "Glitch-Core": "electronic",
  "Polyphonic Ringtone Chime": "electronic",
  "Chillwave Sunset": "electronic",
  "Liquid Drum & Bass Roll": "electronic",
  "Krautrock Motorik Beat": "electronic",
  "Future Bass Pluck": "electronic",
  "Vaporwave Chill": "electronic",
  "Glitch Hop Glitchiness": "electronic",
  "Space Disco Arpeggiator": "electronic",
  "IDM Complex Glitches": "electronic",
  "8-Bit Retro Chiptune": "electronic",
  "Acid House TB-303 Acidline": "electronic",

  "Cyberpunk Grid Rhythm": "robotic-synthwave",
  "Mecha-Beats Quantized Syncopation": "robotic-synthwave",
  "Retro Synthwave Outrun Bass": "robotic-synthwave",
  "Binary Coding Digital Click": "robotic-synthwave",
  "80s Vocoder Robotic Sweep": "robotic-synthwave",
  "Android Heartbeat Pulsation": "robotic-synthwave",

  "Seraphic Celestial Choir": "angelic-demonic",
  "Ascending Heavenly Arpeggio": "angelic-demonic",
  "Ethereal Cherub Chimes": "angelic-demonic",
  "Angelic Harp Glissando": "angelic-demonic",
  "Abyssal Growling Sub-bass": "angelic-demonic",
  "Demonic Guttural Pulse": "angelic-demonic",
  "Satanic Chthonic Drone": "angelic-demonic",
  "Hades Firestorm Blastbeat": "angelic-demonic",

  "Galloping Outlaw Beat": "cowboy-western",
  "Ennio Morricone Whispering Wind": "cowboy-western",
  "Campfire Acoustic Pluck": "cowboy-western",
  "Saloon Honky-Tonk Swing": "cowboy-western",
  "Spur Clink & Whip Crack Percussion": "cowboy-western",
  "Howling Coyote Slide Guitar": "cowboy-western",
  "Gringo Train Chug": "cowboy-western",
  "Sheriff's High-Noon Standoff": "cowboy-western",

  "Velvet Slow-Jam Pulse": "romantic-sensual",
  "Sweeping Cello Serenade": "romantic-sensual",
  "Late-Night Saxophone Swell": "romantic-sensual",
  "Whispering Bedroom Arpeggio": "romantic-sensual",
  "Passionate Heartbeat Kick": "romantic-sensual",
  "Seductive Slap-Bass Glide": "romantic-sensual",
  "Warm Candlelight Tremolo": "romantic-sensual",
  "Erotic Midnight Shimmer": "romantic-sensual",

  "Monasterial Unison Drone": "gregorian-chant",
  "Sustained Byzantine Isokratima": "gregorian-chant",
  "Vesper Polyphonic Organum": "gregorian-chant",
  "Melismatic Benedictine Harmony": "gregorian-chant",
  "Solfeggio Frequency Resonance": "gregorian-chant",
  "Tibetan Deep Throat Chant": "gregorian-chant",
  "Sanskrit Sacred Mantra Sloka": "gregorian-chant",

  "Caribbean Soca Bassline": "caribbean-aboriginal",
  "Roots Reggae One-Drop Beat": "caribbean-aboriginal",
  "Calypso Steelpan Syncopation": "caribbean-aboriginal",
  "Mento Rhumba Box Thump": "caribbean-aboriginal",
  "Ska Offbeat Guitar Skank": "caribbean-aboriginal",
  "Didgeridoo Circular Breathing Drone": "caribbean-aboriginal",
  "Aboriginal Clapstick Rhythm": "caribbean-aboriginal",
  "Yawkyawk Spirit Song Chant": "caribbean-aboriginal",
  "Mimi Spirit Corroboree Beat": "caribbean-aboriginal",

  "6/8 Tarantella": "folk-world",
  "Folk Jig": "folk-world",
  "Acoustic Folk": "folk-world",
  "Organic": "folk-world",
  "Ancient Sistrum Rattle": "folk-world",
  "Afrobeat Polyrhythms": "folk-world",
  "Celtic Folk Harp": "folk-world",
  "Flamenco Rasgueado Flourish": "folk-world",
  "Bluegrass Banjo Roll": "folk-world",
  "Tribal Trance Hand Drums": "folk-world",
  "Indie Folk Mandolin Roll": "folk-world",
  "Samba Batucada Percussion": "folk-world",
  "Gregorian Polyphonic Chant": "folk-world",

  "Gothic Rock": "rock-indie",
  "Darkwave": "rock-indie",
  "Shoegaze Distortion": "rock-indie",
  "Psychedelic Rock Swirl": "rock-indie",
  "Post-Punk Driving Bass": "rock-indie",
  "Surf Rock Spring Reverb": "rock-indie",
  "Heavy Metal Chugging Riffs": "rock-indie",
  "Dream-Pop Reverb Guitar": "rock-indie",

  "Heavy Metal Blastbeats": "metal-gothic",
  "Gothic Cathedral Choir": "metal-gothic",
  "Doom Metal Heavy Plod": "metal-gothic",
  "Post-Metal Dark Atmosphere": "metal-gothic",
  "Neoclassical Organ Swell": "metal-gothic",
  "Black Metal Tremolo Riff": "metal-gothic",

  "Chillhop Boom-Bap": "lo-fi-ambient",
  "Vaporwave Sunrise": "lo-fi-ambient",
  "Deep Space Ambient Synth": "lo-fi-ambient",
  "Ambient Drip Delay": "lo-fi-ambient",
  "Lullaby Glockenspiel": "lo-fi-ambient",
  "Ethereal Cloud Pad": "lo-fi-ambient",

  "Acid-Jazz": "jazz-soul",
  "Sophisti-Pop": "jazz-soul",
  "Trap": "jazz-soul",
  "Boom-Bap": "jazz-soul",
  "Hip-Hop": "jazz-soul",
  "Neo-Soul Shimmer": "jazz-soul",
  "Trip-Hop Downbeat": "jazz-soul",
  "Electro-Swing Brass": "jazz-soul",
  "Reggae Roots Dubwise": "jazz-soul",
  "Yacht Rock Glide": "jazz-soul",
  "Funk Wah-Wah Scratch Guitar": "jazz-soul",
  "Dub Siren Echo Feedback": "jazz-soul",

  "Symphonic": "classical-orchestral",
  "Operatic Strings": "classical-orchestral",
  "Cinematic Orchestral Brass": "classical-orchestral",
  "Baroque Chamber Harpsichord": "classical-orchestral",
  "Spaghetti Western Whistle": "classical-orchestral",
  "Dark Ambient Drone": "classical-orchestral",

  "Melodramatic": "vocal-tempo",
  "High-Stakes": "vocal-tempo",
  "Laid-back": "vocal-tempo",
  "Conversational": "vocal-tempo",
  "Rapid-fire": "vocal-tempo",
  "Staccato": "vocal-tempo",
  "Ethereal": "vocal-tempo",
  "Chanting": "vocal-tempo",
  "Spoken-Word": "vocal-tempo",
  "Deadpan Outro": "vocal-tempo",
  "Lo-Fi Lullaby Vinyl Crackle": "vocal-tempo",

  "Chao Gong Clash": "loud-drums-gongs",
  "Taiko Drum Ensemble": "loud-drums-gongs",
  "Thunderous Orchestral Bass Drum": "loud-drums-gongs",
  "Explosive Snare Rimshot": "loud-drums-gongs",
  "Chinese Lion Dance Drum": "loud-drums-gongs",
  "Ceremonial Wind Gong Shimmer": "loud-drums-gongs",
  "Heavy Industrial Piston Slams": "loud-drums-gongs",
  "Massive Timpani Roll & Strike": "loud-drums-gongs",
  "Samba Surdo Thunder Beats": "loud-drums-gongs",
  "Militaristic Field Snare": "loud-drums-gongs",
  "Anvil Hammer Strikes": "loud-drums-gongs",
  "Symphonic Gong Swell": "loud-drums-gongs",
  "Aggressive Metal Double-Lick": "loud-drums-gongs",
  "Brazilian Batucada Surdo Accent": "loud-drums-gongs",
  "Heavy Marching Quad Drums": "loud-drums-gongs",
  "Tribal War Drums Polyrhythm": "loud-drums-gongs"
};

export function getGroupedAndSortedGrooves(): Record<string, string[]> {
  const grouped: Record<string, string[]> = {};
  
  // Initialize groupings
  GROOVE_CATEGORIES.forEach(cat => {
    grouped[cat.id] = [];
  });

  // Assign and sort
  Object.entries(GROOVE_MAPPINGS).forEach(([groove, categoryId]) => {
    if (grouped[categoryId]) {
      grouped[categoryId].push(groove);
    }
  });

  // Sort each group alphabetically
  Object.keys(grouped).forEach(catId => {
    grouped[catId].sort((a, b) => a.localeCompare(b));
  });

  return grouped;
}
