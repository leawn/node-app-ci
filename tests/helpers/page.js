const puppeteer = require('puppeteer');
const sessionFactory = require('../factories/sessionFactory');
const userFactory = require('../factories/userFactory');

class CustomPage {
    static async build() {
        const browser = await puppeteer.launch({
            headless: false
            //args: ['--no-sandbox']
        });

        const page = await browser.newPage();
        const customPage = new CustomPage(page);

        return new Proxy(customPage, {
            get: function (target, p) {
                return customPage[p] || browser[p] || page[p];
            }
        });
    }

    constructor(page) {
        this.page = page;
    }

    async login() {
        const user = await userFactory();
        const { session, sig } = sessionFactory(user);

        await this.page.setCookie({ name: 'express:sess', value: session });
        await this.page.setCookie({ name: 'express:sess.sig', value: sig });
        await this.page.goto('http://localhost:3000/blogs');
        await this.page.waitForSelector('a[href="/auth/logout"]');
    }

    async getContentsOf(selector) {
        return this.page.$eval(selector, el => el.innerHTML);``
    }

    async get(path) {
        return await this.page.evaluate(_path => {
            return fetch(_path, {
                method: 'GET',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(res => res.json())
                .catch(err => console.log(err));
        }, path);
    }

    async post(path, data) {
        return await this.page.evaluate((_path, _data) => {
            return fetch(_path, {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(_data)
            })
                .then(res => res.json())
                .catch(err => console.log(err));
        }, path, data)
    }

    execRequests(actions) {
        return Promise.all(
            actions.map(({ method, path, data }) => {
                console.log(method);
                return this[method](path, data);
            })
        );
    }
}

module.exports = CustomPage;
