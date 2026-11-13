import { Quote } from '../types';

export const MOTIVATIONAL_QUOTES: Quote[] = [
  {
    id: 1,
    text: "We are what we repeatedly do. Excellence, then, is not an act, but a habit.",
    author: "Will Durant (on Aristotle)",
    category: "Habits"
  },
  {
    id: 2,
    text: "Small disciplines repeated with consistency every day lead to great achievements gained slowly over time.",
    author: "John C. Maxwell",
    category: "Consistency"
  },
  {
    id: 3,
    text: "You don't have to be extreme, just consistent.",
    author: "James Clear",
    category: "Consistency"
  },
  {
    id: 4,
    text: "Focus on the process, not the outcome. The results will take care of themselves.",
    author: "Anonymous",
    category: "Mindset"
  },
  {
    id: 5,
    text: "The secret of getting ahead is getting started. Break your complex tasks into small manageable tasks.",
    author: "Mark Twain",
    category: "Action"
  },
  {
    id: 6,
    text: "Discipline is choosing between what you want now and what you want most.",
    author: "Abraham Lincoln",
    category: "Discipline"
  },
  {
    id: 7,
    text: "Success is the sum of small efforts, repeated day in and day out.",
    author: "Robert Collier",
    category: "Growth"
  },
  {
    id: 8,
    text: "It does not matter how slowly you go as long as you do not stop.",
    author: "Confucius",
    category: "Perseverance"
  },
  {
    id: 9,
    text: "Your future is created by what you do today, not tomorrow.",
    author: "Robert Kiyosaki",
    category: "Action"
  },
  {
    id: 10,
    text: "Continuous improvement is better than delayed perfection.",
    author: "Mark Twain",
    category: "Progress"
  },
  {
    id: 11,
    text: "Action is the foundational key to all success.",
    author: "Pablo Picasso",
    category: "Action"
  },
  {
    id: 12,
    text: "One day or day one. You decide.",
    author: "Paulo Coelho",
    category: "Motivation"
  },
  {
    id: 13,
    text: "The hard days are what make you stronger. Keep pushing.",
    author: "Aly Raisman",
    category: "Strength"
  },
  {
    id: 14,
    text: "Consistency is what transforms average into excellence.",
    author: "Tony Dungy",
    category: "Consistency"
  }
];

export function getQuoteForDate(dateStr: string): Quote {
  // Use a hash of the date string to select a deterministic quote for the day
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % MOTIVATIONAL_QUOTES.length;
  return MOTIVATIONAL_QUOTES[index];
}

