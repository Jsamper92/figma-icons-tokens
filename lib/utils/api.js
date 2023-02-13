const fetch = require('node-fetch');

/**
 * @author Javier Samper Arias
 * @copyright 2023 Javier Samper Arias. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict"

/**
 * Header http generic
 */
const headers = {
    'X-FIGMA-TOKEN': process.env.FIGMA_TOKEN,
};
/**
 * Request http generic
 */
const request = {
    method: 'GET',
    headers
};

/**
 * api proxy for files
 *
 */
const _instanceFiles = `https://api.figma.com/v1/files/`;

/**
 * api proxy for images
 *
 */
const _instanceImages = `https://api.figma.com/v1/images/`;

/**
 * Function to fetch url
 * @param {string} url 
 * @returns {Response}
 */
const requestHttp = async (url) => {
    const response = await fetch(url, request);
    const data = await response.json()
    return data;
}

/**
 * get Figma node info
 *
 * @param {string} nodeId
 * @return {Promise<string>}
 */
const getNode = async (nodeId, fileId) => {
    const url = `${_instanceFiles}${fileId}/nodes?ids=${decodeURIComponent(nodeId)}`;
    const { nodes, ...rest } = await requestHttp(url);

    return nodes ? Object.keys(nodes)[0] : rest;
}
/**
 * get svg image resource url
 *
 * @param {string} nodeId
 * @return {Promise<string>}
 */
const getSvgImageUrl = async (nodeId, fileId) => {
    const url = `${_instanceImages}${fileId}/?ids=${decodeURIComponent(nodeId)}&format=svg`;
    const { images } = await requestHttp(url);

    return images[nodeId];
};
/**
 * get svg image resource url
 *
 * @param {string} url
 * @return {Promise<string>}
 */
const getIconContent = async (url) => {
    const response = await fetch(url, request);
    const data = await response.text();

    return { data };
}

module.exports = {
    getNode,
    requestHttp,
    getSvgImageUrl,
    getIconContent,
};