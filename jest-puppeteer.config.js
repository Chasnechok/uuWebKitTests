module.exports = {
    launch: {
        dumpio: false,
        headless: !process.argv.includes('--headless=false'), // false to launch Chromium
        devtools: false, // optionally display devtools in non-headless mode
        slowMo: 0, // optionally slow down typing
        defaultViewport: null,
    },
}
