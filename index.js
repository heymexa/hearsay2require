#!/usr/bin/env node

'use strict';

const yaml = require('js-yaml');
const fs = require('fs');
const requireJsConfig = require('./requirejs.config');

const hearsayConfigFile = process.argv[2];
let requireJsTemplate = 'requirejs.config(%config%);';

const getRequireJs = (hearsay) => {
    const options = hearsay.hearsay_require_js.optimizer.options;
    for (let option in options) {
        if (options.hasOwnProperty(option)) {
            requireJsConfig[option] = options[option];
        }
    }
    return requireJsConfig;
};

const saveRequireJsConfig = (hearsay, commonJs) => {
    const fileContent = requireJsTemplate.replace('%config%', JSON.stringify(commonJs));
    fs.writeFile(hearsay.hearsay_require_js.paths.common_js_path + '.js', fileContent, (err) => {
        if (err) throw err;
    });
};

const convert = () => {
    try {
        const hearsay = yaml.safeLoad(fs.readFileSync(hearsayConfigFile, 'utf8'));
        const requireJs = getRequireJs(hearsay);
        saveRequireJsConfig(hearsay, requireJs);
    } catch (e) {
        console.log(e);
    }
};

convert();