_Forked from [GooseMod/OpenAsar](https://github.com/GooseMod/OpenAsar)._

# `nucleus` ![Nightly Status](https://github.com/Steviegt6/nucleus/actions/workflows/nightly.yml/badge.svg) [![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://choosealicense.com/licenses/mit/l)

<!-- ### Acrylic fork (Windows only) - uses [`@pyke/vibe`](https://github.com/pykeio/vibe) under [Apache 2.0](https://github.com/pykeio/vibe/blob/main/LICENSE) -->

> Open-source reimplementation of Discord's Desktop app bootstraper (referred to by many as the `app.asar`).

---

### Features

`nucleus`' changes include many features, such as:

- **:rocket: faster start-up speeds**: upwards of 2x-4x increases observed;
- **:chart_with_upwards_trend: increased performance**: increased speeds result in a snappier client;
- **:paintbrush: start-up splash theming**: easy theming for your start-up splash compatible with client mods;
- **:electric_plug: drop-in installation**: all you need to do is change a file (uninstalling is the same);
- **:gear: configurable features**: options to enhance both Discord and `nucleus` (see: [Configuration](#configuration));
- **:feather: lightweight file size**: about <2% of Discord's original size (9mb -> ~50kb);
- **:shield: reduced tracking**: removes Discord's built-in tracking for crashes and errors in the bootstrapper (not app itself).

**Set the [FAQ](FAQ.md) for more details!**

## Obtaining a Copy

### Users

Users should download the latest release binary. See how by following the [installation guide](https://github.com/Steviegt6/nucleus/wiki/Install-Guide).

### Developers

To develop `nucleus`, all you must do is obtain a copy of the source code by cloning the repository, inject the polyfills, pack the app into a `.asar` file, and replace Discord's existing one. This may be condensed down into several simple commands:

```sh
# clone the repo
git clone https://github.com/steviegt6/nucleus.git

# move into the newly-created directory
cd nucleus

# inject polyfills
sh ./scripts/injectPolyfills.sh

# pack into app.asar
asar pack src app.asar

# copy it to where your discord app.asar is located
cp app.asar "path/to/your/app.asar"

# run discord through some means (windows users may want the start command, while linux users may have a command to start discord)
# start "path/to/your/discord.exe"
# discord-canary "$@"
```

`nucleus`, like OpenAsar, also depends on a CDN to retrieve files from (namely, the config). Our fork is hosted at [Steviegt6/nucleus-cdn](https://github.com/Steviegt6/nucleus-cdn) ((cdn.nucleus.tomat.dev)[https://cdn.nucleus.tomat.dev]). Depending on what you are developing or testing, you may need to host your own CDN locally and change `./src/appConfig.js` appropriately.

## Configuration

You may configure `nucleus` by clicking the text that displays "`nucleus`" followed by a six-letter commit SHA in the bottom of your settings sidebar, which will open the config window.
