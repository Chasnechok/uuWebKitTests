/**
 * Detect memory leaks
 * Based on:
 * https://media-codings.com/articles/automatically-detect-memory-leaks-with-puppeteer
 * https://pptr.dev/#?product=Puppeteer&version=v2.1.1&show=api-pagequeryobjectsprototypehandle
 */

// Check the number of objects retained on the heap
const countObjects = async (page) => {
    const prototypeHandle = await page.evaluateHandle(() => Object.prototype)
    /**
     * Count the number of objects on the page. Garbage collection will be triggered internally before counting the objects
     */
    const objectsHandle = await page.queryObjects(prototypeHandle)
    const numberOfObjects = await page.evaluate(
        (instances) => instances.length,
        objectsHandle,
    )

    await Promise.all([prototypeHandle.dispose(), objectsHandle.dispose()])

    return numberOfObjects
}

const memoryLeaks = async () => {
    const { URL: url } = process.env
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 })
    await page.waitForTimeout(5000)
    const numberOfObjects = await countObjects(page)

    await page.evaluate(() => {
        class GarbageObject {
            constructor() {
                this.numbers = {}
                for (let i = 0; i < 1000; i++) {
                    this.numbers[Math.random()] = Math.random()
                }
            }
        }
        for (let i = 0; i < 20; i++) {
            window['garbage' + i] = new GarbageObject()
        }
        const onMessage = () => {
            /* ... */
        }
        window.addEventListener('message', onMessage)
    })

    // just in case garbage collector will fail before counting
    await page._client.send('HeapProfiler.enable')
    await page._client.send('HeapProfiler.collectGarbage')

    const numberOfObjectsAfter = await countObjects(page)

    // Check if the number of retained objects is expected
    await expect(numberOfObjectsAfter).toEqual(numberOfObjects)
}

module.exports = memoryLeaks
