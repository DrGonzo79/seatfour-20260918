"use client";

import { useMemo, useState } from "react";
import { ArrowRight, CalendarDays, Check, CircleAlert, Clock3, Dices, LoaderCircle, MapPin, ShieldCheck, Sparkles, Star, Users, X } from "lucide-react";
import demo from "../data/demo.json";

type Skill = "learning" | "casual" | "competitive";
type Match = (typeof demo.tables)[number] & { score: number; reasons: string[] };

const skillLabels: Record<Skill, string> = { learning: "Learning", casual: "Casual", competitive: "Competitive" };

function rankTables(game: string, skill: Skill, night: string, radius: number): Match[] {
  return demo.tables
    .filter((table) => table.game === game && table.night === night && table.distance <= radius && table.openSeats > 0)
    .map((table) => {
      const skillGap = Math.abs(demo.skillOrder[skill] - demo.skillOrder[table.skill as Skill]);
      const score = Math.max(50, Math.round(100 - table.distance * 5 - skillGap * 16 + table.openSeats * 2));
      const reasons = [skillGap === 0 ? `${skillLabels[skill]} pace matches` : "Welcomes adjacent skill levels", `${table.distance.toFixed(1)} miles away`, `${table.openSeats} open ${table.openSeats === 1 ? "seat" : "seats"}`];
      return { ...table, score, reasons };
    })
    .sort((a, b) => b.score - a.score);
}

export default function Home() {
  const [game, setGame] = useState("Catan");
  const [skill, setSkill] = useState<Skill>("casual");
  const [night, setNight] = useState("Friday");
  const [radius, setRadius] = useState("8");
  const [matches, setMatches] = useState<Match[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [joinedId, setJoinedId] = useState<string | null>(null);
  const selectedGame = useMemo(() => demo.games.find((item) => item.name === game), [game]);

  function findTable(event: React.FormEvent) {
    event.preventDefault();
    const miles = Number(radius);
    if (!Number.isFinite(miles) || miles < 1 || miles > 30) {
      setError("Travel radius must be between 1 and 30 miles."); setMatches(null); return;
    }
    setError(""); setJoinedId(null); setMatches(null); setLoading(true);
    window.setTimeout(() => { setMatches(rankTables(game, skill, night, miles)); setLoading(false); }, 550);
  }

  function loadExample(kind: "social" | "strategy") {
    if (kind === "social") { setGame("Catan"); setSkill("casual"); setNight("Friday"); setRadius("8"); }
    else { setGame("Chess"); setSkill("competitive"); setNight("Tuesday"); setRadius("12"); }
    setMatches(null); setJoinedId(null); setError("");
  }

  return <>
    <a className="skip" href="#match-lab">Skip to table matcher</a>
    <header className="topbar">
      <a href="#top" className="brand" aria-label="SeatFour home"><span><Dices /></span>SeatFour</a>
      <nav aria-label="Page"><a href="#match-lab">Find a table</a><a href="#how">How it works</a></nav>
      <span className="demo-pill"><i /> FICTIONAL TABLES · DEMO MATCHING</span>
    </header>
    <main id="top">
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow"><Sparkles size={15}/> SHOW UP ALONE. LEAVE WITH A TABLE.</span>
          <h1>Your next game night<br/><em>already has a seat.</em></h1>
          <p>SeatFour matches solo players into compatible tables at trusted local game stores—by game, pace, night, and distance.</p>
          <a className="primary" href="#match-lab">Find your table <ArrowRight /></a>
          <div className="trust"><span><ShieldCheck/> Venue hosted</span><span><Users/> Groups of four</span><span><CalendarDays/> One night at a time</span></div>
        </div>
        <div className="table-preview" aria-hidden="true">
          <div className="preview-head"><span>FRIDAY · 7:00 PM</span><b>1 seat held</b></div>
          <div className="game-mark"><Dices/><small>TABLE 04</small><strong>Catan</strong><span>Casual · 75 min</span></div>
          <div className="seats"><i className="filled">MJ</i><i className="filled">AR</i><i className="filled">KL</i><i>YOU</i></div>
          <div className="venue"><MapPin/><span><b>Corner Meeple</b><small>2.4 mi · Host verified</small></span></div>
        </div>
      </section>
      <section className="match-section" id="match-lab">
        <div className="section-title"><span>MATCHING BOARD 01</span><h2>Build your ideal table.</h2><p>No group chat, no organizer hunt. Pick four constraints and see the fit.</p></div>
        <div className="match-grid">
          <form className="input-card" onSubmit={findTable}>
            <div className="card-head"><span><small>PLAYER CARD</small><h3>Your game night</h3></span><Dices/></div>
            <div className="examples"><button type="button" onClick={() => loadExample("social")}>Social Friday</button><button type="button" onClick={() => loadExample("strategy")}>Chess Tuesday</button></div>
            <label><span>Game</span><select aria-label="Game" value={game} onChange={(e) => { setGame(e.target.value); setMatches(null); }}>{demo.games.map((item) => <option key={item.name}>{item.name}</option>)}</select><small>{selectedGame?.description}</small></label>
            <fieldset><legend>Preferred pace</legend><div className="choice-grid">{(Object.keys(skillLabels) as Skill[]).map((item) => <button type="button" key={item} className={skill === item ? "selected" : ""} onClick={() => { setSkill(item); setMatches(null); }}>{skillLabels[item]}</button>)}</div></fieldset>
            <fieldset><legend>Available night</legend><div className="choice-grid nights">{demo.nights.map((item) => <button type="button" key={item} className={night === item ? "selected" : ""} onClick={() => { setNight(item); setMatches(null); }}>{item}</button>)}</div></fieldset>
            <label><span>Maximum travel</span><div className="distance"><input aria-label="Travel radius" inputMode="numeric" value={radius} onChange={(e) => setRadius(e.target.value)}/><i>miles</i></div></label>
            {error && <div className="error" role="alert"><CircleAlert/>{error}</div>}
            <button className="run" disabled={loading}>{loading ? <><LoaderCircle className="spin"/>Checking tables…</> : <>Match me <ArrowRight/></>}</button>
          </form>
          <section className="results-card" aria-live="polite">
            <div className="card-head"><span><small>LOCAL TABLES</small><h3>{matches ? `${matches.length} matches` : "Ready when you are"}</h3></span><MapPin/></div>
            {loading && <div className="empty"><LoaderCircle className="spin"/><h4>Shuffling the tables</h4><p>Comparing pace, availability, seats, and distance.</p></div>}
            {!loading && matches === null && <div className="empty"><div className="empty-icon"><Users/></div><h4>No search yet.</h4><p>Use a demo profile or set your own constraints, then match into a table.</p></div>}
            {!loading && matches?.length === 0 && <div className="empty"><div className="empty-icon"><X/></div><h4>No clean fit tonight.</h4><p>Try another night, game, or a wider radius. We never fabricate a table.</p></div>}
            {!loading && matches && matches.length > 0 && <div className="results">{matches.map((match) => <article className={joinedId === match.id ? "joined" : ""} key={match.id}>
              <div className="result-top"><span className="score"><Star/>{match.score}% fit</span><span>{match.openSeats} {match.openSeats === 1 ? "seat" : "seats"} open</span></div>
              <h4>{match.game} at {match.venue}</h4><p><Clock3/>{match.night} · {match.time} · {match.duration}</p><p><MapPin/>{match.neighborhood} · {match.distance.toFixed(1)} mi</p>
              <ul>{match.reasons.map((reason) => <li key={reason}><Check/>{reason}</li>)}</ul>
              {joinedId !== match.id ? <button type="button" onClick={() => setJoinedId(match.id)}>Hold this seat <ArrowRight/></button> : <div className="confirmation"><Check/><span><b>Seat held for 10 minutes</b><small>Demo only—no reservation or message was sent.</small></span><button type="button" onClick={() => setJoinedId(null)}>Release</button></div>}
            </article>)}</div>}
          </section>
        </div>
      </section>
      <section className="how" id="how"><span>THE PAID WEDGE</span><h2>Fill empty store seats, reliably.</h2><p>The first buyer is an independent game-store events manager with recurring half-full tables. Players join free; stores pay for confirmed attendance and no-show controls.</p><div className="metrics"><b>$149<small>/store / month target</small></b><b>4 seats<small>default table size</small></b><b>21 days<small>concierge pilot</small></b></div></section>
    </main>
    <footer><a href="#top" className="brand"><span><Dices/></span>SeatFour</a><p>Fictional prototype · Simulated matching · No live booking or messaging.</p><a href="https://www.ideabrowser.com/hub/ideas/player-matching-that-fills-local-game-store-tables-4f007804">Public source ↗</a></footer>
  </>;
}
