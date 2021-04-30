require('expect-puppeteer');
const ErrorResponse = require('../utils/errorResponse.js');
const Login = require('../utils/login.js');
const WebpageCreate = require('./webpage/create.js');
const WebpageUpdate = require('./webpage/update.js');
require('dotenv').config()

const credentials = { code1: process.env.ACCESS_CODE_1, code2: process.env.ACCESS_CODE_2 };

if(!credentials.code1 || !credentials.code2) throw new ErrorResponse('Please configure ACCESS_CODE_1 and ACCESS_CODE_2 in the .env file.', 'https://www.npmjs.com/package/dotenv');


describe('Smoke test', () => {
    beforeAll(Login, 30000)

    it.skip('Should create a WebPage', WebpageCreate, 60000);
    it('Should update WebPage', WebpageUpdate, 60000);
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