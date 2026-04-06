import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());



const getAccessToken = async () => {
    const res = await fetch('https://id.twitch.tv/oauth2/token', {
        method: "POST",
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        body: new URLSearchParams({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            grant_type: "client_credentials",
        })
    })

    const data = await res.json()
    return data.access_token
}

app.get("/games", async (req, res) => {         
    const token = await getAccessToken();
    const search = req.query.search;
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const offset = (page - 1) * limit;

    const body = search
    ? `
        fields name, rating, genres.name, first_release_date, cover.url, age_ratings.rating, screenshots.url;
        search "${search}";
        where cover != null;
        limit ${limit};
        offset ${offset};
      `
    : `
        fields name, rating, genres.name, first_release_date, cover.url, age_ratings.rating, screenshots.url;
        where rating > 75 & cover != null;
        sort rating desc;
        limit ${limit};
        offset ${offset};
      `;


    const igdbRes = await fetch("https://api.igdb.com/v4/games", {
        method: "POST",
        headers: {
            "Client-ID": process.env.CLIENT_ID,
            Authorization: `Bearer ${token}`,
            "Content-Type": "text/plain",        
        },
        body,
    });

    const raw = await igdbRes.json();
    res.json({results: raw, page, totalPages: 30});                             
});

app.listen(5000, () => console.log("Server running on port 5000"));
