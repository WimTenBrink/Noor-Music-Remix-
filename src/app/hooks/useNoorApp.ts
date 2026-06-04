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
  GENERATE_PORTRAITS_PROMPT 
} from '../../constants/prompts';
import { 
  SYSTEM_INSTRUCTIONS, 
  SYSTEM_INSTRUCTIONS_LYRICS, 
  SYSTEM_INSTRUCTIONS_INTERVIEW, 
  SYSTEM_INSTRUCTIONS_STORY_AND_IMAGES, 
  SYSTEM_INSTRUCTIONS_PORTRAITS 
} from '../../constants/instructions';
import { SINGERS } from '../../constants/singers';
import { THE_BAND_MD } from '../../constants/the_band';
import { SYSTEM_INSTRUCTIONS_MD, MANUAL_MD, CODE_OVERVIEW_MD } from '../../constants/help';
import { findDialectById } from '../utils/languages';
import { getInnuendoStep } from '../utils/innuendoLevels';
import { getEpicStep } from '../utils/epicLevels';
import { findRhymeTypeById } from '../utils/rhymes';
import { reverseLyrics } from '../utils/lyricsParser';

function getDialectStyleRules(id: string): string {
  switch (id) {
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

    default:
      const d = findDialectById(id);
      return `${d.name}. Compose in ${d.name}${d.description ? ` (${d.description})` : ''}. Make sure to write authentic lyrics in this regional style or dialect naturally.`;
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

  const [rhymeId, setRhymeId] = useState<string>(() => {
    return localStorage.getItem('noor-rhyme-id') || 'perfect';
  });

  useEffect(() => {
    localStorage.setItem('noor-rhyme-id', rhymeId);
  }, [rhymeId]);
  const [helpContent, setHelpContent] = useState<{ title: string; content: string; filename?: string } | null>(null);
  const [selectedSinger, setSelectedSinger] = useState<{ name: string; photo: string; bioPath: string } | null>(null);
  
  const [childVoice, setChildVoice] = useState<boolean>(() => {
    return localStorage.getItem('noor-child-voice') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('noor-child-voice', childVoice ? 'true' : 'false');
  }, [childVoice]);

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
  const { log } = useLogs();

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
    targetRhymeId?: string
  ) => {
    const resolvedDialectId = targetDialectId !== undefined ? targetDialectId : selectedDialectId;
    const resolvedRating = targetRating !== undefined ? targetRating : rating;
    const resolvedInstruments = targetInstruments !== undefined ? targetInstruments : selectedInstruments;
    const resolvedStyles = targetStyles !== undefined ? targetStyles : selectedStyles;
    const resolvedChildVoice = targetChildVoice !== undefined ? targetChildVoice : childVoice;
    const resolvedSoundEffects = targetSoundEffects !== undefined ? targetSoundEffects : selectedSoundEffects;
    const resolvedIntroConfig = targetIntroConfig !== undefined ? targetIntroConfig : introConfig;
    const resolvedOutroConfig = targetOutroConfig !== undefined ? targetOutroConfig : outroConfig;
    const resolvedSelfReflect = targetSelfReflect !== undefined ? targetSelfReflect : selfReflect;
    const resolvedInnuendoLevel = targetInnuendoLevel !== undefined ? targetInnuendoLevel : innuendoLevel;
    const resolvedReverseLyrics = targetReverseLyrics !== undefined ? targetReverseLyrics : reverseLyricsEnabled;
    const resolvedEpicLevel = targetEpicLevel !== undefined ? targetEpicLevel : epicLevel;
    const resolvedRhymeId = targetRhymeId !== undefined ? targetRhymeId : rhymeId;

    if (targetDialectId !== undefined && targetDialectId !== selectedDialectId) {
      setSelectedDialectId(targetDialectId);
    }
    if (targetRating !== undefined && targetRating !== rating) {
      setRating(targetRating);
    }
    if (targetInstruments !== undefined) {
      setSelectedInstruments(targetInstruments);
    }
    if (targetStyles !== undefined) {
      setSelectedStyles(targetStyles);
    }
    if (targetChildVoice !== undefined) {
      setChildVoice(targetChildVoice);
    }
    if (targetSoundEffects !== undefined) {
      setSelectedSoundEffects(targetSoundEffects);
    }
    if (targetIntroConfig !== undefined) {
      setIntroConfig(targetIntroConfig);
    }
    if (targetOutroConfig !== undefined) {
      setOutroConfig(targetOutroConfig);
    }
    if (targetSelfReflect !== undefined) {
      setSelfReflect(targetSelfReflect);
    }
    if (targetInnuendoLevel !== undefined) {
      setInnuendoLevel(targetInnuendoLevel);
    }
    if (targetReverseLyrics !== undefined) {
      setReverseLyricsEnabled(targetReverseLyrics);
    }
    if (targetEpicLevel !== undefined) {
      setEpicLevel(targetEpicLevel);
    }
    if (targetRhymeId !== undefined) {
      setRhymeId(targetRhymeId);
    }

    const dialectIds = resolvedDialectId.split(',').filter(Boolean);
    const primaryDialectId = dialectIds[0] || 'en-US';
    const dialect = findDialectById(primaryDialectId);
    let languageInfo = '';
    
    if (dialectIds.length === 0) {
      languageInfo = "No specific language or dialect restrictions have been specified. You may default to English or compose the song in whichever language/dialect is best suited for the prompt.";
    } else if (dialectIds.length === 1) {
      languageInfo = getDialectStyleRules(primaryDialectId);
    } else {
      const languageNames = dialectIds.map(id => findDialectById(id).name).join(', ');
      const primaryName = findDialectById(primaryDialectId).name;
      languageInfo = `BILINGUAL/MULTILINGUAL COMPOSITION (CRITICAL): This song MUST be composed in MULTIPLE LANGUAGES. The active languages in order of importance are: ${languageNames}. The primary language is ${primaryName}.
You must weave these languages together throughout the song - for example, write some verses/chorus lines in the primary language, other sections/verses in the secondary/supporting languages, blending them smoothly and comically/dramatically as appropriate based on their characters. Do not write full songs in only one language.
Below are the specific styling and composition guidelines for each selected language/accent:
${dialectIds.map((id, index) => `${index + 1}. [${findDialectById(id).name}]: ${getDialectStyleRules(id)}`).join('\n')}`;
    }

    const innuendoStep = getInnuendoStep(resolvedInnuendoLevel);
    const innuendoText = `${innuendoStep.level}. ${innuendoStep.label} - ${innuendoStep.description}`;

    const epicStep = getEpicStep(resolvedEpicLevel);
    const epicText = `${epicStep.level}. ${epicStep.label} - ${epicStep.description}`;

    const rhymeStep = findRhymeTypeById(resolvedRhymeId);
    const rhymeText = `${rhymeStep.name}: ${rhymeStep.description}`;

    const prompt = GENERATE_LYRICS_PROMPT(instructions, resolvedInstruments, resolvedStyles, resolvedRating, forbiddenTopics, languageInfo, musicInspiration, coreGrooves, emotion, resolvedIntroConfig, resolvedOutroConfig, resolvedSelfReflect, innuendoText, epicText, rhymeText);
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
      rhymeId: resolvedRhymeId
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

    const languageLabel = dialectIds.length === 0 ? 'Default English' : dialectIds.map(id => findDialectById(id).name).join(' + ');
    const jobId = addJob(`Lyrics: ${instructions.substring(0, 20)}...`, 'normal', prompt, apiKey || '', generationSettings, customSystemInstructions);
    log('info', 'Job Added', `New generation job added: ${jobId} (Rating: ${resolvedRating}, Language: ${languageLabel}${emotion ? `, Emotion: ${emotion}` : ''}${resolvedChildVoice ? ', Vocals: Children' : ''})`);
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
            if (typeof parsedContent === 'object' && parsedContent !== null && ('lyrics' in parsedContent || 'title' in parsedContent)) {
              setSong(parsedContent);
              log('info', 'Song Loaded', `Song "${parsedContent.title || 'Untitled'}" loaded into workspace.`);
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
                  if (typeof parsedContent === 'object' && parsedContent !== null && ('lyrics' in parsedContent || 'title' in parsedContent)) {
                    setSong(parsedContent);
                    log('info', 'Song Loaded', `Song "${parsedContent.title || 'Untitled'}" loaded into workspace.`);
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
        setSelectedInstruments([]);
        setSelectedStyles([]);
        setLeftLibrary([]);
        setRightLibrary([]);
        setForbiddenTopics({
          barefoot: false,
          naturism: false,
          farm: false,
          singers: false
        });
        setRating('G');
        setSelectedDialectId('');
        setInnuendoLevel(0);
        setReverseLyricsEnabled(false);
        setEpicLevel(0);
        setRhymeId('perfect');
        const empty = { wan: '', sdxl: '' };
        const emptyPrompts = { miranda: { ...empty }, annelies: { ...empty }, fannie: { ...empty }, emma: { ...empty } };
        setPortraitPrompts({
          Face: { ...emptyPrompts },
          Torso: { ...emptyPrompts },
          Body: { ...emptyPrompts }
        });
        setDoubleFailedAlerts(new Set());
        setAppliedJobIds(new Set());
        setApiKey(null);
        clearQueue();

        // Reset dialog states
        setActiveJob(null);
        setShowLogs(false);
        setShowGenerate(false);
        setShowKaraoke(false);
        setShowSpoiler(false);
        setShowImagePrompts(false);
        setShowStory(false);
        setShowPortrait(false);
        setShowWardrobe(false);
        setShowCulinary(false);
        setShowFarm(false);
        setViewItem(null);
        setShowContentSettings(false);
        setHelpContent(null);
        setSelectedSinger(null);
        setDoubleFailedJob(null);

        log('info', 'Environment Cleared', 'All fields, settings, and jobs have been completely reset.');
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
          setSong(prev => ({
            ...prev,
            title: result.title || prev.title,
            style: result.style || prev.style,
            lyrics: result.lyrics || prev.lyrics
          }));
          log('info', 'Lyrics Generated', `Lyrics generated successfully for "${result.title}". Downstream tasks (Interview, Story & Images) initiated.`);

          // Spawn Interview
          const interviewPrompt = GENERATE_INTERVIEW_PROMPT(result.title || 'Untitled Song', result.lyrics || '');
          addJob(
            `Interview: ${result.title || 'Untitled Song'}`, 
            'normal', 
            interviewPrompt, 
            apiKey || '', 
            undefined, 
            SYSTEM_INSTRUCTIONS_INTERVIEW
          );

          // Spawn Story & Image Prompts
          const storyPrompt = GENERATE_STORY_AND_IMAGE_PROMPTS_PROMPT(result.title || 'Untitled Song', result.lyrics || '', rating, forbiddenTopics);
          addJob(
            `Story & Image Prompts: ${result.title || 'Untitled Song'}`, 
            'normal', 
            storyPrompt, 
            apiKey || '', 
            undefined, 
            SYSTEM_INSTRUCTIONS_STORY_AND_IMAGES
          );

          // Save song to Right Library
          const item: LibraryItem = {
            id: job.id,
            name: result.title || 'Untitled Song',
            type: 'song',
            content: {
              ...song,
              title: result.title,
              style: result.style,
              lyrics: result.lyrics
            },
          };
          addToLibrary(item, 'right');

          // Download song JSON file automatically
          downloadJson(result, result.title || 'Untitled Song');
          log('info', 'File Saved', `Freshly generated song "${result.title}" automatically saved and downloaded.`);
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
          addJob(
            `Portraits: ${songTitle}`, 
            'normal', 
            portraitsPrompt, 
            apiKey || '', 
            undefined, 
            SYSTEM_INSTRUCTIONS_PORTRAITS
          );
        }

        // 3. Process "Interview" job completion
        else if (job.name.startsWith('Interview: ')) {
          setSong(prev => ({
            ...prev,
            interview: result.interview || prev.interview
          }));
          log('info', 'Interview Generated', `Music journalist interview on "${job.name.replace('Interview: ', '')}" finished successfully.`);
        }

        // 4. Process "Portraits" job completion
        else if (job.name.startsWith('Portraits: ')) {
          setSong(prev => ({
            ...prev,
            storyPrompts: result.storyPrompts || prev.storyPrompts || result
          }));
          log('info', 'Portraits Generated', `Character portrait prompt variations mapped successfully.`);
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
  }, [jobs, appliedJobIds, apiKey, rating, forbiddenTopics, song, addToLibrary]);

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
  };
}
