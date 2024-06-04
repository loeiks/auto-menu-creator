const puppeteer = require('puppeteer');
const path = require('path');

async function captureScreenshot() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set a larger viewport size for higher resolution
    await page.setViewport({
        width: 1920,
        height: 1080,
        deviceScaleFactor: 3 // This will make the screenshot 3 times larger
    });

    // Replace with the URL of your page
    await page.goto('http://localhost:3000');

    // Replace with the selector of the element you want to screenshot
    const element = await page.$('.menu-page');

    // Define the path where you want to save the screenshot (customize later)
    const savePath = path.join('C:', 'Users', 'enes', 'Downloads', 'menu.png');

    setTimeout(async () => {
        // Take a screenshot of the element
        await element.screenshot({ path: savePath, type: 'png' });
        await browser.close();
    }, 2000);
}

captureScreenshot().catch(console.error);
