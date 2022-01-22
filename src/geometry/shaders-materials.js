export const shaders = {
    normalShader: {
        vertexShader: `
            varying vec3 v_Normal;
            void main() {
                v_Normal = normal;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }`,
        fragmentShader: `
            varying vec3 v_Normal;
            void main() {
                gl_FragColor = vec4(v_Normal * .8, .8);
                // vec3 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
    
            }`,
        transparent: true,
        uniforms: {}
    },

    smokeShader: {
        fragmentShader: `
            uniform vec2 res;
            uniform sampler2D bufferTexture;
            uniform vec3 smokeSource;
            
            void main() {
                vec2 pixel = gl_FragCoord.xy / res.xy;
                gl_FragColor = texture2D( bufferTexture, pixel );
            
                //Get the distance of the current pixel from the smoke source
                float dist = distance(smokeSource.xy,gl_FragCoord.xy);
                //Generate smoke when mouse is pressed
                gl_FragColor.rgb += smokeSource.z * max(15.0-dist,0.0);
            
                //Smoke diffuse
                float xPixel = 1.0/res.x;//The size of a single pixel
                float yPixel = 1.0/res.y;
                vec4 rightColor = texture2D(bufferTexture,vec2(pixel.x+xPixel,pixel.y));
                vec4 leftColor = texture2D(bufferTexture,vec2(pixel.x-xPixel,pixel.y));
                vec4 upColor = texture2D(bufferTexture,vec2(pixel.x,pixel.y+yPixel));
                vec4 downColor = texture2D(bufferTexture,vec2(pixel.x,pixel.y-yPixel));
                //Diffuse equation
                gl_FragColor.rgb += 14.0 * 0.016 * (leftColor.rgb + rightColor.rgb + downColor.rgb + upColor.rgb - 4.0 * gl_FragColor.rgb);
            }`
    },

    gridNormal: {
        vertexShader: `
            varying vec3 v_Position;
            varying vec3 v_Normal;
            void main() {
                v_Position = position;
                v_Normal = normal;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }`,
        fragmentShader: `
            varying vec3 v_Position;
            varying vec3 v_Normal;
            void main() {
                vec3 grid = abs(fract(v_Position - 0.5) - 0.5) / fwidth(v_Position);
                float line = min(min(grid.x, grid.y), grid.z);
                float value = 3.- min(line,3.);
                float transparency = .1 + value * .9;
            
                gl_FragColor = vec4(v_Normal * value, transparency);
                // vec3 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
            }`,
        transparent: true,
        uniforms: {},
        extensions: {derivatives: true}
    },

    grid: {
        vertexShader: `
            varying vec3 v_Position;
            void main() {
                v_Position = position;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }`,
        fragmentShader: `
            varying vec3 v_Position;
            void main() {
                vec3 grid = abs(fract(v_Position - .5) - .5) / fwidth(v_Position);
                float line = min(min(grid.x, grid.y), grid.z);
                float value = 2.5- min(line, 2.5);
                float transparency = .1 + value * .9;

                gl_FragColor = vec4(vec3(0.), transparency);
                // vec3 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
            }`,
        transparent: true,
        uniforms: {},
        extensions: {derivatives: true}
    },

    zGrid: {
        vertexShader: `
            varying float z_Position;
            varying vec3 v_Normal;
            void main() {
                z_Position = position.z;
                v_Normal = normal;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }`,
        fragmentShader: `
            varying float z_Position;
            varying vec3 v_Normal;
            void main() {
                float line = abs(fract(z_Position - 0.5) - 0.5) / fwidth(z_Position);
                float value = 3.- min(line,3.);
                float transparency = .1 + value * .9;
    
                gl_FragColor = vec4(v_Normal * value, transparency);
                // vec3 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
            }`,
        transparent: true,
        uniforms: {},
        extensions: {derivatives: true}
    },

    edges: {
        vertexShader: `
            attribute vec2 barycentric;
            varying vec2 b;
            void main () {
                b = barycentric;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }`,
        fragmentShader: `
            // float gridFactor (vec2 vBC, float width, float feather) {
            //     float w1 = width - feather * 0.5;
            //     vec3 bary = vec3(vBC.x, vBC.y, 1.0 - vBC.x - vBC.y);
            //     vec3 d = fwidth(bary);
            //     vec3 a3 = smoothstep(d * w1, d * (w1 + feather), bary);
            //    
            //     return min(min(a3.x, a3.y), a3.z);
            // }
            
            float gridFactor (vec2 vBC, float width) {
                vec3 bary = vec3(vBC.x, vBC.y, 1.0 - vBC.x - vBC.y);
                vec3 d = fwidth(bary);
                vec3 a3 = smoothstep(d * (width - 0.5), d * (width + 0.5), bary);
                
                return min(min(a3.x, a3.y), a3.z);
            }
            
            varying vec2 b;
            
            void main () {
                gl_FragColor = vec4(vec3(gridFactor(b, 1.0) * .6), 1);
            }`,
        transparent: true,
        extensions: {derivatives: true}
    },
    brownNormalShader: {
        vertexShader: `
            varying vec3 v_Normal;
            void main() {
                v_Normal = normal;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }`,
        fragmentShader: `
            varying vec3 v_Normal;
            void main() {
                gl_FragColor = vec4(v_Normal * .8, 1.);
                // vec3 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord);
    
            }`,
        transparent: false,
        uniforms: {}
    }
}
