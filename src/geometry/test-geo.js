import {
    Curve,
    // EdgesGeometry,
    // CurveLine,
    // LineBasicMaterial,
    // LineSegments,
    Matrix4,
    Mesh,
    ShaderMaterial,
    // Vector2,
    Vector3
} from "three";
import {TubeGeo} from "./to-three";
import {shaders} from "./shaders-materials";
import {displayPointTest} from "./importing-jsts";
import {clamp} from "three/src/math/MathUtils";

class CustomSinCurve extends Curve {

    constructor( scale = 1 ) {

        super();

        this.scale = scale;

    }

    getPoint( t, optionalTarget = new Vector3() ) {

        const tx = t * 3 - 1.5;
        const ty = Math.sin( 2 * Math.PI * t );
        const tz = 0;

        return optionalTarget.set( tx, ty, tz ).multiplyScalar( this.scale );
    }
}

export class CustomLine extends Curve {

    constructor(v0, v1) {
        super();

        this.v0 = v0;
        this.vDir = v1 - this.v0;

        this.scale = 1.;
    }

    getPoint(t, optionalTarget = new Vector3()) {
        const v = this.v0 + t * this.vDir;
        // console.log(v);

        return optionalTarget.set(v.x, v.y, v.z).multiplyScalar( this.scale );
    }
}

function shaderMaterialEdges() {
    return new ShaderMaterial( shaders.edges );
}

export function shaderNormal() {
    return new ShaderMaterial(shaders.normalShader);
}

export function testTube() {
    // const material = new MeshBasicMaterial( { color: 0xff2211 } );
    const material = shaderNormal();
    const path = new CustomSinCurve( 10 );

    return TubeGeo(path, 100, 2., 32, false, material);
}

export function testJSTSTriangulation(scene) {
    const {buffer, edges} = displayPointTest();
    const material = shaderMaterialEdges();

    const mesh = new Mesh(buffer, material);

    // const lines = new LineSegments(
    //     new EdgesGeometry(bufferGeo, 0),
    //     new LineBasicMaterial({color:'black', linewidth: 3.})
    // );

    // mesh.add(edges);

    scene.add(mesh);

    const blWhiteShader = new ShaderMaterial(shaders.grid);

    for (const line in edges) {
        const aLine = edges[line];

        // console.log(aLine);

        const locTubeGeo = TubeGeo(aLine, 1, .5, 32, false, blWhiteShader);

        // console.log(locTubeGeo);
        scene.add(locTubeGeo);
    }


    // scene.add(locTubeGeo);
}
//
// export function getLinesFromMesh(mesh) {
//     return new LineSegments(
//         new EdgesGeometry(mesh.geometry),
//         new LineBasicMaterial()
//     );
// }

export function addTestGeos(scene) {
    scene.add(testTube());

    testJSTSTriangulation(scene);
}