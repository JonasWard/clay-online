import {Scene} from 'three';
import {getPerspectiveRenderer, resize} from "./renderers";
import {getOrbitControls} from "./orbit-controls";
import {getPerspectiveCamera} from "./cameras";
import {start, stop} from "./render-loops";
import {displayPointTest} from "../geometry/jstsOperations/importing-jsts";
import {addBrick, addLighting} from "../geometry/three/brick-to-scene";

export let scene;
export let renderer;

export function setUp(mount) {
    scene = new Scene();

    const light = addLighting();
    scene.add(light);

    addBrick();

    displayPointTest();

    renderer = getPerspectiveRenderer();
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
