#!/bin/bash

# CI/CD Setup Validation Script
# Run this to verify all CI/CD files are in place

set -e

echo "=================================="
echo "CI/CD Setup Validation"
echo "=================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check function
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        return 0
    else
        echo -e "${RED}✗${NC} $1 (missing)"
        return 1
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1/"
        return 0
    else
        echo -e "${RED}✗${NC} $1/ (missing)"
        return 1
    fi
}

ERRORS=0

echo "Checking GitHub Actions Workflows..."
check_file ".github/workflows/deploy.yml" || ((ERRORS++))
check_file ".github/workflows/ci.yml" || ((ERRORS++))
check_file ".github/workflows/static.yml" || ((ERRORS++))
echo ""

echo "Checking Configuration Files..."
check_file "vite.config.ts" || ((ERRORS++))
check_file "vitest.config.ts" || ((ERRORS++))
check_file ".gitignore" || ((ERRORS++))
check_file "package.json" || ((ERRORS++))
check_file "tsconfig.json" || ((ERRORS++))
echo ""

echo "Checking Documentation..."
check_file "README.md" || ((ERRORS++))
check_file "DEPLOYMENT.md" || ((ERRORS++))
check_file "CI_CD_SETUP.md" || ((ERRORS++))
check_file "CI_CD_COMPLETE.md" || ((ERRORS++))
check_file "QUICK_START_CICD.md" || ((ERRORS++))
check_file "TESTING.md" || ((ERRORS++))
echo ""

echo "Checking Test Structure..."
check_dir "tests/unit" || ((ERRORS++))
check_dir "tests/e2e" || ((ERRORS++))
echo ""

echo "Checking Source Files..."
check_dir "src" || ((ERRORS++))
check_file "index.html" || ((ERRORS++))
echo ""

echo "Running Package.json Validation..."
if command -v jq &> /dev/null; then
    if jq -e '.scripts.build' package.json > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} package.json build script exists"
    else
        echo -e "${RED}✗${NC} package.json build script missing"
        ((ERRORS++))
    fi

    if jq -e '.scripts["test:run"]' package.json > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} package.json test:run script exists"
    else
        echo -e "${RED}✗${NC} package.json test:run script missing"
        ((ERRORS++))
    fi

    if jq -e '.scripts["test:e2e"]' package.json > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} package.json test:e2e script exists"
    else
        echo -e "${RED}✗${NC} package.json test:e2e script missing"
        ((ERRORS++))
    fi
else
    echo -e "${YELLOW}!${NC} jq not installed, skipping package.json validation"
fi
echo ""

echo "Checking Git Configuration..."
if [ -d ".git" ]; then
    echo -e "${GREEN}✓${NC} Git repository initialized"

    if git remote -v | grep -q "origin"; then
        echo -e "${GREEN}✓${NC} Git remote 'origin' configured"
    else
        echo -e "${YELLOW}!${NC} Git remote 'origin' not configured"
        echo "  Run: git remote add origin https://github.com/USERNAME/REPO.git"
    fi
else
    echo -e "${YELLOW}!${NC} Git repository not initialized"
    echo "  Run: git init"
fi
echo ""

echo "Checking Node.js and npm..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓${NC} Node.js installed: $NODE_VERSION"

    NODE_MAJOR=$(echo $NODE_VERSION | cut -d. -f1 | sed 's/v//')
    if [ "$NODE_MAJOR" -ge 18 ]; then
        echo -e "${GREEN}✓${NC} Node.js version is 18+ (required)"
    else
        echo -e "${RED}✗${NC} Node.js version must be 18+ (current: $NODE_VERSION)"
        ((ERRORS++))
    fi
else
    echo -e "${RED}✗${NC} Node.js not installed"
    ((ERRORS++))
fi

if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓${NC} npm installed: $NPM_VERSION"
else
    echo -e "${RED}✗${NC} npm not installed"
    ((ERRORS++))
fi
echo ""

echo "Checking Dependencies..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} node_modules directory exists"
else
    echo -e "${YELLOW}!${NC} node_modules not found"
    echo "  Run: npm install"
fi
echo ""

echo "=================================="
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Initialize git: git init"
    echo "2. Commit files: git add . && git commit -m 'Add CI/CD setup'"
    echo "3. Push to GitHub: git remote add origin URL && git push -u origin main"
    echo "4. Enable GitHub Pages (Settings → Pages → GitHub Actions)"
    echo "5. Update badge URLs in README.md"
    echo ""
    echo "See QUICK_START_CICD.md for detailed instructions."
    exit 0
else
    echo -e "${RED}✗ $ERRORS error(s) found${NC}"
    echo ""
    echo "Please fix the errors above before proceeding."
    exit 1
fi
