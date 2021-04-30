require('expect-puppeteer')
const ErrorResponse = require('../utils/errorResponse.js')
const Login = require('../utils/login.js')
const WebpageCreate = require('./webpage/create.js')
const {
    handleUpdateInputs,
    handleUpdateState,
    handleUpdateMetas,
    handleUpdateRoute,
} = require('./webpage/update.js')
const { moveToTrash, removeFromTrash } = require('./webpage/delete.js')
require('dotenv').config()

const credentials = {
    code1: process.env.ACCESS_CODE_1,
    code2: process.env.ACCESS_CODE_2,
}

if (!credentials.code1 || !credentials.code2)
    throw new ErrorResponse(
        'Please configure ACCESS_CODE_1 and ACCESS_CODE_2 in the .env file.',
        'https://www.npmjs.com/package/dotenv',
    )

describe('WebPage', () => {
    beforeAll(Login, 30000)

    describe('Create', () => {
        it('Should create a WebPage', WebpageCreate, 60000)
    })

    describe('Update', () => {
        // beforeAll(async () => {
        //   /**
        //    * You may explicitly specify the page to update.
        //    * Default behavior is to update previosly created page.
        //    * Uncomment this section to do so.
        //    */
        //   //await page.goto('https://uuapp.plus4u.net/uu-webkit-maing02/362ef7f4f2644e5797e6107034c0cfe3/writerGate/19615173', { waitUntil: 'networkidle0' });
        // }, 30000)

        it(
            'Should update name',
            () => handleUpdateInputs('Update Name', 'name', false),
            30000,
        )
        it(
            'Should update title',
            () => handleUpdateInputs('Edit alternative name', 'title', false),
            30000,
        )
        it(
            'Should update description',
            () => handleUpdateInputs('Update Description', 'desc', true),
            30000,
        )
        it(
            'Should update state, reload after update',
            () => handleUpdateState('Closed', 1, true),
            30000,
        )
        /**
         * This one is skipped, because it fails. You can't update state multiple times without reload => bug.
         */
        it.skip(
            'Should update state multiple times, no reload',
            () => handleUpdateState('Closed', 3),
            30000,
        )
        it('Should update meta tags', handleUpdateMetas, 30000)
        it('Should update name of the route', handleUpdateRoute, 30000)
    })

    describe('Delete', () => {
        // beforeAll(async () => {
        //     /**
        //      * You may explicitly specify the page to delete.
        //      * Default behavior is to delete previosly created page.
        //      * Uncomment this section to do so.
        //      */
        //     //await page.goto('https://uuapp.plus4u.net/uu-webkit-maing02/362ef7f4f2644e5797e6107034c0cfe3/writerGate/39313238', { waitUntil: 'networkidle0' });
        //   }, 30000)
        const pageToDelete = { code: undefined }
        it('Should move to trash', () => moveToTrash(pageToDelete), 30000)
        it(
            'Should remove from trash',
            () => removeFromTrash(pageToDelete),
            30000,
        )
    })
})

/*
(async () => {
    const browser = await puppeteer.launch({headless: false});
    const context = await browser.defaultBrowserContext();

    await Login(context);
  
    await WebpageCreate(context, url);
    console.log('Here 1');

    await browser.close();
})();
*/
