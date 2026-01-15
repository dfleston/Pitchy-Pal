
import { useEffect, useRef, useState, useCallback } from 'react';
import { PitchDetector } from 'pitchy';

export const usePitchDetection = (active: boolean) => {
  const [pitch, setPitch] = useState<number | null>(null);
  const [clarity, setClarity] = useState<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const requestRef = useRef<number>();

  const updatePitch = useCallback(() => {
    if (!analyserRef.current || !audioContextRef.current) return;

    const analyser = analyserRef.current;
    const detector = PitchDetector.forFloat32Array(analyser.fftSize);
    const input = new Float32Array(detector.inputLength);
    analyser.getFloatTimeDomainData(input);

    const [detectedPitch, detectedClarity] = detector.findPitch(
      input,
      audioContextRef.current.sampleRate
    );

    // Only update if clarity is high enough (human voice usually > 0.8-0.9)
    if (detectedClarity > 0.85) {
      setPitch(detectedPitch);
    } else {
      setPitch(null);
    }
    setClarity(detectedClarity);

    requestRef.current = requestAnimationFrame(updatePitch);
  }, []);

  useEffect(() => {
    if (!active) return;

    const initAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const context = new (window.AudioContext || (window as any).webkitAudioContext)();
        const source = context.createMediaStreamSource(stream);
        const analyser = context.createAnalyser();
        analyser.fftSize = 2048;
        source.connect(analyser);

        audioContextRef.current = context;
        analyserRef.current = analyser;
        updatePitch();
      } catch (err) {
        console.error('Error accessing microphone:', err);
      }
    };

    initAudio();

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (audioContextRef.current) audioContextRef.current.close();
    };
  }, [active, updatePitch]);

  return { pitch, clarity };
};
