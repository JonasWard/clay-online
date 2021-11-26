import {GeometryFactory} from "jsts/org/locationtech/jts/geom";
import {Path, Vector3} from "three";
import {Polyline} from "../three/three-poly-line";

const llr = new GeometryFactory().createLinearRing();

function getLinearRings(polygon) {
    let linearRings = [];
    linearRings.push(polygon.getExteriorRing());

    for (let i = 0; i < polygon.getNumInteriorRing(); i++) {
        linearRings.push(polygon.getInteriorRingN(i));
    }

    return linearRings;
}

function vectorFromCoordinate(coordinate) {
    let locZ;

    if (isNaN(coordinate.z)) {
        locZ = 0;
    } else {
        locZ = coordinate.z;
    }

    return new Vector3(
        coordinate.x,
        locZ,
        -coordinate.y
    );
}

export function linearRingToPolyline(linearRing) {
    let vectors = [];

    for (const coordinate of linearRing.getCoordinates()) {
        vectors.push(vectorFromCoordinate(coordinate) );
    }

    vectors.pop();

    return new Polyline(vectors);
}

export function deconstructPolygon(polygon) {
    let linearRings = [];

    if (polygon.constructor.name === "MultiPolygon") {
        for (const pg of polygon._geometries) {
            const llrs = deconstructPolygon(pg);
            linearRings = linearRings.concat(llrs);
        }

        return linearRings;
    }

    const llrs = getLinearRings(polygon);
    linearRings = linearRings.concat(llrs);
    return linearRings;
}

export function polygonToPolyLines(polygon){
    let polyLines = [];

    for (const lr of deconstructPolygon(polygon)) {
        polyLines.push(linearRingToPolyline(lr));
    }

    return polyLines;
}
