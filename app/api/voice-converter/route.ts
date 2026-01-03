import { type NextRequest, NextResponse } from "next/server"

// Common irregular verbs and their past participles
const irregularVerbs: Record<string, string> = {
  like: "liked",
  love: "loved",
  eat: "eaten",
  write: "written",
  see: "seen",
  go: "gone",
  make: "made",
  take: "taken",
  buy: "bought",
  bring: "brought",
  choose: "chosen",
  do: "done",
  give: "given",
  know: "known",
  speak: "spoken",
  eat: "eaten",
  find: "found",
  drive: "driven",
  break: "broken",
  fly: "flown",
}

function convertActiveToPassive(sentence: string): string {
  const cleanSentence = sentence.replace(/[.!?]$/, "").trim()

  // Pattern: Subject + simple verb + object
  // Matches: "Shira likes birdwatching" -> "Birdwatching is liked by Shira"
  const simplePattern =
    /^([A-Z][a-z]+|\w+)\s+(likes?|loves?|eats?|writes?|sees?|goes?|makes?|takes?|buys?|brings?|chooses?|does?|gives?|knows?|speaks?|finds?|drives?|breaks?|flies?|played?|creates?|reads?|teaches?|learns?|cooks?|builds?|designs?|paints?|repairs?|fixes?|solves?|hears?|understands?|notices?|enjoys?|prefers?|wants?|watches?|studies?|practices?|performs?)\s+(.+)$/i

  const match = cleanSentence.match(simplePattern)
  if (match) {
    const [, subject, verb, object] = match
    const verbLower = verb.toLowerCase()

    // Get base verb and past participle
    let pastParticiple = ""
    const baseVerb = verbLower.replace(/s$/, "").replace(/es$/, "")

    if (irregularVerbs[baseVerb]) {
      pastParticiple = irregularVerbs[baseVerb]
    } else if (baseVerb.endsWith("e")) {
      pastParticiple = baseVerb + "d"
    } else if (baseVerb.endsWith("y")) {
      pastParticiple = baseVerb.slice(0, -1) + "ied"
    } else {
      pastParticiple = baseVerb + "ed"
    }

    // Determine auxiliary verb
    const auxVerb = ["I", "We", "You", "They"].some((s) => subject.toLowerCase().includes(s.toLowerCase()))
      ? "are"
      : "is"

    return `${object} ${auxVerb} ${pastParticiple} by ${subject}.`
  }

  const passivePattern = /^(.+?)\s+(is|are|was|were)\s+(\w+(?:ed|en)?)\s+by\s+(.+)$/i
  const passiveMatch = cleanSentence.match(passivePattern)
  if (passiveMatch) {
    const [, object, auxiliary, participle, subject] = passiveMatch

    let verb = participle
    if (verb.endsWith("ed")) {
      verb = verb.slice(0, -2)
    } else if (verb.endsWith("en")) {
      verb = verb.slice(0, -2)
    }

    const subjectLower = subject.toLowerCase()
    const needsS = ["he", "she", "it"].some((s) => subjectLower.includes(s))

    if (needsS && !verb.endsWith("s")) {
      verb = verb + "s"
    }

    return `${subject} ${verb} ${object}.`
  }

  return sentence
}

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ analyses: [] }, { status: 200 })
    }

    const sentences = text.match(/[^.!?]+[.!?]+/g) || []
    const results = sentences.map((sentence) => {
      const trimmed = sentence.trim()

      // Check if passive voice
      const isPassive =
        /\b(is|are|was|were|be|been|being|have\s+been|has\s+been|had\s+been)\s+\w+(?:ed|en)\s+by\b/i.test(trimmed)

      const converted = convertActiveToPassive(trimmed)

      return {
        sentence: trimmed,
        voiceType: isPassive ? "passive" : "active",
        suggestions: [
          {
            type: isPassive ? "passive-to-active" : "active-to-passive",
            original: trimmed,
            suggested: converted,
            explanation: isPassive
              ? "Active voice is more direct and engaging. The subject performs the action."
              : "Passive voice emphasizes the object. The subject receives the action.",
          },
        ],
      }
    })

    return NextResponse.json({ analyses: results })
  } catch (error) {
    console.error("[v0] Voice converter error:", error)
    return NextResponse.json({ error: "Failed to convert voice" }, { status: 500 })
  }
}
