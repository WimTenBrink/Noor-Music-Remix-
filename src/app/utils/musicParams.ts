export interface TimeSignatureOption {
  fraction: string;
  name: string;
  description: string;
}

export const MUSICAL_KEYS: string[] = [
  "C Major", "C Minor",
  "C# / Db Major", "C# / Db Minor",
  "D Major", "D Minor",
  "D# / Eb Major", "D# / Eb Minor",
  "E Major", "E Minor",
  "F Major", "F Minor",
  "F# / Gb Major", "F# / Gb Minor",
  "G Major", "G Minor",
  "G# / Ab Major", "G# / Ab Minor",
  "A Major", "A Minor",
  "A# / Bb Major", "A# / Bb Minor",
  "B Major", "B Minor"
];

export const TIME_SIGNATURES: TimeSignatureOption[] = [
  { fraction: "4/4", name: "Common Time", description: "Standard modern pop, rock, and electronic rhythmic structures." },
  { fraction: "3/4", name: "Waltz Time", description: "Swaying classical three-beat feel, emotional acoustic ballads." },
  { fraction: "2/4", name: "Duple March", description: "High-energy polka, militaristic marches, and upbeat fast folk." },
  { fraction: "6/8", name: "Compound Duple", description: "Swaying organic folk, classic compound blues ballads, and shuffles." },
  { fraction: "5/4", name: "Asymmetric Pentameter", description: "Unusual progressive jazz feel, dramatic suspense scores, and complex grooves." },
  { fraction: "7/8", name: "Complex Septuple", description: "Complex progressive riffs, heavy math rock, and syncopated Balkan rhythms." },
  { fraction: "9/8", name: "Compound Triple", description: "Dynamic slip tempos, traditional slip-jigs, and compound folk spacing." },
  { fraction: "12/8", name: "Compound Quadruple", description: "Epic slow-rock power ballads, deep heartfelt rhythm & blues, and stadium anthems." },
  { fraction: "11/8", name: "Abstract Odd Time", description: "Extremely asymmetric, highly innovative progressive rhythm and avant-garde flow." }
];

export function getTempoName(bpm: number): string {
  if (bpm < 60) return "Larghissimo / Grave (Very slow / Somber)";
  if (bpm < 76) return "Lento / Adagio (Slow / Pensive)";
  if (bpm < 108) return "Andante / Moderato (Medium / Relaxed walkthrough)";
  if (bpm < 156) return "Allegro / Vivace (Fast / Energetic dance)";
  if (bpm < 200) return "Presto (Very fast / High energy)";
  if (bpm < 300) return "Prestissimo / High Octane (Hyperactive blast)";
  return "Hyperspeed / Speedcore (Absolute sonic chaos!)";
}

export function findKeyByIndex(index: number): string {
  const cleanIndex = Math.max(0, Math.min(MUSICAL_KEYS.length - 1, index));
  return MUSICAL_KEYS[cleanIndex];
}

export function findKeyIndexByName(name: string): number {
  const index = MUSICAL_KEYS.indexOf(name);
  return index === -1 ? 0 : index;
}

export function findTimeSignatureByFraction(fraction: string): TimeSignatureOption {
  const found = TIME_SIGNATURES.find(t => t.fraction === fraction);
  return found || TIME_SIGNATURES[0];
}
