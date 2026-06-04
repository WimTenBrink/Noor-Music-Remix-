export interface SoundEffect {
  name: string;
  description: string;
}

export interface SoundEffectGroup {
  type: string;
  effects: SoundEffect[];
}

export const SOUND_EFFECTS: SoundEffectGroup[] = [
  {
    type: "Explosions & Impacts",
    effects: [
      { name: "Explosion", description: "Loud, ground-shaking fireblast rumble and shockwave." },
      { name: "Cannon Fire", description: "Heavy gun-powder explosion and projectile blast." },
      { name: "Glass Shattering", description: "Sharp, high-frequency crystal breaks and shards falling." },
      { name: "Thunder Crack", description: "Dramatic lightning strike and deafening sonic boom." }
    ]
  },
  {
    type: "Animal Sounds",
    effects: [
      { name: "Coyote Howl", description: "Lonely wild predator howling at the full moon." },
      { name: "Dog Bark", description: "Rhythmic warning barks of a guard dog." },
      { name: "Cat Purr", description: "Deep, soothing local vibration of a relaxed feline." },
      { name: "Horse Gallop", description: "Steady galloping horse hooves hitting dusty trail." },
      { name: "Owl Hoot", description: "Eerie nocturnal bird calls echoing through dark woods." },
      { name: "Lion Roar", description: "Deep, terrifying territorial rumble of the king of beasts." }
    ]
  },
  {
    type: "Machinery & Industrial",
    effects: [
      { name: "Steam Engine Chug", description: "Puffing and rhythmic wheel-clanks of a moving train locomotive." },
      { name: "Gear Grind", description: "Harsh heavy friction noise of rotating rusted gears." },
      { name: "Siren Echo", description: "Spinning emergency alarm horn sounding in the distance." },
      { name: "Factory Hum", description: "Persistent heavy electrical and pneumatic machine room hum." },
      { name: "Piston Slam", description: "Deep automated hydraulic metal punches hitting plates." }
    ]
  },
  {
    type: "Digital & Retro",
    effects: [
      { name: "Computer Beeps", description: "Classic retro terminal beep signals and digital parsing blips." },
      { name: "Dial-up Modem", description: "Nostalgic 90s handshaking screech, hiss, and telephone noises." },
      { name: "Glitch Chirp", description: "Extremely quick bit-crushed system errors and static bursts." },
      { name: "8-bit Ringtone", description: "Chippy, arcade-like synthesized melodic phone ring loop." },
      { name: "Alarm Chime", description: "Steady, high-priority pulsing warning radar sound." }
    ]
  },
  {
    type: "Nature & Ambient",
    effects: [
      { name: "Pouring Rain", description: "Dense, soothing rain shower falling on the ground." },
      { name: "Whistling Wind", description: "Haunting cold breeze sweeping through mountains and canyons." },
      { name: "Crackling Campfire", description: "Pleasant snapping and popping of burning dry twigs." },
      { name: "Ocean Waves", description: "Slow, repetitive breakers splashing against a beach coastline." }
    ]
  }
];
