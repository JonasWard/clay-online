import {constructBrick} from "../clayBrick/clay-simple-base";
import {TubeGeo} from "../to-three";
import {shaderNormal} from "../test-geo";
import {DEFAULT_SIN_WAVE_UV_PARAMETERS, sinWaveUVPattern} from "../clayBrick/clay-patterns";
import {MeshLambertMaterial, TextureLoader, TubeGeometry, Mesh, DirectionalLight} from "three";
import {scene, renderer} from "../../three-setup/set-up";

const CLAY_TEXTURE_URL = "https://i.ibb.co/9nk0c8H/terra-cotta-stucco-wall-texture.jpg";

export let geometryArray = [];

export const OVERWRITE_SETTINGS = {
    productionWidth: {default: 2.5, min: 1., max: 10.},
    baseWidth: {default: 150.0, min: 100., max: 200.},
    baseLength: {default: 300.0, min: 200., max: 400.},
    lengthBufferMultiplier: {default: 2.0, min: 1.0, max: 10.},
    pinSpacing: {default: 220.0, min: 100., max: 300.},
    diamondWidth: {default: 50.0, min: 20., max: 100.},
    diamondHeight: {default: 110.0, min: 20., max: 200.},
    diamondCount: {default: 3, min: 1, max: 5},
    pinDiameter0: {default: 40.0, min: 30., max: 100.},
    pinDiameter1: {default: 20.0, min: 30., max: 100.},
    pinDelta: {default: 250.0, min: 1.0, max: 10.},
    pinDivisions: {default: 60, min: 1.0, max: 10.},
    precision: {default: 2.0, min: 1.0, max: 10.},
    bodyHeight: {default: 160.0, min: 1.0, max: 10.},
    totalHeight: {default: 260.0, min: 1.0, max: 10.},
    startHeight: {default: -100.0, min: 1.0, max: 10.},
    layerHeight: {default: 2.5, min: 1.0, max: 10.},
    pattern: {
        patternFunction: {default: sinWaveUVPattern},
        patternParameters: {default: DEFAULT_SIN_WAVE_UV_PARAMETERS}
    }
}

function overwriteClone() {
    let overwriteCopy = {};

    for (const key in OVERWRITE_SETTINGS) {
        if (key !== "pattern") {
            overwriteCopy[key] = OVERWRITE_SETTINGS[key].default;
        } else {
            overwriteCopy["pattern"] = {
                patternFunction: OVERWRITE_SETTINGS.pattern.patternFunction.default,
                patternParameters: patternClone()
            };
        }
    }

    return overwriteCopy;
}

function patternClone() {
    let patternSettingsClone = {};

    for (const key in OVERWRITE_SETTINGS.pattern.patternParameters.default) {
        patternSettingsClone[key] = OVERWRITE_SETTINGS.pattern.patternParameters.default[key].default;
    }

    return patternSettingsClone;
}

export let overwrites = overwriteClone();


// export function patternMapping(patternName) {
//     switch (patternName) {
//         case "sinWave":
//             return sinWaveUVPattern;
//         default:
//             return sinWaveUVPattern;
//     }
// }

function applyBrickShader(scene, pls) {
    const loader = new TextureLoader();


    loader.load(
        // resource URL
        CLAY_TEXTURE_URL,

        // onLoad callback
        function ( texture ) {
            // in this example we create the material when the texture is loaded
            const brickShader = new MeshLambertMaterial( {
                map: texture
            } );

            // const brickShader = shaderNormal();

            for (const pl of pls) {
                const tubeGeo = new TubeGeometry(pl, pl.getPointCount(), 1.5, 6, false);
                const locMesh = new Mesh(tubeGeo, brickShader);

                geometryArray.push(locMesh);

                scene.add(locMesh);
            }
        },

        // onProgress callback currently not supported
        undefined,

        // onError callback
        function ( err ) {
            console.error( 'An error happened.' );
        }
    );
}

export function addLighting(scene) {
    const directionalLight = new DirectionalLight( 0xffffff, 1.1 );
    directionalLight.position.set(500,500,500);
    scene.add( directionalLight );
}

export function clearScene(scene){
    for (const obj of geometryArray) {
        scene.remove(obj);
        obj.geometry.dispose();
        obj.material.dispose();
    }

    console.log(scene);

    geometryArray = [];
}

export function addBrick() {

    clearScene(scene);

    const pls = constructBrick(overwrites)

    applyBrickShader(scene, pls);

    console.log(scene.children);
}
