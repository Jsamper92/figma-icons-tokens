/**
 * @author Javier Samper Arias
 * @copyright 2023 Javier Samper Arias. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict"

const api = require('axios');
const headers = {
    'X-FIGMA-TOKEN': process.env.FIGMA_TOKEN,
};
/**
 * api endpoint for files
 *
 */
const instanceFiles = api.create({
    baseURL: `https://api.figma.com/v1/files/${process.env.FILE_KEY}`,
    headers,
});
/**
 * api endpoint for images
 *
 */
const instanceImages = api.create({
    baseURL: `https://api.figma.com/v1/images/${process.env.FILE_KEY}`,
    headers,
});

/**
 * get Figma node info
 *
 * @param {string} nodeId
 * @return {Promise<string>}
 */
const getNode = async (nodeId) => {
    const { data: { nodes } } = await instanceFiles.get(`/nodes?ids=${decodeURIComponent(nodeId)}`);
    return Object.keys(nodes)[0];
}
/**
 * get svg image resource url
 *
 * @param {string} nodeId
 * @return {Promise<string>}
 */
const getSvgImageUrl = async (nodeId) => {
    const { data: { images } } = await instanceImages.get(`/?ids=${decodeURIComponent(nodeId)}&format=svg`);
    return images[nodeId];
};
/**
 * get svg image resource url
 *
 * @param {string} url
 * @return {Promise<string>}
 */
const getIconContent = async (url) => api.get(url);

module.exports = {
    getNode,
    getSvgImageUrl,
    getIconContent,
};