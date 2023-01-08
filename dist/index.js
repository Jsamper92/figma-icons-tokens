#!/usr/bin/env node
require("dotenv").config();

const { getNode, getSvgImageUrl, getIconContent } = require("./utils/api");
const { error } = require("./utils/utils");
const [fs, route, argv] = [
    require("fs"),
    require("path"),
    require("minimist")(process.argv.slice(2)),
];

const { file, key, theme, path } = argv;
const isIcons = fs.existsSync(route.resolve(process.cwd(), file));
const data = JSON.parse(fs.readFileSync(route.resolve(process.cwd(), file)));
const icons = data[theme][key] || {};

/**
 * @description This function gets the node and inserts it into the icon array
 * @param {string} item
 * @param {string} name
 * @param {Array<{name: string;node: string}>} _promises
 */
const getValueToken = (item, name, _promises) => {
    const { value } = item;
    const nodeId = new RegExp(/\bnode-id\b.*\b=\b/)
        .exec(value)[0]
        .replace("node-id=", "")
        .slice(0, -1);

    if (!fs.existsSync(route.resolve(path, `${name}.svg`))) _promises.push({ name, nodeId });
};
/**
 * @description This function returns an array with the name and node of each figma icon
 * @returns {Array<{name: string;node: string}>}
 */
const getNodeIcons = () => {
    let nodes = [];
    Object.entries(icons).forEach(([name, item]) => {
        if (Object.keys(item).every((key) => key !== "value")) {
            Object.entries(item).forEach(([nameChild, child]) => {
                getValueToken(child, `${name}_${nameChild}`, nodes);
            });
        } else {
            getValueToken(item, name, nodes);
        }
    });

    return nodes;
};

/**
 * @description This function downloads the content of the icons and creates the svg file
 */
const getIcons = async () => {
    const nodes = getNodeIcons();

    if (!fs.existsSync(route.resolve(process.cwd(), path))) fs.mkdirSync(route.resolve(process.cwd(), path), { recursive: true });
    if (nodes.length) {
        await Promise.all(nodes.map(async ({ name, nodeId }) => ({ name, node: await getNode(nodeId) })))
            .then(async (response) => {
                const allSvgUrl = await Promise.all(response.map(async ({ name, node }) => ({ name, url: await getSvgImageUrl(node) })));
                const allSvgContent = await Promise.all(allSvgUrl.map(async ({ name, url }) => {
                    const { data } = await getIconContent(url);
                    return { name, data };
                })
                );
                for await ([index, icon] of allSvgContent.entries()) {
                    const { name, data } = icon;
                    fs.writeFile(route.resolve(path, `${name}.svg`), data, () =>
                        console.log(
                            `✅ The icon ${name}.svg has been successfully created in the path ${path}/${name}.svg`
                        )
                    );
                }
            })
            .catch((err) => {
                const {
                    data: { status },
                } = err.response;

                if (status === 403) {
                    error("Check figma authorization token");
                    isError = true;
                } else {
                    error(err.response.data);
                }
            });
    } else {
        error("There are no new icons to import");
    }
};

if (isIcons) {
    if (Object.values(icons).length) {
        process.env.FIGMA_TOKEN && process.env.FILE_KEY ? getIcons() : error("Check environment variables");
    } else {
        error(`Check the script flags`);
    }
} else {
    error(`No ${file} configuration file specified`);
}
