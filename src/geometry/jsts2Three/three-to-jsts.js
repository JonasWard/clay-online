import {GeometryFactory} from "jsts/org/locationtech/jts/geom";
import Coordinate from "jsts/org/locationtech/jts/geom/Coordinate";

function vector3toCoordinate(vector3) {
    return new Coordinate(vector3.x, vector3.y, vector3.z);
}

function coordinatesFromPolyline(polyline) {
    let coordinates = [];

    for (const pt of polyline.points) {
        coordinates.push(vector3toCoordinate(pt));
    }

    coordinates.push(coordinates[0]);

    return coordinates;
}

export function polylineToPolygon(polyline) {
    const geoFactory = new GeometryFactory();

    let coordinates = [];

    const polygon = geoFactory.createPolygon(coordinatesFromPolyline(polyline));

    return polygon;
};