import { type NextRequest, NextResponse } from "next/server"

const fallbackGrammarPatterns = [
  // Subject-verb agreement
  {
    pattern: /\b(he|she|it)\s+(have|do|were|are)\b/gi,
    message: "Subject-verb agreement: use 'has/does/was/is' with he/she/it",
  },
  {
    pattern: /\b(I|you|we|they)\s+(has|does|was)\b(?!n't)/gi,
    message: "Subject-verb agreement: use 'have/do/were' with these subjects",
  },

  // Your vs You're
  {
    pattern: /\byour\s+(going|coming|being|arriving|leaving|staying|running|walking)\b/gi,
    message: "Grammar: should be 'you're' (you are), not 'your' (possessive)",
  },

  // There/Their/They're
  {
    pattern: /\b(their|there)\s+going\b/gi,
    message: "Grammar: should be 'they're' (they are), not 'there' or 'their'",
  },

  // Common typos
  {
    pattern: /\brecieve\b/gi,
    message: "Spelling: should be 'receive' (i before e after c)",
  },
  {
    pattern: /\boccured\b/gi,
    message: "Spelling: should be 'occurred' (double c, double r)",
  },
  {
    pattern: /\bseperate\b/gi,
    message: "Spelling: should be 'separate'",
  },
  {
    pattern: /\bneccessary\b/gi,
    message: "Spelling: should be 'necessary' (one c, two s's)",
  },

  // Double spaces
  {
    pattern: /\s{2,}/g,
    message: "Whitespace: remove extra spaces",
  },

  // Missing period
  {
    pattern: /[a-z]\s+[A-Z]/g,
    message: "Punctuation: possible missing period between sentences",
  },
]

export async function POST(request: NextRequest) {
  try {
    const { text, language = "en-US", style } = await request.json()

    if (!text || text.trim().length === 0) {
      return NextResponse.json({ matches: [] }, { status: 200 })
    }

    console.log("[v0] Grammar API: Checking text with LanguageTool:", text.substring(0, 50) + "...")

    const languageToolUrl = "https://api.languagetool.org/v2/check"

    const params = new URLSearchParams()
    params.append("text", text)
    params.append("language", language)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000)

    if (style === "formal" || style === "academic" || style === "business") {
      params.append("enabledRules", "STYLE,GRAMMAR,TYPOS,PUNCTUATION")
    } else {
      params.append("enabledRules", "GRAMMAR,TYPOS")
    }

    const response = await fetch(languageToolUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: params.toString(),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      console.error("[v0] LanguageTool API error:", response.status)
      return NextResponse.json(getFallbackGrammarMatches(text))
    }

    const data = await response.json()
    console.log("[v0] LanguageTool API success:", data.matches?.length || 0, "issues found")

    return NextResponse.json(data)
  } catch (error) {
    console.error("[v0] Grammar API error:", error)
    const text = await request
      .json()
      .then((data) => data.text)
      .catch(() => "")
    return NextResponse.json(getFallbackGrammarMatches(text))
  }
}

function getFallbackGrammarMatches(text: string) {
  const matches: any[] = []
  const offset = 0

  fallbackGrammarPatterns.forEach((rule) => {
    let match
    while ((match = rule.pattern.exec(text)) !== null) {
      matches.push({
        message: rule.message,
        short: rule.message,
        offset: match.index,
        length: match[0].length,
        replacements: [{ value: match[0].trim() }],
      })
    }
  })

  return { matches }
}
