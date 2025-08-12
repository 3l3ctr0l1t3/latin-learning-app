# Deploying to GitHub Pages

## Deployment via GitHub Actions ✅

This project uses GitHub Actions for automatic deployment to GitHub Pages.

## 1. Configuration

### In `apps/web/vite.config.ts`:
The base path should match your repository name:
```ts
base: '/latin-learning-app/',  // or your repo name
```

## 2. How It Works

The deployment is handled automatically by GitHub Actions:
- **Trigger**: Every push to the `main` branch
- **Workflow**: `.github/workflows/deploy.yml`
- **Process**: 
  1. Builds the app
  2. Uploads artifacts
  3. Deploys to GitHub Pages

## 3. GitHub Pages Setup

In your repository settings:
1. Go to Settings → Pages
2. Under "Build and deployment"
3. Source: **GitHub Actions** (not "Deploy from a branch")

## 4. Deployment

### Automatic Deployment:
Simply push your changes to the main branch:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

The GitHub Actions workflow will automatically:
1. Run TypeScript checks
2. Build the production version
3. Deploy to GitHub Pages

### Monitor Deployment:
Check the deployment status in the "Actions" tab of your GitHub repository.

## 5. Access Your Site

Your site is available at:
```
https://3l3ctr0l1t3.github.io/latin-learning-app/
```

Deployment usually takes 2-5 minutes after the workflow completes.

## Important Notes:

- The deployment is fully automated - no manual steps required
- GitHub Actions handles all the build and deployment process
- The site uses client-side routing, so direct URL access might need a 404.html workaround
- Make sure all your changes are committed and pushed before expecting deployment

## Troubleshooting:

### If the site doesn't load:
1. Check that GitHub Pages is enabled with "GitHub Actions" as source
2. Verify the workflow completed successfully in the Actions tab
3. Ensure the base path in vite.config.ts matches your repository name
4. Wait a few more minutes (initial deployment can take up to 10 minutes)

### If assets don't load:
- Make sure the `base` in vite.config.ts matches your repository name exactly
- Check the browser console for 404 errors to identify path issues

### To delete the old gh-pages branch (cleanup):
```bash
git push origin --delete gh-pages
```