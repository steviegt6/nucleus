# nucleus FAQ

### What is an ASAR?

An ASAR—which stands for "**A**tom **S**hell **Ar**chive"" ("Atom Shell" being Electron's previous name)—is the archive format used by [Electron](https://electronjs.org) to package Electron applications such as Discord.

Discord's `app.asar` includes functionalities, such as:

- update checking and installation;
- bootstrapping;
- crash and error handling/reporting;
- and the loading start-up splash screen.

_nucleus_ is an open-source rewrite and alternative to Discord's `app.asar` which hopes to bring the various features outlined in the README.

### Does nucleus support X mod?

Under most circumstances, yes. nucleus is known to support client mods such as BetterDiscord, Powercord, Replugged, GooseMod, Cumcord, and more. Conflicts with client mods are unlikely. If one does arise, it is likely an issue with the client mod requiring a modification to be made to Discord's vanilla `app.asar` to work.

### Why doesn't this speed up Discord for me?

If nucleus was not noticeably faster (in terms of start-up time), you likely already possess a powerful-enough computer. nucleus speeds up start-up times most noticeably on lower-end hardware—especially those without an SSD.

Even with a beefier you computer, you may still notice a subtle speed improvement (~1.2x).

### How does nucleus make the client "snappier" (more performant)?

nucleus optimizes Chromium (the web engine Discord uses) to help increase performance—mostly rendering—which appears to make most (~90%) people's clients looking noticeably snappier. This effect is best observed with things such as scrolling quickly, switching channels, and with various animations like tooltips for servers in the sidebar and settings opening/closing.

### What changes allow for these performance improvements?

The bulk of changes related to performance improvements are a side effect of rewriting the bootstrapper and were not done intentionally, thus making it technically "accidental" regardless of how beneficial it is.

### How is the archive so small?

Compared to Discord's original bootstrapper, nucleus is <2% of the size. This is a result of rewriting the bootstrapper, as all NPM dependencies were replaced with our own custom, lightweight code in the process.

### What is the "Quickstart" option??

Quickstart opts to skip past some default functionalities of the bootstrapper such as the start-up splash screen and update checking in favor of speed. It is currently experimental and not recommended for general-purpose use unless you understand what you are doing.

### Is this 100% original \[code\]?

No, and depends on your definition. if by "original," you mean "is all of this rewritten?", then yes: the vast majority of the project (~90%) is a clean-room reimplementation or otherwise modified. If you mean original by core design—no, this project must still conform with Discord's API.

### Does this break Discord's Terms of Service?

Yes, this is a modification to their client and thus falls under their terms. nucleus, its developers, and its contributors are not to be held liable for any damages caused by the use of this project.

_Though, if it's any consolation, there have been no known cases of Discord taking action against users for simply using client mods, especially none that are known to be a result of OpenAsar or nucleus._

### Can I use this code in my own project?

Yes—nucleus is a fork too! Just make sure to properly [respect the license](LICENSE) and clearly credit nucleus and OpenAsar.

### Does nucleus update itself?

Yes... with a catch. On Windows, it works out of the box; however, on macOS or Linux, you'll need to change the permissions for the entire resources folder for it to work.
