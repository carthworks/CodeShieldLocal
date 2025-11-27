"use client"

import Link from "next/link"
import { Shield, Lock, Zap, FileCode, Brain, Download, ArrowRight, CheckCircle, AlertTriangle, Users, Code, Laptop, MessageSquare, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/layout/Header"

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            <Header />
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 opacity-70" />
                <div className="relative container mx-auto px-4 py-20 md:py-32">
                    <div className="text-center max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200 mb-6">
                            <Shield className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-gray-700">100% Local • Privacy-First • No Cloud</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                            Scan Your Code for
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Security Vulnerabilities</span>
                        </h1>

                        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                            A powerful, local-first security auditor that combines static analysis with AI reasoning.
                            Your code never leaves your machine.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/scan/upload">
                                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-6">
                                    Start Scanning
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </Link>
                            <a href="#how-it-works">
                                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                                    Learn More
                                </Button>
                            </a>
                        </div>

                        <div className="mt-12 flex items-center justify-center gap-8 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <span>15+ Security Rules</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <span>AI-Powered Analysis</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-600" />
                                <span>Export Reports</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Who Is This For? */}
            <section id="who-is-this-for" className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Who Is This For?</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            CodeShield Local is built for developers and teams who value privacy and security
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <Card className="border-2 hover:border-blue-500 transition-colors">
                            <CardHeader>
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                    <Code className="w-6 h-6 text-blue-600" />
                                </div>
                                <CardTitle>Developers</CardTitle>
                                <CardDescription>
                                    Catch security issues before they reach production. Integrate into your workflow seamlessly.
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className="border-2 hover:border-purple-500 transition-colors">
                            <CardHeader>
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                    <Users className="w-6 h-6 text-purple-600" />
                                </div>
                                <CardTitle>Security Teams</CardTitle>
                                <CardDescription>
                                    Perform thorough security audits without sending code to external services. Full control.
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card className="border-2 hover:border-green-500 transition-colors">
                            <CardHeader>
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                    <Laptop className="w-6 h-6 text-green-600" />
                                </div>
                                <CardTitle>Startups</CardTitle>
                                <CardDescription>
                                    Enterprise-grade security scanning without the enterprise price tag. Privacy-first approach.
                                </CardDescription>
                            </CardHeader>
                        </Card>
                    </div>
                </div>
            </section>

            {/* System Architecture */}
            <section id="architecture" className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">System Architecture</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            A hybrid approach combining static analysis with AI reasoning
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
                            <div className="grid md:grid-cols-3 gap-6">
                                {/* Upload Layer */}
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <FileCode className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <h3 className="font-bold text-lg mb-2">1. Upload</h3>
                                    <p className="text-sm text-gray-600">
                                        ZIP file extracted locally. File tree parsed. Languages detected.
                                    </p>
                                </div>

                                {/* Analysis Layer */}
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Zap className="w-8 h-8 text-purple-600" />
                                    </div>
                                    <h3 className="font-bold text-lg mb-2">2. Analyze</h3>
                                    <p className="text-sm text-gray-600">
                                        Static rules + AI verification. Parallel processing. Real-time progress.
                                    </p>
                                </div>

                                {/* Report Layer */}
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Download className="w-8 h-8 text-green-600" />
                                    </div>
                                    <h3 className="font-bold text-lg mb-2">3. Export</h3>
                                    <p className="text-sm text-gray-600">
                                        Professional reports. PDF, Markdown, JSON. Share with team.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="flex items-start gap-3">
                                    <Lock className="w-5 h-5 text-blue-600 mt-0.5" />
                                    <div>
                                        <h4 className="font-semibold text-blue-900 mb-1">Privacy Guarantee</h4>
                                        <p className="text-sm text-blue-800">
                                            All processing happens on your machine. No data is sent to external servers.
                                            LLM runs locally via Ollama.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section id="how-it-works" className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Four simple steps to comprehensive security analysis
                        </p>
                    </div>

                    <div className="max-w-3xl mx-auto space-y-8">
                        {[
                            {
                                step: "01",
                                title: "Upload Your Project",
                                description: "Drag and drop a ZIP file of your codebase. We support JavaScript, TypeScript, Python, Java, and more.",
                                icon: FileCode,
                                color: "blue"
                            },
                            {
                                step: "02",
                                title: "Configure Scan",
                                description: "Toggle AI analysis on/off. Choose which languages to scan. Set severity thresholds.",
                                icon: Zap,
                                color: "purple"
                            },
                            {
                                step: "03",
                                title: "Review Findings",
                                description: "Click any vulnerability to see the code, understand the risk, and get AI-powered fix suggestions.",
                                icon: Brain,
                                color: "pink"
                            },
                            {
                                step: "04",
                                title: "Export Report",
                                description: "Generate professional PDF, Markdown, or JSON reports. Share with your team or management.",
                                icon: Download,
                                color: "green"
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="flex gap-6 items-start">
                                <div className={`flex-shrink-0 w-16 h-16 bg-${item.color}-100 rounded-full flex items-center justify-center`}>
                                    <item.icon className={`w-8 h-8 text-${item.color}-600`} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-sm font-mono text-gray-400">{item.step}</span>
                                        <h3 className="text-2xl font-bold text-gray-900">{item.title}</h3>
                                    </div>
                                    <p className="text-gray-600">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* What You Will Get */}
            <section id="what-you-get" className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">What You Will Get</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Comprehensive security insights delivered in multiple formats
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {[
                            { icon: Shield, title: "15+ Security Rules", desc: "Detect secrets, injections, XSS, weak crypto, and more" },
                            { icon: Brain, title: "AI-Powered Verification", desc: "Local LLM validates findings and suggests fixes" },
                            { icon: FileCode, title: "Interactive Code Viewer", desc: "Click findings to see highlighted vulnerable code" },
                            { icon: Download, title: "Professional Reports", desc: "Export as PDF, Markdown, or JSON" },
                            { icon: Zap, title: "Real-Time Progress", desc: "Watch your scan progress with live updates" },
                            { icon: Lock, title: "100% Private", desc: "Your code never leaves your machine" }
                        ].map((feature, idx) => (
                            <Card key={idx} className="bg-white/80 backdrop-blur-sm border-2 hover:border-blue-500 transition-all hover:shadow-lg">
                                <CardHeader>
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                                        <feature.icon className="w-6 h-6 text-white" />
                                    </div>
                                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                                    <CardDescription>{feature.desc}</CardDescription>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Honest Limitations */}
            <section id="limitations" className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">Honest Limitations</h2>
                            <p className="text-xl text-gray-600">
                                We believe in transparency. Here's what CodeShield Local can't do (yet)
                            </p>
                        </div>

                        <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-8">
                            <div className="flex items-start gap-3 mb-6">
                                <AlertTriangle className="w-6 h-6 text-orange-600 mt-1" />
                                <div>
                                    <h3 className="font-bold text-lg text-orange-900 mb-2">Current Limitations</h3>
                                    <ul className="space-y-3 text-orange-800">
                                        <li className="flex items-start gap-2">
                                            <span className="text-orange-600 mt-1">•</span>
                                            <span><strong>In-Memory Storage:</strong> Scan data is lost on server restart (SQLite coming soon)</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-orange-600 mt-1">•</span>
                                            <span><strong>Limited Rules:</strong> 15 rules currently (expanding to 50+)</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-orange-600 mt-1">•</span>
                                            <span><strong>No CI/CD Integration:</strong> Manual uploads only (CLI tool planned)</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-orange-600 mt-1">•</span>
                                            <span><strong>Single User:</strong> No multi-user support or authentication</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-orange-600 mt-1">•</span>
                                            <span><strong>Large Projects:</strong> May be slow on 1000+ file projects</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="mt-6 p-4 bg-white rounded-lg border border-orange-200">
                                <p className="text-sm text-gray-700">
                                    <strong>Good News:</strong> This is an MVP. We're actively working on addressing these limitations.
                                    Your feedback helps us prioritize!
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section id="pricing" className="py-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Pricing</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Simple, transparent, and free forever
                        </p>
                    </div>

                    <div className="max-w-4xl mx-auto">
                        <Card className="border-2 border-blue-500 shadow-2xl">
                            <CardHeader className="text-center pb-8 pt-12">
                                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Shield className="w-10 h-10 text-white" />
                                </div>
                                <CardTitle className="text-4xl mb-2">Free Forever</CardTitle>
                                <div className="text-5xl font-bold text-gray-900 mb-2">
                                    $0
                                    <span className="text-2xl text-gray-500 font-normal">/month</span>
                                </div>
                                <CardDescription className="text-lg">
                                    100% Open Source • No Hidden Costs • No Credit Card Required
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="pb-12">
                                <div className="space-y-4 mb-8">
                                    {[
                                        "Unlimited scans",
                                        "15+ security rules (expanding)",
                                        "AI-powered analysis with local LLM",
                                        "Interactive code viewer",
                                        "Export reports (PDF, Markdown, JSON)",
                                        "100% privacy - your code never leaves your machine",
                                        "No telemetry or tracking",
                                        "Full source code access",
                                        "Community support",
                                        "Self-hosted on your infrastructure"
                                    ].map((feature, idx) => (
                                        <div key={idx} className="flex items-start gap-3">
                                            <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-700">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <Link href="/scan/upload" className="block">
                                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6">
                                        Get Started Now
                                        <ArrowRight className="ml-2 w-5 h-5" />
                                    </Button>
                                </Link>

                                <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
                                    <h4 className="font-semibold text-blue-900 mb-2">Why Free?</h4>
                                    <p className="text-sm text-blue-800">
                                        CodeShield Local is open source because we believe security tools should be accessible to everyone.
                                        Your code is your most valuable asset - you shouldn't have to send it to external services to keep it secure.
                                    </p>
                                </div>

                                <div className="mt-6 text-center">
                                    <p className="text-sm text-gray-500">
                                        Want to support the project? ⭐ Star us on GitHub or contribute to the codebase!
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Get In Touch */}
            <section id="contact" className="py-20 bg-gray-900 text-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-4xl font-bold mb-4">Get In Touch</h2>
                        <p className="text-xl text-gray-300 mb-12">
                            Have questions? Found a bug? Want to contribute? We'd love to hear from you!
                        </p>

                        <div className="grid md:grid-cols-2 gap-8 mb-12">
                            <Card className="bg-gray-800 border-gray-700">
                                <CardHeader>
                                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                                        <Code className="w-6 h-6 text-white" />
                                    </div>
                                    <CardTitle className="text-white">Open Source</CardTitle>
                                    <CardDescription className="text-gray-400">
                                        CodeShield Local is open source. Contribute on GitHub, report issues, or suggest features.
                                    </CardDescription>
                                    <div className="pt-4">
                                        <Button variant="outline" className="w-full">
                                            View on GitHub
                                        </Button>
                                    </div>
                                </CardHeader>
                            </Card>

                            <Card className="bg-gray-800 border-gray-700">
                                <CardHeader>
                                    <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                                        <MessageSquare className="w-6 h-6 text-white" />
                                    </div>
                                    <CardTitle className="text-white">Feedback</CardTitle>
                                    <CardDescription className="text-gray-400">
                                        Share your experience, request features, or report bugs. Your input shapes the roadmap.
                                    </CardDescription>
                                    <div className="pt-4">
                                        <Button variant="outline" className="w-full">
                                            Send Feedback
                                        </Button>
                                    </div>
                                </CardHeader>
                            </Card>
                        </div>

                        <div className="border-t border-gray-800 pt-8">
                            <p className="text-gray-400 text-sm">
                                Built with ❤️ for developers who value privacy and security
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6">
                        Ready to Secure Your Code?
                    </h2>
                    <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
                        Start scanning in seconds. No signup required. 100% free and open source.
                    </p>
                    <Link href="/scan/upload">
                        <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6">
                            Start Your First Scan
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    )
}
