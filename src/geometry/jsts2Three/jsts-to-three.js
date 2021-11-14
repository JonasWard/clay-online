import {GeometryFactory} from "jsts/org/locationtech/jts/geom";
import {Path, Vector3} from "three";
import {Polyline} from "../three/three-poly-line";
import {testPolygon} from "../importing-jsts";

const llr = new GeometryFactory().createLinearRing();

function getLinearRings(polygon) {
    let linearRings = [];
    linearRings.push(polygon.getExteriorRing());

    // console.log(polygon);

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

function linearRingToPolyline(linearRing) {
    let vectors = [];

    for (const coordinate of linearRing.getCoordinates()) {
        vectors.push(vectorFromCoordinate(coordinate) );
    }

    vectors.pop();

    return new Polyline(vectors);
}

export function polygonToPolylines(polygon){
    let polylines = [];

    if (polygon.constructor.name === "MultiPolygon") {
        for (const pg of polygon._geometries) {
            for (const pl of polygonToPolylines(pg)){
                polylines.push(pl);
            }
        }

        return polylines;
    }

    const lrs = getLinearRings(polygon);

    for (const lr of lrs){
        polylines.push(linearRingToPolyline(lr));
    }

    return polylines;
}
