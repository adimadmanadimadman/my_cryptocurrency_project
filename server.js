const express = require("express")
const { open } = require("sqlite")
const sqlite3 = require("sqlite3")
const path = require("path")
const dbPath = path.join(__dirname, "cryptocurrency.db")
const axios = require('axios');
const cors = require("cors");

const app = express();
db = null;
app.use(cors());
app.use(express.json());

// Initalizing SQLLite3 Database
const intialize = async () => {
    db = await open({
        filename: dbPath,
        driver: sqlite3.Database
    })
    await db.run(`CREATE TABLE IF NOT EXISTS cryptocurrency(name TEXT,last TEXT,buy TEXT,sell TEXT,volume TEXT,base_unit TEXT);`)
    app.listen(3000, () => {
        console.log('Server is running on PORT 3000')
    })
}
intialize()


app.get('/:type', async (req, res) => {
    let type = req.params.type;

    try {
        await fetchCryptoData(type);
        const query = `SELECT * FROM cryptocurrency WHERE base_unit = ? LIMIT 10`;
        const result = await db.all(query, [type]);
        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching data from the database:", error);
        res.status(500).send("Internal Server Error");
    }
})

// Inserting Records into database
const fetchCryptoData = async (type) => {
    let result = await axios.get('https://api.wazirx.com/api/v2/tickers');
    const data = result.data;
    let resultedData = Object.values(data).filter((ticker) => ticker.base_unit == type).sort((a, b) => a.volume - b.volume).slice(0, 10);


    await db.run(`DELETE FROM cryptocurrency`);

    for (const i of resultedData) {
        const query = `INSERT INTO cryptocurrency (name, last, buy, sell, volume, base_unit) VALUES (?, ?, ?, ?, ?, ?)`;
        await db.run(query, [i.name, i.last, i.buy, i.sell, i.volume, i.base_unit]);
    }
}



