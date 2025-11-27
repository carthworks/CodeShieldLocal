"use client"

import Link from "next/link"
import { Shield, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    const navItems = [
        { name: "Features", href: "#what-you-get" },
        { name: "How It Works", href: "#how-it-works" },
        { name: "Architecture", href: "#architecture" },
        { name: "Use Cases", href: "#who-is-this-for" },
        { name: "Pricing", href: "#pricing" },
        { name: "Contact", href: "#contact" },
    ]

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
            <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-xl text-gray-900">CodeShield</span>
                    <span className="text-sm text-gray-500 hidden sm:inline">Local</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-6">
                    {navItems.map((item) => (
                        <a
                            key={item.name}
                            href={item.href}
                            className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                        >
                            {item.name}
                        </a>
                    ))}
                    <Link href="/scan/upload">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            Launch App
                        </Button>
                    </Link>
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 text-gray-700 hover:text-blue-600 transition-colors"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? (
                        <X className="w-6 h-6" />
                    ) : (
                        <Menu className="w-6 h-6" />
                    )}
                </button>
            </nav>

            {/* Mobile Navigation */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t bg-white">
                    <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
                        {navItems.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors py-2"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item.name}
                            </a>
                        ))}
                        <Link href="/scan/upload" onClick={() => setMobileMenuOpen(false)}>
                            <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                Launch App
                            </Button>
                        </Link>
                    </div>
                </div>
            )}
        </header>
    )
}
