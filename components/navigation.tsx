"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CheckCircle, Menu, X } from "lucide-react"
import { useState, useEffect } from "react"

const publicNavigation = [
  { name: "Home", href: "/" },
  { name: "Voice Converter", href: "/voice-converter" },
  { name: "Grammar Checker", href: "/grammar-checker" },
  { name: "Ambiguity Detector", href: "/ambiguity-detector" },
  { name: "Style Guide", href: "/style-guide" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "Settings", href: "/settings" },
]

export function Navigation() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const userEmail = localStorage.getItem("userEmail")
    const userName = localStorage.getItem("userName")
    if (userEmail) {
      setUser({ email: userEmail, name: userName || userEmail.split("@")[0] })
      if (userEmail === "admin@grammarpro.com") {
        setIsAdmin(true)
      }
    }
  }, [])

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      localStorage.removeItem("userEmail")
      localStorage.removeItem("userName")
      localStorage.removeItem("userId")
      setUser(null)
      setIsAdmin(false)
      window.location.href = "/"
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const navigation = [...publicNavigation, ...(user && isAdmin ? [{ name: "Admin", href: "/admin" }] : [])]

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <nav className="bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold text-foreground">GrammarPro</span>
            </Link>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-card border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <CheckCircle className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">GrammarPro</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href ? "text-primary" : "text-muted-foreground",
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground">Welcome, {user.name}</span>
                <Button variant="ghost" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary",
                    pathname === item.href ? "text-primary" : "text-muted-foreground",
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                {user ? (
                  <>
                    <span className="text-sm text-muted-foreground">Welcome, {user.name}</span>
                    <Button variant="ghost" onClick={handleSignOut}>
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" asChild>
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/signup">Sign Up</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
