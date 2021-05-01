require('expect-puppeteer')
require('dotenv').config()
const Lcp = require('./performance/lcp.js')
const Fcp = require('./performance/fcp.js')
const memoryLeaks = require('./performance/memoryLeaks.js')
const { iPhone6, Good3G } = require('../utils/presets.js')
const url =
    'https://uuapp.plus4u.net/uu-webkit-maing02/362ef7f4f2644e5797e6107034c0cfe3/'

describe('Performance', () => {
    beforeAll(async () => {
        process.env.URL = url
        await page.setCacheEnabled(false)
    })

    describe('First Contentful Paint', () => {
        beforeEach(async () => await jestPuppeteer.resetPage())
        it('Less than 600ms, no throttling', () => Fcp(600), 30000)
        it('Within a second, no throttling', () => Fcp(1000), 30000)
        it(
            'Less than 600ms, iPhone 6, Good 3G',
            () => Fcp(600, iPhone6, Good3G),
            30000,
        )
        it(
            'Within a second, iPhone 6, Good 3G',
            () => Fcp(1000, iPhone6, Good3G),
            30000,
        )
    })
    describe('Largest Contentful Paint', () => {
        beforeEach(async () => await jestPuppeteer.resetPage())

        it('Less than 3 seconds, no throttling', () => Lcp(3000), 60000)
        it('Less than 5 seconds, no throttling', () => Lcp(5000), 60000)
        it(
            'Less than 3 seconds, iPhone 6, Good 3G',
            () => Lcp(3000, iPhone6, Good3G),
            60000,
        )
        it(
            'Less than 5 seconds, iPhone 6, Good 3G',
            () => Lcp(5000, iPhone6, Good3G),
            60000,
        )
    })

    describe('Memory leaks', () => {
        beforeEach(async () => await jestPuppeteer.resetPage())

        it('Should not leak memory', memoryLeaks, 60000)
    })

    afterAll(async () => await page.setCacheEnabled(true))
})
