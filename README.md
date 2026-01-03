# Real-Time Grammar Checker & Text Analysis Tool

A full-stack web application for real-time grammar checking, voice conversion (active to passive), and ambiguity detection built with Next.js, PostgreSQL, and TypeScript.

## 🚀 Features

- **Grammar Checker** - Detects grammatical errors and provides corrections with one-click Apply button
- **Voice Converter** - Converts between active and passive voice automatically
- **Ambiguity Detector** - Identifies vague pronouns, homophones (like "see" vs "sea"), and unclear references
- **User Authentication** - Secure signup and login with JWT tokens
- **Save Analysis History** - Store and retrieve your grammar checks (requires login)
- **Real-time Processing** - Instant feedback as you type

## 📋 Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, PostgreSQL, JWT Authentication
- **Database**: PostgreSQL (via Neon or local)
- **External APIs**: LanguageTool for advanced grammar checking
- **UI Components**: shadcn/ui with Radix UI

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

### Windows
- **Node.js** (v18.0 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/windows/)
- **Git** (optional) - [Download](https://git-scm.com/download/win)
- **npm** or **yarn** (comes with Node.js)

### macOS
- **Node.js** (v18.0 or higher) - [Download](https://nodejs.org/) or use Homebrew: `brew install node`
- **PostgreSQL** - [Download](https://www.postgresql.org/download/macosx/) or use Homebrew: `brew install postgresql`
- **Git** (optional) - Usually pre-installed

### Linux (Ubuntu/Debian)
- **Node.js**: `sudo apt update && sudo apt install nodejs npm`
- **PostgreSQL**: `sudo apt install postgresql postgresql-contrib`
- **Git** (optional): `sudo apt install git`

## 📦 Installation Guide

### Step 1: Clone or Download the Project

**Using Git:**
\`\`\`bash
git clone <repository-url>
cd realtimegrammar1
\`\`\`

**Or Download ZIP:**
1. Download the ZIP file
2. Extract it to your desired location
3. Open terminal/PowerShell and navigate to the folder

### Step 2: Install Dependencies

\`\`\`bash
npm install
\`\`\`

Wait for all packages to install. This may take 2-5 minutes on first run.

### Step 3: Setup PostgreSQL Database

#### On Windows:

1. **Verify PostgreSQL Installation:**
   - Open PowerShell and run:
   \`\`\`bash
   psql --version
   \`\`\`
   - If not found, add PostgreSQL to PATH or use full path

2. **Create Database and User:**
   \`\`\`bash
   psql -U postgres
   \`\`\`
   - Enter password when prompted (default is usually blank or "postgres")
   - Then run:
   \`\`\`sql
   CREATE DATABASE grammar_checker;
   CREATE USER grammar_user WITH PASSWORD 'your_secure_password';
   ALTER ROLE grammar_user SET client_encoding TO 'utf8';
   ALTER ROLE grammar_user SET default_transaction_isolation TO 'read committed';
   ALTER ROLE grammar_user SET default_transaction_deferrable TO on;
   ALTER ROLE grammar_user SET default_transaction_read_only TO off;
   GRANT ALL PRIVILEGES ON DATABASE grammar_checker TO grammar_user;
   \\q
   \`\`\`

#### On macOS/Linux:

\`\`\`bash
psql -U postgres
\`\`\`

Then run the same SQL commands as above.

### Step 4: Configure Environment Variables

1. **Create `.env.local` file** in the root directory:
   \`\`\`bash
   # Windows (PowerShell)
   New-Item -Path ".env.local" -ItemType File

   # macOS/Linux
   touch .env.local
   \`\`\`

2. **Add the following environment variables:**
   \`\`\`
   DATABASE_URL="postgresql://grammar_user:your_secure_password@localhost:5432/grammar_checker"
   JWT_SECRET="your_super_secret_key_change_this_to_something_random"
   NODE_ENV="development"
   \`\`\`

   Replace:
   - `your_secure_password` with the password you set for `grammar_user`
   - `your_super_secret_key_change_this_to_something_random` with a random string (at least 32 characters)

### Step 5: Initialize Database Schema

Run the SQL migration scripts to create tables:

#### Option A: Using psql (Recommended)

\`\`\`bash
# Windows
psql -U grammar_user -d grammar_checker -f scripts/03-consolidated-schema.sql

# macOS/Linux
psql -U grammar_user -d grammar_checker -f scripts/03-consolidated-schema.sql
\`\`\`

#### Option B: Manual Execution

1. Open pgAdmin or psql
2. Connect to `grammar_checker` database
3. Copy and paste the contents of `scripts/03-consolidated-schema.sql`
4. Execute

**Verify tables were created:**
\`\`\`bash
psql -U grammar_user -d grammar_checker -c "\\dt"
\`\`\`

You should see:
- \`users\` table
- \`feedback\` table
- \`analyses\` table

## 🚀 Running the Application

### Development Mode

\`\`\`bash
npm run dev
\`\`\`

The app will start at: **http://localhost:3000**

### Production Build

\`\`\`bash
npm run build
npm run start
\`\`\`

## ✅ Verification

### Test the Application

1. **Homepage**: Navigate to http://localhost:3000
2. **Create Account**: Go to Signup and create a new account
3. **Login**: Login with your credentials
4. **Grammar Checker**: 
   - Enter text with errors: "He dont know nothing"
   - Click "Check Grammar"
   - Should detect: "dont" → "doesn't", "nothing" (double negative)
   - Click "Apply" to apply correction
   - Click "Save" to save to history
5. **Voice Converter**:
   - Enter: "The cat is chasing the mouse"
   - Click "Convert" 
   - Should see: "The mouse is being chased by the cat"
6. **Ambiguity Detector**:
   - Enter: "I saw the man with the telescope"
   - Should highlight ambiguity about who has the telescope

### Test Database Connection

\`\`\`bash
# Create a test user
psql -U grammar_user -d grammar_checker -c "SELECT * FROM users LIMIT 1;"
\`\`\`

## 📁 Project Structure

\`\`\`
├── app/
│   ├── api/
│   │   ├── auth/              # Authentication endpoints
│   │   ├── grammar-check/     # Grammar checking API
│   │   ├── voice-converter/   # Voice conversion API
│   │   ├── ambiguity-check/   # Ambiguity detection API
│   │   └── save-analysis/     # Save analysis to database
│   ├── grammar-checker/       # Grammar checker page
│   ├── voice-converter/       # Voice converter page
│   ├── ambiguity-detector/    # Ambiguity detector page
│   └── layout.tsx             # Root layout
├── lib/
│   ├── db.ts                  # Database connection
│   ├── auth.ts                # Authentication logic
│   └── session.ts             # Session management
├── components/
│   └── ui/                    # shadcn/ui components
├── scripts/
│   └── 03-consolidated-schema.sql  # Database schema
├── .env.local                 # Environment variables (create this)
└── package.json
\`\`\`

## 🔐 Features Explained

### Grammar Checker
- Uses LanguageTool API for professional-grade checking
- Detects: spelling, grammar, punctuation, style issues
- **Apply Button**: Instantly applies suggestions to your text
- **Save Button**: Stores analysis in database for future reference

### Voice Converter
- Converts Active Voice → Passive Voice and vice versa
- Example: "John wrote the book" → "The book was written by John"
- Works with various verb tenses

### Ambiguity Detector
- Identifies vague pronouns ("it", "this", "that")
- Finds homophones with definitions (see/sea, your/you're)
- Detects unclear word order and references

## 🐛 Troubleshooting

### Port 3000 Already in Use
\`\`\`bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3000
kill -9 <PID>
\`\`\`

### PostgreSQL Connection Error
1. Verify PostgreSQL is running:
   \`\`\`bash
   psql -U postgres -c "SELECT version();"
   \`\`\`
2. Check `.env.local` DATABASE_URL is correct
3. Verify database and user exist: \`psql -l\`

### npm install Fails
\`\`\`bash
# Clear cache and reinstall
npm cache clean --force
rm -r node_modules package-lock.json
npm install
\`\`\`

### Authentication Issues
- Ensure `.env.local` JWT_SECRET is set
- Check cookies are enabled in browser
- Clear browser cookies and try logging in again

## 📞 Support

For issues:
1. Check the troubleshooting section above
2. Verify all environment variables are set correctly
3. Ensure PostgreSQL is running and accessible
4. Check browser console for error messages (F12)

## 📝 License

This project is provided as-is for educational and commercial use.
