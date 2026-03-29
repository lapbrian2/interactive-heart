uniform float uWavePosition;
uniform float uTime;
uniform vec3 uColor;

varying vec2 vUv;

void main() {
  float dist = vUv.x - uWavePosition;
  float trailLength = 0.25;

  float ahead = smoothstep(0.0, 0.03, dist);
  float behind = smoothstep(-trailLength, 0.0, dist);
  float intensity = behind * (1.0 - ahead);

  // Bright leading edge
  float edge = smoothstep(-0.02, 0.0, dist) * (1.0 - smoothstep(0.0, 0.02, dist));
  float brightness = intensity + edge * 2.0;

  float pulse = 0.4 + 0.6 * brightness;
  float glow = pulse + sin(uTime * 3.0) * 0.08;

  // Boost emissive intensity for bloom pickup
  vec3 color = uColor * glow * 1.8;
  float alpha = max(0.15, min(1.0, intensity + edge * 0.5));

  gl_FragColor = vec4(color, alpha);
}
