import {PCFShadowMap, WebGL1Renderer, WebGLRenderer} from 'three'
import {createHUD} from "../geometry/three/brick-to-scene";

export function getPlanarRenderer() {
    const renderer = new WebGLRenderer({antialias: true});

    renderer.setClearColor('#cdd0d6');
    renderer.setPixelRatio(window.devicePixelRatio);

    return renderer;
}

export function getPerspectiveRenderer() {
    const renderer = new WebGL1Renderer({antialias: true, alpha: true})

    // renderer.setClearColor('#ffff99');
    renderer.setPixelRatio(window.devicePixelRatio);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFShadowMap;

    return renderer;
}

export function resize(mount, renderer, camera) {
    if (!mount || !renderer || !camera)
        return

    const {clientWidth, clientHeight} = mount.current

    if (camera) {
        camera.aspect = clientWidth / clientHeight;
        camera.updateProjectionMatrix();
    }

    renderer.setSize(clientWidth, clientHeight)
}
