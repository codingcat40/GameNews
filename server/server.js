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


app.get("/games/:id", async (req, res) => {
    const token = await getAccessToken();
    const {id} = req.params;

    const igdbRes = await fetch("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: {
      "Client-ID": process.env.CLIENT_ID,
      Authorization: `Bearer ${token}`,
      "Content-Type": "text/plain",
    },
    body: `
      fields name, rating, rating_count, aggregated_rating, aggregated_rating_count,
             summary, storyline, status, category, slug, first_release_date,
             genres.name, themes.name, platforms.name, game_modes.name,
             player_perspectives.name, game_engines.name,
             involved_companies.developer, involved_companies.publisher,
             involved_companies.company.name,
             cover.url, screenshots.url, videos.video_id,
             websites.url, websites.category,
             age_ratings.rating, age_ratings.category;
      where id = ${id};
    `,
  });

  const raw = await igdbRes.json();
  res.json(raw[0]); 
})

app.listen(5000, () => console.log("Server running on port 5000"));
