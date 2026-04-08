<div align="center">

# 🎵 MTUNES (MAYA_TUNES)

A Discord music bot with web interface for managing music in voice channels

</div>

---

## What is this?

MTUNES is a full-stack Discord music bot system that lets you play music from YouTube in your Discord server. It includes a Discord bot (Python), an OAuth2 backend (Node.js), and a React-based web interface for inviting the bot to your servers.

## Project Structure

```
MTUNES/
├── .env                # Central secrets (Token, Client Secret)
├── README.md
├── LICENSE
├── .gitignore
├── backend/            # The Node.js Bridge (Deployed to Railway)
│   ├── server.js
│   └── package.json
├── website/            # The React Frontend (Deployed to Vercel)
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── App.css
│   │   └── components/
│   │       ├── Dashboard.jsx
│   │       └── Modal.jsx
│   ├── index.html
│   ├── package.json
│   ├── .env            # For Accessing Backend through Vite & React
│   └── vite.config.js
└── bot/                # The Python Music Engine (Running on Laptop)
    ├── main.py
    ├── requirements.txt
    └── venv/           # Virtual environment
```

## Features

### Discord Bot
- Play music from YouTube (search or direct links)
- Queue system for multiple songs
- Playlist support
- Basic playback controls (play, pause, resume, stop, skip)
- Queue management
- Radio mode with live stream stations
- Simple commands with `!` prefix

### Web Interface
- Modern landing page with Tailwind CSS
- Discord OAuth2 integration
- Bot invitation flow
- Command reference modal
- Live stats dashboard (server count, bot status, active audio feeds)

### Backend
- OAuth2 token exchange bridge
- Bot status & dashboard API
- CORS-enabled API for frontend
- Railway deployment ready

---

## Setup

### Prerequisites

- **Bot**: Python 3.8+, FFmpeg
- **Backend**: Node.js 18+
- **Website**: Node.js 18+
- Discord Application ([Create one here](https://discord.com/developers/applications))

### Environment Variables

Create a `.env` file in the **root directory** & in website directory for accessing through React:

```env
# Discord Bot Token
TOKEN=your_discord_bot_token_here

# OAuth2 Credentials (for web interface)
CLIENT_ID=your_discord_client_id
CLIENT_SECRET=your_discord_client_secret
REDIRECT_URI=http://localhost:5173

# Backend URL, should be in website directory
VITE_API_URL=http://localhost:3001
```

### Installation

#### 1. Bot Setup

```bash
cd bot
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

**Requirements** (`bot/requirements.txt`):
```
discord.py
python-dotenv
yt-dlp
PyNaCl
flask
```

**Install FFmpeg separately:**
- **Windows**: Download from [ffmpeg.org](https://ffmpeg.org/download.html)
- **Linux**: `sudo apt install ffmpeg`
- **macOS**: `brew install ffmpeg`

#### 2. Backend Setup

```bash
cd backend
npm install
npm start
```

Backend runs on port **3001**.

#### 3. Website Setup

```bash
cd website
npm install
npm run dev
```

Frontend runs on port **5173**.

---

## Bot Commands

| Command | Description | Example |
|---------|-------------|---------|
| `!hello` / `!hi` / `!hola` | Bot greets you | `!hello` |
| `!play <search or link>`/`!play` | Plays a song or resumes queue | `!play Never Gonna Give You Up` |
| `!add <search or link>` | Adds to queue | `!add Never Gonna Give You Up` |
| `!radio` | Toggles Radio mode | `!radio` |
| `!pause` | Pauses current song | `!pause` |
| `!resume` | Resumes paused song | `!resume` |
| `!skip` | Skips current song | `!skip` |
| `!stop` | Stops music and clears queue | `!stop` |
| `!queue` | Shows how many songs are in queue | `!queue` |
| `!leave` | Bot leaves voice channel | `!leave` |
| `!ping` | Shows bot latency | `!ping` |

---

## How to Use

### Using the Bot

1. Join a voice channel in your Discord server
2. Type `!play <song name>` or `!play <youtube link>`
3. Bot joins your channel and starts playing
4. Use other commands to control playback

### Playing Playlists

You can paste a YouTube playlist link to queue all songs:
```
!play https://youtube.com/playlist?list=...
```

### Radio Mode

Type `!radio` to toggle radio mode. The bot will cycle through a curated list of live stream stations (BBC Radio 1, Nightride FM, Radio Paradise, Monstercat, and Lofi Girl). Type `!radio` again to disable it.

### Web Interface

1. Visit the website
2. Click **"Invite Bot"** button
3. Authorize with Discord OAuth2
4. Select your server and grant permissions

You can also click **"Live Stats"** in the nav to view real-time server count, bot status, and active audio feeds across all servers.

---

## Tech Stack

### Bot
- **discord.py** - Discord API wrapper
- **yt-dlp** - YouTube audio extraction
- **FFmpeg** - Audio playback
- **PyNaCl** - Voice encryption
- **Flask** - Bot status & remote control API

### Backend
- **Express** - Web server
- **axios** - HTTP requests
- **cors** - CORS middleware
- **dotenv** - Environment variables

### Website
- **React 19** - UI framework
- **Vite** - Build tool
- **Tailwind CSS v4** - Styling
- **@tailwindcss/vite** - Tailwind integration

---

## Deployment

### Bot (Any Cloud Platform / Local)
```bash
# Make sure .env file is properly configured
python bot/main.py
```

### Backend (Railway)
```bash
cd backend
npm start
# Set environment variables in Railway dashboard
```

### Website (Vercel/Netlify)
```bash
cd website
npm run build
# Deploy the dist/ folder
```

**Important:** Update `REDIRECT_URI` in `.env` to match your deployed frontend URL.

---

## Current State

⚠️ **Note:** This version is a bit cluttered as features were added rapidly during development.


### Planned for Next Update
- 📝 **Better documentation**

---

## Contributing

This is an open-source project. Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Fork and modify

**Repository:** [github.com/shubhankar011/MTUNES](https://github.com/shubhankar011/MTUNES)

---

## License

Non-commercial open source. Check the LICENSE file for details.

---

## Notes

- Bot needs proper permissions in your Discord server (Connect, Speak, Send Messages)
- Make sure FFmpeg is in your system PATH
- Keep your bot token and OAuth secrets private (never commit `.env` to git)
- The `.gitignore` file is configured to exclude sensitive files

---

<div align="center">

**Made for playing music with friends**

Version 1.0.3 | Last updated: 08-04-2026

</div>
<!-- 
# MTUNES
MAYA_TUNES  is discord bot with text channel commands and voice channel commands to start music
-->
