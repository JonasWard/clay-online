import {deconstructPolygon} from "../jsts2Three/jsts-to-three";
import {Coordinate, GeometryFactory} from "jsts/org/locationtech/jts/geom";
import BufferOp from "jsts/org/locationtech/jts/operation/buffer/BufferOp";

import "jsts/org/locationtech/jts/monkey.js";
import {geometryArray} from "../three/brick-to-scene";
import {LineMerger} from "jsts/org/locationtech/jts/operation/linemerge";

const geoFactory = new GeometryFactory();

function splitLineStringWithPoint(lineString, coordinate = null, radius) {
    const circle = creatCircle(coordinate.x, coordinate.y, 3.);

    let mls = lineString.difference(circle);

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
    return {
        bboxA: lrA.getEnvelopeInternal(),
        bboxB: lrB.getEnvelopeInternal()
    }
}

const switchingFunctionMap = {
    top: checkTop,
    bottom: checkBottom,
    left: checkLeft,
    right: checkRight,
    small: checkSmaller,
    large: checkLarger
}

function sameOrder(lrA, lrB) {
    return {lrA: lrA, lrB: lrB};
}

function inverseOrder(lrA, lrB) {
    return {lrA: lrB, lrB: lrA};
}

function checkFunction(functionName, lrA, lrB) {
    if (switchingFunctionMap[functionName](lrA, lrB)) {
        return sameOrder(lrA, lrB);
    } else {
        return inverseOrder(lrA, lrB);
    }
}

function sortGeometries(functionName, lrs){
    function sortForThis(lrA, lrB) {
        if (switchingFunctionMap[functionName](lrA, lrB)) {
            return 1;
        } else {
            return -1;
        }
    }
    lrs.sort(sortForThis);
    return lrs;
}

function checkSmaller(lrA, lrB) {
    const {bboxA, bboxB} = getEnvelopes(lrA, lrB);
    return bboxA.getArea() < bboxB.getArea();
}

function checkLarger(lrA, lrB) {
    const {bboxA, bboxB} = getEnvelopes(lrA, lrB);
    return bboxA.getArea() > bboxB.getArea();
}

function checkLeft(lrA, lrB) {
    const {bboxA, bboxB} = getEnvelopes(lrA, lrB);
    return bboxA.getMaxX() < bboxB.getMinX();
}

function checkRight(lrA, lrB) {
    const {bboxA, bboxB} = getEnvelopes(lrA, lrB);
    return bboxB.getMaxX() < bboxA.getMinX();
}

function checkTop(lrA, lrB) {
    const {bboxA, bboxB} = getEnvelopes(lrA, lrB);
    return bboxA.getMaxY() < bboxB.getMinY();
}

function checkBottom(lrA, lrB) {
    const {bboxA, bboxB} = getEnvelopes(lrA, lrB);
    return bboxB.getMaxY() < bboxA.getMinY();
}

function deconstructMultiLineString(mls) {
    let linearRings = [];
    for (let i = 0; i < mls.getNumGeometries(); i++) {
        linearRings.push(mls.getGeometryN(i));
    }

    return linearRings;
}

function mergeTouchingLineStrings(lrA, lrB) {
    let coords = lrA.getCoordinates();
    coords.pop();
    coords = coords.concat(lrB.getCoordinates());

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

function concatenateLineStrings(lrs){
    let coords = [];

    for (const lr of lrs){
        coords = coords.concat(lr.getCoordinates());
    }

    coords.push(coords[0]);
    return geoFactory.createLinearRing(coords);
}

function hardcodedTweaking(polygon, coords, radius){
    let resultLrs = [];
    let intermediateLrs;
    let activeLr;

    intermediateLrs = splitLineStringWithPoint(polygon, coords.a.v0, radius)
    if (intermediateLrs.length === 2) {
        let lr0 = intermediateLrs[0];
        let lr1 = intermediateLrs[1];

        let {lrA, lrB} = checkFunction("large", lr0, lr1);

        resultLrs.push(lrA);

        lrB = lrB.reverse();
        activeLr = lrB;
    }

    intermediateLrs = splitLineStringWithPoint(activeLr, coords.a.v1, radius)
    if (intermediateLrs.length === 3) {
        intermediateLrs = sortGeometries("small", intermediateLrs);
        let lr0 = intermediateLrs[1];
        let lr1 = intermediateLrs[2];

        let {lrA, lrB} = checkFunction("bottom", lr0, lr1);

        resultLrs.push(lrB);
        lrA = lrA.reverse()
        resultLrs.push(lrA);

        activeLr = intermediateLrs[0];
    }

    intermediateLrs = splitLineStringWithPoint(activeLr, coords.a.v2, radius)
    if (intermediateLrs.length === 3) {
        intermediateLrs = sortGeometries("large", intermediateLrs);
        let lr0 = intermediateLrs[0];
        let lr1 = intermediateLrs[1];

        let {lrA, lrB} = checkFunction("bottom", lr0, lr1);
        resultLrs.push(lrA);

        let subIntermediate = splitLineStringWithPoint(lrB, coords.a.v3, radius);
        if (subIntermediate.length === 3) {
            subIntermediate = sortGeometries("bottom", subIntermediate);
            let lr0 = subIntermediate[2];
            let lr1 = subIntermediate[1];

            const output = checkFunction("left", lr0, lr1);

            resultLrs = [
                output.lrB,
                subIntermediate[0].reverse(),
                output.lrA
            ].concat(resultLrs);
        }

        activeLr = intermediateLrs[2].reverse();
    }

    console.log(coords.d);
    let count = 0;

    for (const diamondC of coords.d) {
        intermediateLrs = splitLineStringWithPoint(activeLr,diamondC, radius);

        if (intermediateLrs.length === 3) {
            intermediateLrs = sortGeometries("right", intermediateLrs);

            let lr0 = intermediateLrs[0];
            let lr1 = intermediateLrs[1];

            let locFunctionName;
            if (count % 2 === 0) {
                locFunctionName = "bottom";
            } else {
                locFunctionName = "top";
            }
            let {lrA, lrB} = checkFunction(locFunctionName, lr0, lr1);

            resultLrs = [lrA].concat(resultLrs);
            resultLrs.push(lrB);

            activeLr = intermediateLrs[2].reverse();
        }
        count++;
    }

    intermediateLrs = splitLineStringWithPoint(activeLr, coords.b.v0, radius)
    if (intermediateLrs.length === 3) {
        intermediateLrs = sortGeometries("right", intermediateLrs);

        let lr0 = intermediateLrs[0];
        let lr1 = intermediateLrs[1];

        let {lrA, lrB} = checkFunction("bottom", lr0, lr1);

        resultLrs = [lrA].concat(resultLrs);
        resultLrs.push(lrB);

        activeLr = intermediateLrs[2].reverse();
    }

    intermediateLrs = splitLineStringWithPoint(activeLr, coords.b.v2, radius)
    if (intermediateLrs.length === 3) {
        intermediateLrs = sortGeometries("left", intermediateLrs);
        let lr0 = intermediateLrs[1];
        let lr1 = intermediateLrs[2];

        let localResults = [];

        let {lrA, lrB} = checkFunction("bottom", lr0, lr1);

        let subIntermediate = splitLineStringWithPoint(lrA, coords.b.v1, radius);
        if (subIntermediate.length === 3) {
            subIntermediate = sortGeometries("top", subIntermediate);
            let lr0 = subIntermediate[2];
            let lr1 = subIntermediate[1];

            const output = checkFunction("left", lr0, lr1);

            localResults = [
                output.lrA,
                subIntermediate[0].reverse(),
                output.lrB
            ];
        }

        localResults.push(intermediateLrs[0].reverse());

        subIntermediate = splitLineStringWithPoint(lrB, coords.b.v3, radius);
        if (subIntermediate.length === 3) {
            subIntermediate = sortGeometries("bottom", subIntermediate);
            let lr0 = subIntermediate[2];
            let lr1 = subIntermediate[1];

            const output = checkFunction("right", lr0, lr1);

            localResults = localResults.concat([
                output.lrA,
                subIntermediate[0].reverse(),
                output.lrB
            ]);
        }

        resultLrs = resultLrs.concat(localResults);

    }

    return concatenateLineStrings(resultLrs);
}

export function twistIntersect(polygon, coords = [], p = null) {
    const linearRings = deconstructPolygon(polygon);

    const radius = (p.productionWidth * .5) * 1.415;
    console.log(radius);

    if (linearRings.length === 1) {
        let activeLR = linearRings[0];

        return [hardcodedTweaking(activeLR, coords)];

    } else {
        console.log("this slice contains more than one more line string");
        return null;
    }
}
