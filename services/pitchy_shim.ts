
/**
 * Simple Autocorrelation Pitch Detection
 * Based on the concepts used in libraries like Pitchy.
 */
export class PitchDetector {
  private bufferSize: number;

  constructor(bufferSize: number) {
    this.bufferSize = bufferSize;
  }

  static forFloat32Array(fftSize: number) {
    return new PitchDetector(fftSize);
  }

  get inputLength() {
    return this.bufferSize;
  }

  findPitch(data: Float32Array, sampleRate: number): [number, number] {
    let bestOffset = -1;
    let bestCorrelation = 0;
    let rms = 0;

    for (let i = 0; i < data.length; i++) {
      rms += data[i] * data[i];
    }
    rms = Math.sqrt(rms / data.length);

    // Too quiet
    if (rms < 0.01) return [0, 0];

    const correlations = new Float32Array(data.length);

    for (let offset = 0; offset < data.length; offset++) {
      let correlation = 0;
      for (let i = 0; i < data.length - offset; i++) {
        correlation += data[i] * data[i + offset];
      }
      correlations[offset] = correlation;
    }

    // Find first local maximum after the first zero-crossing
    let d = 0;
    while (correlations[d] > correlations[d + 1]) d++;
    
    let maxCorrelation = -1;
    for (let i = d; i < data.length; i++) {
      if (correlations[i] > maxCorrelation) {
        maxCorrelation = correlations[i];
        bestOffset = i;
      }
    }

    if (bestOffset === -1) return [0, 0];

    const pitch = sampleRate / bestOffset;
    const clarity = maxCorrelation / correlations[0];

    return [pitch, clarity];
  }
}
