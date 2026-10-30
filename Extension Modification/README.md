# [<img src="https://user-images.githubusercontent.com/29161635/93551441-de870a00-f93b-11ea-82a3-48c360d2f732.png" alt="G-Code extension icon" height="15em"> G-Code](https://github.com/scottmwyant/vscode-gcode) Extension Modification

This directory tracks the source files of the [<img src="https://user-images.githubusercontent.com/29161635/93551441-de870a00-f93b-11ea-82a3-48c360d2f732.png" alt="G-Code extension icon" height="15em"> G-Code](https://github.com/scottmwyant/vscode-gcode) extension that is to be modified for better experience or customization for our own purposes.

## List of Modifications

The following is a list of modifications we have finished :white_check_mark:, are working on :hourglass: or plan to work on :calendar:.

- :hourglass: Take only content before the first `\n\n` into the entry line, and put remaining content in the foldable part below each entry and above the next one.

## Deployment Script

:hourglass: We are planning to write a deployment script that, by default, automatically deploys the customized files into corresponding locations in the extension folders (*overwrite the counterparts* after **renaming the previous victim into a time-stamped backup**).

## Directory Specification

This directory aims to **keep the same structure** as the official extension folder, typically `~\.vscode\extensions\vscode-gcode.gcode-*`, where `*` denotes the version number. The folder tree, obtained via the `tree . /f` command for Windows Powershell or its counterparts in other shells after navigating to the aforementioned folder, is typically

```shell
~\.VSCODE\EXTENSIONS\VSCODE-GCODE.GCODE-0.2.1
│  .vsixmanifest
│  CHANGELOG.md
│  LICENSE.txt
│  package.json
│  README.md
│
├─assets
│      gcode.tmLanguage.json
│      icon.png
│      language-configuration.json
│
└─out
    │  extension.js
    │
    ├─commands
    │      index.js
    │      lineNumbers.js
    │      toggleComment.js
    │      utilities.js
    │
    ├─dictionaryService
    │      dictionary.js   # main engine for dictionary rendering
    │      index.js
    │
    ├─grammar
    │      gcode.tmLanguage.json
    │      getJson.js
    │      index.js
    │      scopes.json
    │
    └─hoverProvider
            gcodeHoverProvider.js
            index.js
```

> :pushpin: For non-intuitive files, feel free to write comments on the right of each entry above.
