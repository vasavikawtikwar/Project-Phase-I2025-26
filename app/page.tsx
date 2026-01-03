import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Zap, Slice as Voice, AlertCircle, HelpCircle, ArrowRight, Star } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="hero-gradient text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance text-primary-foreground">
            Master Your Writing with
            <span className="block text-accent-foreground">Advanced Grammar Tools</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-foreground max-w-3xl mx-auto text-pretty">
            Professional-grade writing tools with real-time feedback. Check grammar, convert voice, detect ambiguity,
            and improve clarity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild className="text-lg px-8 py-6">
              <Link href="/voice-converter">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">Grammar Tools Suite</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Four powerful writing tools to perfect every aspect of your text.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Voice Converter */}
            <Link href="/voice-converter">
              <Card className="border-border/50 hover:shadow-lg transition-all hover:border-primary cursor-pointer h-full">
                <CardHeader>
                  <Voice className="h-12 w-12 text-primary mb-4" />
                  <CardTitle className="text-lg">Voice Converter</CardTitle>
                  <CardDescription>Convert between active and passive voice with instant suggestions.</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            {/* Grammar Checker */}
            <Link href="/grammar-checker">
              <Card className="border-border/50 hover:shadow-lg transition-all hover:border-primary cursor-pointer h-full">
                <CardHeader>
                  <Zap className="h-12 w-12 text-primary mb-4" />
                  <CardTitle className="text-lg">Grammar Checker</CardTitle>
                  <CardDescription>Detect spelling errors, subject-verb agreement, and more.</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            {/* Ambiguity Detector */}
            <Link href="/ambiguity-detector">
              <Card className="border-border/50 hover:shadow-lg transition-all hover:border-primary cursor-pointer h-full">
                <CardHeader>
                  <AlertCircle className="h-12 w-12 text-primary mb-4" />
                  <CardTitle className="text-lg">Ambiguity Detector</CardTitle>
                  <CardDescription>Find vague pronouns and unclear references that confuse readers.</CardDescription>
                </CardHeader>
              </Card>
            </Link>

            {/* Style Guide */}
            <Link href="/style-guide">
              <Card className="border-border/50 hover:shadow-lg transition-all hover:border-primary cursor-pointer h-full">
                <CardHeader>
                  <HelpCircle className="h-12 w-12 text-primary mb-4" />
                  <CardTitle className="text-lg">Style Guide</CardTitle>
                  <CardDescription>Learn best practices for professional and clear writing.</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">99.9%</div>
              <div className="text-lg text-muted-foreground">Accuracy Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50M+</div>
              <div className="text-lg text-muted-foreground">Words Checked</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">100K+</div>
              <div className="text-lg text-muted-foreground">Happy Users</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">What Our Users Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border/50">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "GrammarPro has completely transformed my writing. The real-time suggestions are incredibly accurate
                  and helpful."
                </p>
                <div className="font-semibold">Sarah Johnson</div>
                <div className="text-sm text-muted-foreground">Content Writer</div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "As a non-native English speaker, this tool has been invaluable for my professional communications."
                </p>
                <div className="font-semibold">Miguel Rodriguez</div>
                <div className="text-sm text-muted-foreground">Business Analyst</div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardContent className="pt-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-4">
                  "The different writing style options make it perfect for both academic papers and casual emails."
                </p>
                <div className="font-semibold">Dr. Emily Chen</div>
                <div className="text-sm text-muted-foreground">University Professor</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 hero-gradient text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Perfect Your Writing?</h2>
          <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto text-pretty">
            Join thousands of professionals who trust GrammarPro for their writing needs.
          </p>
          <Button size="lg" variant="secondary" asChild className="text-lg px-8 py-6">
            <Link href="/signup">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
