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

  // if the uv coordinates are within 5% of the border on any side, 3x the fadeStrength
  float borderThresholdX = 0.025;
  float borderThresholdY = 0.05;
  float multiplier = 1.0;
  vec3 adjustedTargetColor = targetColor;
  
  if (uv.x < borderThresholdX || uv.x > (1.0 - borderThresholdX) ||
      uv.y < borderThresholdY || uv.y > (1.0 - borderThresholdY)) {
    multiplier = 8.0;
//    adjustedTargetColor = vec3(0,0,0);
  }
  
  float adjustedFadeStrength = fadeStrength * multiplier;

  // Calculate fadeColor by adjusting each component of texColor
  vec3 fadeColor;
  for (int i = 0; i < 3; i++) {
    if (texColor[i] < adjustedTargetColor[i]) {
      fadeColor[i] = min(texColor[i] + adjustedFadeStrength, adjustedTargetColor[i]);
    } else {
      fadeColor[i] = max(texColor[i] - adjustedFadeStrength, adjustedTargetColor[i]);
    }
  }
  
  gl_FragColor = vec4(fadeColor, texColor.a);
}