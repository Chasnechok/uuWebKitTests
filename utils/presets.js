const puppeteer = require('puppeteer')

/**
 * Network presets
 */
const Good3G = {
    offline: false,
    downloadThroughput: (1.5 * 1024 * 1024) / 8,
    uploadThroughput: (750 * 1024) / 8,
    latency: 40,
    name: 'Good 3G',
}

/**
 * Devices presets
 */
const iPhone6 = puppeteer.devices['iPhone 6']
module.exports = {
    Good3G,

    iPhone6,
}
