import {GeometryFactory} from "jsts/org/locationtech/jts/geom";
import {ClayPoint} from './clay-point';
import {Vector3} from "three";

class ClayPatternCurve {
    clayPoints;

    constructor(clayPoints) {
        this.clayPoints = clayPoints;
    }

    toPolygon() {
        let coordinates =[];

        // const crds = new Coordinates();
        //
        // crds.

        for (const pt of this.clayPoints) {
            coordinates.push(pt.toCoordinate());
        }

        coordinates.push(coordinates[0]);

        return new GeometryFactory().createPolygon(coordinates)

        // const lr = new LinearRing(coordinates);
        // return new Polygon(lr);
    }
}

export function testClayCurve(scene = null) {
    let pts = [
        new ClayPoint(
            new Vector3(.5, .5, 0),
            new Vector3(1, 1, 0),
        ),
        new ClayPoint(
            new Vector3(-.5, .5, 0),
            new Vector3(-1, 1, 0),
        ),
        new ClayPoint(
            new Vector3(-.5, -.5, 0),
            new Vector3(-1, -1, 0),
        ),
        new ClayPoint(
            new Vector3(.5, -.5, 0),
            new Vector3(1, -1, 0),
        ),
    ];

    const clayCurve = new ClayPatternCurve(pts);
    console.log(clayCurve);

    console.log(clayCurve.toPolygon());

    console.log(scene);

    if (scene) {
        // console.log("is not null?");
        // console.log(scene);



    } else {
        console.log("is null !!!");
    }
}
