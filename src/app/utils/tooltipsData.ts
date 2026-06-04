import { LANGUAGE_GROUPS } from './languages';

export const DIALECT_TOOLTIPS: Record<string, string> = {
  // English Dialects
  'en-GB': 'Most popular in the United Kingdom, London, and standard British broadcast media.',
  'en-US': 'Most popular in the United States, Hollywood, and global American-led workspaces.',
  'en-IE': 'Most popular in the Republic of Ireland, Dublin, and coastal western counties.',
  'en-CA': 'Most popular across Canada, marrying British orthography and American phonetics.',
  'en-AU': 'Most popular in Australia, Sydney, Melbourne, and the vast Australian Outback.',
  'en-NZ': 'Most popular in New Zealand, Auckland, Christchurch, and Southern Polynesian circles.',
  'en-ZA': 'Most popular in South Africa, Cape Town, Johannesburg, and regional bilingual zones.',
  'en-SCO': 'Most popular across Scotland, the Highlands, Edinburgh, and Glasgow.',
  'en-IN': 'Most popular in India, Mumbai, Delhi, and the widespread South Asian diaspora.',
  'en-BB': 'Most popular in Barbados and the Lesser Antilles island chain.',
  'en-JM': 'Most popular in Jamaica, Kingston, and global reggae/dancehall music spaces.',
  'en-TT': 'Most popular in Trinidad & Tobago, southern Caribbean, and Soca carnivals.',
  'en-NL': 'Most popular in the Netherlands among Dutch scholars and tech-workplaces.',
  'en-SG': 'Most popular in Singapore, Hawker centers, and local colloquial urban centers.',
  'en-NG': 'Most popular in Nigeria, Lagos, Abuja, and West African pop music circles.',
  'en-WAL': 'Most popular across Wales, Cardiff, Swansea, and valleys with choral traditions.',

  // Dutch Group
  'nl-NL': 'Most popular across the Netherlands, Amsterdam, rotterdam, and Utrecht.',
  'nl-BE': 'Most popular in Flanders (Northern Belgium), Antwerp, Ghent, and Bruges.',
  'nl-SR': 'Most popular in Suriname, Paramaribo, and Surinamese communities in Europe.',

  // Frisian Group
  'fy-NL': 'Most popular in Friesland province (Fryslân), Northern Netherlands.',
  'frs-DE': 'Most popular in the Saterland municipality in Lower Saxony, Northwestern Germany.',
  'frr-DE': 'Most popular along the North Sea coastline and islands of Schleswig-Holstein, Germany.',

  // French Group
  'fr-FR': 'Most popular in European France, Paris, Lyon, and standard French media houses.',
  'fr-BE': 'Most popular in Wallonia (Southern Belgium), Brussels, and Liège.',
  'fr-CH': 'Most popular in Romandie (Western Switzerland), Geneva, and Lausanne.',
  'fr-CA': 'Most popular in Quebec, Montreal, and Francophone regions of Canada.',
  'fr-AF': 'Most popular in the DR Congo, Senegal, Ivory Coast, Cameroon, and global Afropop.',

  // German Group
  'de-DE': 'Most popular in Germany, Berlin, Frankfurt, and standard Central European media.',
  'de-AT': 'Most popular in Austria, Vienna, Salzburg, and mountainous Alpine valleys.',
  'de-CH': 'Most popular across Northern, Central, and Eastern Switzerland (Zürich, Bern).',
  'de-BY': 'Most popular in Bavaria, Munich, and neighbouring Alpine Austrian regions.',

  // Italian Group
  'it-IT': 'Most popular across Italy, Rome, Milan, and contemporary Italian vocal arts.',
  'it-TUS': 'Most popular in Tuscany, Florence, Siena, and historic literary academies.',
  'it-NAP': 'Most popular in Naples, Campania, and vibrant Southern Italian street theatres.',
  'it-SCN': 'Most popular on the island of Sicily, Palermo, and Mediterranean folklore.',
  'it-VEN': 'Most popular in Venice, Veneto region, and historic coastal canals.',

  // Spanish Group
  'es-ES': 'Most popular in European Spain, Madrid, Barcelona, and Iberian classical theatres.',
  'es-MX': 'Most popular in Mexico, Mexico City, and modern Latin pop / soap-opera media.',
  'es-AR': 'Most popular in Argentina, Buenos Aires, Uruguay, and tango lounges.',
  'es-CO': 'Most popular in Colombia, Bogotá, Medellín, and academic standard Spanish houses.',
  'es-CAR': 'Most popular in Cuba, Dominican Republic, Puerto Rico, and Caribbean salsa clubs.',

  // Portuguese Group
  'pt-BR': 'Most popular in Brazil, Rio de Janeiro, São Paulo, and bossa nova or samba circles.',
  'pt-PT': 'Most popular in European Portugal, Lisbon, Porto, and Fado music communities.',
  'pt-AO': 'Most popular in Angola, Luanda, and Southern African Portuguese-language hubs.',

  // Colonial European Group
  'af-ZA': 'Most popular in South Africa and Namibia, developed from 17th-century Cape Dutch with diverse loanwords.',
  'pap-CB': 'Most popular in Aruba, Bonaire, and Curaçao, blending Spanish, Portuguese, Dutch, and West African tongues.',
  'ht-HT': 'Most popular in Haiti, Port-au-Prince, and North American Haitian communities.',
  'lou-US': 'Most popular in southern Louisiana, New Orleans, and Acadiana parishes.',
  'cb-PH': 'Most popular in Zamboanga City, Philippines, mixing Spanish vocabulary with Austronesian grammar.',
  'kea-CV': 'Most popular across Cape Verde, Praia, Mindelo, and international Cape Verdean diasporas.',

  // Celtic Group
  'ga-IE': 'Most popular in Gaeltacht areas of Western Ireland, Galway, and Donegal.',
  'gd-GB': 'Most popular in the Outer Hebrides and Highlands of Scotland.',
  'cy-GB': 'Most popular in Gwynedd, Anglesey, and rural heartlands of Wales.',

  // Scandinavian Group
  'sv-SE': 'Most popular in Sweden, Stockholm, Gothenburg, and contemporary Nordic-pop labs.',
  'da-DK': 'Most popular in Denmark, Copenhagen, and Jutland peninsula.',
  'no-NO': 'Most popular across Norway, Oslo, Bergen, and coastal fjords.',
  'is-IS': 'Most popular in Iceland, Reykjavík, and academic North Germanic studies.',

  // Slavic Group
  'pl-PL': 'Most popular in Poland, Warsaw, Kraków, and Silesia.',
  'cs-CZ': 'Most popular in Czech Republic, Prague, and Bohemia.',
  'sk-SK': 'Most popular in Slovakia, Bratislava, and High Tatras.',
  'uk-UA': 'Most popular in Ukraine, Kyiv, Lviv, and Eastern European choral settings.',
  'ru-RU': 'Most popular in Russia, Moscow, St. Petersburg, and Central Asian states.',

  // Classical Group
  'la-CL': 'Most popular in worldwide classical universities, academic research, and Rome.',
  'la-EC': 'Most popular in Vatican City, Catholic cathedrals, and classical SATB choirs.',
  'grc-CL': 'Most popular in historical philosophy programs, academic circles, and ancient Athens.',
  'grc-BYZ': 'Most popular in Eastern Orthodox churches, Greece, and medieval Byzantine studies.',
  'el-GR': 'Most popular in modern Greece, Athens, Cyprus, and Greek diaspora communities.',

  // Ancient / Dead Group
  'cop-EG': 'Most popular in Egyptian Coptic churches, Cairo, and historic monastic libraries.',
  'sa-IN': 'Most popular in Indian ashrams, Sanskrit universities, and vedic recitations.',
  'sux-MES': 'Most popular in ancient Mesopotamian archaeological research and academic institutions.',
  'akk-MES': 'Most popular in global cuneiform classrooms and ancient Near Eastern studies.',
  'goh-DE': 'Most popular in medieval philology circles of Frankfurt and Munich.',
  'enm-GB': 'Most popular in Middle-English theatre projects and British university departments.',

  // Yiddish & Hebrew
  'yi-EU': 'Most popular in Hasidic neighborhoods of New York, Jerusalem, Antwerp, and Eastern Europe.',
  'he-IL': 'Most popular across Israel, Tel Aviv, Jerusalem, and modern Hebrew pop stations.',
  'hbo-IL': 'Most popular in religious seminaries, synagogues, and theological schools globally.',

  // Arabic & Farsi
  'ar-MS': 'Most popular in official government buildings, PAN-Arab news (Al Jazeera), and standard books.',
  'ar-EG': 'Most popular in Egypt, Cairo, and widely recognized across Arab films and pop songs.',
  'ar-LEV': 'Most popular in Lebanon, Syria, Jordan, and Palestine.',
  'ar-GLF': 'Most popular in the United Arab Emirates, Saudi Arabia, Qatar, and Gulf coastal states.',
  'fa-IR': 'Most popular in Iran (Tehran), Afghanistan (as Dari in Kabul), and Tajikistan (as Tajik).',

  // Asian Group
  'ja-JP': 'Most popular in Japan, Tokyo, Osaka, and global anime/J-pop networks.',
  'zh-CN': 'Most popular in mainland China (Beijing, Shanghai, Sichuan) and Taiwan.',
  'zh-HK': 'Most popular in Hong Kong, Macau, and global Cantonese diaspora channels.',
  'ko-KR': 'Most popular in South Korea, Seoul, and global K-pop/K-drama formats.',
  'vi-VN': 'Most popular in Vietnam, Hanoi, and Ho Chi Minh City.',
  'th-TH': 'Most popular in Thailand, Bangkok, and Southeast Asian pop circles.',
  'hi-IN': 'Most popular in Northern and Central India, and Bollywood cinema spaces.',

  // African Group
  'sw-KE': 'Most popular in Kenya, Tanzania, Uganda, Rwanda, and East African coastal grids.',
  'zu-ZA': 'Most popular in South Africa, KwaZulu-Natal, and historical Zulu communities.',
  'yo-NG': 'Most popular in Southwestern Nigeria, Oyo, Lagos, and Benin.',
  'am-ET': 'Most popular in Ethiopia, Addis Ababa, and historical horn of Africa.',
  'xh-ZA': 'Most popular in Eastern Cape (South Africa), and southern Bantu clinics.',

  // Native American Group
  'nv-US': 'Most popular in the Navajo Nation across Arizona, New Mexico, and Utah.',
  'chr-US': 'Most popular in the Cherokee Nation in Oklahoma and North Carolina hills.',
  'qu-PE': 'Most popular in the Andean highlands, Cusco, Peru, Bolivia, and Ecuador.',
  'nah-MX': 'Most popular in central Mexico, Puebla, and historical Aztec ruins.',

  // Australian & Māori
  'mi-NZ': 'Most popular in New Zealand (Aotearoa), Northland, and Māori cultural settings.',
  'pnt-AU': 'Most popular in central Australian desert communities and APY Lands.',
  'wri-AU': 'Most popular in Yuendumu, Lajamanu, and central Northern Territory of Australia.',
  'en-AUB': 'Most popular in Indigenous communities and rural outstations across Australia.',

  // Alien & Fantasy
  'tlh-KL': 'Most popular in sci-fi fan conventions, Qo\'noS, and speculative performance theatres.',
  'qya-EL': 'Most popular in Lothlórien, high elven roleplaying, and Tolkienist linguist libraries.',
  'sjn-EL': 'Most popular in Rivendell woodland camps and epic cinematic choral projects.',
  'dov-DR': 'Most popular on Skyrim peak monolyths and fantasy soundtrack soundstages.',
  'hvl-VAL': 'Most popular in Essos, King\'s Landing epic plays, and High Targaryen protocols.',
  'vul-VUL': 'Most popular on planet Vulcan science boards, and logical debate academies.',
  'dra-MY': 'Most popular in imaginary ancient dragon peak rituals and heavy fantasy scores.',
  'dem-MY': 'Most popular in infernal heavy metal music spaces and dramatic underworld audiobooks.',
  'ang-MY': 'Most popular in luminous ambient environments, cathedral-reverb hymns, and dreamscapes.',

  // Historical Cinematic English Accents
  'his-VIK': 'Most popular in epic Viking sagas, Norse longhouse chants, and dramatic historical dramas.',
  'his-ROM': 'Most popular in imperial Roman forums, historical gladiator epics, and classical military plays.',
  'his-GRK': 'Most popular in philosophical Athenian academies, ancient Greek tragedies, and epic poetry.',
  'his-EGY': 'Most popular in mystical desert temples, pharaonic tombs, and ceremonial solar hymns.',
  'his-SPA': 'Most popular on intense battlefronts, Spartan shield walls, and laconic martial recitations.',
  'his-CEL': 'Most popular in rolling pasturelands, Celtic stone circles, and druidic mystical ballads.'
};

export const LANGUAGE_GROUP_TOOLTIPS: Record<string, string> = {
  'english': 'English is widely spoken across North America, Europe, Oceania, Asia, and Africa.',
  'dutch': 'Dutch & Flemish are mostly spoken in the Netherlands, northern Belgium (Flanders), and Suriname.',
  'frisian': 'Frisian is popular in Friesland (Netherlands) and parts of Northwestern Germany.',
  'french': 'French is spoken extensively in France, Belgium, Switzerland, Canada, and Western/Central Africa.',
  'german': 'German is mainly spoken in Germany, Austria, Switzerland, and South Tyrol (Italy).',
  'italian': 'Italian is popular in Italy, San Marino, Switzerland, and Vatican City.',
  'spanish': 'Spanish is widely spoken throughout Spain, Latin America, and equatorial Guinea.',
  'portuguese': 'Portuguese is popular in Brazil, Portugal, Angola, Mozambique, and Cape Verde.',
  'colonial_european': 'Colonial European languages include dialects and hybrid creoles born from European colonization in Africa, Asia, and the Americas.',
  'celtic': 'Celtic languages survive in Ireland, Wales, Scotland, and maritime Brittany.',
  'scandinavian': 'Scandinavian Norse languages are spoken in Sweden, Norway, Denmark, and Iceland.',
  'slavic': 'Slavic languages are widely spoken across Eastern Europe, Central Europe, and Northern Asia.',
  'classical': 'Classical languages are used in historical recitations, research, and liturgical choral music.',
  'dead_languages': 'Ancient languages are used in historical epics, religious liturgies, and academic study.',
  'jiddish_and_semitic': 'Semitic tongues and Yiddish are centered in Israel, communities globally, and liturgical texts.',
  'arabic_and_persian': 'These beautiful Middle-Eastern tongues are spoken in North Africa, the Levant, and Central Asia.',
  'asian': 'Asian language groups are widely spoken across East Asia, South Asia, and Southeast Asia.',
  'african': 'African languages are popular across East, West, and Southern African regions.',
  'native_american': 'Indigenous tongues of the Navajo, Cherokee, Aztec, and Andean nations across the Americas.',
  'australian_and_maori': 'Sovereign languages spoken in New Zealand, and Indigenous regions of Central Australia.',
  'alien_and_fantasy': 'Constructed sci-fi and fantasy universes, tabletop campaigns, and creative musical scores.',
  'click_languages': 'Click languages use distinctive dental, lateral, palatal, and alveolar oral suction clicks.',
  'playful_languages': 'Amusing word riddles, coded slangs, and historical tongue-twisters for creative rhythm.',
  'historical_english_accents': 'Cinematic English dialects mimicking historical empires and ancient cultures for dramatic theme performances.'
};

export const RATING_TOOLTIPS: Record<string, string> = {
  'G': 'G (General Audience): Suitable for all ages. Content contains nothing offensive or inappropriate.',
  'PG': 'PG (Parental Guidance): Some material may not be suitable for children. Parents urged to give guidance.',
  'PG-13': 'PG-13 (Parents Strongly Cautioned): Some material may be inappropriate for children under 13.',
  'R': 'R (Restricted): Under 17 requires accompanying parent or adult guardian. Intense themes.',
  'NC-17': 'NC-17 (Clearly Adults Only): No one 17 and under admitted. Content is designed strictly for adults.'
};

export const GROOVE_TOOLTIPS: Record<string, { desc: string; vibe: string }> = {
  "Euro-Bounce": {
    desc: "High-tempo electronic club rhythm with driven, bouncy offbeat basslines.",
    vibe: "Clubbing Energy"
  },
  "Synth-Pop": {
    desc: "Melodic pop rhythm heavily driven by retro polyphonic drum machine patterns and cascade synthesizers.",
    vibe: "80s Retro Glow"
  },
  "4-on-the-Floor": {
    desc: "A rock-solid, uniform 4/4 electronic kick drum beat resting on every cardinal downbeat.",
    vibe: "Consistent Dancefloor"
  },
  "Techno": {
    desc: "Hypnotic, repetitive electronic music built on minimalist modular loops and pounding kick tracks.",
    vibe: "Subterranean Warehouse"
  },
  "Industrial": {
    desc: "Abrasive, steel-forged rhythm using mechanical percussion, metallic collisions, and aggressive distortion.",
    vibe: "Dystopian Factory"
  },
  "Acid-Jazz": {
    desc: "Liquid fusion of hip-hop breakbeats, acid bass loops, and bright jazz-funk horn ornaments.",
    vibe: "Urban Lounge Chic"
  },
  "Sophisti-Pop": {
    desc: "Polished, smooth pop-soul featuring lush, meticulously crafted jazz instrumentation and acoustic piano.",
    vibe: "Late-Night Melancholy"
  },
  "Trap": {
    desc: "Low-end heavy 808 bass booms matched with razor-fast triple-time hi-hat arrays and clean synth brass.",
    vibe: "Sub-Heavy Streetwise"
  },
  "Boom-Bap": {
    desc: "The timeless gold standard of East Coast hip-hop with hard kick-snare patterns sampled from dusty vinyl.",
    vibe: "Raw Street Poetry"
  },
  "Hip-Hop": {
    desc: "Vibrant syncopated mid-tempo rhythm structured with record-scratches, rhythmic breaks, and deep swing.",
    vibe: "Urban Groove Heritage"
  },
  "6/8 Tarantella": {
    desc: "Frenzied, swirling Italian folk dance pacing in rapid 6/8 compound meters.",
    vibe: "Mediterranean Whirlwind"
  },
  "Folk Jig": {
    desc: "High-spirited traditional Celtic compound-meter rhythm that bounces with organic wood and string instruments.",
    vibe: "Celtic Tavern Row"
  },
  "Symphonic": {
    desc: "Majestic, grand orchestral pacing utilizing dramatic brass fanfares, timpani beats, and colossal dynamic shifts.",
    vibe: "Cinematic Grandeur"
  },
  "Operatic Strings": {
    desc: "Highly-charged, urgent classical string arrangements with intensive vibratos and soaring tension sweeps.",
    vibe: "Tragic Theatre Drama"
  },
  "Hyperpop": {
    desc: "Extremely high-velocity, maximalist pop featuring glitched vocal splices and intensely distorted synth notes.",
    vibe: "Chaoic Web Portal"
  },
  "Glitch-Core": {
    desc: "Fragmented digital glitching, micro-stutters, and crushed computer squeals backed by unstable beats.",
    vibe: "Cybernetic Fracture"
  },
  "Gothic Rock": {
    desc: "Somber, low-register post-punk bass guitar riffs accompanied by echo-chamber guitar strums and marching drums.",
    vibe: "Cemetery Twilight"
  },
  "Darkwave": {
    desc: "Melancholic coldwave synth layers set against robotic, retro drum machine accents and gloomy vibes.",
    vibe: "Nocturnal Cyber-Club"
  },
  "Acoustic Folk": {
    desc: "Gentle timber rhythm driving forward with warm fingerstyle guitars and soft acoustic hand stamps.",
    vibe: "Woodland Cabin Serenity"
  },
  "Organic": {
    desc: "Deep, earthy acoustic percussion using wooden blocks, shaker beads, and hollow dry-skinned drums.",
    vibe: "Primeval Forest Lungs"
  },
  "Melodramatic": {
    desc: "Tear-swept arrangements with swelling minor chord arrays, poignant solo piano themes, and high emotions.",
    vibe: "Emotional Turning Point"
  },
  "High-Stakes": {
    desc: "Breathless cinematic rhythms with double-time hand drums, and rapid strings building heavy momentum.",
    vibe: "Suspense Action Chase"
  },
  "Laid-back": {
    desc: "Ultra-relaxed, slow-tempo pacing anchored by swinging pocket drums that let melodies wander freely.",
    vibe: "Hammock-Glide Vibe"
  },
  "Conversational": {
    desc: "Highly minimalist backing pattern focused on creating pristine space for spoken-word or natural lyric prose.",
    vibe: "Intimate Narrative Desk"
  },
  "Rapid-fire": {
    desc: "Accelerated snare-rolls and high-velocity drum setups built to back speedy vocalists and rapid prose flow.",
    vibe: "Double-Time Firepower"
  },
  "Staccato": {
    desc: "Plucky, disconnected notes paired with highly crisp, sudden, and clean percussive hits.",
    vibe: "Clockwork Machinery"
  },
  "Ethereal": {
    desc: "Weightless ambient pads, glittering synthesizer wind-chimes, and expansive reverb fields.",
    vibe: "Milky Way Dreamscape"
  },
  "Chanting": {
    desc: "Hypnotic, deep sub-bass drones accompanying ancient choral alignments and monkish hums.",
    vibe: "Monastic Chamber Drones"
  },
  "Ancient Sistrum Rattle": {
    desc: "Dry rattling clicks, clinking metal rings, and historic shakers celebrating Nile-valley temple sounds.",
    vibe: "Pharaonic Sand Mystique"
  },
  "Spoken-Word": {
    desc: "Barely-there quiet hums and soft vinyl crackles optimized for deep poetic recitation.",
    vibe: "Underground Coffeehouse"
  },
  "Deadpan Outro": {
    desc: "A sudden, dry stripping away of all musical backing to highlight an un-embellished lead speaker.",
    vibe: "Sudden Spotlight Dropout"
  },
  "Polyphonic Ringtone Chime": {
    desc: "Nostalgic mid-tempo digital blips using early-2000s monophonic and polyphonic squarewave soundbanks.",
    vibe: "Y2K Pocket Phone"
  },
  "Neo-Soul Shimmer": {
    desc: "Charming Fender Rhodes chords, soft electric bass lines, and laid-back organic snare rims.",
    vibe: "Velvety Evening Chill"
  },
  "Chillwave Sunset": {
    desc: "Nostalgic cassette-tape saturated warm synth pads with slow, lazy indie beats.",
    vibe: "Retro Beach Sunset"
  },
  "Shoegaze Distortion": {
    desc: "A massive, glorious wall of sound featuring heavily warped electric guitars, pedals, and echoing beats.",
    vibe: "Sonic Wall of Noise"
  },
  "Trip-Hop Downbeat": {
    desc: "Slow, heavy, smoky electronic hip-hop grooves with tape delays and atmospheric, dark vocal cues.",
    vibe: "Bristol Autumn Night"
  },
  "Liquid Drum & Bass Roll": {
    desc: "High-speed shuffling breakbeats carrying ultra-smooth jazzy synths and deep sub bassboards.",
    vibe: "Intelligent Club Glide"
  },
  "Krautrock Motorik Beat": {
    desc: "Unwavering, mechanical, repetitive 4/4 driving krautrock engine rhythm that drives forever.",
    vibe: "Autobahn Night Drive"
  },
  "Electro-Swing Brass": {
    desc: "Jazzy, upbeat 1930s swing-era horn sections mixed with four-on-the-floor house beats.",
    vibe: "Speakeasy Club Dancehouse"
  },
  "Psychedelic Rock Swirl": {
    desc: "Mind-bending sixties phase-shifted guitars, reverse tape delay trails, and organic drums.",
    vibe: "Summer of Love Swirl"
  },
  "Afrobeat Polyrhythms": {
    desc: "Intricate, syncopated horn charts, dynamic guitar stabs, and highly complex African percussion grids.",
    vibe: "Lagos Street Fela Groove"
  },
  "Reggae Roots Dubwise": {
    desc: "Quintessential laidback offbeat guitar chop backed by echoing drums and a warm, fat bass guitar.",
    vibe: "Kingston Dub Chamber"
  },
  "Future Bass Pluck": {
    desc: "Energetic, chord-modulating supersaw synth pads combined with clean modern hip-hop clicks.",
    vibe: "Digital Festival Stage"
  },
  "Vaporwave Chill": {
    desc: "Slowed down retro corporate commercial lobby tracks playing under deep reverb and nostalgia.",
    vibe: "Virtual Retail Hub 1999"
  },
  "Cinematic Orchestral Brass": {
    desc: "Vast, epic French horn layers, massive trombones, and heavy orchestral kettle drums.",
    vibe: "Climax Cinematic Battle"
  },
  "Baroque Chamber Harpsichord": {
    desc: "Delicate classical chamber compositions carrying rapid harpsichords and solo acoustic celli.",
    vibe: "Royal Court Banquet"
  },
  "Spaghetti Western Whistle": {
    desc: "Twangy electric baritone guitar, whistling solo lines, and dramatic minor string swells.",
    vibe: "Desert Duel Stand-Off"
  },
  "Celtic Folk Harp": {
    desc: "Enchanting acoustic harp strings playing flowing cascades alongside magical metal whistles.",
    vibe: "Elven Glade Campfire"
  },
  "Glitch Hop Glitchiness": {
    desc: "Groovy mid-tempo rhythmic breaks spiced with sudden microchip skips and synthesizer blips.",
    vibe: "Cyberfunk Breakdance"
  },
  "Dark Ambient Drone": {
    desc: "Void-like low frequency drones and shifting space winds entirely devoid of traditional rhythms.",
    vibe: "Deep Outer Space Void"
  },
  "Yacht Rock Glide": {
    desc: "Premium, silky, high-production West Coast rock featuring electric piano and dual-track guitar solos.",
    vibe: "Marina Sunset Cruise"
  },
  "Post-Punk Driving Bass": {
    desc: "Melodic chorus-pedal guitar chords anchored by a fast, aggressive pick-played punk bassline.",
    vibe: "Grim Industrial Town 1981"
  },
  "Lo-Fi Lullaby Vinyl Crackle": {
    desc: "Muted, cozy piano keys combined with dusty record-needle pops and a drowsy hip-hop beat.",
    vibe: "Cozy Bedroom Study Session"
  },
  "Flamenco Rasgueado Flourish": {
    desc: "Fiery, fast Spanish nylon acoustic guitar picking with passionate heels and crisp hand claps.",
    vibe: "Andalucian Cave Night"
  },
  "Bluegrass Banjo Roll": {
    desc: "Rapid acoustic picking with banjos, mandolins, and double bass flying in perfect harmony.",
    vibe: "Appalachian Mountain Cabin"
  },
  "Space Disco Arpeggiator": {
    desc: "Bubbly synth arpeggio lines with retro-classic cosmic sound sweeps and starship noises.",
    vibe: "Intergalactic Dancefloor"
  },
  "Surf Rock Spring Reverb": {
    desc: "Twangy surf guitars playing rapid-picked melodies through heavy spring-reverb amplifiers.",
    vibe: "California Trestles Swell"
  },
  "IDM Complex Glitches": {
    desc: "Brainy, highly detailed electronic sequences featuring intricate micro-edited breakbeat cuts.",
    vibe: "Intellectual Cyber Cafe"
  },
  "Tribal Trance Hand Drums": {
    desc: "Deep, hypnotic djembe loops playing alongside intense, dark, repeating synthesizer pulses.",
    vibe: "Primal Desert Campfire"
  },
  "8-Bit Retro Chiptune": {
    desc: "Happy, retro videogame music generated purely with classic console sound synthesis templates.",
    vibe: "Arcade Adventure Level 1"
  },
  "Heavy Metal Chugging Riffs": {
    desc: "Intense, down-tuned electric guitars chugging fast rhythm figures over pounding double-kick drums.",
    vibe: "Thrashing mosh pit energy"
  },
  "Dream-Pop Reverb Guitar": {
    desc: "Gorgeous, shimmering indie-pop guitars drifting inside massive halls with soft drums.",
    vibe: "Stargazing Meadow Glide"
  },
  "Acid House TB-303 Acidline": {
    desc: "Squelchy, liquid, resonant historical baseline modulation over classic electronic drum machines.",
    vibe: "Chicago Warehouse Rave 1988"
  },
  "Funk Wah-Wah Scratch Guitar": {
    desc: "Rhythmic, Scratchy funk guitar carrying retro wah-wah pedals alongside active slap basslines.",
    vibe: "Soul Train Disco Dance"
  },
  "Indie Folk Mandolin Roll": {
    desc: "Warm acoustic mandolins and acoustic guitars playing alongside organic foot tapping percussion.",
    vibe: "Mountain Ridge Sunset"
  },
  "Samba Batucada Percussion": {
    desc: "Exuberant, highly energetic street carnival drum ensembles carrying whistles and whistles.",
    vibe: "Rio de Janeiro Street Parade"
  },
  "Dub Siren Echo Feedback": {
    desc: "Spacey electronic sound-effects and sirens repeating inside a fat reggae echo chamber.",
    vibe: "Sound System Dub Chamber"
  },
  "Gregorian Polyphonic Chant": {
    desc: "Hypnotic, singular choral songs echoing in high ancient churches without any percussion.",
    vibe: "Gothic Cathedral Abbey"
  },
  "Chao Gong Clash": {
    desc: "A massive, explosive ceremonial gong strike that blooms with high-frequency shimmering white noise and immense volume.",
    vibe: "Imperial Entrance"
  },
  "Taiko Drum Ensemble": {
    desc: "Thunderous, synchronized low-end drum impacts from oversized Japanese Taiko arrays.",
    vibe: "Shogun Battlefront"
  },
  "Thunderous Orchestral Bass Drum": {
    desc: "Colossal, room-shaking acoustic concert bass drum strikes that vibrate the floor.",
    vibe: "Cinematic Impact"
  },
  "Explosive Snare Rimshot": {
    desc: "High-decibel, whip-crack snare drum strike hitting both the head and the metallic rim instantaneously.",
    vibe: "Stadium Crackle"
  },
  "Chinese Lion Dance Drum": {
    desc: "Energetic, festive parade drum rolls and sharp cymbal clashes with traditional wooden body resonance.",
    vibe: "Kung Fu Street Parade"
  },
  "Ceremonial Wind Gong Shimmer": {
    desc: "A bright, ringing wind gong struck with a heavy mallet, producing a wide wall of majestic vibration.",
    vibe: "Temple Solstice Blessing"
  },
  "Heavy Industrial Piston Slams": {
    desc: "Brutalist, heavy mechanical metallic crashes mimicking monolithic machinery slams.",
    vibe: "Dystopian Steam Forge"
  },
  "Massive Timpani Roll & Strike": {
    desc: "Epic orchestral kettledrums rising in a dramatic drumroll before yielding a thunderous accent strike.",
    vibe: "Dramatic Climax"
  },
  "Samba Surdo Thunder Beats": {
    desc: "Deep, thumping surdo bass drums providing a heavy heartbeat and massive polyrhythmic force.",
    vibe: "Carnival In Rio"
  },
  "Militaristic Field Snare": {
    desc: "Crisp, fast marching drum rudiments played on high-tension wire snares for aggressive discipline.",
    vibe: "Battlefront March"
  },
  "Anvil Hammer Strikes": {
    desc: "Sharp, high-impact hammers clanging against solid iron blocks with raw piercing metallic resonance.",
    vibe: "Blacksmith Metallurgy"
  },
  "Symphonic Gong Swell": {
    desc: "A dramatic, slow-building crescendo on a 40-inch orchestral gong that crests into an immense sonic wall.",
    vibe: "Cosmic Devastation"
  },
  "Aggressive Metal Double-Lick": {
    desc: "Machine-gun speed double bass drum kicks packing tight, heavy, chest-punching impact.",
    vibe: "Speed Metal Blastbeat"
  },
  "Brazilian Batucada Surdo Accent": {
    desc: "Intense, syncopated deep accent notes that anchor a rapid Batucada percussion circle.",
    vibe: "Rio Carnival Peak"
  },
  "Heavy Marching Quad Drums": {
    desc: "Rapid, high-powered athletic drumline rolls on four multi-tenor marching drums.",
    vibe: "Stadium Halftime Show"
  },
  "Tribal War Drums Polyrhythm": {
    desc: "Overlapping, repetitive high-volume wooden hand drums and floor toms signaling ancient battle.",
    vibe: "Primeval War Cry"
  },
  "Heavy Metal Blastbeats": {
    desc: "Aggressive, high-tempo drum blastbeats with frantic double-bass pedaling and heavy cymbal crashes.",
    vibe: "Intense Moshing Power"
  },
  "Gothic Cathedral Choir": {
    desc: "Haunting, chorally arranged backing lines layered with dark classical organs and slow cathedral bells.",
    vibe: "Cemetery Vigil"
  },
  "Doom Metal Heavy Plod": {
    desc: "Extremely slow, crushing, drop-tuned guitar chords dragging over monolithic drum impacts.",
    vibe: "Ancient Looming Dread"
  },
  "Post-Metal Dark Atmosphere": {
    desc: "Vast, cinematic instrumental layers of tremolo-picked guitars rising in dramatic, dark waves.",
    vibe: "Post-Apocalyptic Landscape"
  },
  "Neoclassical Organ Swell": {
    desc: "Dramatic, intense pipe organ patterns that elevate tension and add a gothic, sacred drama.",
    vibe: "Vampiric Castle"
  },
  "Black Metal Tremolo Riff": {
    desc: "Frantic, fast-picked razor-sharp electric guitar guitars playing dark, cold, melancholic chord outlines.",
    vibe: "Nocturnal Forest Storm"
  },
  "Chillhop Boom-Bap": {
    desc: "Mellow, warm jazz chords overlaid upon relaxed dusty boom-bap drum beats and vinyl static.",
    vibe: "Cozy Night Desk Study"
  },
  "Vaporwave Sunrise": {
    desc: "Gloriously slowed corporate backing tracks with lush, echoey, cassette-tape warmth and dreaminess.",
    vibe: "Nostalgic Mall Solitude"
  },
  "Deep Space Ambient Synth": {
    desc: "Sustained, sweeping electronic keys and cosmic space noise with zero percussive elements.",
    vibe: "Infinite Cosmic Float"
  },
  "Ambient Drip Delay": {
    desc: "Delicate pluck patterns repeated inside wet echo fields, mimicking droplets falling in hollow caves.",
    vibe: "Deep Cave Healing"
  },
  "Lullaby Glockenspiel": {
    desc: "Soft, metallic music-box bells that create a sweet, soothing, and nostalgic dreamlike state.",
    vibe: "Drowsy Nighttime Slumber"
  },
  "Ethereal Cloud Pad": {
    desc: "Soft-spoken, lush electronic string layers that swirl slowly, lifting the song into a warm sky.",
    vibe: "Weightless Ascension"
  },
  "Cyberpunk Grid Rhythm": {
    desc: "Intense, mechanical darkwave synth basses driven by precise digital machine drums and glitchy grids.",
    vibe: "Neon Highway Outrun"
  },
  "Mecha-Beats Quantized Syncopation": {
    desc: "Cool, highly automated electronic drums popping in perfect, computerized syncopation.",
    vibe: "Factory Robotic Line"
  },
  "Retro Synthwave Outrun Bass": {
    desc: "Rhythmic, pumping eighth-note synthesizers driving alongside punchy classic drum machine clicks.",
    vibe: "Neon Highway Outrun"
  },
  "Binary Coding Digital Click": {
    desc: "Extremely quick, quiet computer text clicks and glitch chirps providing an automatic micro-ryhthm.",
    vibe: "AI Code Stream"
  },
  "80s Vocoder Robotic Sweep": {
    desc: "Dazzling, retro vocoder vocal effects and synth sweeps that sound clean, machine-like, and automated.",
    vibe: "Feminine Android Awakening"
  },
  "Android Heartbeat Pulsation": {
    desc: "A highly rhythmic, warm, electronic sub-bass kick mimicking a cybernetic metallic pulse.",
    vibe: "Bionic Heart Engine"
  },
  "Seraphic Celestial Choir": {
    desc: "Lush, radiant, crystal-clear vocal stacks that shimmer with transcendent light and holy warmth.",
    vibe: "Heavenly Presence"
  },
  "Ascending Heavenly Arpeggio": {
    desc: "Ultra-fast climbing harp and synthesizer plucks that mimic celestial ladders of pure light.",
    vibe: "Ascendant Divine Flight"
  },
  "Ethereal Cherub Chimes": {
    desc: "Delicate, micro-tonal crystal bell tinkles swirling in grand, spacey acoustic delays.",
    vibe: "Cherubic Playfulness"
  },
  "Angelic Harp Glissando": {
    desc: "Sweeping, gorgeous physical harp glides that soothe tension and introduce blissful serenity.",
    vibe: "Angelic Embrace"
  },
  "Abyssal Growling Sub-bass": {
    desc: "A terrifyingly deep, bone-vibrating sub-bass layer infused with guttural hell-gasp textures.",
    vibe: "Subterranean Doom"
  },
  "Demonic Guttural Pulse": {
    desc: "An aggressive, rhythmic low-end heartbeat driven by compressed sub-organic clicks and mechanical gasps.",
    vibe: "Underworld Machinery"
  },
  "Satanic Chthonic Drone": {
    desc: "A persistent, low, ancient harmonic hum vibrating with chaotic malevolence and ancient dark energy.",
    vibe: "Caverns of Hades"
  },
  "Hades Firestorm Blastbeat": {
    desc: "Furious, high-octane heavy metal drum blasts paired with terrifying walls of distortion and dark cymbal washes.",
    vibe: "Hellfire Fury"
  },
  "Galloping Outlaw Beat": {
    desc: "Dynamic, acoustic guitar strumming and drum shuffle pacing that mimics a galloping horse on dust trail.",
    vibe: "Outlaw Horseback Escape"
  },
  "Ennio Morricone Whispering Wind": {
    desc: "Nostalgic whistling, Spanish guitar phrasing, and deep, sparse bell tones echoing across a desert.",
    vibe: "Cinematic Desert Gold-Rush"
  },
  "Campfire Acoustic Pluck": {
    desc: "Soft traditional acoustic picking accompanied by gentle, crackling woodfire and soft hand taps.",
    vibe: "Rustic Nighttime Camp"
  },
  "Saloon Honky-Tonk Swing": {
    desc: "Lively, ragtime piano runs with unstable, bouncy tempos and a crowded bar-hall energy.",
    vibe: "Wild West Saloon"
  },
  "Spur Clink & Whip Crack Percussion": {
    desc: "Percussive clinks of metal boot-spurs and high-frequency whip snaps creating an eccentric rhythm.",
    vibe: "Sheriff Patrol"
  },
  "Howling Coyote Slide Guitar": {
    desc: "Deep slide acoustic country notes sliding with long reverbs, punctuated by faint, howling wind noises.",
    vibe: "Solitary Desert Night"
  },
  "Gringo Train Chug": {
    desc: "Steady, rapid country-shuffle snare rolls and dry strumming mimicking the puff and chug of a steam locomotive.",
    vibe: "Steam Locomotive Chase"
  },
  "Sheriff's High-Noon Standoff": {
    desc: "Tense clock ticks with heavy drum thumps, sudden Spanish horns, and nervous, high guitar plucks.",
    vibe: "High-Noon Shootout"
  },
  "Velvet Slow-Jam Pulse": {
    desc: "Highly intimate, slow-tempo R&B rhythmic pulse driven by warm, velvety low-end basslines.",
    vibe: "Late-Night Intimacy"
  },
  "Sweeping Cello Serenade": {
    desc: "Sweeping, gorgeous acoustic cello string movements that evoke deep sentiment, longing, and true affection.",
    vibe: "Intimate String Serenade"
  },
  "Late-Night Saxophone Swell": {
    desc: "Seductive, jazzy soprano saxophone solos swelling gently over a dark, smoky bedroom groove.",
    vibe: "Smoky Jazz Seduction"
  },
  "Whispering Bedroom Arpeggio": {
    desc: "Sparsely plucked acoustic guitar or harp notes floating through quiet soundscapes for sweet, whispered secrets.",
    vibe: "Whispered Candlelight Confessions"
  },
  "Passionate Heartbeat Kick": {
    desc: "A rhythmic, high-impact but warm sub-bass kick mimicking the racing heartbeat of lovers in an embrace.",
    vibe: "Accelerating Passionate Pulse"
  },
  "Seductive Slap-Bass Glide": {
    desc: "Smooth, sliding funk/soul bass lines providing a cheeky, playful rhythmic drive to sensual beats.",
    vibe: "Seductive Soul Groove"
  },
  "Warm Candlelight Tremolo": {
    desc: "Lush, pulsating electric guitar or keyboard tremolo waves wrapping the arrangement in cozy, fire-lit comfort.",
    vibe: "Cozy Candlelit Sanctuary"
  },
  "Erotic Midnight Shimmer": {
    desc: "Downtempo electronic pads and suggestively slow hi-hat sweeps designed for extreme sensory appreciation.",
    vibe: "Sensual Late-Night Reverie"
  },
  "Monasterial Unison Drone": {
    desc: "Vocal chant in absolute unison with deep monastic bass drones for a sacred church feel.",
    vibe: "Monasterial Solace"
  },
  "Sustained Byzantine Isokratima": {
    desc: "A continuous, warm vocal drone supporting ornate Eastern Orthodox liturgic chants.",
    vibe: "Byzantine Majesty"
  },
  "Vesper Polyphonic Organum": {
    desc: "Ethereal, multivoiced medieval harmonies moving in mysterious parallel intervals.",
    vibe: "Gothic Cathedral Vesper"
  },
  "Melismatic Benedictine Harmony": {
    desc: "A single syllable sung across long cascading musical scales by a pure monkish choir.",
    vibe: "Sacred Cascading Peace"
  },
  "Solfeggio Frequency Resonance": {
    desc: "Healing tone frequencies sung in gorgeous, floating choral unisons.",
    vibe: "Divine Frequency Balance"
  },
  "Tibetan Deep Throat Chant": {
    desc: "Extremely low-pitched, multi-harmonic throat singing mimicking primeval mountain winds.",
    vibe: "Himalayan Mysticism"
  },
  "Sanskrit Sacred Mantra Sloka": {
    desc: "Rhythmic Sanskrit verses chanted in precise, ceremonial loops of high focus.",
    vibe: "Vedic Temple Awakening"
  },
  "Caribbean Soca Bassline": {
    desc: "Super high-tempo, bouncy Afro-Caribbean bassline and syncopated snare drum pattern.",
    vibe: "Carnival Road-March"
  },
  "Roots Reggae One-Drop Beat": {
    desc: "Classic offbeat guitar skanks with the rimshot and bass drum hitting strictly on the third beat.",
    vibe: "Swaying Trenchtown Kingston"
  },
  "Calypso Steelpan Syncopation": {
    desc: "Upbeat Trinidadian folk rhythm complete with shimmering melodic steelpan drums.",
    vibe: "Tropical Island Shore"
  },
  "Mento Rhumba Box Thump": {
    desc: "Rustic, vintage Caribbean acoustic thumb-bass thumps matched with banjo rolls.",
    vibe: "Acoustic Island Mento"
  },
  "Ska Offbeat Guitar Skank": {
    desc: "Fast, energetic walking basslines paired with rapid, staccato offbeat guitar chops.",
    vibe: "Vintage Kingston Ska"
  },
  "Didgeridoo Circular Breathing Drone": {
    desc: "Continuous, hypnotic low-register wind drone with unique vocal yelps and animal mimicry.",
    vibe: "Dreamtime Spirit Wind"
  },
  "Aboriginal Clapstick Rhythm": {
    desc: "Crisp, wooden clapsticks striking dry rhythms over organic ceremonial chanting.",
    vibe: "Ancient Corroboree Campfire"
  },
  "Yawkyawk Spirit Song Chant": {
    desc: "Ethereal, high-pitched vocal harmonies celebrating water spirits from Arnhem Land stories.",
    vibe: "Mystical Billabong Echo"
  },
  "Mimi Spirit Corroboree Beat": {
    desc: "Fast-moving, playful ceremonial rhythm mirroring the energetic dancing of woodland spirits.",
    vibe: "Playful Campfire Dance"
  }
};
