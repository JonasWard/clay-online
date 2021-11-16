export function sinWaveUVPattern(uv, parameters){
    const phase = parameters.phaseDelta * uv.y;
    return Math.sin(uv.x * Math.PI / parameters.period + phase) * parameters.amplitude + parameters.offset;
}

export const DEFAULT_SIN_WAVE_UV_PARAMETERS = {
    amplitude: {default: 2., min: 0., max: 10.},
    period: {default: 30., min: 10., max: 500.},
    phaseDelta: {default: 1., min: -10., max: 10.},
    offset: {default: 0., min: -10., max: 10.},
    uv: {default: 1, min: 0, max: 1}
};

export const PATTERN_LIST = {
    sinWaveUVPattern: {
        patternParameters: DEFAULT_SIN_WAVE_UV_PARAMETERS,
        patternFunction: sinWaveUVPattern
    }
}
