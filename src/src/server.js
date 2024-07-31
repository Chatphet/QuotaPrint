const express = require("express");
const cors = require("cors");
const app = express();
const { connectAndQuery, yearlyQuery, yearlyByRequesterQuery } = require("./sql");

app.use(cors());
const port = 5000;

app.get("/api/list", async function (req, res, next) {
    try {
        const data = await connectAndQuery(yearlyByRequesterQuery);
        res.json(data);
    } catch (error) {
        console.error('Error querying database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get("/api/list/year", async function (req, res, next) {
    try {
        const data = await connectAndQuery(yearlyQuery);
        res.json(data);
    } catch (error) {
        console.error('Error querying database:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
