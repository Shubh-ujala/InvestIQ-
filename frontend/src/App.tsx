import { useState, useEffect, useRef } from 'react'
import { SignedIn, SignedOut, SignInButton, UserButton, useAuth } from '@clerk/clerk-react'
import { Search, TrendingUp, AlertTriangle, ChevronDown, ChevronUp, CheckCircle, BrainCircuit, Sun, Moon, ArrowRight, Zap, BarChart3, Globe, Trash2 } from 'lucide-react'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

function App() {
  const [isDark, setIsDark] = useState(false)

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    } else {
      setIsDark(false)
      document.documentElement.classList.remove('dark')
    }
  }, [])

  const toggleTheme = () => {
    setIsDark(!isDark)
    if (!isDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans transition-colors duration-300 flex flex-col">
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-2 group cursor-pointer">
            <TrendingUp className="h-5 w-5 text-primary transition-transform duration-300 group-hover:-translate-y-0.5" />
            <span className="text-xl font-bold tracking-tight">InvestIQ</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <SignedIn>
              <UserButton appearance={{ elements: { userButtonAvatarBox: "w-8 h-8 rounded-md" } }} />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost" className="font-medium rounded-md px-6">
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </header>
      
      <main className="flex-1 w-full flex flex-col items-center relative z-10">
        <SignedOut>
          <LandingPage />
        </SignedOut>
        <SignedIn>
          <div className="container mx-auto px-4 py-12 md:py-20 flex flex-col items-center">
            <Dashboard />
          </div>
        </SignedIn>
      </main>

      <footer className="bg-background text-muted-foreground py-8 text-center text-sm mt-auto border-t border-border/40">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-medium text-xs">© 2026 InvestIQ AI. All rights reserved.</p>
          <p className="flex items-center gap-2 text-xs">
            <AlertTriangle className="h-3 w-3" /> 
            Not financial advice. Use AI reasoning with caution.
          </p>
        </div>
      </footer>
    </div>
  )
}

function LandingPage() {
  return (
    <div className="w-full flex flex-col items-center animate-in fade-in duration-700 relative">
      {/* Aesthetic Dot Background */}
      <div 
        className="absolute inset-0 -z-10 h-[100vh] w-full pointer-events-none opacity-40 dark:opacity-20"
        style={{
          backgroundImage: 'radial-gradient(var(--foreground) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          WebkitMaskImage: 'radial-gradient(ellipse 60% 60% at 50% 30%, #000 20%, transparent 100%)',
          maskImage: 'radial-gradient(ellipse 60% 60% at 50% 30%, #000 20%, transparent 100%)'
        }}
      />

      {/* Hero Section */}
      <section className="w-full max-w-5xl text-center px-4 pt-32 pb-24 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted/50 text-xs font-medium mb-8 hover:bg-muted transition-colors cursor-pointer group">
          <Zap className="h-3 w-3 text-primary group-hover:animate-pulse" />
          <span>Powered by Llama 3.3 70B</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-8 animate-in slide-in-from-bottom-4 duration-700 delay-100 leading-[1.15]">
          Smarter insights. <br className="hidden md:block"/>
          <div className="mt-2 md:mt-4 inline-block">
            <span className="text-muted-foreground">Better </span>
            <span className="inline-block bg-[#fdf2b3] dark:bg-[#fdf2b3] text-yellow-950 px-5 py-1.5 -rotate-3 shadow-[2px_5px_12px_rgba(0,0,0,0.15)] rounded-sm ml-2 transform hover:rotate-0 hover:scale-105 transition-all cursor-default border border-[#e6d991] font-handwriting relative group overflow-visible">
              {/* Top tape */}
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-10 h-4 bg-white/40 backdrop-blur-sm border border-black/5 shadow-sm rotate-3 skew-x-12 z-20"></span>
              
              {/* Page curl bottom-right */}
              <span className="absolute -bottom-[1px] -right-[1px] w-4 h-4 bg-gradient-to-tl from-[#cbbd6d] to-[#fdf2b3] shadow-[-2px_-2px_4px_rgba(0,0,0,0.1)] rounded-tl-md border-t border-l border-[#e6d991] transition-all group-hover:w-5 group-hover:h-5 z-20"></span>
              
              <span className="relative z-10">decisions.</span>
            </span>
          </div>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-12 font-medium animate-in slide-in-from-bottom-4 duration-700 delay-200">
          Autonomous AI agents scour the web, analyze real-time financial data, and deliver clear investment recommendations.
        </p>
        <div className="animate-in slide-in-from-bottom-4 duration-700 delay-300">
          <SignInButton mode="modal">
            <Button size="lg" className="h-14 px-8 text-base rounded-md font-medium group transition-all hover:ring-4 ring-primary/20 hover:-translate-y-0.5">
              Start Researching
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
            </Button>
          </SignInButton>
        </div>
      </section>

      {/* How it Works - Interactive Minimal Grid */}
      <section className="w-full bg-muted/30 border-y border-border/40 py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">How it works</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Three steps to robust due diligence.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard 
              delay="delay-100"
              icon={Globe}
              title="1. Web Scraping"
              description="Queries Wikipedia and business directories to map core business models and market positioning."
            />
            <FeatureCard 
              delay="delay-200"
              icon={BarChart3}
              title="2. Financial Context"
              description="Pulls real-time stock symbols, sector categorizations, and recent headlines via Yahoo Finance."
            />
            <FeatureCard 
              delay="delay-300"
              icon={BrainCircuit}
              title="3. AI Synthesis"
              description="An LLM weighs the gathered data to output a structured, logical 'Invest' or 'Pass' verdict."
            />
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="w-full max-w-3xl text-center px-4 py-24">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Upgrade your portfolio</h2>
        <p className="text-muted-foreground mb-8">Stop guessing. Let AI do the heavy lifting.</p>
        <SignInButton mode="modal">
          <Button size="lg" variant="outline" className="h-12 px-8 rounded-md font-medium transition-all hover:bg-foreground hover:text-background hover:scale-105 active:scale-95">
            Create account
          </Button>
        </SignInButton>
      </section>
      
    </div>
  )
}

function FeatureCard({ title, description, icon: Icon, delay }: any) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`group relative bg-background p-8 rounded-xl border border-border transition-all duration-500 overflow-hidden animate-in fade-in slide-in-from-bottom-8 fill-mode-both ${delay} hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5`}
    >
      {/* Mouse Tracking Spotlight */}
      <div 
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, var(--primary), transparent 40%)`,
          opacity: 0.03
        }}
      />
      {/* Top Border Gradient Reveal */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -translate-x-full group-hover:translate-x-0" />
      
      <Icon className="h-6 w-6 text-muted-foreground mb-6 group-hover:text-primary group-hover:scale-110 transition-all duration-300 ease-out" />
      <h3 className="text-lg font-bold mb-2 flex items-center justify-between">
        {title}
        <ArrowRight className="h-4 w-4 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 ease-out text-primary" />
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed group-hover:text-foreground transition-colors duration-300">
        {description}
      </p>
    </div>
  )
}

function Dashboard() {
  const [companyName, setCompanyName] = useState('')
  const [loading, setLoading] = useState(false)
  const [streamData, setStreamData] = useState<{ companyName: string, tools: string[], reasoning: string, decision: string | null } | null>(null)
  const [chartData, setChartData] = useState<{ symbol: string, data: any[] } | null>(null)
  const [history, setHistory] = useState<any[]>([])
  const [error, setError] = useState('')
  const { getToken } = useAuth()
  
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = await getToken()
        if (token) {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/history`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          if (res.ok) {
            const data = await res.json()
            setHistory(data)
          }
        }
      } catch (err) {
        console.error("Failed to fetch history:", err)
      }
    }
    fetchHistory()
  }, [getToken])

  useEffect(() => {
    if (loading && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [streamData?.reasoning, loading])

  const handleResearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!companyName.trim() || loading) return
    
    if (companyName.trim().length < 3) {
      setError('Please enter a valid company name (at least 3 characters).')
      return
    }

    setLoading(true)
    setError('')
    setStreamData({ companyName: companyName.trim(), tools: [], reasoning: '', decision: null })
    setChartData(null)

    try {
      const token = await getToken()
      
      // Fetch chart data in parallel
      fetch(`${import.meta.env.VITE_API_URL}/api/stock-chart?companyName=${encodeURIComponent(companyName)}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => res.json())
      .then(data => {
        if (data.symbol && data.data) {
          setChartData(data);
        }
      })
      .catch(console.error);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/research`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ companyName })
      })

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('API rate limit reached. Please wait a minute and try again.')
        }
        throw new Error('Failed to start research')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      
      if (!reader) throw new Error('No stream available')

      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        
        const chunkString = decoder.decode(value, { stream: true })
        const events = chunkString.split('\n\n').filter(Boolean)
        
        for (const ev of events) {
          if (ev.startsWith('data: ')) {
            try {
              const data = JSON.parse(ev.replace('data: ', ''))
              
              if (data.type === 'tool') {
                setStreamData(prev => prev ? { ...prev, tools: [...prev.tools, data.data] } : null)
              } else if (data.type === 'chunk') {
                setStreamData(prev => prev ? { ...prev, reasoning: prev.reasoning + data.data } : null)
              } else if (data.type === 'done') {
                setStreamData(prev => prev ? { ...prev, decision: data.decision, reasoning: data.reasoning } : null)
              } else if (data.type === 'saved') {
                setHistory(prev => [{
                  id: data.id,
                  companyName: companyName,
                  decision: streamData?.decision || 'Pass',
                  reasoning: streamData?.reasoning || ''
                }, ...prev])
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/history`, { headers: { Authorization: `Bearer ${token}` } })
                if (res.ok) setHistory(await res.json())
              } else if (data.type === 'error') {
                throw new Error(data.error || data.data || 'Streaming error')
              }
            } catch (e) {
               console.error("Parse error on chunk:", e)
            }
          }
        }
      }

    } catch (err: any) {
      console.error(err)
      setError(err.message || 'An error occurred during research')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const token = await getToken();
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/history/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setHistory(prev => prev.filter(item => item.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  }

  return (
    <div className="w-full max-w-4xl space-y-12 animate-in fade-in duration-500">
      
      {/* Search Header */}
      <div className="text-center space-y-4 mb-8">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          Analyze any company
        </h2>
        <p className="text-muted-foreground text-base max-w-xl mx-auto">
          Enter a company name below and our AI agent will scrape the web and crunch financial data to give you an investment verdict.
        </p>
      </div>

      {/* Clean SaaS Input */}
      <div className="w-full max-w-2xl mx-auto">
        <form onSubmit={handleResearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              type="text" 
              placeholder="e.g. Apple, NVIDIA, Tesla..." 
              className="h-14 pl-12 pr-4 bg-background border-border text-base md:text-lg focus-visible:ring-1 focus-visible:ring-primary shadow-sm w-full"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="relative w-full sm:w-auto shrink-0 h-14 group rounded-md">
            {/* Masked Border Container */}
            <div 
              className="absolute inset-0 rounded-md overflow-hidden pointer-events-none"
              style={{
                padding: '1.5px',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude'
              }}
            >
              <div 
                className="absolute inset-[-1000%] animate-[spin_3s_linear_infinite]" 
                style={{ backgroundImage: 'conic-gradient(from 90deg at 50% 50%, transparent 0%, transparent 35%, var(--primary) 50%, transparent 65%, transparent 100%)' }}
              />
            </div>

            <Button 
              type="submit" 
              disabled={loading || !companyName.trim()} 
              className="relative h-full w-full px-8 font-semibold text-base bg-transparent text-foreground hover:bg-muted/20 border-none rounded-md transition-colors"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  Analyzing
                </span>
              ) : 'Research'}
            </Button>
          </div>
        </form>
      </div>

      {error && (
        <div className="max-w-2xl mx-auto p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive flex items-center gap-3 text-sm font-medium">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* The Report */}
      {streamData && (
        <div className="max-w-3xl mx-auto pt-4 animate-in slide-in-from-bottom-4 duration-500">
          <div className="bg-card text-card-foreground border border-border shadow-sm rounded-xl p-6 md:p-8">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-border/50">
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight">{streamData.companyName}</h3>
              {streamData.decision && (
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide border ${
                  streamData.decision === 'Invest' 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-900' 
                    : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-400 dark:border-rose-900'
                }`}>
                  {streamData.decision}
                </span>
              )}
            </div>

            {/* Tools Stream (Inline Badges) */}
            {(streamData.tools.length > 0 || (loading && !streamData.decision)) && (
              <div className="mb-6 flex flex-wrap gap-2">
                {streamData.tools.map((t, i) => (
                  <div key={i} className="text-xs font-semibold px-2.5 py-1 bg-muted border border-border/50 rounded-md text-muted-foreground flex items-center gap-1.5 animate-in zoom-in-95 duration-300">
                    <CheckCircle className="h-3 w-3 text-primary" /> {t}
                  </div>
                ))}
                {loading && !streamData.decision && (
                  <div className="text-xs font-semibold px-2.5 py-1 bg-primary/5 border border-primary/20 rounded-md text-primary flex items-center gap-1.5 animate-pulse">
                    <div className="h-3 w-3 border-2 border-primary border-t-transparent rounded-full animate-spin" /> Working...
                  </div>
                )}
              </div>
            )}

            {/* Reasoning Stream */}
            <div 
              ref={scrollContainerRef}
              className="prose prose-neutral dark:prose-invert max-w-none max-h-[60vh] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
            >
              <div className="text-foreground/90 font-normal leading-relaxed whitespace-pre-wrap text-[15px] md:text-base">
                {streamData.reasoning}
                {loading && streamData.reasoning.length > 0 && (
                  <span className="inline-block w-2 h-4 ml-1 bg-primary/70 align-middle animate-pulse"></span>
                )}
              </div>
            </div>

            {/* Stock Trend Graph */}
            {chartData && (
              <div className="mt-8 pt-6 border-t border-border/50 animate-in slide-in-from-bottom-4 duration-500">
                <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">
                  {chartData.symbol} - 3 Month Trend
                </h4>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData.data}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" opacity={0.1} />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                        minTickGap={30}
                      />
                      <YAxis 
                        domain={['auto', 'auto']}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                        tickFormatter={(value) => `$${value}`}
                        width={60}
                      />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', borderRadius: '8px', color: 'var(--foreground)' }}
                        itemStyle={{ color: 'var(--foreground)' }}
                        formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="price" 
                        stroke="var(--primary)" 
                        strokeWidth={2}
                        dot={false}
                        activeDot={{ r: 4, fill: 'var(--primary)' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* History Section */}
      {history.length > 0 && (
        <div className="pt-12 space-y-6 max-w-3xl mx-auto border-t border-border/40">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-foreground">Recent Research</h3>
            <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">{history.length} Saved</span>
          </div>
          <div className="flex flex-col gap-3">
            {history.map((item, idx) => (
              <HistoryCard key={item.id || idx} item={item} onDelete={handleDelete} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function HistoryCard({ item, onDelete }: { item: any, onDelete: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false)
  const isInvest = item.decision?.toLowerCase() === 'invest'

  return (
    <div className="bg-card text-card-foreground border border-border hover:border-border/80 rounded-lg overflow-hidden transition-all shadow-sm">
      {/* Header */}
      <div 
        className="w-full flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors group"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4">
          <div>
            <h4 className="font-semibold text-base tracking-tight">{item.companyName}</h4>
            <div className="mt-1">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                isInvest ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400' : 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
              }`}>
                {item.decision}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
            className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors opacity-0 group-hover:opacity-100"
            title="Delete report"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <div className="text-muted-foreground p-1.5 rounded-md hover:bg-muted transition-colors">
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </div>
      </div>
      
      {/* Expanded Content */}
      <div className={`transition-all duration-300 ease-in-out ${expanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-4 pt-0 border-t border-border/50">
          <div className="mt-4 text-foreground/80 text-sm font-normal leading-relaxed whitespace-pre-wrap">
            {item.reasoning}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
