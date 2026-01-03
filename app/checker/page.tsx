"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, CheckCircle } from "lucide-react"

interface SentenceAnalysis {
  sentence: string
  voiceType: "active" | "passive" | "unclear"
  score: number
  issues: VoiceIssue[]
  suggestions: VoiceSuggestion[]
}

interface VoiceIssue {
  type: "passive-detected" | "active-detected" | "complex-structure"
  description: string
  severity: "info" | "suggestion"
}

interface VoiceSuggestion {
  type: "passive-to-active" | "active-to-passive"
  original: string
  suggested: string
  rule: string
  explanation: string
  toneChange: string
}

export default function GrammarChecker() {
  const [text, setText] = useState("")
  const [analysis, setAnalysis] = useState<SentenceAnalysis[]>([])
  const [loading, setLoading] = useState(false)
  const [voicePreference, setVoicePreference] = useState<"active" | "passive" | "both">("active")

  const detectPassiveVoice = (sentence: string): boolean => {
    const passiveIndicators = [
      /\bis\s+\w+ed\b/gi, // is eaten, is made
      /\bwas\s+\w+ed\b/gi, // was eaten, was created
      /\bare\s+\w+ed\b/gi, // are eaten, are made
      /\bwere\s+\w+ed\b/gi, // were eaten, were created
      /\bbeing\s+\w+ed\b/gi, // being eaten, being made
      /\bhave\s+been\s+\w+ed\b/gi, // have been eaten
      /\bhas\s+been\s+\w+ed\b/gi, // has been eaten
      /\bhad\s+been\s+\w+ed\b/gi, // had been eaten
      /\bby\s+\w+/gi, // by the chef
    ]

    return passiveIndicators.some((pattern) => pattern.test(sentence))
  }

  const convertPassiveToActive = (sentence: string): VoiceSuggestion | null => {
    // Pattern: Object + was/were + verb(ed) + by + subject
    const passivePattern = /^([A-Z][^.!?]*?)\s+(was|were)\s+(\w+ed)\s+by\s+([A-Z][\w\s]+)/i
    const match = sentence.match(passivePattern)

    if (match) {
      const [, object, beVerb, pastParticiple, subject] = match
      const baseVerbs: { [key: string]: string } = {
        created: "create",
        made: "make",
        written: "write",
        built: "build",
        developed: "develop",
        designed: "design",
        implemented: "implement",
        completed: "complete",
        finished: "finish",
        started: "start",
        cooked: "cook",
        prepared: "prepare",
        solved: "solve",
        broken: "break",
        painted: "paint",
        cleaned: "clean",
        eaten: "eat",
      }

      const baseVerb = baseVerbs[pastParticiple.toLowerCase()] || pastParticiple.replace(/ed$/, "")
      const subjectWords = subject.trim().split(/\s+/)
      const subjectProper = subjectWords[0] // First word as main subject

      // Determine correct verb conjugation
      let conjugatedVerb = baseVerb
      if (beVerb === "was" && !subjectProper.match(/^(I|we|they)$/i)) {
        conjugatedVerb = baseVerb.endsWith("y") ? baseVerb.slice(0, -1) + "ies" : baseVerb + "s"
      }

      const suggested = `${subject} ${conjugatedVerb}s ${object}.`

      return {
        type: "passive-to-active",
        original: sentence,
        suggested,
        rule: "Subject + Verb + Object",
        explanation:
          "Active voice is direct and energetic. The subject performs the action, making sentences clearer and more engaging.",
        toneChange: "More direct, dynamic, and engaging",
      }
    }
    return null
  }

  const convertActiveToPassive = (sentence: string): VoiceSuggestion | null => {
    // Pattern: Subject + Verb + Object
    const activePattern =
      /^([A-Z][\w\s]+?)\s+(write|create|make|build|develop|design|implement|complete|finish|start|cook|prepare|solve|paint|break|clean|eat)\s+([A-Z][\w\s.!?]+)$/i
    const match = sentence.match(activePattern)

    if (match) {
      const [, subject, verb, objectPart] = match
      const object = objectPart.replace(/[.!?]$/, "").trim()

      const pastParticiples: { [key: string]: string } = {
        write: "written",
        create: "created",
        make: "made",
        build: "built",
        develop: "developed",
        design: "designed",
        implement: "implemented",
        complete: "completed",
        finish: "finished",
        start: "started",
        cook: "cooked",
        prepare: "prepared",
        solve: "solved",
        paint: "painted",
        break: "broken",
        clean: "cleaned",
        eat: "eaten",
      }

      const pp = pastParticiples[verb.toLowerCase()] || verb + "ed"
      const suggested = `${object} was ${pp} by ${subject}.`

      return {
        type: "active-to-passive",
        original: sentence,
        suggested,
        rule: 'Object + form of "be" + Past Participle + by + Subject',
        explanation:
          "Passive voice emphasizes the object or action rather than the doer. Use when the action is more important than who performs it, or when the doer is unknown.",
        toneChange: "More formal, objective, and detached",
      }
    }
    return null
  }

  const analyzeSentences = (fullText: string): SentenceAnalysis[] => {
    const sentencePattern = /[^.!?]+[.!?]+/g
    const sentences = fullText.match(sentencePattern) || []

    return sentences.map((sentence) => {
      const trimmed = sentence.trim()
      const isPassive = detectPassiveVoice(trimmed)

      const issues: VoiceIssue[] = []
      const suggestions: VoiceSuggestion[] = []

      if (isPassive) {
        issues.push({
          type: "passive-detected",
          description: "Passive voice detected: Subject receives the action",
          severity: "info",
        })

        if (voicePreference === "active" || voicePreference === "both") {
          const suggestion = convertPassiveToActive(trimmed)
          if (suggestion) suggestions.push(suggestion)
        }
      } else {
        issues.push({
          type: "active-detected",
          description: "Active voice detected: Subject performs the action",
          severity: "info",
        })

        if (voicePreference === "passive" || voicePreference === "both") {
          const suggestion = convertActiveToPassive(trimmed)
          if (suggestion) suggestions.push(suggestion)
        }
      }

      const score = isPassive ? 65 : 95

      return {
        sentence: trimmed,
        voiceType: isPassive ? "passive" : "active",
        score,
        issues,
        suggestions,
      }
    })
  }

  const handleAnalyze = async () => {
    if (!text.trim()) return

    setLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 500))
      const results = analyzeSentences(text)
      setAnalysis(results)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (text.trim()) {
      const results = analyzeSentences(text)
      setAnalysis(results)
    } else {
      setAnalysis([])
    }
  }, [text, voicePreference])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Voice Converter</h1>
          <p className="text-slate-400">
            Convert between active and passive voice. Master clarity and tone in your writing.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Enter Your Text</CardTitle>
                <CardDescription>Paste your text to analyze voice usage</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter your text here... For example: 'The meal was cooked by the chef.' or 'The chef cooks the meal.'"
                  className="h-64 bg-slate-900 border-slate-700 text-white placeholder-slate-500"
                />
              </CardContent>
            </Card>

            {/* Voice Preference */}
            <Card className="bg-slate-800 border-slate-700 mt-6">
              <CardHeader>
                <CardTitle className="text-white text-sm">Voice Preference</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  {(["active", "passive", "both"] as const).map((pref) => (
                    <Button
                      key={pref}
                      variant={voicePreference === pref ? "default" : "outline"}
                      onClick={() => setVoicePreference(pref)}
                      className="capitalize"
                    >
                      {pref === "active" && "✓ Active Voice"}
                      {pref === "passive" && "✓ Passive Voice"}
                      {pref === "both" && "↔ Show Both"}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Analysis Results */}
            {analysis.length > 0 && (
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
                            <span className="text-slate-400 text-sm">Clarity: {result.score}%</span>
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
                              <span className="text-xs text-slate-400">{suggestion.rule}</span>
                            </div>

                            <div className="space-y-2">
                              <div>
                                <p className="text-xs text-slate-400 mb-1">Original:</p>
                                <p className="text-sm text-slate-200 bg-slate-900 p-2 rounded">{suggestion.original}</p>
                              </div>

                              <div>
                                <p className="text-xs text-slate-400 mb-1">Suggestion:</p>
                                <p className="text-sm text-cyan-300 bg-slate-900 p-2 rounded">{suggestion.suggested}</p>
                              </div>

                              <div className="bg-slate-900 p-2 rounded">
                                <p className="text-xs text-slate-400 mb-1">Explanation:</p>
                                <p className="text-sm text-slate-300">{suggestion.explanation}</p>
                                <p className="text-xs text-purple-400 mt-1">💡 Tone: {suggestion.toneChange}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar - Voice Guide */}
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
                <div>
                  <p className="text-xs font-semibold text-cyan-300 mb-1">Tone:</p>
                  <p className="text-sm text-slate-300">Direct, clear, and energetic</p>
                </div>
                <div className="bg-cyan-500/10 p-2 rounded text-xs text-cyan-200">
                  Best for: Direct communication, engaging narratives, clear instructions
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
                  <p className="text-sm text-slate-300">Object + form of "be" + Past Participle + by + Subject</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-amber-300 mb-1">Example:</p>
                  <p className="text-sm text-slate-300">"The meal was cooked by the chef"</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-amber-300 mb-1">Tone:</p>
                  <p className="text-sm text-slate-300">Formal, objective, and detached</p>
                </div>
                <div className="bg-amber-500/10 p-2 rounded text-xs text-amber-200">
                  Best for: Formal writing, scientific reports, emphasis on action
                </div>
              </CardContent>
            </Card>

            {/* Statistics */}
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
                    <span className="text-slate-400">Active Voice:</span>
                    <span className="text-cyan-400 font-semibold">
                      {analysis.filter((a) => a.voiceType === "active").length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Passive Voice:</span>
                    <span className="text-amber-400 font-semibold">
                      {analysis.filter((a) => a.voiceType === "passive").length}
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
