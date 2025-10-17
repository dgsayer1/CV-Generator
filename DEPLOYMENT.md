# Deployment Guide

This document provides instructions for deploying the CV Generator application to various hosting platforms.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Building for Production](#building-for-production)
- [GitHub Pages](#github-pages)
- [Netlify](#netlify)
- [Vercel](#vercel)
- [Custom Server](#custom-server)
- [CI/CD Pipeline](#cicd-pipeline)

## Prerequisites

Before deploying, ensure you have:

- Node.js 18+ installed
- npm package manager
- Git repository initialized
- All tests passing locally

```bash
# Verify prerequisites
node --version  # Should be 18.x or higher
npm --version

# Run tests locally
npm run test:run
npm run test:e2e
```

## Building for Production

Create an optimized production build:

```bash
# Install dependencies
npm ci

# Run type checking
npx tsc --noEmit

# Run tests
npm run test:run
npm run test:e2e

# Build for production
npm run build
```

The build output will be in the `dist/` directory, containing:
- `index.html` - Main HTML file
- `assets/` - JavaScript, CSS, and other assets
- Static files from `public/` directory

Preview the production build locally:

```bash
npm run preview
# Opens at http://localhost:4173
```

## GitHub Pages

### Automatic Deployment (Recommended)

The repository includes automated GitHub Actions workflows for deployment.

#### Initial Setup

1. **Enable GitHub Pages**:
   - Go to repository Settings → Pages
   - Source: GitHub Actions
   - Branch: Not required (handled by Actions)

2. **Push to main branch**:
   ```bash
   git add .
   git commit -m "Initial deployment setup"
   git push origin main
   ```

3. **Monitor deployment**:
   - Check Actions tab in GitHub
   - Deployment URL will be available once complete

#### Workflow Details

The `.github/workflows/deploy.yml` workflow:
- Triggers on push to main and pull requests
- Runs TypeScript compilation check
- Executes unit tests (Vitest)
- Executes E2E tests (Playwright)
- Builds production bundle
- Deploys to GitHub Pages (main branch only)
- Uploads test artifacts on failure

### Manual Deployment

If you prefer manual deployment:

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Deploy using GitHub Pages action manually**:
   - Go to Actions tab
   - Run "Deploy static content to Pages" workflow
   - Select branch and confirm

3. **Alternative: gh-pages package**:
   ```bash
   npm install -D gh-pages

   # Add to package.json scripts:
   # "deploy": "gh-pages -d dist"

   npm run build
   npm run deploy
   ```

### Base Path Configuration

By default, the application is configured to work at the root path (`/`). If deploying to a repository path (e.g., `username.github.io/cv-generator`), update `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/cv-generator/',  // Replace with your repository name
  // ... rest of config
});
```

Or set environment variable during build:
```bash
VITE_BASE_PATH=/cv-generator/ npm run build
```

### Custom Domain

1. Add `CNAME` file to `public/` directory:
   ```
   your-domain.com
   ```

2. Configure DNS:
   - Add A records pointing to GitHub Pages IPs
   - Or add CNAME record pointing to `username.github.io`

3. Enable HTTPS in repository settings

4. Keep base path as `'/'` in `vite.config.ts` for custom domains

## Netlify

### Automatic Deployment via Git

1. **Sign in to Netlify** and click "New site from Git"

2. **Connect your repository**:
   - Choose GitHub/GitLab/Bitbucket
   - Select your repository
   - Authorize Netlify

3. **Configure build settings**:
   ```
   Build command: npm run build
   Publish directory: dist
   ```

4. **Environment variables** (if needed):
   - Add any required environment variables in Netlify UI

5. **Deploy site**:
   - Click "Deploy site"
   - Automatic deployments on every push to main

### Manual Deployment via CLI

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**:
   ```bash
   netlify login
   ```

3. **Deploy**:
   ```bash
   npm run build
   netlify deploy --prod --dir=dist
   ```

### Netlify Configuration File

Create `netlify.toml` in project root:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "geolocation=(), microphone=(), camera=()"
```

### Custom Domain on Netlify

1. Go to Site Settings → Domain Management
2. Add custom domain
3. Configure DNS as instructed by Netlify
4. Enable HTTPS (automatic with Let's Encrypt)

## Vercel

### Automatic Deployment via Git

1. **Sign in to Vercel** and click "New Project"

2. **Import repository**:
   - Connect GitHub/GitLab/Bitbucket
   - Select your repository

3. **Configure project**:
   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm ci
   ```

4. **Deploy**:
   - Click "Deploy"
   - Automatic deployments on every push

### Manual Deployment via CLI

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   npm run build
   vercel --prod
   ```

### Vercel Configuration File

Create `vercel.json` in project root:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm ci",
  "framework": "vite",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        }
      ]
    }
  ]
}
```

### Custom Domain on Vercel

1. Go to Project Settings → Domains
2. Add custom domain
3. Configure DNS records as instructed
4. HTTPS enabled automatically

## Custom Server

For deployment to your own server:

### Using Nginx

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Copy files to server**:
   ```bash
   scp -r dist/* user@server:/var/www/cv-generator/
   ```

3. **Configure Nginx**:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       root /var/www/cv-generator;
       index index.html;

       # Security headers
       add_header X-Frame-Options "DENY" always;
       add_header X-Content-Type-Options "nosniff" always;
       add_header Referrer-Policy "strict-origin-when-cross-origin" always;

       # Gzip compression
       gzip on;
       gzip_types text/css application/javascript application/json image/svg+xml;

       # Cache static assets
       location /assets/ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }

       # SPA routing
       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

4. **Enable HTTPS**:
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

### Using Apache

1. **Build and copy files** (same as above)

2. **Configure Apache** (`.htaccess`):
   ```apache
   # Security headers
   Header set X-Frame-Options "DENY"
   Header set X-Content-Type-Options "nosniff"
   Header set Referrer-Policy "strict-origin-when-cross-origin"

   # Gzip compression
   <IfModule mod_deflate.c>
       AddOutputFilterByType DEFLATE text/html text/css application/javascript
   </IfModule>

   # Cache static assets
   <FilesMatch "\.(css|js|jpg|jpeg|png|gif|svg|woff|woff2)$">
       Header set Cache-Control "max-age=31536000, public"
   </FilesMatch>

   # SPA routing
   <IfModule mod_rewrite.c>
       RewriteEngine On
       RewriteBase /
       RewriteRule ^index\.html$ - [L]
       RewriteCond %{REQUEST_FILENAME} !-f
       RewriteCond %{REQUEST_FILENAME} !-d
       RewriteRule . /index.html [L]
   </IfModule>
   ```

## CI/CD Pipeline

### GitHub Actions

The repository includes three GitHub Actions workflows:

#### 1. Deploy Workflow (`.github/workflows/deploy.yml`)

Runs on push to main and pull requests:
- Type checking
- Unit tests
- E2E tests
- Production build
- Deployment to GitHub Pages (main only)

#### 2. CI Workflow (`.github/workflows/ci.yml`)

Runs on all branches:
- Type checking
- Unit tests with coverage
- E2E tests
- Build verification
- Coverage reporting (Codecov)

#### 3. Static Workflow (`.github/workflows/static.yml`)

Manual workflow for static content deployment.

### Workflow Requirements

All workflows require:
- Tests passing (unit + E2E)
- TypeScript compilation successful
- Production build successful

### Monitoring Deployments

1. **Check workflow status**:
   - Go to Actions tab in GitHub
   - View workflow runs and logs

2. **Review test artifacts**:
   - Download artifacts from failed runs
   - Review Playwright reports
   - Check coverage reports

3. **Deployment URL**:
   - Available in deployment job output
   - Typically: `https://username.github.io/repository-name`

## Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm ci
npm run build
```

### Tests Fail in CI

```bash
# Run tests locally with CI environment
CI=true npm run test:run
CI=true npm run test:e2e
```

### GitHub Pages 404 Error

- Ensure base path is correct in `vite.config.ts`
- Check GitHub Pages settings (Settings → Pages)
- Verify `dist/` folder structure

### Deployment Permissions

- Check repository Settings → Actions → General
- Ensure workflow permissions allow Pages deployment
- Verify GITHUB_TOKEN has correct permissions

## Performance Optimization

### Build Optimization

Already configured in `vite.config.ts`:
- Code splitting
- Asset optimization
- Tree shaking
- Minification

### CDN Recommendations

For better global performance:
- Use Cloudflare (free tier available)
- Configure caching rules
- Enable auto-minification

## Security Checklist

- ✅ HTTPS enabled
- ✅ Security headers configured
- ✅ No sensitive data in client code
- ✅ Dependencies updated regularly
- ✅ CSP headers (if applicable)

## Support

For deployment issues:
1. Check GitHub Actions logs
2. Review this documentation
3. Create an issue in the repository

## Additional Resources

- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Netlify Documentation](https://docs.netlify.com/)
- [Vercel Documentation](https://vercel.com/docs)
