precision highp float;

// texcoords from the vertex shader
varying vec2 vTexCoord;

// our texture coming from p5
uniform sampler2D tex0;

// fade strength parameter
uniform float fadeStrength;

// target color as a vec3 uniform
uniform vec3 targetColor;

void main() {
  vec2 uv = vTexCoord;

  // Simply sample the texture at the current UV coordinate
  vec4 texColor = texture2D(tex0, uv);

  // Calculate fadeColor by adjusting each component of texColor
  vec3 fadeColor;
  for (int i = 0; i < 3; i++) {
    if (texColor[i] < targetColor[i]) {
      fadeColor[i] = min(texColor[i] + fadeStrength, targetColor[i]);
    } else {
      fadeColor[i] = max(texColor[i] - fadeStrength, targetColor[i]);
    }
  }
  
  gl_FragColor = vec4(fadeColor, texColor.a);
}