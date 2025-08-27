// import express from "express";
// import cors from "cors"
// const app=express();

// app.use(express.json());
// app.use(cors());

// app.post("/recommend",async(req,res)=>{
//     console.log("api hit")
//     const moviename=req.body.moviename;
//     try{
//     const flaskres=await fetch("http://127.0.0.1:5000/recommend",{
//         method:"POST",
//         headers:{
//             "Content-Type":"application/json"
//         },
//         body:JSON.stringify({movie:moviename})
//     })

//     const data=await flaskres.json();
//     if(flaskres.ok){
//     console.log(data)
//     res.status(200).json(data);
//        }
//     else{
//         res.status(500).json({error:data.error});
//     }
// }
// catch(error)
// {
//     console.error("Express fetch failed:", err.message);
//     res.status(500).json({ error: "Internal server error in Express" });
// }
    
// })




// app.listen(8000,() => {
//   console.log(`Express server running on http://localhost:8000`);
// });




import express from "express";
import cors from "cors";
// import fetch from "node-fetch";

const app = express();

app.use(express.json());
app.use(cors());

app.post("/recommend", async (req, res) => {
    console.log("api hit");
    const moviename = req.body.moviename;

    try {
        const flaskres = await fetch("http://127.0.0.1:5000/recommend", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ movie: moviename })
        });

        const data = await flaskres.json();

        if (flaskres.ok) {
            console.log(data); // ✅ Logging correct variable
            res.status(200).json(data); // ✅ Send correct response
        } else {
            console.error("Flask error:", data.error);
            res.status(500).json({ error: data.error || "Flask server error" });
        }
    } catch (err) {
        console.error("Express fetch failed:", err.message);
        res.status(500).json({ error: "Internal server error in Express" });
    }
});

app.listen(8000, () => {
    console.log(`Express server running on http://localhost:8000`);
});
