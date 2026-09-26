export const COMPANY_PACKS_DATA = [
  {
    id: 'amazon',
    name: 'Amazon',
    logo: '📦',
    tier: 'Tier 1 Product',
    color: '#ff9900',
    description: 'Master Amazon’s 16 Leadership Principles, Bar Raiser round expectations, and high-frequency LeetCode Medium/Hard challenges.',
    rounds: [
      { name: 'Round 1: Online Assessment (OA)', details: '2 DSA coding questions (90 min) + Work Simulation & Leadership Principle survey.' },
      { name: 'Round 2 & 3: Technical DSA & LLD', details: 'Trees, Graphs, Dynamic Programming, and Object-Oriented Design (e.g. Design a Parking Lot / Locker System).' },
      { name: 'Round 4: Bar Raiser & Behavioral', details: 'Deep dive into LP scenarios using STAR method (Customer Obsession, Ownership, Bias for Action).' }
    ],
    leadershipPrinciples: [
      { lp: 'Customer Obsession', question: 'Tell me about a time you had to make a tough trade-off between speed and customer experience.' },
      { lp: 'Ownership', question: 'Describe a situation where you took on work outside your formal responsibilities to fix a critical issue.' },
      { lp: 'Bias for Action', question: 'Give an example of a calculated risk you took where speed was more critical than having complete data.' },
      { lp: 'Deliver Results', question: 'How did you handle a project with tight deadlines when an unexpected roadblock occurred?' }
    ],
    highFrequencyTopics: ['Binary Trees & BFS/DFS', 'LRU Cache & Hash Maps', 'Two Pointers & Sliding Window', 'Object Oriented Design (LLD)']
  },
  {
    id: 'google',
    name: 'Google',
    logo: '🔍',
    tier: 'Tier 1 Product',
    color: '#4285f4',
    description: 'Heavy emphasis on algorithmic efficiency, clean modular code, edge case validation, and scalable problem solving.',
    rounds: [
      { name: 'Round 1: Technical Phone Screen (45 min)', details: '1-2 DSA algorithmic problems in Google Docs / CoderPad with zero auto-complete.' },
      { name: 'Round 2-4: Onsite / Virtual Onsite Coding', details: 'Graphs (Dijkstra/Topological Sort), DP, Advanced Trees, and String Algorithms.' },
      { name: 'Round 5: Googleyness & Leadership', details: 'Cultural fit, intellectual humility, handling ambiguity, and collaborative teamwork.' }
    ],
    leadershipPrinciples: [
      { lp: 'Handling Ambiguity', question: 'Describe a project where the problem requirements were vague. How did you define scope?' },
      { lp: 'Constructive Disagreement', question: 'Tell me about a time you disagreed with a senior engineer or teammate on technical direction.' }
    ],
    highFrequencyTopics: ['Graph Traversals & Shortest Path', 'Dynamic Programming on Grids & Trees', 'Trie & Prefix Trees', 'Concurrency & Big-O Scaling']
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    logo: '🪟',
    tier: 'Tier 1 Product',
    color: '#00a4ef',
    description: 'Focus on balanced DSA fundamentals, memory management, OS concepts, and clean production code quality.',
    rounds: [
      { name: 'Round 1: Online Codility Test', details: '3 algorithmic problems focusing on arrays, strings, and hash maps.' },
      { name: 'Round 2 & 3: Technical Problem Solving', details: 'Linked Lists, Binary Trees, Recursion, and System Internals.' },
      { name: 'Round 4: Hiring Manager & Project Review', details: 'Deep dive into past projects, architecture decisions, and cultural alignment.' }
    ],
    leadershipPrinciples: [
      { lp: 'Growth Mindset', question: 'Tell me about a technical skill or framework you taught yourself from scratch in under two weeks.' },
      { lp: 'Customer Focus & Empathy', question: 'Describe how you incorporated direct user feedback to improve an application feature.' }
    ],
    highFrequencyTopics: ['Linked List Reversal & Fast/Slow Pointers', 'Binary Search Variants', 'Recursion & Backtracking', 'OS Process Synchronization']
  },
  {
    id: 'service_tier',
    name: 'TCS / Infosys / Accenture (Service Giants)',
    logo: '🏢',
    tier: 'Mass Hiring / IT Services',
    color: '#10b981',
    description: 'Comprehensive preparation for National Qualifier Tests (NQT), quantitative aptitude, pseudo-code debugging, and verbal reasoning.',
    rounds: [
      { name: 'Round 1: Cognitive Aptitude Assessment', details: 'Numerical Ability (Math/Logic), Verbal English, and Reasoning Ability.' },
      { name: 'Round 2: Technical Knowledge & Pseudo-code', details: 'C/C++/Java/Python syntax, time complexity MCQ, and basic coding (2 problems).' },
      { name: 'Round 3: Technical & HR Mixed Interview', details: 'Basic OOPs (4 pillars), DBMS SQL queries, final year project explanation, and flexibility.' }
    ],
    leadershipPrinciples: [
      { lp: 'Adaptability & Shift Flexibility', question: 'Are you open to working across different technology stacks and geographic locations?' },
      { lp: 'Team Collaboration', question: 'Tell me about your contribution in your college final year capstone project.' }
    ],
    highFrequencyTopics: ['Percentages, Profit & Loss, Time & Work', 'String Palindromes & Matrix Manipulations', 'OOPs 4 Pillars (Polymorphism, Inheritance, etc.)', 'Basic SQL Joins & Aggregate Functions']
  }
];
