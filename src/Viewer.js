import React, {useEffect, useRef} from 'react';
import Measure from 'react-measure';
import {cleanUp, setUp} from "./three-setup/set-up";
import {resize} from "./three-setup/renderers";
import {GUI} from 'three/examples/jsm/libs/dat.gui.module';
import {createGUI} from "./three-setup/gui-setup";

import './Viewer.scss';

function Viewer() {
    const mount = useRef(null);
    const rendererRef = useRef(null);
    const cameraRef = useRef(null);

    let gui;


    useEffect(() => {
        console.log(mount);

        const {scene, camera, renderer, frameId} = setUp(mount);

        rendererRef.current = renderer;
        cameraRef.current = camera;

        gui = createGUI(scene);

        return () => {
            cleanUp(mount, renderer, frameId);
        }
    }, [rendererRef, cameraRef]);

    return (
        <Measure
            bounds
            onResize={() => {
                resize(mount, rendererRef.current, cameraRef.current)
            }}>
            {({measureRef}) => (
                <div className={'simple-3d'} ref={measureRef}>
                    <div className={'three-canvas'} ref={mount} tabIndex={0}/>
                </div>
            )}
        </Measure>
    )
}

export default Viewer;
