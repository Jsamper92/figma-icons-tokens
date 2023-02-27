/**
 * @author Javier Samper Arias
 * @copyright 2023 Javier Samper Arias. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict"

require("dotenv").config();

const [fs, route, utils] = [
    require('fs'),
    require('path'),
    require("./utils/utils")
];
const { error, config, getIcons, getData } = utils;

/**
 * @description This function init config to get icons figma
 * @param {{theme: string; path: string; file: string; key: string}} arg 
 * @return {Promise<{path: string; name: string; data: string}[]>}
 */
const figmaIconsTokens = async (arg) => {
    const { file, key, theme, path, bin, data } = config(arg);

    const isIcons = data ? Object.keys(data).length !== 0 : fs.existsSync(route.resolve(process.cwd(), file));
    const icons = getData(data, theme, key, file) || {};

    const handleIcons = async (resolve) => {
        if (process.env.FIGMA_TOKEN) {
            const files = await getIcons(path, icons, bin);
            resolve(files);
        } else {
            error("✖ Check environment variables");
        }
    }
    return new Promise(async (resolve) => {
        if (isIcons) {
            Object.values(icons).length
                ? handleIcons(resolve)
                : error(`✖ Check the script flags`);
        } else {
            error(`✖ No ${file} configuration file specified`);
        }
    })
}

module.exports = { figmaIconsTokens };