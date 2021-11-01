export function start(renderer, scene, camera) {

    const frameId = {frameId: null};

    frameId.frameId = requestAnimationFrame(() => animate(renderer, scene, camera, frameId));

    return frameId;
}

export function stop({frameId}) {
    return cancelAnimationFrame(frameId);
}

function animate(renderer, scene, camera, frameId) {
    renderer.clear('#ddd');
    renderer.render(scene, camera);

    frameId.frameId = requestAnimationFrame(() => animate(renderer, scene, camera, frameId));
}
