const express = require('express');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');
const NodeCache = require('node-cache');
const http = require('http');

const { onlineRoute } = require('./online-platforms');
dotenv.config();

const app = express();
const PORT = 1818; // I just love 18

const accountId = process.env.ACCOUNT_ID;
const apiKey = process.env.WIX_API;
const siteId = process.env.SITE_ID;

// Set default timeout to 5min
const server = http.createServer(app);
server.setTimeout(5 * 60 * 1000);

const headers = {
    'Authorization': apiKey,
    'wix-account-id': accountId,
    'wix-site-id': siteId
};

app.use(cors());

const itemsCache = new NodeCache({ stdTTL: 120, deleteOnExpire: true, useClones: false });
const apisRoute = express.Router();

apisRoute.get('/items/:sectionId/:offset1/:offset2', async (req, res, next) => {
    try {
        const sectionId = req.params.sectionId;
        const startIndex = req.params.offset1;
        const stopIndex = req.params.offset2;

        if (!sectionId || !startIndex || !stopIndex) {
            res.sendStatus(400).send("Section ID Missing!");
        }

        const sectionData = await axios.get(`https://www.wixapis.com/restaurants/menus-section/v1/sections/${sectionId}`, { headers });
        const section = sectionData.data.section;

        if (!itemsCache.get("items")) {
            const { data } = await axios.get("https://www.wixapis.com/restaurants/menus-item/v1/items", { headers });
            itemsCache.set("items", data.items);
        }

        const unfilteredItems = itemsCache.get("items");

        let filteredItems = unfilteredItems.filter((item) => {
            if (section.itemIds.includes(item.id)) {
                return true;
            } else {
                return false;
            }
        })

        let items = filteredItems.map(async (item) => {
            let labels = [];

            if (item.labels.length > 0) {
                labels = await item.labels.map(async (label) => {
                    const { data } = await axios.get(`https://www.wixapis.com/restaurants/item-labels/v1/labels/${label.id}`, { headers });
                    return data.label;
                });
            }

            labels = await Promise.all(labels);
            return {
                ...item,
                labels
            }
        });

        items = await Promise.all(items);

        const customItemOrder = section.itemIds;
        items.sort((a, b) => customItemOrder.indexOf(a.id) - customItemOrder.indexOf(b.id));

        if (parseFloat(startIndex) === 0 && parseFloat(stopIndex) === 0) {
            res.status(200).send({ items, sectionData: sectionData.data });
        } else {
            res.status(200).send({ items: items.slice(parseFloat(startIndex), parseFloat(stopIndex)), sectionData: sectionData.data });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

apisRoute.get('/sections', async (req, res, next) => {
    try {
        const response = await axios.get("https://www.wixapis.com/restaurants/menus-section/v1/sections", { headers });
        const sections = response.data;
        res.send(sections);
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

apisRoute.use(onlineRoute);
app.use('/api', apisRoute);

app.listen(PORT, () => {
    console.log("Server Started!");
});
