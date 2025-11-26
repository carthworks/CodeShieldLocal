import Link from "next/link";
import { Shield, Upload, Search, FileCode, Download } from "lucide-react";

export default function Home() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Header */}
            <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Shield className="w-8 h-8 text-blue-600" />
                        <h1 className="text-2xl font-bold text-gray-900">CodeShield Local</h1>
                    </div>
                    <nav className="flex gap-6">
                        <Link href="/scan/upload" className="text-gray-600 hover:text-blue-600 transition">
                            Start Scan
                        </Link>
                        <Link href="#features" className="text-gray-600 hover:text-blue-600 transition">
                            Features
                        </Link>
                        <Link href="#docs" className="text-gray-600 hover:text-blue-600 transition">
                            Docs
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className="container mx-auto px-4 py-20 text-center">
                <div className="max-w-4xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full mb-6">
                        <Shield className="w-4 h-4" />
                        <span className="text-sm font-medium">100% Local • Privacy-First • No Cloud</span>
                    </div>

                    <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                        Scan Your Code for
                        <span className="text-blue-600"> Security Vulnerabilities</span>
                    </h2>

                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                        Detect OWASP Top 10 vulnerabilities using hybrid static analysis + AI reasoning.
                        All processing happens locally on your machine.
                    </p>

                    <div className="flex gap-4 justify-center">
                        <Link
                            href="/scan/upload"
                            className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
                        >
                            Start Scanning
                        </Link>
                        <Link
                            href="#how-it-works"
                            className="px-8 py-4 bg-white text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition border border-gray-200"
                        >
                            Learn More
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="container mx-auto px-4 py-20">
                <h3 className="text-3xl font-bold text-center mb-12">Why CodeShield Local?</h3>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <FeatureCard
                        icon={<Shield className="w-8 h-8 text-blue-600" />}
                        title="100% Local"
                        description="All analysis runs on your machine. No cloud, no data upload, complete privacy."
                    />
                    <FeatureCard
                        icon={<Search className="w-8 h-8 text-purple-600" />}
                        title="AI-Powered"
                        description="Deep semantic analysis using local LLM models (Ollama) for context-aware detection."
                    />
                    <FeatureCard
                        icon={<FileCode className="w-8 h-8 text-green-600" />}
                        title="Multi-Language"
                        description="Supports JavaScript, TypeScript, Python, and Java with 22+ security rules."
                    />
                    <FeatureCard
                        icon={<Download className="w-8 h-8 text-orange-600" />}
                        title="Actionable Reports"
                        description="Export professional PDF, Markdown, or JSON reports with fix suggestions."
                    />
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="container mx-auto px-4 py-20 bg-white rounded-2xl shadow-xl my-12">
                <h3 className="text-3xl font-bold text-center mb-12">How It Works</h3>

                <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    <Step number="1" title="Upload" description="Upload your codebase as a ZIP file or select a folder" />
                    <Step number="2" title="Scan" description="Static analysis + LLM reasoning detects vulnerabilities" />
                    <Step number="3" title="Fix" description="Review findings, get explanations, and export reports" />
                </div>
            </section>

            {/* CTA Section */}
            <section className="container mx-auto px-4 py-20 text-center">
                <div className="max-w-2xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
                    <h3 className="text-3xl font-bold mb-4">Ready to Secure Your Code?</h3>
                    <p className="text-blue-100 mb-8">
                        Start scanning your codebase for vulnerabilities in seconds.
                    </p>
                    <Link
                        href="/scan/upload"
                        className="inline-block px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg"
                    >
                        Start Free Scan
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t bg-gray-50 py-8">
                <div className="container mx-auto px-4 text-center text-gray-600">
                    <p>Built with ❤️ for developers who care about security and privacy.</p>
                    <p className="text-sm mt-2">CodeShield Local v1.0 - MIT License</p>
                </div>
            </footer>
        </main>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
        <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition">
            <div className="mb-4">{icon}</div>
            <h4 className="text-xl font-semibold mb-2">{title}</h4>
            <p className="text-gray-600">{description}</p>
        </div>
    );
}

function Step({ number, title, description }: { number: string; title: string; description: string }) {
    return (
        <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                {number}
            </div>
            <h4 className="text-lg font-semibold mb-2">{title}</h4>
            <p className="text-gray-600 text-sm">{description}</p>
        </div>
    );
}
