
# uuWebKitTests

  

Automated tests collection for uuWebKit.

  

### Installation

```
$ git clone https://github.com/Chasnechok/uuWebKitTests.git
$ cd ./uuWebKitTests
$ npm i
```

Then create a .env in the root folder with following content:

  

```
ACCESS_CODE_1=YourPlus4UAccessCode1
ACCESS_CODE_2=YourPlus4UAccessCode2
```

  

### Running tests

  

`$ npm run test` will run all tests and generate a report to report.json

  

`$ npm run test:smoke` will run a smoke test

  

`$ npm run test:performance` will run a performance test

  

---

  

### Obserwing tests

  

If you want to run Chromium during tests you may pass a **headless=false** argument to the run script.

    $ npm run test:smoke -- --headless=false

  

### Optionally skip tests

  

You may add .skip to individual tests or whole test block to skip it.

  

Example:

  

```javascript

describe('my beverage', () => {
	it.skip('Should be delicious', () => {
		expect(myBeverage.delicious).toBeTruthy()
	})
	it('Should be water', () => {
		expect(myBeverage.type).toBe('water')
	})
})

```