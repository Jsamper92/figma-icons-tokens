#!/usr/bin/env node
require("dotenv").config();

const { getNode, getSvgImageUrl, getIconContent } = require("./utils/api");
const { error, chunk, timer } = require("./utils/utils");
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
}
/**
 * @description This function returns an array with the name and node of each figma icon
 * @returns {Array<{name: string;node: string}>}
 */
const awaitUrlIcons = () => {
    return new Promise((resolve) => {
        let _promises = [];

        Object.entries(icons).forEach(async ([name, item], index) => {
            if (Object.keys(item).every(key => key !== 'value')) {
                Object.entries(item).forEach(async ([nameChild, child], index) => {
                    getValueToken(child, `${name}_${nameChild}`, _promises);
                })
            } else {
                getValueToken(item, name, _promises);
            }
            if (index === Object.keys(icons).length - 1) {
                if (_promises.length === 0) {
                    error('There are no new icons to import');
                } else {
                    resolve(_promises);
                }
            }
        });
    });
};
/**
 * this function returns the svg content of each icon and will create it as a file
 * @param {Array<{name: string;node: string}>} icons - Array chunk icons specefied
 */
const getIconSvg = async (icons) => {
    let isError = false;
    for await (item of icons) {
        const { name, nodeId } = item;
        if(isError) break;
        await getNode(nodeId)
            .then(async (response) => {
                await getSvgImageUrl(response)
                    .then(async (urlContent) => {
                        await getIconContent(urlContent)
                            .then((response) => {
                                const { data } = response;
                                fs.writeFile(route.resolve(path, `${name}.svg`), data, () =>
                                    console.log(
                                        `✅ The icon ${name}.svg has been successfully created in the path ${path}/${name}.svg`
                                    )
                                );
                            })
                            .catch((err) => {
                                error(err);
                            });
                    })
                    .catch(err => {
                        error(err);
                    })
            })
            .catch((err) => {
                const { data: { status } } = err.response;

                if (status === 403) {
                    error('Check figma authorization token');
                    isError = true;
                } else {
                    error(err.response.data);
                }
            })
    }
};

/**
 * @description This function initializes the import of figma icons
 */
const getIcons = async () => {
    if (!fs.existsSync(route.resolve(process.cwd(), path)))
        fs.mkdirSync(route.resolve(process.cwd(), path), { recursive: true });

    awaitUrlIcons()
        .then(async (promises) => {
            const chunks = chunk(promises, 10);
            for await (item of chunks) {
                getIconSvg(item);
                if (chunks.length > 1) await timer(45000);
            }
        })
        .catch((err) => {
            error(err);
        });
};

if (isIcons) {
    if (Object.values(icons).length) {
        if (process.env.FIGMA_TOKEN && process.env.FILE_KEY) {
            getIcons();
        } else {
            error('Check environment variables');
        }
    } else {
        error(`Check the script flags`);
    }
} else {
    error(`No ${file} configuration file specified`);
}
