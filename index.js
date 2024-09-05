
import express from "express";

const app = express();
const PORT = 8000;

app.get("/", (req,res) => {
    return res.json({
        success: true,
        message: `server is up and running on ${PORT}`
    });
})

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
