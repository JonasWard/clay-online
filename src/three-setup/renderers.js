import {WebGL1Renderer, WebGLRenderer} from 'three'

export function getPlanarRenderer() {
    const renderer = new WebGLRenderer({antialias: true});

    renderer.setClearColor('#cdd0d6');
    renderer.setPixelRatio(window.devicePixelRatio);

    return renderer;
}

export function getPerspectiveRenderer() {
    const renderer = new WebGL1Renderer({antialias: true, alpha: true})

    renderer.setClearColor('#ffff99');
    renderer.setPixelRatio(window.devicePixelRatio);

    return renderer;
}

export function resize(mount, renderer, camera) {
    if (!mount || !renderer || !camera)
        return

    const {clientWidth, clientHeight} = mount.current

    if (camera) {
        camera.left = clientWidth / -16
        camera.right = clientWidth / 16
        camera.top = clientHeight / 16
        camera.bottom = clientHeight / -16
        camera.updateProjectionMatrix()
    }

    renderer.setSize(clientWidth, clientHeight)
}
