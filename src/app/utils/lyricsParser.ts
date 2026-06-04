export interface VerseSection {
  id: string;
  title: string;
  key?: string;
  tempo?: string;
  melodicPeak?: string;
  consonantTiming?: string;
  singer?: string;
  lines: string[];
}

/**
 * Parses the song lyrics into structured sections (verses, chorus, bridge, etc.)
 * with nested music performance instructions extracted for the left sidebar display,
 * while removing internal brackets from the clean lyrics text.
 */
export function parseLyrics(lyrics: string): VerseSection[] {
  if (!lyrics) return [];

  const sections: VerseSection[] = [];
  const lines = lyrics.split('\n');
  
  let currentSection: VerseSection = {
    id: 'section-intro',
    title: 'Intro',
    lines: []
  };
  
  let sectionCounter = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Check if the entire line consists of a bracketed instruction
    const isBracketed = trimmed.startsWith('[') && trimmed.endsWith(']');
    
    if (isBracketed) {
      const inner = trimmed.slice(1, -1).trim();
      
      // Determine if it is a section header (contains structural names like verse, chorus, or key/tempo details)
      const isSectionHeader = /verse|chorus|bridge|outro|intro|solo|key:|tempo:/i.test(inner);
      
      if (isSectionHeader) {
        // Save previous section if it contains lines or holds a non-intro title
        if (currentSection.lines.length > 0 || currentSection.title !== 'Intro') {
          sections.push(currentSection);
        }

        // Match metadata from the section header tag
        const keyMatch = inner.match(/Key\s*:\s*([^,\]\-|]+)/i);
        const tempoMatch = inner.match(/Tempo\s*:\s*([^,\]\-|]+)/i);
        const peakMatch = inner.match(/Melodic\s*Peak\s*:\s*([^,\]\-|]+)/i);
        const timingMatch = inner.match(/Consonant\s*Timing\s*:\s*([^,\]\-|]+)/i);

        // Deduce a clean section title (e.g. "Verse 1", "Chorus 2")
        const titleMatch = inner.match(/^(Verse\s*\d+|Chorus\s*\d+|Bridge|Outro|Intro|Solo|Verse|Chorus)/i);
        let sectionTitle = titleMatch ? titleMatch[1] : 'Section';

        if (sectionTitle === 'Section' && (keyMatch || tempoMatch)) {
          sectionTitle = `Verse ${sectionCounter + 1}`;
        }

        sectionCounter++;
        currentSection = {
          id: `section-${sectionCounter}`,
          title: sectionTitle,
          key: keyMatch ? keyMatch[1].trim() : undefined,
          tempo: tempoMatch ? tempoMatch[1].trim() : undefined,
          melodicPeak: peakMatch ? peakMatch[1].trim() : undefined,
          consonantTiming: timingMatch ? timingMatch[1].trim() : undefined,
          lines: []
        };
      } else {
        // This is a bracketed tag but is not a section header (e.g., singer details: `[Miranda - Soprano]`)
        const singerNameMatch = inner.match(/^(Miranda|Annelies|Fannie|Emma|All|Quartet|Group)/i);
        if (singerNameMatch) {
          currentSection.singer = inner;
        } else if (!currentSection.singer) {
          currentSection.singer = inner;
        }
      }
    } else {
      // It's a normal lyric line, remove any random inline brackets if they exist
      const cleanLine = trimmed.replace(/\[.*?\]/g, '').trim();
      if (cleanLine) {
        currentSection.lines.push(cleanLine);
      }
    }
  }

  // Push the final section if it contains any lyrics
  if (currentSection.lines.length > 0 || currentSection.title !== 'Intro') {
    sections.push(currentSection);
  }

  return sections;
}

/**
 * Gets clean lyrics with at most one blank line between sections/verses.
 */
export function getCleanFormattedLyrics(lyrics: string): string {
  const sections = parseLyrics(lyrics);
  return sections
    .map(sec => sec.lines.join('\n'))
    .filter(text => text.trim().length > 0)
    .join('\n\n');
}

/**
 * Reverses the words in the lyrics while keeping bracketed tags completely untouched.
 * Keeps capitalization structures at their original indices (e.g. "Hello" -> "Olleh").
 */
export function reverseLyrics(lyrics: string): string {
  if (!lyrics) return '';
  return lyrics.split('\n').map(line => {
    const trimmed = line.trim();
    // Keep section tags/singer bracket tags completely untouched
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      return line;
    }
    
    // Process text line segments to skip reversing bracket contents
    let output = '';
    let i = 0;
    while (i < line.length) {
      if (line[i] === '[') {
        const j = line.indexOf(']', i);
        if (j !== -1) {
          output += line.substring(i, j + 1);
          i = j + 1;
        } else {
          output += line[i];
          i++;
        }
      } else {
        let nextBracket = line.indexOf('[', i);
        if (nextBracket === -1) nextBracket = line.length;
        const textSlice = line.substring(i, nextBracket);
        
        // Reverse each word in textSlice (matching any Unicode letters)
        const reversedSlice = textSlice.replace(/[\p{L}\p{N}]+/gu, (word) => {
          if (!word) return word;
          const casing = Array.from(word).map(char => char === char.toUpperCase() && char !== char.toLowerCase());
          const lowerReversed = Array.from(word).reverse().map(c => c.toLowerCase());
          return lowerReversed.map((char, index) => casing[index] ? char.toUpperCase() : char).join('');
        });
        output += reversedSlice;
        i = nextBracket;
      }
    }
    return output;
  }).join('\n');
}

