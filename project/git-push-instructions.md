# How to Push Your AU Calculator to GitHub

## Prerequisites
Make sure you have:
- Git installed on your computer
- Your GitHub repository URL: `https://github.com/12tribesofisrael/AU-Calculator.git`
- GitHub account credentials

## Step-by-Step Instructions

### 1. Initialize Git (if not already done)
```bash
git init
```

### 2. Add your GitHub repository as remote origin
```bash
git remote add origin https://github.com/12tribesofisrael/AU-Calculator.git
```

### 3. Add all files to staging
```bash
git add .
```

### 4. Commit your changes
```bash
git commit -m "Add AU Tradeline Calculator with GitHub Pages deployment"
```

### 5. Push to GitHub
```bash
git push -u origin main
```

## What happens after pushing:

1. **GitHub Actions will automatically run** - The workflow file I created (`.github/workflows/deploy.yml`) will automatically build and deploy your app
2. **GitHub Pages will be updated** - Your site will be available at: https://12tribesofisrael.github.io/AU-Calculator/
3. **Deployment takes 2-5 minutes** - Check the "Actions" tab in your GitHub repository to see the deployment progress

## If you encounter issues:

### Authentication Error
If you get authentication errors, you may need to:
- Use a Personal Access Token instead of password
- Set up SSH keys for GitHub

### Repository doesn't exist
Make sure the repository `AU-Calculator` exists in your GitHub account at:
https://github.com/12tribesofisrael/AU-Calculator

### Branch issues
If you get branch errors, try:
```bash
git branch -M main
git push -u origin main
```

## Verify deployment:
1. Go to your GitHub repository
2. Click on "Actions" tab to see if the deployment succeeded
3. Visit https://12tribesofisrael.github.io/AU-Calculator/ to see your live site

## Files that will be deployed:
- ✅ AU Tradeline Calculator app
- ✅ Responsive design for all devices  
- ✅ GitHub Pages configuration
- ✅ Automatic deployment workflow
- ✅ 404 error handling for SPA routing