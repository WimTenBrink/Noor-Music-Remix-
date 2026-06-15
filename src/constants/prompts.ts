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
  rhymeStyleText?: string,
  sillyLevelText?: string,
  musicalKey?: string,
  bpm?: number,
  timeSignature?: string,
  sapphicLevelText?: string,
  singerNationalitiesText?: string,
  wildnessLevelText?: string,
  suggestedTitle?: string,
  isExactTitle?: boolean,
  intentEnergyText?: string
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
Generate a new song based on the following instructions and details:

**CRITICAL STRING LENGTH LIMIT (MANDATORY):**
- The returned "lyrics" string in your JSON output MUST NOT exceed 5,000 characters under any circumstances! Keep the song structure compact and focused so that the total lyrics and performance tags text does not cross this absolute 5,000 character maximum threshold limit.

${suggestedTitle ? `**SONG TITLE REQUIREMENT:**\n- "${suggestedTitle}"\n${isExactTitle ? `(CRITICAL: You MUST use EXACTLY this title "${suggestedTitle}" with no alterations or changes under any condition when returning the song's "title" field in the JSON output.)` : `(CRITICAL: You MUST use, prioritize, or heavily align with this suggested title when returning the song's "title" field in the JSON output. However, since the user specified it as a SUGGESTION, you are allowed to slightly refine, adapt, or change it if you have a creative and superior poetic idea.)`}` : ''}

**LYRICS DIRECTIVES & GUIDELINES:**
"${instructions}"

**CRITICAL MUSICAL BLUEPRINT SETTINGS (MUST FOLLOW SYSTEMATICALLY):**
${musicalKey ? `* **Main Musical Key:** ${musicalKey} (CRITICAL: You must use ${musicalKey} as the foundation for the song arrangement. Annotate sections with [Key: ${musicalKey}] tags.)` : ''}
${bpm ? `* **Main Tempo Speed (BPM):** ${bpm} Beats Per Minute (CRITICAL: You must write structural cues or tags like [BPM: ${bpm}] and align phrasing speed with a ${bpm} count.)` : ''}
${timeSignature ? `* **Main Time Signature Rhythm:** ${timeSignature} signature (CRITICAL: Structure the meter, lyric lines, accentuation, and rhythms to naturally flow in ${timeSignature} time signature. E.g., make sure lyrics have appropriate syllabic stresses if in 3/4, 7/8, etc.)` : ''}

${emotion ? `Explore the following main emotion/feeling throughout the song: "${emotion}"\n(You MUST reflect this specific emotional shade in the lyrics, performance delivery speed/articulation guidelines, and general musical structure.)` : ''}

Content Rating: ${rating}
(Ensure the lyrics and themes strictly adhere to the ${rating} rating guidelines as defined in your system instructions.)

${innuendoLevelText ? `Sensual/Sexual Innuendo Intended Level: "${innuendoLevelText}"
**CRITICAL SAFETY OVERRIDE**: The Content Rating of "${rating}" dictates how safe the lyrics must be. While aiming for the innuendo tone described above, you MUST strictly satisfy and stay within the boundaries of the "${rating}" rating instructions. If the chosen innuendo level is too high or explicit for a "${rating}" rating (for instance, if the rating is G or PG, and the innuendo level is highly physical/seductive), you MUST temper, tone down, or filter the content so it remains absolutely compliant with the active safety boundaries. In those safe modes, rely on extremely subtle, innocent poetic styling instead of direct touch or physical double entendres.` : ''}

${epicLevelText ? `Epic Drama Level & Arrangement: "${epicLevelText}"
(You MUST adjust the song's composition cues, arrangement notes, vocal dynamics, performance instruction tags in brackets, and lyric structure to convey this style. Lower levels represent basic, minimalist pop whereas higher levels command monumental, theatrical operatic and symphonic structures with heavy orchestration cues, choir accents, dramatic climaxes, and epic dynamics.)` : ''}

${rhymeStyleText ? `Rhyme Scheme / Structure constraint: "${rhymeStyleText}"
(You MUST follow this rhyming style strictly. If the style requests "No Rhyme" or specific poetic syllable structures like Haiku/Tanka or rhythmic vocal chants like Haka, do NOT force traditional pop rhyming. Implement the requested rhyme scheme or lack thereof thoroughly inside the verses and chorus sections.)` : ''}

${sillyLevelText ? `Silliness / Whimsicality Level: "${sillyLevelText}"
(You MUST adjust the lyrical themes, word selection, logical coherence, and general seriousness of the song based on this parameter, ranging from deeply serious and profound, to light-hearted humor, to extremely absurd, wacky, Dadaist ideas and utter nonsensical wordplay.)` : ''}

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

**MANDATORY MUSICAL STYLE, GENRE, INSTRUMENTS, AND GROOVE SELECTION:**
- You MUST strictly follow the user's enabled and selected options. These are NOT suggestions; they are mandatory guidelines for your generation.
- **Enabled Styles:** ${styles.length > 0 ? styles.join(", ") : "NO EXPLICIT STYLES SELECTED (Use standard barefoot acoustic singer-songwriter folk styles. NO default pop, NO generic electropop, unless requested.)"}
- **Enabled Instruments:** ${instruments.length > 0 ? instruments.join(", ") : "NO EXPLICIT INSTRUMENTS SELECTED (Use barefoot acoustic and percussion only. DO NOT assume heavy guitars, synths, or loud drums unless listed.)"}
- **Enabled Core Grooves / Beats Styling:** ${coreGrooves && coreGrooves.length > 0 ? coreGrooves.join(", ") : "NO SPECIFIC GROOVES SELECTED"}

${intentEnergyText ? `**INTENT & ENERGY PSYCHOPHYSIOLOGICAL SETTINGS (CRITICAL):**
${intentEnergyText}
(CRITICAL COMPOSITION DIRECTIVE: You MUST adapt the lyrics flow, rhythmic spacing, tension buildup/release, structural syncopation, vocal intensity, and detailed performance tags to perfectly materialise this target psychological state and energy direction.)\n` : ''}

*CRITICAL REQUIREMENT:* You are STRICTLY FORBIDDEN from adding, guessing, or substituting default pop terms (e.g. "minimalist pop", "sparse arrangement", "808 sub boom", "synth pluck", "clean vocals", "serious", "romantic", "battle hymn") to the style or arrangement UNLESS they are explicitly listed in the enabled fields above. If a style or instrument is not selected/enabled, it MUST NOT be used.

${singerNationalitiesText ? `**SINGER NATIONALITY & CULTURE SPECIFICATION (CRITICAL):**
${singerNationalitiesText}
(Note: These cultures do NOT determine the language of the lyrics, but they MUST alter/dictate the singers' vocal accents, performance phrasing, local vibrato styling, and their way of playing instruments, specially if no instruments are explicitly selected.)\n` : ''}

${forbiddenText ? `**CRITICAL TOPIC CONSTRAINTS:**\n${forbiddenText}\n` : ''}

Please ensure the lyrics reflect the band's persona (Noor) and their specific musical skills as defined in your system instructions.
- **SAPPHIC & LESBIAN FOCUS:** ${sapphicLevelText ? `This song has an active **Sapphic Meter Level of "${sapphicLevelText}"**. You MUST strictly follow the exact guidelines of this level regarding lesbian romance emphasis, female character focus, and male exclusion. Do not deviate from the requested level.` : 'All lyrics and storytelling must be strictly focused on female characters with sapphic/lesbian preferences. Avoid any reference to men, male names, male pronouns, or the male anatomy under any circumstance (unless user instructions explicitly specify otherwise).'}
- **WILDNESS & CHAOS LEVEL:** ${wildnessLevelText ? `This song has an active **Wildness and Chaos Level of "${wildnessLevelText}"**. You MUST model the dynamic intensity, musical speed/tempo shifts, vocal vocalization, chaotic noise cues, and chaos/calm density after this level.` : 'Maintain balanced and regular dynamic levels.'}
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

export const GENERATE_INTERVIEW_PROMPT = (title: string, lyrics: string, imageDescription?: string) => {
  const imageInspStr = imageDescription ? `\n\n**IMAGE INSPIRATION & KEY ORIGINAL CONTEXT (CRITICAL):**\nThis song is directly based on a visual image with the following detailed description:\n"${imageDescription}"\nIn the interview, the singers (Miranda, Annelies, Fannie, or Emma) or Senna Bakker MUST discuss this visual image description as the core creative inspiration or spark for the song's themes/lyrics or musical atmosphere.` : '';
  return `
Based on the newly created song "${title}" with the following lyrics:

"${lyrics}"${imageInspStr}

Task: Generate a concise, journalistic behind-the-scenes conversation in Markdown format with the four singers of the band (Miranda, Annelies, Fannie, Emma) about this newly created song, conducted by Dutch music journalist Senna Bakker (editor of the "Dutch Noise Chronicles" newspaper). 

**LOCATION & ENVIRONMENT (THE BARN STUDIO IN ABCOUDE):**
The interview takes place inside the singers' state-of-the-art sound studio, which is a beautifully converted barn in Abcoude where the four singers actually live. Senna Bakker is just visiting them!
- The studio building is structurally sturdy and sits right next to the stables (which are well-insulated against sound but houses their friendly goats and sheep that you can meet).
- The studio interior is designed with a sleek, warm-white, and very modern aesthetic (avoiding cold metal in favor of warm whites and ambient, inviting lighting).
- The interview room itself features two plush couches, some cozy poofs, and two low coffee tables with fresh copies of Senna's newspaper, "Dutch Noise Chronicles."
- The group is served both coffee and tea with rich Moka meringue pastries on the side.
- The walls are decorated with vibrant tour posters and more personal holiday photos of the four singers (which are a bit revealing).

Word Count: MUST be strictly between 300 and 500 words. Keep it very concise, highly focused, and strictly informative!

Core Constraints for the Interview Content:
1. **Focus on the Song, Concept, & Technical Specifications**: The interview must focus heavily on the song's concept, the themes, and the technical musical specifications (e.g., key, tempo/BPM choices, instrumentation reasoning, vocal registry techniques).
2. **NO BAND DETAILS**: Do NOT discuss the band members' personal lives, individual traits, or band background. Focus entirely on the song itself.
3. **NO SPOILERS / NO DIRECT LYRICS DISCUSSION**: Do NOT reveal specific lines, verses, chorus text, or direct quotes from the song lyrics themselves. The interview must discuss the broader themes, poetic metaphors, and musical layers without spoiling the actual lyrics of the song! Keep the mystery and let the reader guess the song's meaning by listening/reading the lyrics separately.

Formatting: Use elegant, highly human-readable markdown with clear headings (# and ##), subheadings, paragraphs, bullet points, and dialog speaker names (e.g., **Senna Bakker:**, **Miranda Noor:**). Do NOT include any images, HTML tags, or image elements under any condition. You are STRICTLY FORBIDDEN from outputting HTML elements like img, div, p or style attributes. It must be pure Markdown text (without any images or HTML elements whatsoever).

Return the result as a JSON object with:
{
  "interview": "..."
}
`;
};

export const GENERATE_STORY_AND_IMAGE_PROMPTS_PROMPT = (title: string, lyrics: string, rating: string, forbiddenTopics: ForbiddenTopics, imageDescription?: string) => {
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

  const imageInspStr = imageDescription ? `\n\n**IMAGE INSPIRATION & KEY ORIGINAL CONTEXT (CRITICAL):**\nThis song is directly based on a visual image with the following detailed description:\n"${imageDescription}"\nYou MUST incorporate the visual elements, description, and inspirations of this image directly into the generated story as the primary theme or setting origin of the song's story.` : '';

  return `
Based on the newly created song "${title}" with the following lyrics:

"${lyrics}"${imageInspStr}

Task: Generate:
1. "story": A short story (about 200 words) based on the lyrics and image description that can be used for image generation.
2. "imagePrompts": A JSON object with "start", "middle", and "end" fields, each containing a unique prompt for WAN image generation.

Content Rating: ${rating}
${forbiddenText ? `**CRITICAL TOPIC CONSTRAINTS:**\n${forbiddenText}\n` : ''}

Ensure your image prompts strictly follow the 7-step sequential structural formula defined in your system instructions (scene setting first, barefoot, no clothing mentioned, detailed sequential traits for Miranda, Annelies, Fannie, and Emma).

Return the result as a JSON object with:
{
  "story": "...",
  "imagePrompts": {
    "start": "...",
    "middle": "..." ,
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

export const GENERATE_TRANSLATION_PROMPT = (title: string, originalLyrics: string, dialectInfo: string) => {
  return `
Original Song Title: "${title}"
Original Dialect/accent configuration used: "${dialectInfo}"

Here are the original non-English lyrics:
${originalLyrics}

Please provide an accurate, line-by-line English translation of these lyrics (maintaining the same structure, headers like [Verse], [Chorus], and formatting). Also provide a beautiful explanation of the original language/dialect (origin, unique characteristics, or cultural context) as a separate markdown block.
Return your response as a JSON object matching this structure:
{
  "title": "...",
  "lyrics": "...",
  "explanation": "..."
}
`;
};

export const GENERATE_ENTENDRES_PROMPT = (title: string, lyrics: string) => {
  return `
Original Song Title: "${title}"
Original Lyrics:
${lyrics}

Please generate an in-depth, rigorous lyrical analysis of this song. Your analysis must identify and explain:
1. **Double Entendres**: Lines or phrases with two distinct simultaneous meanings.
2. **Triple Entendres**: Advanced wordplay that contains three overlapping layers of interpretation.
3. **Quadruple Entendres**: Highly intricate elements possessing four simultaneous conceptual tracks.
4. **Multi-layered Entendres (Five levels or more)**: Exceptional phrases, lyrical themes, or structural metaphors containing five or more concurrent meanings, puns, subtexts, or narrative associations.

For each, break down:
- The exact line/phrase.
- The Primary literal/surface level meaning.
- The Secondary sensual, romantic, or Sapphic subtext.
- The Tertiary, Quaternary, and higher-order tracks (such as botanical/nature metaphors, mechanical gears, instrument resonance, local cultural themes, or band relationships).
- A dense semantic branching map showing just how many different interpretations can coexist in these chosen parts.
`;
};

export const GENERATE_TECHNICAL_PROMPT = (title: string, lyrics: string, style: string, settings: any = {}) => {
  return `
Original Song Title: "${title}"
Styles & Instruments: "${style}"
Original Lyrics:
${lyrics}
Settings context: ${JSON.stringify(settings)}

Please generate a detailed technical musical breakdown of the track. Address the BPM, musical key, time signatures, specific chord progressions (e.g., vi–IV–I–V, Dorian modulations, or phrygian themes), vocal arrangements (Soprano, Alto, Mezzo-Soprano, Contralto dynamics), specific synthesizer settings (like Juno-106 chorus), percussion layouts, and ancient instrument techniques.
`;
};

export const GENERATE_INTERVIEW_REVIEW_PROMPT = (title: string, lyrics: string, story: string, imageDescription?: string) => {
  const imageInspStr = imageDescription ? `\n\n**IMAGE INSPIRATION & KEY ORIGINAL CONTEXT (CRITICAL):**\nThis song is directly based on a visual image with the following detailed description:\n"${imageDescription}"\nIn the interview and track review, the singers (Miranda, Annelies, Fannie, or Emma) or Senna Bakker MUST discuss this visual image description as the core creative inspiration or spark for the song's themes/lyrics or musical/poetic atmosphere.` : '';
  return `
Original Song Title: "${title}"
Original Lyrics:
${lyrics}
Background story: "${story || ''}"${imageInspStr}

Please generate an exclusive behind-the-scenes interview by Senna Bakker (editor of the "Dutch Noise Chronicles" newspaper) with the four band members of Noor (Miranda, Annelies, Fannie, Emma). 

**LOCATION & ENVIRONMENT (THE BARN STUDIO IN ABCOUDE):**
The interview is held inside the singers' state-of-the-art sound studio, which is a beautifully converted barn in Abcoude where the four singers actually live. Senna Bakker is just visiting them!
- The studio building is structurally sturdy and sits right next to the stables (which are well-insulated against sound but houses their friendly goats and sheep that you can meet).
- The studio interior is designed with a sleek, warm-white, and very modern aesthetic (avoiding cold metal in favor of warm whites and ambient, inviting lighting).
- The interview room itself features two plush couches, some cozy poofs, and two low coffee tables with fresh copies of Senna's newspaper, "Dutch Noise Chronicles."
- The group is served both coffee and tea with rich Moka meringue pastries on the side.
- The walls are decorated with vibrant tour posters and more personal holiday photos of the four singers (which are a bit revealing).

Discuss the background story, lyric writing, vocal synchronization, and musical design/performance of "${title}" while weaving in the specific, comfy, and stylish atmosphere of the Abcoude barn studio.
Follow this with a highly honest, critical, but supportive journalist's track review by Senna. Provide a rating from 1 to 10 (1 = worthless, 10 = perfect), with detailed justification of the score.
`;
};

export const GENERATE_ANALYSIS_PROMPT = (title: string, fileName: string, fileSize: number, style: string) => {
  return `
Original Song Title: "${title}"
MP3 File Name: "${fileName}"
File Size: ${(fileSize / (1024 * 1024)).toFixed(2)} MB
Original Style: "${style}"

Please generate a thorough audio file analysis of this MP3, simulating the inspection of ID3v2/ID3v1 tags (Artist: "Noor", Title: "${title}", Album: "Abcoude Sessions", Year: "2026", Track numbers, encoded by LAME), audio codec parameters (MPEG-1 Layer 3, Constant Bitrate 320 kbps, 44100 Hz, Joint Stereo), and detail the mix/mastering characteristics of the synthesizers, drums, alternative instruments (e.g. Crwth/bagpipes), and the separation and balance of the four female voices.
`;
};

export const GENERATE_STORY_BEHIND_SONG_PROMPT = (title: string, lyrics: string, imageDescription?: string) => {
  const imageInspStr = imageDescription ? `\n\n**IMAGE INSPIRATION & KEY ORIGINAL CONTEXT (CRITICAL):**\nThis song is directly based on a visual image with the following detailed description:\n"${imageDescription}"\nYou MUST explicitly highlight this visual description as the core inspiration for the song's meaning, writing process, and behind-the-scenes narrative.` : '';
  return `
Original Song Title: "${title}"
Original Lyrics:
${lyrics}${imageInspStr}

Please generate a detailed, engaging biography and behind-the-scenes feature story explaining the meaning, writing process, and inspiration of "${title}".
Your response MUST highlight:
1. **The Origin & Meaning**: What the song is about and what emotional/thematic message it expresses.
2. **Lyric Interpretation**: What the singers mean with this song.
3. **Singer-by-Singer Input**: Detailed personal input and quotes on the song from each singer (Miranda Noor, Annelies Brink, Fannie de Jong, and Emma Vermeer).

Format the output beautifully in Markdown containing clean headers, subheaders, lists, and tables. Return the response as a JSON matching this structure:
{
  "markdown": "..."
}
`;
};

export const GENERATE_COMPARE_PROMPT = (
  title: string,
  lyrics: string,
  style: string,
  leadFile: { name: string; size: number },
  compareFile: { name: string; size: number }
) => {
  return `
Comparing versions for Song: "${title}"
Song Style: "${style}"

We have two MP3 files or audio recordings for this song:
1. **Lead File (Primary / First Version)**:
   - Filename: "${leadFile.name}"
   - Filesize: ${(leadFile.size / (1024 * 1024)).toFixed(2)} MB

2. **Candidate File (Secondary / New Version)**:
   - Filename: "${compareFile.name}"
   - Filesize: ${(compareFile.size / (1024 * 1024)).toFixed(2)} MB

Original Lyrics:
${lyrics}

Please generate an expert sound engineering product comparison matrix and detailed markdown analysis document to compare the newly uploaded MP3 file with the lead file.
Highlight:
- The technical specs and visual EQ profile differences.
- Structural vocal differences: how the separation of Soprano, Mezzo-Soprano, Alto, and Contralto feels of each singer (Miranda, Annelies, Fannie, Emma).
- Differences in synthesizer warmth, dynamic range gating, vocal clarity, and instrumental balance.
- Clear conclusion detailing which track performs better as the final master.

Format the output beautifully in Markdown containing clean headers, subheaders, lists, and tables. Return the response as a JSON matching this structure:
{
  "markdown": "..."
}
`;
};

