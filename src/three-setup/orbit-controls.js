import {MOUSE} from 'three';
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";

export function getOrbitControls(camera, renderer) {
    const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableRotate = true;
    orbitControls.enableKeys = true;
    // orbitControls.minZoom = .5;
    // orbitControls.maxZoom = 8;
    // orbitControls.mouseButtons = {ZOOM: MOUSE.MIDDLE, PAN: MOUSE.RIGHT};

    orbitControls.target.set(0, 0);
    orbitControls.update();

    return orbitControls;
}

