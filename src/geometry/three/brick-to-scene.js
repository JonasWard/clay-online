import {constructBrick} from "../clayBrick/clay-simple-base";
import {TubeGeo} from "../to-three";
import {shaderNormal} from "../test-geo";
import {DEFAULT_SIN_WAVE_UV_PARAMETERS, sinWaveUVPattern} from "../clayBrick/clay-patterns";
import {MeshLambertMaterial, TextureLoader, TubeGeometry, Mesh, DirectionalLight} from "three";
import {scene, renderer} from "../../three-setup/set-up";

const CLAY_TEXTURE_URL = "https://i.ibb.co/9nk0c8H/terra-cotta-stucco-wall-texture.jpg";

export let geometryArray = [];
export let overwrites;

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
    totalHeight: {default: 250.0, min: 1.0, max: 10.},
    startHeight: {default: -100.0, min: 1.0, max: 10.},
    layerHeight: {default: 2.5, min: 1.0, max: 10.},
    easingStart: {default: 20., min: 0., max: 250.},
    easingEnd: {default: 100., min: 0., max: 250.},
    pattern: {
        patternFunction: {default: sinWaveUVPattern},
        patternParameters: {default: DEFAULT_SIN_WAVE_UV_PARAMETERS}
    }
}

function overwriteClone() {
    overwrites = {};

    for (const key in OVERWRITE_SETTINGS) {
        if (key !== "pattern") {
            overwrites[key] = OVERWRITE_SETTINGS[key].default;
        } else {
            overwrites["pattern"] = {
                patternFunction: OVERWRITE_SETTINGS.pattern.patternFunction.default,
                patternParameters: patternClone()
            };
        }
    }

    overwrites = updateEasingSettings();

    return overwrites;
}

function patternClone() {
    let patternSettingsClone = {};

    for (const key in OVERWRITE_SETTINGS.pattern.patternParameters.default) {
        patternSettingsClone[key] = OVERWRITE_SETTINGS.pattern.patternParameters.default[key].default;
    }

    return patternSettingsClone;
}

overwriteClone();

function applyBrickShader(scene, pls, parameters) {
    const loader = new TextureLoader();

    const pipeRadius = parameters.layerHeight * .6;

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
                const tubeGeo = new TubeGeometry(pl, pl.getPointCount(), pipeRadius, 6, true);
                const locMesh = new Mesh(tubeGeo, brickShader);

                locMesh.castShadow = true;
                locMesh.receiveShadow = true;

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

export function addLighting() {
    const directionalLight = new DirectionalLight( 0xffffff, 1.1 );
    directionalLight.position.set(500,500,500);

    directionalLight.castShadow = true;
    directionalLight.shadow.camera.near = 1200;
    directionalLight.shadow.camera.far = 2500;
    directionalLight.shadow.bias = 0.0001;

    directionalLight.shadow.mapSize.width = 4096;
    directionalLight.shadow.mapSize.height = 4096;

    return directionalLight;
}

function totalLength() {
    return overwrites.baseWidth * Math.PI + (overwrites.baseLength - overwrites.baseWidth) * 2.;
}

export function updateEasingSettings() {
    const locTotalLength = totalLength();

    overwrites.easingParameters = {
        startLength: overwrites.easingStart,
        startMaxLength: overwrites.easingEnd,
        endMaxLength: locTotalLength * .5 - overwrites.easingEnd,
        endLength: locTotalLength * .5 - overwrites.easingStart,
        easingDelta: 1. / (overwrites.easingEnd - overwrites.easingStart)
    };

    return overwrites;
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

    updateEasingSettings();

    console.log(overwrites);

    const pls = constructBrick(overwrites)

    applyBrickShader(scene, pls, overwrites);
}
