import {Scene} from 'three';
import {getPerspectiveRenderer, resize} from "./renderers";
import {getOrbitControls} from "./orbit-controls";
import {getPerspectiveCamera} from "./cameras";
import {start, stop} from "./render-loops";
import {addTestGeos, testTube} from "../geometry/test-geo";
import {displayPointTest} from "../geometry/importing-jsts";

export function setUp(mount) {
    const scene = new Scene();

    addTestGeos(scene);

    displayPointTest();

    const renderer = getPerspectiveRenderer();
    mount.current.appendChild(renderer.domElement);

    const camera = getPerspectiveCamera(mount.current);
    scene.add(camera);

    const orbitControls = getOrbitControls(camera, renderer);

    resize(mount, renderer, camera);
    const frameId = start(renderer, scene, camera);

    return {
        scene: scene,
        renderer: renderer,
        camera: camera,
        frameId: frameId,
        orbitControls: orbitControls
    };
}

export function cleanUp(mount, renderer, frameId) {
    stop(frameId.frameId);
    mount.current.removeChild(renderer.domElement);
}
