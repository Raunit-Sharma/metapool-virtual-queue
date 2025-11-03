# METAPOOL Virtual Queue - Deploy Script
# Run this script to initialize git and prepare for deployment

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  METAPOOL Deployment Preparation" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is installed
Write-Host "[1/5] Checking Git installation..." -ForegroundColor Yellow
$gitInstalled = $false
try {
    $null = git --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        $gitVersion = git --version
        Write-Host "[OK] Git is installed: $gitVersion" -ForegroundColor Green
        $gitInstalled = $true
    }
} catch {
    Write-Host "[ERROR] Git is not installed" -ForegroundColor Red
}

if (-not $gitInstalled) {
    Write-Host "[ERROR] Please install Git first: https://git-scm.com/download/win" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Initialize Git repository
Write-Host "[2/5] Initializing Git repository..." -ForegroundColor Yellow
if (Test-Path ".git") {
    Write-Host "[OK] Git repository already initialized" -ForegroundColor Green
} else {
    git init
    Write-Host "[OK] Git repository initialized" -ForegroundColor Green
}

Write-Host ""

# Check .gitignore
Write-Host "[3/5] Checking .gitignore..." -ForegroundColor Yellow
if (Test-Path ".gitignore") {
    Write-Host "[OK] .gitignore exists" -ForegroundColor Green
} else {
    Write-Host "[WARNING] .gitignore not found" -ForegroundColor Yellow
}

Write-Host ""

# Add all files
Write-Host "[4/5] Staging files for commit..." -ForegroundColor Yellow
git add .
Write-Host "[OK] Files staged" -ForegroundColor Green

Write-Host ""

# Create initial commit
Write-Host "[5/5] Creating initial commit..." -ForegroundColor Yellow
git commit -m "Initial commit - METAPOOL Virtual Queue v1.0"
Write-Host "[OK] Initial commit created" -ForegroundColor Green

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Repository Ready for Deployment!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "NEXT STEPS:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Create a GitHub repository:" -ForegroundColor White
Write-Host "   - Go to: https://github.com/new" -ForegroundColor Gray
Write-Host "   - Name: metapool-virtual-queue" -ForegroundColor Gray
Write-Host "   - Make it Public or Private" -ForegroundColor Gray
Write-Host "   - DO NOT initialize with README" -ForegroundColor Gray
Write-Host ""

Write-Host "2. Push your code to GitHub:" -ForegroundColor White
Write-Host "   Run these commands (replace YOUR_USERNAME):" -ForegroundColor Gray
Write-Host ""
Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/metapool-virtual-queue.git" -ForegroundColor Yellow
Write-Host "   git branch -M main" -ForegroundColor Yellow
Write-Host "   git push -u origin main" -ForegroundColor Yellow
Write-Host ""

Write-Host "3. Deploy to Vercel:" -ForegroundColor White
Write-Host "   - Go to: https://vercel.com/new" -ForegroundColor Gray
Write-Host "   - Import your GitHub repository" -ForegroundColor Gray
Write-Host "   - Add environment variables:" -ForegroundColor Gray
Write-Host "     VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY" -ForegroundColor Gray
Write-Host "   - Click Deploy!" -ForegroundColor Gray
Write-Host ""

Write-Host "For detailed instructions, see:" -ForegroundColor Cyan
Write-Host "   - DEPLOYMENT_GUIDE.md (complete guide)" -ForegroundColor White
Write-Host "   - QUICK_DEPLOY.md (quick checklist)" -ForegroundColor White
Write-Host ""

Write-Host "Your Supabase credentials are in .env file" -ForegroundColor Cyan
Write-Host ""

Write-Host "Need help? Check DEPLOYMENT_GUIDE.md" -ForegroundColor Yellow
Write-Host ""
