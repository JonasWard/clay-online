// ... App.js
import React, {Component} from "react";
import ReactDOM from "react-dom";
import * as THREE from "three";
import {TestGeo} from "./geometry/test-geo";
import {setUp} from "./three-setup/set-up";
import './App.css';
import Viewer from "./Viewer";
import Navbar from "./components/Navbar";
import NavbarItem from "./components/NavbarItem";

import {ReactComponent as Settings} from "./resources/icons/settings.svg";
import {ReactComponent as Circle} from "./resources/icons/circle.svg";
import {ReactComponent as NegCircle} from "./resources/icons/negCircle.svg";
import {ReactComponent as Cone} from "./resources/icons/cone.svg";
import {ReactComponent as Sin} from "./resources/icons/sin.svg";
import DropdownMenu from "./components/DropdownMenu";

function App() {
    return (
        <Navbar>
            <NavbarItem icon={<Circle />}/>
            <NavbarItem icon={<NegCircle />}/>
            <NavbarItem icon={<Cone />}/>
            <NavbarItem icon={<Sin />}/>
            <NavbarItem icon={<Settings />}>
                <DropdownMenu></DropdownMenu>
            </NavbarItem>
        </Navbar>
    );
}

export default App;
