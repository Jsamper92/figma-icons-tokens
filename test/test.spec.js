const { figmaIconsTokens } = require("../lib");
const { requestHttp, getNode, getIconContent, getSvgImageUrl } = require("../lib/utils/api");
const { error, getValueToken, getNodeIcons, handleChildIcons, config, getIcons } = require("../lib/utils/utils");
const { tokens } = require("./__mocks__/tokens");
const fs = require('fs');

describe('Library figma-icons-tokens', () => {

    const _tokens = JSON.parse(tokens);
    const _config = { path: 'assets', file: 'tokens.json', key: 'icon', theme: 'global', bin: false };

    const config = (arg) => {
        return {
            file: arg.file || "tokens.json",
            key: arg.key || "icons",
            theme: arg.theme || "global",
            path: arg.path || "assets",
            bin: arg.bin || false
        }
    }

    describe('Environment variables', () => {

        it('should have a FIGMA_TOKEN', () => {

            expect(process.env.FIGMA_TOKEN).toBeDefined();
        })
        
    })

    describe('Script figmaIconsTokens', () => {

        it('should be define figmaIconsTokens', async () => {

            expect(figmaIconsTokens).toBeDefined();
        })

        it('returns a promise if fs.existsSync is true', async () => {
            const resolvedPromise = Promise.resolve();
            fs.existsSync = jest.fn().mockReturnValue(true);
            const result = figmaIconsTokens(config(_config));
            expect(result).toEqual(resolvedPromise);
        });
    })

    describe('Api', () => {

        describe('requestHttp', () => {

            it('should defined requestHttp', async () => {
                const _fetch = requestHttp('https://api.figma.com/v1/files/P39ZzbENxy5c2cc0cLqnwZ/nodes?ids=926:217&t');

                expect(_fetch).resolves.toBeDefined();
            })
        });


        describe('getNode', () => {
            const nodeId = '926%3A82';
            const fileId = 'P39ZzbENxy5c2cc0cLqnwZ';
            const path = 'assets';
            it('should defined', () => {
                expect(getNode).toBeDefined()
            })

            it('should return an SVG image url', async () => {
                const result = await getNode(nodeId, fileId);
                expect(result).toEqual('926:82')
            });
        });

        describe('getSvgImageUrl', () => {
            const nodeId = '926:82';
            const fileId = 'P39ZzbENxy5c2cc0cLqnwZ';

            it('should defined', async () => {
                expect(getSvgImageUrl).toBeDefined();
            });

            it('should return an SVG image url', async () => {
                const result = await getSvgImageUrl(nodeId, fileId);

                expect(result).toBeDefined();
            });
        });

        describe('getIconContent', () => {
            const image = 'https://figma-alpha-api.s3.us-west-2.amazonaws.com/images/367c983a-9682-4ad6-bf94-cb38225db399';
            const svg = require('./__mocks__/iconSvg');
            it('should defined', async () => {
                expect(getIconContent).toBeDefined();
            });

            it('should return an SVG url', async () => {
                const result = await getIconContent(image);

                expect(result).toEqual(svg);
            });
        });

    })

    describe('Utils', () => {

        describe('config', () => {

            it('should defined', () => {

                expect(config).toBeDefined()
            });
            it('should executed', () => {

                expect(config(_config)).toEqual(_config)
            })
        });

        describe('error', () => {
            it('should be defined', () => {
                expect(error).toBeDefined()
            })

            it('should be executed', () => {
                expect(error('test')).toBe()
            })
        })

        describe('getValueToken', () => {
            const promises = [];
            const file = {
                "value": "https://www.figma.com/file/HUEONS1CdZa3fC5IEfLKzq/%5BEndesa%5D---Web-Mobile---READY?node-id=1408%3A5556&t=yzeccjoC0GplPgsS-4",
                "type": "asset"
            };

            it('should be defined', () => {
                expect(getValueToken).toBeDefined()
            })

            it('should execute getValueToken', () => {
                getValueToken('assets', file, 'test', promises)
                expect(promises).toEqual([/* { "fileId": "HUEONS1CdZa3fC5IEfLKzq", "name": "test", "nodeId": "1408%3A5556&t" } */])
            })

        })

        describe('getNodeIcons', () => {

            it('should defined', () => {
                expect(getNodeIcons('assets', _tokens.global.icon)).toBeDefined()
            })
        });

        describe('handleChildIcons', () => {
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


            it('should call handleChildIcons, getValueToken, and return an array of objects', () => {

                expect(handleChildIcons('assets', _token, ['chevron-right'], nodes)).toBe(undefined)
            });
        });

        describe('getIcons', () => {

            it('should defined', () => {

                expect(getIcons).toBeDefined();
            });
            it('should return an error if there are no new icons to import', async () => {
                const result = await getIcons('', [], false);

                expect(result).toEqual();
            });
        });

        it('should execute getIcons', async () => {
            /* const data = await getIcons('assets', _tokens.global.icon); */

            expect(getIcons).toBeDefined()
        }, 10500)
    })
})
