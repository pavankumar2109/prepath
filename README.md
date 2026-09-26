# AI Placement Prep Platform ⚡

A complete, production-ready AI-powered Placement Preparation Platform built with **Next.js 14**, **React 18**, and **Google Gemini API** (`gemini-1.5-flash`). Zero backend database required (uses browser `LocalStorage`).

![Platform Banner](https://img.shields.io/badge/Next.js-14.2-purple?style=for-the-badge&logo=nextdotjs)
![React](https://img.shields.io/badge/React-18.3-blue?style=for-the-badge&logo=react)
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-1.5%20Flash-orange?style=for-the-badge&logo=google)
![Vercel Ready](https://img.shields.io/badge/Deployment-Vercel-black?style=for-the-badge&logo=vercel)

---

## 🌟 Key Features

1. **🎯 Assessment Tab**
   - 6 comprehensive questions evaluating DSA, DBMS, Operating Systems, SQL, Aptitude, and Communication.
   - Evaluated by Google Gemini AI to return a overall score (1-10), grade verdict, score breakdown, and prioritized weak/strong areas.

2. **🗺️ 30-Day Personalized Roadmap Tab**
   - AI generates a day-by-day 30-day preparation schedule customized to the candidate's weak areas.
   - Interactive day completion checkboxes saved in browser LocalStorage.
   - Filter by week (Week 1-4) or completion status (Pending/Completed).

3. **💻 Practice Tab**
   - Select topic domains (Arrays, Trees, Graphs, DP, SQL, OS) and difficulty (Easy, Medium, Hard).
   - AI generates unique coding problems with constraints, example testcases, and collapsible hints.
   - Multi-language code editor (JavaScript, Python, C++, Java) with instant AI solution evaluation, complexity analysis, and optimized reference code.

4. **🎙️ Mock Interview Tab**
   - 3 Modes: **Technical**, **HR / Behavioral**, and **Aptitude**.
   - AI interviewer conducts a 4-question session with real-time feedback after each answer.
   - Generates a final evaluation report with overall interview score, key strengths, and actionable recommendations.

5. **📊 Progress & Analytics Tab**
   - Live dashboard displaying readiness scores, completed roadmap days, solved practice problems, and mock interviews completed.
   - Color-coded progress bars for each core domain.

---

## 📂 File Structure

```
project/
├── pages/
│   ├── index.js          # Main React App with all 5 tabs and state management
│   ├── _app.js           # Next.js custom app wrapper & styling imports
│   └── api/
│       └── claude.js     # Backend API endpoint handling Google Gemini 1.5 Flash calls
├── public/
│   └── styles.css        # Pure CSS styling with purple glassmorphism theme
├── package.json          # Node dependencies & scripts
├── next.config.js        # Next.js configuration
├── vercel.json           # Vercel deployment config
├── .env.example          # Environment variables template
├── .gitignore            # Git ignore rules
└── README.md             # Documentation
```

---

## 🛠️ Local Installation & Development Setup

1. **Clone the repository or navigate to directory:**
   ```bash
   cd project
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```env
   GOOGLE_API_KEY=your_gemini_api_key_here
   ```
   *(Note: Obtain your API key from Google AI Studio)*

4. **Run the local development server:**
   ```bash
   npm run dev
   ```

5. **Open in Browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

---

## 🚀 Vercel Deployment Instructions

1. **Push your code to GitHub / GitLab / Bitbucket.**
2. Log into [Vercel](https://vercel.com) and click **"New Project"**.
3. Import your repository.
4. Set the **Framework Preset** to **Next.js**.
5. Under **Environment Variables**, add:
   - **Key:** `GOOGLE_API_KEY`
   - **Value:** `your_gemini_api_key_here`
6. Click **Deploy**.

---

## ⚖️ License

MIT License. Feel free to use and modify for personal and educational campus placement prep!
