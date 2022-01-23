import React, {useEffect, useState, useRef} from 'react';
import {CSSTransition} from "react-transition-group";

const DropdownMenu = () => {

    const [activeMenu, setActiveMenu] = useState('main');
    const [menuHeight, setMenuHeight] = useState(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        setMenuHeight(dropdownRef.current?.firstChild.offsetHeight)
    }, [])

    function calcHeight(el) {
        const height = el.offsetHeight;
        setMenuHeight(height);
    }

    const DropdownItem = (props) => {
        return (
            <a href="#" className="menu-item" onClick={() => props.goToMenu && setActiveMenu(props.goToMenu)}>
                <span className="icon-button">{props.leftIcon}</span>
                {props.children}
                <span className="icon-button">{props.leftIcon}</span>
            </a>
        )
    }

    return (
        <div className="dropdown" style={{"height": menuHeight }} ref={dropdownRef}>

            <CSSTransition
                in={activeMenu === 'main'}
                timeout={500}
                classNames="menu-primary"
                onEnter={calcHeight}
                unmountOnExit>
                <div className="menu">
                    <DropdownItem>My Profile</DropdownItem>
                    <DropdownItem
                        leftIcon="☸️"
                        rightIcon="❄️"
                        goToMenu="settings">
                        Settings
                    </DropdownItem>
                    <DropdownItem
                        leftIcon="🦧"
                        rightIcon="❄️"
                        goToMenu="animals">
                        Animals
                    </DropdownItem>

                </div>
            </CSSTransition>

            <CSSTransition
                in={activeMenu === 'settings'}
                timeout={500}
                classNames="menu-secondary"
                onEnter={calcHeight}
                unmountOnExit>
                <div className="menu">
                    <DropdownItem goToMenu="main" leftIcon="⬅️">
                        <h2>My Tutorial</h2>
                    </DropdownItem>
                    <DropdownItem leftIcon="⚡️">HTML</DropdownItem>
                    <DropdownItem leftIcon="⚡️">CSS</DropdownItem>
                    <DropdownItem leftIcon="⚡️">JavaScript</DropdownItem>
                    <DropdownItem leftIcon="⚡️">Awesome!</DropdownItem>
                </div>
            </CSSTransition>

            <CSSTransition
                in={activeMenu === 'animals'}
                timeout={500}
                classNames="menu-secondary"
                onEnter={calcHeight}
                unmountOnExit>
                <div className="menu">
                    <DropdownItem goToMenu="main" leftIcon="⬅️">
                        <h2>Animals</h2>
                    </DropdownItem>
                    <DropdownItem leftIcon="🦘">Kangaroo</DropdownItem>
                    <DropdownItem leftIcon="🐸">Frog</DropdownItem>
                    <DropdownItem leftIcon="🦋">Horse?</DropdownItem>
                    <DropdownItem leftIcon="🦔">Hedgehog</DropdownItem>
                </div>
            </CSSTransition>
        </div>
    )
}

export default DropdownMenu;
