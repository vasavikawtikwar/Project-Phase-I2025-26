"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle, ArrowRightLeft, Loader2, Save, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface VoiceSuggestion {
  type: "passive-to-active" | "active-to-passive"
  original: string
  suggested: string
  explanation: string
}

interface SentenceAnalysis {
  sentence: string
  voiceType: "active" | "passive" | "unclear"
  suggestions: VoiceSuggestion[]
}

export default function VoiceConverter() {
  const [text, setText] = useState("")
  const [analysis, setAnalysis] = useState<SentenceAnalysis[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { toast } = useToast()

  const analyzeVoice = async (inputText: string) => {
    if (!inputText.trim()) {
      setAnalysis([])
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/voice-converter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      })

      const data = await response.json()
      setAnalysis(data.analyses || [])
    } catch (error) {
      console.error("Voice conversion error:", error)
      toast({ title: "Error", description: "Failed to analyze voice", variant: "destructive" })
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
          analysisType: "voice",
          results: analysis,
          score: 100,
        }),
      })
      toast({ title: "Success", description: "Analysis saved to history" })
    } catch (error) {
      toast({ title: "Error", description: "Failed to save analysis", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  const handleConvertClick = (suggestion: VoiceSuggestion) => {
    setText(suggestion.suggested)
    toast({ title: "Converted", description: "Text updated with conversion" })
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      analyzeVoice(text)
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
              <ArrowRightLeft className="w-10 h-10 text-cyan-400" />
              Voice Converter
            </h1>
            <p className="text-slate-400">Convert between active and passive voice with real-time suggestions.</p>
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
                <CardTitle className="text-white">Enter Your Text</CardTitle>
                <CardDescription>Type or paste sentences to analyze voice usage</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder='Example: "The meal was cooked by the chef." or "The chef cooks the meal."'
                  className="h-64 bg-slate-900 border-slate-700 text-white"
                />
              </CardContent>
            </Card>

            {loading ? (
              <div className="mt-6 flex items-center justify-center p-8 bg-slate-800 rounded-lg border border-slate-700">
                <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
              </div>
            ) : analysis.length > 0 ? (
              <div className="mt-6 space-y-4">
                {analysis.map((result, idx) => (
                  <Card key={idx} className="bg-slate-800 border-slate-700">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {result.voiceType === "active" ? (
                              <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-xs font-semibold">
                                ACTIVE VOICE
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-amber-500/20 text-amber-400 rounded text-xs font-semibold">
                                PASSIVE VOICE
                              </span>
                            )}
                          </div>
                          <p className="text-white font-mono text-sm">{result.sentence}</p>
                        </div>
                      </div>
                    </CardHeader>

                    {result.suggestions.length > 0 && (
                      <CardContent className="space-y-4">
                        {result.suggestions.map((suggestion, sidx) => (
                          <div key={sidx} className="border-l-4 border-purple-500 pl-4 py-2">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-semibold text-purple-400">
                                {suggestion.type === "passive-to-active" ? "PASSIVE → ACTIVE" : "ACTIVE → PASSIVE"}
                              </span>
                            </div>

                            <div className="space-y-2">
                              <div>
                                <p className="text-xs text-slate-400 mb-1">Original:</p>
                                <p className="text-sm text-slate-200 bg-slate-900 p-2 rounded">{suggestion.original}</p>
                              </div>

                              <div>
                                <p className="text-xs text-slate-400 mb-1">Converted:</p>
                                <p className="text-sm text-cyan-300 bg-slate-900 p-2 rounded">{suggestion.suggested}</p>
                              </div>

                              <div className="bg-slate-900 p-2 rounded">
                                <p className="text-sm text-slate-300">{suggestion.explanation}</p>
                              </div>

                              <Button
                                onClick={() => handleConvertClick(suggestion)}
                                size="sm"
                                className="w-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2"
                              >
                                <Zap className="w-4 h-4" />
                                Convert
                              </Button>
                            </div>
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
            <Card className="bg-cyan-500/10 border-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-cyan-400 text-base flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Active Voice
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-cyan-300 mb-1">Rule:</p>
                  <p className="text-sm text-slate-300">Subject + Verb + Object</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-cyan-300 mb-1">Example:</p>
                  <p className="text-sm text-slate-300">"The chef cooked the meal"</p>
                </div>
                <div className="bg-cyan-500/10 p-2 rounded text-xs text-cyan-200">
                  Tone: Direct, clear, and energetic
                </div>
              </CardContent>
            </Card>

            <Card className="bg-amber-500/10 border-amber-500/20">
              <CardHeader>
                <CardTitle className="text-amber-400 text-base flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Passive Voice
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-amber-300 mb-1">Rule:</p>
                  <p className="text-sm text-slate-300">Object + "be" + Past Participle + by + Subject</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-amber-300 mb-1">Example:</p>
                  <p className="text-sm text-slate-300">"The meal was cooked by the chef"</p>
                </div>
                <div className="bg-amber-500/10 p-2 rounded text-xs text-amber-200">
                  Tone: Formal, objective, and detached
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
