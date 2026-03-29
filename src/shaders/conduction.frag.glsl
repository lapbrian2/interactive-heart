uniform float uWavePosition;
uniform float uTime;
uniform vec3 uColor;

varying vec2 vUv;

void main() {
  float dist = vUv.x - uWavePosition;
  float trailLength = 0.15;

  float ahead = smoothstep(0.0, 0.02, dist);
  float behind = smoothstep(-trailLength, 0.0, dist);
  float intensity = behind * (1.0 - ahead);

  float pulse = 0.3 + 0.7 * intensity;
  float glow = pulse + sin(uTime * 4.0) * 0.05;

  vec3 color = uColor * glow;
  float alpha = max(0.1, intensity);

  gl_FragColor = vec4(color, alpha);
}
