import discord, os, asyncio, yt_dlp
from dotenv import load_dotenv
from discord.ext import commands
from urllib.parse import urlparse
from flask import Flask, request
import threading, random

load_dotenv(dotenv_path="../.env")
TOKEN = os.getenv("TOKEN")

intents = discord.Intents.default()
intents.message_content = True
bot = commands.Bot(command_prefix=commands.when_mentioned_or('!'), intents=intents)
qu = {}
current_song = {}
radio_mode = {}
RADIO_STATIONS = [
    {"title": "BBC Radio 1 (UK) 🇬🇧", "url": "http://stream.live.vc.bbc.co.uk/bbc_radio_one_hd"},
    {"title": "Nightride FM (Synthwave)", "url": "https://stream.nightride.fm/nightride.m4a"},
    {"title": "Radio Paradise (Audiophile Mix)", "url": "http://stream.radioparadise.com/flac"},
    {"title": "Monstercat 24/7", "url": "https://stream.monstercat.com/radio/station/1/"},
    {"title": "Lofi Girl (Official)", "url": "https://icecast.lofigirl.com/lofigirl.mp3"}
]

class Logger:
    def debug(self, msg):
        print(f"[DEBUGGING] {msg}")
    
    def warning(self, msg):
        print(f"[WARNING] {msg}")
    
    def error(self, msg):
        print(f"[ERROR] {msg}")


YT_OPTS = {
    'format':'bestaudio',
    'nonplaylist':False, 
    'default_search':'ytsearch',
    'extract_info':True,
    'quiet': True,
    'logger': Logger()
}

FFMPEG_OPTIONS = {
    'before_options': '-reconnect 1 -reconnect_streamed 1 -reconnect_delay_max 5',
    'options': '-vn -filter:a loudnorm'
}

def prepare_query(user_input):
    if 'entries' in user_input:
        return user_input['entries'][0]
    return user_input

def player(ctx):
    guild_id = ctx.guild.id

    if ctx.guild.id in qu and len(qu[ctx.guild.id]) > 0:
        video_data = qu[ctx.guild.id].pop(0)
        source = discord.FFmpegPCMAudio(video_data['url'], **FFMPEG_OPTIONS)   
        current_song[guild_id] = video_data['title']  
        def next_song(error):
            if error: print(f"Player error: {error}")
            bot.loop.call_soon_threadsafe(player, ctx)
        ctx.voice_client.play(source, after=next_song)
        bot.loop.create_task(ctx.send(f"Now playing: **{video_data['title']}**"))

    elif radio_mode.get(guild_id, False):
        station = random.choice(RADIO_STATIONS)
        current_song[guild_id] = f"📻 {station['title']}"
        source = discord.FFmpegPCMAudio(station['url'], **FFMPEG_OPTIONS)
        def next_radio(error):
            if error: print(f"Player error: {error}")
            bot.loop.call_soon_threadsafe(player, ctx)
        ctx.voice_client.play(source, after=next_radio)
        bot.loop.create_task(ctx.send(f"Radio Mode: **{station['title']}**"))        

    else:
        if guild_id in current_song:
            del current_song[guild_id]
        bot.loop.create_task(ctx.send("Playlist finished!"))

@bot.event
async def on_ready() -> None:
    print(f'Logged in as {bot.user}')


@bot.command(name="Hello", aliases=['hello','hola','hi'])
async def hello(ctx) -> None:
    await ctx.send(f'Hi {ctx.author.mention}')

@bot.command()
async def play(ctx, *,search:str=''):
    if not ctx.author.voice:
        return await ctx.send("You are not in a voice channel!")
    
    channel = ctx.author.voice.channel
    if ctx.voice_client is None:
        vc = await channel.connect()
    else:
        vc = ctx.voice_client

    if vc.is_playing():
        vc.stop()
        await asyncio.sleep(0.5)
        await ctx.send(f"Switching...")

    async with ctx.typing():
        if search == '':
            player(ctx)
        else:
            with yt_dlp.YoutubeDL(YT_OPTS) as ydl:
                info = await asyncio.to_thread(ydl.extract_info, search, download=False)
                extractor = 'search' in info.get('extractor_key','').lower()

                if ctx.guild.id not in qu:
                        qu[ctx.guild.id] = []
                
                if 'entries' in info:
                    if extractor:
                        video_data = info['entries'][0]
                        qu[ctx.guild.id].append(video_data)
                        await ctx.send(f"Added search result: **{video_data['title']}**")

                    else:
                        for entry in info['entries']:
                            qu[ctx.guild.id].append(entry)
                        await ctx.send(f"**{len(info['entries'])}** Songs are Added in Queue")

                else:
                    qu[ctx.guild.id].append(info)
                    await ctx.send(f"Added: **{info['title']}**")
                
    if not vc.is_playing() and not vc.is_paused():
        player(ctx)

@bot.command()
async def pause(ctx):
    if ctx.voice_client and ctx.voice_client.is_playing():
        ctx.voice_client.pause()
        await ctx.send("Music paused.")
    else:
        await ctx.send("Nothing is playing right now.")

@bot.command()
async def queue(ctx):
    if ctx.guild.id in qu and ctx.voice_client:
        if len(qu[ctx.guild.id]) > 0:
            await ctx.send(f"Songs left: {len(qu[ctx.guild.id])}")
        else:
            await ctx.send("No song left")
    else:
        await ctx.send("> No queue has been started for this server yet.")

@bot.command()
async def add(ctx,*,search:str):
    channel = ctx.author.voice.channel
    if ctx.voice_client is None:
        vc = await channel.connect()
    if ctx.voice_client:
        if ctx.guild.id not in qu:
             qu[ctx.guild.id] = []

        async with ctx.typing():
            with yt_dlp.YoutubeDL(YT_OPTS) as ydl:
                info = await asyncio.to_thread(ydl.extract_info, search, download=False)
                extractor = 'search' in info.get('extractor_key','').lower()
                if 'entries' in info:
                    if extractor:
                        video_data = info['entries'][0]
                        qu[ctx.guild.id].append(video_data)
                        await ctx.send(f"Added search result: **{video_data['title']}** to the queue")

                    else:
                        for entry in info['entries']:
                            qu[ctx.guild.id].append(entry)
                        await ctx.send(f"**{len(info['entries'])}** Songs are Added in Queue to the queue")

                else:
                    qu[ctx.guild.id].append(info)
                    await ctx.send(f"Added: **{info['title']}** to the queue")
@bot.command()
async def resume(ctx):
    if ctx.voice_client and ctx.voice_client.is_paused():
        ctx.voice_client.resume()
        await ctx.send("Music resumed.")
    else:
        await ctx.send("The music isn't paused.")

@bot.command()
async def radio(ctx):
    if not ctx.author.voice:
        return await ctx.send("You are not in a voice channel!")
    
    channel = ctx.author.voice.channel
    guild_id = ctx.guild.id
    radio_mode[guild_id] = not radio_mode.get(guild_id, False)

    if ctx.voice_client is None:
        vc = await channel.connect()

    if radio_mode[guild_id]:
        await ctx.send("**Radio Mode Enabled.** Switching to live streams..") 

        if not ctx.voice_client.is_playing():
                player(ctx)
        else:
            ctx.voice_client.stop()
    else:
        radio_mode[guild_id] = False
        if ctx.voice_client and ctx.voice_client.is_playing():
             ctx.voice_client.stop()
        await ctx.send("**Radio Mode Disabled.** Music will stop after this track.")

@bot.command()
async def skip(ctx):
    if ctx.voice_client and ctx.voice_client.is_playing():
        ctx.voice_client.stop()
        await ctx.send("Skipping...")

    else:
        await ctx.send("Nothing to skip!")

@bot.command()
async def stop(ctx):
    if ctx.guild.id in qu:
        qu[ctx.guild.id].clear()
    radio_mode[ctx.guild.id] = False

    if ctx.voice_client and (ctx.voice_client.is_playing() or ctx.voice_client.is_paused()):
        ctx.voice_client.stop()
        await ctx.send("Music Stopped!!!")
    else:
        await ctx.send("Nothing is playing right now.")
        
@bot.command()
async def leave(ctx):
    if ctx.voice_client: 
        await ctx.voice_client.disconnect()
        await ctx.send("Bye-bye!")

@bot.command()
async def ping(ctx: commands.Context) -> None:  
    await ctx.send(f"> Pong! {round(bot.latency * 1000)}ms")

app = Flask(__name__)
@app.get('/status')
def getStatus():
    return {"status":"online", 
            "server": len(bot.guilds),
            "now_playing": current_song, 
            "radio_active": any(radio_mode.values())
            }

def runFlask():
    app.run(host='0.0.0.0', port=5000)

@app.post('/api/play-remote')
def remote_play():
    data = request.json
    guild_id = int(data.get('guild_id'))
    search_query = data.get('query')
    
    guild = bot.get_guild(guild_id)
    if not guild:
        return {"error": "Bot is not in this server"}, 404

    vc = guild.voice_client
    if not vc:
        return {"error": "Bot is not in a voice channel"}, 400

    asyncio.run_coroutine_threadsafe(
        trigger_remote_audio(guild, search_query), 
        bot.loop
    )

    return {"status": "Success", "message": f"Queuing {search_query}"}

async def trigger_remote_audio(guild, query):
    print(f"Remote request for {query} in {guild.name}")

if __name__ == '__main__':
    threading.Thread(target=runFlask, daemon=True).start()
    try:
        bot.run(TOKEN)
    except KeyboardInterrupt:
        print("Stopping bot safely...") 