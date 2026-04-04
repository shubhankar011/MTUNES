import { useState, useEffect } from 'react'
import mtunesLogo from './assets/mtunes.png'
import { Modal } from './components/Modal'
import { Dashboard } from './components/dashboard'
import './App.css'

const CLIENT_ID = '1485064494312067142';
const SCOPES = "bot identify guilds applications.commands";
const BACK_URL = import.meta.env.VITE_API_URL

function App() {
  const [Open, setOpen] = useState(false)
  const [serverCount, setServerCount] = useState(0);
  const [radioActive, setRadioActive] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    fetch(`${BACK_URL}/status`)
      .then(res => res.json())
      .then(data => {
        setServerCount(data.server);
        setRadioActive(data.radio_active || false); 
      })
      .catch(err => console.log("Bot is offline"));
  }, []);

  const login = () => {
    const address = window.location.origin;
    const discordLink = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(address)}&response_type=code&scope=${encodeURIComponent(SCOPES)}`;
    window.location.href = discordLink;
  };

  const CommandRow = ({ trigger, desc, delay }) => {
    const [show, setShow] = useState(false);

    useEffect(() => {
      const timer = setTimeout(() => setShow(true), delay);
      return () => clearTimeout(timer);
    }, [delay]);

    return (
      <div className={`flex justify-between border-b border-slate-800 pb-2 command-card ${show ? 'show' : ''}`}>
        <code className="text-indigo-400">{trigger}</code>
        <span className="text-slate-400">{desc}</span>
      </div>
    );
  };

  useEffect(() => {
    const urlNames = new URLSearchParams(window.location.search)
    const code = urlNames.get('code');

    if (code) {
      window.history.replaceState({}, document.title, "/");
      fetch(`${BACK_URL}/api/callback?code=${code}`)
        .then(res => res.json())
        .then(data => {
          console.log("Logged in!", data);
        })
    }
  }, [])

  return (
    <>
      <div className="min-h-screen bg-[#070b11] text-slate-600 font-sans">
        <nav className="flex items-center justify-between px-8 py-4 border-b border-slate-800 bg-[#12161F] fixed top-0 w-full">
          <div className="flex items-center gap-3">
            <img src={mtunesLogo} className="h-10 w-10" alt="Logo" />
            <span className="text-xl font-bold tracking-tighter text-white">MTUNES</span>
          </div>
          <div className="flex gap-6 items-center">
            <button
              onClick={() => setShowDashboard(!showDashboard)}
              className="text-slate-400 hover:text-indigo-400 font-bold transition-colors"
            >
              {showDashboard ? "Back Home" : "Live Stats"}
            </button>
            <button className="bg-indigo-200 hover:bg-indigo-500 px-5 py-2 rounded-full font-medium transition-all hover:text-indigo-50 text-black">
              <a href="https://github.com/shubhankar011/MTUNES" target="_blank" rel="noreferrer">Contribute</a>
            </button>
          </div>
        </nav>

        <main className="max-w-4xl mx-auto pt-24 md:pt-32 text-center px-4">
          {showDashboard ? (
            <Dashboard />
          ) : (
            <>
              <h1 className="text-6xl font-black text-white mb-6">
                Music that <span className="text-indigo-500">grooves</span>
              </h1>
              <p className="text-blue-900 text-lg mb-10 font-bold">
                A reliable music bot to enjoy with your friends
              </p>

              <div className="flex justify-center gap-4">
                <button onClick={login} className="bg-white text-black font-bold px-8 py-3 rounded-xl hover:bg-slate-200 transition-colors">
                  Invite Bot
                </button>
                <button onClick={() => setOpen(true)} className="bg-slate-800 text-white font-bold px-8 py-3 rounded-xl hover:bg-slate-700 transition-colors border border-slate-700">
                  View Commands
                </button>
                <Modal
                  isOpen={Open}
                  onClose={() => setOpen(false)}
                  title="MTUNES Commands"
                >
                  <div className="space-y-4">
                    <CommandRow delay={100} trigger="!play [song]/!play" desc="Plays the song in queue" />
                    <CommandRow delay={200} trigger="!add [song]" desc="Add song to queue" />
                    <CommandRow delay={300} trigger="!radio" desc="Starts Radio" />
                    <CommandRow delay={400} trigger="!skip" desc="Next track" />
                    <CommandRow delay={500} trigger="!stop" desc="Stops and Clear the queue" />
                    <CommandRow delay={600} trigger="!hello/!hola/!hi" desc="Greets the user" />
                    <CommandRow delay={700} trigger="!pause" desc="Greets the user" />
                    <CommandRow delay={800} trigger="!queue" desc="Shows how many songs are left in queue" />
                    <CommandRow delay={900} trigger="!leave" desc="Pauses current song" />
                    <CommandRow delay={1000} trigger="!resume" desc="Resumes paused song" />
                    <CommandRow delay={1100} trigger="!ping" desc="Shows bot latency" />
                    <p className="text-sm text-slate-500 italic pt-2">More commands coming soon...</p>
                  </div>
                </Modal>
              </div>
              <div className="flex justify-center gap-4 m-5">
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                  <span className="block text-3xl font-bold">{serverCount}</span>
                  <span className="text-slate-500 text-sm">Active Servers</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
                <FeatureCard title="Fast Search" desc="Powered by yt-dlp for near-instant results." icon="⚡" />
                <FeatureCard title="No Lag" desc="Optimized FFmpeg streams for high-bitrate audio." icon="🎧" />
                <FeatureCard title="Open Source" desc="Built to be transparent with no buts." icon="🛠️" />
              </div>
            </>
          )}
        </main>
      </div>
    </>
  )
}

function FeatureCard({ title, desc, icon }) {
  return (
    <div className="p-6 md:p-8 bg-slate-800/30 rounded-2xl border border-slate-700 hover:border-indigo-500 transition-all group cursor-default">
      <div className="text-3xl md:text-4xl mb-4 group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-slate-400 text-sm md:text-base">{desc}</p>
    </div>
  )
}

export default App
