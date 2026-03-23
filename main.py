import discord, os, asyncio, yt_dlp
from dotenv import load_dotenv
from discord.ext import commands

load_dotenv()
TOKEN = os.getenv("TOKEN")

intents = discord.Intents.default()
intents.message_content = True
bot = commands.Bot(command_prefix=commands.when_mentioned_or('!'), intents=intents)

YT_OPTS = {
    'format':'bestaudio',
    'nonplaylist':True, 
    'default_search':'ytsearch'
}

FFMPEG_OPTIONS = {
    'before_options': '-reconnect 1 -reconnect_streamed 1 -reconnect_delay_max 5',
    'options': '-vn'
}

@bot.event
async def on_ready() -> None:
    print(f'Logged in as {bot.user}')


@bot.command(name="Hello", aliases=['hello','hola','hi'])
async def hello(ctx) -> None:
    await ctx.send(f'Hi {ctx.author.mention}')

@bot.command()
async def play(ctx, *,search:str):
    if not ctx.author.voice:
        return await ctx.send("You are not in a voice channel!")
    
    channel = ctx.author.voice.channel
    if ctx.voice_client is None:
        vc = await channel.connect()
    else:
        vc = ctx.voice_client

    if vc.is_playing():
        vc.stop()
        ctx.send(f"Switching...")

    async with ctx.typing():
        with yt_dlp.YoutubeDL(YT_OPTS) as ydl:
            info = ydl.extract_info(search, download=False)
            
            if 'entries' in info:
                video_data = info['entries'][0]
            else:
                video_data = info

            audio_url = video_data['url'] 
            title = video_data['title']
            source = discord.FFmpegPCMAudio(audio_url, **FFMPEG_OPTIONS)
            
            ctx.voice_client.play(source)
            await ctx.send(f"Now playing: **{title}**")

@bot.command()
async def pause(ctx):
    if ctx.voice_client and ctx.voice_client.is_playing():
        ctx.voice_client.pause()
        await ctx.send("⏸️ Music paused.")
    else:
        await ctx.send("Nothing is playing right now.")

@bot.command()
async def resume(ctx):
    if ctx.voice_client and ctx.voice_client.is_paused():
        ctx.voice_client.resume()
        await ctx.send("Music resumed.")
    else:
        await ctx.send("The music isn't paused.")

@bot.command()
async def stop(ctx):
    if ctx.voice_client:
        ctx.voice_client.stop()
        await ctx.send("Music stopped.")

@bot.command()
async def leave(ctx):
    if ctx.voice_client:
        await ctx.voice_client.disconnect()
        await ctx.send("Bye-bye!")

@bot.command()
async def ping(ctx: commands.Context) -> None:  
    await ctx.send(f"> Pong! {round(bot.latency * 1000)}ms")

# @bot.command(name='Help')
# async def help(ctx):
#     await ctx.send("!Hello!hello, !hi, !holaThe bot greets you by name.\n!pingNoneShows the bot's heartbeat latency (speed).\n!play <text> Joins your VC and plays a song via search or link.!play No CapMusic \n!pause Temporarily stops the current song.\n!resume Starts the music again from where it paused. \n!stop Stops the music completely.\n!leave Force the bot to disconnect from the voice channel. \n!help for the commands")

bot.run(TOKEN)  