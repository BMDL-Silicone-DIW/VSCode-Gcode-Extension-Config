"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dictionary = void 0;
const vscode_1 = require("vscode");
class Dictionary {
    constructor(context) {
        var _a;
        this.definitionsFromSettings = {};
        this.definitionsFromComments = {};
        this.definitions = {};
        const fileText = (_a = vscode_1.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document.getText();
        const removeLeadingZerosFromKeys = (obj) => {
            Object.keys(obj).forEach(key => {
                let cleanKey = key;
                const prefix = key.replace(/\d+/g, '');
                if ((key.length > prefix.length) && key.startsWith(prefix)) {
                    const suffix = key.substr(prefix.length);
                    cleanKey = prefix + parseInt(suffix);
                    if (cleanKey.length < key.length && obj[cleanKey] == undefined) {
                        obj[cleanKey] = obj[key];
                        delete obj[key];
                    }
                }
            });
            return obj;
        };
        const refreshDefinitionsFromComments = (fileText) => {
            function parse(comments) {
                comments = comments.map(comment => '"' + comment.substr(1, comment.length - 2) + '"');
                comments = comments.map(comment => comment.replace(/\s*[:=]\s*/, '": "'));
                const jsonString = "{\n" + comments.join(",\n") + "\n}";
                return JSON.parse(jsonString);
            }
            const regex = /\(\s*[A-Z0-9]{2,5}\s*[:=]\s*[a-zA-Z0-9\,\s]+\s*\)/g;
            const matches = fileText.match(regex);
            const obj = (matches == null) ? {} : parse(matches);
            return removeLeadingZerosFromKeys(obj);
        };
        const refreshDefinitionsFromSettings = () => {
            const obj = JSON.parse(JSON.stringify(vscode_1.workspace.getConfiguration('gcode.definitions')));
            return removeLeadingZerosFromKeys(obj);
        };
        const mergeDefinitions = () => Object.assign({}, this.definitionsFromSettings, this.definitionsFromComments);
        const publish = () => {
            this.definitions = mergeDefinitions();
            if (this.panel != undefined) {
                this.panel.webview.html = getWebviewHtml();
            }
        };
        this.definitionsFromComments = (fileText == undefined) ? {} : refreshDefinitionsFromComments(fileText);
        this.definitionsFromSettings = refreshDefinitionsFromSettings();
        publish();
        context.subscriptions.push(vscode_1.window.onDidChangeActiveTextEditor(event => {
            if ((event === null || event === void 0 ? void 0 : event.document.languageId) == 'gcode') {
                this.definitionsFromComments = refreshDefinitionsFromComments(event.document.getText());
                publish();
            }
        }), vscode_1.workspace.onDidSaveTextDocument(document => {
            if (document.languageId == 'gcode') {
                this.definitionsFromComments = refreshDefinitionsFromComments(document.getText());
                publish();
            }
        }), vscode_1.workspace.onDidChangeConfiguration(event => {
            if (event.affectsConfiguration('gcode.definitions')) {
                this.definitionsFromSettings = refreshDefinitionsFromSettings();
                publish();
            }
        }), vscode_1.commands.registerCommand('gcode.showDictionary', () => {
            if (this.panel != undefined) {
                this.panel.reveal(vscode_1.ViewColumn.Beside);
            }
            else {
                this.panel = vscode_1.window.createWebviewPanel('gcodeDictionary', 'G-Code Dictionary', vscode_1.ViewColumn.Beside, {});
                this.panel.onDidDispose(() => { this.panel = undefined; }, undefined, context.subscriptions);
            }
            this.panel.webview.html = getWebviewHtml();
        }));
        const getWebviewHtml = () => {
            const template = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>G-Code Dictionary</title></head><body></body></html>';
            const keys = Object.keys(this.definitions).sort(function (a, b) {
                function getWord(str) {
                    const prefix = (str.match(/^[A-Z]/g))[0];
                    return {
                        address: prefix,
                        value: parseInt(str.replace(prefix, ''))
                    };
                }
                const A = getWord(a);
                const B = getWord(b);
                if (A.address > B.address) {
                    return 1;
                }
                else if (A.address < B.address) {
                    return -1;
                }
                else {
                    return A.value - B.value;
                }
            });
            const data = keys.map(key => ({ word: key, meaning: this.definitions[key] }));
            const html = (data.map(item => `<p><strong>${item.word}</strong> - ${item.meaning}</p>`)).join('\n');
            return template.replace('<body></body>', `<body>${html}</body>`);
        };
    }
    lookup(code) {
        const removeLeadingZeros = (code) => code.substring(0, 1) + parseInt(code.substring(1)).toString();
        return this.definitions[removeLeadingZeros(code)];
    }
}
exports.Dictionary = Dictionary;
