import {
    Mesh,
    TubeGeometry
} from "three";

export function TubeGeo(path, segs, radius, radSegs, closed, material) {
    const geo = new TubeGeometry(path, segs, radius, radSegs, closed);
    return new Mesh(geo, material);
}
