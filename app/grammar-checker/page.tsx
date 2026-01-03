"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { CheckCircle, Loader2, Save } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface GrammarIssue {
  message: string
  short: string
  replacements?: Array<{ value: string }>
  offset: number
  length: number
}

interface SentenceGrammar {
  sentence: string
  issues: GrammarIssue[]
  score: number
}

export default function GrammarChecker() {
  const [text, setText] = useState("")
  const [analysis, setAnalysis] = useState<SentenceGrammar[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { toast } = useToast()

  const checkGrammar = async (inputText: string) => {
    if (!inputText.trim()) {
      setAnalysis([])
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/grammar-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      })

      const data = await response.json()

      // Parse LanguageTool matches into sentences
      const sentences = inputText.match(/[^.!?]+[.!?]+/g) || []
      const sentenceAnalyses = sentences.map((sentence) => {
        const sentenceOffset = inputText.indexOf(sentence)
        const sentenceIssues = (data.matches || []).filter(
          (match: any) => match.offset >= sentenceOffset && match.offset < sentenceOffset + sentence.length,
        )
        const score = Math.max(0, 100 - sentenceIssues.length * 15)
        return {
          sentence: sentence.trim(),
          issues: sentenceIssues,
          score,
        }
      })
      setAnalysis(sentenceAnalyses)
    } catch (error) {
      console.error("Grammar check error:", error)
      toast({ title: "Error", description: "Failed to check grammar", variant: "destructive" })
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
          analysisType: "grammar",
          results: analysis,
          score: Math.round(analysis.reduce((sum, a) => sum + a.score, 0) / analysis.length),
        }),
      })
      toast({ title: "Success", description: "Analysis saved to history" })
    } catch (error) {
      toast({ title: "Error", description: "Failed to save analysis", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const applySuggestion = (issue: GrammarIssue, replacement: string) => {
    const newText = text.substring(0, issue.offset) + replacement + text.substring(issue.offset + issue.length)
    setText(newText)
    toast({ title: "Applied", description: "Suggestion applied to your text" })
  }

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

  useEffect(() => {
    const timer = setTimeout(() => {
      checkGrammar(text)
    }, 500)
    return () => clearTimeout(timer)
  }, [text])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <CheckCircle className="w-10 h-10 text-green-400" />
              Grammar Checker
            </h1>
            <p className="text-slate-400">Detect grammar mistakes, spelling errors, and improve sentence structure.</p>
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
                <CardTitle className="text-white">Check Your Grammar</CardTitle>
                <CardDescription>Paste or type text to detect grammar issues</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter your text here to check for grammar mistakes, spelling errors, and clarity issues..."
                  className="h-64 bg-slate-900 border-slate-700 text-white"
                />
              </CardContent>
            </Card>

            {loading ? (
              <div className="mt-6 flex items-center justify-center p-8 bg-slate-800 rounded-lg border border-slate-700">
                <Loader2 className="h-6 w-6 animate-spin text-green-400" />
              </div>
            ) : analysis.length > 0 ? (
              <div className="mt-6 space-y-4">
                {analysis.map((result, idx) => (
                  <Card
                    key={idx}
                    className={`bg-slate-800 border-slate-700 ${result.issues.length > 0 ? "border-red-500/30" : "border-green-500/30"}`}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {result.issues.length === 0 ? (
                              <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded text-xs font-semibold">
                                ✓ NO ISSUES
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs font-semibold">
                                {result.issues.length} ISSUE{result.issues.length !== 1 ? "S" : ""}
                              </span>
                            )}
                            <span className="text-slate-400 text-sm">Score: {result.score}%</span>
                          </div>
                          <p className="text-white font-mono text-sm">{result.sentence}</p>
                        </div>
                      </div>
                    </CardHeader>

                    {result.issues.length > 0 && (
                      <CardContent className="space-y-3">
                        {result.issues.map((issue, iidx) => (
                          <div key={iidx} className="border-l-4 border-red-500 pl-4 py-2 bg-red-500/5">
                            <p className="text-sm text-slate-300 mb-2">{issue.message}</p>
                            {issue.replacements && issue.replacements.length > 0 ? (
                              <div className="space-y-2">
                                <p className="text-xs text-slate-400">💡 Suggestion: {issue.replacements[0].value}</p>
                                <Button
                                  onClick={() => applySuggestion(issue, issue.replacements[0].value)}
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                                >
                                  <CheckCircle className="w-3 h-3" />
                                  Apply
                                </Button>
                              </div>
                            ) : (
                              <p className="text-xs text-slate-400">Review this issue manually</p>
                            )}
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
                <CardTitle className="text-white text-sm">Common Grammar Issues</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-xs">
                  <p className="font-semibold text-green-400 mb-1">Subject-Verb Agreement</p>
                  <p className="text-slate-400">Singular subjects need singular verbs. "He has" not "He have"</p>
                </div>
                <div className="text-xs">
                  <p className="font-semibold text-green-400 mb-1">Articles (a/an/the)</p>
                  <p className="text-slate-400">Use articles before nouns. "the cat" not "cat"</p>
                </div>
                <div className="text-xs">
                  <p className="font-semibold text-green-400 mb-1">Capitalization</p>
                  <p className="text-slate-400">Start sentences with capital letters</p>
                </div>
              </CardContent>
            </Card>

            {analysis.length > 0 && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white text-sm">Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Total Sentences:</span>
                    <span className="text-white font-semibold">{analysis.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Sentences with Issues:</span>
                    <span className="text-red-400 font-semibold">
                      {analysis.filter((a) => a.issues.length > 0).length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Average Score:</span>
                    <span className="text-green-400 font-semibold">
                      {Math.round(analysis.reduce((sum, a) => sum + a.score, 0) / analysis.length)}%
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
