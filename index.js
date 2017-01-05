#!/usr/bin/env node

'use strict';

const yaml = require('js-yaml');
const fs = require('fs');

const KERNEL_ROOT_DIR = 'app/';
const REQUIRE_JS_TEMPLATE = 'requirejs.config(%config%);';
const hearsayConfigFile = process.argv[2];

const getRequireJs = (hearsay) => {
    return Object.assign({}, hearsay.hearsay_require_js.optimizer.options);
};

const saveRequireJsConfig = (hearsay, commonJs) => {
    const fileContent = REQUIRE_JS_TEMPLATE.replace('%config%', JSON.stringify(commonJs));
    const commonJsPath = hearsay.hearsay_require_js.paths.common_js_path.replace('%kernel.root_dir%/', KERNEL_ROOT_DIR);
    fs.writeFile(commonJsPath + '.js', fileContent, (err) => {
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