import {Curve, Vector3} from 'three';

export class Polyline extends Curve {
    constructor(points, closed = true) {
        super();

        this.points = points;
        this.closed = closed;

        this.dirs = this.getDirs();

        this.arcLengthDivisions = this.getPointCount();
    }

    getPointCount() {
        if (this.closed) {
            return this.points.length;
        } else {
            return this.points.length - 1;
        }
    }

    getDirs() {
        let dirList = [];

        for (let i = 0; i < this.getPointCount(); i++) {
            const v0 = this.points[i];
            const v1 = this.points[(i+1) % this.getPointCount()];

            const vDir = new Vector3().subVectors(v1, v0);

            dirList.push(vDir);
        }

        return dirList;
    }

    getLength() {
        const lengths = this.getLengths();
        return lengths[lengths.length - 1];
    }

    getLengths() {
        if ( this.cacheArcLengths &&
            ( this.cacheArcLengths.length === this.getPointCount() + 1 ) &&
            ! this.needsUpdate ) {

            return this.cacheArcLengths;
        }

        let previous = 0.;
        this.cacheArcLengths = [previous];

        for (const dir of this.dirs) {
            previous += dir.length();
            this.cacheArcLengths.push(previous);
        }

        return this.cacheArcLengths;
    }

    getTangentAt(u, optionalTarget = new Vector3()) {
        return this.getTangent(u * this.getPointCount(), optionalTarget)
    }

    getTangent(t, optionalTarget = new Vector3()) {
        const locT = t % 1.;
        let roundT = t - t % 1.;

        if (isNaN(t)) {
            return null;
        }

        let vT;

        if (t > 0 && t < this.getPointCount()) {
            if ( locT < .0001 ) {
                const v1 = new Vector3().copy(this.dirs[roundT]);
                const v0 = new Vector3().copy(this.dirs[roundT - 1]);

                v0.normalize();
                v1.normalize();

                vT = new Vector3().addVectors(v0, v1);
            } else {
                vT = new Vector3().copy(this.dirs[roundT]);
            }
        }

        if (this.closed) {
            roundT %= this.getPointCount();

            if ( locT < .0001 ) {
                const v1 = new Vector3().copy(this.dirs[roundT]);
                const v0 = new Vector3().copy(this.dirs[(roundT + this.getPointCount() - 1) % this.getPointCount()]);

                v0.normalize();
                v1.normalize();

                vT = new Vector3().addVectors(v0, v1);
            } else {
                vT = new Vector3().copy(this.dirs[roundT]);
            }
        } else {
            if (t < 1) {
                vT = new Vector3().copy(this.dirs[0]);
            } else {
                vT = new Vector3().copy(this.dirs[this.dirs.length - 1]);
            }
        }

        vT.normalize();
        return optionalTarget.set(vT.x, vT.y, vT.z);
    }

    _tConstraining(t) {
        let locT = t % 1.;

        let t0 = t - locT;

        if (this.closed) {
            t0 %= this.getPointCount();
        } else {
            if (t0 < 0) {
                locT += t0;
                t0 = 0;
            } else if (t0 >= this.getPointCount()) {
                locT += t0 - this.getPointCount();
                t0 = this.getPointCount();
            }
        }

        return {
            locT: locT,
            t0: t0
        };
    }

    getPoint( t, optionalTarget = new Vector3() ) {
        t *= this.getPointCount();

        // console.log(t);

        const {locT, t0} = this._tConstraining(t);

        // console.log(locT, t0);

        const v0 = this.points[t0];
        const vDir = this.dirs[t0];

        const v = new Vector3().addVectors(v0, new Vector3().addScaledVector(locT, vDir));

        return optionalTarget.set(v.x, v.y, v.z);
    }
}
