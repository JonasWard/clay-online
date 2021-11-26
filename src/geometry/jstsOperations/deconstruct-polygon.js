import {deconstructPolygon} from "../jsts2Three/jsts-to-three";
import {Coordinate, GeometryFactory} from "jsts/org/locationtech/jts/geom";
import BufferOp from "jsts/org/locationtech/jts/operation/buffer/BufferOp";

import "jsts/org/locationtech/jts/monkey.js";
import {geometryArray} from "../three/brick-to-scene";
import {LineMerger} from "jsts/org/locationtech/jts/operation/linemerge";

const geoFactory = new GeometryFactory();

function twistLineStringAroundPoint(lineString, coordinate = null, radius) {
    const circle = creatCircle(coordinate.x, coordinate.y, 3.);

    console.log("twisting LineString");
    console.log(lineString);
    let mls = lineString.difference(circle);

    console.log(mls);
    let lrs = joinLineStrings(mls);

    return lrs;
}

function createPoint(x, y){
    const coord = new Coordinate(x, y);
    return geoFactory.createPoint(coord);
}

function createBuffer(geom, radius, segments = 32) {
    return BufferOp.bufferOp(geom, radius, segments);
}

function creatCircle(x, y, radius) {
    const point = createPoint(x, y);

    return createBuffer(point, radius, 100);
}

function reverseAJoinB(linestringA, linestringB) {
    let coords = linestringB.getCoordinates();

    coords = coords.concat(linestringA.reverse().getCoordinates());
    coords.push(coords[0]);

    return geoFactory.createLineString(coords);
}

function getEnvelopes(lrA, lrB) {
    // console.log(lrA.getEnvelopeInternal());

    return {
        bboxA: lrA.getEnvelopeInternal(),
        bboxB: lrB.getEnvelopeInternal()
    }
}

function reverseSmaller(lrA, lrB) {
    const {bboxA, bboxB} = getEnvelopes(lrA, lrB);

    if (bboxA.getArea() < bboxB.getArea()) {
        return reverseAJoinB(lrA, lrB);
    } else {
        return reverseAJoinB(lrB, lrA);
    }
}

function reverseLarger(lrA, lrB) {
    const {bboxA, bboxB} = getEnvelopes(lrA, lrB);

    if (bboxA.getArea() > bboxB.getArea()) {
        return reverseAJoinB(lrA, lrB);
    } else {
        return reverseAJoinB(lrB, lrA);
    }
}

function reverseLeft(lrA, lrB) {
    const {bboxA, bboxB} = getEnvelopes(lrA, lrB);

    if (bboxA.getMaxX() < bboxB.getMinX()) {
        return reverseAJoinB(lrA, lrB);
    } else {
        return reverseAJoinB(lrB, lrA);
    }
}

function reverseRight(lrA, lrB) {
    const {bboxA, bboxB} = getEnvelopes(lrA, lrB);

    if (bboxB.getMaxX() < bboxA.getMinX()) {
        return reverseAJoinB(lrA, lrB);
    } else {
        return reverseAJoinB(lrB, lrA);
    }
}

function reverseTop(lrA, lrB) {
    const {bboxA, bboxB} = getEnvelopes(lrA, lrB);

    if (bboxA.getMaxY() < bboxB.getMinY()) {
        return reverseAJoinB(lrA, lrB);
    } else {
        return reverseAJoinB(lrB, lrA);
    }
}

function reverseBottom(lrA, lrB) {
    const {bboxA, bboxB} = getEnvelopes(lrA, lrB);

    if (bboxB.getMaxY() < bboxA.getMinY()) {
        return reverseAJoinB(lrA, lrB);
    } else {
        return reverseAJoinB(lrB, lrA);
    }
}

function deconstructMultiLineString(mls) {
    let linearRings = [];
    for (let i = 0; i < mls.getNumGeometries(); i++) {
        linearRings.push(mls.getGeometryN(i));
    }

    return linearRings;
}

function mergeTouchingLineStrings(lrA, lrB) {
    // console.log(lrA.getNumPoints());
    // console.log(lrB.getNumPoints());

    let coords = lrA.getCoordinates();
    coords.pop();
    coords = coords.concat(lrB.getCoordinates());

    // console.log(coords.length);

    return geoFactory.createLineString(coords);
}

function joinLineStrings(mls) {
    const lrs = deconstructMultiLineString(mls);

    let hasBeenJoined = [];
    let joinedLrs = [];

    for (const lr of lrs) {
        if (!hasBeenJoined.includes(lr)){
            for (const locLr of lrs) {
                if ( (lr !== locLr) & (!hasBeenJoined.includes(locLr) ) ) {
                    const endPoint = lr.getEndPoint().getCoordinate();
                    const startPoint = locLr.getStartPoint().getCoordinate();

                    if (endPoint.distance(startPoint) < .001) {
                        joinedLrs.push(mergeTouchingLineStrings(lr, locLr));
                        hasBeenJoined.push(locLr);
                        hasBeenJoined.push(lr);
                    }
                }
            }
        }
    }

    for (const lr of lrs) {
        if (!hasBeenJoined.includes(lr)) {
            joinedLrs.push(lr);
        }
    }

    return joinedLrs;
}

const switchingFunctionMap = {
    top: reverseTop,
    bottom: reverseBottom,
    left: reverseLeft,
    right: reverseRight,
    small: reverseSmaller,
    large: reverseLarger
}

export function twistIntersect(polygon, coordDirections = [], p = null) {
    const linearRings = deconstructPolygon(polygon);

    const radius = (p.productionWidth * .5) * 1.415;
    console.log(radius);

    if (linearRings.length === 1) {
        let activeLR = linearRings[0];
        for (const coordDirection of coordDirections) {
            const lrs = twistLineStringAroundPoint(
                activeLR,
                coordDirection.coordinate,
                radius
            );

            if (lrs.length === 2) {
                console.log("can apply coordinate difference");
                const lrA = lrs[0];
                const lrB = lrs[1];

                activeLR = switchingFunctionMap[coordDirection.direction](lrA, lrB);

            } else {
                console.log("resulting lineString count is " + lrs.length);
                return lrs;
            }
        }

        return [activeLR];

    } else {
        console.log("this slice contains more than one more line string");
        return null;
    }
}
