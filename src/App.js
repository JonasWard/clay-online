// ... App.js
import React, {Component} from "react";
import ReactDOM from "react-dom";
import * as THREE from "three";
import {TestGeo} from "./geometry/test-geo";
import {setUp} from "./three-setup/set-up";

import './App.css';
import Viewer from "./Viewer";

function App() {
    return (
        <div className={'app'}>
            <div className={'container'}>
                <Viewer/>
            </div>
            <a id="link" rel="ar" href="" download="asset.usdz">
                <img id="button" width="100" src="files/arkit.png"></img>
            </a>
        </div>
    );
}

export default App;
