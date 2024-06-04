const express = require('express');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = 1818; // I just love 18

const accountId = process.env.ACCOUNT_ID;
const apiKey = process.env.WIX_API;
const siteId = process.env.SITE_ID;

const headers = {
    'Authorization': apiKey,
    'wix-account-id': accountId,
    'wix-site-id': siteId
};

app.use(cors());

app.get('/api/items/:sectionId', async (req, res, next) => {
    try {
        const sectionId = req.params.sectionId;

        if (!sectionId) {
            res.sendStatus(400).send("Section ID Missing!");
        }

        const sectionData = await axios.get(`https://www.wixapis.com/restaurants/menus-section/v1/sections/${sectionId}`, { headers });
        const section = sectionData.data.section;

        const filter = {
            query: {
                filter: {
                    "id": { $in: section.itemIds }
                }
            }
        }

        const response = await axios.post("https://www.wixapis.com/restaurants/menus-item/v1/items/query", filter, { headers });

        let items = response.data.items.map(async (item) => {
            let labels = await item.labels.map(async (label) => {
                const { data } = await axios.get(`https://www.wixapis.com/restaurants/item-labels/v1/labels/${label.id}`, { headers });
                return data.label;
            });

            labels = await Promise.all(labels);

            return {
                ...item,
                labels
            }
        });

        items = await Promise.all(items);
        res.status(200).send(items);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log("Server Started!");
});
