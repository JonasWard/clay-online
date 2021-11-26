// defining base parameters
// all lengths are in mm
// base height, width

import {ClayPatternCurve} from "./clay-pattern-curve";
import {Polyline} from "../three/three-poly-line";
import {ClayPoint} from "./clay-point";
import {polylineToPolygon} from "../jsts2Three/three-to-jsts";
import {createBuffer, geometriesDifference, geometriesIntersection, geometryUnion} from "../jstsOperations/importing-jsts";
import {deconstructPolygon, polygonToPolyLines} from "../jsts2Three/jsts-to-three";
import {Vector2, Vector3} from "three";
import {twistIntersect} from "../jstsOperations/deconstruct-polygon";

function pinRadiusAtHeight(p, height) {
    return p.pinDiameterDelta * height + p.pinDiameter0;
}

function arcClayPt(i, startPhase, angleDelta, radius, basePoint, vVal = 0.) {
    const baseAngle = angleDelta * i;
    const angle = startPhase + baseAngle;

    const x0 = Math.cos(angle);
    const y0 = Math.sin(angle);

    const x = radius * x0;
    const y = radius * y0;

    const clayPoint = new ClayPoint(
        new Vector3(basePoint.x + x, basePoint.y + y, basePoint.z),
        new Vector3(x0, y0, 0)
    );

    clayPoint.uvValue = new Vector2(vVal + baseAngle * radius, basePoint.z);

    return clayPoint
}

function arcDivisions(radius, goalLength, arcAngle, startPhase, basePoint, clayPoints, vVal = 0.) {
    const count = Math.ceil(arcAngle * radius / goalLength);
    const angleDelta = arcAngle / count;

    for (let i = 0; i < count; i++) {
        const clayPoint = arcClayPt(i, startPhase, angleDelta, radius, basePoint, vVal);
        clayPoints.push(clayPoint);
    }

    return arcAngle * radius + vVal;
}

function lineDivisions(v0, v1, goalLength, clayPoints, vVal = 0.) {
    const length = v0.distanceTo(v1);
    const count = Math.ceil( length / goalLength);

    const delta = new Vector3().addScaledVector(
        new Vector3().subVectors(v1, v0),
        1. / count
    );

    const deltaLength = delta.length();

    const normal = new Vector3(delta.y / deltaLength, -delta.x / deltaLength);

    for (let i = 0; i < count; i++) {
        const v = new Vector3().addVectors(
            v0,
            new Vector3().addScaledVector(delta, i)
        );

        const clayPoint = new ClayPoint(v, normal);
        clayPoint.uvValue = new Vector2(vVal + i * deltaLength, v0.z);
        clayPoints.push(clayPoint);
    }

    return length + vVal;
}

export function outerProfile(p, height = 0.) {
    const v0 = new Vector3(-(p.baseLength - p.baseWidth) * .5, 0.0, height);
    const v1 = new Vector3((p.baseLength - p.baseWidth) * .5, 0.0, height);

    let clayPoints = [];

    let vVal = 0.;

    vVal = arcDivisions(p.baseWidth * .5, p.precision, .5 * Math.PI, Math.PI, v0, clayPoints, vVal);

    const p0 = new Vector3(-(p.baseLength - p.baseWidth) * .5, -p.baseWidth * .5, height);
    const p1 = new Vector3((p.baseLength - p.baseWidth) * .5, -p.baseWidth * .5, height);

    vVal = lineDivisions(p0, p1, p.precision, clayPoints, vVal);

    vVal = arcDivisions(p.baseWidth * .5, p.precision, Math.PI, -.5 *Math.PI, v1, clayPoints, vVal);

    const p2 = new Vector3((p.baseLength - p.baseWidth) * .5, p.baseWidth * .5, height);
    const p3 = new Vector3(-(p.baseLength - p.baseWidth) * .5, p.baseWidth * .5, height);

    vVal = lineDivisions(p2, p3, p.precision, clayPoints, vVal);

    arcDivisions(p.baseWidth * .5, p.precision, .5 * Math.PI, .5 * Math.PI, v0, clayPoints, vVal);

    const clayPolyline = new ClayPatternCurve(clayPoints);

    return clayPolyline;
}

function simpleLineDivison(v0, v1, divisions, withEnds = false) {
    const delta = new Vector3().addScaledVector(
        new Vector3().subVectors(v1, v0),
        1. / divisions
    );

    let vs = [];

    let start = 0;
    let end = divisions + 1;

    if (!withEnds) {
        start = 1;
        end = divisions;
    }

    for (let i = start; i < end; i++) {
        const v = new Vector3().addVectors(
            v0,
            new Vector3().addScaledVector(delta, i)
        );

        vs.push(v);
    }

    return vs;
}

function simpleArcDivision(baseV, radius, arcAngle = Math.PI, startPhase = 0., division = 100) {
    const delta = arcAngle / division;

    let vs = [];

    for (let i = 0; i < division; i++) {
        const angle = startPhase + i * delta;

        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);

        vs.push(new Vector3(baseV.x + x, baseV.y + y, 0));
    }

    return new Polyline(vs);
}

function diamondPolyline(p, bPoint) {
    return new Polyline([
        new Vector3(bPoint.x + p.diamondWidth * .5, bPoint.y, 0),
        new Vector3(bPoint.x, bPoint.y + p.diamondHeight * .5, 0),
        new Vector3(bPoint.x - p.diamondWidth * .5, bPoint.y, 0),
        new Vector3(bPoint.x, bPoint.y - p.diamondHeight * .5, 0)
    ]);
}

function rectangle(bPoint, width, height) {
    return new Polyline([
        new Vector3(bPoint.x + width * .5, bPoint.y + .5 * height, 0),
        new Vector3(bPoint.x - width * .5, bPoint.y + .5 * height, 0),
        new Vector3(bPoint.x - width * .5, bPoint.y - .5 *  height, 0),
        new Vector3(bPoint.x + width * .5, bPoint.y - .5 *  height, 0)
    ]);
}

export function innerProfileGeom(v0, v1, p, height = 0.) {

    const diamondVs = simpleLineDivison(v0, v1, p.diamondCount + 1, false);

    let pls = [];

    for (const diamondV of diamondVs) {
        const diamond = diamondPolyline(p, diamondV);
        const diamondRect = rectangle(diamondV, p.productionWidth, p.baseWidth * p.lengthBufferMultiplier);

        pls.push(diamond);
        pls.push(diamondRect);
    }

    const pinDiameter = pinRadiusAtHeight(p, height);

    pls.push(simpleArcDivision(v0, pinDiameter * .5, 2. * Math.PI, 0., p.pinDivisions));
    pls.push(simpleArcDivision(v1, pinDiameter * .5, 2. * Math.PI, 0., p.pinDivisions));
    pls.push(rectangle(v0, p.productionWidth, p.baseWidth * p.lengthBufferMultiplier));
    pls.push(rectangle(v1, p.productionWidth, p.baseWidth * p.lengthBufferMultiplier));
    pls.push(rectangle(new Vector3(0, 0, 0),p.baseLength + p.baseWidth * (p.lengthBufferMultiplier - 1.), p.productionWidth));

    let polygons = [];
    for (const pl of pls){
        polygons.push(polylineToPolygon(pl));
    }

    const geom = geometryUnion(polygons);

    return geom;
}

export function innerProfile(v0, v1, p, height = 0.) {
    const geom = innerProfileGeom(v0, v1, p, height);

    const polylines = polygonToPolyLines(geom);

    for (const pl of polylines) {
        pl.moveToHeight(height);
    }

    return polylines;
}

export function aSlice(v0, v1, p, height = 0.) {
    const outerClayCurve = outerProfile(p, height);

    outerClayCurve.applyPattern(
        p.pattern.patternFunction,
        p.pattern.patternParameters,
        p.easingParameters
    );

    const outerGeom = outerClayCurve.toPolygon();

    const bufferedOuterGeom = createBuffer(outerGeom, -p.productionWidth, 1);

    const recL = (p.baseLength + p.baseWidth * (p.lengthBufferMultiplier - 1.)) * .5;

    const leftRec = rectangle(
        new Vector3(-recL * .5, 0, 0),
        recL,
        p.productionWidth
    );

    const leftRecPg = polylineToPolygon(leftRec);
    const unionOuterGeom = geometryUnion([bufferedOuterGeom, leftRecPg])

    const innerGeom = innerProfileGeom(v0, v1, p, height);

    const geom = geometriesIntersection(unionOuterGeom, innerGeom);

    const path = geometriesDifference(outerGeom, geom)

    twistIntersect(path, null, p);
    const polyLines = polygonToPolyLines(path);

    return polyLines;
}

function aPinOnlySlice(v0, v1, p, height) {
    let pls = [];

    const pinDiameter = pinRadiusAtHeight(p, height);

    const arcA = simpleArcDivision(v0, pinDiameter * .5, 2. * Math.PI, 0., p.pinDivisions);
    const arcB = simpleArcDivision(v1, pinDiameter * .5, 2. * Math.PI, 0., p.pinDivisions);

    arcA.cadFlip();
    arcB.cadFlip();

    pls.push(arcA);
    pls.push(arcB);

    return pls;
}

export function constructBrick(p) {
    const v0 = new Vector3(-p.pinSpacing * .5, 0.0);
    const v1 = new Vector3(p.pinSpacing * .5, 0.0);

    p.pinDiameterDelta = (p.pinDiameter1 - p.pinDiameter0) / p.pinDelta;

    let polylines = [];

    let localH = 0.;
    for (localH; localH < p.bodyHeight; localH += p.layerHeight) {

        for (const pl of aSlice(v0, v1, p, localH)) {
            pl.moveToHeight(localH + p.startHeight);
            polylines.push(pl);
        }
    }

    for (localH; localH < p.totalHeight; localH += p.layerHeight) {
        for (const pl of aPinOnlySlice(v0, v1, p, localH)) {
            pl.moveToHeight(localH + p.startHeight);
            polylines.push(pl);
        }
    }

    return polylines;
}

