const { figmaIconsTokens } = require("../../lib");
const { requestHttp } = require("../../utils/api");
const { error, getValueToken, getNodeIcons, handleChildIcons, config, getIcons } = require("../../utils/utils");
const { tokens } = require("../__mocks__/tokens");

describe('Environment variables', () => {
    test('should have a FIGMA_TOKEN', () => {
        expect(process.env.FIGMA_TOKEN).toBeDefined();
    })
})

describe('figmaIconsTokens', () => {
    beforeEach(() => {
        
    });

    test('should execute figmaIconsTokens', async () => {
        const _config = { path: 'assets', file: 'tokens.json', key: 'icon', theme: 'global' }

        expect(figmaIconsTokens(_config)).resolves.toBeDefined();        
    })

    test('should execute figmaIconsTokens error', async () => {
        const _config = { path: 'assets', file: 'tokens.json', key: 'icon', theme: 'global' }

        expect(figmaIconsTokens(_config)).rejects.toMatch('error');
    })
})


describe('Utils', () => {

    /* beforeEach(() => {
        jest.setTimeout(60000);
    }); */

    test('should execute log error', () => {
        expect(error()).toEqual(undefined)
    })

    test('should execute getValueToken', () => {
        const file = {
            "value": "https://www.figma.com/file/HUEONS1CdZa3fC5IEfLKzq/%5BEndesa%5D---Web-Mobile---READY?node-id=1408%3A5556&t=yzeccjoC0GplPgsS-4",
            "type": "asset"
        };
        let promises = [];
        getValueToken('assets', file, 'test', promises)
        expect(promises).toEqual([{ "fileId": "HUEONS1CdZa3fC5IEfLKzq", "name": "test", "nodeId": "1408%3A5556&t" }])
    })

    test('should execute getNodeIcons', () => {
        const _tokens = JSON.parse(tokens);

        expect(getNodeIcons('assets', _tokens.global.icon)).toBeDefined()
    })

    test('should execute handleChildIcons', () => {

        const _token = {
            filled: {
                value: 'https://www.figma.com/file/P39ZzbENxy5c2cc0cLqnwZ/An%C3%A1lisis-componentes-visuales-%2B-Figma?node-id=6%3A89&t=FRdHhLSjJ3kpmpyO-4',
                type: 'asset'
            }
        };
        const nodes = [
            {
                name: 'add',
                nodeId: '1408%3A5556&t',
                fileId: 'HUEONS1CdZa3fC5IEfLKzq'
            }
        ]

        expect(handleChildIcons('assets', _token, ['chevron-right'], nodes)).toBe(undefined)
    })

    test('should execute config', () => {
        const _config = { path: 'assets', file: 'tokens.json', key: 'icon', theme: 'global' }

        expect(config(_config)).toBe(_config)
    })

    test('should execute getIcons', async () => {
        const _tokens = JSON.parse(tokens);
        const data = await getIcons('assets', _tokens.global.icon);

        expect(data).toEqual(undefined)
    })
})