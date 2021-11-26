import {deconstructPolygon} from "../jsts2Three/jsts-to-three";
import {Coordinate, GeometryFactory} from "jsts/org/locationtech/jts/geom";

function twistLineStringAroundPoint(lineString, position, p) {
    // lineString
}

export function twistIntersect(polygon, coordinates = null, p = null) {
    const linearRings = deconstructPolygon(polygon);

    if (linearRings.length === 1){
        const gf = new GeometryFactory();
        // const hardCoded = new gf.createPoint(new Coordinate(-120., 0.));

        // const polygon = hardCoded.buffer(10.);

        console.log(linearRings[0]);
        console.log("can convert to linestring")
    } else {
        console.log("this slice contains more than one more line string");
    }
}
