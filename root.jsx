// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

import './entry.js';

import React from 'react';
import ReactDOM from 'react-dom';
import {logError} from 'mattermost-redux/actions/errors';
import PDFJS from 'pdfjs-dist';

// Import our styles
import 'bootstrap-colorpicker/dist/css/bootstrap-colorpicker.css';
import 'sass/styles.scss';
import 'katex/dist/katex.min.css';

import {isDevMode, setCSRFFromCookie} from 'utils/utils';
import store from 'stores/redux_store.jsx';

// using react app component without hot reload
import {App} from 'components/app';

PDFJS.disableWorker = true;

// This is for anything that needs to be done for ALL react components.
// This runs before we start to render anything.
function preRenderSetup(callwhendone) {
    window.onerror = (msg, url, line, column, stack) => {
        if (msg === 'ResizeObserver loop limit exceeded') {
            return;
        }
        var l = {};
        l.level = 'ERROR';
        l.message = 'msg: ' + msg + ' row: ' + line + ' col: ' + column + ' stack: ' + stack + ' url: ' + url;

        const req = new XMLHttpRequest();
        req.open('POST', '/api/v4/logs');
        req.setRequestHeader('Content-Type', 'application/json');
        req.send(JSON.stringify(l));

        if (isDevMode()) {
            store.dispatch(logError({type: 'developer', message: 'DEVELOPER MODE: A JavaScript error has occurred.  Please use the JavaScript console to capture and report the error (row: ' + line + ' col: ' + column + ').'}, true));
        }
    };
    setCSRFFromCookie();
    callwhendone();
}

export const reactApp = App;
export const reactAppNode = <App/>;
export function initMattermost(element) {
    preRenderSetup(() => {
        ReactDOM.render(<App/>, element);
    });
}
export function destroyMattermost(element) {
    ReactDOM.unmountComponentAtNode(element);
}

window.reactApp = App;
window.reactAppNode = App;
window.initMattermost = initMattermost;
window.destroyMattermost = destroyMattermost;
