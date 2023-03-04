# 1.3.1 / 2022-02-27

- Fix resolve in promise figmaIconsTokens.

# 1.3.0 / 2022-02-27

- Added a "data" configuration parameter where an object with icons can be passed to it.

# 1.2.3 / 2022-02-24

- Fixed token bug with three nesting.

# 1.2.2 / 2022-02-13

- Added flag config to return message by promise resolve when consume Api Javascript

# 1.2.1 / 2022-02-04

- Added the data property in the javascript API response that returns the content of the svg.

# 1.2.0 / 2022-02-04

- Replace package axios to node-fetch to reduce package size
- Now it is no longer necessary to define the file id in the environment variables, it is obtained directly from the token URL that is defined in the configuration file. In this way, it is now possible to import icons from different iframes.

# 1.1.1 / 2022-01-31

- Fix error to build icons. In some case the defined path could be managed as indeterminate

# 1.1.0 / 2022-01-31

- Added Javascript API to handle icons import

# 1.0.4 / 2022-01-09

- Fixed handle error http to get icons

# 1.0.3 / 2022-01-09

- Update documentation

# 1.0.2 / 2022-01-09

- Added functionality where it allows dynamic nesting of icons based on the configuration file

# 1.0.1 / 2022-01-08

- Create cli figma-icons-tokens to import figma icons
