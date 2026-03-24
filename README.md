<div align="center">

# 🎵 MTUNES (MAYA_TUNES)

A simple Discord music bot for playing YouTube audio in voice channels

</div>

---

## What is this?

MTUNES is a Discord bot that plays music in voice channels. You can search for songs, play YouTube links, or even add entire playlists. It's built with discord.py and yt-dlp.

## Features

- Play music from YouTube (search or direct links)
- Queue system for multiple songs
- Playlist support
- Basic controls (play, pause, resume, stop)
- Simple commands with `!` prefix

## Setup

### What you need

- Python 3.8 or higher
- A Discord bot token ([Get one here](https://discord.com/developers/applications))
- FFmpeg installed on your system

### Installation

1. Clone this repo
```bash
git clone <your-repo-url>
cd MTUNES
```

2. Install dependencies
```bash
pip install -r requirements.txt
```

3. Create a `.env` file in the root directory
```
TOKEN=your_discord_bot_token_here
```

4. Run the bot
```bash
python main.py
```

## Commands

| Command | What it does | Example |
|---------|-------------|---------|
| `!hello` / `!hi` / `!hola` | Bot says hi to you | `!hello` |
| `!play <search or link>` | Plays a song or adds it to queue | `!play Rick Astley` |
| `!pause` | Pauses current song | `!pause` |
| `!resume` | Resumes paused song | `!resume` |
| `!stop` | Stops the music | `!stop` |
| `!leave` | Bot leaves voice channel | `!leave` |
| `!ping` | Shows bot latency | `!ping` |

## How to use

1. Join a voice channel in your Discord server
2. Type `!play <song name>` or `!play <youtube link>`
3. Bot joins your channel and starts playing
4. Use other commands to control playback

### Playing playlists

You can also paste a YouTube playlist link and the bot will queue all songs:
```
!play https://youtube.com/playlist?list=...
```

## Requirements

```
discord.py
python-dotenv
yt-dlp
PyNaCl
```

Install FFmpeg separately:
- **Windows**: Download from [ffmpeg.org](https://ffmpeg.org/download.html)
- **Linux**: `sudo apt install ffmpeg`
- **macOS**: `brew install ffmpeg`

## Future plans

- Adding a chatbot that responds when mentioned
- More music controls (skip, shuffle, loop)
- Better queue management
- Volume control

## License

This is free software released into the public domain. Check the LICENSE file for details.

## Notes

- Bot needs proper permissions in your Discord server (Connect, Speak, Send Messages)
- Make sure FFmpeg is in your system PATH
- Keep your bot token secret (never commit .env to git)

---

<div align="center">

Made for playing music with friends

</div>
<!-- 
# MTUNES
MAYA_TUNES  is discord bot with text channel commands and voice channel commands to start music
-->