// defining base parameters
// all lengths are in mm
// base height, width

import {ClayPatternCurve} from "./clay-pattern-curve";

const {Vector3} = require("three");
const {ClayPoint} = require("./clay-point");
const baseWidth = 150.0;
const baseLength = 300.0; // always needs to be at least the same length as the brick's width

const pinSpacing = 220.0;
const diamondWidth = 60.0;
const diamondHeight = 100.0;

const pinDiameter0 = 40.0;
const pinDiameter1 = 20.0;
const pinDelta = 250.0;
const pinDiameterDelta = (pinDiameter1 - pinDiameter0) * pinDelta;

const precision = 5.0;

const bodyHeight = 160.0;

function pinRadiusAtHeight(height) {
  return pinDiameterDelta * height + pinDiameter0;
}

function arcDivisions(radius, goalLength, arcAngle, startPhase, basePoint, clayPoints) {
    const count = Math.ceil(arcAngle * radius / goalLength);
    const angleDelta = arcAngle / count;

    console.log("clayPoint.length: ", clayPoints.length);
    console.log(count);

    for (let i = 0; i < count; i++) {
        const angle = startPhase + angleDelta * i;

        const x0 = Math.cos(angle);
        const y0 = Math.sin(angle);

        const x = radius * x0;
        const y = radius * y0;

        clayPoints.push(new ClayPoint(
            new Vector3(basePoint.x + x, basePoint.y + y, 0),
            new Vector3(x0, y0, 0)
        ));
    }

    console.log("clayPoint.length: ", clayPoints.length);
}

function lineDivisions(v0, v1, goalLength, clayPoints) {
    const delta = new Vector3().addScaledVector(
        new Vector3().subVectors(v1, v0),
        goalLength / v0.distanceTo(v1)
    );

    const count = Math.ceil(v0.distanceTo(v1) / goalLength);
    console.log("clayPoint.length: ", clayPoints.length);
    console.log(count);

    for (let i = 0; i < count; i++) {
        const v = new Vector3().addVectors(
            v0,
            new Vector3().addScaledVector(delta, i)
        );

        clayPoints.push(new ClayPoint(
            v,
            v.clone().sub(v0).normalize())
        );
    }

    console.log("clayPoint.length: ", clayPoints.length);
}

export function outerProfile() {
    const v0 = new Vector3(-(baseLength - baseWidth) * .5, 0.0);
    const v1 = new Vector3((baseLength - baseWidth) * .5, 0.0);

    let clayPoints = [];

    arcDivisions(baseWidth * .5, precision, Math.PI, .5 *Math.PI, v0, clayPoints);

    const p0 = new Vector3(-(baseLength - baseWidth) * .5, -baseWidth * .5)
    const p1 = new Vector3((baseLength - baseWidth) * .5, -baseWidth * .5)

    lineDivisions(p0, p1, precision, clayPoints);

    arcDivisions(baseWidth * .5, precision, Math.PI, -.5 *Math.PI, v1, clayPoints);

    const p2 = new Vector3((baseLength - baseWidth) * .5, baseWidth * .5)
    const p3 = new Vector3(-(baseLength - baseWidth) * .5, baseWidth * .5)

    lineDivisions(p2, p3, precision, clayPoints);

    return new ClayPatternCurve(clayPoints);
}



