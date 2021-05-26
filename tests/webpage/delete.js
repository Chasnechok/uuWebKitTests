const moveToTrash = async (pageToDelete) => {
    await expect(page).toClick(
        '.uu-webkit-floating-box > .uu5-bricks-button-group > button > span > span',
        { text: 'Page', timeout: 3000 },
    )
    await expect(page).toClick(
        '.uu-webkit-floating-box > .uu5-bricks-popover button span',
        {
            text: 'Delete',
            timeout: 3000,
        },
    )
    await expect(page).toClick('.uu-webkit-controls button > span', {
        text: 'Delete',
        timeout: 3000,
    })
    let trashCode
    const trashResponse = await page.waitForResponse(
        async (response) => {
            try {
                return response.url().match(/\/trashWebPage.*$/i)
            } catch (error) {
                return false
            }
        },
        {
            timeout: 5000,
        },
    )
    if (!trashResponse.ok())
        await page.click(
            '.uu5-bricks-modal-header > .uu5-bricks-modal-header-close',
        )
    await trashResponse.json().then((body) => (trashCode = body.webPage?.code))
    await expect(trashCode).toBeDefined()
    pageToDelete.code = trashCode
    await page.waitForTimeout(1000)
}

const removeFromTrash = async ({ code }) => {
    let trashUrl = page
        .url()
        .replace(/\/writerGate.*/, `/writerGate/trash/page?code=${code}`)
    await page.goto(trashUrl, { waitUntil: 'networkidle0' })

    await expect(page).toClick('.uu-webkit-control-bar-trash-delete', {
        timeout: 5000,
    })
    await expect(page).toClick('.uu-webkit-controls button > span', {
        text: 'Delete',
        timeout: 3000,
    })

    const deleteResponse = await page.waitForResponse(
        async (response) => {
            try {
                return response.url().match(/\/deleteWebPage.*$/i)
            } catch (error) {
                return false
            }
        },
        {
            timeout: 5000,
        },
    )

    await expect(deleteResponse.ok()).toBeTruthy()
}

module.exports = {
    moveToTrash,
    removeFromTrash,
}
