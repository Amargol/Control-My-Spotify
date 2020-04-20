import express from 'express'
import axios from 'axios'
var request = require('request');

require('dotenv').config()


const app = express()
// app.use(express.json())

var accessToken = ""
var accessTokenDate = new Date("February 9, 2012, 12:15")


app.get('/callback', (req, res) => {
    console.log("yeet")
    console.log("yeet")
    console.log("yeet")
    console.log("yeet")
    console.log("yeet")
    console.log("yeet")
    console.log("yeet")
    console.log("yeet")
    res.send("callback")
})

// Use this to get code
// app.get('/login', function(req, res) {
//     var scopes = 'user-modify-playback-state';
//     res.redirect('https://accounts.spotify.com/authorize' +
//       '?response_type=code' +
//       `&client_id=${process.env.SPOTIFY_CLIENT_ID}`+
//       '&scope=' + encodeURIComponent(scopes) +
//       `&redirect_uri=${process.env.CLIENT_URL}/api/callback`)
// })

// Use code to get token
// app.get('/refresh-token', (req, res) => {
//     var headers = {
//         'Accept': 'application/json',
//         'Content-Type':'application/x-www-form-urlencoded'
//     };
    
//     var options = {
//         url: 'https://accounts.spotify.com/api/token',
//         method: 'POST',
//         headers: headers,
//         qs: {
//             grant_type: "authorization_code",
//             code: "AQCOT0oUUbf2TI3kMf-K961C1TdFqPTyLMMqST-VVVi-q5JBb548W2IvACe2zYc1E72EdR6uQOGfwhnBh15xN6ndBqE_Z3UIVwYfRGj-_aUHmaTVjnvLWphng4rQORxcxPuluk5ZOJiN62xxEEvYCF-YEFA8-xeH8je8GdeKIUEXV7Gg5SApFbag8HoPYPxhCt1OBCzBtsErkJc3edKSzalowhoPd03ofPuk9GVs-0IFwbT9",
//             redirect_uri: `${process.env.CLIENT_URL}/api/callback`,   
//             client_id: process.env.SPOTIFY_CLIENT_ID,
//             client_secret: process.env.SPOTIFY_CLIENT_SECRET
//         }
//     };
    
//     function callback(error, response, body) {
//         res.send(body)
//     }
    
//     request(options, callback);
// })

// app.get('/accesstoken', async (req, res) => {
//     res.send(await getAccessToken())
// })

async function getAccessToken() {
    const REFRESHTIME = 45 * 60 * 1000; // 45 mins
    if (accessToken && ((new Date) - accessTokenDate) < REFRESHTIME) {
        return accessToken
    } else {
        var res = await axios({
            method: 'post',
            url: 'https://accounts.spotify.com/api/token',
            params: {
                grant_type: "refresh_token",
                refresh_token: process.env.SPOTIFY_REFRESH_TOKEN,
                client_id: process.env.SPOTIFY_CLIENT_ID,
                client_secret: process.env.SPOTIFY_CLIENT_SECRET
            },
            headers: {
                'Accept': 'application/json',
                'Content-Type':'application/x-www-form-urlencoded'    
            }
        })

        res = res.data;

        accessToken = res.access_token
        accessTokenDate = new Date
        
        return accessToken
    }
}

app.get('/pause', async (req, res) => {
    let at = await getAccessToken()

    var {status, statusText, data} = await axios({
        method: 'put',
        url: 'https://api.spotify.com/v1/me/player/pause',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${at}`
        }
    }).catch((error) => {
        console.log(error)
        return {
            status: 400,
            statusText: "Bad Request",
            data: ""
        }
    })

    res.send({
        status,
        statusText,
        data
    })
})

app.get('/skip', async (req, res) => {
    let at = await getAccessToken()

    var {status, statusText, data} = await axios({
        method: 'post',
        url: 'https://api.spotify.com/v1/me/player/next',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${at}`
        }
    }).catch((error) => {
        console.log(error)
        return {
            status: 400,
            statusText: "Bad Request",
            data: ""
        }
    })

    res.send({
        status,
        statusText,
        data
    })
})


app.get('/hi', (req, res) => {
    var headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer BQChOdIkv1lg9SXg15PBfSJuM-IVWWFZ1Eu8_sVMcwImUt9nR6x4Atec-zONLFH4iSpb3docJRgXsrOzyvI87KhCAsdA_IgUOxhDr2nfEiDu06F2tHUUFFiarAKVD2ZP01p0fPSwONIJTRal5nWIZNPBpqmdefc04kZBz1usunyPpYfnsgvatuA'
    };
    
    var options = {
        url: 'https://api.spotify.com/v1/me/player/currently-playing',
        headers: headers
    };
    
    function callback(error, response, body) {
        if (!error && response.statusCode == 200) {
            res.send(body);
        }
    }
    
    request(options, callback);
})

module.exports = {
    path: '/api/',
    handler: app
}
  