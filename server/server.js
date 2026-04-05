import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());

const API_KEY = process.env.API_KEY;

// app.get("/games", async (req, res) => {
//   try {
//     const response = await fetch(
//       `https://api.gamebrain.co/v1/games?api-key=${API_KEY}`,
//     );
//     const data = await response.json();
//     console.log(API_KEY);

//     res.json(data);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch games" });
//   }
// });

app.get("/games" , async (req, res) => {
    try{
        const {search, limit = 30} = req.query;
        let url = `https://api.gamebrain.co/v1/games?limit=5&api-key=${API_KEY}`
        if(search){
            url += `&search=${encodeURIComponent(search)}`
        }
        

        const response = await fetch(url);
        console.log(url)

        if(!response.ok){
            return res.status(response.status).json({
                error: "External API Error",
            })
        }

        const data = await response.json();
        res.json(data)
    }catch(err){
        res.status(500).json({error: "Failed to fetch games!"})
    }
})


app.listen(5000, () => console.log("Server running on port 5000"));
