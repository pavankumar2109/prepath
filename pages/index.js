import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';

// Default starter assessment questions
const ASSESSMENT_QUESTIONS = [
  {
    key: 'dsa',
    title: '1. Data Structures & Algorithms',
    options: [
      { label: 'Beginner (Basic Arrays, Loops, Simple Searching)', value: 'Beginner' },
      { label: 'Intermediate (Trees, Graphs, Recursion, Sorting)', value: 'Intermediate' },
      { label: 'Advanced (DP, Graph Algorithms, Advanced Trees, Complexities)', value: 'Advanced' }
    ]
  },
  {
    key: 'dbms',
    title: '2. Database Management Systems (DBMS)',
    options: [
      { label: 'Beginner (Basic Tables, Primary Keys, Simple Concepts)', value: 'Beginner' },
      { label: 'Intermediate (Joins, Normalization, Indexes, Transactions)', value: 'Intermediate' },
      { label: 'Advanced (ACID Properties, Sharding, Query Optimization, NoSQL)', value: 'Advanced' }
    ]
  },
  {
    key: 'os',
    title: '3. Operating Systems & Networking',
    options: [
      { label: 'Beginner (Basic CPU, Memory, File Systems)', value: 'Beginner' },
      { label: 'Intermediate (Process vs Thread, Deadlocks, Paging, TCP/IP)', value: 'Intermediate' },
      { label: 'Advanced (Concurrency, Semaphore, System Calls, OSI Layer)', value: 'Advanced' }
    ]
  },
  {
    key: 'sql',
    title: '4. SQL & Database Queries',
    options: [
      { label: 'Beginner (Basic SELECT, WHERE, INSERT, DELETE)', value: 'Beginner' },
      { label: 'Intermediate (GROUP BY, HAVING, INNER/LEFT Joins, Subqueries)', value: 'Intermediate' },
      { label: 'Advanced (Window Functions, CTEs, Index Tuning, Stored Procedures)', value: 'Advanced' }
    ]
  },
  {
    key: 'aptitude',
    title: '5. Aptitude & Logical Reasoning',
    options: [
      { label: 'Beginner (Basic Arithmetic, Needs Practice on Speed)', value: 'Beginner' },
      { label: 'Intermediate (Good at Percentages, Work & Time, Puzzles)', value: 'Intermediate' },
      { label: 'Advanced (Fast Problem Solving, High Accuracy under Time)', value: 'Advanced' }
    ]
  },
  {
    key: 'communication',
    title: '6. Communication & HR Readiness',
    options: [
      { label: 'Beginner (Nervous in Interviews, Struggle with STAR method)', value: 'Beginner' },
      { label: 'Intermediate (Can explain projects clearly, Need minor polish)', value: 'Intermediate' },
      { label: 'Advanced (Fluent, Articulate, Strong Behavioral Answers)', value: 'Advanced' }
    ]
  }
];

export default function Home() {
  // Navigation
  const [activeTab, setActiveTab] = useState('assessment');

  // Assessment State
  const [assessmentAnswers, setAssessmentAnswers] = useState({
    dsa: 'Intermediate',
    dbms: 'Intermediate',
    os: 'Beginner',
    sql: 'Intermediate',
    aptitude: 'Intermediate',
    communication: 'Intermediate',
    notes: ''
  });
  const [assessmentResult, setAssessmentResult] = useState(null);
  const [isAssessing, setIsAssessing] = useState(false);

  // Roadmap State
  const [roadmap, setRoadmap] = useState([]);
  const [completedDays, setCompletedDays] = useState({});
  const [roadmapFilter, setRoadmapFilter] = useState('All');

  // Practice State
  const [practiceTopic, setPracticeTopic] = useState('Arrays');
  const [practiceDifficulty, setPracticeDifficulty] = useState('Medium');
  const [currentProblem, setCurrentProblem] = useState(null);
  const [isGeneratingProblem, setIsGeneratingProblem] = useState(false);
  const [userCode, setUserCode] = useState('');
  const [codeLanguage, setCodeLanguage] = useState('javascript');
  const [solutionEval, setSolutionEval] = useState(null);
  const [isEvaluatingCode, setIsEvaluatingCode] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Mock Interview State
  const [interviewMode, setInterviewMode] = useState('Technical');
  const [interviewSession, setInterviewSession] = useState(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [userInterviewAnswer, setUserInterviewAnswer] = useState('');
  const [isStartingInterview, setIsStartingInterview] = useState(false);
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const [interviewAnswersLog, setInterviewAnswersLog] = useState([]);
  const [interviewFinalReport, setInterviewFinalReport] = useState(null);

  // Platform Analytics / Stats
  const [solvedCount, setSolvedCount] = useState(0);
  const [interviewCount, setInterviewCount] = useState(0);

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const savedAssessment = localStorage.getItem('placement_assessment');
      if (savedAssessment) setAssessmentResult(JSON.parse(savedAssessment));

      const savedRoadmap = localStorage.getItem('placement_roadmap');
      if (savedRoadmap) setRoadmap(JSON.parse(savedRoadmap));

      const savedDays = localStorage.getItem('placement_completed_days');
      if (savedDays) setCompletedDays(JSON.parse(savedDays));

      const savedSolved = localStorage.getItem('placement_solved_count');
      if (savedSolved) setSolvedCount(parseInt(savedSolved, 10) || 0);

      const savedMocks = localStorage.getItem('placement_mock_count');
      if (savedMocks) setInterviewCount(parseInt(savedMocks, 10) || 0);
    } catch (err) {
      console.error('Failed to load LocalStorage data:', err);
    }
  }, []);

  // Sync state to LocalStorage
  const saveAssessmentResult = (data) => {
    setAssessmentResult(data);
    localStorage.setItem('placement_assessment', JSON.stringify(data));
    if (data?.roadmap) {
      setRoadmap(data.roadmap);
      localStorage.setItem('placement_roadmap', JSON.stringify(data.roadmap));
    }
  };

  const toggleDayCompletion = (dayNum) => {
    const updated = { ...completedDays, [dayNum]: !completedDays[dayNum] };
    setCompletedDays(updated);
    localStorage.setItem('placement_completed_days', JSON.stringify(updated));
  };

  // Action 1: Submit Assessment
  const handleRunAssessment = async () => {
    setIsAssessing(true);
    try {
      const response = await axios.post('/api/claude', {
        action: 'assess',
        data: { answers: assessmentAnswers }
      });
      if (response.data?.success) {
        saveAssessmentResult(response.data.result);
      }
    } catch (err) {
      alert('Failed to complete assessment. Please check backend connection.');
    } finally {
      setIsAssessing(false);
    }
  };

  // Action 2: Generate Coding Problem
  const handleGenerateProblem = async () => {
    setIsGeneratingProblem(true);
    setSolutionEval(null);
    setShowHint(false);
    try {
      const response = await axios.post('/api/claude', {
        action: 'generateProblem',
        data: { topic: practiceTopic, difficulty: practiceDifficulty }
      });
      if (response.data?.success) {
        const prob = response.data.result;
        setCurrentProblem(prob);
        setUserCode(prob.starterCode?.[codeLanguage] || prob.starterCode?.javascript || '// Write solution here');
      }
    } catch (err) {
      alert('Failed to generate problem. Try again.');
    } finally {
      setIsGeneratingProblem(false);
    }
  };

  // Action 3: Evaluate Code Solution
  const handleEvaluateSolution = async () => {
    if (!userCode.trim()) {
      alert('Please enter your solution before submitting.');
      return;
    }
    setIsEvaluatingCode(true);
    try {
      const response = await axios.post('/api/claude', {
        action: 'evaluateSolution',
        data: { problem: currentProblem, solution: userCode, language: codeLanguage }
      });
      if (response.data?.success) {
        const evalRes = response.data.result;
        setSolutionEval(evalRes);
        if (evalRes.status === 'Passed') {
          const newCount = solvedCount + 1;
          setSolvedCount(newCount);
          localStorage.setItem('placement_solved_count', newCount.toString());
        }
      }
    } catch (err) {
      alert('Failed to evaluate solution. Please try again.');
    } finally {
      setIsEvaluatingCode(false);
    }
  };

  // Action 4: Start Interview
  const handleStartInterview = async () => {
    setIsStartingInterview(true);
    setInterviewAnswersLog([]);
    setInterviewFinalReport(null);
    setCurrentQuestionIdx(0);
    setUserInterviewAnswer('');
    try {
      const response = await axios.post('/api/claude', {
        action: 'startInterview',
        data: { mode: interviewMode }
      });
      if (response.data?.success) {
        setInterviewSession(response.data.result);
      }
    } catch (err) {
      alert('Failed to start interview session.');
    } finally {
      setIsStartingInterview(false);
    }
  };

  // Action 5: Submit Interview Answer
  const handleEvaluateInterviewAnswer = async () => {
    if (!userInterviewAnswer.trim()) {
      alert('Please type an answer to proceed.');
      return;
    }

    setIsSubmittingAnswer(true);
    const currentQ = interviewSession.questions[currentQuestionIdx];

    try {
      const response = await axios.post('/api/claude', {
        action: 'interviewEvaluate',
        data: {
          mode: interviewMode,
          currentQuestionIndex: currentQuestionIdx,
          question: currentQ.question,
          answer: userInterviewAnswer,
          history: interviewAnswersLog
        }
      });

      if (response.data?.success) {
        const evalData = response.data.result;
        const newLog = [
          ...interviewAnswersLog,
          {
            question: currentQ.question,
            userAnswer: userInterviewAnswer,
            evaluation: evalData
          }
        ];
        setInterviewAnswersLog(newLog);
        setUserInterviewAnswer('');

        if (evalData.isComplete || currentQuestionIdx >= interviewSession.questions.length - 1) {
          setInterviewFinalReport(evalData.finalReport || {
            overallScore: 8.0,
            performanceSummary: 'You completed all questions in this mock interview round with great effort.',
            strengths: ['Clear articulate answers', 'Good communication structure'],
            improvements: ['Add deeper technical examples'],
            recommendations: ['Practice timed mock rounds regularly']
          });
          const newCount = interviewCount + 1;
          setInterviewCount(newCount);
          localStorage.setItem('placement_mock_count', newCount.toString());
        } else {
          setCurrentQuestionIdx(prev => prev + 1);
        }
      }
    } catch (err) {
      alert('Failed to process answer feedback.');
    } finally {
      setIsSubmittingAnswer(false);
    }
  };

  // Helper for Roadmap filters
  const filteredRoadmap = roadmap.filter(item => {
    if (roadmapFilter === 'All') return true;
    if (roadmapFilter === 'Completed') return completedDays[item.day];
    if (roadmapFilter === 'Pending') return !completedDays[item.day];
    if (roadmapFilter === 'Week 1') return item.day >= 1 && item.day <= 7;
    if (roadmapFilter === 'Week 2') return item.day >= 8 && item.day <= 14;
    if (roadmapFilter === 'Week 3') return item.day >= 15 && item.day <= 21;
    if (roadmapFilter === 'Week 4') return item.day >= 22 && item.day <= 30;
    return true;
  });

  const completedDaysCount = Object.values(completedDays).filter(Boolean).length;
  const roadmapProgressPct = roadmap.length ? Math.round((completedDaysCount / roadmap.length) * 100) : 0;

  return (
    <div className="app-container">
      <Head>
        <title>AI Placement Prep Platform - Next.js & Gemini AI</title>
      </Head>

      {/* Header Bar */}
      <header className="header-bar">
        <div className="brand-logo">
          <div className="logo-icon">⚡</div>
          <div className="brand-text">
            <h1>Placement AI Prep</h1>
            <p>Smart Next.js 14 Preparation Engine for Campus Placements</p>
          </div>
        </div>
        <div className="api-badge">
          <span className="dot"></span>
          <span>Google Gemini 1.5 Flash Active</span>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="tabs-navigation">
        <button
          className={`tab-btn ${activeTab === 'assessment' ? 'active' : ''}`}
          onClick={() => setActiveTab('assessment')}
        >
          <span className="tab-icon">🎯</span> Assessment
        </button>
        <button
          className={`tab-btn ${activeTab === 'roadmap' ? 'active' : ''}`}
          onClick={() => setActiveTab('roadmap')}
        >
          <span className="tab-icon">🗺️</span> 30-Day Roadmap
        </button>
        <button
          className={`tab-btn ${activeTab === 'practice' ? 'active' : ''}`}
          onClick={() => setActiveTab('practice')}
        >
          <span className="tab-icon">💻</span> Coding Practice
        </button>
        <button
          className={`tab-btn ${activeTab === 'mock' ? 'active' : ''}`}
          onClick={() => setActiveTab('mock')}
        >
          <span className="tab-icon">🎙️</span> Mock Interview
        </button>
        <button
          className={`tab-btn ${activeTab === 'progress' ? 'active' : ''}`}
          onClick={() => setActiveTab('progress')}
        >
          <span className="tab-icon">📊</span> Progress & Analytics
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="tab-content">
        {/* ==================================================================== */}
        {/* TAB 1: ASSESSMENT */}
        {/* ==================================================================== */}
        {activeTab === 'assessment' && (
          <div>
            <div className="glass-card">
              <h2 className="card-title">Placement Readiness Self-Assessment</h2>
              <p className="card-subtitle">
                Rate your proficiency across the 6 core pillars of campus software engineering placements. Our AI engine will evaluate your responses and construct a personalized profile.
              </p>

              <div className="assessment-grid">
                {ASSESSMENT_QUESTIONS.map(q => (
                  <div key={q.key} className="question-card">
                    <h3 className="question-title">{q.title}</h3>
                    <div className="question-options">
                      {q.options.map(opt => (
                        <button
                          key={opt.value}
                          className={`option-btn ${assessmentAnswers[q.key] === opt.value ? 'selected' : ''}`}
                          onClick={() => setAssessmentAnswers({ ...assessmentAnswers, [q.key]: opt.value })}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="form-group">
                <label className="form-label">Target Companies & Extra Notes (Optional)</label>
                <textarea
                  className="form-control"
                  placeholder="e.g. Target companies (MAANG, Tier-1 Product startups), timeline (2 months), weak in DP..."
                  value={assessmentAnswers.notes}
                  onChange={e => setAssessmentAnswers({ ...assessmentAnswers, notes: e.target.value })}
                />
              </div>

              <button
                className="btn btn-primary"
                onClick={handleRunAssessment}
                disabled={isAssessing}
              >
                {isAssessing ? (
                  <>
                    <span className="loading-spinner"></span> AI Analyzing Your Profile...
                  </>
                ) : (
                  'Run AI Readiness Assessment'
                )}
              </button>
            </div>

            {/* Assessment Result Dashboard */}
            {assessmentResult && (
              <div className="glass-card">
                <h2 className="card-title">Your AI Placement Profile</h2>
                <div className="results-header">
                  <div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{assessmentResult.verdict}</h3>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.4rem' }}>{assessmentResult.summary}</p>
                  </div>
                  <div className="score-circle">
                    <span className="number">{assessmentResult.overallScore}</span>
                    <span className="label">OUT OF 10</span>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '1.5rem 0 1rem' }}>Category Score Breakdown</h3>
                <div className="scores-breakdown-grid">
                  {Object.entries(assessmentResult.scores || {}).map(([key, val]) => (
                    <div key={key} className="breakdown-card">
                      <div className="breakdown-top">
                        <span style={{ textTransform: 'uppercase' }}>{key}</span>
                        <span>{val}/10</span>
                      </div>
                      <div className="progress-bar-bg">
                        <div
                          className={`progress-bar-fill ${val >= 7 ? 'high' : val >= 5 ? 'medium' : 'low'}`}
                          style={{ width: `${(val / 10) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="areas-grid">
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--danger)' }}>
                      ⚠️ Priority Weak Areas
                    </h3>
                    {assessmentResult.weakAreas?.map((item, idx) => (
                      <div key={idx} className="area-box weak">
                        <div className="area-box-header">
                          <span>{item.topic}</span>
                          <span className="badge badge-medium">{item.priority} Priority</span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.description}</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-main)', marginTop: '0.4rem', fontWeight: 600 }}>
                          💡 Action Plan: {item.actionPlan}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--success)' }}>
                      ✨ Strong Pillars
                    </h3>
                    {assessmentResult.strongAreas?.map((item, idx) => (
                      <div key={idx} className="area-box strong">
                        <div className="area-box-header">
                          <span>{item.topic}</span>
                          <span className="badge badge-easy">{item.level}</span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                  <button className="btn btn-primary" onClick={() => setActiveTab('roadmap')}>
                    View Your AI 30-Day Personalized Roadmap →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 2: ROADMAP */}
        {/* ==================================================================== */}
        {activeTab === 'roadmap' && (
          <div>
            <div className="glass-card">
              <div className="roadmap-header">
                <div>
                  <h2 className="card-title">Personalized 30-Day Preparation Roadmap</h2>
                  <p className="card-subtitle">
                    AI-curated day-by-day plan targeting your specific weak areas. Track your daily completion progress below.
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary-light)' }}>
                    {completedDaysCount} / {roadmap.length || 30} Days Completed ({roadmapProgressPct}%)
                  </div>
                  <div className="progress-bar-bg" style={{ width: '220px', marginTop: '0.5rem' }}>
                    <div className="progress-bar-fill" style={{ width: `${roadmapProgressPct}%` }}></div>
                  </div>
                </div>
              </div>

              <div className="filter-pills" style={{ marginBottom: '1.5rem' }}>
                {['All', 'Week 1', 'Week 2', 'Week 3', 'Week 4', 'Pending', 'Completed'].map(f => (
                  <button
                    key={f}
                    className={`pill-btn ${roadmapFilter === f ? 'active' : ''}`}
                    onClick={() => setRoadmapFilter(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {roadmap.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">🗺️</div>
                  <h3>No Roadmap Generated Yet</h3>
                  <p style={{ margin: '0.5rem 0 1.5rem' }}>Please complete the AI Assessment tab to generate your tailored 30-day preparation roadmap.</p>
                  <button className="btn btn-primary" onClick={() => setActiveTab('assessment')}>Go to Assessment Tab</button>
                </div>
              ) : (
                <div className="roadmap-list">
                  {filteredRoadmap.map(item => {
                    const isDone = !!completedDays[item.day];
                    return (
                      <div key={item.day} className={`day-card ${isDone ? 'completed' : ''}`}>
                        <div className="day-card-top">
                          <span className="day-badge">Day {item.day}</span>
                          <span className="time-badge">⏱️ {item.timeEstimate}</span>
                        </div>
                        <h3 className="day-title">{item.topic}</h3>
                        <p className="day-desc">{item.description}</p>

                        {item.resources && item.resources.length > 0 && (
                          <ul className="resource-list">
                            {item.resources.map((res, rIdx) => (
                              <li key={rIdx} className="resource-item">{res}</li>
                            ))}
                          </ul>
                        )}

                        <label className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={isDone}
                            onChange={() => toggleDayCompletion(item.day)}
                          />
                          <span>{isDone ? 'Marked as Completed ✓' : 'Mark Day Completed'}</span>
                        </label>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 3: PRACTICE */}
        {/* ==================================================================== */}
        {activeTab === 'practice' && (
          <div>
            <div className="glass-card">
              <h2 className="card-title">AI Coding & Technical Challenge Engine</h2>
              <p className="card-subtitle">
                Select your focus domain and difficulty. Gemini AI will generate a unique coding problem complete with constraints and testcases.
              </p>

              <div className="practice-selectors">
                <div className="form-group">
                  <label className="form-label">Select Topic Domain</label>
                  <select
                    className="form-select"
                    value={practiceTopic}
                    onChange={e => setPracticeTopic(e.target.value)}
                  >
                    <option value="Arrays">Arrays & Hashing</option>
                    <option value="Trees">Trees & Binary Search Trees</option>
                    <option value="Graphs">Graphs & BFS/DFS</option>
                    <option value="Dynamic Programming">Dynamic Programming</option>
                    <option value="SQL Queries">SQL & Complex Joins</option>
                    <option value="Operating Systems">OS & Concurrency Concepts</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Difficulty Level</label>
                  <div className="difficulty-btns">
                    {['Easy', 'Medium', 'Hard'].map(diff => (
                      <button
                        key={diff}
                        className={`diff-btn ${diff} ${practiceDifficulty === diff ? 'active' : ''}`}
                        onClick={() => setPracticeDifficulty(diff)}
                      >
                        {diff}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                className="btn btn-primary"
                onClick={handleGenerateProblem}
                disabled={isGeneratingProblem}
              >
                {isGeneratingProblem ? (
                  <>
                    <span className="loading-spinner"></span> Generating AI Problem...
                  </>
                ) : (
                  'Generate Unique Problem'
                )}
              </button>
            </div>

            {currentProblem && (
              <div className="glass-card">
                <div className="problem-header">
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{currentProblem.title}</h2>
                  <div className="problem-badges">
                    <span className="badge badge-easy">{currentProblem.topic}</span>
                    <span className={`badge badge-${currentProblem.difficulty.toLowerCase()}`}>
                      {currentProblem.difficulty}
                    </span>
                  </div>
                </div>

                <div style={{ color: 'var(--text-muted)', marginBottom: '1.2rem' }}>
                  {currentProblem.description}
                </div>

                {currentProblem.constraints && currentProblem.constraints.length > 0 && (
                  <div style={{ marginBottom: '1.2rem' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-main)' }}>Constraints:</h4>
                    <ul style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {currentProblem.constraints.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {currentProblem.examples && currentProblem.examples.length > 0 && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-main)' }}>Example Test Case:</h4>
                    {currentProblem.examples.map((ex, exIdx) => (
                      <div key={exIdx} className="example-box">
                        <div><strong>Input:</strong> {ex.input}</div>
                        <div><strong>Output:</strong> {ex.output}</div>
                        {ex.explanation && <div style={{ color: 'var(--text-muted)', marginTop: '0.3rem' }}><strong>Explanation:</strong> {ex.explanation}</div>}
                      </div>
                    ))}
                  </div>
                )}

                {currentProblem.hints && currentProblem.hints.length > 0 && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem' }}
                      onClick={() => setShowHint(!showHint)}
                    >
                      {showHint ? 'Hide Hints 💡' : 'Need a Hint? 💡'}
                    </button>
                    {showHint && (
                      <div style={{ marginTop: '0.8rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', fontSize: '0.85rem' }}>
                        {currentProblem.hints.map((h, i) => (
                          <p key={i} style={{ marginBottom: '0.3rem' }}>• {h}</p>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Code Editor */}
                <div className="code-editor-container">
                  <div className="editor-toolbar">
                    <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-muted)' }}>SOLUTION EDITOR</span>
                    <select
                      className="form-select"
                      style={{ width: 'auto', padding: '0.3rem 0.8rem', fontSize: '0.85rem' }}
                      value={codeLanguage}
                      onChange={e => {
                        setCodeLanguage(e.target.value);
                        if (currentProblem?.starterCode?.[e.target.value]) {
                          setUserCode(currentProblem.starterCode[e.target.value]);
                        }
                      }}
                    >
                      <option value="javascript">JavaScript</option>
                      <option value="python">Python</option>
                      <option value="cpp">C++</option>
                      <option value="java">Java</option>
                    </select>
                  </div>
                  <textarea
                    className="code-area"
                    value={userCode}
                    onChange={e => setUserCode(e.target.value)}
                    placeholder="// Write your code solution here..."
                  />
                </div>

                <button
                  className="btn btn-primary"
                  onClick={handleEvaluateSolution}
                  disabled={isEvaluatingCode}
                >
                  {isEvaluatingCode ? (
                    <>
                      <span className="loading-spinner"></span> AI Evaluating Solution...
                    </>
                  ) : (
                    'Submit Solution for AI Evaluation'
                  )}
                </button>

                {/* Feedback Report */}
                {solutionEval && (
                  <div className="feedback-card">
                    <div className="feedback-header">
                      <div>
                        <span className={`badge ${solutionEval.status === 'Passed' ? 'badge-easy' : 'badge-hard'}`} style={{ fontSize: '0.9rem' }}>
                          {solutionEval.status} ({solutionEval.score}/100)
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.8rem' }}>
                        <span className="metric-pill">⏱️ Time: {solutionEval.timeComplexity}</span>
                        <span className="metric-pill">💾 Space: {solutionEval.spaceComplexity}</span>
                      </div>
                    </div>

                    <p style={{ color: 'var(--text-muted)', marginBottom: '1.2rem' }}>{solutionEval.feedback}</p>

                    <div className="areas-grid" style={{ marginBottom: '1.2rem' }}>
                      <div>
                        <h4 style={{ color: 'var(--success)', marginBottom: '0.5rem' }}>Key Strengths</h4>
                        <ul style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          {solutionEval.keyStrengths?.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                      </div>
                      <div>
                        <h4 style={{ color: 'var(--warning)', marginBottom: '0.5rem' }}>Areas to Improve</h4>
                        <ul style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          {solutionEval.areasToImprove?.map((a, i) => <li key={i}>{a}</li>)}
                        </ul>
                      </div>
                    </div>

                    {solutionEval.optimizedSolution && (
                      <div>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.5rem' }}>Optimized AI Reference Solution:</h4>
                        <pre style={{ background: '#0a0518', padding: '1rem', borderRadius: '10px', overflowX: 'auto', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#c084fc' }}>
                          {solutionEval.optimizedSolution}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 4: MOCK INTERVIEW */}
        {/* ==================================================================== */}
        {activeTab === 'mock' && (
          <div>
            {!interviewSession ? (
              <div className="glass-card">
                <h2 className="card-title">AI Interactive Placement Mock Interview</h2>
                <p className="card-subtitle">
                  Select an interview track. Gemini AI will serve as your strict, professional technical interviewer asking 4 targeted questions with instant feedback.
                </p>

                <div className="interview-mode-grid">
                  <div
                    className={`mode-card ${interviewMode === 'Technical' ? 'selected' : ''}`}
                    onClick={() => setInterviewMode('Technical')}
                  >
                    <div className="mode-icon">💻</div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Technical Round</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      DSA algorithms, DBMS internal architecture, OS concepts & system design basics.
                    </p>
                  </div>

                  <div
                    className={`mode-card ${interviewMode === 'HR' ? 'selected' : ''}`}
                    onClick={() => setInterviewMode('HR')}
                  >
                    <div className="mode-icon">🤝</div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>HR & Behavioral</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      STAR framework situational questions, conflict management, motivation & career goals.
                    </p>
                  </div>

                  <div
                    className={`mode-card ${interviewMode === 'Aptitude' ? 'selected' : ''}`}
                    onClick={() => setInterviewMode('Aptitude')}
                  >
                    <div className="mode-icon">🧩</div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Aptitude & Puzzles</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Quantitative math, logic puzzles, speed-distance-time, probability & reasoning.
                    </p>
                  </div>
                </div>

                <button
                  className="btn btn-primary"
                  onClick={handleStartInterview}
                  disabled={isStartingInterview}
                >
                  {isStartingInterview ? (
                    <>
                      <span className="loading-spinner"></span> Initializing Interviewer...
                    </>
                  ) : (
                    `Start ${interviewMode} Mock Interview`
                  )}
                </button>
              </div>
            ) : (
              <div>
                <div className="glass-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <span className="badge badge-medium">{interviewSession.mode} Round</span>
                    <span style={{ fontWeight: 700, color: 'var(--primary-light)' }}>
                      Question {currentQuestionIdx + 1} of {interviewSession.questions.length}
                    </span>
                  </div>

                  {/* Previous Answer Feedback History */}
                  {interviewAnswersLog.length > 0 && (
                    <div style={{ marginBottom: '2rem' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-muted)' }}>Interview History & Feedback</h4>
                      {interviewAnswersLog.map((log, idx) => (
                        <div key={idx} className="glass-card" style={{ padding: '1.2rem', marginBottom: '1rem', background: 'rgba(15, 8, 38, 0.8)' }}>
                          <p style={{ fontWeight: 700, color: '#ffffff', marginBottom: '0.3rem' }}>Q{idx + 1}: {log.question}</p>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', marginBottom: '0.8rem' }}>Your Answer: "{log.userAnswer}"</p>
                          
                          <div style={{ background: 'rgba(168, 85, 247, 0.1)', padding: '0.8rem', borderRadius: '10px', borderLeft: '3px solid var(--primary)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.3rem' }}>
                              <span>AI Feedback Score:</span>
                              <span style={{ color: log.evaluation.answerScore >= 7 ? 'var(--success)' : 'var(--warning)' }}>
                                {log.evaluation.answerScore} / 10
                              </span>
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>{log.evaluation.feedback}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Active Question Box */}
                  {!interviewFinalReport ? (
                    <div>
                      <div className="chat-box">
                        <div className="message-bubble ai">
                          <div className="avatar">AI</div>
                          <div className="bubble-content">
                            <p style={{ fontWeight: 700, color: 'var(--primary-light)', marginBottom: '0.3rem' }}>Interviewer Prompt:</p>
                            <p style={{ fontSize: '1.05rem', fontWeight: 600 }}>
                              {interviewSession.questions[currentQuestionIdx]?.question}
                            </p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                              💡 Guidance: {interviewSession.questions[currentQuestionIdx]?.guidance}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="form-group" style={{ marginTop: '1.5rem' }}>
                        <label className="form-label">Your Answer Response</label>
                        <textarea
                          className="form-control"
                          style={{ minHeight: '140px' }}
                          placeholder="Type your response clearly here..."
                          value={userInterviewAnswer}
                          onChange={e => setUserInterviewAnswer(e.target.value)}
                        />
                      </div>

                      <button
                        className="btn btn-primary"
                        onClick={handleEvaluateInterviewAnswer}
                        disabled={isSubmittingAnswer}
                      >
                        {isSubmittingAnswer ? (
                          <>
                            <span className="loading-spinner"></span> AI Evaluating Response...
                          </>
                        ) : (
                          'Submit Answer to Interviewer'
                        )}
                      </button>
                    </div>
                  ) : (
                    /* Final Interview Report */
                    <div className="feedback-card">
                      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff' }}>Interview Complete 🎉</h2>
                        <div className="score-circle" style={{ margin: '1rem auto' }}>
                          <span className="number">{interviewFinalReport.overallScore}</span>
                          <span className="label">SCORE / 10</span>
                        </div>
                        <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
                          {interviewFinalReport.performanceSummary}
                        </p>
                      </div>

                      <div className="areas-grid" style={{ marginBottom: '1.5rem' }}>
                        <div>
                          <h4 style={{ color: 'var(--success)', marginBottom: '0.5rem' }}>Key Strengths Exhibited</h4>
                          <ul style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            {interviewFinalReport.strengths?.map((s, i) => <li key={i}>{s}</li>)}
                          </ul>
                        </div>
                        <div>
                          <h4 style={{ color: 'var(--warning)', marginBottom: '0.5rem' }}>Recommended Improvements</h4>
                          <ul style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            {interviewFinalReport.improvements?.map((imp, i) => <li key={i}>{imp}</li>)}
                          </ul>
                        </div>
                      </div>

                      <button
                        className="btn btn-secondary"
                        onClick={() => {
                          setInterviewSession(null);
                          setInterviewFinalReport(null);
                        }}
                      >
                        ← Start Another Interview Round
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 5: PROGRESS & ANALYTICS */}
        {/* ==================================================================== */}
        {activeTab === 'progress' && (
          <div>
            <div className="glass-card">
              <h2 className="card-title">Placement Readiness Dashboard</h2>
              <p className="card-subtitle">
                Comprehensive real-time statistics and historical performance tracking stored securely in your browser.
              </p>

              <div className="metrics-row">
                <div className="metric-card">
                  <div className="metric-label">OVERALL READINESS</div>
                  <div className="metric-value" style={{ color: 'var(--primary-light)' }}>
                    {assessmentResult ? `${assessmentResult.overallScore}/10` : 'N/A'}
                  </div>
                  <div className="metric-label">{assessmentResult ? assessmentResult.verdict : 'Take Assessment First'}</div>
                </div>

                <div className="metric-card">
                  <div className="metric-label">ROADMAP DAYS FINISHED</div>
                  <div className="metric-value" style={{ color: 'var(--success)' }}>
                    {completedDaysCount} / {roadmap.length || 30}
                  </div>
                  <div className="metric-label">{roadmapProgressPct}% Plan Progress</div>
                </div>

                <div className="metric-card">
                  <div className="metric-label">CODING PROBLEMS PASSED</div>
                  <div className="metric-value" style={{ color: 'var(--info)' }}>
                    {solvedCount}
                  </div>
                  <div className="metric-label">Practice Mode Solved</div>
                </div>

                <div className="metric-card">
                  <div className="metric-label">MOCK INTERVIEWS</div>
                  <div className="metric-value" style={{ color: 'var(--warning)' }}>
                    {interviewCount}
                  </div>
                  <div className="metric-label">Rounds Completed</div>
                </div>
              </div>

              {assessmentResult ? (
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Domain Competency Radar</h3>
                  <div className="scores-breakdown-grid" style={{ marginBottom: '2rem' }}>
                    {Object.entries(assessmentResult.scores || {}).map(([domain, val]) => (
                      <div key={domain} className="breakdown-card">
                        <div className="breakdown-top">
                          <span style={{ textTransform: 'uppercase' }}>{domain}</span>
                          <span>{val} / 10</span>
                        </div>
                        <div className="progress-bar-bg">
                          <div
                            className={`progress-bar-fill ${val >= 7 ? 'high' : val >= 5 ? 'medium' : 'low'}`}
                            style={{ width: `${(val / 10) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="areas-grid">
                    <div>
                      <h4 style={{ color: 'var(--danger)', marginBottom: '0.8rem', fontWeight: 700 }}>Prioritized Focus Needed</h4>
                      {assessmentResult.weakAreas?.map((w, idx) => (
                        <div key={idx} className="area-box weak">
                          <div className="area-box-header">
                            <span>{w.topic}</span>
                            <span className="badge badge-hard">{w.priority}</span>
                          </div>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{w.description}</p>
                        </div>
                      ))}
                    </div>

                    <div>
                      <h4 style={{ color: 'var(--success)', marginBottom: '0.8rem', fontWeight: 700 }}>Validated Mastery</h4>
                      {assessmentResult.strongAreas?.map((s, idx) => (
                        <div key={idx} className="area-box strong">
                          <div className="area-box-header">
                            <span>{s.topic}</span>
                            <span className="badge badge-easy">{s.level}</span>
                          </div>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{s.reason}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📊</div>
                  <h3>No Assessment Data Found</h3>
                  <p style={{ margin: '0.5rem 0 1.5rem' }}>Take the 6-question assessment to unlock detailed analytics and domain breakdown graphs.</p>
                  <button className="btn btn-primary" onClick={() => setActiveTab('assessment')}>Take Assessment Now</button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>AI Placement Prep Platform • Powered by Next.js 14 & Google Gemini 1.5 Flash</p>
      </footer>
    </div>
  );
}
