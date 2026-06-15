export interface NationalityCulture {
  id: string;
  name: string;
  flag: string;
  description: string;
  accentImpact: string;
  instrumentImpact: string;
  defaultInstruments: string[];
  continent: string;
}

export const NATIONALITIES: NationalityCulture[] = [
  // --- EUROPE ---
  {
    id: 'french',
    name: 'French',
    flag: '🇫🇷',
    continent: 'Europe',
    description: 'Chanson-style romantic air, soft nasal vowels, breathing and poetic pauses.',
    accentImpact: 'breathy chanson-style romantic vocal delivery, uvular "r" articulations, nasal vowels, poetic pauses, and delicate speech cadence.',
    instrumentImpact: 'musette accordion, acoustic gypsy guitar, and classic grand piano chords.',
    defaultInstruments: ['musette accordion', 'grand piano']
  },
  {
    id: 'dutch',
    name: 'Dutch',
    flag: '🇳🇱',
    continent: 'Europe',
    description: 'Polder-chanson or cozy Nederpop, hard consonant boundaries, warm local intimacy.',
    accentImpact: 'warm local intimacy, hard consonant boundaries, rolled vocal endings, friendly storytelling cadence.',
    instrumentImpact: 'draaiorgel mechanical organ, parlor piano, or cozy woodwind backing.',
    defaultInstruments: ['draaiorgel', 'parlor piano']
  },
  {
    id: 'scottish',
    name: 'Scottish',
    flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
    continent: 'Europe',
    description: 'Gaelic ornamentation, heavy rolled trills, drone vocal support.',
    accentImpact: 'Hebridean Gaelic vocal decorations, trilled consonants, strong alveolar "r", microtonal slides and ornamentation.',
    instrumentImpact: 'Great Highland bagpipes, Celtic harp (clàrsach), and traditional bodhrán frame drums.',
    defaultInstruments: ['great highland bagpipes', 'celtic harp']
  },
  {
    id: 'swedish',
    name: 'Swedish',
    flag: '🇸🇪',
    continent: 'Europe',
    description: 'Sing-song melodic tone, Scandinavian folk runs, cool spaciousness.',
    accentImpact: 'melodic Scandinavian pitch accent, crisp pronunciation, airy spacious vocal coloring, cool clean overtones.',
    instrumentImpact: 'Nyckelharpa (keyed fiddle), birch trumpet, and acoustic mandolin.',
    defaultInstruments: ['nyckelharpa', 'mandolin']
  },
  {
    id: 'italian',
    name: 'Italian',
    flag: '🇮🇹',
    continent: 'Europe',
    description: 'Operatic vibrato, lyric drama, open bright vowels, theatrical projection.',
    accentImpact: 'operatic throat vibrato, passionate chest-voice, rolling theatrical speech, open sunny vowel placement (bel canto).',
    instrumentImpact: 'Neapolitan mandolin, grand violin, and dramatic pipe organ.',
    defaultInstruments: ['neapolitan mandolin', 'violin']
  },
  {
    id: 'bulgarian',
    name: 'Bulgarian',
    flag: '🇧🇬',
    continent: 'Europe',
    description: 'Orthodox chorale, chest-forcing open choir style, asymmetric rhythms.',
    accentImpact: 'non-tempered folk runs, powerful throat projection, resonant close-harmony vocal friction, sliding glissandi.',
    instrumentImpact: 'Gadulka bowed lute, Gaida bagpipe, and Tapan bass drum.',
    defaultInstruments: ['gadulka', 'gaida']
  },
  {
    id: 'spanish',
    name: 'Spanish',
    flag: '🇪🇸',
    continent: 'Europe',
    description: 'Flamenco-style microtonal vocal weeping (quejío), passionate syncopations.',
    accentImpact: 'intense throat weeping/melisma, crisp dental stops, rhythmic foot-tapping syncopation guides, breathy pauses.',
    instrumentImpact: 'Flamenco acoustic guitar tap, castanets, and dramatic dynamic handclaps (palmas).',
    defaultInstruments: ['flamenco guitar', 'castanets']
  },
  {
    id: 'irish',
    name: 'Irish',
    flag: '🇮🇪',
    continent: 'Europe',
    description: 'Lilt-infused storytelling voice, soft dental consonants, rapid micro-melismatic folk loops.',
    accentImpact: 'sing-song Irish lilt with high rising terminals, soft aspirated "t/d" consonants, rapid micro-ornamented vocals.',
    instrumentImpact: 'Irish tin whistle, Uilleann bagpipes, and wooden concert flute.',
    defaultInstruments: ['tin whistle', 'uilleann pipes']
  },
  {
    id: 'german',
    name: 'German',
    flag: '🇩🇪',
    continent: 'Europe',
    description: 'Kabarett precision or alpine yodeling intervals, crisp glottal stops, deeply enunciated consonants.',
    accentImpact: 'precise theatrical cabaret delivery, sharp glottal attacks (Knacklaut), fully rolled or voiced gutteral markers.',
    instrumentImpact: 'wooden alpine zither, modern concertina, or double-bass pizzicato backing.',
    defaultInstruments: ['concertina', 'zither']
  },
  {
    id: 'greek',
    name: 'Greek',
    flag: '🇬🇷',
    continent: 'Europe',
    description: 'Laiko-inspired deep chest lament, microtonal vocal shifts, passionate breath control.',
    accentImpact: 'Laiko chest-tone projection, dentalised "t/d", heavy emotional melismas, open throated expressive vowel styling.',
    instrumentImpact: 'metallic Bouzouki trills, baglamas plucks, and classic ceramic toumbeleki drumbeats.',
    defaultInstruments: ['bouzouki', 'toumbeleki']
  },
  {
    id: 'ukrainian',
    name: 'Ukrainian',
    flag: '🇺🇦',
    continent: 'Europe',
    description: 'Melancholy Cossack vibrato, rich open-throat folk resonance, fluid legato styling.',
    accentImpact: 'deep warm vowels, highly resonant folk vibrato, emotional minor-scale slides, elegant breathing paces.',
    instrumentImpact: 'multi-string Bandura plucks, Sopilka wooden flute, and dynamic husli sweeps.',
    defaultInstruments: ['bandura', 'sopilka']
  },

  // --- ASIA ---
  {
    id: 'japanese',
    name: 'Japanese',
    flag: '🇯🇵',
    continent: 'Asia',
    description: 'Traditional Gagaku or modern Enka tones, pentatonic interval shifts, clean clear vowels.',
    accentImpact: 'clean monophonic vowel alignments, gentle pitch-bending ornamentations, Enka-style expressive vibrato, pentatonic scale jumps.',
    instrumentImpact: 'Koto strings, Shamisen plucks, and Shakuhachi bamboo flute breaths.',
    defaultInstruments: ['koto', 'shamisen', 'shakuhachi']
  },
  {
    id: 'chinese',
    name: 'Chinese',
    flag: '🇨🇳',
    continent: 'Asia',
    description: 'Traditional Peking opera falsetto techniques, high-pitched vocal slides, tonal pitch inflections.',
    accentImpact: 'high-register nasal head tone, stylized slide transitions, dynamic tone-based syllable focus.',
    instrumentImpact: 'Erhu bowed fiddle, Guzheng plucked zither, and high-pitched Pipa plucks.',
    defaultInstruments: ['erhu', 'guzheng']
  },
  {
    id: 'indian',
    name: 'Indian',
    flag: '🇮🇳',
    continent: 'Asia',
    description: 'Classical Hindustani / Carnatic raga glides, rapid sargam runs, complex slide pitch patterns (meend).',
    accentImpact: 'complex microtonal pitch bends, rapid raga vocal improvisations, heavy syllabic rhythmic speech ties.',
    instrumentImpact: 'Sitars, drone-inducing Tanpura strings, and classical tabla hand percussion patterns.',
    defaultInstruments: ['sitar', 'tabla']
  },
  {
    id: 'korean',
    name: 'Korean',
    flag: '🇰🇷',
    continent: 'Asia',
    description: 'Pansori epic emotional grit, huskiness, chest-thumping vibrato, passionate weeping tone.',
    accentImpact: 'gritty gut-level vocal projection, breathy husky breaks, deep theatrical weeping vibrato (seong-eum).',
    instrumentImpact: 'Gayageum 12-string zither, Haegeum bowed fiddle, and Buk barrel drum.',
    defaultInstruments: ['gayageum', 'buk']
  },
  {
    id: 'thai',
    name: 'Thai',
    flag: '🇹🇭',
    continent: 'Asia',
    description: 'Molam-style nasal drone, fluid sliding vocal delivery, soft glottal closures.',
    accentImpact: 'syncopated speech rises, delicate nasal overtones, sliding tonal phrasing, soft micro-articulated endings.',
    instrumentImpact: 'Khaen bamboo mouth organ, Phin folk lute, and Saw duang fiddle.',
    defaultInstruments: ['khaen', 'phin']
  },
  {
    id: 'turkish',
    name: 'Turkish',
    flag: '🇹🇷',
    continent: 'Asia',
    description: 'Ottoman classical vocal flourishes, complex microtonal makam structures, deep throated runs.',
    accentImpact: 'makam microtonal pitch-bending flourishes, rich throated guttural glides, romantic melismatic sighs.',
    instrumentImpact: 'Oud lute, Saz string plucks, and ceramic Darbuka rhythms.',
    defaultInstruments: ['oud', 'saz', 'darbuka']
  },
  {
    id: 'persian',
    name: 'Persian',
    flag: '🇮🇷',
    continent: 'Asia',
    description: 'Avaz-style melismatic throat trills, ornamentations (tahrir), rich poetic phrasing.',
    accentImpact: 'highly complex tahrir vocal trills (yodeling-like patterns), deep breathy poetic phrasing, minor key alignments.',
    instrumentImpact: 'Tar plucked lute, Santur hammered dulcimer, and Tombak drum steps.',
    defaultInstruments: ['santur', 'tar']
  },
  {
    id: 'indonesian',
    name: 'Indonesian',
    flag: '🇮🇩',
    continent: 'Asia',
    description: 'Sundanese or Javanese gamelan microtonal vocal glides, gentle rhythmic phrasing.',
    accentImpact: 'fluid micro-tonate gamelan style vocal glides, rhythmic speech pacing, balanced soft nasal tones.',
    instrumentImpact: 'Suling bamboo flutes, Bonang bronze kettles, or traditional West Javanese Angklungs.',
    defaultInstruments: ['suling', 'angklung']
  },

  // --- AMERICAS ---
  {
    id: 'canadian',
    name: 'Canadian',
    flag: '🇨🇦',
    continent: 'Americas',
    description: 'Bilingual Canadian folk elements, friendly open vowels, polite and bright inflections.',
    accentImpact: 'friendly open vowels, crisp consonant stops, occasional polite "eh" rhythmic prompts, French-Canadian Acadian lyric pacing.',
    instrumentImpact: 'traditional Cape Breton fiddle, parlor accordion, and acoustic folk guitar strums.',
    defaultInstruments: ['cape breton fiddle', 'acoustic folk guitar']
  },
  {
    id: 'american',
    name: 'American (USA)',
    flag: '🇺🇸',
    continent: 'Americas',
    description: 'Appalachian high-lonesome twang, southern drawl, blues-infused vocal slides.',
    accentImpact: 'Appalachian high-lonesome twang, southern rolled drawls, relaxed R&B blues slides, or raw alt-rock grit.',
    instrumentImpact: 'five-string banjo, dobro slide guitar, or acoustic flat-top guitar.',
    defaultInstruments: ['banjo', 'dobro']
  },
  {
    id: 'mexican',
    name: 'Mexican',
    flag: '🇲🇽',
    continent: 'Americas',
    description: 'Mariachi-style theatrical vibrato, heroic dynamic shouts, bright belting chest tones.',
    accentImpact: 'theatrical belting, long heroic sustained notes with wide warm vibrato, joyful mariachi counter-shouts (gritos).',
    instrumentImpact: 'Vihuela rhythm strums, Guitarrón bass plucks, and trumpet fanfares.',
    defaultInstruments: ['vihuela', 'guitarron']
  },
  {
    id: 'brazilian',
    name: 'Brazilian',
    flag: '🇧🇷',
    continent: 'Americas',
    description: 'Bossa Nova whisper, soft syncopated swing, smooth nasal warmth.',
    accentImpact: 'whispery bossa-nova vocal intimacy, syncopated soft swing, smooth nasal vowels, relaxed laid-back vocal pocket.',
    instrumentImpact: 'nylon-string acoustic guitar, pandeiro tambourine, and soft rhodes electric piano.',
    defaultInstruments: ['nylon acoustic guitar', 'pandeiro']
  },
  {
    id: 'argentine',
    name: 'Argentine',
    flag: '🇦🇷',
    continent: 'Americas',
    description: 'Tango dramatic syncopated pauses, passionate staccato vocal delivery, deep nostalgia.',
    accentImpact: 'intense staccato storytelling, dramatic pauses with heavy suspends, sibilant Spanish accents, heavy low-register chest notes.',
    instrumentImpact: 'classic Bandoneon accordion, nylon tango guitar, and dark upright double-bass.',
    defaultInstruments: ['bandoneon', 'nylon tango guitar']
  },
  {
    id: 'jamaican',
    name: 'Jamaican',
    flag: '🇯🇲',
    continent: 'Americas',
    description: 'Reggae Patois syncopated off-beat chanting, triplet vocal pockets, warm rhythmic flow.',
    accentImpact: 'rhythmic syncopated on-and-off beat Patois delivery, bouncing triplets, relaxed off-beat melodic grooves.',
    instrumentImpact: 'deep electric basslines, scratching rhythm guitars, and off-beat organ bubbles.',
    defaultInstruments: ['reggae bass', 'rhythm guitar']
  },
  {
    id: 'peruvian',
    name: 'Peruvian',
    flag: '🇵🇪',
    continent: 'Americas',
    description: 'High Andean mountain heights, whistling vocal ornaments, crisp Afro-Peruvian cajon pulse.',
    accentImpact: 'high head-voice intervals with delicate fluttering accents, syncopated Afro-Peruvian spacing.',
    instrumentImpact: 'Antara panflutes, Charango high-pitched strumming, and a wooden Cajon box beat.',
    defaultInstruments: ['charango', 'panflute', 'cajon']
  },
  {
    id: 'colombian',
    name: 'Colombian',
    flag: '🇨🇴',
    continent: 'Americas',
    description: 'Cumbia syncopated dance swings, bright joyful vocal slides, coastal African-Indigenous pulse.',
    accentImpact: 'highly upbeat syncopated delivery, dynamic coastal accents, call-and-response vocal energy.',
    instrumentImpact: 'Gaita flutes, traditional Allegre drums, and maracon shakers.',
    defaultInstruments: ['gaita flute', 'alegre drum']
  },

  // --- AFRICA ---
  {
    id: 'nigerian',
    name: 'Nigerian',
    flag: '🇳🇬',
    continent: 'Africa',
    description: 'Afrobeats polyrhythmic grooves, syncopated call-and-response, rich tonal phrasing.',
    accentImpact: 'tonal Pidgin-infused vocal spacing, dynamic polyrhythmic syncopations, warm call-and-response chants.',
    instrumentImpact: 'talking drum pitch bending, highlife jazz guitar licks, and bright brass stabs.',
    defaultInstruments: ['talking drum', 'highlife guitar']
  },
  {
    id: 'egyptian',
    name: 'Egyptian',
    flag: '🇪🇬',
    continent: 'Africa',
    description: 'Tarab orchestral heights, quarter-tone vocal weeping, grand cinematic phrasing.',
    accentImpact: 'classical Tarab ecstatic melisma, quarter-tone microtonality, breathy epic sighs, operatic poetic delivery.',
    instrumentImpact: 'Oud lute, Qanun zither, and classical violin orchestrations.',
    defaultInstruments: ['qanun', 'oud']
  },
  {
    id: 'southafrican',
    name: 'South African',
    flag: '🇿🇦',
    continent: 'Africa',
    description: 'Isicathamiya close harmonies, dynamic deep Zulu bass clicks, rich choral blends.',
    accentImpact: 'soft Zulu clicks, powerful rich deep harmonies, bouncing step rhythms, soft soaring leads.',
    instrumentImpact: 'deep acoustic bass, handclaps, or traditional acoustic folk guitars.',
    defaultInstruments: ['acoustic bass', 'handclaps']
  },
  {
    id: 'ethiopian',
    name: 'Ethiopian',
    flag: '🇪🇹',
    continent: 'Africa',
    description: 'Tizita pentatonic scale nostalgic singing, micro-tonal vibratos, throat-fluttering ornaments.',
    accentImpact: 'Ethiopian pentatonic scale interval jumps, highly nostalgic "Tizita" slides, micro-tonal throat flutterings.',
    instrumentImpact: 'Kraar lyre plucks, Masenqo single-string lute, and Kebero drums.',
    defaultInstruments: ['kraar', 'masenqo']
  },
  {
    id: 'moroccan',
    name: 'Moroccan',
    flag: '🇲🇦',
    continent: 'Africa',
    description: 'Gnawa rhythmic trances, metallic iron castanets, driving low register chanting.',
    accentImpact: 'Gnawa repetitive deep spiritual chanting, driving low-register vocal responses, rhythmic breathing breaks.',
    instrumentImpact: 'three-string Guembri (Sintir) bass-lute and heavy iron Qraqeb castanets.',
    defaultInstruments: ['guembri', 'qraqeb']
  },
  {
    id: 'malian',
    name: 'Malian',
    flag: '🇲🇱',
    continent: 'Africa',
    description: 'Epic Griot praise-song styles, cascading 21-string harp runs, soaring pentatonic peaks.',
    accentImpact: 'soaring theatrical Griot storytelling, wide interval rises, cascading poetic scales.',
    instrumentImpact: 'Kora harp plucks, wooden Balafon xylophone, and Ngoni lutes.',
    defaultInstruments: ['kora', 'balafon']
  },
  {
    id: 'kenyan',
    name: 'Kenyan',
    flag: '🇰🇪',
    continent: 'Africa',
    description: 'Benga fingerstyle rhythms, upbeat Swahili patterns, clear soaring folk vocals.',
    accentImpact: 'bouncy melodic vocal hops, highly articulate Swahili consonant alignments, cheerful harmony call and response.',
    instrumentImpact: 'traditional Benga acoustic guitars, Nyatiti lyres, and shaker syncopations.',
    defaultInstruments: ['nyatiti', 'acoustic benga guitar']
  },
  {
    id: 'congolese',
    name: 'Congolese',
    flag: '🇨🇩',
    continent: 'Africa',
    description: 'Soukous-style high tenor harmonies, energetic sebene guitar cues, smooth rumba voices.',
    accentImpact: 'high sweet tenor rumba harmonies, rapid vocal animations (atalaku yells), smooth rolling French-influenced phonetics.',
    instrumentImpact: 'rapid electric guitar arpeggios (sebene), smooth rhythm acoustic strums, and congas.',
    defaultInstruments: ['electric sebene guitar', 'congas']
  },

  // --- OCEANIA ---
  {
    id: 'australian',
    name: 'Australian',
    flag: '🇦🇺',
    continent: 'Oceania',
    description: 'Aboriginal drone backings or modern surf-folk warmth, flat open vowels, speechy storytelling.',
    accentImpact: 'flat-fronted open vowels, modern relaxed speechy pacing, rhythmic speech-singing storytelling loops.',
    instrumentImpact: 'Didgeridoo drone breaths, clapsticks (bilma), or woody acoustic sliding guitars.',
    defaultInstruments: ['didgeridoo', 'clapsticks']
  },
  {
    id: 'newzealand',
    name: 'New Zealander (Māori)',
    flag: '🇳🇿',
    continent: 'Oceania',
    description: 'Māori Waiata choral chants, guttural Haka chest thrusts, soft sliding harmonies.',
    accentImpact: 'guttural and powerful rhythmic Haka chest thrusts, beautiful close Waiata vocal harmonies with rolling sliding vowel transitions.',
    instrumentImpact: 'Koauau bone flute, Purerehua humming wind indicators, or acoustic chordal backings.',
    defaultInstruments: ['koauau', 'acoustic guitar']
  },
  {
    id: 'fijian',
    name: 'Fijian',
    flag: '🇫🇯',
    continent: 'Oceania',
    description: 'Lali bamboo drum beats, upbeat polyphonic multi-voice island slurs, open warm vocals.',
    accentImpact: 'polyphonic multi-voice group responses, wide sliding warm island vowels, friendly storytelling.',
    instrumentImpact: 'Lali log drums, ukulele rolls, and soft nylon-string acoustic guitars.',
    defaultInstruments: ['lali drums', 'ukulele']
  },
  {
    id: 'samoan',
    name: 'Samoan',
    flag: '🇼🇸',
    continent: 'Oceania',
    description: 'Siva-inspired polyphonic choral heights, dynamic syncopated body percussion, rich layered harmonies.',
    accentImpact: 'deeply layered rich physical choir chants, syncopated vocal breaks, warm vowel extensions.',
    instrumentImpact: 'slit wooden drums (pate), ukulele rolls, and dynamic handclapping (pati) guides.',
    defaultInstruments: ['pate drum', 'ukulele']
  },
  {
    id: 'hawaiian',
    name: 'Hawaiian',
    flag: '🌺',
    continent: 'Oceania',
    description: 'Mele chant glottal breaks (i\'i), sliding falsetto shifts (leo ki\'eki\'e), sweet breezy vibe.',
    accentImpact: 'breezy falsetto vocal leaps, traditional Mele glottal throat vibrato, long relaxed beach vowels.',
    instrumentImpact: 'ukulele strums, acoustic steel lap-guitars, and Ipuhke gourd drums.',
    defaultInstruments: ['ukulele', 'lap steel guitar']
  }
];

export function findNationalityById(id: string): NationalityCulture | undefined {
  return NATIONALITIES.find(n => n.id === id);
}
