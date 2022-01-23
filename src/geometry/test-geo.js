import {
    Mesh,
    ShaderMaterial
} from "three";
import {TubeGeo} from "./to-three";
import {shaders} from "./shaders-materials";
import {displayPointTest, testPolygon} from "./jstsOperations/importing-jsts";
import {polygonToPolyLines} from "./jsts2Three/jsts-to-three";
import {constructBrick} from "./clayBrick/clay-simple-base";
import {CustomSinCurve} from "./three/three-poly-line";

function shaderMaterialEdges() {
    return new ShaderMaterial( shaders.grid );
}

export function shaderNormal() {
    return new ShaderMaterial(shaders.normalShader);
}

export function testTube() {
    // const material = new MeshBasicMaterial( { color: 0xff2211 } );
    const material = shaderMaterialEdges();
    const path = new CustomSinCurve( 10 );

    return TubeGeo(path, 100, 2., 32, false, material);
}

export function testJSTSTriangulation(scene) {
    const {buffer, edges} = displayPointTest();
    const material = shaderMaterialEdges();

    const mesh = new Mesh(buffer, material);

    const blWhiteShader = new ShaderMaterial(shaders.normalShader);

    for (const line in edges) {
        const aLine = edges[line];

        // console.log(aLine);

        const locTubeGeo = TubeGeo(aLine, 32, .5, 32, false, blWhiteShader);

        // console.log(locTubeGeo);
        scene.add(locTubeGeo);
    }

    scene.add(mesh);
}

export function geoTubeTest() {
    const polygon = testPolygon();
    const pls = polygonToPolyLines(polygon);

    const blWhiteShader = new ShaderMaterial(shaders.normalShader);

    let tubes = [];
    for (const pl of pls) {
        pl.makeMeWave(4., 10.);
        tubes.push(TubeGeo(pl, pl.getPointCount(), .5, 6, false, blWhiteShader))
    }

    return tubes;
}

export function addTestGeos(scene) {
    for (const pl of constructBrick()) {
        const locTubeGeo = TubeGeo(pl, pl.getPointCount(), 1.5, 6, false, shaderNormal());
        scene.add(locTubeGeo);
    }
}
