/**
 * @author Javier Samper Arias
 * @copyright 2023 Javier Samper Arias. All rights reserved.
 * See LICENSE file in root directory for full license.
 */
"use strict"

const [fs, route, api, colors, argv] = [
    require('fs'),
    require("path"),
    require("./api"),
    require('colors'),
    require("minimist")(process.argv.slice(2))
];

const { red } = colors;
const { getNode, getSvgImageUrl, getIconContent } = api;

/**
 * @description Print message error
 * @param {String} message 
 * @returns {String}
 */
const error = (message) => console.log(red(message));

/**
 * @description This function gets the node and inserts it into the icon array
 * @param {string} item
 * @param {string} name
 * @param {Array<{name: string;node: string}>} _promises
 */
const getValueToken = (path, item, name, _promises) => {
    const { value } = item;

    const fileId = new RegExp(/(file\/)(.*)(\/)/).exec(value)[2];
    const nodeId = new RegExp(/(node-id=)(.*)(\=)/).exec(value)[2]

    if (!fs.existsSync(route.resolve(path, `${name}.svg`))) _promises.push({ name, nodeId, fileId });
};

/**
 * @description Function whose objective is to group the tree of icons defined in the configuration file 
 * @param {{[key: string]: {[key: string]: {name: string;node: string}} | {name: string;node: string}}} icons - Icons 
 * @param {*} names - Names of icons
 * @param {*} nodes - Array of icons
 */
const handleChildIcons = (path, icons, names, nodes) => {
    Object.entries(icons).forEach(([nameChild, child]) => {
        if (Object.keys(child).every((key) => key !== "value")) {
            handleChildIcons(child, [names, nameChild], nodes);
        } else {
            const name = [names, nameChild].flat(Infinity).join('_');
            getValueToken(path, child, name, nodes);
        }
    });
}

/**
 * @description This function returns an array with the name and node of each figma icon
 * @returns {Array<{name: string;node: string}>}
 */
const getNodeIcons = (path, icons) => {
    let nodes = [];
    Object.entries(icons).forEach(([name, item]) => {
        if (Object.keys(item).every((key) => key !== "value")) {
            handleChildIcons(path, item, [name], nodes);
        } else {
            getValueToken(path, item, name, nodes);
        }
    });

    return nodes;
};

/**
 * @description This function is used to return config to init script figma
 * @param {{theme: string; path: string; file: string; key: string}} args 
 * @returns {{theme: string; path: string; file: string; key: string}}
 */
const config = (args) => args || argv

/**
 * @description This function downloads the content of the icons and creates the svg file
 */
const getIcons = async (path, icons) => {
    const nodes = getNodeIcons(path, icons);
    if (!fs.existsSync(route.resolve(process.cwd(), path))) fs.mkdirSync(route.resolve(process.cwd(), path), { recursive: true });

    if (nodes.length) {
        return new Promise(async (resolve) => {
            await Promise.all(nodes.map(async ({ name, nodeId, fileId }) => ({ name, fileId, node: await getNode(nodeId, fileId) })))
                .then(async (response) => {
                    const allSvgUrl = await Promise.all(response.map(async ({ name, fileId, node }) => ({ name, url: await getSvgImageUrl(node, fileId) })));
                    const allSvgContent = await Promise.all(allSvgUrl.map(async ({ name, url }) => {
                        const { data } = await getIconContent(url);
                        return { name, data };
                    }));
                    const allFilesContent = await Promise.all(allSvgContent.map(async ({ name, data }) => {
                        const message = () => console.log(`✅ The icon ${name}.svg has been successfully created in the path ${path}/${name}.svg`);
                        return {
                            path,
                            name: `${name}.svg`,
                            data,
                            message
                        }
                    }))
                    await Promise.all(allFilesContent.map(async ({ path, name, data, message }) => {
                        fs.writeFile(route.resolve(path, name), data, message);
                        return { path, name, data }
                    })).then((files) => {
                        resolve(files);
                    }).catch((err) => {
                        error(err);
                    })
                })
                .catch((err) => {
                    err.response?.data?.status === 403
                        ? error("Check figma authorization token")
                        : error(err)
                });
        })
    } else {
        error("There are no new icons to import");
    }
};


module.exports = {
    error,
    config,
    getIcons,
    getValueToken,
    getNodeIcons,
};
