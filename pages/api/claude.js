import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { action, data } = req.body;
  const apiKey = process.env.GOOGLE_API_KEY;

  try {
    switch (action) {
      case 'assess':
        return await handleAssess(data, apiKey, res);
      case 'generateProblem':
        return await handleGenerateProblem(data, apiKey, res);
      case 'evaluateSolution':
        return await handleEvaluateSolution(data, apiKey, res);
      case 'startInterview':
        return await handleStartInterview(data, apiKey, res);
      case 'interviewEvaluate':
        return await handleInterviewEvaluate(data, apiKey, res);
      case 'analyzeResume':
        return await handleAnalyzeResume(data, apiKey, res);
      default:
        return res.status(400).json({ error: 'Invalid action provided.' });
    }
  } catch (err) {
    console.error('API Handler Error:', err.message);
    return res.status(500).json({ error: 'Failed to process AI request', details: err.message });
  }
}

/**
 * Call Google Gemini 1.5 Flash API
 */
async function callGemini(promptText, apiKey, systemInstruction = '') {
  if (!apiKey || apiKey.trim() === '' || apiKey.includes('sk-proj-xxxxx')) {
    throw new Error('MISSING_API_KEY');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const fullPrompt = `${systemInstruction ? systemInstruction + '\n\n' : ''}${promptText}\n\nIMPORTANT: Return strictly valid JSON only. Do not include markdown code block backticks (\`\`\`json or \`\`\`), no extra text outside the JSON object.`;

  const payload = {
    contents: [
      {
        parts: [{ text: fullPrompt }]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      responseMimeType: "application/json"
    }
  };

  const response = await axios.post(url, payload, {
    headers: { 'Content-Type': 'application/json' },
    timeout: 30000
  });

  const textOutput = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textOutput) {
    throw new Error('Empty response from Gemini API');
  }

  try {
    const cleanedText = textOutput.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (parseErr) {
    console.error('Failed to parse Gemini response as JSON:', textOutput);
    throw new Error('Invalid JSON format returned from AI model');
  }
}

// ----------------------------------------------------
// Action Handlers
// ----------------------------------------------------

async function handleAssess(data, apiKey, res) {
  const { answers } = data || {};

  const prompt = `
  Analyze the following placement assessment answers for a software engineering student.
  Candidate Assessment Inputs:
  - Data Structures & Algorithms (DSA): ${answers?.dsa || 'Intermediate'}
  - Database Management Systems (DBMS): ${answers?.dbms || 'Basic'}
  - Operating Systems (OS): ${answers?.os || 'Beginner'}
  - SQL & Database Queries: ${answers?.sql || 'Intermediate'}
  - Aptitude & Logical Reasoning: ${answers?.aptitude || 'Advanced'}
  - Communication & Soft Skills: ${answers?.communication || 'Intermediate'}
  - Self-described background / notes: ${answers?.notes || 'Preparing for upcoming campus placements.'}

  Return a structured JSON object with the following schema:
  {
    "overallScore": number (1-10 with 1 decimal e.g. 6.5),
    "verdict": "Needs Intensive Prep" | "On Track - Medium Effort" | "Placement Ready - Advanced Polish",
    "scores": {
      "dsa": number (1-10),
      "dbms": number (1-10),
      "os": number (1-10),
      "sql": number (1-10),
      "aptitude": number (1-10),
      "communication": number (1-10)
    },
    "strongAreas": [
      { "topic": string, "level": string, "reason": string }
    ],
    "weakAreas": [
      { "topic": string, "priority": "High" | "Medium" | "Low", "description": string, "actionPlan": string }
    ],
    "summary": string (3-4 sentences of personalized feedback),
    "roadmap": [
      (Provide 30 items for a 30-day study plan)
      {
        "day": number (1 to 30),
        "topic": string, "description": string, "timeEstimate": string (e.g. "2.5 Hours"),
        "category": "DSA" | "DBMS" | "OS" | "SQL" | "Aptitude" | "Communication",
        "resources": [ array of string resource titles/topics to cover ]
      }
    ]
  }
  `;

  try {
    const result = await callGemini(prompt, apiKey, "You are an expert technical interviewer and placement advisor.");
    return res.status(200).json({ success: true, result });
  } catch (err) {
    console.warn('Using intelligent fallback for assess API:', err.message);
    const fallback = generateFallbackAssess(answers);
    return res.status(200).json({ success: true, result: fallback, isFallback: true });
  }
}

async function handleGenerateProblem(data, apiKey, res) {
  const { topic = 'Arrays', difficulty = 'Medium' } = data || {};

  const prompt = `
  Generate a unique, high-quality coding interview problem for placement preparation.
  Topic: ${topic}
  Difficulty: ${difficulty}

  Return JSON schema:
  {
    "id": string (unique ID e.g. "prob_${Date.now()}"),
    "title": string,
    "topic": "${topic}",
    "difficulty": "${difficulty}",
    "description": string (detailed problem description with story or context),
    "inputFormat": string,
    "outputFormat": string,
    "constraints": [ array of constraint strings e.g. "1 <= N <= 10^5" ],
    "examples": [
      { "input": string, "output": string, "explanation": string }
    ],
    "starterCode": {
      "javascript": string,
      "python": string,
      "cpp": string,
      "java": string
    },
    "hints": [ array of 2-3 helpful hints ]
  }
  `;

  try {
    const result = await callGemini(prompt, apiKey, "You are a senior LeetCode problem designer.");
    return res.status(200).json({ success: true, result });
  } catch (err) {
    console.warn('Using fallback for generateProblem API:', err.message);
    const fallback = generateFallbackProblem(topic, difficulty);
    return res.status(200).json({ success: true, result: fallback, isFallback: true });
  }
}

async function handleEvaluateSolution(data, apiKey, res) {
  const { problem, solution, language = 'javascript' } = data || {};

  const prompt = `
  Evaluate the following candidate code solution for a placement coding problem.
  Problem Title: ${problem?.title || 'Coding Problem'}
  Problem Description: ${problem?.description || ''}
  Language: ${language}
  User Code:
  \`\`\`
  ${solution}
  \`\`\`

  Return JSON schema:
  {
    "status": "Passed" | "Needs Improvement" | "Failed",
    "score": number (0-100),
    "detailedBreakdown": {
      "codeQuality": number (0-100),
      "security": number (0-100),
      "efficiency": number (0-100),
      "testing": number (0-100),
      "accessibility": number (0-100),
      "problemAlignment": number (0-100)
    },
    "timeComplexity": string (e.g. "O(N log N)"),
    "spaceComplexity": string (e.g. "O(N)"),
    "keyStrengths": [ array of strengths ],
    "areasToImprove": [ array of improvement points ],
    "feedback": string (detailed breakdown of correctness, edge cases, and style),
    "optimizedSolution": string (complete, clean, exemplary solution code in ${language} with helpful comments)
  }
  `;

  try {
    const result = await callGemini(prompt, apiKey, "You are an automated code grader and senior tech lead.");
    return res.status(200).json({ success: true, result });
  } catch (err) {
    console.warn('Using fallback for evaluateSolution API:', err.message);
    const fallback = generateFallbackSolutionEvaluation(problem, solution, language);
    return res.status(200).json({ success: true, result: fallback, isFallback: true });
  }
}

async function handleStartInterview(data, apiKey, res) {
  const { mode = 'Technical' } = data || {};

  const prompt = `
  Generate a placement mock interview session for Mode: "${mode}".
  Generate 4 questions that test key requirements for entry-level to mid-level engineering placements.

  Return JSON schema:
  {
    "sessionId": string (e.g. "sess_${Date.now()}"),
    "mode": "${mode}",
    "welcomeMessage": string (warm professional greeting setting the interview tone),
    "questions": [
      (Provide exactly 4 structured questions)
      {
        "id": number (1 to 4),
        "question": string,
        "category": string,
        "guidance": string (what interviewer is looking for in a top candidate response)
      }
    ]
  }
  `;

  try {
    const result = await callGemini(prompt, apiKey, "You are an expert technical and HR interviewer at a top tech company.");
    return res.status(200).json({ success: true, result });
  } catch (err) {
    console.warn('Using fallback for startInterview API:', err.message);
    const fallback = generateFallbackStartInterview(mode);
    return res.status(200).json({ success: true, result: fallback, isFallback: true });
  }
}

async function handleInterviewEvaluate(data, apiKey, res) {
  const { mode, currentQuestionIndex, question, answer, history = [] } = data || {};

  const prompt = `
  Evaluate candidate response in a placement mock interview.
  Interview Mode: ${mode}
  Question ${currentQuestionIndex + 1} of 4: "${question}"
  Candidate Response: "${answer}"

  Previous History: ${JSON.stringify(history)}

  Return JSON schema:
  {
    "answerScore": number (1-10),
    "feedback": string (constructive feedback on tone, structure e.g. STAR method, technical accuracy),
    "keyStrengths": [ array of points candidate handled well ],
    "missingPoints": [ array of key concepts candidate missed ],
    "modelAnswer": string (exemplary response candidate could have given),
    "isComplete": boolean (true if currentQuestionIndex is 3 i.e. 4th question),
    "finalReport": null or object if isComplete is true:
    {
      "overallScore": number (1-10),
      "performanceSummary": string (paragraph evaluating overall interview performance),
      "strengths": [ string ],
      "improvements": [ string ],
      "recommendations": [ string ]
    }
  }
  `;

  try {
    const result = await callGemini(prompt, apiKey, "You are a senior hiring manager conducting placement interviews.");
    return res.status(200).json({ success: true, result });
  } catch (err) {
    console.warn('Using fallback for interviewEvaluate API:', err.message);
    const fallback = generateFallbackInterviewEvaluate(mode, currentQuestionIndex, answer, history);
    return res.status(200).json({ success: true, result: fallback, isFallback: true });
  }
}

// ----------------------------------------------------
// Fallback Generator Functions (for seamless demo/offline mode)
// ----------------------------------------------------

function generateFallbackAssess(answers = {}) {
  const parseLevel = (val) => {
    if (val === 'Advanced' || val === 'Expert') return 8.5;
    if (val === 'Intermediate') return 6.5;
    return 4.0;
  };

  const scores = {
    dsa: parseLevel(answers.dsa),
    dbms: parseLevel(answers.dbms),
    os: parseLevel(answers.os),
    sql: parseLevel(answers.sql),
    aptitude: parseLevel(answers.aptitude),
    communication: parseLevel(answers.communication)
  };

  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  const overallScore = Math.round((total / 6) * 10) / 10;

  let verdict = "On Track - Medium Effort";
  if (overallScore >= 7.5) verdict = "Placement Ready - Advanced Polish";
  if (overallScore < 5.5) verdict = "Needs Intensive Prep";

  const strongAreas = [];
  const weakAreas = [];

  const topicNames = {
    dsa: 'Data Structures & Algorithms',
    dbms: 'Database Management Systems',
    os: 'Operating Systems',
    sql: 'SQL & Database Queries',
    aptitude: 'Aptitude & Logic',
    communication: 'Communication & HR Skills'
  };

  Object.entries(scores).forEach(([key, val]) => {
    if (val >= 6.5) {
      strongAreas.push({
        topic: topicNames[key],
        level: val >= 8 ? 'High Proficiency' : 'Good Foundation',
        reason: `Demonstrated confident baseline in ${topicNames[key]} concepts.`
      });
    } else {
      weakAreas.push({
        topic: topicNames[key],
        priority: val <= 4 ? 'High' : 'Medium',
        description: `Core gaps identified in theoretical depth and problem-solving speed for ${topicNames[key]}.`,
        actionPlan: `Allocate dedicated 1-2 hours daily focusing on standard practice problems and fundamentals.`
      });
    }
  });

  if (weakAreas.length === 0) {
    weakAreas.push({
      topic: 'Advanced System Design',
      priority: 'Low',
      description: 'Focus on high-scale architecture & distributed systems to stand out for top tier product companies.',
      actionPlan: 'Read Designing Data-Intensive Applications and practice LLD/HLD mock cases.'
    });
  }

  // Generate 30 days roadmap
  const roadmap = [];
  const categories = ['DSA', 'DBMS', 'OS', 'SQL', 'Aptitude', 'Communication'];
  for (let i = 1; i <= 30; i++) {
    const cat = categories[(i - 1) % categories.length];
    roadmap.push({
      day: i,
      topic: `Day ${i}: ${cat} Masterclass - Module ${Math.ceil(i / 6)}`,
      category: cat,
      description: `Targeted practice and theory review for ${cat}. Focus on foundational concepts and top 20 interview questions.`,
      timeEstimate: `${2 + (i % 2 === 0 ? 0.5 : 1)} Hours`,
      resources: [
        `Standard Reference Notes for ${cat}`,
        `Top 10 Interview Problems in ${cat}`,
        `Interactive Practice Quiz`
      ]
    });
  }

  return {
    overallScore,
    verdict,
    scores,
    strongAreas,
    weakAreas,
    summary: `Your assessment reveals a solid foundation with an overall placement readiness score of ${overallScore}/10. Priority attention should be given to target weak areas like ${weakAreas.map(w => w.topic).join(', ')} while maintaining momentum in your strong domains.`,
    roadmap
  };
}

function generateFallbackProblem(topic, difficulty) {
  const problemsMap = {
    'Arrays': {
      title: 'Maximum Subarray Sum (Kadane\'s Algorithm)',
      description: 'Given an integer array nums, find the subarray with the largest sum, and return its sum. A subarray is a contiguous non-empty sequence of elements within an array.',
      inputFormat: 'Single line containing space-separated integers representing nums.',
      outputFormat: 'Single integer representing the maximum subarray sum.',
      constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
      examples: [
        { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'The subarray [4,-1,2,1] has the largest sum 6.' },
        { input: 'nums = [1]', output: '1', explanation: 'The subarray [1] has the largest sum 1.' }
      ],
      starterCode: {
        javascript: 'function maxSubArray(nums) {\n  // Write your code here\n  let maxSum = nums[0];\n  let currSum = 0;\n  for (let num of nums) {\n    currSum += num;\n    maxSum = Math.max(maxSum, currSum);\n    if (currSum < 0) currSum = 0;\n  }\n  return maxSum;\n}',
        python: 'def maxSubArray(nums):\n    # Write your code here\n    max_sum = nums[0]\n    curr_sum = 0\n    for num in nums:\n        curr_sum += num\n        max_sum = max(max_sum, curr_sum)\n        if curr_sum < 0:\n            curr_sum = 0\n    return max_sum',
        cpp: 'int maxSubArray(vector<int>& nums) {\n    int maxSum = nums[0], currSum = 0;\n    for(int n : nums) {\n        currSum += n;\n        maxSum = max(maxSum, currSum);\n        if(currSum < 0) currSum = 0;\n    }\n    return maxSum;\n}',
        java: 'public int maxSubArray(int[] nums) {\n    int maxSum = nums[0], currSum = 0;\n    for(int n : nums) {\n        currSum += n;\n        maxSum = Math.max(maxSum, currSum);\n        if(currSum < 0) currSum = 0;\n    }\n    return maxSum;\n}'
      },
      hints: [
        'Try keeping a running sum of elements as you iterate through the array.',
        'If the current running sum drops below 0, reset it to 0 as it will not contribute to future maximum sums.'
      ]
    },
    'Trees': {
      title: 'Invert Binary Tree',
      description: 'Given the root of a binary tree, invert the tree (left child becomes right child and vice versa), and return its root.',
      inputFormat: 'Array representation of binary tree root node.',
      outputFormat: 'Root node of inverted tree.',
      constraints: ['0 <= Tree Nodes <= 100', '-100 <= Node.val <= 100'],
      examples: [
        { input: 'root = [4,2,7,1,3,6,9]', output: '[4,7,2,9,6,3,1]', explanation: 'Every left child swapped with right child.' }
      ],
      starterCode: {
        javascript: 'function invertTree(root) {\n  if (!root) return null;\n  let temp = root.left;\n  root.left = invertTree(root.right);\n  root.right = invertTree(temp);\n  return root;\n}',
        python: 'def invertTree(root):\n    if not root: return None\n    root.left, root.right = invertTree(root.right), invertTree(root.left)\n    return root',
        cpp: 'TreeNode* invertTree(TreeNode* root) {\n    if(!root) return nullptr;\n    swap(root->left, root->right);\n    invertTree(root->left);\n    invertTree(root->right);\n    return root;\n}',
        java: 'public TreeNode invertTree(TreeNode root) {\n    if(root == null) return null;\n    TreeNode temp = root.left;\n    root.left = invertTree(root.right);\n    root.right = invertTree(temp);\n    return root;\n}'
      },
      hints: ['Recursive traversal (DFS) or iterative Queue (BFS) both work well.']
    }
  };

  const selected = problemsMap[topic] || problemsMap['Arrays'];
  return {
    id: `prob_${Date.now()}`,
    title: selected.title,
    topic,
    difficulty,
    description: selected.description,
    inputFormat: selected.inputFormat,
    outputFormat: selected.outputFormat,
    constraints: selected.constraints,
    examples: selected.examples,
    starterCode: selected.starterCode,
    hints: selected.hints
  };
}

function generateFallbackSolutionEvaluation(problem, solution, language) {
  const isLong = solution && solution.length > 30;
  const score = isLong ? 83.5 : 63.86;

  return {
    status: score >= 80 ? 'Passed' : 'Needs Improvement',
    score: score,
    detailedBreakdown: {
      codeQuality: isLong ? 88 : 80,
      security: isLong ? 72 : 55,
      efficiency: isLong ? 85 : 60,
      testing: isLong ? 40 : 0,
      accessibility: isLong ? 60 : 30,
      problemAlignment: isLong ? 92 : 83
    },
    timeComplexity: 'O(N)',
    spaceComplexity: 'O(1)',
    keyStrengths: [
      'Clean syntax and clear variable naming',
      'Correct edge case handling for empty or single element input'
    ],
    areasToImprove: [
      'Consider adding unit test assertion validation',
      'Improve accessibility and input sanitization / error boundaries'
    ],
    feedback: isLong
      ? 'Great job! Your solution handles the core logic efficiently with optimal time and space complexity.'
      : 'Your code structure is readable, but make sure to account for edge cases and boundary constraints.',
    optimizedSolution: `// Optimal ${language.toUpperCase()} Solution\n// Time Complexity: O(N), Space Complexity: O(1)\n${solution}`
  };
}

function generateFallbackStartInterview(mode) {
  const questionsMap = {
    Technical: [
      { id: 1, question: "Explain the difference between Process and Thread, and how OS handles context switching.", category: "Operating Systems", guidance: "Focus on PCB, shared memory vs independent memory space, and context switch overhead." },
      { id: 2, question: "How does HashMap work internally in Java/JS? How are hash collisions handled?", category: "DSA / Internals", guidance: "Mention hashing function, bucket array, chaining via LinkedList/Red-Black Tree." },
      { id: 3, question: "Explain Indexing in Relational Databases (B-Trees / B+ Trees) and when NOT to create an index.", category: "DBMS / SQL", guidance: "Explain lookup time reduction O(log N), B+ Tree leaf pointers, write overhead on INSERT/UPDATE." },
      { id: 4, question: "Design a Rate Limiter system for an API. What algorithm and cache store would you choose?", category: "System Design", guidance: "Discuss Token Bucket or Sliding Window Log with Redis." }
    ],
    HR: [
      { id: 1, question: "Tell me about yourself and why you want to join our engineering team.", category: "Introduction", guidance: "Use Present-Past-Future framework: recent degree/projects, past achievements, future alignment." },
      { id: 2, question: "Describe a situation where you had a conflict during a team project and how you resolved it.", category: "Conflict Resolution", guidance: "Use STAR method (Situation, Task, Action, Result) emphasizing empathy and objective decision making." },
      { id: 3, question: "Where do you see yourself in 3 to 5 years professionally?", category: "Career Goals", guidance: "Demonstrate ambition for technical leadership, continuous learning, and commitment." },
      { id: 4, question: "Why should we hire you over other candidates for this role?", category: "Value Proposition", guidance: "Highlight unique combination of problem solving, project experience, and adaptability." }
    ],
    Aptitude: [
      { id: 1, question: "A train 150m long is running at 54 km/hr. How much time will it take to cross a platform 250m long?", category: "Speed, Distance & Time", guidance: "Convert speed to m/s: 54 * (5/18) = 15 m/s. Total distance = 150 + 250 = 400m. Time = 400/15 = 26.67 sec." },
      { id: 2, question: "If 12 men or 18 women can do a work in 14 days, how many days will 8 men and 16 women take to finish the work?", category: "Time & Work", guidance: "Convert women to men ratio: 12 M = 18 W => 1 M = 1.5 W. Calculate total work units." },
      { id: 3, question: "What is the angle between the hour hand and minute hand of a clock at 3:30?", category: "Clock & Calendar", guidance: "Hour hand angle = 3*30 + 30*0.5 = 105 deg. Minute hand angle = 30*6 = 180 deg. Diff = 75 degrees." },
      { id: 4, question: "A container has 40 liters of milk. 4 liters are removed and replaced with water. This process is repeated once more. How much milk is left?", category: "Mixtures & Alligations", guidance: "Final milk = Initial * (1 - x/V)^n = 40 * (1 - 4/40)^2 = 40 * 0.81 = 32.4 liters." }
    ]
  };

  return {
    sessionId: `sess_${Date.now()}`,
    mode,
    welcomeMessage: `Welcome to your AI Mock Interview (${mode} round). I will ask you 4 key questions. Please take your time to give detailed responses.`,
    questions: questionsMap[mode] || questionsMap['Technical']
  };
}

function generateFallbackInterviewEvaluate(mode, currentQuestionIndex, answer, history) {
  const answerLength = answer ? answer.trim().length : 0;
  const score = answerLength > 100 ? 8.5 : answerLength > 30 ? 6.5 : 4.0;
  const isComplete = currentQuestionIndex >= 3;

  return {
    answerScore: score,
    feedback: answerLength > 80
      ? "Strong structured response with clear technical terminology and logical flow."
      : "Good attempt! To score higher, elaborate more on concrete examples and edge cases.",
    keyStrengths: [
      "Directly answered the core question prompt",
      "Maintained professional, articulate communication tone"
    ],
    missingPoints: [
      "Could include specific metric or project reference for extra impact",
      "Mentioning trade-offs would demonstrate deeper technical maturity"
    ],
    modelAnswer: "A top-tier answer addresses core theoretical concepts first, followed by real-world application examples, trade-off analysis, and concise conclusions.",
    isComplete,
    finalReport: isComplete ? {
      overallScore: 8.2,
      improvements: ["Elaborate on edge cases in technical questions", "Quantify metrics in situational answers"],
      recommendations: ["Practice timed coding challenges", "Review advanced system design patterns", "Mock interview twice weekly"]
    } : null
  };
}

async function handleAnalyzeResume(data, apiKey, res) {
  const { resumeText, targetRole = 'Software Development Engineer', targetCompany = 'Top Tech' } = data || {};

  const prompt = `
  You are an expert Technical Recruiter and ATS (Applicant Tracking System) reviewer for top tech companies.
  Analyze the following candidate resume for the target role: "${targetRole}" at "${targetCompany}".
  
  Candidate Resume Content:
  """
  ${resumeText}
  """

  Evaluate the resume and return a structured JSON response with the following schema:
  {
    "atsScore": number (0-100),
    "grade": "Strong Match" | "Moderate Match" | "Needs Revision",
    "summary": string (3-4 sentence evaluation of resume strength and alignment),
    "detectedKeywords": [ array of relevant technical keywords found in resume ],
    "missingKeywords": [ array of high-priority keywords/skills missing for ${targetRole} ],
    "bulletPointCritiques": [
      {
        "original": string (a weak or improvable bullet point from their resume),
        "issue": string (why it is weak e.g. lack of metrics, passive tone),
        "improved": string (rewritten bullet using Google XYZ formula: Accomplished [X] as measured by [Y] by doing [Z])
      }
    ],
    "formattingTips": [ array of 3-4 actionable tips for ATS layout and structure ],
    "hiringVerdict": string (honest assessment of callback likelihood and final recommendations)
  }
  `;

  try {
    const result = await callGemini(prompt, apiKey, "You are a senior tech recruiter and resume optimization expert.");
    return res.status(200).json({ success: true, result });
  } catch (err) {
    console.warn('Using fallback for analyzeResume API:', err.message);
    const fallback = generateFallbackResumeAnalysis(resumeText, targetRole, targetCompany);
    return res.status(200).json({ success: true, result: fallback, isFallback: true });
  }
}

function generateFallbackResumeAnalysis(resumeText = '', targetRole = 'Software Engineer', targetCompany = 'Top Tech') {
  const textLower = resumeText.toLowerCase();
  
  const keywordsPool = ['react', 'next.js', 'javascript', 'typescript', 'node.js', 'python', 'java', 'sql', 'dsa', 'aws', 'docker', 'git', 'rest api', 'mongodb', 'postgresql'];
  const detected = keywordsPool.filter(kw => textLower.includes(kw));
  const missing = keywordsPool.filter(kw => !textLower.includes(kw)).slice(0, 5);

  const atsScore = Math.min(92, Math.max(58, 60 + detected.length * 4));

  return {
    atsScore,
    grade: atsScore >= 80 ? "Strong Match" : atsScore >= 65 ? "Moderate Match" : "Needs Revision",
    summary: `Your resume demonstrates relevant foundational coursework and skills for the ${targetRole} position at ${targetCompany}. Incorporating quantifiable metrics and missing modern tooling will significantly boost your ATS keyword ranking and callback rate.`,
    detectedKeywords: detected.length > 0 ? detected : ['JavaScript', 'HTML/CSS', 'Git', 'Problem Solving'],
    missingKeywords: missing.length > 0 ? missing : ['Microservices Architecture', 'System Design', 'CI/CD Pipelines', 'Docker Containerization'],
    bulletPointCritiques: [
      {
        original: "Worked on building responsive web components and fixed UI bugs in the application.",
        issue: "Lacks quantifiable metrics, scale impact, and specific technical stack ownership.",
        improved: "Engineered 15+ reusable React/Next.js UI components, improving page load speed by 35% and reducing customer-reported UI defects by 40%."
      },
      {
        original: "Created backend REST APIs for user authentication and database operations.",
        issue: "Generic phrasing without mentioning security standards or database throughput.",
        improved: "Designed and deployed JWT-authenticated REST APIs using Node.js & PostgreSQL, handling 2,000+ daily requests with under 120ms latency."
      }
    ],
    formattingTips: [
      "Use single-column layout without complex tables or textboxes that confuse ATS scanners.",
      "Ensure all project bullet points begin with strong action verbs (Engineered, Architected, Optimized).",
      "Include a dedicated 'Technical Skills' section categorizing Languages, Frameworks, Databases, and Tools."
    ],
    hiringVerdict: `Good potential for ${targetRole} campus hiring rounds. With the bullet point enhancements and added metrics, this resume will comfortably pass automated ATS screeners.`
  };
}

