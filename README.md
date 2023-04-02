# nucleus ![Nightly Status](https://github.com/steviegt6/nucleus/actions/workflows/nightly.yml/badge.svg) [![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://choosealicense.com/licenses/mit/l)

> Open-source reimplementation of Discord's Desktop app bootstraper (referred to by many as the `app.asar`).

---

## What is nucleus?

nucleus is a reimplementation of the bootstrapper used by Desktop distributions of Discord. This is an alternative method of modding Discord through somewhat disconnected means.

### nucleus Features

nucleus aims to be a feature-rich OpenAsar fork, and includes:

-   **:house: shelter injection**: comes packaged with the ability to inject [`uwu/shelter`](https://github.com/uwu/shelter);
-   **:memo: built-in settings file editing**: adds the ability to directly edit your `settings.json` file for one reason or another.

#### nucleus Roadmap

Want to see future plans? View the [roadmap](ROADMAP.md).

### OpenAsar Features

nucleus has all of OpenAsar's features, such as:

-   **:rocket: faster start-up speeds**: upwards of 2x-4x increases observed;
-   **:chart_with_upwards_trend: increased performance**: increased speeds result in a snappier client;
-   **:paintbrush: start-up splash theming**: easy theming for your start-up splash compatible with client mods;
-   **:electric_plug: drop-in installation**: all you need to do is change a file (uninstalling is the same);
-   **:gear: configurable features**: options to enhance both Discord and nucleus (see: [Configuration](#configuration));
-   **:feather: lightweight file size**: about <2% of Discord's original size (9mb -> ~50kb);
-   **:shield: reduced tracking**: removes Discord's built-in tracking for crashes and errors in the bootstrapper (not app itself).

**See the [FAQ](FAQ.md) for more details!**

## Obtaining a Copy

### Users

Users should download the latest release binary. See how by following the [installation guide](https://github.com/steviegt6/nucleus/wiki/Install-Guide).

### Developers

```sh
# clone the repo
git clone https://github.com/steviegt6/nucleus.git

# move into the newly-created directory
cd nucleus

# install dependencies
npm i

# if you just want to build
tsc
npm run pack

# if you want to build and run
# the dev script just runs tsc, scripts/pack.js, scripts/copy.js, and scripts/run.js
npm run dev
```

<!-- nucleus, like OpenAsar, also depends on a CDN to retrieve files from (namely, the config). Our fork is hosted at [steviegt6/nucleus-cdn](https://github.com/steviegt6/nucleus-cdn) ([cdn.nucleus.tomat.dev](https://cdn.nucleus.tomat.dev)). Depending on what you are developing or testing, you may need to host your own CDN locally and change `./src/utils/win.js` appropriately. -->

## Configuration

You may configure nucleus by clicking the text that displays "nucleus" followed by a six-letter commit SHA in the bottom of your settings sidebar, which will open the config window.
