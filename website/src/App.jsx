import { useState } from 'react'
import mtunesLogo from './assets/mtunes.png'
import { Modal } from './Modal'
import './App.css'

const CLIENT_ID = '1485064494312067142';
const SCOPES = "bot identify guilds applications.commands";
const COMMANDS = [
  { trigger: '/play', desc: 'Plays a song from YouTube/Spotify' },
  { trigger: '/skip', desc: 'Skips the current track' },
  { trigger: '/queue', desc: 'Shows the upcoming songs' },
  { trigger: '/stop', desc: 'Clears the queue and leaves' }
]

function App() {
  const [Open, setOpen] = useState(false)

  const login = () => {
    const address = window.location.origin + '/auth/callback';
    const discordLink = `https://discord.com/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(address)}&response_type=code&scope=${encodeURIComponent(SCOPES)}`;
    window.location.href = discordLink;
  };

  return (
    <>
      <div className="min-h-screen bg-[#070b11] text-slate-600 font-sans">
        <nav className="flex items-center justify-between px-8 py-4 border-b border-slate-800 bg-[#12161F]">
          <div className="flex items-center gap-3">
            <img src={mtunesLogo} className="h-10 w-10" alt="Logo" />
            <span className="text-xl font-bold tracking-tighter text-white">MTUNES</span>
          </div>
          <button className="bg-indigo-200 hover:bg-indigo-500 px-5 py-2 rounded-full font-medium transition-all cursor-pointer hover:text-indigo-50">
            <a href="https://github.com/shubhankar011/MTUNES" target="_blank">Contribute</a>
          </button>
        </nav>

        <main className="max-w-4xl mx-auto pt-20 text-center">
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
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <code className="text-indigo-400">!play [song]</code>
                  <span className="text-slate-400">Add song to queue</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <code className="text-indigo-400">!skip</code>
                  <span className="text-slate-400">Next track</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <code className="text-indigo-400">!stop</code>
                  <span className="text-slate-400">Stops and Clear the queue</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <code className="text-indigo-400">!hello/!hola/!hi</code>
                  <span className="text-slate-400">Greets the user</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <code className="text-indigo-400">!queue</code>
                  <span className="text-slate-400">Shows how many songs are left in queue</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <code className="text-indigo-400">!leave</code>
                  <span className="text-slate-400">Bot leaves voice channel</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <code className="text-indigo-400">!pause</code>
                  <span className="text-slate-400">Pauses current song</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <code className="text-indigo-400">!resume</code>
                  <span className="text-slate-400">Resumes paused song</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <code className="text-indigo-400">!ping</code>
                  <span className="text-slate-400">Shows bot latency</span>
                </div>
                <p className="text-sm text-slate-500 italic">More commands coming soon...</p>
              </div>
            </Modal>
          </div>
        </main>
      </div>
    </>
  )
}

export default App
