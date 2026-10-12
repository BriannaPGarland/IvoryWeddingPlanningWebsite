# 🚀 Step-by-Step GitHub Upload & Export Guide

This directory contains everything you need to upload the **Ivory Luxury Wedding OS** to your personal or organization GitHub account.

---

## 🛠 Option 1: Git Command Line (Recommended & Fastest)

If you have Git installed on your computer, follow these simple terminal steps:

### Step 1: Create a New Repository on GitHub
1. Log in to [GitHub](https://github.com/)
2. Click the **+** (plus icon) in the top right corner and select **New repository**
3. Repository name: e.g. `ivory-wedding-os`
4. Description: `Luxury Wedding Intelligence & Financial Operating System with AI Contract Parser and Pinterest Vision Sync`
5. Set visibility to **Public** or **Private**
6. **Do NOT** check "Add a README file" (as we already have a full, high-fidelity README prepared for you)
7. Click **Create repository**

### Step 2: Push from your Local Machine
Open your terminal inside the project directory:

```bash
# 1. Initialize git repository
git init

# 2. Add all project files
git add .

# 3. Create initial commit
git commit -m "feat: Initial commit of Ivory Luxury Wedding Intelligence OS"

# 4. Set branch to main
git branch -M main

# 5. Connect to your GitHub repository (replace with your repo URL)
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/ivory-wedding-os.git

# 6. Push code to GitHub
git push -u origin main
```

---

## 🌐 Option 2: Upload Files via GitHub Web UI

If you prefer using a web browser without the terminal:

1. Create a new repository on GitHub (check "Add a README file" this time to initialize it).
2. Click the **Add file** button at the top right of the file list and select **Upload files**.
3. Drag and drop all project files and folders (`src`, `docs`, `package.json`, `README.md`, etc.) into the GitHub upload area.
4. In the commit message box, enter: `Initial commit of Ivory Wedding OS`.
5. Click **Commit changes**.

---

## 🖥 Option 3: GitHub Desktop App

1. Open **GitHub Desktop**.
2. Click **File** > **Add Local Repository...** (or press `Ctrl+O` / `Cmd+O`).
3. Select this folder as the Local Path.
4. Click **Add Repository**.
5. Click **Publish repository** in the top bar to push it straight to your GitHub account!

---

## 🔒 Security & Secret Scanning Guaranteed

This repository has been audited and hardened against secret detection:
* **Zero Hardcoded Secrets**: All live API keys and sensitive project configs (including `firebase-applet-config.json` and `.env`) are ignored via `.gitignore` and excluded from git tracking and zip exports.
* **Safe Template Files**: Only safe example templates (`.env.example` and `firebase-applet-config.example.json`) with dummy placeholders are included in the repository.
* **Clean Git History**: All commits in this repository contain zero credentials or tokens.

> **💡 Note for Existing GitHub Repositories**:
> If GitHub previously rejected your push or flagged a secret on an earlier upload, simply force-push this clean commit over your branch:
> ```bash
> git push -u origin main --force
> ```
> This immediately replaces the old commit history on GitHub with this completely clean, sanitized release.

---

## 📦 What is Included in this Repository:
* `README.md` — Complete master guide with 5 visual mockups, architecture diagrams, and full feature breakdowns.
* `docs/screenshots/` — 5 high-fidelity vector preview screenshots:
  - `dashboard-preview.svg` (Executive Command Center)
  - `budget-forecaster.svg` (Financial Contingency Engine)
  - `contract-viewer.svg` (PDF Contract Viewer)
  - `vision-board.svg` (10-Category Pinterest Sync)
  - `chrome-extension.svg` (Chrome Extension Simulator)
* `.github/workflows/ci.yml` — Preconfigured GitHub Actions CI pipeline for automated testing and builds.
* `LICENSE` — Official open-source MIT License.
* `CONTRIBUTING.md` — Guidelines for future community contributions.
* `src/` — Complete, strongly typed React 19 + TypeScript application codebase.
* `server.ts` — Full-stack dev and production Express proxy server.
