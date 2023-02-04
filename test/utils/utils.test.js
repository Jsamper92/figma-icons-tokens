const { error, getValueToken } = require("../../utils/utils")

describe('Environment variables', () => {
    test('should have a FIGMA_TOKEN', () => {
        expect(process.env.FIGMA_TOKEN).toBeDefined();
    })
})

describe('Utils', () => {
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
})