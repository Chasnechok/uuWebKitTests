const faker = require('faker/locale/en')
const { camalize } = require('../../utils/helpers.js')

const handleUpdateInputs = async (useCase, inputName, isTextArea) => {
    await expect(
        page,
    ).toClick(
        '.uu-webkit-floating-box > .uu5-bricks-button-group > button span',
        { text: 'Page', timeout: 5000 },
    )
    await expect(page).toClick(
        '.uu-webkit-floating-box > .uu5-bricks-popover button span',
        {
            text: 'Basic Properties',
            timeout: 5000,
        },
    )
    await expect(page).toClick(
        '.uu-webkit-floating-box > .uu5-bricks-popover button span',
        {
            text: useCase,
            timeout: 5000,
        },
    )

    let cs = faker.random.words(~~(Math.random() * isTextArea ? 20 : 3))
    let en = faker.random.words(~~(Math.random() * isTextArea ? 20 : 3))
    /**
     * HDS 2
     */
    if (isTextArea) {
        // timeout is needed to prevent click not being registered, but test continues.
        await page.waitForTimeout(1000)
        await expect(page).toClick('.uu5-bricks-dropdown-button', {
            timeout: 5000,
        })
        for (let i = 0; i < 2; i++) {
            await expect(page).toClick(
                `li.uu5-bricks-dropdown-item:${
                    i == 0 ? 'first' : 'last'
                }-child`,
                { timeout: 5000 },
            )
            await expect(page).toClick('.uu5-codekit-ace-editor', {
                timeout: 5000,
            })
            await page.keyboard.down('Control')
            await page.keyboard.press('KeyA')
            await page.keyboard.up('Control')
            await page.keyboard.press('Backspace')
            await expect(page).toFill('textarea', i == 1 ? cs : en)
            if (i == 0)
                await expect(page).toClick('.uu5-bricks-dropdown-button')
        }
    } else {
        await expect(
            page,
        ).toMatchElement(
            `.uu5-forms-input[name=${inputName}] input[name=${inputName}]`,
            { timeout: 5000 },
        )
        const inputs = await page.$$(`.uu5-forms-input[name=${inputName}]`)
        for (let i = 0; i < inputs.length; i++) {
            const input = inputs[i]
            await expect(input).toFill(
                `input[name=${inputName}]`,
                i == 0 ? cs : en,
            )
        }
    }

    /**
     * HDS 3
     */
    await expect(page).toClick('.uu-webkit-controls span', { text: 'Save' })
    let updated
    const inputUpdateResponse = await page.waitForResponse(
        (response) => response.url().match(/\/updateWebPage.*$/i),
        {
            timeout: 5000,
        },
    )
    await inputUpdateResponse
        .json()
        .then((body) => (updated = body[inputName]))
        .catch(console.log)

    /**
     * HDS 4
     */
    await expect(updated).toBeDefined()
    await expect(updated).toEqual(expect.objectContaining({ cs, en }))
}

const handleUpdateState = async (state, cykles, reloadAfterUpdate) => {
    for (let i = 0; i < cykles; i++) {
        await expect(
            page,
        ).toClick(
            '.uu-webkit-floating-box > .uu5-bricks-button-group > button span',
            { text: 'Page' },
        )
        await expect(page).toClick(
            '.uu-webkit-floating-box > .uu5-bricks-popover button span',
            {
                text: 'Set Page State',
            },
        )
        await page.waitForTimeout(1000)
        await expect(page).toClick(
            `.uu5-forms-radios > .uu5-forms-input-wrapper > .uu5-forms-checkbox[name="${camalize(
                state,
            )}"] button`,
        )
        await expect(page).toClick('.uu5-bricks-modal-footer span', {
            text: 'OK',
        })
        let updated
        const saveResponse = await page.waitForResponse(
            (response) => response.url().match(/\/updateWebPage.*$/i),
            {
                timeout: 5000,
            },
        )
        await saveResponse
            .json()
            .then((body) => (updated = body['state']))
            .catch(console.log)

        // Reload if not 2xx, so other tests are not affected.
        if (!saveResponse.ok()) await page.reload({ waitUntil: 'networkidle0' })

        await expect(updated).toBeDefined()
        await expect(camalize(updated)).toMatch(camalize(state))
        if (reloadAfterUpdate) await page.reload({ waitUntil: 'networkidle0' })
    }
}

const handleUpdateMetas = async () => {
    await expect(
        page,
    ).toClick(
        '.uu-webkit-floating-box > .uu5-bricks-button-group > button span',
        { text: 'Page', timeout: 5000 },
    )
    await expect(page).toClick(
        '.uu-webkit-floating-box > .uu5-bricks-popover button span',
        {
            text: 'Set Meta Tags',
            timeout: 5000,
        },
    )
    // timeout is needed to prevent click not being registered, but test continues.
    await page.waitForTimeout(500)
    await expect(page).toClick(
        'form > .uu5-forms-select > .uu5-forms-input-wrapper',
        {
            timeout: 5000,
        },
    )
    await page.waitForTimeout(500)
    const metas = await page.$$eval(
        '.uu5-forms-item-list > div > a',
        (options) => options.map((option) => option.textContent),
    )

    for (let i = 0; i < metas.length; i++) {
        let text = metas[i]
        await expect(page).toClick('.uu5-forms-item-list > div > a', {
            timeout: 5000,
            text,
        })
        const __inputs__ = await page.$$('form .uu5-forms-text-input')
        for (let x = 0; x < __inputs__.length; x++) {
            await expect(__inputs__[x]).toFill('input', faker.random.word())
        }
        await expect(page).toClick('.uu5-forms-input[name="content"] button', {
            timeout: 5000,
        })
        await expect(page).toClick(
            'form > .uu5-forms-select > .uu5-forms-input-wrapper',
            {
                timeout: 5000,
            },
        )
    }
    await expect(page).toClick('.uu5-bricks-modal-footer button > span', {
        timeout: 5000,
        text: 'Save',
    })
    let updated
    const saveResponse = await page.waitForResponse(
        (response) => response.url().match(/\/updateWebPage.*$/i),
        {
            timeout: 5000,
        },
    )
    await saveResponse
        .json()
        .then((body) => (updated = body['userMetaTags']))
        .catch(console.log)
    if (!saveResponse.ok())
        await page.click(
            '.uu5-bricks-modal-header > .uu5-bricks-modal-header-close',
        )

    await expect(updated).toBeDefined()
}

const handleUpdateRoute = async () => {
    await page.waitForTimeout(1000)
    await expect(
        page,
    ).toClick(
        '.uu-webkit-floating-box > .uu5-bricks-button-group > button span',
        { text: 'Page', timeout: 5000 },
    )
    await page.waitForTimeout(1000)
    await expect(page).toClick(
        '.uu-webkit-floating-box > .uu5-bricks-popover button span',
        {
            text: 'Set Route',
            timeout: 5000,
        },
    )
    let newRouteName =
        faker.lorem.word(~~(Math.random() * 10) + 6) + ~~(Math.random() * 1000)
    await page.waitForTimeout(500)
    await expect(page).toFill('input[name=route]', newRouteName, {
        timeout: 5000,
    })
    await page.waitForTimeout(500)
    await expect(page).toClick('.uu5-bricks-modal-footer button > span', {
        timeout: 5000,
        text: 'Save',
    })

    const saveResponse = await page.waitForResponse(
        (response) => response.url().match(/\/updateRoute.*$/i),
        {
            timeout: 5000,
        },
    )
    if (!saveResponse.ok())
        await page.click(
            '.uu5-bricks-modal-header > .uu5-bricks-modal-header-close',
        )

    await page.waitForTimeout(1000)
    await expect(page.url()).toMatch(newRouteName)
}
module.exports = {
    handleUpdateInputs,
    handleUpdateState,
    handleUpdateMetas,
    handleUpdateRoute,
}
