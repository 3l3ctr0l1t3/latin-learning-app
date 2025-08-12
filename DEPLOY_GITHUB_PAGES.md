# Deploying to GitHub Pages

## Setup Complete! ✅

The project is now configured for GitHub Pages deployment. Follow these steps:

## 1. Update Configuration

### In `apps/web/package.json`:
Replace `YOUR_GITHUB_USERNAME` with your actual GitHub username:
```json
"homepage": "https://YOUR_GITHUB_USERNAME.github.io/latin2",
```

### In `apps/web/vite.config.ts`:
The base path is already set to `/latin2/`. If your repository has a different name, update it:
```ts
base: '/your-repo-name/',
```

## 2. Build and Deploy

### First Time Setup:
1. Make sure your repository is pushed to GitHub
2. Enable GitHub Pages in your repository settings:
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: gh-pages (will be created after first deploy)
   - Folder: / (root)

### Deploy Commands:
```bash
# From the root directory
cd apps/web

# Build and deploy to GitHub Pages
npm run deploy
```

This will:
1. Build the production version
2. Create/update the `gh-pages` branch
3. Push the built files to GitHub Pages

## 3. Access Your Site

After deployment (takes a few minutes), your site will be available at:
```
https://YOUR_GITHUB_USERNAME.github.io/latin2/
```

## 4. Updating the Site

To update your deployed site with new changes:
```bash
cd apps/web
npm run deploy
```

## Important Notes:

- The `gh-pages` branch is automatically managed - don't edit it manually
- The deployment process can take 5-10 minutes to reflect changes
- Make sure all your changes are committed before deploying
- The site uses client-side routing, so direct URL access might need a 404.html workaround

## Troubleshooting:

### If the site doesn't load:
1. Check that GitHub Pages is enabled in repository settings
2. Verify the homepage URL in package.json matches your GitHub username
3. Ensure the base path in vite.config.ts matches your repository name
4. Wait a few more minutes (initial deployment can take up to 20 minutes)

### If assets don't load:
- Make sure the `base` in vite.config.ts matches your repository name exactly
- Check the browser console for 404 errors to identify path issues