import { useState, useEffect } from 'react'
import { SignedIn, SignedOut, SignInButton, UserButton, useAuth } from '@clerk/clerk-react'
import axios from 'axios'
import { Search, TrendingUp, AlertTriangle, Building, Briefcase } from 'lucide-react'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from './components/ui/card'
import { Progress } from './components/ui/progress'

function App() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-indigo-500/30">
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-indigo-500" />
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              InvestIQ AI
            </span>
          </div>
          <div className="flex items-center gap-4">
            <SignedIn>
              <UserButton appearance={{ elements: { userButtonAvatarBox: "w-9 h-9 ring-2 ring-indigo-500/50" } }} />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="default" className="bg-white text-black hover:bg-zinc-200 font-medium rounded-full px-6">
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8 md:py-12 flex flex-col items-center">
        <SignedOut>
          <LandingPage />
        </SignedOut>
        <SignedIn>
          <Dashboard />
        </SignedIn>
      </main>
    </div>
  )
}

function LandingPage() {
  return (
    <div className="w-full max-w-4xl text-center space-y-8 mt-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-indigo-300 font-medium mb-4">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
        </span>
        AI-Powered Investment Analysis
      </div>
      <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-tight bg-gradient-to-br from-white via-zinc-200 to-zinc-600 bg-clip-text text-transparent">
        Smarter Research.<br/>Better Decisions.
      </h1>
      <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
        Let our advanced AI agents analyze market data, news, and financial indicators to provide you with actionable investment recommendations in seconds.
      </p>
      <div className="pt-8">
        <SignInButton mode="modal">
          <Button size="lg" className="bg-indigo-600 text-white hover:bg-indigo-700 h-14 px-8 text-lg rounded-full shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)] transition-all hover:scale-105">
            Start Researching Now
          </Button>
        </SignInButton>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6 pt-16 text-left">
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <Building className="h-8 w-8 text-indigo-400 mb-4" />
          <h3 className="font-semibold text-lg mb-2">Deep Company Analysis</h3>
          <p className="text-zinc-400 text-sm">Comprehensive review of business models, market position, and competitors.</p>
        </div>
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <Briefcase className="h-8 w-8 text-emerald-400 mb-4" />
          <h3 className="font-semibold text-lg mb-2">Financial Insights</h3>
          <p className="text-zinc-400 text-sm">Real-time processing of stock metrics and financial health indicators.</p>
        </div>
        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <AlertTriangle className="h-8 w-8 text-amber-400 mb-4" />
          <h3 className="font-semibold text-lg mb-2">Risk Assessment</h3>
          <p className="text-zinc-400 text-sm">Clear Invest or Pass recommendations backed by logical reasoning.</p>
        </div>
      </div>
    </div>
  )
}

function Dashboard() {
  const [companyName, setCompanyName] = useState('')
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState<{decision: string, reasoning: string} | null>(null)
  const [history, setHistory] = useState<any[]>([])
  const [error, setError] = useState('')
  const { getToken } = useAuth()

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = await getToken()
        if (token) {
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/history`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          setHistory(res.data)
        }
      } catch (err) {
        console.error("Failed to fetch history:", err)
      }
    }
    fetchHistory()
  }, [getToken])

  const handleResearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!companyName.trim()) return

    setLoading(true)
    setError('')
    setReport(null)

    try {
      const token = await getToken()
      // Use standard localhost URL for backend
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/research`, 
        { companyName },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      
      setReport(response.data)
      setHistory(prev => [response.data, ...prev])
    } catch (err: any) {
      console.error(err)
      if (err.response?.status === 429) {
        setError('⏳ Gemini API rate limit reached. Please wait a minute and try again.')
      } else {
        setError(err.response?.data?.error || err.message || 'An error occurred during research')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-3xl space-y-8 animate-in fade-in duration-700">
      <div className="text-center space-y-2 mb-10">
        <h2 className="text-3xl font-bold tracking-tight">Investment Research</h2>
        <p className="text-zinc-400">Enter a company name to generate an AI investment report.</p>
      </div>

      <form onSubmit={handleResearch} className="relative flex items-center shadow-2xl shadow-indigo-900/20 rounded-full">
        <Search className="absolute left-6 h-5 w-5 text-zinc-400" />
        <Input 
          type="text" 
          placeholder="e.g. Apple, NVIDIA, Tesla..." 
          className="h-16 pl-14 pr-32 rounded-full bg-zinc-900/80 border-white/10 text-lg placeholder:text-zinc-500 focus-visible:ring-indigo-500 focus-visible:ring-offset-0 focus-visible:border-indigo-500 backdrop-blur-md"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          disabled={loading}
        />
        <Button 
          type="submit" 
          disabled={loading || !companyName.trim()} 
          className="absolute right-2 h-12 rounded-full px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
        >
          {loading ? 'Analyzing...' : 'Research'}
        </Button>
      </form>

      {loading && (
        <div className="pt-8 space-y-4 animate-pulse">
          <div className="flex justify-between text-sm text-zinc-400 px-2">
            <span>Gathering data...</span>
            <span className="animate-bounce">🤖</span>
          </div>
          <Progress value={60} className="h-2 bg-zinc-800 [&>div]:bg-indigo-500" />
          <p className="text-center text-sm text-zinc-500 pt-4">This usually takes 10-20 seconds as our AI agent researches the web.</p>
        </div>
      )}

      {error && (
        <div className="mt-8 p-4 bg-red-950/50 border border-red-900 rounded-xl text-red-200 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {report && (
        <div className="pt-6 animate-in slide-in-from-bottom-4 duration-500">
          <Card className="bg-zinc-900/50 border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden">
            <div className={`h-2 w-full ${report.decision.toLowerCase() === 'invest' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold text-white mb-1">{companyName} Report</CardTitle>
                  <CardDescription className="text-zinc-400">AI Analyst Conclusion</CardDescription>
                </div>
                <div className={`px-4 py-2 rounded-xl font-bold text-lg tracking-wider ${
                  report.decision.toLowerCase() === 'invest' 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                }`}>
                  {report.decision.toUpperCase()}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert max-w-none">
                <h4 className="text-lg font-semibold text-zinc-200 mb-3 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-indigo-400" />
                  Reasoning
                </h4>
                <div className="bg-black/40 rounded-xl p-5 border border-white/5 text-zinc-300 leading-relaxed text-[15px] whitespace-pre-wrap">
                  {report.reasoning}
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2 pb-6 px-6">
              <p className="text-xs text-zinc-500 w-full text-center">
                Disclaimer: This report is generated by AI and is for informational purposes only. Do not consider this as professional financial advice.
              </p>
            </CardFooter>
          </Card>
        </div>
      )}

      {history.length > 0 && (
        <div className="pt-12 space-y-6">
          <h3 className="text-xl font-semibold text-zinc-300 border-b border-white/10 pb-2">Recent Research</h3>
          <div className="grid gap-4">
            {history.map((item, idx) => (
              <Card key={item.id || idx} className="bg-zinc-900/30 border-white/5 hover:bg-zinc-900/50 transition-colors">
                <CardHeader className="py-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{item.companyName}</CardTitle>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      item.decision.toLowerCase() === 'invest' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}>
                      {item.decision.toUpperCase()}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="py-0 pb-4 text-sm text-zinc-400 line-clamp-2">
                  {item.reasoning}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
