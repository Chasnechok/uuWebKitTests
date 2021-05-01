/**
 * First Contentful Paint
 * https://web.dev/fcp
 */

const Fcp = async (time, device, networkPreset) => {
    const { URL: url } = process.env
    const client = await page.target().createCDPSession()
    await client.send('Network.enable')
    await client.send('ServiceWorker.enable')
    if (networkPreset)
        await client.send('Network.emulateNetworkConditions', networkPreset)
    if (device || networkPreset)
        await client.send('Emulation.setCPUThrottlingRate', { rate: 4 })
    if (device) await page.emulate(device)

    await page.goto(url, { waitUntil: 'load' })
    let firstContentfulPaint = JSON.parse(
        await page.evaluate(() =>
            JSON.stringify(
                performance.getEntriesByName('first-contentful-paint'),
            ),
        ),
    )
    const result = firstContentfulPaint[0].startTime
    // console.log('🎨 First Contentful Paint' + (device?` on ${device.name}`:"") + (networkPreset?`, with ${networkPreset.name} throttle`:"") +":", result);
    await expect(result).toBeLessThanOrEqual(time)
}

module.exports = Fcp
