"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen } from "lucide-react"

export default function StyleGuide() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <BookOpen className="w-10 h-10 text-blue-400" />
            Writing Style Guide
          </h1>
          <p className="text-slate-400">Learn best practices for professional, clear, and engaging writing.</p>
        </div>

        <div className="space-y-6">
          {/* Active Voice Guide */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-cyan-400">Active Voice</CardTitle>
              <CardDescription>Direct, clear, and energetic writing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-white font-semibold mb-2">Structure:</h4>
                <p className="text-slate-300">Subject + Verb + Object</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Example:</h4>
                <p className="text-slate-300">"The marketing team launched the campaign" (Clear who did what)</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">When to Use:</h4>
                <ul className="text-slate-300 space-y-1 list-disc list-inside">
                  <li>Blog posts and articles</li>
                  <li>Instructional writing</li>
                  <li>Marketing copy</li>
                  <li>Narrative writing</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Passive Voice Guide */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-amber-400">Passive Voice</CardTitle>
              <CardDescription>Formal, objective, and detached writing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-white font-semibold mb-2">Structure:</h4>
                <p className="text-slate-300">Object + form of "be" + Past Participle + by + Subject</p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">Example:</h4>
                <p className="text-slate-300">
                  "The campaign was launched by the marketing team" (Emphasis on action, not doer)
                </p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-2">When to Use:</h4>
                <ul className="text-slate-300 space-y-1 list-disc list-inside">
                  <li>Scientific reports</li>
                  <li>Academic papers</li>
                  <li>News writing</li>
                  <li>When doer is unknown</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Grammar Tips */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-green-400">Grammar Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-white font-semibold mb-1">Subject-Verb Agreement</h4>
                <p className="text-slate-300 text-sm">
                  Singular subjects take singular verbs. "The cat is" not "The cat are"
                </p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Articles (a/an/the)</h4>
                <p className="text-slate-300 text-sm">
                  Use "a" before consonants, "an" before vowels. Always use "the" when specific.
                </p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Tense Consistency</h4>
                <p className="text-slate-300 text-sm">
                  Don't mix past and present tense in the same paragraph without reason.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Clarity Tips */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-blue-400">Clarity Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-white font-semibold mb-1">Be Specific, Not Vague</h4>
                <p className="text-slate-300 text-sm">
                  Instead of "things" use "materials". Instead of "it" use the actual noun.
                </p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Avoid Unnecessary Words</h4>
                <p className="text-slate-300 text-sm">
                  Remove filler words like "basically", "literally", "actually" when possible.
                </p>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Use Parallel Structure</h4>
                <p className="text-slate-300 text-sm">
                  In lists or series, use the same grammatical form: "running, jumping, swimming" not "run, jump, to
                  swim"
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
