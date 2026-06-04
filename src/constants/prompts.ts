import { ForbiddenTopics } from '../types';

export const GENERATE_PROMPT = (
  instructions: string, 
  instruments: string[], 
  styles: string[], 
  rating: string, 
  hasStory: boolean, 
  forbiddenTopics: ForbiddenTopics, 
  languageInfo: string,
  musicInspiration?: string,
  coreGrooves?: string[],
  emotion?: string,
  selfReflect: boolean = true
) => {
  const forbiddenTextList: string[] = Object.entries(forbiddenTopics)
    .filter(([_, value]) => value)
    .map(([key]) => {
      switch(key) {
        case 'barefoot': return 'DO NOT mention feet, being barefoot, or toes.';
        case 'naturism': return 'DO NOT mention naturism, nudity, naked bodies, or being unadorned.';
        case 'farm': return 'DO NOT mention the farm, rural life, cows, farm chores, or the band\'s life on a farm.';
        case 'singers': return 'DO NOT mention specific singer names in the lyrics or tags. Use generic vocal tags like [Female Lead Soprano] or [Female Vocal Duo]. Make the lyrics generic and universal, avoiding specific personal details and relationships.';
        default: return '';
      }
    })
    .filter(Boolean);

  if (!selfReflect) {
    forbiddenTextList.push(
      'SELF-REFLECTION DISABLED (CRITICAL): This song is NOT allowed to self-reflect or reference the singers/band in any way. DO NOT mention the singers (Miranda, Annelies, Fannie, Emma), their unique habits, being barefoot, or nudity/naturism. No bare feet, nudity, or names of the singers are allowed inside the lyrics or vocoder/vocal tags under any circumstance. (EXCEPTION: If instructions explicitly override this and request to mention a specific singer detail, follow that direction only.)'
    );
  }

  const forbiddenText = forbiddenTextList.join('\n');

  return `
Generate a new song based on the following user instructions:
"${instructions}"

${emotion ? `Explore the following main emotion/feeling throughout the song: "${emotion}"\n(You MUST reflect this specific emotional shade in the lyrics, performance delivery speed/articulation guidelines, and general musical structure.)` : ''}

Content Rating: ${rating}
(Ensure the lyrics and themes strictly adhere to the ${rating} rating guidelines as defined in your system instructions.)

Target Language / Dialect: ${languageInfo}
(You MUST compose the song lyrics, vocabulary, phrasing, and style naturally using the specified language and dialect. For dialects of English or other European languages, ensure you use the exact spellings, idioms, slang, and phonetic characteristics appropriate for that dialect.)

**CRITICAL - NO ENGLISH TRANSLATIONS:** You MUST NOT include any English translations, bilingual/dual-language translations, or parallel text under or alongside the target language lyrics. Write ONLY the pure, untranslated lyrics of the target language. If any English translations are included, SUNO gets confused and sings both languages together, ruining the track.

${musicInspiration ? `**MUSICAL INSPIRATION & ARTIST REFERENCES (Composition and Style only):**
- Strongly base the musical style, arrangement, instrumentation cues, and overall production energy on: "${musicInspiration}".
- **CRITICAL:** Do NOT mention or reference any of these specific artists, bands, or their trademark titles inside the song's actual LYRICS. This inspiration is strictly for the musical performance tags, style tags, and composition directions.` : ''}

Suggested Musical Elements & Parameter Settings (These are suggestions/guidelines; you have full creative authority to override, change, add, or skip any of these if it dramatically improves the song quality, lyrical flow, or vocal style of the piece):
- Suggested Styles: ${styles.length > 0 ? styles.join(", ") : "None selected. Please choose appropriate musical styles."}
- Suggested Instruments: ${instruments.length > 0 ? instruments.join(", ") : "None selected. Please choose appropriate instruments."}
- Suggested Core Grooves / Beats styling: ${coreGrooves && coreGrooves.length > 0 ? coreGrooves.join(", ") : "None specified."}

${forbiddenText ? `**CRITICAL TOPIC CONSTRAINTS:**\n${forbiddenText}\n` : ''}

Please ensure the lyrics reflect the band's persona (Noor) and their specific musical skills as defined in your system instructions.
- **SAPPHIC & LESBIAN FOCUS:** All lyrics and storytelling must be strictly focused on female characters with sapphic/lesbian preferences. Avoid any reference to men, male names, male pronouns, or the male anatomy under any circumstance (unless user instructions explicitly specify otherwise).
- **DOUBLE & TRIPLE ENTENDRES:** Incorporate clever, layered double or triple entendres where innocent terms (like mechanical components, natural terms, pocket features, or musical descriptions) carry subtle sensual, sapphic connotations. Not all songs need to be explicit or sexual, but subtextual layered meanings are highly valued.
- Include a specific musical key (e.g., Key: G Major, C Minor) and tempo (BPM) at every [Verse], [Chorus], [Bridge], or song part that perfectly fits the song's tune.
- Ensure the key chosen matches the female/feminine vocal range. Specifically for deeper voices (such as Emma Vermeer's Feminine Contralto lower registers), choose a bright, clear, and inherently feminine key (e.g., major keys or lighter minor keys like A Minor, C Major, G Major, F Major, E Minor) and specify high-resonance, feminine registers in the tags so that her deep chest vocals are clearly identifiable as a female contralto rather than mistaken for a male voice.
- Highlight any melodic peaks in each section with explicit performance instructions (e.g., "[Melodic Peak: High sustained F5, sparkling and clear]").
- Include detailed instructions for "Consonant Timing" (e.g., "[Consonant Timing: Crisp delivery, sharp plosive articulation, sustained resonant vowels]") inside the tags to lock the vocal phrasing perfectly with the rhythm.
In the lyrics, use tags that include both the voice type and relationship context where appropriate. ${(!selfReflect || forbiddenTopics.singers) ? 'DO NOT use names like Miranda, Annelies, Fannie, or Emma.' : 'Include the singer\'s name (e.g., [Miranda - Soprano]).'}
ALL instructions and tags in the lyrics MUST be in square brackets []. NEVER use parentheses () for instructions.

${!hasStory ? 'Additionally, generate a short "story" (about 200 words) based on the lyrics that can be used for image generation. Also generate "storyPrompts" for each singer (Miranda, Annelies, Fannie, Emma) as defined in your system instructions.' : ''}

Return the result as a JSON object with "title", "style", "lyrics", "imagePrompts"${!hasStory ? ', "story", and "storyPrompts"' : ''} fields.
`;
};

export const GENERATE_LYRICS_PROMPT = (
  instructions: string, 
  instruments: string[], 
  styles: string[], 
  rating: string, 
  forbiddenTopics: ForbiddenTopics, 
  languageInfo: string,
  musicInspiration?: string,
  coreGrooves?: string[],
  emotion?: string,
  introConfig?: any,
  outroConfig?: any,
  selfReflect: boolean = true,
  innuendoLevelText?: string,
  epicLevelText?: string,
  rhymeStyleText?: string
) => {
  const forbiddenTextList: string[] = Object.entries(forbiddenTopics)
    .filter(([_, value]) => value)
    .map(([key]) => {
      switch(key) {
        case 'barefoot': return 'DO NOT mention feet, being barefoot, or toes.';
        case 'naturism': return 'DO NOT mention naturism, nudity, naked bodies, or being unadorned.';
        case 'farm': return 'DO NOT mention the farm, rural life, cows, farm chores, or the band\'s life on a farm.';
        case 'singers': return 'DO NOT mention specific singer names in the lyrics or tags. Use generic vocal tags like [Female Lead Soprano] or [Female Vocal Duo]. Make the lyrics generic and universal, avoiding specific personal details and relationships.';
        default: return '';
      }
    })
    .filter(Boolean);

  if (!selfReflect) {
    forbiddenTextList.push(
      'SELF-REFLECTION DISABLED (CRITICAL): This song is NOT allowed to self-reflect or reference the singers/band in any way. DO NOT mention the singers (Miranda, Annelies, Fannie, Emma), their unique habits, being barefoot, or nudity/naturism. No bare feet, nudity, or names of the singers are allowed inside the lyrics or vocoder/vocal tags under any circumstance. (EXCEPTION: If instructions explicitly override this and request to mention a specific singer detail, follow that direction only.)'
    );
  }

  const forbiddenText = forbiddenTextList.join('\n');

  return `
Generate a new song based on the following user instructions:
"${instructions}"

${emotion ? `Explore the following main emotion/feeling throughout the song: "${emotion}"\n(You MUST reflect this specific emotional shade in the lyrics, performance delivery speed/articulation guidelines, and general musical structure.)` : ''}

Content Rating: ${rating}
(Ensure the lyrics and themes strictly adhere to the ${rating} rating guidelines as defined in your system instructions.)

${innuendoLevelText ? `Sensual/Sexual Innuendo Intended Level: "${innuendoLevelText}"
**CRITICAL SAFETY OVERRIDE**: The Content Rating of "${rating}" dictates how safe the lyrics must be. While aiming for the innuendo tone described above, you MUST strictly satisfy and stay within the boundaries of the "${rating}" rating instructions. If the chosen innuendo level is too high or explicit for a "${rating}" rating (for instance, if the rating is G or PG, and the innuendo level is highly physical/seductive), you MUST temper, tone down, or filter the content so it remains absolutely compliant with the active safety boundaries. In those safe modes, rely on extremely subtle, innocent poetic styling instead of direct touch or physical double entendres.` : ''}

${epicLevelText ? `Epic Drama Level & Arrangement: "${epicLevelText}"
(You MUST adjust the song's composition cues, arrangement notes, vocal dynamics, performance instruction tags in brackets, and lyric structure to convey this style. Lower levels represent basic, minimalist pop whereas higher levels command monumental, theatrical operatic and symphonic structures with heavy orchestration cues, choir accents, dramatic climaxes, and epic dynamics.)` : ''}

${rhymeStyleText ? `Rhyme Scheme / Structure constraint: "${rhymeStyleText}"
(You MUST follow this rhyming style strictly. If the style requests "No Rhyme" or specific poetic syllable structures like Haiku/Tanka or rhythmic vocal chants like Haka, do NOT force traditional pop rhyming. Implement the requested rhyme scheme or lack thereof thoroughly inside the verses and chorus sections.)` : ''}

Target Language / Dialect: ${languageInfo}
(You MUST compose the song lyrics, vocabulary, phrasing, and style naturally using the specified language and dialect.)

**CRITICAL - NO ENGLISH TRANSLATIONS:** You MUST NOT include any English translations, bilingual/dual-language translations, or parallel text under or alongside the target language lyrics. Write ONLY the pure, untranslated lyrics of the target language. If any English translations are included, SUNO gets confused and sings both languages together, ruining the track.

${musicInspiration ? `**MUSICAL INSPIRATION & ARTIST REFERENCES (Composition and Style only):**
- Strongly base the musical style, arrangement, instrumentation cues, and overall production energy on: "${musicInspiration}".
- **CRITICAL:** Do NOT mention or reference any of these specific artists, bands, or their trademark titles inside the song's actual LYRICS. This inspiration is strictly for the musical performance tags, style tags, and composition directions.` : ''}

${introConfig?.enabled ? `**INSTRUMENTAL INTRO SPECIFICATION (SUNO-OPTIMIZED):**
- You MUST create an instrumental intro at the start of the lyrics.
- **Duration Style:** Mapping to a duration of roughly ${introConfig.duration} seconds.
- **Instruments to feature in intro:** ${introConfig.instruments.length > 0 ? introConfig.instruments.join(', ') : 'selected theme instruments'}.
- **CRITICAL FORMATTING:** Do NOT write any timing labels like "duration: ${introConfig.duration}s" in the brackets! Write the section exactly using appropriate SUNO acoustic tags as defined in your system instructions, e.g. for Standard Build (~20s): \`[Instrumental Intro]\` followed by \`[Solo/Melody: <Instrument>]\`. Keep it completely vocal-free.` : ''}

${outroConfig?.enabled ? `**INSTRUMENTAL OUTRO SPECIFICATION (SUNO-OPTIMIZED):**
- You MUST create an instrumental outro at the end of the lyrics.
- **Duration Style:** Mapping to a duration of roughly ${outroConfig.duration} seconds.
- **Instruments to feature in outro:** ${outroConfig.instruments.length > 0 ? outroConfig.instruments.join(', ') : 'selected theme instruments'}.
- **CRITICAL FORMATTING:** Do NOT write any timing labels in the brackets! Write using appropriate SUNO acoustic ending tags as defined in your system instructions (e.g., \`[Outro]\`, \`[Decrescendo]\`, \`[Fade Out]\`). Keep it completely vocal-free.` : ''}

Suggested Musical Elements & Parameter Settings (These are suggestions/guidelines; you have full creative authority to override, change, add, or skip any of these if it dramatically improves the song quality, lyrical flow, or vocal style of the piece):
- Suggested Styles: ${styles.length > 0 ? styles.join(", ") : "None selected. Please choose appropriate musical styles."}
- Suggested Instruments: ${instruments.length > 0 ? instruments.join(", ") : "None selected. Please choose appropriate instruments."}
- Suggested Core Grooves / Beats styling: ${coreGrooves && coreGrooves.length > 0 ? coreGrooves.join(", ") : "None specified."}

${forbiddenText ? `**CRITICAL TOPIC CONSTRAINTS:**\n${forbiddenText}\n` : ''}

Please ensure the lyrics reflect the band's persona (Noor) and their specific musical skills as defined in your system instructions.
- **SAPPHIC & LESBIAN FOCUS:** All lyrics and storytelling must be strictly focused on female characters with sapphic/lesbian preferences. Avoid any reference to men, male names, male pronouns, or the male anatomy under any circumstance (unless user instructions explicitly specify otherwise).
- **DOUBLE & TRIPLE ENTENDRES:** Incorporate clever, layered double or triple entendres where innocent terms (like mechanical components, natural terms, pocket features, or musical descriptions) carry subtle sensual, sapphic connotations. Not all songs need to be explicit or sexual, but subtextual layered meanings are highly valued.
- Include a specific musical key (e.g., Key: G Major, C Minor) and tempo (BPM) at every [Verse], [Chorus], [Bridge], or song part that perfectly fits the song's tune.
- Ensure the key chosen matches the female/feminine vocal range. Specifically for deeper voices (such as Emma Vermeer's Feminine Contralto lower registers), choose a bright, clear, and inherently feminine key (e.g., major keys or lighter minor keys like A Minor, C Major, G Major, F Major, E Minor) and specify high-resonance, feminine registers in the tags so that her deep chest vocals are clearly identifiable as a female contralto rather than mistaken for a male voice.
- Highlight any melodic peaks in each section with explicit performance instructions (e.g., "[Melodic Peak: High sustained F5, sparkling and clear]").
- Include detailed instructions for "Consonant Timing" (e.g., "[Consonant Timing: Crisp delivery, sharp plosive articulation, sustained resonant vowels]") inside the tags to lock the vocal phrasing perfectly with the rhythm.
In the lyrics, use tags that include both the voice type and relationship context where appropriate. ${(!selfReflect || forbiddenTopics.singers) ? 'DO NOT use names like Miranda, Annelies, Fannie, or Emma.' : 'Include the singer\'s name (e.g., [Miranda - Soprano]).'}
ALL instructions and tags in the lyrics MUST be in square brackets []. NEVER use parentheses () for instructions.

Return a JSON object with:
{
  "title": "...",
  "style": "...",
  "lyrics": "..."
}
`;
};

export const GENERATE_INTERVIEW_PROMPT = (title: string, lyrics: string) => {
  return `
Based on the newly created song "${title}" with the following lyrics:

"${lyrics}"

Task: Generate a concise, journalistic behind-the-scenes conversation in Markdown format with the four singers of the band (Miranda, Annelies, Fannie, Emma) about this newly created song, conducted by Dutch music journalist Senna Bakker. The conversation takes place in our studio in Abcoude.

Word Count: MUST be strictly between 300 and 500 words. Keep it very concise, highly focused, and strictly informative!

Core Constraints for the Interview Content:
1. **Focus on the Song, Concept, & Technical Specifications**: The interview must focus heavily on the song's concept, the themes, and the technical musical specifications (e.g., key, tempo/BPM choices, instrumentation reasoning, vocal registry techniques).
2. **NO BAND DETAILS**: Do NOT discuss the band members' personal lives, individual traits, or band background. Focus entirely on the song itself.
3. **NO SPOILERS / NO DIRECT LYRICS DISCUSSION**: Do NOT reveal specific lines, verses, chorus text, or direct quotes from the song lyrics themselves. The interview must discuss the broader themes, poetic metaphors, and musical layers without spoiling the actual lyrics of the song! Keep the mystery and let the reader guess the song's meaning by listening/reading the lyrics separately.

Formatting: Use elegant, highly human-readable markdown with clear headings (# and ##), subheadings, paragraphs, bullet points, and dialog speaker names (e.g., **Senna Bakker:**, **Miranda Noor:**). Do NOT include any images.

Return the result as a JSON object with:
{
  "interview": "..."
}
`;
};

export const GENERATE_STORY_AND_IMAGE_PROMPTS_PROMPT = (title: string, lyrics: string, rating: string, forbiddenTopics: ForbiddenTopics) => {
  const forbiddenText = Object.entries(forbiddenTopics)
    .filter(([_, value]) => value)
    .map(([key]) => {
      switch(key) {
        case 'barefoot': return 'DO NOT mention feet, being barefoot, or toes.';
        case 'naturism': return 'DO NOT mention naturism, nudity, naked bodies, or being unadorned.';
        default: return '';
      }
    })
    .filter(Boolean)
    .join('\n');

  return `
Based on the newly created song "${title}" with the following lyrics:

"${lyrics}"

Task: Generate:
1. "story": A short story (about 200 words) based on the lyrics that can be used for image generation.
2. "imagePrompts": A JSON object with "start", "middle", and "end" fields, each containing a unique prompt for WAN image generation.

Content Rating: ${rating}
${forbiddenText ? `**CRITICAL TOPIC CONSTRAINTS:**\n${forbiddenText}\n` : ''}

Ensure your image prompts strictly follow the 7-step sequential structural formula defined in your system instructions (scene setting first, barefoot, no clothing mentioned, detailed sequential traits for Miranda, Annelies, Fannie, and Emma).

Return the result as a JSON object with:
{
  "story": "...",
  "imagePrompts": {
    "start": "...",
    "middle": "...",
    "end": "..."
  }
}
`;
};

export const GENERATE_PORTRAITS_PROMPT = (title: string, story: string, noClothes: boolean = false) => {
  return `
Based on the song "${title}" and its background story:
"${story}"

Generate "storyPrompts" for the WAN & SDXL portrait generation matching the StoryPrompts interface.
No Clothes setting: ${noClothes ? 'Yes (without any clothing)' : 'No'}

Each character/couple/group prompt field MUST contain:
- wan: A detailed, artistic, and sanitized description of the person(s)' body and the surrounding environment (no clothes mentioned, barefoot).
- sdxl: A weighted prompt description (can specify clothing or no clothing, cup sizes for SDXL e.g. "(flat chest:1.3)", "(AA cup:1.2)").

Categories:
- "miranda": Single person
- "annelies": Single person
- "fannie": Single person
- "emma": Single person
- "mirandaAnnelies": Couple
- "fannieEmma": Couple
- "group": All four singers

Return the result as a JSON object with:
{
  "storyPrompts": {
    "miranda": { "wan": "...", "sdxl": "..." },
    "annelies": { "wan": "...", "sdxl": "..." },
    "fannie": { "wan": "...", "sdxl": "..." },
    "emma": { "wan": "...", "sdxl": "..." },
    "mirandaAnnelies": { "wan": "...", "sdxl": "..." },
    "fannieEmma": { "wan": "...", "sdxl": "..." },
    "group": { "wan": "...", "sdxl": "..." }
  }
}
`;
};
