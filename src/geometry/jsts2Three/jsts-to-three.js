import {GeometryFactory} from "jsts/org/locationtech/jts/geom";
import {Path, Vector3} from "three";
import {Polyline} from "./polyline";
import {testPolygon} from "../importing-jsts";

const llr = new GeometryFactory().createLinearRing();

function getLinearRings(polygon) {
    let linearRings = [];
    linearRings.push(polygon.getExteriorRing());

    console.log(polygon);

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
        coordinate.y,
        locZ
    );
}

function linearRingToPolyline(linearRing) {
    let vectors = [];

    for (const coordinate of linearRing.getCoordinates()) {
        vectors.push(vectorFromCoordinate(coordinate) );
    }

    vectors.pop();

    return new Polyline(vectors);
}

export function polygonToPolylines(polygon){
    const lrs = getLinearRings(polygon);

    let polylines = [];
    for (const lr of lrs){
        polylines.push(linearRingToPolyline(lr));
    }

    console.log(polylines);

    return polylines;
}
