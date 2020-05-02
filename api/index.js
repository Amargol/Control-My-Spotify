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
//     var scopes = 'user-modify-playback-state user-read-recently-played';
//     res.redirect('https://accounts.spotify.com/authorize' +
//       '?response_type=code' +
//       `&client_id=${process.env.SPOTIFY_CLIENT_ID}`+
//       '&scope=' + encodeURIComponent(scopes) +
//       `&redirect_uri=${process.env.CLIENT_URL}/api/callback`)
// })

// // Use code to get token
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
//             code: "AQCCwCk3pQUz4pWbZe-U5dZYdWPLlAVfz20g_6MEDIHMFfbxQAuQzReNNXNnU1LzRdPmxalbfld8g1xc_Qul5uvXyaE-vafAWtvTNZSCrOZcmhnEb2mX9-gEiI-N0ocRyDdkj7m2RmnZsSY5aCYlboRfa83Y1BquxqsxzB_be9itwbDUO71aFYu7iTh49g9o_jlwiCx06H5eXIdMJIeTBcYvo9KSjFEWLwrEPyXjd4FZzoQpDmnkzJKfinv9vuNCHbjrSU6jaRSkOTz_u9Q0",
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

app.get('/recently-played', async (req, res) => {
    let at = await getAccessToken()

    var {status, statusText, data} = await axios({
        method: 'get',
        url: 'https://api.spotify.com/v1/me/player/recently-played',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${at}`
        },
        params: {
            'limit': 10
        }
    }).catch((error) => {
        console.log(error)
        return {
            status: 400,
            statusText: "Bad Request",
            data: ""
        }
    })

    data = data.items.map(e => (
        {
            "name": e.track.name,
            "artist": e.track.artists.map(a => a.name).join(", "),
            "image": e.track.album.images[e.track.album.images.length - 1].url,
            "href": e.track.href
        }
    ))

    res.send({
        status,
        statusText,
        data
    })
})


app.get('/hi', async (req, res) => {
    let at = await getAccessToken()

    for (let i = 0; i < 4; i++) {
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
    }
})

module.exports = {
    path: '/api/',
    handler: app
}