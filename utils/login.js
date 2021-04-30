const Login = async () => {
    await jestPuppeteer.resetBrowser();
    const loginPage = await context.newPage();
    await loginPage.goto('https://uuidentity.plus4u.net/', { waitUntil: 'networkidle0' });

    await expect(loginPage).toFill('input[name=accessCode1]', process.env.ACCESS_CODE_1);
    await expect(loginPage).toFill('input[name=accessCode2]', process.env.ACCESS_CODE_2);
    await expect(loginPage).toClick('.uu-identitymanagement-core-login-form-content form button[type=submit]');

    await loginPage.waitForNavigation({waitUntil: 'networkidle0'});

    await expect(loginPage).toMatchElement('.plus4u5-app-button-authenticated', { timeout: 3000 });
        
    await loginPage.close();
    // await Promise.all([
    //     await loginPage.waitForNavigation({waitUntil: 'networkidle0'}),
    // ]);
    
};
module.exports = Login;