const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const router = express.Router();

const accountId = process.env.ACCOUNT_ID;
const apiKey = process.env.WIX_API;
const siteId = process.env.SITE_ID;

const headers = {
    'Authorization': apiKey,
    'wix-account-id': accountId,
    'wix-site-id': siteId
};

const sectionsIds = [
    "84753f92-6a53-470f-9188-25c89efc92cd", // baklava & kataifi 0
    "878cf8f9-d1cc-4826-b81f-97e18b47f3ca", // desserts
    "e00f362b-b4c3-4f5e-993e-27f1e96915f7", // snacks
    "b561a98d-7bc2-4aa7-b848-1950dac1b915", // soups
    "c37753b3-ee8a-4e4b-ba8b-75eb722186f7", // wraps & breads
    "6b4fb1c5-f10c-48e7-93e5-e651c9049157", // main courses
    "bbd93ad4-69e9-4a85-a67f-dd17e82b49d6", // salads
    "062b04d3-2fe0-4b20-81fa-3643f6042810", // drinks 7
    "e39cad34-c8d4-45ed-af25-c679c6fd1b7a", // packaged products 8
]

router.get('/menu-docs/:sectionId', async (req, res) => {
    try {
        const { sectionId } = req.params;
        const { data } = await axios.get(`https://www.wixapis.com/restaurants/menus-section/v1/sections/${sectionsIds[sectionId]}`, { headers });
        const itemIds = data["section"]["itemIds"];

        // Reduce Call Counts with PreCalls Here
        const mm = await axios.get("https://www.wixapis.com/restaurants/item-modifier-group/v1/modifier-groups?paging.limit=100", { headers });
        const modifierGroups = mm.data.modifierGroups;

        const mmm = await axios.get("https://www.wixapis.com/restaurants/item-modifiers/v1/modifiers?paging.limit=200", { headers });
        const modifiers = mmm.data.modifiers;

        const vv = await axios.get("https://www.wixapis.com/restaurants/item-variants/v1/variants?paging.limit=200", { headers });
        const variants = vv.data.variants;

        // Markdown Document
        let texts = [];
        let divider = '\n\n‎\n\n---\n\n';
        let space = "\n\n‎\n\n";

        texts.push(`This PDF will explain which products to include with all required details into **${data["section"].name}** category. `);
        texts.push(`Every image has a number and a folder, folder names and category names are same. Images for this category are in the **"${data["section"].name}"** folder.\n`);
        texts.push(divider);

        for (const [index, itemId] of itemIds.entries()) {
            const { data } = await axios.get(`https://www.wixapis.com/restaurants/menus-item/v1/items/${itemId}`, { headers });
            const item = data.item;

            texts.push(`\n## ${item.name}\n`);
            texts.push(`**Name:** ${item.name}\n`);

            // Add description only if it exists.
            if (item.description) {
                texts.push(`**Description:** ${item.description}\n`);
            }

            texts.push(`**Image**: ${index}.jpg\n`);

            if (item.price) {
                texts.push(`**Main Price:** ${parseFloat(item.price).toFixed(2)}€\n`);
            }

            if (item.priceVariants) {
                if (item.priceVariants.variants.length > 0) {
                    texts.push(`\n‎\n\n**Selection Name:** Pick Size\n`)
                    texts.push(`**Selection Type:** Required\n`);
                    texts.push(`**Maximum Selection:** 1\n\n`);

                    for (const variant of item.priceVariants.variants) {
                        const variantData = variants.find((item) => item.id === variant.variantId);
                        texts.push(`- ${variantData.name} - ${parseFloat(variant.price).toFixed(2)}€ ${variantData.name === "Portion" ? "**(pre-selected option)**" : ""}\n`);
                    }

                    texts.push("\n");
                }
            }

            if (item.modifierGroups.length > 0) {
                for (const modifierGroupId of item.modifierGroups) {
                    const modifierGroup = modifierGroups.find((item) => item.id === modifierGroupId.id);

                    texts.push(`\n‎\n\n**Selection Name:** ${modifierGroup.name}\n`);
                    texts.push(`**Selection Type:** ${modifierGroup.rule.required ? "Required" : "Optional"}\n`);
                    texts.push(`**Maximum Selection:** ${modifierGroup.rule.maxSelections ? modifierGroup.rule.maxSelections : "Unlimited"}\n\n`);

                    for (const modifierData of modifierGroup.modifiers) {
                        const modifier = modifiers.find((item) => item.id === modifierData.id);

                        const {
                            status,
                            price
                        } = getExtraCharges(modifierData);

                        texts.push(`- ${modifier.name} ${status ? "+" + price + "€" : ""}${modifierData.preSelected ? " **(pre-selected option)**" : ""}\n`);
                    }

                    texts.push("\n");
                }
            }

            if (index !== (itemIds.length - 1)) {
                texts.push("\n" + divider);
            }
        }

        // texts.push("\n‎\n");
        // texts.push("‎\n");
        // texts.push("‎\n");
        // texts.push("‎\n");
        // texts.push(divider);
        // texts.push(`This documentation is automatically created, for questions please email us. **Powered by Clusters & Wix.**`);

        let documentation = texts.join('');

        res.setHeader('Content-Disposition', `attachment; filename="${data["section"].name}.md"`);
        res.send(documentation);
    } catch (err) {
        console.error(err.message);
        if (!res.headersSent) {
            res.status(500).send(err.message);
        }
    }
});

const getExtraCharges = (modifierData) => {
    if (parseFloat(modifierData.additionalChargeInfo.additionalCharge) === 0) {
        return { status: false, price: parseFloat(modifierData.additionalChargeInfo.additionalCharge).toFixed(2) };
    } else {
        return { status: true, price: parseFloat(modifierData.additionalChargeInfo.additionalCharge).toFixed(2) };
    }
}

module.exports = {
    onlineRoute: router
};