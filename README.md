# AC Power Calculator

React app to estimate your air conditioner's yearly electricity cost.

## Quick Start

```bash
npm install
npm run dev
```

## Deploy to GitHub Pages

### Step 1: Update `vite.config.js`
Change `base` to match your repository name:
```js
base: '/ac-calculator/',  // if repo is https://github.com/username/ac-calculator
```

### Step 2: Push to GitHub
Create a repo, push this code to the `main` branch.

### Step 3: Enable GitHub Actions
1. Go to **Settings → Pages** in your repo
2. Under **Build and deployment**, select **Source: GitHub Actions**
3. The workflow in `.github/workflows/deploy.yml` will build and deploy automatically on every push to `main`

Your site will be live at `https://username.github.io/ac-calculator/`
