const faker= require('faker/locale/en');

const WebpageUpdate = async () => {
    /**
     * This test will only fire if there were no errors in the previous one => HDS 1 checked.
     * It will try to update properties of the created WebPage.
     */
    await page.goto('https://uuapp.plus4u.net/uu-webkit-maing02/362ef7f4f2644e5797e6107034c0cfe3/writerGate/89954930', { waitUntil: 'networkidle0' }); 


    const handleUpdate = async (useCase, inputName, isTextArea) => {
        await expect(page).toClick('.uu-webkit-floating-box > .uu5-bricks-button-group > button span', { text: 'Page' });
        if(inputName) await expect(page).toClick('.uu-webkit-floating-box > .uu5-bricks-popover button span', { text: 'Basic Properties' });
        await expect(page).toClick('.uu-webkit-floating-box > .uu5-bricks-popover button span', { text: useCase });

        let cs = faker.random.words(Math.floor(Math.random() * isTextArea ? 20 : 3));
        let en = faker.random.words(Math.floor(Math.random() * isTextArea ? 20 : 3));
        /**
         * HDS 2
         */
        if(isTextArea) {
            await expect(page).toMatchElement('.uu5-bricks-dropdown-button', { timeout: 3000 });
            await expect(page).toClick('.uu5-bricks-dropdown-button');
            for (let i = 0; i < 2; i++) {
                await expect(page).toClick(`li:${i==0?"first":"last"}-child`, { timeout: 5000 });
                await expect(page).toClick('textarea', { timeout: 3000, clickCount: 3, delay: 500 });
                await page.waitForTimeout(1000);
                await expect(page).toFill('textarea', i==1?cs:en);
                if(i==0) await expect(page).toClick('.uu5-bricks-dropdown-button');
            }
        } else {
            await expect(page).toMatchElement(`.uu5-forms-input[name=${inputName}] input[name=${inputName}]`, { timeout: 3000 });
            const inputs = await page.$$(`.uu5-forms-input[name=${inputName}]`);
            for (let i = 0; i < inputs.length; i++) {
                const input = inputs[i];
                await expect(input).toFill(`input[name=${inputName}]`, i==0?cs:en);
            }
        }

        /**
         * HDS 3
         */
        await expect(page).toClick('.uu-webkit-controls span', { text: 'Save' });
        let updated;
        await page.waitForResponse(
            async (response) => {
                try {
                    const body = await response.json();
                    if(!body[inputName]) throw new Error(`Response does not contain "${inputName}" field.`);
                    updated = body[inputName];
                    return response.url().match(/\/updateWebPage.*$/i) && response.status() === 200;
                } catch (error) {
                    return false;
                }
            },
            {
                timeout: 5000
            }
        )

        /**
         * HDS 4
         */
        await expect(updated).toBeDefined();
        await expect(updated).toEqual(expect.objectContaining({ cs, en }));
    }

    // update name
    await handleUpdate('Update Name', 'name', false);

    // edit alternative name
    await handleUpdate('Edit alternative name', 'title', false);

    // update description
    await handleUpdate('Update Description', 'desc', true);
    
    

    await page.waitForTimeout(1000);
} 

module.exports = WebpageUpdate;