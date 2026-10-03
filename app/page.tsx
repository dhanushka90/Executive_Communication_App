"use client";

import { ArrowLeft, ArrowRight, Bookmark, BookmarkCheck, Check, ChevronRight, CircleHelp, Clock3, Command, Flame, Headphones, Menu, MessageCircle, Mic2, Search, Sparkles, Target, X, Zap } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type Region = "Canada" | "United States" | "Global";
type PhraseType = "Idiom" | "Slang" | "Power word" | "Transition";
type Phrase = { id: string; dbId?: string; phrase: string; meaning: string; example: string; region: Region; type: PhraseType; context: string[]; tone: "Casual" | "Neutral" | "Polished" };

const phrases: Phrase[] = [
  { id: "move-needle", phrase: "Move the needle", meaning: "Create a noticeable or meaningful impact.", example: "Let’s focus on the two initiatives most likely to move the needle this quarter.", region: "United States", type: "Idiom", context: ["Strategy", "Results"], tone: "Polished" },
  { id: "circle-back", phrase: "Circle back", meaning: "Return to a topic or reconnect later.", example: "I’ll circle back after I’ve spoken with finance.", region: "Global", type: "Idiom", context: ["Follow-up", "Meetings"], tone: "Neutral" },
  { id: "double-click", phrase: "Double-click on that", meaning: "Explore one point in greater detail.", example: "Could we double-click on the customer retention number?", region: "United States", type: "Slang", context: ["Clarifying", "Data"], tone: "Neutral" },
  { id: "table-stakes", phrase: "Table stakes", meaning: "The minimum requirement for competing effectively.", example: "Fast onboarding is table stakes now; the differentiator is ongoing support.", region: "United States", type: "Idiom", context: ["Strategy", "Competition"], tone: "Polished" },
  { id: "net-net", phrase: "Net-net", meaning: "The final conclusion after considering everything.", example: "Net-net, the investment pays back within eighteen months.", region: "United States", type: "Slang", context: ["Summarizing", "Finance"], tone: "Neutral" },
  { id: "runway", phrase: "Runway", meaning: "The time or resources available before a limit is reached.", example: "This gives the team enough runway to test before the launch.", region: "Global", type: "Power word", context: ["Planning", "Resources"], tone: "Polished" },
  { id: "alignment", phrase: "Alignment", meaning: "Shared understanding and agreement on direction.", example: "Before we proceed, I’d like to confirm alignment on the outcome.", region: "Global", type: "Power word", context: ["Consensus", "Leadership"], tone: "Polished" },
  { id: "north-star", phrase: "North star", meaning: "A guiding goal that shapes decisions.", example: "Customer trust remains our north star through this transition.", region: "Global", type: "Idiom", context: ["Vision", "Strategy"], tone: "Polished" },
  { id: "socialize", phrase: "Socialize the idea", meaning: "Share an idea informally to gather input and support.", example: "Let’s socialize the proposal with the regional leads before Friday.", region: "United States", type: "Slang", context: ["Influence", "Planning"], tone: "Neutral" },
  { id: "land-plane", phrase: "Land the plane", meaning: "Bring a discussion to a conclusion.", example: "We have five minutes left, so let’s land the plane on ownership.", region: "United States", type: "Idiom", context: ["Facilitation", "Decisions"], tone: "Neutral" },
  { id: "give-er", phrase: "Give’er", meaning: "Put in a strong effort or proceed energetically.", example: "The plan is solid—let’s give’er and get the pilot out this week.", region: "Canada", type: "Slang", context: ["Motivation", "Casual"], tone: "Casual" },
  { id: "beauty", phrase: "Beauty", meaning: "Something excellent, successful, or especially useful.", example: "That revised forecast is a beauty—clear and decision-ready.", region: "Canada", type: "Slang", context: ["Praise", "Casual"], tone: "Casual" },
  { id: "out-for-rip", phrase: "Out for a rip", meaning: "Going out briefly, often for a drive or quick break.", example: "I’m heading out for a quick rip before the afternoon sessions.", region: "Canada", type: "Slang", context: ["Small talk", "Casual"], tone: "Casual" },
  { id: "toque", phrase: "Toque", meaning: "A knitted winter hat.", example: "You’ll want a toque if you’re walking to dinner tonight.", region: "Canada", type: "Slang", context: ["Small talk", "Weather"], tone: "Casual" },
  { id: "two-four", phrase: "Two-four", meaning: "A case of twenty-four beers.", example: "They picked up a two-four for the cottage weekend.", region: "Canada", type: "Slang", context: ["Social", "Small talk"], tone: "Casual" },
  { id: "cottage-country", phrase: "Cottage country", meaning: "Popular rural lake regions where people vacation.", example: "Traffic north is heavy—everyone’s heading to cottage country.", region: "Canada", type: "Idiom", context: ["Travel", "Small talk"], tone: "Casual" },
  { id: "low-hanging-fruit", phrase: "Low-hanging fruit", meaning: "The easiest opportunities to act on first.", example: "We’ll capture the low-hanging fruit while the larger redesign is underway.", region: "Global", type: "Idiom", context: ["Prioritizing", "Strategy"], tone: "Neutral" },
  { id: "at-the-end", phrase: "At the end of the day", meaning: "When the most important consideration is stated.", example: "At the end of the day, adoption is the measure that matters.", region: "Global", type: "Transition", context: ["Summarizing", "Decisions"], tone: "Neutral" },
  { id: "thoughtful", phrase: "Thoughtful", meaning: "Carefully considered and attentive to consequences.", example: "That’s a thoughtful way to sequence the rollout.", region: "Global", type: "Power word", context: ["Praise", "Feedback"], tone: "Polished" },
  { id: "material", phrase: "Material", meaning: "Significant enough to affect a decision or outcome.", example: "We don’t expect a material impact on this quarter’s guidance.", region: "Global", type: "Power word", context: ["Finance", "Risk"], tone: "Polished" },
  { id: "pragmatic", phrase: "Pragmatic", meaning: "Focused on practical, workable solutions.", example: "A phased launch is the most pragmatic path forward.", region: "Global", type: "Power word", context: ["Decisions", "Leadership"], tone: "Polished" },
  { id: "unpack", phrase: "Unpack", meaning: "Examine a complex topic piece by piece.", example: "Let’s unpack the assumptions behind that estimate.", region: "Global", type: "Power word", context: ["Clarifying", "Analysis"], tone: "Neutral" },
  { id: "build-on", phrase: "Building on that", meaning: "Connect your point constructively to a previous idea.", example: "Building on Priya’s point, we can test this with one region first.", region: "Global", type: "Transition", context: ["Collaboration", "Meetings"], tone: "Polished" },
  { id: "zoom-out", phrase: "Zoom out", meaning: "Return to the broader context or strategic view.", example: "Let’s zoom out and reconnect this decision to our annual priorities.", region: "Global", type: "Idiom", context: ["Strategy", "Facilitation"], tone: "Polished" },
];
const dailyIds = ["move-needle", "double-click", "give-er", "thoughtful", "build-on"];

function mapRemotePhrase(item: { id: string; slug: string; phrase: string; meaning: string; example: string; region: Region; type: PhraseType; context: string[]; tone: Phrase["tone"] }): Phrase {
  return { id: item.slug, dbId: item.id, phrase: item.phrase, meaning: item.meaning, example: item.example, region: item.region, type: item.type, context: item.context ?? [], tone: item.tone };
}

function Flag({ region }: { region: Region }) { return <span className={`flag flag-${region === "Canada" ? "ca" : region === "United States" ? "us" : "global"}`} aria-label={region}>{region === "Canada" ? "CA" : region === "United States" ? "US" : "GL"}</span>; }
function BrandMark() { return <span className="brand-mark"><span>B</span></span>; }

async function copyToClipboard(value: string) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }
    const helper = document.createElement("textarea");
    helper.value = value;
    helper.setAttribute("readonly", "");
    helper.style.position = "fixed";
    helper.style.opacity = "0";
    document.body.appendChild(helper);
    helper.select();
    const copied = document.execCommand("copy");
    helper.remove();
    return copied;
  } catch {
    return false;
  }
}

function PhraseCard({ phrase, saved, onSave, onPractice }: { phrase: Phrase; saved: boolean; onSave: () => void; onPractice: () => void }) {
  return <article className="phrase-card">
    <div className="phrase-card-top"><div className="pill-row"><Flag region={phrase.region} /><span className="type-pill">{phrase.type}</span><span className={`tone-dot tone-${phrase.tone.toLowerCase()}`}>{phrase.tone}</span></div><button className="icon-button" onClick={onSave} aria-label={saved ? "Remove bookmark" : "Bookmark phrase"}>{saved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}</button></div>
    <h3>{phrase.phrase}</h3><p className="meaning">{phrase.meaning}</p><div className="example"><span>“</span><p>{phrase.example}</p></div>
    <div className="card-footer"><div className="context-list">{phrase.context.map(item => <span key={item}>{item}</span>)}</div><button className="practice-link" onClick={onPractice}><Mic2 size={15} /> Practise</button></div>
  </article>;
}

function DailyView({ catalog, savedIds, toggleSaved, completed, completePhrase }: { catalog: Phrase[]; savedIds: string[]; toggleSaved: (id: string) => void; completed: string[]; completePhrase: (id: string) => void }) {
  const [active, setActive] = useState(0); const [showCoach, setShowCoach] = useState(false);
  const daily = dailyIds.map(id => catalog.find(item => item.id === id)!).filter(Boolean); const item = daily[active] ?? catalog[0];
  const progress = Math.round((completed.filter(id => dailyIds.includes(id)).length / daily.length) * 100);
  const currentDate = new Intl.DateTimeFormat("en-CA", { weekday: "long", month: "long", day: "numeric" }).format(new Date());
  const next = () => { setActive(value => (value + 1) % daily.length); setShowCoach(false); }; const previous = () => { setActive(value => (value - 1 + daily.length) % daily.length); setShowCoach(false); };
  return <main>
    <section className="daily-hero"><div><div className="eyebrow"><span className="eyebrow-line" /> TODAY’S BRIEFING <span className="eyebrow-date">{currentDate}</span></div><h1>Sound sharper.<br /><em>Stay yourself.</em></h1><p>Five phrases, handpicked for the conversations on your calendar.</p></div>
      <div className="streak-card"><div className="streak-icon"><Flame size={22} /></div><div><strong>12 day streak</strong><span>Personal best: 18</span></div><div className="mini-week">{["M","T","W","T","F"].map((day, i) => <span key={`${day}-${i}`} className={i < 4 ? "done" : "today"}>{i < 4 ? <Check size={10} /> : day}</span>)}</div></div></section>
    <section className="lesson-shell"><div className="lesson-toolbar"><div><span className="lesson-count">0{active + 1}</span><span className="lesson-total"> / 05</span></div><div className="progress-track"><span style={{ width: `${((active + 1) / daily.length) * 100}%` }} /></div><div className="lesson-controls"><button onClick={previous} aria-label="Previous phrase"><ArrowLeft size={18} /></button><button onClick={next} aria-label="Next phrase"><ArrowRight size={18} /></button></div></div>
      <div className="featured-lesson"><div className="lesson-content"><div className="pill-row"><Flag region={item.region} /><span className="type-pill">{item.type}</span><span className={`tone-dot tone-${item.tone.toLowerCase()}`}>{item.tone}</span></div><h2>{item.phrase}</h2><p className="featured-meaning">{item.meaning}</p><div className="say-this"><span>SAY THIS</span><p>“{item.example}”</p></div><div className="lesson-actions"><button className="primary-button" onClick={() => { completePhrase(item.id); setShowCoach(true); }}><Mic2 size={17} /> Mark as practised</button><button className="secondary-button" onClick={() => toggleSaved(item.id)}>{savedIds.includes(item.id) ? <BookmarkCheck size={17} /> : <Bookmark size={17} />} {savedIds.includes(item.id) ? "Saved" : "Save phrase"}</button></div>{showCoach && <div className="coach-note"><Sparkles size={16} /><span><strong>Coach’s note:</strong> Pause slightly before the phrase. It will sound intentional, not rehearsed.</span></div>}</div>
        <aside className="when-to-use"><span className="aside-label">WHEN TO USE IT</span><div className="scenario"><span><Target size={18} /></span><div><strong>Best moment</strong><p>{item.context.includes("Clarifying") ? "When a key detail needs more attention" : "When the team needs a clear, memorable point"}</p></div></div><div className="scenario"><span><MessageCircle size={18} /></span><div><strong>Sounds natural in</strong><p>{item.tone === "Casual" ? "Team chats and informal small talk" : "Leadership updates and decision meetings"}</p></div></div><div className="scenario"><span><Zap size={18} /></span><div><strong>Delivery tip</strong><p>Use it once, then follow with a specific fact or action.</p></div></div></aside></div></section>
    <section className="daily-bottom"><div className="week-progress"><div className="section-heading"><div><span className="eyebrow">YOUR WEEK</span><h2>Momentum, not homework.</h2></div><span className="percent">{progress}% today</span></div><div className="large-progress"><span style={{ width: `${progress}%` }} /></div><p>{completed.length ? `${completed.filter(id => dailyIds.includes(id)).length} of 5 phrases practised. Keep it light and repeat what feels useful.` : "Start with one phrase. Confidence comes from small, repeated wins."}</p></div><div className="reflection-card"><CircleHelp size={23} /><div><strong>One-minute reflection</strong><p>Which conversation today could benefit from more clarity?</p></div><ChevronRight size={20} /></div></section>
  </main>;
}

function SearchView({ catalog, savedIds, toggleSaved, initialQuery = "" }: { catalog: Phrase[]; savedIds: string[]; toggleSaved: (id: string) => void; initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery); const [region, setRegion] = useState<"All" | Region>("All"); const [type, setType] = useState<"All" | PhraseType>("All"); const [copied, setCopied] = useState<string | null>(null); const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { inputRef.current?.focus(); }, []);
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const intent = q.includes("clarif") ? "clarifying" : q.includes("decis") ? "decisions" : q.includes("small talk") ? "small talk" : q.includes("wrap") || q.includes("conclud") ? "summarizing" : q.includes("disagree") ? "collaboration" : "";
    const tokens = q.split(/\s+/).filter(word => word.length > 3);
    return catalog.filter(item => {
      const text = `${item.phrase} ${item.meaning} ${item.example} ${item.context.join(" ")}`.toLowerCase();
      const matchesQuery = !q || text.includes(q) || (intent ? text.includes(intent) : tokens.some(word => text.includes(word)));
      return matchesQuery && (region === "All" || item.region === region) && (type === "All" || item.type === type);
    });
  }, [catalog, query, region, type]);
  const copyPhrase = async (item: Phrase) => { if (await copyToClipboard(item.example)) { setCopied(item.id); window.setTimeout(() => setCopied(null), 1600); } };
  return <main className="search-page"><section className="search-hero"><div className="eyebrow"><span className="eyebrow-line" /> MEETING MODE</div><h1>Find the right words.<br /><em>Right when you need them.</em></h1><p>Search by phrase, meaning, or meeting moment. Every suggestion includes a ready-to-use example.</p><div className="search-box"><Search size={22} /><input ref={inputRef} value={query} onChange={event => setQuery(event.target.value)} placeholder="Try “disagree politely” or “wrap up a meeting”" /><span><Command size={13} /> K</span></div><div className="quick-prompts"><span>QUICK START</span>{["Clarify a point", "Sound decisive", "Make small talk", "Wrap up"].map(prompt => <button key={prompt} onClick={() => setQuery(prompt)}>{prompt}</button>)}</div></section>
    <section className="results-section"><div className="filter-bar"><div className="filter-group"><span>Region</span>{(["All", "Canada", "United States", "Global"] as const).map(item => <button className={region === item ? "active" : ""} key={item} onClick={() => setRegion(item)}>{item === "United States" ? "US" : item}</button>)}</div><div className="filter-group"><span>Type</span>{(["All", "Idiom", "Slang", "Power word", "Transition"] as const).map(item => <button className={type === item ? "active" : ""} key={item} onClick={() => setType(item)}>{item}</button>)}</div></div><div className="results-header"><div><span className="result-count">{results.length}</span><h2>{query ? "useful matches" : "meeting-ready phrases"}</h2></div><p>Click any example to copy it</p></div>
      {results.length > 0 ? <div className="result-grid">{results.map(item => <article className="result-card" key={item.id}><div className="phrase-card-top"><div className="pill-row"><Flag region={item.region} /><span className="type-pill">{item.type}</span></div><button className="icon-button" onClick={() => toggleSaved(item.id)} aria-label={savedIds.includes(item.id) ? `Remove ${item.phrase} from saved` : `Save ${item.phrase}`}>{savedIds.includes(item.id) ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}</button></div><h3>{item.phrase}</h3><p className="meaning">{item.meaning}</p><button className="copy-example" onClick={() => copyPhrase(item)}><span>“{item.example}”</span><span className={copied === item.id ? "copied" : "copy-label"}>{copied === item.id ? <><Check size={14} /> Copied</> : "Copy"}</span></button><div className="context-list">{item.context.map(tag => <span key={tag}>{tag}</span>)}</div></article>)}</div> : <div className="empty-state"><Search size={26} /><h3>No exact match yet</h3><p>Try a broader meeting moment, such as “strategy,” “praise,” or “clarify.”</p><button onClick={() => { setQuery(""); setRegion("All"); setType("All"); }}>Clear filters</button></div>}
    </section></main>;
}

export default function Home() {
  const [view, setView] = useState<"daily" | "search" | "saved">("daily"); const [catalog, setCatalog] = useState<Phrase[]>(phrases); const [savedIds, setSavedIds] = useState<string[]>([]); const [completed, setCompleted] = useState<string[]>([]); const [mobileOpen, setMobileOpen] = useState(false); const [signedIn, setSignedIn] = useState(false); const [userEmail, setUserEmail] = useState<string | null>(null);
  useEffect(() => {
    try { setSavedIds(JSON.parse(localStorage.getItem("briefly-saved") || "[]")); setCompleted(JSON.parse(localStorage.getItem("briefly-completed") || "[]")); } catch {}
    void (async () => {
      try {
        const contentResponse = await fetch("/api/content");
        const content = await contentResponse.json() as { configured?: boolean; items?: Parameters<typeof mapRemotePhrase>[0][] };
        if (content.configured && content.items?.length) setCatalog(content.items.map(mapRemotePhrase));
        const meResponse = await fetch("/api/auth/me");
        const me = await meResponse.json() as { configured?: boolean; user?: { email?: string } | null };
        if (me.configured && me.user) {
          setSignedIn(true); setUserEmail(me.user.email ?? null);
          const savedResponse = await fetch("/api/me/saved");
          if (savedResponse.ok) {
            const saved = await savedResponse.json() as { items?: { content_id: string; content_items?: { slug?: string } | { slug?: string }[] }[] };
            const remoteIds = (saved.items ?? []).map(item => { const linked = Array.isArray(item.content_items) ? item.content_items[0] : item.content_items; return linked?.slug ?? item.content_id; });
            setSavedIds(remoteIds);
          }
        }
      } catch { /* local fallback remains available when Supabase is not configured */ }
    })();
  }, []);
  useEffect(() => { const onKeyDown = (event: KeyboardEvent) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setView("search"); } }; window.addEventListener("keydown", onKeyDown); return () => window.removeEventListener("keydown", onKeyDown); }, []);
  const toggleSaved = (id: string) => {
    const phrase = catalog.find(item => item.id === id);
    const isSaved = savedIds.includes(id);
    setSavedIds(current => { const next = isSaved ? current.filter(item => item !== id) : [...current, id]; localStorage.setItem("briefly-saved", JSON.stringify(next)); return next; });
    if (signedIn && phrase?.dbId) void fetch("/api/me/saved", { method: isSaved ? "DELETE" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ contentId: phrase.dbId }) });
  };
  const completePhrase = (id: string) => {
    const phrase = catalog.find(item => item.id === id);
    setCompleted(current => { const next = current.includes(id) ? current : [...current, id]; localStorage.setItem("briefly-completed", JSON.stringify(next)); return next; });
    if (signedIn && phrase?.dbId) void fetch("/api/me/practice", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ contentId: phrase.dbId }) });
  };
  return <div className="app-shell"><header className="site-header"><button className="brand" onClick={() => setView("daily")}><BrandMark /><span><strong>Briefly</strong><small>EXECUTIVE COMMUNICATION</small></span></button><nav className={mobileOpen ? "open" : ""}><button className={view === "daily" ? "active" : ""} onClick={() => { setView("daily"); setMobileOpen(false); }}>Daily briefing</button><button className={view === "search" ? "active" : ""} onClick={() => { setView("search"); setMobileOpen(false); }}>Phrase finder</button><button className={view === "saved" ? "active" : ""} onClick={() => { setView("saved"); setMobileOpen(false); }}>Saved <span>{savedIds.length}</span></button></nav><div className="header-actions"><button className="header-search" onClick={() => setView("search")}><Search size={16} /> <span>Quick find</span> <kbd><Command size={11} />K</kbd></button><button className="avatar" aria-label={signedIn ? `Signed in as ${userEmail ?? "user"}` : "Sign in"} onClick={() => { window.location.href = "/login"; }}>{signedIn ? (userEmail?.slice(0, 2).toUpperCase() ?? "ME") : "DR"}</button><button className="mobile-menu" onClick={() => setMobileOpen(value => !value)} aria-label="Toggle menu">{mobileOpen ? <X /> : <Menu />}</button></div></header>
    {view === "daily" && <DailyView catalog={catalog} savedIds={savedIds} toggleSaved={toggleSaved} completed={completed} completePhrase={completePhrase} />}{view === "search" && <SearchView catalog={catalog} savedIds={savedIds} toggleSaved={toggleSaved} />}{view === "saved" && <main className="saved-page"><div className="eyebrow"><span className="eyebrow-line" /> YOUR LIBRARY</div><h1>Words worth <em>keeping.</em></h1><p>Your personal shortlist for upcoming conversations.</p>{savedIds.length ? <div className="saved-grid">{catalog.filter(item => savedIds.includes(item.id)).map(item => <PhraseCard key={item.id} phrase={item} saved onSave={() => toggleSaved(item.id)} onPractice={() => completePhrase(item.id)} />)}</div> : <div className="empty-state saved-empty"><Bookmark size={26} /><h3>Your library is ready</h3><p>Save a phrase from today’s briefing or the phrase finder.</p><button onClick={() => setView("search")}>Explore phrases</button></div>}</main>}
    <footer><BrandMark /><span>Briefly</span><p>Practice a little. Lead with clarity.</p><div><Headphones size={15} /> Built for real conversations <Clock3 size={15} /> 5 minutes a day</div></footer></div>;
}
