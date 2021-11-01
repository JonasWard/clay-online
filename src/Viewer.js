import React, {useEffect, useRef} from 'react';
import Measure from 'react-measure';
import {cleanUp, setUp} from "./three-setup/set-up";
import {resize} from "./three-setup/renderers";

import './Viewer.scss';

function Viewer() {
    const mount = useRef(null);
    const rendererRef = useRef(null);
    const cameraRef = useRef(null);

    useEffect(() => {
        console.log(mount);

        const {scene, camera, renderer, frameId} = setUp(mount);

        rendererRef.current = renderer;
        cameraRef.current = camera;

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
