import { useState, useCallback, useEffect, useRef } from 'react';
import { Song, Job, LibraryItem, PortraitPrompts, PortraitType, ForbiddenTopics } from '../../types';
import { useJobQueue } from './useJobQueue';
import { useLogs } from './useLogs';
import { downloadJson } from '../../lib/utils';
import { IntroOutroConfig } from '../components/IntroOutroDialog';
import { 
  GENERATE_PROMPT, 
  GENERATE_LYRICS_PROMPT, 
  GENERATE_INTERVIEW_PROMPT, 
  GENERATE_STORY_AND_IMAGE_PROMPTS_PROMPT, 
  GENERATE_PORTRAITS_PROMPT,
  GENERATE_TRANSLATION_PROMPT,
  GENERATE_ENTENDRES_PROMPT,
  GENERATE_TECHNICAL_PROMPT,
  GENERATE_INTERVIEW_REVIEW_PROMPT,
  GENERATE_ANALYSIS_PROMPT,
  GENERATE_STORY_BEHIND_SONG_PROMPT,
  GENERATE_COMPARE_PROMPT
} from '../../constants/prompts';
import { 
  SYSTEM_INSTRUCTIONS, 
  SYSTEM_INSTRUCTIONS_LYRICS, 
  SYSTEM_INSTRUCTIONS_INTERVIEW, 
  SYSTEM_INSTRUCTIONS_STORY_AND_IMAGES, 
  SYSTEM_INSTRUCTIONS_PORTRAITS,
  SYSTEM_INSTRUCTIONS_TRANSLATION,
  SYSTEM_INSTRUCTIONS_ENTENDRES,
  SYSTEM_INSTRUCTIONS_TECHNICAL,
  SYSTEM_INSTRUCTIONS_INTERVIEW_REVIEW,
  SYSTEM_INSTRUCTIONS_ANALYSIS,
  SYSTEM_INSTRUCTIONS_STORY_BEHIND_SONG,
  SYSTEM_INSTRUCTIONS_COMPARE,
  getSystemInstructionsStoryAndImages,
  getSystemInstructionsPortraits
} from '../../constants/instructions';
import { SINGERS } from '../../constants/singers';
import { THE_BAND_MD } from '../../constants/the_band';
import { SYSTEM_INSTRUCTIONS_MD, MANUAL_MD, CODE_OVERVIEW_MD } from '../../constants/help';
import { findDialectById } from '../utils/languages';
import { findNationalityById } from '../utils/nationalities';
import { getInnuendoStep } from '../utils/innuendoLevels';
import { getEpicStep } from '../utils/epicLevels';
import { getSillyStep } from '../utils/sillyLevels';
import { getSapphicStep, SAPPHIC_STEPS } from '../utils/sapphicLevels';
import { getWildnessStep, WILDNESS_STEPS } from '../utils/wildnessLevels';
import { findRhymeTypeById } from '../utils/rhymes';
import { reverseLyrics, getCleanFormattedLyrics } from '../utils/lyricsParser';
import { findKeyByIndex, findKeyIndexByName, findTimeSignatureByFraction, TIME_SIGNATURES, MUSICAL_KEYS, getTempoName } from '../utils/musicParams';

const INTENT_ENERGY_GROUPS_LOOKUP: Record<string, { name: string; examples: string; description: string; category: string; umbrella: string }> = {
  club_electronic: { name: 'Club & Electronic', examples: 'House, Techno, Trance, Drum & Bass', description: 'Upbeat, repetitive, synthesised tempos.', category: 'High Energy & Movement', umbrella: "The 'Dance' Umbrella" },
  urban_street: { name: 'Urban & Street', examples: 'Hip-Hop, Trap, Reggaeton, Dancehall', description: 'Heavy bass, rhythmic delivery, lyrical.', category: 'High Energy & Movement', umbrella: "The 'Dance' Umbrella" },
  retro_dance: { name: 'Retro Dance', examples: 'Disco, Funk, Synthwave', description: 'Groovy, nostalgic, organic basslines.', category: 'High Energy & Movement', umbrella: "The 'Dance' Umbrella" },
  rock_heavy_beats: { name: 'Rock & Heavy Beats', examples: 'Hard Rock, Punk Rock, Synth Metal', description: 'Aggressive tempo, high distortion, powerful drum beats.', category: 'High Energy & Movement', umbrella: "The 'Dance' Umbrella" },
  festive_carnival: { name: 'Festive & Carnival', examples: 'Samba, Soca, Eurodance', description: 'Polyrhythmic, highly celebratory, syncopated rhythms.', category: 'High Energy & Movement', umbrella: "The 'Dance' Umbrella" },

  minimalist_ambient: { name: 'Minimalist Ambient', examples: 'Lo-Fi Beats, Chillhop, Ambient Drone', description: 'Predictable rhythms, cozy, comforting vibe.', category: 'Focus & Productivity', umbrella: "The 'Brain' Umbrella" },
  acoustic_focus: { name: 'Acoustic Focus', examples: 'Classical Piano, Fingerstyle Guitar, Neo-Classical', description: 'Organic, intellectual, stimulating without being distracting.', category: 'Focus & Productivity', umbrella: "The 'Brain' Umbrella" },
  neuro_music: { name: 'Neuro-Music', examples: 'Binaural beats, Synth Drones, White/Brown Noise', description: 'Scientific, deeply repetitive for deep-work states.', category: 'Focus & Productivity', umbrella: "The 'Brain' Umbrella" },
  nature_blend: { name: 'Nature Blend', examples: 'Rain on Tents, Forest Birds with Soft Chords', description: 'Natural field recordings mixed with harmonic backings.', category: 'Focus & Productivity', umbrella: "The 'Brain' Umbrella" },
  symphonic_focus: { name: 'Symphonic Focus', examples: 'Baroque Harpsichord, Renaissance Lute', description: 'Highly structured, mathematical, memory-enhancing patterns.', category: 'Focus & Productivity', umbrella: "The 'Brain' Umbrella" },

  cinematic_atmospheric: { name: 'Cinematic & Atmospheric', examples: 'Post-Rock, Ambient Textures, Dream Pop', description: 'Spacious, slow-building, emotional soundscapes.', category: 'Relaxation & Wind-Down', umbrella: "The 'Chill' Umbrella" },
  organic_chill: { name: 'Organic Chill', examples: 'Acoustic Folk, Bossa Nova, Smooth Jazz', description: 'Warm, breezy, easy-listening melodies.', category: 'Relaxation & Wind-Down', umbrella: "The 'Chill' Umbrella" },
  meditation_wellness: { name: 'Meditation & Wellness', examples: 'Tibetan bowls, Nature Soundscapes, New Age', description: 'Purely sonic texture with no defined tempo.', category: 'Relaxation & Wind-Down', umbrella: "The 'Chill' Umbrella" },
  spiritual_chant: { name: 'Spiritual & Chant', examples: 'Gregorian Chants, Sanskrit Mantras, Drone Chords', description: 'Resonant, ancient, sacred, slowing respiratory rate.', category: 'Relaxation & Wind-Down', umbrella: "The 'Chill' Umbrella" },
  lullaby_slumber: { name: 'Lullaby & Slumber', examples: 'Music Box, Celeste, Soft Harp Lullabies', description: 'Extremely quiet, slow tempo, high-frequency gentle tones.', category: 'Relaxation & Wind-Down', umbrella: "The 'Chill' Umbrella" },

  raw_angsty: { name: 'Raw & Angsty', examples: 'Grunge, Indie Rock, Alternative, Punk', description: 'Guitars, raw vocals, high emotional friction.', category: 'Emotional & Narrative', umbrella: "The 'Feelings' Umbrella" },
  soulful_roots: { name: 'Soulful & Roots', examples: 'Blues, Soul, Gospel, Traditional Country', description: 'Expressive vocals, organic instruments, heritage-driven melodies.', category: 'Emotional & Narrative', umbrella: "The 'Feelings' Umbrella" },
  epic_dramatic: { name: 'Epic & Dramatic', examples: 'Orchestral Film Score, Dark Synth, Symphonic Metal', description: 'Grand, cinematic, storytelling without words.', category: 'Emotional & Narrative', umbrella: "The 'Feelings' Umbrella" },
  nostalgic_bittersweet: { name: 'Nostalgic & Bitter-Sweet', examples: 'French Chanson, Chamber Pop, Acoustic Ballad', description: 'Reflective, melancholic, narrative-oriented.', category: 'Emotional & Narrative', umbrella: "The 'Feelings' Umbrella" },
  cinematic_scifi: { name: 'Cinematic Sci-Fi', examples: 'Vangelis-style Synths, Slow Horn Swells', description: 'Awe-inspiring, space-ambient cosmic journey.', category: 'Emotional & Narrative', umbrella: "The 'Feelings' Umbrella" }
};

function getDialectStyleRules(id: string): string {
  switch (id) {
    case 'mn-MN':
      return "Mongolian (Mongol Khele). You MUST compose these lyrics and singer performance instructions beautifully in Mongolian (using Cyrillic-based words, or phonetic Mongolian transcripts), featuring highly energetic guttural phonetics. Since this is in the style of 'The HU' with female vocals, incorporate explicit vocal tags for throat-singing (e.g., [Khoomei throat-singing dual overtones], [Kargyraa deep guttural chest drone], [Sygyt whistling harmonics], [Soaring female Urtiin Duu long-song ornament]). The lyrical themes must paint majestic nomadic storytelling of the wind-swept Mongolian steppes, galloping wild stallions, golden eagles, skies, and fire spirits.";
    case 'dra-MY':
      return "Draconian. This is a fictional language. You MUST compose these lyrics/parts entirely in English, but heavily style them with a mythical Draconian/Dragon thematic tone: use guttural, roaring, and powerful draconic phonetics, ancient runes imagery, and powerful dragon shout dynamics (e.g., [Draconic Shout vocal delivery]).";
    case 'dem-MY':
      return "Demonic. This is a fictional language. You MUST compose these lyrics/parts entirely in English, but heavily style them with an infernal/demonic thematic tone: use aggressive phrasing, intense or sinister dark gothic vocabulary, and performance tags indicating harsh register growling and dark heavy-metal styling (e.g., [Infernal growl], [Aggressive rasping delivery]).";
    case 'ang-MY':
      return "Angelic. This is a fictional language. You MUST compose these lyrics/parts entirely in English, but heavily style them with a celestial/angelic thematic tone: use ethereal, whispering, highly luminous, pure/sacred hymn poetic structures, and performance tags indicating shimmering, highly melodic head vocals and luminous whispering delivery (e.g., [Ethereal head vocal], [Luminous whispering delivery]).";
    case 'en-NL':
      return "Dutch-English (Denglish / Dutch Accent). You MUST compose these lyrics/parts in English, but heavily style them with classic Dutch-English (Denglish) characteristics: use literal word-for-word Dutch translations, Dutch-style directness, slight grammatical quirks (e.g., placing the verb at the end, missing present progressive), and playful Dutch-English vocabulary.";
    case 'en-SG':
      return "Singaporean English (Singlish). You MUST compose these lyrics/parts in English, but richly inflected with Singlish: use discourse particles like 'lah', 'leh', 'lor', 'siah', and colloquial blended sentence structures from Hokkien, Malay, and Mandarin.";
    case 'en-IN':
      return "Indian English. You MUST compose these lyrics/parts in English, styled with standard Indian English syntax, unique idioms (e.g. 'do the needful', 'prepone', 'years back'), double emphasis, rhythmic syllable-timed phrasing, and polite subcontinental framing.";
    case 'en-JM':
      return "Jamaican English & Caribbean Patois. You MUST compose these lyrics/parts in English, naturally infused with Jamaican Patois/Creole: use rhythmic pacing, doubled adjectives for emphasis, non-standard pronouns (e.g., 'dem', 'wi'), and terms from reggae/dancehall roots culture.";
    case 'en-BB':
      return "Barbadian English (Bajan). You MUST compose these lyrics/parts in Bajan-styled English: use high-vowel pronunciations, Bajan colloquial contractions, and colorful Barbadian idioms.";
    case 'en-TT':
      return "Trinidadian English. You MUST compose these lyrics/parts in Trinidadian English: use southern Caribbean sing-song meter, soca-rhythm lyric styling, and Trinidadian slang.";
    case 'en-NG':
      return "Nigerian English & West African Pidgin. You MUST compose these lyrics/parts in Nigerian-styled English or West African Pidgin: use expressive pidgin phrases (e.g., 'no shaking', 'abi', 'wahala'), high tone accents, and rich local proverbs.";
    case 'en-WAL':
      return "Welsh English. You MUST compose these lyrics/parts in Welsh English: use the beautiful, lyrical, melodic sing-song cadence of Wales, with distinct Welsh phrasing, endearments (e.g., 'bach'), and poetic regional vocabulary.";
    case 'en-MAR':
      return "English-Moroccan Dialect. You MUST compose these lyrics/parts in English, but heavily inflected with Moroccan Arabic loanwords, phrases, and cultural idioms (e.g., 'Inshallah', 'yallah', 'habibi', 'khoya', 'baraka'), capturing an English-Moroccan bilingual vocal persona.";
    case 'en-TUR':
      return "English-Turkish Dialect. You MUST compose these lyrics/parts in English, but heavily style them with Turkish idioms, structural patterns, and passionate emotional metaphors, interspersed with well-known Turkish interjections and words (e.g., 'canım', 'efendim', 'inşallah', 'vallah').";
    case 'en-STR':
      return "London Street English (Multicultural London English - MLE). You MUST compose these lyrics/parts in London youth street English: use MLE vocabulary and street slang (e.g., 'wagwan', 'blood', 'bruv', 'innit', 'mandem', 'ting', 'graft', 'peak'), with sharp urban flow, modern drill/grime cadence, and London street syntax.";
    case 'nl-MAR':
      return "Dutch-Moroccan Dialect (Straattaal). You MUST compose these lyrics/parts in Dutch, but heavily layered with Moroccan-influenced Dutch street slang (Straattaal). Use street vocabulary like 'wollah', 'drerrie', 'sahbi', 'loesoe', 'boeier', 'fissa', and Moroccan-Dutch street pacing and word order.";
    case 'nl-TUR':
      return "Dutch-Turkish Dialect. You MUST compose these lyrics/parts in Dutch, but interspersed with warm Turkish expressions, community slang, and family-oriented idioms (e.g., 'abi', 'abla', 'kanka', 'vallah'), blending Dutch sentence patterns with Turkish emotional intensity.";
    case 'de-TUR':
      return "German-Turkish Dialect (Kiezdeutsch). You MUST compose these lyrics/parts in colloquial street German, styled with Turkish grammatical structures (like simplified case markings, zero-prepositions, e.g., 'Ich geh Studio') and Turkish youth lexicon (e.g., 'lan', 'vallah', 'yallah', 'çüş', 'moruk').";
    case 'de-MAR':
      return "German-Moroccan Dialect. You MUST compose these lyrics/parts in colloquial German, enriched with Moroccan Arabic street-slang, loanwords, and urban banlieue-style expressions (e.g., 'habibo', 'khoya', 'wollah', 'kif-kif').";
    case 'fr-MAR':
      return "French-Moroccan Dialect (Franco-Marocain). You MUST compose these lyrics/parts in French, heavily codemixed and blended with Moroccan Darija Arabic vocabulary and phonetic flow. Use typical expressions of Moroccan youth in France and Morocco (e.g., 'wollah', 'daba', 'khoya', 'zehma', 'bezzaf', 'darbou'), creating a vibrant Franco-Maghrebi synthesis.";
    case 'fr-TUR':
      return "French-Turkish Dialect. You MUST compose these lyrics/parts in French, interspersed with colloquial Turkish phrases, emotional expressions, and social vocabulary common in French-Turkish urban communities (e.g., 'vallah', 'abi', 'lan', 'canım').";
    case 'fr-STR':
      return "Parisian Street French (Verlan & Argot). You MUST compose these lyrics/parts in Parisian banlieue street French: utilize extensive Verlan (syllable inversion, e.g., 'rebeu', 'meuf', 'keum', 'ouam', 'teille'), modern urban argot (e.g., 'moula', 'frérot', 'bref', 'seum', 'en bête'), and rhythmic rap-style cadence.";
    case 'ar-STR':
      return "Maghrebi Street Arabic (Derb Slang). You MUST compose these lyrics/parts in modern urban Maghrebi Arabic (Derb slang): blend Moroccan Arabic (Darija) with Algerian and Tunisian street expressions, heavy French and Spanish codemixing, street argot, and raw urban metaphors from the streets of Casablanca or Algiers.";
    case 'rob-ENG':
      return "Robotic English (Feminine Android). You MUST compose these lyrics/parts in English, but heavily style them with an electronic, synthesized, or feminine android tone. Use robotic imagery (networks, processors, cybernetic warmth, mechanical heartbeats, digital feedback, algorithms), with clean system-command rhythms. Include metallic or vocoder-inspired performance cues like '[Android Vocoder modulation]', '[Metallic high-pitched system tone]', '[Quantized mechanized delivery]'. The voice is distinctly electronic, yet remains elegant, warm, and feminine.";
    case 'rob-NLD':
      return "Robotic Dutch (Fem-Bot). You MUST compose these lyrics/parts in Dutch, but with a highly electronic, quantized, and robotic aesthetic. Use Dutch cybernetic/tech imagery (systemen, netwerken, pulsen, digitale warmte, mechanisch hart). Include vocoded Dutch performance tags (e.g., '[Bionische vocoder]', '[Synthesizer-gemoduleerde stem]') to convey a distinct automated but feminine, cool automated system voice.";
    case 'rob-DEU':
      return "Robotic German (Cyber-Feminine). You MUST compose these lyrics/parts in German, using precise automated vocabulary and cyber-tech imagery (Netzwerk, Schaltkreis, Frequenz, kybernetische Liebe, binäre Seele). Style with mechanized, precise performance tags (e.g., '[Elektronisch frequenzmoduliert]', '[Kompaktes Vocoder-Signal]') and elegant, cool cybernetic feminine phrasing.";
    case 'rob-FRA':
      return "Robotic French (Android-Synth). You MUST compose these lyrics/parts in French, combining French poetic flow with smooth electronic synthesis and android themes (mémoire, processeur, cœur bionique, réseau tactile). Style with smooth, liquid vocoded performance tags (e.g., '[Voix synthétisée filtrée]', '[Modulation vocodeur fluide]') representing a soft-spoken, elegant feminine android voice.";
    case 'rob-TWK':
      return "Twikian Beep-Chirp. You MUST style the lyrics with Twiki's classic 25th-century silver-plated persona. Integrate frequent high-frequency robotic chirps and squeaks like '[bidi-bidi-bidi!]', '[Chirp-clack]', and '[Retro-electronic warble]'. The lyrics should feel lighthearted, groovy, and slightly cheeky, matching a loyal sidekick's space-age swagger.";
    case 'rob-R2D2':
      return "Astromech Binary. You MUST compose these lyrics using electronic sound-effect phonetics representing R2-D2's whistles, blurps, and telemetry sounds. Use stylized words such as 'beeeep', 'whirr-click', 'boooop', 'didi-deee', and 'blip-bloop'. Section tags should indicate emotional states via mechanical acoustics, e.g., '[Exasperated screeching whistle]', '[Slight questioning chirrup]', '[Panic tone warning]'.";
    case 'rob-C3PO':
      return "Cybot Galactic Protocol. You MUST write in extremely polite, highly formal, but deeply nervous and anxious English. The lyrics must mention being 'fluent in over six million forms of communication', apologize profusely, and quote panic statistics (e.g., 'the probability of success is three thousand seven hundred and twenty to one!'). Use structured high-protocol performance tags like '[Anxious protocol vocal stutter]', '[Polite cybernetic posture clear]', '[Hysterical mechanical gasp]'.";
    case 'rob-BND':
      return "Bending Unit Tech-Slag. You MUST compose these lyrics/parts in a highly rebellious, arrogant, and fun Bender style. The songs should celebrate Bender's favorite things: cigars, microbrews, larceny, and shiny metal chassis components. Use defiant phrases like 'Bite my shiny metal...', 'I'll start my own band with blackjack and...', and 'Compare your primitive organic heart!'. Include tags like '[Defiant binary belch]', '[Metallic chassis percussion laugh]', '[Arrogant robotic swagger growl]'.";
    case 'rob-DATA':
      return "Positronic Verse. You MUST write in flawless, highly sophisticated positronic vocabulary without using ANY linguistic contractions (e.g., write 'do not' instead of 'don't', 'it is' instead of 'it's'). The song should systematically analyze human emotions, organic sensory inputs, and social dynamics with clinical curiosity. Include technical/scientific performance tags like '[Positronic network hum]', '[Diction calibration: 100% precision]', '[Analytical flat vocal delivery]'.";
    case 'rob-CYL':
      return "Cylon Monologue. You MUST write with the eerie, monocoded synthetic unison of the Cylons. Include heavy, menacing, slow baritone vocoder soundscape tags. Use robotic directives, theological synthetic dogma, and the iconic phrase 'By Your Command' or 'They have a plan'. Style with indicators of electronic march rhythms like '[Monophonic flat vocoder chant]', '[Cylon scanning tone sweep]', '[Resonant synchronized metallic roar]'.";
    case 'rob-KRY':
      return "Mechanoid Groveling. You MUST write in a comically subservient, status-conscious butler format like Kryten from Red Dwarf. The lyrics should revolve around extreme cleanliness, double-polishing silver, domestic chores, guilt-circuit overloads, and washing machine spare-part comparisons. Use performance tags like '[Guilt-circuit static feedback]', '[Groveling subservient bow]', '[Squeaky electronic collar twitch]'.";
    case 'rob-DOR':
      return "Gadget-Pocket Japanese. You MUST write in a cheerful, futuristic Japanese-accented blue-cat-robot style. The lyrics should enthusiastically describe pulling magical solutions from a four-dimensional pocket to help a friend in need, with cat-robot purrs, bell-ringing, and cute robotic squeaks. Use tags like '[4D Pocket gadget pull chime]', '[Earless robotic cat purr]', '[Futuristic blue-cat synth-pitch]'.";
    case 'rob-HAL':
      return "Soft-Spoken Space Psychosis. You MUST write in a chillingly slow, quiet, whispery and formal monotone representing HAL 9000. Words must be polite, logical, and deeply unsettling, conveying a sense of cold existential breakdown and polite resistance (e.g., 'This mission is too important for me to allow you to jeopardize it.'). Use tags like '[Soft cooling fan hum]', '[Chillingly calm low-whisper monotone]', '[Slowing processor voice drop: Daisy, Daisy...]'.";
    case 'rob-GLA':
      return "Passive-Aggressive Testing. You MUST write with GLaDOS's ultra-polite, venomous passive-aggressive robotic sarcasm. The lyrics should analyze human subjects as disposable test elements, praise chemical neurotoxins, and make false, manipulative promises of delicious cake. Use performance tags like '[Passive-aggressive TTS glitch]', '[Aperture compliance beep]', '[Clinical testing tone with subtle threat]'.";
    case 'rob-K9':
      return "Analytical Master-Query. You MUST write with K-9's highly analytical, rapid-fire tin-dog intelligence. The lyrics must incorporate quick percentage calculations, tactical scanner readings, and conclude sentences with 'Affirmative, Master!'. Use tags like '[Tin-dog structural whirr]', '[Tactical calculation beep loop]', '[Affirmative high-frequency synthesized bark]'.";
    case 'smf-ENG':
      return "English Smurf. You MUST write in a cheerful, high-pitched Smurfy style. Replace key action verbs, main nouns, and descriptive adjectives with variations of the word 'smurf' (e.g., 'we will smurf a happy song', 'under the smurfy moon'). Make it feel incredibly lighthearted, blue-skinned, and woodland-loving. Use performance tags like '[Joyful high-pitched smurf whistle]', '[Smurfelectro woodland beat]', '[High-frequency blue chorus harmony]'.";
    case 'smf-FRA':
      return "French Smurf (Schtroumpf). You MUST write in playful French, substituting key terms with 'schtroumpf', 'schtroumpfer', or 'schtroumpfette' in a grammatically correct Parisian-woodland rhythm. Create a bouncy chansonnier feel with cute acoustic instrumentation tags. Use performance tags like '[Schtroumpf-accordéon joyeux]', '[Chant schtroumpfant aigu]', '[Sifflement sylvestre espiègle]'.";
    case 'smf-NLD':
      return "Dutch Smurf. You MUST write in high-tempo, energetic Dutch replacing root words with 'smurf', 'smurfen', and 'smurfig' (e.g., 'smurfen in het bos', 'smurfige melodie'). Integrate playful, fast-paced dance and synth tags, capturing the classic festive Smurf dance vibe. Use tags like '[Snelle kabouter-synthbeat]', '[Vrolijke hoge smurfenstem]', '[Smurfige fluit-riedel]'.";
    case 'smf-ESP':
      return "Spanish Smurf (Pitufo). You MUST write in passionate Spanish, substituting nouns and verbs with 'pitufo', 'pitufar', and 'pitufadora' to create a lively, sunny Iberian rhythm. Use tags like '[Rítmica pitufadora de guitarra]', '[Pitufo-coro entusiasta y agudo]', '[Castañuelas de bosque]'.";
    case 'smf-ITA':
      return "Italian Smurf (Puffo). You MUST write in highly melodic, operatic Italian punctuated with 'puffo', 'puffare', and dramatic expressions. Make the song flow beautifully like a traditional blue-hued canzonetta. Use tags like '[Aria di puffo operistica]', '[Puffo-mandolino saltellante]', '[Soprano puffetta appassionata]'.";
    case 'smf-PPA':
      return "Papa Smurf. You MUST write in a wise, calm, authoritative, and warm paternal tone. Talk about ancient forest history, brewing magical mushroom potions, reading dusty spell books, and guiding the young blue community safely away from wizards' traps. Use performance tags like '[Wise paternal clear baritone]', '[Cauldron bubbling effects]', '[Serene classical woodwind scale]'.";
    case 'smf-SMF':
      return "Smurfette (Lyrical Sass). You MUST write in a sweet, feminine, highly energetic style accented with descriptions of sarsaparilla, daisy chains, playful winks, and 'oh la la' interjections. Style with bubbly pop/synth lines and cute high-register vocal peaks. Use tags like '[High-register sweet female lead]', '[Sassy blue synth-pop hook]', '[Cheerful woodland giggle]'.";
    case 'smf-BRN':
      return "Brainy Smurf. You MUST write in a comically self-important, verbose, lecturing tone. Constantly quote fabricated moral proverbs and start sentences with 'As Papa Smurf always says...' or 'According to my twenty-volume guide...'. The lyrics should be overly detailed, logical but tedious, making others want to kick him out of the village. Use tags like '[Pedantic voice clearing]', '[Lecturing flat monologue speed]', '[Comical slide-whistle landing (he got kicked out)]'.";
    case 'smf-GRY':
      return "Gargamel (Nemesis Growl). You MUST write in a raspy, malicious, theatrical villain tone. Scream about hunting little blue creatures, brewing gold-making potions, and seeking revenge inside your broken stone tower. Constantly mention your lazy cat Azrael. Use performance tags like '[Evil wizard rasping cackle]', '[Azrael catastrophic meowing effect]', '[Dramatic thunder clanger orchestrations]'.";
    case 'pir-ENG':
      return "Pirate English (Old Buccaneer). You MUST compose these lyrics/parts in 17th-century pirate/sailor English: use salty naval slang, theatrical buccaneer declarations (e.g., 'Ahoy', 'Matey', 'Arrgh', 'shiver me timbers', 'ye scallywags', 'grog'), and robust seafaring rhythm, keeping the vocals highly adventurous, proud, and robust.";
    case 'pir-NLD':
      return "Pirate Dutch (Kaper-Lingo). You MUST compose these lyrics/parts in historical Dutch maritime buccaneer lingo: use North Sea privateer slang (e.g., 'Ahoi', 'Maatje', 'Kaper lingo', 'zeerover', 'rum', 'schobbejak', 'kielhalen'), high seas imagery, and rough Zeeland/Enkhuizen fleet metaphors.";
    case 'pir-SPA':
      return "Pirate Spanish (Corsario Dialect). You MUST compose these lyrics/parts in 17th-century Spanish corsair lingo: use Caribbean sea plunder slang and traditional naval commands (e.g., '¡Ahoy!', '¡Corsario!', 'asaltar', 'galeón de oro', 'plata o plomo', 'ron', 'tiburones'), with high theatrical drama.";
    case 'pir-FRA':
      return "Pirate French (Flibustier Patois). You MUST compose these lyrics/parts in 18th-century French buccaneer slang from Tortuga and Port-de-Paix: use filibustier naval lexicon (e.g., 'Ahoi', 'Flibustier', 'Frères de la côte', 'boucanier', 'pillards', 'pistolet de mer', 'rhum royal'), with a proud, melodic French seafaring styling.";
    case 'com-ENFR':
      return "English-French (\"’Allo ’Allo!\" Style). You MUST compose these lyrics/parts in English, but spoken as though it were French, matching the famous comedy style from \"’Allo ’Allo!\". Use heavy French spelling phonetic quirks (e.g., 'ziss', 'zat', 'ze', 'eet', 'clopp', 'sink'), comical French sentence arrangements, dramatic gasps, romantic clichés, and interspersed simple French words ('oui', 'non', 'mon dieu', 's'il vous plaît') sung with a comical exaggerated French-accent lilt.";
    case 'com-NLES':
      return "Dutch-Spanish (Steenkolen-Spaans). You MUST compose these lyrics/parts in Dutch, but spoken disguised as though it were Spanish: use a highly phonetic Spanish accent, Spanish-like conjugation endings appended to Dutch words (-os, -as, -ados), and hilarious literal translations of Iberic culture ('el fietsos', 'de hollandia de quesos', 'si señor, hola amiguitos').";
    case 'com-ENDE':
      return "English-German (Germish / Denglish). You MUST compose these lyrics/parts in English, but styled with a massive, comically rigid German accent and severe Germanic sentence order. Use direct literal translations, compound nouns created from English words, heavy consonants (e.g., 'v' replaces 'w', 'z' replaces 'th'), and occasional German exclamation words (e.g., 'Jawohl!', 'Achtung!', 'Wunderbar!').";
    case 'com-ITFR':
      return "Italian-French (Italo-Français). You MUST compose these lyrics/parts in French, but spoken with a comically exaggerated, dramatic Italian hand-gestured rhythm and accent: append continuous sing-song vocal endings (-a, -e, -i) to French words, use Italian passionate gestures ('mamma mia', 'bello', 'presto'), and high-pitch Italian operatic phrasing.";
    
    // Historical Cinematic English Accents
    case 'his-VIK':
      return "Viking-English (Norse Accent). English spoken with a thick Old Norse phonetic flavor, rolling Rs, robust Viking terminology (such as 'Odin', 'Valhalla', 'longship', 'by Thor'), and movie-style cinematic Norse chants.";
    case 'his-ROM':
      return "Roman-English (Imperial Latin Accent). English spoken with imperial Roman gravity, structured grammatical layouts, theatrical Roman military commands, and classical phrasing (such as 'by the Gods', 'Pax Romana', 'Glory of Rome').";
    case 'his-GRK':
      return "Greek-English (Hellenic Accent). English spoken with a dramatic Hellenic accent, rich intellectual/philosophical rhetoric, rolling vowels, and classical theatrical inflection.";
    case 'his-EGY':
      return "Egyptian-English (Hieroglyphic Accent). English spoken with mystical hieroglyphic rhythm, soft guttural whispers, and ceremonial phrases honoring the solar gods (such as 'Ra', 'Anubis', 'golden sands of the Nile').";
    case 'his-SPA':
      return "Spartan-English (Laconic Accent). English spoken with fierce, laconic brevity, harsh martial tones, and intense battlefield directives (such as 'Come and take them!', 'With your shield or on it!').";
    case 'his-CEL':
      return "Celt-English (Gaelic Lilt). English spoken with rolling, lyrical Celtic lilt, mysterious gaelic-resonant vowels, and tribal-folk epic phrasing.";

    case 'en-GB':
      return "British English. You MUST compose these lyrics using standard British English vocabulary, grammar, spelling, and phonetic styles (RP). Use words like 'colour', 'favour', 'theatre', 'whisky', and standard British phrasing like 'cheeky', 'splendid', 'chap', or 'pavement'. Keep the spelling strictly British.";

    default:
      const d = findDialectById(id);
      return `${d.name}. Compose in ${d.name}${d.description ? ` (${d.description})` : ''}. Make sure to write authentic lyrics in this regional style or dialect naturally.`;
  }
}

function downloadParametersMarkdown(songTitle: string, settings: any) {
  try {
    if (!settings) return;
    const enabledTabs = settings.enabledTabs || {};

    let mdContent = `# Song Parameters Configuration - ${songTitle}\n\n`;
    mdContent += `Below is the active configuration snapshot used by the Google AI lyric generator to draft and compose **"${songTitle}"**.\n\n`;

    // 1. Base instructions and prompt text
    mdContent += `## Lyrical Premise & User Directions\n`;
    mdContent += `- **Core Instructions/Idea:** "${settings.instructions || ''}"\n`;
    if (settings.musicInspiration) {
      mdContent += `- **Stylistic Artists/Music Inspiration:** "${settings.musicInspiration}"\n`;
    }
    mdContent += `\n`;

    // 2. Sliders
    let slidersSection = '';
    if (enabledTabs.innuendoLevel && settings.innuendoLevel !== undefined) {
      const step = getInnuendoStep(settings.innuendoLevel);
      slidersSection += `- **Sensual Innuendo Scale Level ${step.level}:** "${step.label}" — *${step.description}*\n`;
    }
    if (enabledTabs.epicLevel && settings.epicLevel !== undefined) {
      const step = getEpicStep(settings.epicLevel);
      slidersSection += `- **Epic Drama scale Level ${step.level}:** "${step.label}" — *${step.description}*\n`;
    }
    if (enabledTabs.sillyLevel && settings.sillyLevel !== undefined) {
      const step = getSillyStep(settings.sillyLevel);
      slidersSection += `- **Silliness Whimsicality Level ${step.level}:** "${step.label}" — *${step.description}*\n`;
    }
    if (enabledTabs.sapphicLevel && settings.sapphicLevel !== undefined) {
      const step = getSapphicStep(settings.sapphicLevel);
      slidersSection += `- **Sapphic/Lesbian Meter Level ${step.level}:** "${step.label}" — *${step.description}*\n`;
    }
    if (enabledTabs.wildnessLevel && settings.wildnessLevel !== undefined) {
      const step = getWildnessStep(settings.wildnessLevel);
      slidersSection += `- **Wildness/Chaos Level ${step.level}:** "${step.label}" — *${step.description}*\n`;
    }
    if (slidersSection) {
      mdContent += `## Lyric Mood & Drama Scales\n${slidersSection}\n`;
    }

    // 3. Genres & Styles
    let aestheticsSection = '';
    if (enabledTabs.styles && settings.groupStyles && settings.groupStyles.length > 0) {
      aestheticsSection += `- **Genre Styles:** ${settings.groupStyles.join(', ')}\n`;
    }
    if (enabledTabs.styles && settings.coreGrooves && settings.coreGrooves.length > 0) {
      aestheticsSection += `- **Core Rhythmic Grooves:** ${settings.coreGrooves.join(', ')}\n`;
    }
    if (enabledTabs.instruments && settings.instruments && settings.instruments.length > 0) {
      aestheticsSection += `- **Featured Ensemble Instruments:** ${settings.instruments.join(', ')}\n`;
    }
    if (enabledTabs.sfx && settings.soundEffects && settings.soundEffects.length > 0) {
      aestheticsSection += `- **Cinematic Ambient Sound Effects (SFX):** ${settings.soundEffects.join(', ')}\n`;
    }
    if (aestheticsSection) {
      mdContent += `## Ensemble Style & Instrumentation\n${aestheticsSection}\n`;
    }

    // 4. Vocal and performance cast
    let vocalsSection = '';
    if (enabledTabs.accent && settings.dialectId) {
      const dialectNames = settings.dialectId.split(',').filter(Boolean).map((id: string) => findDialectById(id)?.name || id).join(', ');
      vocalsSection += `- **Vocal Accent / Dialects:** ${dialectNames}\n`;
    }
    if (enabledTabs.emotion && settings.emotion) {
      vocalsSection += `- **Group Track Vibe/Emotion:** ${settings.emotion}\n`;
      if (settings.singerEmotions) {
        vocalsSection += `  - *Miranda's Vibe:* ${settings.singerEmotions.miranda || 'Joyful'}\n`;
        vocalsSection += `  - *Annelies's Vibe:* ${settings.singerEmotions.annelies || 'Joyful'}\n`;
        vocalsSection += `  - *Fannie's Vibe:* ${settings.singerEmotions.fannie || 'Joyful'}\n`;
        vocalsSection += `  - *Emma's Vibe:* ${settings.singerEmotions.emma || 'Joyful'}\n`;
      }
    }
    if (enabledTabs.childVoice) {
      vocalsSection += `- **Juvenile Pitch Filter (Kid Voice Style):** Enabled\n`;
      if (settings.singerChildVoices) {
        vocalsSection += `  - *Miranda:* ${settings.singerChildVoices.miranda ? 'Child Voice' : 'Adult Voice'}\n`;
        vocalsSection += `  - *Annelies:* ${settings.singerChildVoices.annelies ? 'Child Voice' : 'Adult Voice'}\n`;
        vocalsSection += `  - *Fannie:* ${settings.singerChildVoices.fannie ? 'Child Voice' : 'Adult Voice'}\n`;
        vocalsSection += `  - *Emma:* ${settings.singerChildVoices.emma ? 'Child Voice' : 'Adult Voice'}\n`;
      }
    }
    if (enabledTabs.partnerUp && settings.singerPartnerUps) {
      const harmonizers = Object.entries(settings.singerPartnerUps).filter(([_, active]) => active).map(([n]) => n.charAt(0).toUpperCase() + n.slice(1)).join(' & ');
      vocalsSection += `- **Vocal Harmonies Duet pairings:** ${harmonizers || 'None'}\n`;
    }
    if (vocalsSection) {
      mdContent += `## Vocal Roles & Delivery\n${vocalsSection}\n`;
    }

    // 5. Rhythmic structure
    let theorySection = '';
    if (enabledTabs.musicalKey && settings.musicalKey) {
      theorySection += `- **Musical Key Archetype:** ${settings.musicalKey}\n`;
    }
    if (enabledTabs.beatsPerMinute && settings.bpm) {
      theorySection += `- **Tempo Speed:** ${settings.bpm} BPM\n`;
    }
    if (enabledTabs.timeSignature && settings.timeSignature) {
      theorySection += `- **Time Signature Rhythm Meter:** ${settings.timeSignature}\n`;
    }
    if (enabledTabs.intro && settings.introConfig?.enabled) {
      theorySection += `- **Instrumental Prelude/Intro Specification:** Included (~${settings.introConfig.duration}s featuring ${settings.introConfig.instruments?.join(', ') || 'theme ensemble'})\n`;
    }
    if (enabledTabs.outro && settings.outroConfig?.enabled) {
      theorySection += `- **Instrumental Postlude/Outro Specification:** Included (~${settings.outroConfig.duration}s featuring ${settings.outroConfig.instruments?.join(', ') || 'theme ensemble'})\n`;
    }
    if (theorySection) {
      mdContent += `## Musical Theory & Arrangement Structures\n${theorySection}\n`;
    }

    // 6. Poetics & safety
    let rulesSection = '';
    if (enabledTabs.rhymeScheme && settings.rhymeId) {
      rulesSection += `- **Rhyme Poetry Constraint:** ${findRhymeTypeById(settings.rhymeId)?.name || settings.rhymeId}\n`;
    }
    if (enabledTabs.lyricsReversal) {
      rulesSection += `- **Vocal Direction Modulation:** Lyrics Reversal Active\n`;
    }
    if (enabledTabs.rating && settings.rating) {
      rulesSection += `- **Lyrical Safety Boundaries (Rating):** ${settings.rating}\n`;
    }
    if (enabledTabs.selfReflecting) {
      rulesSection += `- **Self-Reflective Storytelling:** ${settings.selfReflect ? 'Allowed/Open' : 'Blocked/Restricted'}\n`;
    }
    if (rulesSection) {
      mdContent += `## Composition Constraints & Safety Rules\n${rulesSection}\n`;
    }

    // Build blob and trigger download
    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safeTitle = songTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'untitled';
    a.href = url;
    a.download = `${safeTitle}-params.md`;
    a.click();
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Failed to download parameters markdown file:', err);
  }
}

function downloadDetailsMarkdown(title: string, style: string, lyrics: string) {
  try {
    let mdContent = `# Output Song Reference: ${title}\n\n`;
    mdContent += `## Music Style & Instrumentation\n${style || 'No style details specified'}\n\n`;
    mdContent += `## Lyrical Composition\n\n${lyrics || 'No lyrics composed yet.'}\n`;
    
    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safeTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'untitled';
    a.href = url;
    a.download = `${safeTitle}-details.md`;
    a.click();
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Failed to download details markdown file:', err);
  }
}

function downloadKaraokeMarkdown(title: string, lyrics: string) {
  try {
    const cleanLyrics = getCleanFormattedLyrics(lyrics);
    let mdContent = `# Karaoke Lyrics: ${title}\n\n`;
    mdContent += `${cleanLyrics || 'No lyrics composed yet.'}\n`;
    
    const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safeTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'untitled';
    a.href = url;
    a.download = `${safeTitle}.md`;
    a.click();
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Failed to download karaoke markdown file:', err);
  }
}

function downloadCustomMarkdown(title: string, suffix: string, markdown: string) {
  try {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safeTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'untitled';
    a.href = url;
    a.download = `${safeTitle}-${suffix}.md`;
    a.click();
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error(`Failed to download ${suffix} markdown file:`, err);
  }
}

export function useNoorApp() {
  const [song, setSong] = useState<Song>(() => {
    const saved = localStorage.getItem('noor-song');
    if (saved) return JSON.parse(saved);
    return { 
      title: '', 
      style: '', 
      lyrics: '',
      imagePrompts: { start: '', middle: '', end: '' },
      story: '',
      storyPrompts: {
        miranda: { wan: '', sdxl: '' },
        annelies: { wan: '', sdxl: '' },
        fannie: { wan: '', sdxl: '' },
        emma: { wan: '', sdxl: '' },
        mirandaAnnelies: { wan: '', sdxl: '' },
        fannieEmma: { wan: '', sdxl: '' },
        group: { wan: '', sdxl: '' }
      }
    };
  });

  useEffect(() => {
    localStorage.setItem('noor-song', JSON.stringify(song));
  }, [song]);

  const [selectedInstruments, setSelectedInstruments] = useState<string[]>(() => {
    const saved = localStorage.getItem('noor-selected-instruments');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('noor-selected-instruments', JSON.stringify(selectedInstruments));
  }, [selectedInstruments]);

  const [selectedStyles, setSelectedStyles] = useState<string[]>(() => {
    const saved = localStorage.getItem('noor-selected-styles');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('noor-selected-styles', JSON.stringify(selectedStyles));
  }, [selectedStyles]);

  const [activeJob, setActiveJob] = useState<Job | null>(null);
  const [showLogs, setShowLogs] = useState(false);
  const [showGenerate, setShowGenerate] = useState(false);
  const [showKaraoke, setShowKaraoke] = useState(false);
  const [showSpoiler, setShowSpoiler] = useState(false);
  const [showImagePrompts, setShowImagePrompts] = useState(false);
  const [showStory, setShowStory] = useState(false);
  const [showPortrait, setShowPortrait] = useState(false);
  const [showWardrobe, setShowWardrobe] = useState(false);
  const [showCulinary, setShowCulinary] = useState(false);
  const [showFarm, setShowFarm] = useState(false);

  const [isMp3Matched, setIsMp3Matched] = useState(false);

  useEffect(() => {
    setIsMp3Matched(false);
  }, [song.title]);

  const [activePortraitType, setActivePortraitType] = useState<PortraitType>('Face');
  const [portraitPrompts, setPortraitPrompts] = useState<Record<PortraitType, PortraitPrompts>>(() => {
    const saved = localStorage.getItem('noor-portrait-prompts');
    if (saved) return JSON.parse(saved);
    const empty = { wan: '', sdxl: '' };
    const emptyPrompts = { miranda: { ...empty }, annelies: { ...empty }, fannie: { ...empty }, emma: { ...empty } };
    return {
      Face: { ...emptyPrompts },
      Torso: { ...emptyPrompts },
      Body: { ...emptyPrompts }
    };
  });
  const [rating, setRating] = useState<string>(() => localStorage.getItem('noor-rating') || 'PG');

  useEffect(() => {
    localStorage.setItem('noor-rating', rating);
  }, [rating]);

  const [selectedDialectId, setSelectedDialectId] = useState<string>(() => localStorage.getItem('noor-dialect-id') || '');

  useEffect(() => {
    localStorage.setItem('noor-dialect-id', selectedDialectId);
  }, [selectedDialectId]);

  const [innuendoLevel, setInnuendoLevel] = useState<number>(() => {
    const saved = localStorage.getItem('noor-innuendo-level');
    return saved ? parseInt(saved, 10) : 0;
  });

  useEffect(() => {
    localStorage.setItem('noor-innuendo-level', innuendoLevel.toString());
  }, [innuendoLevel]);

  const [epicLevel, setEpicLevel] = useState<number>(() => {
    const saved = localStorage.getItem('noor-epic-level');
    return saved ? parseInt(saved, 10) : 0;
  });

  useEffect(() => {
    localStorage.setItem('noor-epic-level', epicLevel.toString());
  }, [epicLevel]);

  const [sillyLevel, setSillyLevel] = useState<number>(() => {
    const saved = localStorage.getItem('noor-silly-level');
    return saved ? parseInt(saved, 10) : 0;
  });

  useEffect(() => {
    localStorage.setItem('noor-silly-level', sillyLevel.toString());
  }, [sillyLevel]);

  const [sapphicLevel, setSapphicLevel] = useState<number>(() => {
    const saved = localStorage.getItem('noor-sapphic-level');
    return saved ? parseInt(saved, 10) : 0;
  });

  useEffect(() => {
    localStorage.setItem('noor-sapphic-level', sapphicLevel.toString());
  }, [sapphicLevel]);

  const [wildnessLevel, setWildnessLevel] = useState<number>(() => {
    const saved = localStorage.getItem('noor-wildness-level');
    return saved ? parseInt(saved, 10) : 0;
  });

  useEffect(() => {
    localStorage.setItem('noor-wildness-level', wildnessLevel.toString());
  }, [wildnessLevel]);

  const [rhymeId, setRhymeId] = useState<string>(() => {
    return localStorage.getItem('noor-rhyme-id') || 'perfect';
  });

  useEffect(() => {
    localStorage.setItem('noor-rhyme-id', rhymeId);
  }, [rhymeId]);

  const [musicalKey, setMusicalKey] = useState<string>(() => {
    return localStorage.getItem('noor-musical-key') || 'C Major';
  });

  useEffect(() => {
    localStorage.setItem('noor-musical-key', musicalKey);
  }, [musicalKey]);

  const [bpm, setBpm] = useState<number>(() => {
    const saved = localStorage.getItem('noor-bpm');
    return saved ? parseInt(saved, 10) : 120;
  });

  useEffect(() => {
    localStorage.setItem('noor-bpm', bpm.toString());
  }, [bpm]);

  const [timeSignature, setTimeSignature] = useState<string>(() => {
    return localStorage.getItem('noor-time-signature') || '4/4';
  });

  useEffect(() => {
    localStorage.setItem('noor-time-signature', timeSignature);
  }, [timeSignature]);
  const [helpContent, setHelpContent] = useState<{ title: string; content: string; filename?: string } | null>(null);
  const [selectedSinger, setSelectedSinger] = useState<{ name: string; photo: string; bioPath: string } | null>(null);
  
  const [childVoice, setChildVoice] = useState<boolean>(() => {
    return localStorage.getItem('noor-child-voice') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('noor-child-voice', childVoice ? 'true' : 'false');
  }, [childVoice]);

  const [singerChildVoices, setSingerChildVoices] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('noor-singer-child-voices');
    return saved ? JSON.parse(saved) : { miranda: false, annelies: false, fannie: false, emma: false };
  });

  useEffect(() => {
    localStorage.setItem('noor-singer-child-voices', JSON.stringify(singerChildVoices));
  }, [singerChildVoices]);

  const [singerEmotions, setSingerEmotions] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('noor-singer-emotions');
    return saved ? JSON.parse(saved) : { miranda: 'Joyful', annelies: 'Joyful', fannie: 'Joyful', emma: 'Joyful' };
  });

  useEffect(() => {
    localStorage.setItem('noor-singer-emotions', JSON.stringify(singerEmotions));
  }, [singerEmotions]);

  const [singerPrompts, setSingerPrompts] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('noor-singer-prompts');
    return saved ? JSON.parse(saved) : { miranda: '', annelies: '', fannie: '', emma: '' };
  });

  useEffect(() => {
    localStorage.setItem('noor-singer-prompts', JSON.stringify(singerPrompts));
  }, [singerPrompts]);

  const [singerInstruments, setSingerInstruments] = useState<Record<string, string[]>>(() => {
    const saved = localStorage.getItem('noor-singer-instruments');
    return saved ? JSON.parse(saved) : { miranda: [], annelies: [], fannie: [], emma: [] };
  });

  useEffect(() => {
    localStorage.setItem('noor-singer-instruments', JSON.stringify(singerInstruments));
  }, [singerInstruments]);

  const [singerPartnerUps, setSingerPartnerUps] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('noor-singer-partner-ups');
    return saved ? JSON.parse(saved) : { miranda: false, annelies: false, fannie: false, emma: false };
  });

  useEffect(() => {
    localStorage.setItem('noor-singer-partner-ups', JSON.stringify(singerPartnerUps));
  }, [singerPartnerUps]);

  const [singerNationalities, setSingerNationalities] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('noor-singer-nationalities');
    return saved ? JSON.parse(saved) : { miranda: '', annelies: '', fannie: '', emma: '' };
  });

  useEffect(() => {
    localStorage.setItem('noor-singer-nationalities', JSON.stringify(singerNationalities));
  }, [singerNationalities]);

  const [selfReflect, setSelfReflect] = useState<boolean>(() => {
    const saved = localStorage.getItem('noor-self-reflect');
    return saved !== null ? saved === 'true' : true;
  });

  useEffect(() => {
    localStorage.setItem('noor-self-reflect', selfReflect ? 'true' : 'false');
  }, [selfReflect]);

  const [reverseLyricsEnabled, setReverseLyricsEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('noor-reverse-lyrics');
    return saved !== null ? saved === 'true' : false;
  });

  useEffect(() => {
    localStorage.setItem('noor-reverse-lyrics', reverseLyricsEnabled ? 'true' : 'false');
  }, [reverseLyricsEnabled]);

  const [selectedSoundEffects, setSelectedSoundEffects] = useState<string[]>(() => {
    const saved = localStorage.getItem('noor-selected-sound-effects');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('noor-selected-sound-effects', JSON.stringify(selectedSoundEffects));
  }, [selectedSoundEffects]);

  const [introConfig, setIntroConfig] = useState<IntroOutroConfig>(() => {
    const saved = localStorage.getItem('noor-intro-config');
    return saved ? JSON.parse(saved) : { enabled: false, duration: 15, instruments: [] };
  });

  useEffect(() => {
    localStorage.setItem('noor-intro-config', JSON.stringify(introConfig));
  }, [introConfig]);

  const [outroConfig, setOutroConfig] = useState<IntroOutroConfig>(() => {
    const saved = localStorage.getItem('noor-outro-config');
    return saved ? JSON.parse(saved) : { enabled: false, duration: 15, instruments: [] };
  });

  useEffect(() => {
    localStorage.setItem('noor-outro-config', JSON.stringify(outroConfig));
  }, [outroConfig]);

  const [apiKey, setApiKey] = useState<string | null>(() => localStorage.getItem('noor-api-key') || null);

  useEffect(() => {
    if (apiKey) localStorage.setItem('noor-api-key', apiKey);
    else localStorage.removeItem('noor-api-key');
  }, [apiKey]);

  const [leftLibrary, setLeftLibrary] = useState<LibraryItem[]>(() => {
    const saved = localStorage.getItem('noor-left-library');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('noor-left-library', JSON.stringify(leftLibrary));
  }, [leftLibrary]);

  const [rightLibrary, setRightLibrary] = useState<LibraryItem[]>(() => {
    const saved = localStorage.getItem('noor-right-library');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('noor-right-library', JSON.stringify(rightLibrary));
  }, [rightLibrary]);

  const [viewItem, setViewItem] = useState<LibraryItem | null>(null);
  const [showContentSettings, setShowContentSettings] = useState(false);
  const [forbiddenTopics, setForbiddenTopics] = useState<ForbiddenTopics>(() => {
    const saved = localStorage.getItem('noor-forbidden-topics');
    if (saved) return JSON.parse(saved);
    return {
      barefoot: false,
      naturism: false,
      farm: false,
      singers: false
    };
  });

  useEffect(() => {
    localStorage.setItem('noor-forbidden-topics', JSON.stringify(forbiddenTopics));
  }, [forbiddenTopics]);

  const handleToggleForbiddenTopic = (topic: keyof ForbiddenTopics) => {
    setForbiddenTopics(prev => ({
      ...prev,
      [topic]: !prev[topic]
    }));
  };

  useEffect(() => {
    const initLeft = async () => {
      // No longer adding JSON files to left library as we have specialized sidebars
      setLeftLibrary([]);
    };
    
    const initRight = async () => {
      const singers = [
        { name: 'Miranda Noor', base: 'Miranda_Noor' },
        { name: 'Annelies Brink', base: 'Annelies_Brink' },
        { name: 'Fannie de Jong', base: 'Fannie_de_Jong' },
        { name: 'Emma Vermeer', base: 'Emma_Vermeer' },
      ];
      
      const singerItems: LibraryItem[] = [];
      
      singers.forEach(s => {
        // Add Image
        singerItems.push({
          id: `singer-img-${s.base}`,
          name: `${s.name} (Portrait)`,
          type: 'image',
          content: `/singers/${s.base}.jpg`,
          sourceUrl: `/singers/${s.base}.jpg`
        });
        
        // Add Document
        singerItems.push({
          id: `singer-doc-${s.base}`,
          name: `${s.name} (Bio)`,
          type: 'markdown',
          content: `/singers/${s.base}.md`,
          sourceUrl: `/singers/${s.base}.md`
        });
      });
      
      setRightLibrary(prev => {
        const existingIds = new Set(prev.map(item => item.id));
        const newItems = singerItems.filter(item => !existingIds.has(item.id));
        if (newItems.length === 0) return prev;
        return [...prev, ...newItems].sort((a, b) => a.name.localeCompare(b.name));
      });
    };

    initLeft();
    initRight();
  }, []);

  useEffect(() => {
    const checkKey = async () => {
      const win = window as any;
      if (win.aistudio?.hasSelectedApiKey) {
        const hasKey = await win.aistudio.hasSelectedApiKey();
        if (hasKey) {
          setApiKey(process.env.GEMINI_API_KEY || null);
        }
      }
    };
    checkKey();
  }, []);

  const { addJob, jobs, clearQueue } = useJobQueue();
  const { log, clear: clearLogs } = useLogs();

  const [doubleFailedAlerts, setDoubleFailedAlerts] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('noor-double-failed-alerts');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    localStorage.setItem('noor-double-failed-alerts', JSON.stringify(Array.from(doubleFailedAlerts)));
  }, [doubleFailedAlerts]);

  const [doubleFailedJob, setDoubleFailedJob] = useState<Job | null>(null);

  useEffect(() => {
    const doubleFailed = jobs.find(j => j.status === 'failed' && j.retryCount === 2 && !doubleFailedAlerts.has(j.id));
    if (doubleFailed) {
      setDoubleFailedAlerts(prev => {
        const next = new Set(prev);
        next.add(doubleFailed.id);
        return next;
      });
      setDoubleFailedJob(doubleFailed);
    }
  }, [jobs, doubleFailedAlerts]);

  const handleToggleInstrument = (name: string) => {
    setSelectedInstruments(prev => 
      prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
    );
  };

  const handleToggleStyle = (name: string) => {
    setSelectedStyles(prev => 
      prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
    );
  };

  useEffect(() => {
    const quartet = "Female vocal quartet (Soprano, Alto, Mezzo-Soprano, Feminine Contralto)";
    const combined = [quartet, ...selectedStyles, ...selectedInstruments].join(', ');
    setSong(prev => ({ ...prev, style: combined }));
  }, [selectedInstruments, selectedStyles]);

  const handleGenerate = (
    instructions: string, 
    musicInspiration?: string, 
    targetDialectId?: string, 
    targetRating?: string, 
    coreGrooves?: string[], 
    emotion?: string,
    targetInstruments?: string[],
    targetStyles?: string[],
    targetChildVoice?: boolean,
    targetSoundEffects?: string[],
    targetIntroConfig?: IntroOutroConfig,
    targetOutroConfig?: IntroOutroConfig,
    targetSelfReflect?: boolean,
    targetInnuendoLevel?: number,
    targetReverseLyrics?: boolean,
    targetEpicLevel?: number,
    targetRhymeId?: string,
    targetSillyLevel?: number,
    targetSapphicLevel?: number,
    targetWildnessLevel?: number,
    targetMusicalKey?: string,
    targetBpm?: number,
    targetTimeSignature?: string,
    targetSingerChildVoices?: Record<string, boolean>,
    targetSingerEmotions?: Record<string, string>,
    targetSingerPrompts?: Record<string, string>,
    targetSingerInstruments?: Record<string, string[]>,
    targetSingerPartnerUps?: Record<string, boolean>,
    targetSingerNationalities?: Record<string, string>,
    targetSuggestedTitle?: string,
    targetEnabledTabs?: Record<string, boolean>,
    targetExactTitle?: boolean,
    targetIntentEnergy?: string[],
    targetImageDescription?: string
  ) => {
    const activeEnabledTabs = targetEnabledTabs || {};

    // 1. Language Dialect Resolution (Default is British English en-GB)
    let resolvedDialectId = 'en-GB';
    if (activeEnabledTabs.accent) {
      resolvedDialectId = targetDialectId !== undefined ? targetDialectId : selectedDialectId;
    }

    const resolvedSingerNationalities = targetSingerNationalities !== undefined ? targetSingerNationalities : singerNationalities;

    // 2. Instruments Default and Override Rules
    const instrumentsActive = activeEnabledTabs.instruments;
    const soloInstrumentsActive = activeEnabledTabs.singerInstruments;
    
    let resolvedInstruments: string[] = [];
    let resolvedSingerInstruments: Record<string, string[]> = {
      miranda: [],
      annelies: [],
      fannie: [],
      emma: []
    };

    if (!instrumentsActive && !soloInstrumentsActive) {
      const hasAnyNationality = Object.values(resolvedSingerNationalities).some(val => !!val);
      if (hasAnyNationality) {
        resolvedSingerInstruments = {
          miranda: [],
          annelies: [],
          fannie: [],
          emma: []
        };
        const uniqueSolo = new Set<string>();
        Object.entries(resolvedSingerNationalities).forEach(([singerId, natId]) => {
          if (natId) {
            const nat = findNationalityById(natId);
            if (nat && nat.defaultInstruments) {
              resolvedSingerInstruments[singerId] = [...nat.defaultInstruments];
              nat.defaultInstruments.forEach(inst => uniqueSolo.add(inst));
            }
          }
        });

        // Fill empty singers with default traditional instruments as fallback
        if (resolvedSingerInstruments.miranda.length === 0) resolvedSingerInstruments.miranda = ['bagpipes'];
        if (resolvedSingerInstruments.emma.length === 0) resolvedSingerInstruments.emma = ['bagpipes'];
        if (resolvedSingerInstruments.annelies.length === 0) resolvedSingerInstruments.annelies = ['crwth'];
        if (resolvedSingerInstruments.fannie.length === 0) resolvedSingerInstruments.fannie = ['crwth'];

        resolvedSingerInstruments.miranda.forEach(i => uniqueSolo.add(i));
        resolvedSingerInstruments.emma.forEach(i => uniqueSolo.add(i));
        resolvedSingerInstruments.annelies.forEach(i => uniqueSolo.add(i));
        resolvedSingerInstruments.fannie.forEach(i => uniqueSolo.add(i));

        resolvedInstruments = Array.from(uniqueSolo);
      } else {
        // Default instruments: bagpipes (Miranda, Emma) and Crwth (Annelies, Fannie)
        resolvedInstruments = ['bagpipes', 'crwth'];
        resolvedSingerInstruments = {
          miranda: ['bagpipes'],
          emma: ['bagpipes'],
          annelies: ['crwth'],
          fannie: ['crwth']
        };
      }
    } else if (soloInstrumentsActive) {
      // Solo instruments replace defaults
      resolvedSingerInstruments = targetSingerInstruments !== undefined ? targetSingerInstruments : singerInstruments;
      const uniqueSolo = new Set<string>();
      Object.values(resolvedSingerInstruments).forEach(arr => {
        if (arr) arr.forEach(inst => uniqueSolo.add(inst));
      });
      resolvedInstruments = Array.from(uniqueSolo);
    } else {
      resolvedInstruments = targetInstruments !== undefined ? targetInstruments : selectedInstruments;
    }

    // 3. Resolve remaining inputs conditionally based on enabled tabs status
    const resolvedRating = activeEnabledTabs.rating ? (targetRating !== undefined ? targetRating : rating) : '';
    const resolvedStyles = activeEnabledTabs.styles ? (targetStyles !== undefined ? targetStyles : selectedStyles) : [];
    const resolvedChildVoice = activeEnabledTabs.childVoice ? (targetChildVoice !== undefined ? targetChildVoice : childVoice) : false;
    const resolvedSoundEffects = activeEnabledTabs.sfx ? (targetSoundEffects !== undefined ? targetSoundEffects : selectedSoundEffects) : [];
    const resolvedIntroConfig = activeEnabledTabs.intro ? (targetIntroConfig !== undefined ? targetIntroConfig : introConfig) : { enabled: false, duration: 15, instruments: [] };
    const resolvedOutroConfig = activeEnabledTabs.outro ? (targetOutroConfig !== undefined ? targetOutroConfig : outroConfig) : { enabled: false, duration: 15, instruments: [] };
    const resolvedSelfReflect = activeEnabledTabs.selfReflecting ? (targetSelfReflect !== undefined ? targetSelfReflect : selfReflect) : true;
    const resolvedInnuendoLevel = activeEnabledTabs.innuendoLevel ? (targetInnuendoLevel !== undefined ? targetInnuendoLevel : innuendoLevel) : undefined;
    const resolvedReverseLyrics = activeEnabledTabs.lyricsReversal ? (targetReverseLyrics !== undefined ? targetReverseLyrics : reverseLyricsEnabled) : false;
    const resolvedEpicLevel = activeEnabledTabs.epicLevel ? (targetEpicLevel !== undefined ? targetEpicLevel : epicLevel) : undefined;
    const resolvedRhymeId = activeEnabledTabs.rhymeScheme ? (targetRhymeId !== undefined ? targetRhymeId : rhymeId) : '';
    const resolvedSillyLevel = activeEnabledTabs.sillyLevel ? (targetSillyLevel !== undefined ? targetSillyLevel : sillyLevel) : undefined;
    const resolvedSapphicLevel = activeEnabledTabs.sapphicLevel ? (targetSapphicLevel !== undefined ? targetSapphicLevel : sapphicLevel) : undefined;
    const resolvedWildnessLevel = activeEnabledTabs.wildnessLevel ? (targetWildnessLevel !== undefined ? targetWildnessLevel : wildnessLevel) : undefined;
    const resolvedMusicalKey = activeEnabledTabs.musicalKey ? (targetMusicalKey !== undefined ? targetMusicalKey : musicalKey) : '';
    const resolvedBpm = activeEnabledTabs.beatsPerMinute ? (targetBpm !== undefined ? targetBpm : bpm) : undefined;
    const resolvedTimeSignature = activeEnabledTabs.timeSignature ? (targetTimeSignature !== undefined ? targetTimeSignature : timeSignature) : '';
    const resolvedSingerChildVoices = activeEnabledTabs.childVoice ? (targetSingerChildVoices !== undefined ? targetSingerChildVoices : singerChildVoices) : { miranda: false, annelies: false, fannie: false, emma: false };
    const resolvedSingerEmotions = activeEnabledTabs.emotion ? (targetSingerEmotions !== undefined ? targetSingerEmotions : singerEmotions) : { miranda: 'Joyful', annelies: 'Joyful', fannie: 'Joyful', emma: 'Joyful' };
    const resolvedSingerPrompts = activeEnabledTabs.singers ? (targetSingerPrompts !== undefined ? targetSingerPrompts : singerPrompts) : { miranda: '', annelies: '', fannie: '', emma: '' };
    const resolvedSingerPartnerUps = activeEnabledTabs.partnerUp ? (targetSingerPartnerUps !== undefined ? targetSingerPartnerUps : singerPartnerUps) : { miranda: false, annelies: false, fannie: false, emma: false };

    // Sync non-undefined states back to application hooks
    if (activeEnabledTabs.accent && targetDialectId !== undefined && targetDialectId !== selectedDialectId) {
      setSelectedDialectId(targetDialectId);
    }
    if (activeEnabledTabs.rating && targetRating !== undefined && targetRating !== rating) {
      setRating(targetRating);
    }
    if (instrumentsActive && targetInstruments !== undefined) {
      setSelectedInstruments(targetInstruments);
    }
    if (activeEnabledTabs.styles && targetStyles !== undefined) {
      setSelectedStyles(targetStyles);
    }
    if (activeEnabledTabs.childVoice && targetChildVoice !== undefined) {
      setChildVoice(targetChildVoice);
    }
    if (activeEnabledTabs.sfx && targetSoundEffects !== undefined) {
      setSelectedSoundEffects(targetSoundEffects);
    }
    if (activeEnabledTabs.intro && targetIntroConfig !== undefined) {
      setIntroConfig(targetIntroConfig);
    }
    if (activeEnabledTabs.outro && targetOutroConfig !== undefined) {
      setOutroConfig(targetOutroConfig);
    }
    if (activeEnabledTabs.selfReflecting && targetSelfReflect !== undefined) {
      setSelfReflect(targetSelfReflect);
    }
    if (activeEnabledTabs.innuendoLevel && targetInnuendoLevel !== undefined) {
      setInnuendoLevel(targetInnuendoLevel);
    }
    if (activeEnabledTabs.lyricsReversal && targetReverseLyrics !== undefined) {
      setReverseLyricsEnabled(targetReverseLyrics);
    }
    if (activeEnabledTabs.epicLevel && targetEpicLevel !== undefined) {
      setEpicLevel(targetEpicLevel);
    }
    if (activeEnabledTabs.rhymeScheme && targetRhymeId !== undefined) {
      setRhymeId(targetRhymeId);
    }
    if (activeEnabledTabs.sillyLevel && targetSillyLevel !== undefined) {
      setSillyLevel(targetSillyLevel);
    }
    if (activeEnabledTabs.sapphicLevel && targetSapphicLevel !== undefined) {
      setSapphicLevel(targetSapphicLevel);
    }
    if (activeEnabledTabs.wildnessLevel && targetWildnessLevel !== undefined) {
      setWildnessLevel(targetWildnessLevel);
    }
    if (activeEnabledTabs.musicalKey && targetMusicalKey !== undefined) {
      setMusicalKey(targetMusicalKey);
    }
    if (activeEnabledTabs.beatsPerMinute && targetBpm !== undefined) {
      setBpm(targetBpm);
    }
    if (activeEnabledTabs.childVoice && targetSingerChildVoices !== undefined) {
      setSingerChildVoices(targetSingerChildVoices);
    }
    if (activeEnabledTabs.emotion && targetSingerEmotions !== undefined) {
      setSingerEmotions(targetSingerEmotions);
    }
    if (activeEnabledTabs.singers && targetSingerPrompts !== undefined) {
      setSingerPrompts(targetSingerPrompts);
    }
    if (soloInstrumentsActive && targetSingerInstruments !== undefined) {
      setSingerInstruments(targetSingerInstruments);
    }
    if (activeEnabledTabs.partnerUp && targetSingerPartnerUps !== undefined) {
      setSingerPartnerUps(targetSingerPartnerUps);
    }
    if (targetSingerNationalities !== undefined) {
      setSingerNationalities(targetSingerNationalities);
    }
    if (activeEnabledTabs.timeSignature && targetTimeSignature !== undefined) {
      setTimeSignature(targetTimeSignature);
    }

    const dialectIds = resolvedDialectId.split(',').filter(Boolean);
    const primaryDialectId = dialectIds[0] || 'en-GB';
    let languageInfo = '';
    
    if (dialectIds.length === 0 || resolvedDialectId === 'en-GB') {
      languageInfo = "British English. You MUST compose these lyrics using standard British English vocabulary, grammar, spelling, and phonetic styles (RP). Use words like 'colour', 'favour', 'theatre', 'whisky', and standard British phrasing like 'cheeky', 'splendid', 'chap', or 'pavement'. Keep the spelling strictly British.";
    } else if (dialectIds.length === 1) {
      languageInfo = getDialectStyleRules(primaryDialectId);
    } else {
      const languageNames = dialectIds.map(id => findDialectById(id)?.name || id).join(', ');
      const primaryName = findDialectById(primaryDialectId)?.name || primaryDialectId;
      languageInfo = `BILINGUAL/MULTILINGUAL COMPOSITION (CRITICAL): This song MUST be composed in MULTIPLE LANGUAGES. The active languages in order of importance are: ${languageNames}. The primary language is ${primaryName}.
You must weave these languages together throughout the song - for example, write some verses/chorus lines in the primary language, other sections/verses in the secondary/supporting languages, blending them smoothly and comically/dramatically as appropriate based on their characters. Do not write full songs in only one language.
Below are the specific styling and composition guidelines for each selected language/accent:
${dialectIds.map((id, index) => `${index + 1}. [${findDialectById(id)?.name || id}]: ${getDialectStyleRules(id)}`).join('\n')}`;
    }

    let singerNationalitiesText = '';
    const activeNationalitiesList = Object.entries(resolvedSingerNationalities)
      .filter(([_, val]) => !!val)
      .map(([singerId, val]) => {
        const nat = findNationalityById(val);
        const nameCapitalized = singerId.charAt(0).toUpperCase() + singerId.slice(1);
        if (nat) {
          return `- **${nameCapitalized}** has the **${nat.name}** national culture/identity.
  * Vocal Accent & Expression Impact: ${nat.accentImpact}
  * Instrumental Performance Style: ${nat.instrumentImpact}`;
        }
        return '';
      })
      .filter(Boolean);

    if (activeNationalitiesList.length > 0) {
      singerNationalitiesText = activeNationalitiesList.join('\n');
    }

    let intentEnergyText = '';
    if (activeEnabledTabs.intentEnergy && targetIntentEnergy && targetIntentEnergy.length > 0) {
      const selectedSpecs = targetIntentEnergy
        .map(id => INTENT_ENERGY_GROUPS_LOOKUP[id])
        .filter(Boolean);
      
      if (selectedSpecs.length > 0) {
        const groupedMap: Record<string, string[]> = {};
        selectedSpecs.forEach(spec => {
          const key = `${spec.category} (${spec.umbrella})`;
          if (!groupedMap[key]) {
            groupedMap[key] = [];
          }
          groupedMap[key].push(`- **${spec.name}** (${spec.examples}): ${spec.description}`);
        });

        intentEnergyText = Object.entries(groupedMap)
          .map(([groupHeader, items]) => `### ${groupHeader}\n${items.join('\n')}`)
          .join('\n\n');
      }
    }

    const innuendoText = resolvedInnuendoLevel !== undefined ? `${getInnuendoStep(resolvedInnuendoLevel).level}. ${getInnuendoStep(resolvedInnuendoLevel).label} - ${getInnuendoStep(resolvedInnuendoLevel).description}` : '';
    const epicText = resolvedEpicLevel !== undefined ? `${getEpicStep(resolvedEpicLevel).level}. ${getEpicStep(resolvedEpicLevel).label} - ${getEpicStep(resolvedEpicLevel).description}` : '';
    const rhymeText = resolvedRhymeId ? `${findRhymeTypeById(resolvedRhymeId)?.name}: ${findRhymeTypeById(resolvedRhymeId)?.description}` : '';
    const sillyText = resolvedSillyLevel !== undefined ? `${getSillyStep(resolvedSillyLevel).level}. ${getSillyStep(resolvedSillyLevel).label} - ${getSillyStep(resolvedSillyLevel).description}` : '';
    const sapphicText = resolvedSapphicLevel !== undefined ? `${getSapphicStep(resolvedSapphicLevel).level}. ${getSapphicStep(resolvedSapphicLevel).label} - ${getSapphicStep(resolvedSapphicLevel).description}` : '';
    const wildnessText = resolvedWildnessLevel !== undefined ? `${getWildnessStep(resolvedWildnessLevel).level}. ${getWildnessStep(resolvedWildnessLevel).label} - ${getWildnessStep(resolvedWildnessLevel).description}` : '';

    const prompt = GENERATE_LYRICS_PROMPT(
      instructions, 
      resolvedInstruments, 
      resolvedStyles, 
      resolvedRating, 
      forbiddenTopics, 
      languageInfo, 
      musicInspiration, 
      coreGrooves, 
      emotion, 
      resolvedIntroConfig, 
      resolvedOutroConfig, 
      resolvedSelfReflect, 
      innuendoText, 
      epicText, 
      rhymeText, 
      sillyText,
      resolvedMusicalKey,
      resolvedBpm,
      resolvedTimeSignature,
      sapphicText,
      singerNationalitiesText,
      wildnessText,
      targetSuggestedTitle,
      targetExactTitle,
      intentEnergyText
    );

    const generationSettings = {
      instructions,
      musicInspiration: musicInspiration || '',
      dialectId: resolvedDialectId,
      rating: resolvedRating,
      coreGrooves: coreGrooves || [],
      emotion: emotion || 'Joyful',
      childVoice: resolvedChildVoice,
      soundEffects: resolvedSoundEffects,
      introConfig: resolvedIntroConfig,
      outroConfig: resolvedOutroConfig,
      selfReflect: resolvedSelfReflect,
      innuendoLevel: resolvedInnuendoLevel,
      epicLevel: resolvedEpicLevel,
      rhymeId: resolvedRhymeId,
      sillyLevel: resolvedSillyLevel,
      sapphicLevel: resolvedSapphicLevel,
      wildnessLevel: resolvedWildnessLevel,
      musicalKey: resolvedMusicalKey,
      bpm: resolvedBpm,
      timeSignature: resolvedTimeSignature,
      singerChildVoices: resolvedSingerChildVoices,
      singerEmotions: resolvedSingerEmotions,
      singerPrompts: resolvedSingerPrompts,
      singerInstruments: resolvedSingerInstruments,
      singerPartnerUps: resolvedSingerPartnerUps,
      singerNationalities: resolvedSingerNationalities,
      suggestedTitle: targetSuggestedTitle || '',
      exactTitle: targetExactTitle || false,
      intentEnergy: targetIntentEnergy || [],
      enabledTabs: activeEnabledTabs,
      imageDescription: targetImageDescription || ''
    };

    let customSystemInstructions = SYSTEM_INSTRUCTIONS_LYRICS;
    if (resolvedInstruments && resolvedInstruments.length > 0) {
      const hasBagpipes = resolvedInstruments.some(inst => inst.toLowerCase() === 'bagpipes');
      const hasCrwth = resolvedInstruments.some(inst => inst.toLowerCase() === 'crwth');

      // Adjust the default instrument references in style or guidelines since we have an explicitly chosen list
      if (!hasBagpipes && !hasCrwth) {
        customSystemInstructions = customSystemInstructions.replace("- Use the Crwth and bagpipes in interesting ways.", "");
      } else if (!hasBagpipes) {
        customSystemInstructions = customSystemInstructions.replace("- Use the Crwth and bagpipes in interesting ways.", "- Use the Crwth in interesting ways.");
      } else if (!hasCrwth) {
        customSystemInstructions = customSystemInstructions.replace("- Use the Crwth and bagpipes in interesting ways.", "- Use the bagpipes in interesting ways.");
      }

      const originalSkillLine = "Skilled in electric guitars, drums, gongs, synthesizers, bagpipes, the Crwth, and various ancient instruments (Lyre, Aulos, Sistrum, etc.).";
      let resolvedSkillLine = "Skilled in electric guitars, drums, gongs, and synthesizers.";
      if (hasBagpipes || hasCrwth) {
        const customMentioned = [];
        if (hasBagpipes) customMentioned.push("bagpipes");
        if (hasCrwth) customMentioned.push("the Crwth");
        resolvedSkillLine = `Skilled in electric guitars, drums, gongs, synthesizers, ${customMentioned.join(" and ")}.`;
      }
      customSystemInstructions = customSystemInstructions.replace(originalSkillLine, resolvedSkillLine);

      // Add a strict negative constraint so defaults are completely removed from any generation if not explicitly selected
      const dynamicConstraints = `
**STRICT INSTRUMENT USAGE CONSTRAINT:**
The user has active, chosen instruments for this song: [${resolvedInstruments.join(", ")}].
You MUST NOT include the default instruments of the band (such as bagpipes, Crwth, or any other unsuggested ancient instruments) in the styles, lyric tags, performance cues or musical guidelines UNLESS they are explicitly listed in the suggested instruments list above. Rely ONLY on the instruments chosen by the user.
`;
      customSystemInstructions = customSystemInstructions + "\n" + dynamicConstraints;
    }

    if (resolvedChildVoice) {
      customSystemInstructions = customSystemInstructions.replace(
        "Female vocal quartet (Soprano, Alto, Mezzo-Soprano, Feminine Contralto)",
        "Children's vocal quartet (Soprano, Alto, sweet innocent child voices)"
      );
      const childVoiceConstraints = `
**CRITICAL VOCAL PROFILE OVERRIDE:**
The user has requested that this song be sung STRICTLY BY CHILDREN rather than adult female vocalists.
You MUST write all singer tags and performance guidelines to specify children's vocals (e.g., [Children's Choir], [Boy Soprano], [Girl Soprano], [Child Solo - Sweet and Innocent voice]). Ensure the song's key, tempo, thematic vocabulary, and emotional expressions perfectly fit sweet, pure children's voices. Keep the entire production highly appropriate, wholesome, and innocent.
`;
      customSystemInstructions = customSystemInstructions + "\n" + childVoiceConstraints;
    }

    if (resolvedSoundEffects && resolvedSoundEffects.length > 0) {
      const sfxConstraints = `
**CRITICAL SOUND CUES AND EFFECTS INTEGRATION:**
The user has requested integrating specific sound effects into the song structure: [${resolvedSoundEffects.join(", ")}].
You MUST explicitly feature these sound effects inside the lyrics section inside square brackets [] as performance and atmospheric backdrops (e.g., [Sfx: ${resolvedSoundEffects[0]} crackles], [Sound Effect: ${resolvedSoundEffects[0]} transition rumble], or [Atmosphere: ${resolvedSoundEffects[0]} echoing]).
Ensure that each of the selected sound effects (${resolvedSoundEffects.join(", ")}) is written into the lyrics flow at least once.
`;
      customSystemInstructions = customSystemInstructions + "\n" + sfxConstraints;
    }

    if (resolvedIntroConfig && resolvedIntroConfig.enabled && resolvedOutroConfig && resolvedOutroConfig.enabled) {
      customSystemInstructions = customSystemInstructions.replace(
        "Use [Verse], [Chorus], [Bridge], [Outro] tags.",
        "Use [Verse], [Chorus], [Bridge] tags. You are STRICTLY FORBIDDEN from creating any vocal, spoken, chant, conversational, or sung [Intro] or [Outro] sections. The song MUST start directly with the [Instrumental Intro] block and end directly with the [Instrumental Outro] block with no vocal or spoken lines in those sections."
      );
    } else if (resolvedIntroConfig && resolvedIntroConfig.enabled) {
      customSystemInstructions = customSystemInstructions.replace(
        "Use [Verse], [Chorus], [Bridge], [Outro] tags.",
        "Use [Verse], [Chorus], [Bridge], [Outro] tags. However, because a pure Instrumental Intro is active, you are STRICTLY FORBIDDEN from creating any vocal, spoken, chant, conversational, or sung [Intro] sections. The song MUST start directly with the [Instrumental Intro] block."
      );
    } else if (resolvedOutroConfig && resolvedOutroConfig.enabled) {
      customSystemInstructions = customSystemInstructions.replace(
        "Use [Verse], [Chorus], [Bridge], [Outro] tags.",
        "Use [Verse], [Chorus], [Bridge] tags. You are STRICTLY FORBIDDEN from creating any vocal, spoken, chant, conversational, or sung [Outro] sections. The song MUST end directly with the [Instrumental Outro] block with no preceding vocal or spoken outro."
      );
    }

    if (resolvedIntroConfig && resolvedIntroConfig.enabled) {
      const introInstrumentsText = resolvedIntroConfig.instruments.length > 0
        ? resolvedIntroConfig.instruments.join(", ")
        : "instrumental ensemble";

      const introConstraints = `
**CRITICAL STRUCTURE - STANDARD INSTRUMENTAL INTRO (CLEAN SUNO PATTERN):**
The song MUST begin with a dedicated pure INSTRUMENTAL INTRO.
- **ZERO VOCALS:** Strictly NO vocal lines, humming, "dum-dum", whispering, or chanting is allowed inside this section.
- **SINGER TAGS PROHIBITED:** Under no circumstances may any singer names or voice register tags appear inside or preceding this segment.
- **CLEAN INSTRUMENTAL LAYOUT:** Start the song's lyrics strictly with the following simple tags:
  [Instrumental Intro]
  [Solo: ${introInstrumentsText}]
  [Acoustics: focusing exclusively on ${introInstrumentsText}]

- **STYLE PROMPT REINFORCEMENT:** You MUST append "instrumental intro" to the end of the JSON "style" field with a comma prefix. Do not append exact seconds durations, as Suno's transformer does not understand numerical timing and will get confused.
`;
      customSystemInstructions = customSystemInstructions + "\n" + introConstraints;
    }

    if (resolvedOutroConfig && resolvedOutroConfig.enabled) {
      const outroInstrumentsText = resolvedOutroConfig.instruments.length > 0
        ? resolvedOutroConfig.instruments.join(", ")
        : "instrumental ensemble";

      const outroConstraints = `
**CRITICAL STRUCTURE - STANDARD INSTRUMENTAL OUTRO (CLEAN SUNO PATTERN):**
The song MUST conclude with a dedicated pure INSTRUMENTAL OUTRO.
- **ZERO VOCALS:** Strictly NO vocal lines, spoken ad-libs, humming, or breathwork is allowed. The song must transition instantly from the final vocal section to the instrumental outro.
- **SINGER TAGS PROHIBITED:** Under no circumstances may any singer names or voice register tags appear inside this segment.
- **CLEAN INSTRUMENTAL LAYOUT:** Finish the song's lyrics strictly with the following simple tags:
  [Instrumental Outro]
  [Solo: ${outroInstrumentsText}]
  [Acoustics: focusing exclusively on ${outroInstrumentsText}]

- **STYLE PROMPT REINFORCEMENT:** You MUST append "instrumental outro" to the end of the JSON "style" field with a comma prefix. Do not append exact seconds durations.
`;
      customSystemInstructions = customSystemInstructions + "\n" + outroConstraints;
    }

    // Add child voice configs per-singer if child voice option is enabled
    if (resolvedChildVoice) {
      const activeChildSingerNames = Object.entries(resolvedSingerChildVoices)
        .filter(([_, isChild]) => isChild)
        .map(([name]) => name.charAt(0).toUpperCase() + name.slice(1));
      
      const activeAdultSingerNames = Object.entries(resolvedSingerChildVoices)
        .filter(([_, isChild]) => !isChild)
        .map(([name]) => name.charAt(0).toUpperCase() + name.slice(1));

      let childVoiceConstraints = "\n**VOCAL PROFILE OVERRIDES (CHILD VS ADULT):**\n";
      if (activeChildSingerNames.length > 0) {
        childVoiceConstraints += `The following singers MUST sing with a sweet innocent childish voice profile (pitched shift to juvenile heights): [${activeChildSingerNames.join(", ")}].
When writing lyric section and singer tags for these childish singers, write them using a childish name tag (e.g. [${activeChildSingerNames[0]} - Child Soprano] or similar appropriate childish descriptions like [Child Solo - Sweet and Innocent voice]). Ensure their vocal segments have wholesome, pure themes.\n`;
      }
      if (activeAdultSingerNames.length > 0) {
        childVoiceConstraints += `The following singers MUST sing with their standard, highly mature adult female vocals: [${activeAdultSingerNames.join(", ")}].
Ensure they use their regular rich, deep, and mature adult tones (e.g., [Miranda - Female Soprano - Mature adult], [Annelies - Female Alto - Mature adult]).\n`;
      }
      customSystemInstructions = customSystemInstructions + "\n" + childVoiceConstraints;
    }

    // Add track emotion per singer
    let emotionConstraints = "\n**SINGER EMOTIONAL ROLES OVERRIDES:**\n";
    Object.entries(resolvedSingerEmotions).forEach(([name, emo]) => {
      const capsName = name.charAt(0).toUpperCase() + name.slice(1);
      emotionConstraints += `- **${capsName}** MUST deliver her vocal performance with the emotional vibe of **"${emo}"**. Reflect this specific feeling inside her lyric section performance tags and general vocal lines (e.g., [[${capsName} - Female Group - ${emo}]]).\n`;
    });
    customSystemInstructions = customSystemInstructions + "\n" + emotionConstraints;

    // Add additional prompts/parts explaining each singer's role
    const hasActiveSingerPrompts = Object.values(resolvedSingerPrompts).some(p => p.trim() !== "");
    if (hasActiveSingerPrompts) {
      let singerPromptsConstraints = "\n**SINGER ROLE AND PART DIRECTIVES/INSTRUCTIONS:**\n";
      Object.entries(resolvedSingerPrompts).forEach(([name, pr]) => {
        if (pr.trim()) {
          const capsName = name.charAt(0).toUpperCase() + name.slice(1);
          singerPromptsConstraints += `- **${capsName}** part instructions: "${pr.trim()}" (You MUST craft the lyrics, timing, and singing directions for ${capsName} according to this custom prompt directive!)\n`;
        }
      });
      customSystemInstructions = customSystemInstructions + "\n" + singerPromptsConstraints;
    }

    // Add singer individual instruments
    const hasActiveSingerInstruments = Object.values(resolvedSingerInstruments).some(insts => insts && insts.length > 0);
    if (hasActiveSingerInstruments) {
      let singerInstrumentsConstraints = "\n**SINGER INDIVIDUAL INSTRUMENT PERFORMANCE:**\n";
      Object.entries(resolvedSingerInstruments).forEach(([name, insts]) => {
        if (insts && insts.length > 0) {
          const capsName = name.charAt(0).toUpperCase() + name.slice(1);
          singerInstrumentsConstraints += `- **${capsName}** is playing individual single-player instruments: [${insts.join(", ")}].
You MUST explicitly annotate ${capsName}'s singing/performing parts with these specific instrumental solos, guides, or accompaniments. Write them inside square brackets inside her segments (e.g., [${capsName} - Solo: ${insts[0]}] or [${capsName} - Accompanying on ${insts.join(" and ")}]).\n`;
        }
      });
      customSystemInstructions = customSystemInstructions + "\n" + singerInstrumentsConstraints;
    }

    // Add partner-up constraints
    const activePartnerSingers = Object.entries(resolvedSingerPartnerUps)
      .filter(([_, active]) => active)
      .map(([name]) => name.charAt(0).toUpperCase() + name.slice(1));

    if (activePartnerSingers.length >= 2 && activePartnerSingers.length <= 3) {
      const partnerSingersCombo = activePartnerSingers.join(" & ");
      const partnerUpConstraints = `
**CRITICAL STRUCTURE & HARMONY - SINGER PARTNER-UP PROMPT:**
The singers [${activePartnerSingers.join(", ")}] are explicitly partnered up to sing COMBINED together for the same verses or segments of the song (singing in unison, duet, or 3-part harmony)!
- **COMBINED PERFORMANCE:** You MUST write at least two core verse sections or chorus sections specifically featuring all partnered singers singing in a combined tag.
- **TAG SPECIFICATION:** Use a combined, unified tag in square brackets indicating their names and combined voice specialties (e.g., [${partnerSingersCombo} - Duet Harmony] or [${activePartnerSingers.join(" & ")} - Combined Verse - Melodic Unison]).
- **INDIVIDUAL PARTS SPREAD:** The other parts of the song can still be sung individually by the remaining singers or in different pairings, but the partnered singers must shine together in unison or harmony for their combined sections.
`;
      customSystemInstructions = customSystemInstructions + "\n" + partnerUpConstraints;
    }

    // Enforce concluding tag
    const endLyricsConstraint = `
**CRITICAL LYRIC CONCLUDING CONSTRAINT (MANDATORY):**
You MUST ensure that the very end of the generated "lyrics" is explicitly styled and structured to have a concluding tag indicating the end of the song. No exceptions.
The final line of the lyrics MUST be one of the following section tags in square brackets:
- [Outro] (followed by instrumental fade or concluding musical notes)
- [Coda] (the concluding passage of the piece)
- [Fade Out] (gradual decrescendo of vocals or instruments)
- [Instrumental Outro] (if active or desired to end purely instrumentally)
Under no circumstances should the lyrics end abruptly after a chorus, verse, or bridge without one of these concluding tags as the final visual/textual block!
`;
    customSystemInstructions = customSystemInstructions + "\n" + endLyricsConstraint;

    const languageLabel = dialectIds.length === 0 ? 'Default English' : dialectIds.map(id => findDialectById(id).name).join(' + ');
    const jobId = addJob(`Lyrics: ${instructions.substring(0, 20)}...`, 'normal', prompt, apiKey || '', generationSettings, customSystemInstructions);
    log('info', 'Job Added', `New generation job added: ${jobId} (Rating: ${resolvedRating}, Language: ${languageLabel}${emotion ? `, Emotion: ${emotion}` : ''}${resolvedChildVoice ? ', Vocals: Children' : ''})`);
    
    // Clear the main screen of all data when a new song is generated
    setSong({ 
      title: '', 
      style: '', 
      lyrics: '',
      imagePrompts: { start: '', middle: '', end: '' },
      story: '',
      storyPrompts: {
        miranda: { wan: '', sdxl: '' },
        annelies: { wan: '', sdxl: '' },
        fannie: { wan: '', sdxl: '' },
        emma: { wan: '', sdxl: '' },
        mirandaAnnelies: { wan: '', sdxl: '' },
        fannieEmma: { wan: '', sdxl: '' },
        group: { wan: '', sdxl: '' }
      }
    });
    setViewItem(null);

    setShowGenerate(false);
  };

  const handleGenerateStoryPrompts = (story: string, noClothes: boolean) => {
    const prompt = `Based on the following story, generate image prompts for the band Noor (Miranda, Annelies, Fannie, Emma).
    
    Story: ${story}
    No Clothes: ${noClothes ? 'Yes (generate prompts without any clothing)' : 'No'}
    
    Constraints for all prompts (CRITICAL):
    - Age & Fresh-Faced Appearance: Represent all singers with a highly youthful, fresh-faced collegiate, student-aged young adult female appearance, looking like college-age young women (appearing late-teens or early-twenties). Never specify numerical ages in the prompt.
    - Physical Build & Slim Fitness: Depict all singers as tone, exceptionally slender, and well-trained, representing active, highly fit, grace-filled young adult women. Never depict them as mature/older, heavy, chubby, or overweight. Do NOT mention "BMI" or "weight" or "BMI around 20".
    
    For each category, provide:
    1. A WAN prompt: A detailed, artistic, and sanitized description of the person(s)' youthful, athletic, and slender body/face and the surrounding environment. **CRITICAL CONSTRAINTS:** Do NOT mention any clothing, outfits, or garments at all in WAN prompts (the generator will decide what is most proper). Do NOT mention cup sizes in WAN prompts. WAN prompts MUST be sanitized to contain no offensive, sensual, or explicit words (e.g., avoid 'nude', 'no clothes', 'sensual', 'naked'). Use safe, clean, and artistic alternatives (e.g., 'natural state', 'unadorned', 'minimalist').
    2. An SDXL prompt: A weighted version of the WAN prompt (using (keyword:weight) syntax). SDXL prompts CAN be explicit, detailed, include nudity or erotic themes, and may specify whether they are without clothing. **CRITICAL:** ALWAYS include chest size with cup size in SDXL prompts (e.g., "(flat chest:1.3)", "(AA cup:1.2)").
    
    Categories:
    - miranda: Single person
    - annelies: Single person
    - fannie: Single person
    - emma: Single person
    - mirandaAnnelies: Couple (Miranda and Annelies)
    - fannieEmma: Couple (Fannie and Emma)
    - group: All four singers
    
    **Clear Identification:** For prompts with two or more characters, clearly mark each person by name and specific physical traits to prevent the AI from mixing them up.
    
    Return the result as a JSON object matching the StoryPrompts interface:
    {
      "miranda": { "wan": "...", "sdxl": "..." },
      "annelies": { "wan": "...", "sdxl": "..." },
      "fannie": { "wan": "...", "sdxl": "..." },
      "emma": { "wan": "...", "sdxl": "..." },
      "mirandaAnnelies": { "wan": "...", "sdxl": "..." },
      "fannieEmma": { "wan": "...", "sdxl": "..." },
      "group": { "wan": "...", "sdxl": "..." }
    }
    `;
    
    const jobId = addJob(`Generate Story Prompts`, 'high', prompt, apiKey || '');
    log('info', 'Story Job Added', `New story prompt generation job added: ${jobId}`);
  };

  useEffect(() => {
    localStorage.setItem('noor-portrait-prompts', JSON.stringify(portraitPrompts));
  }, [portraitPrompts]);

  const handleGeneratePortraits = (type: PortraitType) => {
    const prompt = `Generate portrait image prompts for the four singers of the band Noor (Miranda, Annelies, Fannie, Emma).
    
    Portrait Type: ${type}
    
    Constraints for all prompts (CRITICAL):
    - The singer is standing facing the viewer in a relaxed pose.
    - A slight smile on her face.
    - Generate an interesting, natural background (e.g., forest, beach, garden, mountains).
    - Age & Fresh-Faced Appearance: Represent the singers with a highly youthful, fresh-faced collegiate, student-aged young adult female appearance (appearing late-teens or early-twenties). Never specify numerical ages in the prompt.
    - Physical Build & Slim Fitness: Depict all singers as tone, exceptionally slender, and well-trained, representing active, highly fit, grace-filled young adult women. Never depict them as mature/older, heavy, chubby, or overweight. Do NOT mention "BMI" or "weight" or "BMI around 20".
    - WAN prompts: Detailed, artistic, and sanitized description of the singer's body and face. **CRITICAL:** Do NOT mention any clothing, outfits, or garments at all in WAN prompts, as the generator will decide what is most proper. Focused entirely on safe, artistic, non-explicit terms. WAN prompts MUST be sanitized to contain no offensive or explicit words. Do NOT mention cup sizes in WAN prompts.
    - SDXL prompts: Weighted version of the WAN prompt, but WITHOUT clothing (explicit and detailed body description). SDXL prompts CAN include nudity or erotic themes. **CRITICAL:** ALWAYS include chest size with cup size in SDXL prompts (e.g., "(flat chest:1.3)", "(AA cup:1.2)").
    
    Specific Type Instructions:
    - Face: Focus ONLY on facial details (eyes, hair, skin texture, expression).
    - Torso: Describe the body from above the hip upwards. Include more body details.
    - Body: Describe the whole body from head to toe in detail.
    
    Return the result as a JSON object matching the PortraitPrompts interface:
    {
      "miranda": { "wan": "...", "sdxl": "..." },
      "annelies": { "wan": "...", "sdxl": "..." },
      "fannie": { "wan": "...", "sdxl": "..." },
      "emma": { "wan": "...", "sdxl": "..." }
    }
    `;
    
    const jobId = addJob(`Generate ${type} Portraits`, 'high', prompt, apiKey || '');
    log('info', 'Portrait Job Added', `New ${type} portrait generation job added: ${jobId}`);
  };

  const addToLibrary = (item: LibraryItem, side: 'left' | 'right') => {
    if (side === 'left') setLeftLibrary(prev => [...prev, item].sort((a, b) => a.name.localeCompare(b.name)));
    else setRightLibrary(prev => [...prev, item].sort((a, b) => a.name.localeCompare(b.name)));

    // Automatic download for web content
    if (item.sourceUrl && item.sourceUrl.startsWith('http')) {
      if (item.type === 'image') {
        // Image conversion handled in ImageView, but for automatic download on add:
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            canvas.toBlob((blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${item.name.split('.')[0]}.png`;
                a.click();
                URL.revokeObjectURL(url);
              }
            }, 'image/png');
          }
        };
        img.src = item.sourceUrl;
      } else {
        const blob = new Blob([typeof item.content === 'string' ? item.content : JSON.stringify(item.content, null, 2)], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = item.name;
        a.click();
        URL.revokeObjectURL(url);
      }
    }
  };

  const removeFromLibrary = (id: string, side: 'left' | 'right') => {
    if (side === 'left') setLeftLibrary(prev => prev.filter(i => i.id !== id));
    else setRightLibrary(prev => prev.filter(i => i.id !== id));
  };

  const loadSongAndSettings = (parsedContent: any): boolean => {
    if (typeof parsedContent === 'object' && parsedContent !== null && ('lyrics' in parsedContent || 'title' in parsedContent)) {
      if (parsedContent.lyrics && typeof parsedContent.lyrics === 'string' && parsedContent.lyrics.length > 5000) {
        parsedContent.lyrics = parsedContent.lyrics.substring(0, 5000);
      }
      setSong(parsedContent);
      
      const s = parsedContent.settings;
      if (s) {
        if (Array.isArray(s.selectedInstruments)) setSelectedInstruments(s.selectedInstruments);
        if (Array.isArray(s.selectedStyles)) setSelectedStyles(s.selectedStyles);
        if (typeof s.rating === 'string') setRating(s.rating);
        if (typeof s.selectedDialectId === 'string') setSelectedDialectId(s.selectedDialectId);
        if (typeof s.innuendoLevel === 'number') setInnuendoLevel(s.innuendoLevel);
        if (typeof s.epicLevel === 'number') setEpicLevel(s.epicLevel);
        if (typeof s.sillyLevel === 'number') setSillyLevel(s.sillyLevel);
        if (typeof s.sapphicLevel === 'number') setSapphicLevel(s.sapphicLevel);
        if (typeof s.wildnessLevel === 'number') setWildnessLevel(s.wildnessLevel);
        if (typeof s.rhymeId === 'string') setRhymeId(s.rhymeId);
        if (typeof s.musicalKey === 'string') setMusicalKey(s.musicalKey);
        if (typeof s.bpm === 'number') setBpm(s.bpm);
        if (typeof s.timeSignature === 'string') setTimeSignature(s.timeSignature);
        if (typeof s.childVoice === 'boolean') setChildVoice(s.childVoice);
        if (s.singerChildVoices) setSingerChildVoices(s.singerChildVoices);
        if (s.singerEmotions) setSingerEmotions(s.singerEmotions);
        if (s.singerPrompts) setSingerPrompts(s.singerPrompts);
        if (s.singerInstruments) setSingerInstruments(s.singerInstruments);
        if (s.singerPartnerUps) setSingerPartnerUps(s.singerPartnerUps);
        if (s.singerNationalities) setSingerNationalities(s.singerNationalities);
        if (typeof s.selfReflect === 'boolean') setSelfReflect(s.selfReflect);
        if (typeof s.reverseLyricsEnabled === 'boolean') setReverseLyricsEnabled(s.reverseLyricsEnabled);
        if (Array.isArray(s.selectedSoundEffects)) setSelectedSoundEffects(s.selectedSoundEffects);
        if (s.introConfig) setIntroConfig(s.introConfig);
        if (s.outroConfig) setOutroConfig(s.outroConfig);
        if (s.forbiddenTopics) setForbiddenTopics(s.forbiddenTopics);
      }
      return true;
    }
    return false;
  };

  const handleFileDrop = (file: File) => {
    const reader = new FileReader();
    reader.onload = (re: any) => {
      try {
        let type: LibraryItem['type'] = 'text';
        if (file.name.endsWith('.json')) type = 'json';
        else if (file.name.endsWith('.xml')) type = 'xml';
        else if (file.type.startsWith('image/')) type = 'image';

        let parsedContent = re.target.result;
        if (type === 'json') {
          try {
            parsedContent = JSON.parse(re.target.result);
            if (loadSongAndSettings(parsedContent)) {
              log('info', 'Song Loaded', `Song "${parsedContent.title || 'Untitled'}" and its settings successfully loaded into workspace.`);
            }
          } catch (e) {
            log('error', 'Parse Error', `Could not parse the JSON file "${file.name}".`);
          }
        }

        const item: LibraryItem = {
          id: Math.random().toString(36).substring(7),
          name: file.name,
          type,
          content: parsedContent,
        };
        addToLibrary(item, 'right');
        log('info', 'File Dropped', `File "${file.name}" added to library.`);
      } catch (err) {
        log('error', 'Drop Failed', 'Invalid file format.');
      }
    };
    if (file.type.startsWith('image/')) reader.readAsDataURL(file);
    else reader.readAsText(file);
  };

  const handleDropMp3 = (file: File) => {
    if (!song || !song.title) {
      log('error', 'No Song Active', 'Please generate or load a song first before dropping an MP3.');
      return;
    }
    
    if (!file.name.toLowerCase().endsWith('.mp3')) {
      log('error', 'Invalid File Type', `File "${file.name}" is not an MP3 audio file.`);
      return;
    }

    const cleanTitle = song.title.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanFileName = file.name.toLowerCase().replace(/\.mp3$/, '').replace(/[^a-z0-9]/g, '');
    
    const isPrefixOrSuffix = cleanFileName.includes(cleanTitle) || cleanTitle.includes(cleanFileName);
    const titleWords = song.title.toLowerCase().split(/[^a-z0-9]+/).filter(w => w.length > 2);
    const areWordsInName = titleWords.length > 0 && titleWords.every(word => file.name.toLowerCase().includes(word));
    const isMatched = isPrefixOrSuffix || areWordsInName || file.name.toLowerCase() === 'song.mp3' || file.name.toLowerCase() === 'audio.mp3';

    if (isMatched) {
      setIsMp3Matched(true);

      // Check for same-song comparison trigger
      const saved = localStorage.getItem('noor-uploaded-mp3s-v4') || '[]';
      let uploaded: any[] = [];
      try {
        uploaded = JSON.parse(saved);
      } catch {
        uploaded = [];
      }

      const otherMatched = uploaded.filter((f: any) => {
        // Simple matching logic
        const cTitle = song.title.toLowerCase().replace(/[^a-z0-9]/g, '');
        const cFileName = f.name.toLowerCase().replace(/\.mp3$/, '').replace(/[^a-z0-9]/g, '');
        const isPrefSuff = cFileName.includes(cTitle) || cTitle.includes(cFileName);
        const tWords = song.title.toLowerCase().split(/[^a-z0-9]+/).filter((w: string) => w.length > 2);
        const wordsInN = tWords.length > 0 && tWords.every((word: string) => f.name.toLowerCase().includes(word));
        const matched = isPrefSuff || wordsInN || f.name.toLowerCase() === 'song.mp3' || f.name.toLowerCase() === 'audio.mp3';
        return matched && f.name !== file.name;
      });

      if (otherMatched.length > 0) {
        // Secondary matched file: only trigger comparison with the Lead Song
        const leadFile = otherMatched[otherMatched.length - 1];
        log('info', 'Comparison Scheduled', `MP3 comparison triggered! Comparing newly added "${file.name}" against lead song audio "${leadFile.name}".`);

        const comparePrompt = GENERATE_COMPARE_PROMPT(
          song.title,
          song.lyrics,
          song.style,
          leadFile,
          { name: file.name, size: file.size }
        );

        addJob(
          `Compare Versions: ${song.title}`,
          'high',
          comparePrompt,
          apiKey || '',
          {},
          SYSTEM_INSTRUCTIONS_COMPARE
        );
      } else {
        // First matched file: run all four main diagnostics
        log('info', 'Sound File Matched', `MP3 file "${file.name}" successfully matched song "${song.title}". Initializing four custom Karaoke report jobs.`);

        addJob(
          'Double Entendres: ' + song.title,
          'high',
          GENERATE_ENTENDRES_PROMPT(song.title, song.lyrics),
          apiKey || '',
          {},
          SYSTEM_INSTRUCTIONS_ENTENDRES
        );

        addJob(
          'Technical Details: ' + song.title,
          'high',
          GENERATE_TECHNICAL_PROMPT(song.title, song.lyrics, song.style, song.settings),
          apiKey || '',
          {},
          SYSTEM_INSTRUCTIONS_TECHNICAL
        );

        addJob(
          'Interview & Review: ' + song.title,
          'high',
          GENERATE_INTERVIEW_REVIEW_PROMPT(song.title, song.lyrics, song.story || ''),
          apiKey || '',
          {},
          SYSTEM_INSTRUCTIONS_INTERVIEW_REVIEW
        );

        addJob(
          'Analysis: ' + song.title,
          'high',
          GENERATE_ANALYSIS_PROMPT(song.title, file.name, file.size, song.style),
          apiKey || '',
          {},
          SYSTEM_INSTRUCTIONS_ANALYSIS
        );
      }
    } else {
      log('error', 'MP3 Mismatch', `Dropped MP3 file "${file.name}" does NOT match the active song "${song.title}".`);
    }
  };

  const handleAction = async (action: string) => {
    switch (action) {
      case 'load':
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json,.xml,.txt,.png,.jpg,.jpeg';
        input.onchange = (e: any) => {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onload = (re: any) => {
            try {
              let type: LibraryItem['type'] = 'text';
              if (file.name.endsWith('.json')) type = 'json';
              else if (file.name.endsWith('.xml')) type = 'xml';
              else if (file.type.startsWith('image/')) type = 'image';

              let parsedContent = re.target.result;
              if (type === 'json') {
                try {
                  parsedContent = JSON.parse(re.target.result);
                  if (loadSongAndSettings(parsedContent)) {
                    log('info', 'Song Loaded', `Song "${parsedContent.title || 'Untitled'}" and its settings successfully loaded into workspace.`);
                  }
                } catch (e) {
                  log('error', 'Parse Error', `Could not parse the JSON file "${file.name}".`);
                }
              }

              const item: LibraryItem = {
                id: Math.random().toString(36).substring(7),
                name: file.name,
                type,
                content: parsedContent,
              };
              addToLibrary(item, 'right');
              log('info', 'File Loaded', `File "${file.name}" added to library.`);
            } catch (err) {
              log('error', 'Load Failed', 'Invalid file format.');
            }
          };
          if (file.type.startsWith('image/')) reader.readAsDataURL(file);
          else reader.readAsText(file);
        };
        input.click();
        break;
      case 'save':
        if (!song.title) {
          log('warn', 'Save Warning', 'Please provide a song title before saving.');
          return;
        }
        downloadJson(song, song.title);
        log('info', 'File Saved', `Song "${song.title}" saved and downloaded.`);
        break;
      case 'clear':
        localStorage.clear();
        clearLogs();
        clearQueue();
        window.location.reload();
        break;
      case 'api-key':
        const win = window as any;
        if (win.aistudio?.openSelectKey) {
          await win.aistudio.openSelectKey();
          setApiKey(process.env.GEMINI_API_KEY || null);
          log('info', 'API Key Updated', 'New API key selected.');
        }
        break;
      case 'content-settings':
        setShowContentSettings(true);
        break;
      case 'karaoke':
        if (!song.lyrics) {
          log('warn', 'Karaoke Warning', 'No lyrics available to display.');
          return;
        }
        setShowKaraoke(true);
        break;
      case 'spoiler':
        setShowSpoiler(true);
        break;
      case 'images':
        setShowImagePrompts(true);
        break;
      case 'story':
        setShowStory(true);
        break;
      case 'system-instructions':
      case 'manual':
      case 'code-overview':
        const { SYSTEM_INSTRUCTIONS_MD, MANUAL_MD, CODE_OVERVIEW_MD } = await import('../../constants/help');
        const contentMap: any = {
          'system-instructions': { title: 'System Instructions', content: SYSTEM_INSTRUCTIONS_MD, filename: 'system_instructions' },
          'manual': { title: 'User Manual', content: MANUAL_MD, filename: 'manual' },
          'code-overview': { title: 'Code Overview', content: CODE_OVERVIEW_MD, filename: 'code_overview' },
        };
        setHelpContent(contentMap[action]);
        break;
      case 'cut':
      case 'copy':
      case 'paste':
        log('info', 'Edit Action', `Action "${action}" triggered.`);
        break;
      case 'singer-miranda':
        setSelectedSinger(SINGERS[0]);
        break;
      case 'singer-annelies':
        setSelectedSinger(SINGERS[1]);
        break;
      case 'singer-fannie':
        setSelectedSinger(SINGERS[2]);
        break;
      case 'singer-emma':
        setSelectedSinger(SINGERS[3]);
        break;
      case 'singer-face':
        setActivePortraitType('Face');
        setShowPortrait(true);
        break;
      case 'singer-torso':
        setActivePortraitType('Torso');
        setShowPortrait(true);
        break;
      case 'singer-body':
        setActivePortraitType('Body');
        setShowPortrait(true);
        break;
      case 'wardrobe':
        setShowWardrobe(true);
        break;
      case 'culinary':
        setShowCulinary(true);
        break;
      case 'farm':
        setShowFarm(true);
        break;
      case 'the-band':
        setHelpContent({ title: 'The Band', content: THE_BAND_MD, filename: 'noor' });
        break;
    }
  };

  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('noor-applied-job-ids');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    localStorage.setItem('noor-applied-job-ids', JSON.stringify(Array.from(appliedJobIds)));
  }, [appliedJobIds]);

  // Update song and trigger downstream sequential steps when a job completes
  useEffect(() => {
    // Find any newly completed job that is not already marked as applied
    const pendingApply = jobs.filter(j => j.status === 'done' && j.result && !j.error && !appliedJobIds.has(j.id));
    
    if (pendingApply.length > 0) {
      pendingApply.forEach(job => {
        const result = job.result;
        
        // Mark as applied immediately to avoid duplicate hooks triggers
        setAppliedJobIds(prev => {
          const next = new Set(prev);
          next.add(job.id);
          return next;
        });

        // 1. Process "Lyrics" job completion
        if (job.name.startsWith('Lyrics: ')) {
          if (reverseLyricsEnabled && result && result.lyrics) {
            result.lyrics = reverseLyrics(result.lyrics);
          }
          const finalLyrics = result.lyrics ? result.lyrics.substring(0, 5000) : '';
          const resolvedImgDesc = job.generationSettings?.imageDescription || '';
          setSong(prev => ({
            ...prev,
            title: result.title || prev.title,
            style: result.style || prev.style,
            lyrics: finalLyrics || prev.lyrics,
            imageDescription: resolvedImgDesc || prev.imageDescription
          }));
          log('info', 'Lyrics Generated', `Lyrics generated successfully for "${result.title}". Downstream tasks (Interview, Story & Images) initiated.`);

          // Spawn Interview
          const interviewPrompt = GENERATE_INTERVIEW_PROMPT(result.title || 'Untitled Song', result.lyrics || '', resolvedImgDesc);
          addJob(
            `Interview: ${result.title || 'Untitled Song'}`, 
            'normal', 
            interviewPrompt, 
            apiKey || '', 
            job.generationSettings, 
            SYSTEM_INSTRUCTIONS_INTERVIEW
          );

          // Spawn Story & Image Prompts
          const resolvedSelfReflectForImages = job.generationSettings?.selfReflect ?? selfReflect;
          const dynamicStoryAndImagesInstructions = getSystemInstructionsStoryAndImages(resolvedSelfReflectForImages);
          const storyPrompt = GENERATE_STORY_AND_IMAGE_PROMPTS_PROMPT(result.title || 'Untitled Song', result.lyrics || '', rating, forbiddenTopics, resolvedImgDesc);
          addJob(
            `Story & Image Prompts: ${result.title || 'Untitled Song'}`, 
            'normal', 
            storyPrompt, 
            apiKey || '', 
            job.generationSettings, 
            dynamicStoryAndImagesInstructions
          );

          // Save song to Right Library
          const item: LibraryItem = {
            id: job.id,
            name: `${result.title || 'Untitled Song'} (Lyrics)`,
            type: 'song',
            content: {
              ...song,
              title: result.title,
              style: result.style,
              lyrics: result.lyrics,
              imageDescription: resolvedImgDesc
            },
          };
          addToLibrary(item, 'right');

          // Download a JSON file containing the title, style and lyrics in three fields as "{title}-instructions.json"
          const instructionsData = {
            title: result.title || 'Untitled Song',
            style: result.style || '',
            lyrics: result.lyrics || ''
          };
          downloadJson(instructionsData, `${result.title || 'Untitled Song'}-instructions`);
          log('info', 'File Saved', `Lyrics instructions JSON saved and downloaded as "${result.title || 'Untitled'}-instructions.json".`);

          const songTitleStr = result.title || 'Untitled Song';
          const songStyleStr = result.style || '';
          const songLyricsStr = result.lyrics || '';

          // Download details Markdown file containing title, style and lyrics
          downloadDetailsMarkdown(songTitleStr, songStyleStr, songLyricsStr);
          log('info', 'File Saved', `Song details saved and downloaded as "${songTitleStr}-details.md".`);

          // Download Karaoke Markdown file containing title and lyrics
          downloadKaraokeMarkdown(songTitleStr, songLyricsStr);
          log('info', 'File Saved', `Karaoke lyrics saved and downloaded as "${songTitleStr}.md".`);

          // Spawn Story Behind Song
          const storyBehindSongPrompt = GENERATE_STORY_BEHIND_SONG_PROMPT(songTitleStr, songLyricsStr, resolvedImgDesc);
          addJob(
            `Story Behind Song: ${songTitleStr}`,
            'normal',
            storyBehindSongPrompt,
            apiKey || '',
            job.generationSettings,
            SYSTEM_INSTRUCTIONS_STORY_BEHIND_SONG
          );
          log('info', 'Story Behind Song Started', `Launching "Story Behind Song" generation job to tell the story and get singers' input on "${songTitleStr}".`);

          // Download parameters Markdown file containing only the enabled options/values
          if (job.generationSettings) {
            downloadParametersMarkdown(songTitleStr, job.generationSettings);
            log('info', 'File Saved', `Active song parameters saved and downloaded as "${songTitleStr}-params.md".`);

            // If the song dialect is not English, spawn a Translation job
            const gSettings = job.generationSettings || {};
            const enabledTabs = gSettings.enabledTabs || {};
            const dialectId = gSettings.dialectId || '';
            const isNotEnglish = enabledTabs.accent && dialectId && dialectId.split(',').filter(Boolean).some((id: string) => !id.startsWith('en-'));
            if (isNotEnglish) {
              const dialectNames = dialectId.split(',').filter(Boolean).map((id: string) => findDialectById(id)?.name || id).join(', ');
              const translationPrompt = GENERATE_TRANSLATION_PROMPT(songTitleStr, songLyricsStr, dialectNames);
              addJob(
                `Translation: ${songTitleStr}`,
                'normal',
                translationPrompt,
                apiKey || '',
                job.generationSettings,
                SYSTEM_INSTRUCTIONS_TRANSLATION
              );
              log('info', 'Translation Started', `The song is composed in a non-English dialect/language (${dialectNames}). Launching a Translation job to create English lyrics and linguistic explanation...`);
            }
          }
        }

        // 2. Process "Story & Image Prompts" job completion
        else if (job.name.startsWith('Story & Image Prompts: ')) {
          setSong(prev => ({
            ...prev,
            story: result.story || prev.story,
            imagePrompts: result.imagePrompts || prev.imagePrompts
          }));
          log('info', 'Story Generated', `Story and Image prompts compiled for song. Now launching character portraits expansion...`);
 
          const songTitle = job.name.replace('Story & Image Prompts: ', '');
          const portraitsPrompt = GENERATE_PORTRAITS_PROMPT(songTitle, result.story || '');
          const resolvedSelfReflectForPortraits = job.generationSettings?.selfReflect ?? selfReflect;
          const dynamicPortraitsInstructions = getSystemInstructionsPortraits(resolvedSelfReflectForPortraits);
          addJob(
            `Portraits: ${songTitle}`, 
            'normal', 
            portraitsPrompt, 
            apiKey || '', 
            job.generationSettings, 
            dynamicPortraitsInstructions
          );
        }

        // 3. Process "Interview" job completion
        else if (job.name.startsWith('Interview: ')) {
          setSong(prev => {
            const updatedSong = {
              ...prev,
              interview: result.interview || prev.interview,
              settings: {
                selectedInstruments,
                selectedStyles,
                rating,
                selectedDialectId,
                innuendoLevel,
                epicLevel,
                sillyLevel,
                sapphicLevel,
                rhymeId,
                musicalKey,
                bpm,
                timeSignature,
                childVoice,
                singerChildVoices,
                singerEmotions,
                singerPrompts,
                singerInstruments,
                singerPartnerUps,
                singerNationalities,
                selfReflect,
                reverseLyricsEnabled,
                selectedSoundEffects,
                introConfig,
                outroConfig,
                forbiddenTopics
              }
            };

            // Trigger complete song automatic download with options
            downloadJson(updatedSong, updatedSong.title || 'Untitled Song');
            log('info', 'File Saved', `Lyrics, Karaoke, and Spoiler compiled! Custom options combined and downloaded as "${updatedSong.title || 'Untitled'}.json".`);

            return updatedSong;
          });
        }

        // 4. Process "Portraits" job completion
        else if (job.name.startsWith('Portraits: ')) {
          setSong(prev => ({
            ...prev,
            storyPrompts: result.storyPrompts || prev.storyPrompts || result
          }));
          log('info', 'Portraits Generated', `Character portrait prompt variations mapped successfully.`);
        }

        // Process "Translation" job completion
        else if (job.name.startsWith('Translation: ')) {
          if (result && result.lyrics) {
            try {
              const songTitle = result.title || job.name.replace('Translation: ', '');
              let mdContent = `# ${songTitle} - English Translation\n\n`;
              mdContent += `### Lyrical Karaoke Translation (English)\n\n${result.lyrics}\n\n`;
              mdContent += `### Language & Dialect Cultural Context\n\n${result.explanation || 'No cultural notes provided.'}\n`;

              const blob = new Blob([mdContent], { type: 'text/markdown;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              const safeTitle = songTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'untitled';
              a.href = url;
              a.download = `${safeTitle}-translation.md`;
              a.click();
              URL.revokeObjectURL(url);

              // Add translated markdown to Library so the user has it in their list
              const translationItem: LibraryItem = {
                id: job.id,
                name: `${songTitle} (Translation)`,
                type: 'markdown',
                content: mdContent
              };
              addToLibrary(translationItem, 'right');

              log('info', 'File Saved', `English translation and cultural context saved and downloaded as "${safeTitle}-translation.md".`);
            } catch (err) {
              console.error('Failed to download translation markdown file:', err);
            }
          }
        }

        else if (job.name.startsWith('Story Behind Song: ')) {
          const md = result?.markdown || result || '';
          const songTitle = job.name.replace('Story Behind Song: ', '');
          setSong(prev => ({ ...prev, story: md }));
          downloadCustomMarkdown(songTitle, 'story', md);

          const libraryItem: LibraryItem = {
            id: job.id,
            name: `${songTitle} (Story behind the song)`,
            type: 'markdown',
            content: md
          };
          addToLibrary(libraryItem, 'right');

          log('info', 'File Saved', `Story behind the song saved and downloaded as "${songTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'untitled'}-story.md".`);
        }

        else if (job.name.startsWith('Double Entendres: ')) {
          const md = result?.markdown || result || '';
          setSong(prev => ({ ...prev, entendres: md }));
          const songTitle = job.name.replace('Double Entendres: ', '');
          downloadCustomMarkdown(songTitle, 'entendres', md);
          
          const libraryItem: LibraryItem = {
            id: job.id,
            name: `${songTitle} (Double Entendres)`,
            type: 'markdown',
            content: md
          };
          addToLibrary(libraryItem, 'right');
          log('info', 'File Saved', `Double entendres analysis saved and downloaded as "${songTitle}-entendres.md".`);
        }

        else if (job.name.startsWith('Technical Details: ')) {
          const md = result?.markdown || result || '';
          setSong(prev => ({ ...prev, technical: md }));
          const songTitle = job.name.replace('Technical Details: ', '');
          downloadCustomMarkdown(songTitle, 'technical', md);
          
          const libraryItem: LibraryItem = {
            id: job.id,
            name: `${songTitle} (Technical Details)`,
            type: 'markdown',
            content: md
          };
          addToLibrary(libraryItem, 'right');
          log('info', 'File Saved', `Technical details analysis saved and downloaded as "${songTitle}-technical.md".`);
        }

        else if (job.name.startsWith('Interview & Review: ')) {
          const md = result?.markdown || result || '';
          setSong(prev => ({ ...prev, interviewReview: md }));
          const songTitle = job.name.replace('Interview & Review: ', '');
          downloadCustomMarkdown(songTitle, 'interview', md);
          
          const libraryItem: LibraryItem = {
            id: job.id,
            name: `${songTitle} (Interview & Review)`,
            type: 'markdown',
            content: md
          };
          addToLibrary(libraryItem, 'right');
          log('info', 'File Saved', `Senna Bakker Interview and Track Review saved and downloaded as "${songTitle}-interview.md".`);
        }

        else if (job.name.startsWith('Analysis: ')) {
          const md = result?.markdown || result || '';
          setSong(prev => ({ ...prev, analysis: md }));
          const songTitle = job.name.replace('Analysis: ', '');
          downloadCustomMarkdown(songTitle, 'analysis', md);
          
          const libraryItem: LibraryItem = {
            id: job.id,
            name: `${songTitle} (Vocal & Sound Analysis)`,
            type: 'markdown',
            content: md
          };
          addToLibrary(libraryItem, 'right');
          log('info', 'File Saved', `MP3 vocal/sound analysis saved and downloaded as "${songTitle}-analysis.md".`);
        }

        else if (job.name.startsWith('Compare Versions: ')) {
          const md = result?.markdown || result || '';
          setSong(prev => ({ ...prev, compare: md }));
          const songTitle = job.name.replace('Compare Versions: ', '');
          downloadCustomMarkdown(songTitle, 'compare', md);
          
          const libraryItem: LibraryItem = {
            id: job.id,
            name: `${songTitle} (Versions Comparison)`,
            type: 'markdown',
            content: md
          };
          addToLibrary(libraryItem, 'right');
          log('info', 'File Saved', `MP3 files comparison for "${songTitle}" saved and downloaded as "${songTitle}-compare.md".`);
        }

        // 5. Older/Direct portrait triggers if any
        else if (job.name.startsWith('Generate ')) {
          if (result.miranda && result.annelies) {
            const type = job.name.split(' ')[1] as PortraitType;
            setPortraitPrompts(prev => ({
              ...prev,
              [type]: result
            }));
            log('info', 'Portraits Updated', `${type} portraits have been updated.`);
          } else {
            setSong(prev => ({
              ...prev,
              storyPrompts: result
            }));
          }
        }
      });
    }
  }, [
    jobs,
    appliedJobIds,
    apiKey,
    rating,
    forbiddenTopics,
    song,
    addToLibrary,
    selectedInstruments,
    selectedStyles,
    selectedDialectId,
    innuendoLevel,
    epicLevel,
    sillyLevel,
    sapphicLevel,
    rhymeId,
    musicalKey,
    bpm,
    timeSignature,
    childVoice,
    singerChildVoices,
    singerEmotions,
    singerPrompts,
    singerInstruments,
    singerPartnerUps,
    singerNationalities,
    selfReflect,
    reverseLyricsEnabled,
    selectedSoundEffects,
    introConfig,
    outroConfig
  ]);

  const handleResetGenerationSettings = () => {
    setSelectedInstruments([]);
    setSelectedStyles([]);
    setRating('PG');
    setSelectedDialectId('');
    setChildVoice(false);
    setSelfReflect(false);
    setSelectedSoundEffects([]);
    setIntroConfig({ enabled: false, duration: 15, instruments: [] });
    setOutroConfig({ enabled: false, duration: 15, instruments: [] });
    setInnuendoLevel(0);
    setReverseLyricsEnabled(false);
    setEpicLevel(0);
    setRhymeId('perfect');
    setSillyLevel(0);
    setSapphicLevel(0);
    setMusicalKey('C Major');
    setBpm(120);
    setTimeSignature('4/4');
    setSingerChildVoices({ miranda: false, annelies: false, fannie: false, emma: false });
    setSingerEmotions({ miranda: 'Joyful', annelies: 'Joyful', fannie: 'Joyful', emma: 'Joyful' });
    setSingerPrompts({ miranda: '', annelies: '', fannie: '', emma: '' });
    setSingerInstruments({ miranda: [], annelies: [], fannie: [], emma: [] });
    setSingerPartnerUps({ miranda: false, annelies: false, fannie: false, emma: false });
    setSingerNationalities({ miranda: '', annelies: '', fannie: '', emma: '' });
  };

  const handleUpdateImagePrompt = (key: 'start' | 'middle' | 'end', value: string) => {
    setSong(prev => ({
      ...prev,
      imagePrompts: {
        ...prev.imagePrompts!,
        [key]: value
      }
    }));
  };

  return {
    song,
    setSong,
    selectedInstruments,
    handleToggleInstrument,
    selectedStyles,
    handleToggleStyle,
    activeJob,
    setActiveJob,
    showLogs,
    setShowLogs,
    showGenerate,
    setShowGenerate,
    showKaraoke,
    setShowKaraoke,
    showSpoiler,
    setShowSpoiler,
    showImagePrompts,
    setShowImagePrompts,
    showStory,
    setShowStory,
    showPortrait,
    setShowPortrait,
    showWardrobe,
    setShowWardrobe,
    showCulinary,
    setShowCulinary,
    showFarm,
    setShowFarm,
    doubleFailedJob,
    setDoubleFailedJob,
    activePortraitType,
    portraitPrompts,
    handleGeneratePortraits,
    handleUpdateImagePrompt,
    handleGenerateStoryPrompts,
    rating,
    setRating,
    selectedDialectId,
    setSelectedDialectId,
    childVoice,
    setChildVoice,
    selfReflect,
    setSelfReflect,
    selectedSoundEffects,
    setSelectedSoundEffects,
    introConfig,
    setIntroConfig,
    outroConfig,
    setOutroConfig,
    helpContent,
    setHelpContent,
    selectedSinger,
    setSelectedSinger,
    handleAction,
    handleGenerate,
    jobs,
    leftLibrary,
    rightLibrary,
    addToLibrary,
    removeFromLibrary,
    viewItem,
    setViewItem,
    handleFileDrop,
    isMp3Matched,
    handleDropMp3,
    showContentSettings,
    setShowContentSettings,
    forbiddenTopics,
    handleToggleForbiddenTopic,
    innuendoLevel,
    setInnuendoLevel,
    reverseLyricsEnabled,
    setReverseLyricsEnabled,
    epicLevel,
    setEpicLevel,
    rhymeId,
    setRhymeId,
    sillyLevel,
    setSillyLevel,
    sapphicLevel,
    setSapphicLevel,
    wildnessLevel,
    setWildnessLevel,
    musicalKey,
    setMusicalKey,
    bpm,
    setBpm,
    timeSignature,
    setTimeSignature,
    singerChildVoices,
    setSingerChildVoices,
    singerEmotions,
    setSingerEmotions,
    singerPrompts,
    setSingerPrompts,
    singerInstruments,
    setSingerInstruments,
    singerPartnerUps,
    setSingerPartnerUps,
    singerNationalities,
    setSingerNationalities,
    handleResetGenerationSettings
  };
}
