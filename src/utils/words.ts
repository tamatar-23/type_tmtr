
// Common English words for typing tests
export const EASY_WORDS = [
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
  'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
  'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
  'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
  'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
  'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
  'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
  'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
  'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way',
  'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us',
  'is', 'water', 'long', 'very', 'after', 'called', 'just', 'where', 'most', 'know',
  'get', 'through', 'back', 'much', 'before', 'go', 'good', 'new', 'write', 'our',
  'used', 'me', 'man', 'too', 'any', 'day', 'same', 'right', 'look', 'think',
  'also', 'around', 'another', 'came', 'come', 'work', 'three', 'word', 'must', 'because',
  'does', 'part', 'even', 'place', 'well', 'such', 'here', 'take', 'why', 'things',
  'help', 'put', 'years', 'different', 'away', 'again', 'off', 'went', 'old', 'number',
  'great', 'tell', 'men', 'say', 'small', 'every', 'found', 'still', 'between', 'mane',
  'should', 'home', 'big', 'give', 'air', 'line', 'set', 'own', 'under', 'read',
  'last', 'never', 'us', 'left', 'end', 'along', 'while', 'might', 'next', 'sound',
  'below', 'saw', 'something', 'thought', 'both', 'few', 'those', 'always', 'show', 'large'
];

export const HARD_WORDS = [
  'accommodate', 'embarrass', 'millennium', 'occurrence', 'separate', 'necessary', 'definitely', 'calendar',
  'pneumonia', 'rhythm', 'conscientious', 'deteriorate', 'fluorescent', 'gauge', 'hemorrhage', 'inoculate',
  'judgment', 'knowledge', 'liaison', 'maintenance', 'noticeable', 'optimize', 'privilege', 'questionnaire',
  'reconnaissance', 'supersede', 'threshold', 'unparalleled', 'vacuum', 'withhold', 'yacht', 'zealous',
  'accommodate', 'acknowledgment', 'acquire', 'across', 'address', 'amateur', 'apparent', 'argument',
  'atheist', 'beginning', 'believe', 'bizarre', 'business', 'calendar', 'cemetery', 'changeable',
  'collectible', 'column', 'committed', 'conscience', 'conscientious', 'conscious', 'correspondence', 'definitely',
  'discipline', 'drunkenness', 'embarrass', 'equipment', 'exhilarate', 'existence', 'experience', 'fiery',
  'foreign', 'gauge', 'grateful', 'guarantee', 'harass', 'height', 'hierarchy', 'humorous',
  'ignorance', 'immediate', 'independent', 'indispensable', 'intelligence', 'jewelry', 'judgment', 'knowledge',
  'league', 'leisure', 'liaison', 'library', 'license', 'maintenance', 'maneuver', 'medieval',
  'memento', 'millennium', 'miniature', 'mischievous', 'misspell', 'mortgage', 'necessary', 'neighbor',
  'noticeable', 'occasionally', 'occurrence', 'pamphlet', 'pastime', 'perseverance', 'personnel', 'playwright',
  'possession', 'potato', 'privilege', 'pronunciation', 'publicly', 'questionnaire', 'raspberry', 'receipt',
  'receive', 'recommend', 'referred', 'relevant', 'restaurant', 'rhyme', 'rhythm', 'schedule'
];

export function generateText(wordCount: number, difficulty: 'easy' | 'hard'): string {
  const words = difficulty === 'easy' ? EASY_WORDS : HARD_WORDS;
  const result: string[] = [];
  
  for (let i = 0; i < wordCount; i++) {
    const randomIndex = Math.floor(Math.random() * words.length);
    result.push(words[randomIndex]);
  }
  
  return result.join(' ');
}
