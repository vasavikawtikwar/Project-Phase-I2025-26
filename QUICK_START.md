# Quick Start Guide

Get up and running in 5 minutes!

## For Windows Users

### 1. Install Node.js
- Download from https://nodejs.org/
- Choose LTS version
- Run installer and follow prompts
- Accept all defaults

### 2. Install PostgreSQL
- Download from https://www.postgresql.org/download/windows/
- Run installer
- Remember the password you set for "postgres" user
- Default port: 5432

### 3. Setup Project

Open PowerShell as Administrator:

\`\`\`powershell
# Navigate to project folder
cd path\to\realtimegrammar1

# Install dependencies
npm install

# Create environment file
New-Item -Path ".env.local" -ItemType File

# Edit .env.local with Notepad
notepad .env.local
\`\`\`

Add this to `.env.local`:
\`\`\`
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/grammar_checker"
JWT_SECRET="my_super_secret_key_32_characters_minimum_1234567890"
NODE_ENV="development"
\`\`\`

### 4. Create Database

Open PowerShell:
\`\`\`powershell
psql -U postgres
\`\`\`

Enter password, then:
\`\`\`sql
CREATE DATABASE grammar_checker;
CREATE USER grammar_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE grammar_checker TO grammar_user;
\\q
\`\`\`

### 5. Run Migrations

\`\`\`powershell
psql -U grammar_user -d grammar_checker -f scripts/03-consolidated-schema.sql
\`\`\`

### 6. Start Application

\`\`\`powershell
npm run dev
\`\`\`

Visit: http://localhost:3000

---

## For macOS/Linux Users

\`\`\`bash
# Install dependencies
npm install

# Create environment file
touch .env.local

# Edit with your editor
nano .env.local
\`\`\`

Add environment variables, then:

\`\`\`bash
# Create database
psql -U postgres << EOF
CREATE DATABASE grammar_checker;
CREATE USER grammar_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE grammar_checker TO grammar_user;
EOF

# Run migrations
psql -U grammar_user -d grammar_checker -f scripts/03-consolidated-schema.sql

# Start app
npm run dev
\`\`\`

---

## Verify Everything Works

1. Open http://localhost:3000 in browser
2. Click "Sign Up"
3. Create an account with any email
4. Click "Grammar Checker"
5. Type: "He dont know nothing"
6. Click "Check Grammar" - should show errors
7. Click "Apply" - should fix the text

✅ You're ready to go!
