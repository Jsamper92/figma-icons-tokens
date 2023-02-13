const { figmaIconsTokens } = require("../lib");
const { requestHttp, getNode } = require("../lib/utils/api");
const { error, getValueToken, getNodeIcons, handleChildIcons, config, getIcons } = require("../lib/utils/utils");
const { tokens } = require("./__mocks__/tokens");

describe('Library figma-icons-tokens', () => {
    describe('Environment variables', () => {
        it('should have a FIGMA_TOKEN', () => {
            expect(process.env.FIGMA_TOKEN).toBeDefined();
        })
    })

    describe('Script figmaIconsTokens', () => {
        beforeEach(() => {

        });

        it('should be define figmaIconsTokens', async () => {
            const _config = { path: 'assets', file: 'tokens.json', key: 'icon', theme: 'global', bin: false };

            /* expect(figmaIconsTokens(_config)).resolves.toBeDefined(); */
        })

        it('should execute figmaIconsTokens error', async () => {
            const _config = { path: 'assets', file: 'tokens.json', key: 'icon', theme: 'global', bin: false };

            /* expect(figmaIconsTokens(_config)).rejects.toMatch('error'); */
        })
    })

    describe('Api', () => {
        it('should execute requestHttp', async () => {
            const _fetch = requestHttp('https://api.figma.com/v1/files/P39ZzbENxy5c2cc0cLqnwZ/nodes?ids=926:217&t');

            expect(_fetch).resolves.toBeDefined();
        })

        it('should execute getNode', () => {
            expect(getNode('X', 'Y')).resolves.toBeDefined()
            expect(getNode('X', 'Y')).resolves.toEqual({
                "err": "Not found",
                "status": 404,
            });
        })
    })

    describe('Utils', () => {

        it('should execute log error', () => {
            expect(error()).toEqual(undefined)
        })

        it('should execute getValueToken', () => {
            const file = {
                "value": "https://www.figma.com/file/HUEONS1CdZa3fC5IEfLKzq/%5BEndesa%5D---Web-Mobile---READY?node-id=1408%3A5556&t=yzeccjoC0GplPgsS-4",
                "type": "asset"
            };
            let promises = [];
            getValueToken('assets', file, 'test', promises)
            expect(promises).toEqual([{ "fileId": "HUEONS1CdZa3fC5IEfLKzq", "name": "test", "nodeId": "1408%3A5556&t" }])
        })

        it('should execute getNodeIcons', () => {
            const _tokens = JSON.parse(tokens);

            expect(getNodeIcons('assets', _tokens.global.icon)).toBeDefined()
        })

        it('should execute handleChildIcons', () => {

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

        it('should execute config', () => {
            const _config = { path: 'assets', file: 'tokens.json', key: 'icon', theme: 'global', bin: false }

            expect(config(_config)).toEqual(_config)
        })

        it('should execute getIcons', async () => {
            const _tokens = JSON.parse(tokens);
            /* const data = await getIcons('assets', _tokens.global.icon); */

            expect(getIcons).toBeDefined()
        }, 10500)
    })
})
