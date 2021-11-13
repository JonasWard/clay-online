import {Vector3} from "three";
import {Coordinate} from "jsts/org/locationtech/jts/geom";

export class ClayPoint {
    origin;
    direction;
    position;

    constructor(origin, direction) {
        this.origin = origin;
        this.position = new Vector3().copy(origin);
        this.direction = direction;
    }

    move(value) {
        this.position = new Vector3().addVectors(
            this.position,
            new Vector3().addScaledVector(this.direction, value)
        );
    }

    set(value) {
        this.position = new Vector3().addVectors(
            this.origin,
            new Vector3().addScaledVector(this.direction, value)
        );
    }

    toCoordinate() {
        return new Coordinate(
            this.position.x,
            this.position.y,
            this.position.z
        )
    }

    toVector3() {
        return new Vector3().copy(this.position);
    }
}

export function clayPointTest() {
    const vBase = new Vector3(0, 0, 0);
    const vDir = new Vector3(1, 0, 0);

    const clayPoint = new ClayPoint(vBase, vDir);

    clayPoint.move(1.);

    clayPoint.set(10.);
}
