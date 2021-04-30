const url = 'https://uuapp.plus4u.net/uu-webkit-maing02/362ef7f4f2644e5797e6107034c0cfe3/writerGate/home';
const faker= require('faker/locale/en');

const WebpageCreate = async () => {
    /**
     * HDS 1
     */
    await page.goto(url, { waitUntil: 'networkidle0' });

    // navigate to writer gate
    // await expect(page).toClick('.uu-webkit-floating-buttons > div:first-child');
    // await page.waitForNavigation({waitUntil: 'networkidle0'});
    // await expect(page.url()).toMatch(/\/writerGate.*$/);
    page.setDefaultTimeout(8000);
    // set english
    await expect(page).toClick('.uu-webkit-floating-box > .uu5-bricks-button-group > button:last-child');
    await expect(page).toClick('.uu-webkit-floating-box > .uu5-bricks-popover .uu-webkit-language-buttons-code-text', { text: 'en' });
    await expect(page).toClick('body');

    // click on create page
    await expect(page).toClick('.uu-webkit-floating-box > .uu5-bricks-button-group > button span', { text: 'Page' });
    await expect(page).toClick('.uu-webkit-floating-box > .uu5-bricks-popover .uu5-bricks-link > span', { text: 'Create' });
    
    /**
     * HDS 2, HDS 3
     */

    // Name
    await expect(page).toMatchElement('.uu5-forms-input[name=name] input[name=name]');
    const inputNames = await page.$$('.uu5-forms-input[name=name]');
    for (let i = 0; i < inputNames.length; i++) {
        const input = inputNames[i];
        console.assert(input, 'WTF');
        await expect(input).toFill('input[name=name]', faker.random.words());
    }

    // Alternative name
    await expect(page).toMatchElement('.uu5-forms-input[name=title] input[name=title]');
    const inputTitles = await page.$$('.uu5-forms-input[name=title]');
    for (let i = 0; i < inputTitles.length; i++) {
        const input = inputTitles[i];
        console.assert(input, 'WTF');
        await expect(input).toFill('input[name=title]', faker.random.words());
    }

    // Description
    await expect(page).toMatchElement('.uu5-forms-input-wrapper > .uu5-codekit-ace-editor > textarea');
    const inputDescriptions = await page.$$('.uu5-forms-input-wrapper > .uu5-codekit-ace-editor');
    for (let i = 0; i < inputDescriptions.length; i++) {
        const input = inputDescriptions[i];
        console.assert(input, 'WTF');
        await expect(input).toFill('textarea', faker.random.words(Math.floor(Math.random() * 40)));
    }

    // Save
    await expect(page).toClick('.uu-webkit-add-page-form-button-wrapper span', { text: 'Create' });

    /**
     * HDS 4 - 6
     */
    let webPageCode;
    await page.waitForResponse(
        async (response) => {
            try {
                const { webPage } = await response.json();
                if(!webPage || !webPage.code) throw new Error('Response does not contain a "webpage" field or "code" field.');
                webPageCode = webPage.code;
                return response.url().match(/\/addWebPage.*$/i) && response.status() === 200;
            } catch (error) {
                return false;
            }
        },
        {
            timeout: 5000
        }
    )

    /**
     * HDS 7
     */
    await expect(page.url()).toMatch(webPageCode);



    await page.waitForTimeout(10000);
};
module.exports = WebpageCreate;