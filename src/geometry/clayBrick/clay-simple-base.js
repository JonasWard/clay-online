// defining base parameters
// all lengths are in mm
// base height, width

import {ClayPatternCurve} from "./clay-pattern-curve";
import {Polyline} from "../three/three-poly-line";
import {ClayPoint} from "./clay-point";
import {polylineToPolygon} from "../jsts2Three/three-to-jsts";
import {createBuffer, geometriesDifference, geometriesIntersection, geometryUnion} from "../importing-jsts";
import {polygonToPolylines} from "../jsts2Three/jsts-to-three";
import {Vector2, Vector3} from "three";
// import {DEFAULT_SIN_WAVE_UV_PARAMETERS, sinWaveUVPattern} from "./clay-patterns";

let productionWidth = 2.5;

let baseWidth = 150.0;
let baseLength = 300.0; // always needs to be at least the same length as the brick's width
let lengthBufferMultiplier = 2.0;

let pinSpacing = 220.0;
let diamondWidth = 50.0;
let diamondHeight = 110.0;
let diamondCount = 3;

let pinDiameter0 = 40.0;
let pinDiameter1 = 20.0;
let pinDelta = 250.0;
let pinDiameterDelta = (pinDiameter1 - pinDiameter0) / pinDelta;
let pinDivisions = 60;

let precision = 2.5;

let bodyHeight = 160.0;
let totalHeight = 260.0;
let startHeight = -100.0;
let layerHeight = 2.5;

let patternFunction, patternParameters;

let v0, v1;

function pinRadiusAtHeight(height) {
    // console.log(pinDiameterDelta, height, pinDiameter0);
    return pinDiameterDelta * height + pinDiameter0;
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

export function outerProfile(height = 0.) {
    const v0 = new Vector3(-(baseLength - baseWidth) * .5, 0.0, height);
    const v1 = new Vector3((baseLength - baseWidth) * .5, 0.0, height);

    let clayPoints = [];

    let vVal = 0.;

    vVal = arcDivisions(baseWidth * .5, precision, .5 * Math.PI, Math.PI, v0, clayPoints, vVal);

    const p0 = new Vector3(-(baseLength - baseWidth) * .5, -baseWidth * .5, height);
    const p1 = new Vector3((baseLength - baseWidth) * .5, -baseWidth * .5, height);

    vVal = lineDivisions(p0, p1, precision, clayPoints, vVal);

    vVal = arcDivisions(baseWidth * .5, precision, Math.PI, -.5 *Math.PI, v1, clayPoints, vVal);

    const p2 = new Vector3((baseLength - baseWidth) * .5, baseWidth * .5, height);
    const p3 = new Vector3(-(baseLength - baseWidth) * .5, baseWidth * .5, height);

    vVal = lineDivisions(p2, p3, precision, clayPoints, vVal);

    arcDivisions(baseWidth * .5, precision, .5 * Math.PI, .5 * Math.PI, v0, clayPoints, vVal);

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

function diamondPolyline(bPoint) {
    return new Polyline([
        new Vector3(bPoint.x + diamondWidth * .5, bPoint.y, 0),
        new Vector3(bPoint.x, bPoint.y + diamondHeight * .5, 0),
        new Vector3(bPoint.x - diamondWidth * .5, bPoint.y, 0),
        new Vector3(bPoint.x, bPoint.y - diamondHeight * .5, 0)
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

export function innerProfileGeom(height = 0.) {

    const diamondVs = simpleLineDivison(v0, v1, diamondCount + 1, false);

    let pls = [];

    for (const diamondV of diamondVs) {
        const diamond = diamondPolyline(diamondV);
        const diamondRect = rectangle(diamondV, productionWidth, baseWidth * lengthBufferMultiplier);

        pls.push(diamond);
        pls.push(diamondRect);
    }

    const pinDiameter = pinRadiusAtHeight(height);

    pls.push(simpleArcDivision(v0, pinDiameter * .5, 2. * Math.PI, 0., pinDivisions));
    pls.push(simpleArcDivision(v1, pinDiameter * .5, 2. * Math.PI, 0., pinDivisions));
    pls.push(rectangle(v0, productionWidth, baseWidth * lengthBufferMultiplier));
    pls.push(rectangle(v1, productionWidth, baseWidth * lengthBufferMultiplier));
    pls.push(rectangle(new Vector3(0, 0, 0),baseLength + baseWidth * (lengthBufferMultiplier - 1.), productionWidth));

    let polygons = [];
    for (const pl of pls){
        polygons.push(polylineToPolygon(pl));
    }

    const geom = geometryUnion(polygons);

    return geom;
}

export function innerProfile(height = 0.) {
    const geom = innerProfileGeom(height);

    const polylines = polygonToPolylines(geom);

    for (const pl of polylines) {
        pl.moveToHeight(height);
    }

    return polylines;
}

export function aSlice(height = 0.) {
    const outerClayCurve = outerProfile(height);

    // console.log(outerClayCurve);

    // need to apply a certain pattern logic to it
    // no pattern for now!
    outerClayCurve.applyPattern(patternFunction, patternParameters);

    const outerGeom = outerClayCurve.toPolygon();

    const bufferedOuterGeom = createBuffer(outerGeom, -productionWidth, 1);

    const recL = (baseLength + baseWidth * (lengthBufferMultiplier - 1.)) * .5;

    // console.log(recL);

    const leftRec = rectangle(
        new Vector3(-recL * .5, 0, 0),
        recL,
        productionWidth
    );

    // console.log(leftRec);

    const leftRecPg = polylineToPolygon(leftRec);
    const unionOuterGeom = geometryUnion([bufferedOuterGeom, leftRecPg])

    const innerGeom = innerProfileGeom(height);

    const geom = geometriesIntersection(unionOuterGeom, innerGeom);

    const path = geometriesDifference(outerGeom, geom)

    let polylines = polygonToPolylines(path);

    return polylines;
}

function aPinOnlySlice(height) {
    let pls = [];

    const pinDiameter = pinRadiusAtHeight(height);

    const arcA = simpleArcDivision(v0, pinDiameter * .5, 2. * Math.PI, 0., pinDivisions);
    const arcB = simpleArcDivision(v1, pinDiameter * .5, 2. * Math.PI, 0., pinDivisions);

    arcA.cadFlip();
    arcB.cadFlip();

    pls.push(arcA);
    pls.push(arcB);

    return pls;
}

function readingOverwrites(overwrites) {
    productionWidth = overwrites.productionWidth;
    baseWidth = overwrites.baseWidth;
    baseLength = overwrites.baseLength;
    lengthBufferMultiplier = overwrites.lengthBufferMultiplier;
    pinSpacing = overwrites.pinSpacing;
    diamondWidth = overwrites.diamondWidth;
    diamondHeight = overwrites.diamondHeight;
    diamondCount = overwrites.diamondCount;
    pinDiameter0 = overwrites.pinDiameter0;
    pinDiameter1 = overwrites.pinDiameter1;
    pinDelta = overwrites.pinDelta;
    pinDivisions = overwrites.pinDivisions;
    precision = overwrites.precision;
    bodyHeight = overwrites.bodyHeight;
    totalHeight = overwrites.totalHeight;
    startHeight = overwrites.startHeight;
    layerHeight = overwrites.layerHeight;
    patternFunction = overwrites.pattern.patternFunction;
    patternParameters = overwrites.pattern.patternParameters;
}

export function constructBrick(overwrites) {
    v0 = new Vector3(-pinSpacing * .5, 0.0);
    v1 = new Vector3(pinSpacing * .5, 0.0);

    readingOverwrites(overwrites);

    pinDiameterDelta = (pinDiameter1 - pinDiameter0) / pinDelta

    let polylines = [];

    let localH = 0.;
    for (localH; localH < bodyHeight; localH += layerHeight) {

        for (const pl of aSlice(localH)) {
            pl.moveToHeight(localH + startHeight);
            polylines.push(pl);
        }
    }

    for (localH; localH < totalHeight; localH += layerHeight) {
        for (const pl of aPinOnlySlice(localH)) {
            pl.moveToHeight(localH + startHeight);
            polylines.push(pl);
        }
    }

    return polylines;
}

