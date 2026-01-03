import { type NextRequest, NextResponse } from "next/server"

const HOMOPHONES: Record<string, { meanings: string[]; examples: string[] }> = {
  see: {
    meanings: ["perceive with eyes", "understand"],
    examples: ["I can see the mountain", "Do you see what I mean?"],
  },
  sea: { meanings: ["body of saltwater", "ocean"], examples: ["We sailed across the sea"] },
  there: { meanings: ["at that location", "in that direction"], examples: ["Let's go there"] },
  their: { meanings: ["possessive - belongs to them"], examples: ["That's their house"] },
  "they're": { meanings: ["they are (contraction)"], examples: ["They're going to the party"] },
  to: {
    meanings: ["preposition of direction", "used with infinitive verbs"],
    examples: ["I'm going to school", "I like to run"],
  },
  too: { meanings: ["also", "excessive amount"], examples: ["Can I come too?", "That's too much"] },
  two: { meanings: ["number 2"], examples: ["I have two cats"] },
  hear: { meanings: ["perceive with ears", "listen"], examples: ["Did you hear that sound?"] },
  here: { meanings: ["at this location"], examples: ["Come here"] },
  no: { meanings: ["negative", "absence"], examples: ["No, I don't agree"] },
  know: { meanings: ["be aware of", "understand"], examples: ["I know the answer"] },
  piece: { meanings: ["a part", "portion"], examples: ["Can I have a piece of cake?"] },
  peace: { meanings: ["absence of conflict", "calm"], examples: ["World peace is important"] },
  right: { meanings: ["correct", "direction", "privilege"], examples: ["That's the right answer", "Turn right"] },
  write: { meanings: ["compose text", "mark with pen"], examples: ["Write a letter"] },
  one: { meanings: ["number 1", "a single item"], examples: ["I have one apple"] },
  won: { meanings: ["past tense of win"], examples: ["She won the race"] },
}

const VAGUE_WORDS = [
  "something",
  "things",
  "stuff",
  "somehow",
  "anyway",
  "somehow",
  "somewhere",
  "someone",
  "whatever",
  "etc",
  "and so on",
]

const VAGUE_PRONOUNS = ["this", "that", "it", "they", "these", "those", "them", "which"]

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ analyses: [] }, { status: 200 })
    }

    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]
    const results = sentences.map((sentence) => {
      const trimmed = sentence.trim()
      const ambiguities: any[] = []
      const foundIssues = new Set<string>()

      const words = trimmed.split(/\s+/)
      words.forEach((wordRaw) => {
        const word = wordRaw.toLowerCase().replace(/[^a-z']/g, "")
        if (word && HOMOPHONES[word]) {
          const key = `homophone-${word}`
          if (!foundIssues.has(key)) {
            foundIssues.add(key)
            const homophoneData = HOMOPHONES[word]
            ambiguities.push({
              type: "homophone",
              word: word,
              meaning: homophoneData.meanings.join(", "),
              example: homophoneData.examples[0],
              description: `The word "${word}" means "${homophoneData.meanings[0]}"`,
              suggestion: `Make sure you're using the correct word. "${word}" is different from other homophones that sound similar.`,
            })
          }
        }
      })

      VAGUE_PRONOUNS.forEach((pronoun) => {
        if (new RegExp(`\\b${pronoun}\\b`, "i").test(trimmed)) {
          const key = `vague-pronoun-${pronoun}`
          if (!foundIssues.has(key)) {
            foundIssues.add(key)
            ambiguities.push({
              type: "vague-pronoun",
              word: pronoun,
              description: `The pronoun "${pronoun}" is vague and unclear`,
              suggestion: `Replace with the specific noun. For example, instead of "it", name what "it" refers to.`,
            })
          }
        }
      })

      VAGUE_WORDS.forEach((vagueWord) => {
        if (new RegExp(`\\b${vagueWord}\\b`, "i").test(trimmed)) {
          const key = `vague-word-${vagueWord}`
          if (!foundIssues.has(key)) {
            foundIssues.add(key)
            ambiguities.push({
              type: "vague-word",
              word: vagueWord,
              description: `The word "${vagueWord}" is too vague and unclear`,
              suggestion: `Be specific. Replace with actual things or details instead of "${vagueWord}".`,
            })
          }
        }
      })

      const clarity = Math.max(0, 100 - ambiguities.length * 20)

      return {
        sentence: trimmed,
        ambiguities,
        clarity,
      }
    })

    return NextResponse.json({ analyses: results })
  } catch (error) {
    console.error("[v0] Ambiguity check error:", error)
    return NextResponse.json({ error: "Failed to check ambiguity" }, { status: 500 })
  }
}
