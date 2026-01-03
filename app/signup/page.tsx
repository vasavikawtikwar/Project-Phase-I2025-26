"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { CheckCircle, Eye, EyeOff, Check, X, AlertCircle } from "lucide-react"
import { validateEmail, validatePassword, validateName, getPasswordStrength } from "@/lib/validation"

export default function Signup() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const [nameValidation, setNameValidation] = useState({ isValid: true, message: "" })
  const [emailValidation, setEmailValidation] = useState({ isValid: true, message: "" })
  const [passwordValidation, setPasswordValidation] = useState({ isValid: true, message: "" })
  const [confirmPasswordValidation, setConfirmPasswordValidation] = useState({ isValid: true, message: "" })
  const [emailExists, setEmailExists] = useState(false)

  const router = useRouter()

  useEffect(() => {
    if (fullName) {
      setNameValidation(validateName(fullName))
    }
  }, [fullName])

  useEffect(() => {
    if (email) {
      const validation = validateEmail(email)
      setEmailValidation(validation)

      if (validation.isValid) {
        checkEmailExists(email)
      }
    }
  }, [email])

  useEffect(() => {
    if (password) {
      setPasswordValidation(validatePassword(password))
    }
  }, [password])

  useEffect(() => {
    if (confirmPassword) {
      if (password !== confirmPassword) {
        setConfirmPasswordValidation({ isValid: false, message: "Passwords do not match" })
      } else {
        setConfirmPasswordValidation({ isValid: true, message: "Passwords match" })
      }
    }
  }, [password, confirmPassword])

  const checkEmailExists = async (emailToCheck: string) => {
    try {
      const response = await fetch(`/api/auth/check-email?email=${encodeURIComponent(emailToCheck)}`)
      const data = await response.json()

      if (data.exists) {
        setEmailExists(true)
        setEmailValidation({ isValid: false, message: "This email is already registered" })
      } else {
        setEmailExists(false)
      }
    } catch (err) {
      setEmailExists(false)
    }
  }

  const passwordStrength = getPasswordStrength(password)

  const isFormValid = () => {
    return (
      nameValidation.isValid &&
      emailValidation.isValid &&
      !emailExists &&
      passwordValidation.isValid &&
      confirmPasswordValidation.isValid &&
      fullName &&
      email &&
      password &&
      confirmPassword
    )
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!isFormValid()) {
      setError("Please fix all validation errors before submitting")
      setLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          fullName,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to create account")
      } else {
        localStorage.setItem("userEmail", email)
        localStorage.setItem("userName", fullName)
        setSuccess(true)
        setTimeout(() => {
          router.push("/")
        }, 1500)
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <Card className="border-border/50 bg-card">
            <CardContent className="pt-6 text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-primary to-accent">
                <Check className="h-8 w-8 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Welcome to GrammarPro!</h2>
              <p className="text-muted-foreground mb-6">Your account is ready. Redirecting to the grammar checker...</p>
              <Button asChild className="w-full bg-primary hover:bg-primary/90">
                <Link href="/">Go to Grammar Checker</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-background flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold gradient-text">GrammarPro</span>
          </Link>
        </div>

        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Create Your Account</CardTitle>
            <CardDescription>Join thousands perfecting their grammar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignup} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className={`w-full pr-10 bg-input border-border focus:border-primary focus:ring-1 focus:ring-primary/50 ${!nameValidation.isValid && fullName ? "border-destructive" : nameValidation.isValid && fullName ? "border-primary" : ""}`}
                  />
                  {fullName && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {nameValidation.isValid ? (
                        <Check className="h-4 w-4 text-primary" />
                      ) : (
                        <X className="h-4 w-4 text-destructive" />
                      )}
                    </div>
                  )}
                </div>
                {!nameValidation.isValid && fullName && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {nameValidation.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={`w-full pr-10 bg-input border-border focus:border-primary focus:ring-1 focus:ring-primary/50 ${!emailValidation.isValid && email ? "border-destructive" : emailValidation.isValid && email && !emailExists ? "border-primary" : ""}`}
                  />
                  {email && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {emailValidation.isValid && !emailExists ? (
                        <Check className="h-4 w-4 text-primary" />
                      ) : (
                        <X className="h-4 w-4 text-destructive" />
                      )}
                    </div>
                  )}
                </div>
                {!emailValidation.isValid && email && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {emailValidation.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={`w-full pr-10 bg-input border-border focus:border-primary focus:ring-1 focus:ring-primary/50 ${!passwordValidation.isValid && password ? "border-destructive" : passwordValidation.isValid && password ? "border-primary" : ""}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>

                {password && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span>Password Strength:</span>
                      <span
                        className={`font-medium ${passwordStrength.strength >= 80 ? "text-primary" : passwordStrength.strength >= 60 ? "text-accent" : passwordStrength.strength >= 40 ? "text-yellow-500" : "text-destructive"}`}
                      >
                        {passwordStrength.label}
                      </span>
                    </div>
                    <Progress value={passwordStrength.strength} className="h-2" />
                  </div>
                )}

                {!passwordValidation.isValid && password && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {passwordValidation.message}
                  </p>
                )}

                <div className="text-xs text-muted-foreground space-y-1 mt-3">
                  <p>Password must contain:</p>
                  <ul className="space-y-1 ml-4">
                    <li className={`flex items-center gap-2 ${/[A-Z]/.test(password) ? "text-primary" : ""}`}>
                      {/[A-Z]/.test(password) ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      One uppercase letter
                    </li>
                    <li className={`flex items-center gap-2 ${/[a-z]/.test(password) ? "text-primary" : ""}`}>
                      {/[a-z]/.test(password) ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      One lowercase letter
                    </li>
                    <li className={`flex items-center gap-2 ${/\d/.test(password) ? "text-primary" : ""}`}>
                      {/\d/.test(password) ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      One number
                    </li>
                    <li
                      className={`flex items-center gap-2 ${/[!@#$%^&*(),.?":{}|<>]/.test(password) ? "text-primary" : ""}`}
                    >
                      {/[!@#$%^&*(),.?":{}|<>]/.test(password) ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <X className="h-3 w-3" />
                      )}
                      One special character
                    </li>
                    <li className={`flex items-center gap-2 ${password.length >= 8 ? "text-primary" : ""}`}>
                      {password.length >= 8 ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                      At least 8 characters
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className={`w-full pr-10 bg-input border-border focus:border-primary focus:ring-1 focus:ring-primary/50 ${!confirmPasswordValidation.isValid && confirmPassword ? "border-destructive" : confirmPasswordValidation.isValid && confirmPassword ? "border-primary" : ""}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                  {confirmPassword && (
                    <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                      {confirmPasswordValidation.isValid ? (
                        <Check className="h-4 w-4 text-primary" />
                      ) : (
                        <X className="h-4 w-4 text-destructive" />
                      )}
                    </div>
                  )}
                </div>
                {confirmPassword && (
                  <p
                    className={`text-xs flex items-center gap-1 ${confirmPasswordValidation.isValid ? "text-primary" : "text-destructive"}`}
                  >
                    {confirmPasswordValidation.isValid ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <AlertCircle className="h-3 w-3" />
                    )}
                    {confirmPasswordValidation.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground font-bold py-2 h-10"
                disabled={loading || !isFormValid()}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline font-semibold">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
