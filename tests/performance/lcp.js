/**
 * Largest Contentful Paint
 * https://web.dev/lcp/
 */

const Lcp = async (time, device, networkPreset) => {
    const { URL: url } = process.env
    function calcLCP() {
        window.largestContentfulPaint = 0

        const observer = new PerformanceObserver((entryList) => {
            const entries = entryList.getEntries()
            const lastEntry = entries[entries.length - 1]
            window.largestContentfulPaint =
                lastEntry.renderTime || lastEntry.loadTime
        })

        observer.observe({
            type: 'largest-contentful-paint',
            buffered: true,
        })

        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                observer.takeRecords()
                observer.disconnect()
                console.log('LCP:', window.largestContentfulPaint)
            }
        })
    }
    const client = await page.target().createCDPSession()

    await client.send('Network.enable')
    await client.send('ServiceWorker.enable')
    if (networkPreset)
        await client.send('Network.emulateNetworkConditions', networkPreset)
    if (device || networkPreset)
        await client.send('Emulation.setCPUThrottlingRate', { rate: 4 })
    if (device) await page.emulate(device)

    await page.evaluateOnNewDocument(calcLCP)
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 })

    let lcp = await page.evaluate(() => {
        return window.largestContentfulPaint
    })
    await expect(lcp).toBeLessThanOrEqual(time)
}

module.exports = Lcp
