# CodeShield Local

**Local, Privacy-First Code Security Auditor**

> Scan your entire codebase for security vulnerabilities — 100% locally. No cloud. No data leaves your laptop.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Ollama](https://img.shields.io/badge/Ollama-Required-orange.svg)](https://ollama.ai/)

---

## 🎯 What is CodeShield Local?

CodeShield Local is an **offline code security auditing tool** that combines:
- **Static Analysis**: Fast, rule-based vulnerability detection
- **LLM Reasoning**: Deep semantic analysis using local AI models (Ollama)

All processing happens **100% on your machine** — no cloud, no data upload, complete privacy.

### Key Features

✅ **Privacy-First**: All analysis runs locally  
✅ **Multi-Language**: JavaScript, TypeScript, Python, Java  
✅ **Hybrid Analysis**: Static rules + AI reasoning  
✅ **OWASP Coverage**: Detects OWASP Top 10 vulnerabilities  
✅ **Detailed Reports**: PDF, Markdown, JSON exports  
✅ **Code Viewer**: Syntax-highlighted vulnerable code  
✅ **Zero Dependencies**: No cloud APIs, no telemetry  

https://github.com/carthworks/CodeShieldLocal/blob/main/architecture_diagram.png
<img width="800" height="800" alt="image" src="https://github.com/user-attachments/assets/9185cf08-0f9a-4af5-a3f4-b153a989994a" />

---

## 🚀 Quick Start

### Prerequisites

1. **Node.js 18+**
   ```bash
   node --version  # Should be 18.0.0 or higher
   ```

2. **Ollama** (for LLM analysis)
   ```bash
   # Install Ollama from https://ollama.ai/
   ollama --version
   
   # Pull required models
   ollama pull deepseek-coder
   ollama pull codellama
   ollama pull llama3
   ```

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/codeshield-local.git
cd codeshield-local/app

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📖 Usage

### 1. Upload Your Codebase

- **Drag & drop** a ZIP file, or
- **Select a folder** from your file system

### 2. Configure Scan

- Choose languages to scan
- Enable/disable LLM analysis
- Select Ollama model

### 3. Review Results

- View vulnerabilities in interactive dashboard
- Filter by severity (Critical/High/Medium/Low)
- Click to see vulnerable code with highlights

### 4. Export Report

- **PDF**: Professional security audit report
- **Markdown**: Developer-friendly format
- **JSON**: Machine-readable data

---

## 🔍 What Does It Detect?

### Static Analysis (Fast)

- 🔑 **Hardcoded secrets** (API keys, passwords, tokens)
- 💉 **Injection vulnerabilities** (SQL, NoSQL, Command, LDAP)
- 🌐 **Cross-Site Scripting (XSS)**
- 🔓 **Authentication issues** (weak JWT, missing expiry)
- 🔐 **Cryptography flaws** (weak algorithms, hardcoded keys)
- 📝 **Sensitive data logging**
- 🌍 **CORS misconfigurations**

### LLM Analysis (Deep)

- 🧠 **Context-aware vulnerability detection**
- 📚 **Data flow analysis**
- 🎯 **Framework-specific issues**
- 💡 **Detailed explanations** in plain English
- 🔧 **Actionable fix suggestions** with code examples

---

## 📊 Example Report

```
╔════════════════════════════════════════════════════════════╗
║           SECURITY AUDIT REPORT                            ║
║           Project: MyApp                                   ║
║           Risk Score: 7.5/10 (High)                        ║
╚════════════════════════════════════════════════════════════╝

📈 Summary
  • Total Vulnerabilities: 15
  • Critical: 2
  • High: 5
  • Medium: 6
  • Low: 2

🔴 Critical Issues
  1. SQL Injection in /api/users.js:42
     → User input directly concatenated into query
     → Fix: Use parameterized queries

  2. Hardcoded AWS Credentials in /config/aws.js:8
     → Exposed AWS_SECRET_ACCESS_KEY
     → Fix: Use environment variables
```

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     PRESENTATION LAYER                       │
│  (Next.js 14 App Router + React + Tailwind + shadcn/ui)    │
├─────────────────────────────────────────────────────────────┤
│                     APPLICATION LAYER                        │
│         (Business Logic + State Management)                  │
├─────────────────────────────────────────────────────────────┤
│                       API LAYER                              │
│              (Next.js API Routes)                            │
├─────────────────────────────────────────────────────────────┤
│                     SERVICE LAYER                            │
│  ┌──────────────┬──────────────┬──────────────────────┐    │
│  │   Static     │     LLM      │    Report            │    │
│  │   Analysis   │   Reasoning  │    Generation        │    │
│  │   Engine     │   (Ollama)   │    Service           │    │
│  └──────────────┴──────────────┴──────────────────────┘    │
├─────────────────────────────────────────────────────────────┤
│                      DATA LAYER                              │
│         (File System + In-Memory Cache)                      │
└─────────────────────────────────────────────────────────────┘
```

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed system design.

---

## 📚 Documentation

- **[Architecture](ARCHITECTURE.md)**: System design and components
- **[API Specification](API_SPEC.md)**: REST API documentation
- **[Database Schema](DATABASE_SCHEMA.md)**: Data models and storage
- **[Development Plan](DEVELOPMENT_PLAN.md)**: Implementation roadmap
- **[Rules Specification](RULES_SPEC.md)**: Static analysis rules
- **[Prompts Specification](PROMPTS_SPEC.md)**: LLM prompt templates

---

## 🛠️ Technology Stack

| Component | Technology |
|-----------|-----------|
| **Frontend** | Next.js 14, React 18, TypeScript |
| **UI** | Tailwind CSS, shadcn/ui, Framer Motion |
| **Static Analysis** | Babel, Tree-sitter, Acorn |
| **LLM** | Ollama (local models) |
| **Code Parsing** | Esprima, Tree-sitter |
| **Reports** | jsPDF, Marked |
| **File Handling** | JSZip, Formidable |

---

## 🧪 Development

### Project Structure

```
app/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── scan/              # Scan pages
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── upload/           # Upload components
│   ├── dashboard/        # Dashboard components
│   └── viewer/           # Code viewer
├── lib/                   # Core logic
│   ├── analysis/         # Analysis engines
│   │   ├── static/       # Static analyzer
│   │   └── llm/          # LLM analyzer
│   ├── reports/          # Report generation
│   ├── store/            # In-memory store
│   └── types/            # TypeScript types
└── public/               # Static assets
```

### Running Tests

```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

### Building for Production

```bash
npm run build
npm start
```

---

## 🔐 Security & Privacy

### Local-Only Guarantee

✅ **No external API calls** — Everything runs on localhost  
✅ **No telemetry** — Zero analytics or tracking  
✅ **No data upload** — Your code never leaves your machine  
✅ **Temporary storage** — Files auto-deleted after scan  
✅ **Open source** — Audit the code yourself  

### Data Flow

1. You upload code → Stored in `/tmp/codeshield/`
2. Analysis runs locally → Results in memory
3. You export report → Saved to your Downloads
4. Cleanup → All temp files deleted

**Your code is yours. Period.**

---

## 🎯 Roadmap

### v1.0 (MVP) — Current

- [x] File upload & parsing
- [x] Static analysis engine
- [x] LLM integration (Ollama)
- [x] Vulnerability dashboard
- [x] Code viewer
- [x] Report export (PDF/MD/JSON)

### v1.1 (Next)

- [ ] Scan history & comparison
- [ ] Custom rule editor
- [ ] More languages (Go, Rust, C++)
- [ ] Performance optimizations
- [ ] Improved LLM prompts

### v2.0 (Future)

- [ ] CI/CD integration (GitHub Actions)
- [ ] Auto-fix PR generation
- [ ] Desktop app (Tauri)
- [ ] Team collaboration
- [ ] OWASP compliance reports

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Setup

```bash
# Fork and clone
git clone https://github.com/yourusername/codeshield-local.git

# Create feature branch
git checkout -b feature/amazing-feature

# Make changes and test
npm test

# Commit and push
git commit -m "Add amazing feature"
git push origin feature/amazing-feature

# Open Pull Request
```

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Ollama** for local LLM runtime
- **OWASP** for security guidelines
- **shadcn/ui** for beautiful components
- **Vercel** for Next.js framework

---

## 💬 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/codeshield-local/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/codeshield-local/discussions)
- **Email**: support@codeshield.local

---

## ⭐ Star History

If you find CodeShield Local useful, please star the repository!

---

**Built with ❤️ for developers who care about security and privacy.**
