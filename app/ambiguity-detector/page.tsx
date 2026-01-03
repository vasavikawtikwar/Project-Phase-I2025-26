"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { AlertCircle, Loader2, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AmbiguityIssue {
  type: string
  description: string
  suggestion: string
}

interface SentenceAmbiguity {
  sentence: string
  ambiguities: AmbiguityIssue[]
  clarity: number
}

export default function AmbiguityDetector() {
  const [text, setText] = useState("")
  const [analysis, setAnalysis] = useState<SentenceAmbiguity[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { toast } = useToast()

  const detectAmbiguities = async (inputText: string) => {
    if (!inputText.trim()) {
      setAnalysis([])
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/ambiguity-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      })

      const data = await response.json()
      setAnalysis(data.analyses || [])
    } catch (error) {
      console.error("Ambiguity detection error:", error)
      toast({ title: "Error", description: "Failed to detect ambiguities", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const saveAnalysis = async () => {
    setSaving(true)
    try {
      await fetch("/api/save-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          analysisType: "ambiguity",
          results: analysis,
          score: Math.round(analysis.reduce((sum, a) => sum + a.clarity, 0) / analysis.length),
        }),
      })
      toast({ title: "Success", description: "Analysis saved to history" })
    } catch (error) {
      toast({ title: "Error", description: "Failed to save analysis", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      detectAmbiguities(text)
    }, 500)
    return () => clearTimeout(timer)
  }, [text])

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check-session")
        setIsAuthenticated(response.ok)
      } catch {
        setIsAuthenticated(false)
      }
    }
    checkAuth()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <AlertCircle className="w-10 h-10 text-orange-400" />
              Ambiguity Detector
            </h1>
            <p className="text-slate-400">
              Find vague pronouns, unclear references, and vague words that confuse readers.
            </p>
          </div>
          {analysis.length > 0 && isAuthenticated && (
            <Button
              onClick={saveAnalysis}
              disabled={saving}
              variant="outline"
              className="flex items-center gap-2 bg-transparent"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save
            </Button>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Detect Ambiguities</CardTitle>
                <CardDescription>Find unclear language and vague references</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter text to check for ambiguous language, vague pronouns, and unclear references..."
                  className="h-64 bg-slate-900 border-slate-700 text-white"
                />
              </CardContent>
            </Card>

            {loading ? (
              <div className="mt-6 flex items-center justify-center p-8 bg-slate-800 rounded-lg border border-slate-700">
                <Loader2 className="h-6 w-6 animate-spin text-orange-400" />
              </div>
            ) : analysis.length > 0 ? (
              <div className="mt-6 space-y-4">
                {analysis.map((result, idx) => (
                  <Card
                    key={idx}
                    className={`bg-slate-800 border-slate-700 ${result.ambiguities.length > 0 ? "border-orange-500/30" : "border-green-500/30"}`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {result.ambiguities.length === 0 ? (
                              <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-semibold">
                                ✓ CLEAR
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-xs font-semibold">
                                {result.ambiguities.length} AMBIGUIT{result.ambiguities.length !== 1 ? "IES" : "Y"}
                              </span>
                            )}
                            <span className="text-slate-400 text-sm">Clarity: {result.clarity}%</span>
                          </div>
                          <p className="text-white font-mono text-sm">{result.sentence}</p>
                        </div>
                      </div>
                    </CardHeader>

                    {result.ambiguities.length > 0 && (
                      <CardContent className="space-y-3">
                        {result.ambiguities.map((ambiguity, aidx) => (
                          <div key={aidx} className="border-l-4 border-orange-500 pl-4 py-2 bg-orange-500/5">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-semibold text-orange-400">
                                {ambiguity.type.replace("-", " ").toUpperCase()}
                              </span>
                            </div>
                            <p className="text-sm text-slate-300 mb-2">{ambiguity.description}</p>
                            <p className="text-xs text-slate-400">📝 Suggestion: {ambiguity.suggestion}</p>
                          </div>
                        ))}
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            ) : null}
          </div>

          <div className="space-y-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-sm">What is Ambiguity?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-xs">
                  <p className="font-semibold text-orange-400 mb-1">Vague Pronouns</p>
                  <p className="text-slate-400">
                    "This", "that", "it", "they" can be unclear. Always specify what they refer to.
                  </p>
                </div>
                <div className="text-xs">
                  <p className="font-semibold text-orange-400 mb-1">Unclear References</p>
                  <p className="text-slate-400">
                    Avoid "mentioned", "done", "happened" without clarity on what you mean.
                  </p>
                </div>
                <div className="text-xs">
                  <p className="font-semibold text-orange-400 mb-1">Vague Words</p>
                  <p className="text-slate-400">Avoid "something", "things", "stuff" - be specific and concrete.</p>
                </div>
              </CardContent>
            </Card>

            {analysis.length > 0 && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Total Sentences:</span>
                    <span className="text-white font-semibold">{analysis.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">With Ambiguities:</span>
                    <span className="text-orange-400 font-semibold">
                      {analysis.filter((a) => a.ambiguities.length > 0).length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Avg Clarity:</span>
                    <span className="text-green-400 font-semibold">
                      {Math.round(analysis.reduce((sum, a) => sum + a.clarity, 0) / analysis.length)}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
