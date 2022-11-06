_Forked from [GooseMod/OpenAsar](https://github.com/GooseMod/OpenAsar)._

# nucleus ![Nightly Status](https://github.com/Steviegt6/nucleus/actions/workflows/nightly.yml/badge.svg) [![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://choosealicense.com/licenses/mit/l)

Open-source reimplementation of Discord's Desktop app bootstraper (referred to by many as the `app.asar`).

### Features

nucleus' changes include many features, such as:

- **:rocket: Faster start-up speeds**—~2x faster startup times (up to ~4x with experimental config);
- **:chart_with_upwards_trend: increased performance**—increased speeds can make your client feel snappier (scrolling, switching channels, etc);
- **:paintbrush: start-up splash themeing**—easy theming for your start-up splash which works with most themes for any client mod;
- **:electric_plug: drop-in installation**—replace one file and it's installed, that's it (uninstallation follows the some process);
- **:gear: configurable features**—adds many config options to enhance Discord and nucleus (see the [Configuration](#configuration) section);
- **:feather: lightweight file size**—<1% of Discord's original size (9mb -> ~50kb);
- and **:shield: reduced tracking**—removes Discord's built-in tracking for crashes and errors in the bootstrapper (not app itself).

**Set the [FAQ](FAQ.md) for more details!**

## Obtaining a Copy

### Users

Users should download the latest release binary. See how by following the [installation guide](https://github.com/Steviegt6/nucleus/wiki/Install-Guide).

### Developers

To develop nucleus, all you must do is obtain a copy of the source code by cloning the repository, inject the polyfills, pack the app into a `.asar` file, and replace Discord's existing one. This may be condensed down into several simple commands:

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

## Configuration

You may configure nucleus by clicking the `nucleus` version info in the bottom of your settings sidebar, which will open the config window.
