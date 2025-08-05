#!/usr/bin/env python3
"""
LearnETF Setup Verification Script
Checks if all components are properly configured
"""

import os
import sys
from pathlib import Path

def check_file_exists(filepath, description):
    """Check if a file exists and print status"""
    if Path(filepath).exists():
        print(f"✅ {description}")
        return True
    else:
        print(f"❌ {description} - MISSING")
        return False

def check_directory_exists(dirpath, description):
    """Check if a directory exists and print status"""
    if Path(dirpath).exists():
        print(f"✅ {description}")
        return True
    else:
        print(f"❌ {description} - MISSING")
        return False

def main():
    print("🔍 LearnETF Setup Verification")
    print("=" * 40)
    
    all_good = True
    
    # Check server files
    print("\n📁 Server (Backend) Files:")
    all_good &= check_file_exists("server/app.py", "Flask application")
    all_good &= check_file_exists("server/requirements.txt", "Python dependencies")
    all_good &= check_file_exists("server/env.example", "Environment template")
    all_good &= check_file_exists("server/Procfile", "Deployment config")
    
    # Check client files
    print("\n📁 Client (Frontend) Files:")
    all_good &= check_file_exists("client/package.json", "Node.js dependencies")
    all_good &= check_file_exists("client/tailwind.config.js", "TailwindCSS config")
    all_good &= check_file_exists("client/postcss.config.js", "PostCSS config")
    all_good &= check_file_exists("client/src/App.js", "React main component")
    all_good &= check_file_exists("client/src/index.css", "Global styles")
    all_good &= check_file_exists("client/public/index.html", "HTML template")
    
    # Check components
    print("\n🧩 React Components:")
    all_good &= check_file_exists("client/src/components/Navbar.js", "Navigation component")
    all_good &= check_file_exists("client/src/components/StockSearch.js", "Stock search component")
    all_good &= check_file_exists("client/src/components/MetricsCard.js", "Metrics card component")
    all_good &= check_file_exists("client/src/components/AIChat.js", "AI chat component")
    
    # Check pages
    print("\n📄 React Pages:")
    all_good &= check_file_exists("client/src/pages/LandingPage.js", "Landing page")
    all_good &= check_file_exists("client/src/pages/Dashboard.js", "Dashboard page")
    all_good &= check_file_exists("client/src/pages/EducationPage.js", "Education page")
    
    # Check setup files
    print("\n⚙️ Setup Files:")
    all_good &= check_file_exists("setup.sh", "Unix setup script")
    all_good &= check_file_exists("setup.bat", "Windows setup script")
    all_good &= check_file_exists("README.md", "Documentation")
    
    print("\n" + "=" * 40)
    
    if all_good:
        print("🎉 All files are present! Setup is complete.")
        print("\n📋 Next steps:")
        print("1. Add your OpenAI API key to server/.env")
        print("2. Run: cd server && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt")
        print("3. Run: cd client && npm install")
        print("4. Start backend: cd server && python app.py")
        print("5. Start frontend: cd client && npm start")
        print("6. Open http://localhost:3000")
    else:
        print("❌ Some files are missing. Please check the setup.")
        sys.exit(1)

if __name__ == "__main__":
    main() 