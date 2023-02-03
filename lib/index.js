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
    require("../utils/utils")
];
const { error, config, getIcons } = utils;

/**
 * @description This function init config to get icons figma
 * @param {{theme: string; path: string; file: string; key: string}} arg 
 * @return {Promise<{path: string; name: string; data: string}[]>}
 */
const figmaIconsTokens = async (arg) => {
    const { file, key, theme, path } = config(arg);
    const isIcons = fs.existsSync(route.resolve(process.cwd(), file));
    const data = JSON.parse(fs.readFileSync(route.resolve(process.cwd(), file)));
    const icons = data[theme][key] || {};
    const handleIcons = async (resolve) => {
        if (process.env.FIGMA_TOKEN && process.env.FILE_KEY) {
            const files = await getIcons(path, icons);
            resolve(files);
        } else {
            error("Check environment variables");
        }
    }

    return new Promise(async (resolve) => {
        if (isIcons) {
            Object.values(icons).length
                ? handleIcons(resolve)
                : error(`Check the script flags`);
        } else {
            error(`No ${file} configuration file specified`);
        }
    })
}

module.exports = { figmaIconsTokens };