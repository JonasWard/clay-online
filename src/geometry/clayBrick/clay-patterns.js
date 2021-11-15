export function sinWaveUVPattern(uv, parameters){
    const phase = parameters.phaseDelta * uv.y;
    return Math.sin(uv.x * parameters.frequency + phase) * parameters.amplitude + parameters.offset;
}

export const DEFAULT_SIN_WAVE_UV_PARAMETERS = {
    amplitude: 2.,
    frequency: 2. * Math.PI / 30.0,
    phaseDelta: 1.0,
    offset: 5.,
    uv: true
};