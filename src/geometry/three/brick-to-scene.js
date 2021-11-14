import {constructBrick} from "../clayBrick/clay-simple-base";
import {TubeGeo} from "../to-three";
import {shaderNormal} from "../test-geo";
import {DEFAULT_SIN_WAVE_UV_PARAMETERS, sinWaveUVPattern} from "../clayBrick/clay-patterns";

const overwrites = {
    productionWidth: 2.5,
    baseWidth: 150.0,
    baseLength: 300.0, // always needs to be at least the same length as the brick's width
    lengthBufferMultiplier: 2.0,
    pinSpacing: 220.0,
    diamondWidth: 50.0,
    diamondHeight: 110.0,
    diamondCount: 3,
    pinDiameter0: 40.0,
    pinDiameter1: 20.0,
    pinDelta: 250.0,
    pinDivisions: 60,
    precision: 2.5,
    bodyHeight: 160.0,
    totalHeight: 260.0,
    startHeight: -100.0,
    layerHeight: 2.5,
    pattern: {
        patternFunction: sinWaveUVPattern,
        patternParameters: DEFAULT_SIN_WAVE_UV_PARAMETERS
    }
}

export function addBrick(scene) {
    scene.children = [];

    for (const pl of constructBrick(overwrites)) {
        const locTubeGeo = TubeGeo(pl, pl.getPointCount(), 1.5, 6, false, shaderNormal());
        scene.add(locTubeGeo);
    }
}