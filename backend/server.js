const express = require('express')
// const fs = require('fs')
const axios = require('axios')
const cors = require('cors')
path = require('path')

require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const app = express()

app.use(cors({
    origin: ['http://localhost:5173', 'https://mtunesbot.vercel.app']
}))

app.get('/', (req,res) =>{
    res.send("MTUNES bridge is online!")
})

app.get('/api/callback', async(req,res) => {

    const {code} = req.query
    if (!code) 
        return res.status(400).send('No code provided');
    
    try {
    const response = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: process.env.REDIRECT_URI, 
            }), {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        })
        res.json(response.data)
    }
    catch(e){
        console.error(e.response?.data || e.message);
        res.status(500).json({ e: 'OAuth2 Handshake Failed' });
    }
})

const PORT = 3001;
app.listen(PORT, () => console.log(`Bridge running on port ${PORT}`));