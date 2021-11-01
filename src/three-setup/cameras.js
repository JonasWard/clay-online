import {OrthographicCamera, PerspectiveCamera} from 'three'

export function getOrthographicCamera(mount) {
    const {clientWidth, clientHeight} = mount;

    const camera = new OrthographicCamera(
        clientWidth / -16,
        clientWidth /16,
        clientHeight / 16,
        clientHeight / -16,
        -1,
        100
    );

    camera.enableRotate = false;
    camera.position.z = 20;

    return camera;
}

export function getPerspectiveCamera(mount) {
    const {clientWidth, clientHeight} = mount;

    const camera = new PerspectiveCamera(
        45,
        clientWidth / clientHeight
    );

    camera.position.z = 20;
    return camera;
}
