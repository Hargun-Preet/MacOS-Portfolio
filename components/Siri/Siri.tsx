"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { galaxyPreset, Orb } from 'react-ai-orb';
import { cn } from '@/lib/utils';

// --- SIRI COMPONENT ---
interface SiriProps {
  isOpen: boolean;
  onClose: () => void;
  openWindow: (id: string) => void;
}

type SiriState = 'idle' | 'listening' | 'thinking' | 'speaking';

const textBubbleVariant = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.02 } },
};

const charVariant = {
  hidden: { opacity: 0, y: 5 },
  visible: { opacity: 1, y: 0 },
};

export const Siri: React.FC<SiriProps> = ({ isOpen, onClose, openWindow }) => {
  const [state, setState] = useState<SiriState>('idle');
  const [transcript, setTranscript] = useState('');
  const [responseText, setResponseText] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // --- NEW: Refs for Web Audio API ---
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  // --- NEW: State for dynamic orb size ---
  const [orbScale, setOrbScale] = useState(1);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const currentTranscript = Array.from(event.results).map((result: any) => result[0]).map(result => result.transcript).join('');
        setTranscript(currentTranscript);
      };
      
      recognition.onend = () => {
        stopAudioProcessing(); // --- MODIFIED: Stop audio analysis
        setTranscript(current => {
          if (current.trim().length > 0) {
            setState('thinking');
          } else {
            setState('idle');
            onClose();
          }
          return current;
        });
      };
      recognitionRef.current = recognition;
    }

    // --- NEW: Cleanup on component unmount ---
    return () => {
      stopAudioProcessing();
    };
  }, [onClose]);

  useEffect(() => {
    if (isOpen && state === 'idle') {
      startListening();
    }
  }, [isOpen, state]);
  
  useEffect(() => {
    if (state === 'thinking' && transcript) {
      const getAIResponse = async () => {
        try {
          const res = await fetch('/api/siri', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: transcript }),
          });
          const data = await res.json();
          if (data.error) throw new Error(data.error);
          setResponseText(data.spokenText);
          setState('speaking');
          playAudio(data.audioUrl);
          if (data.action?.action === 'open' && data.action?.target) {
            openWindow(data.action.target);
          }
        } catch (error) {
          const errorResponse = "I'm having a little trouble right now. Please try again.";
          setResponseText(errorResponse);
          setState('speaking');
        }
      };
      getAIResponse();
    }
  }, [state, transcript, openWindow, onClose]);

  // --- NEW: Function to analyze audio volume ---
  const analyzeAudio = () => {
    if (analyserRef.current) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteTimeDomainData(dataArray);
      
      let sum = 0;
      for (const amplitude of dataArray) {
        sum += Math.abs(amplitude - 128); // 128 is the zero-point for 8-bit audio
      }
      const average = sum / dataArray.length;
      
      // Map the average volume to the orb size. You can tweak these values.
      const minScale = 1.0;
      const maxScale = 1.5; // Orb can grow up to 60% larger
      const scalingFactor = 0.05; // Increase for more sensitivity
      const newScale = Math.min(maxScale, minScale + average * scalingFactor);
      
      setOrbScale(newScale);
      
      animationFrameIdRef.current = requestAnimationFrame(analyzeAudio);
    }
  };

  // --- NEW: Function to stop audio processing and release mic ---
  const stopAudioProcessing = () => {
    if (animationFrameIdRef.current) {
      cancelAnimationFrame(animationFrameIdRef.current);
    }
    streamRef.current?.getTracks().forEach(track => track.stop());
    setOrbScale(1); // Reset to default size
  };

  const startListening = async () => { // --- MODIFIED: Made async
    if (recognitionRef.current) {
      setTranscript('');
      setResponseText('');
      setState('listening');
      recognitionRef.current.start();

      // --- NEW: Start audio analysis ---
      try {
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        const source = audioContextRef.current.createMediaStreamSource(stream);
        analyserRef.current = audioContextRef.current.createAnalyser();
        source.connect(analyserRef.current);
        analyzeAudio();
      } catch (err) {
        console.error("Error accessing microphone:", err);
        // Handle error (e.g., show a message to the user)
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      // stopAudioProcessing is called by recognition.onend, so no need to call it here
      setState('idle');
    }
  };

  const playAudio = (audioUrl: string) => {
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play();
      audioRef.current.onended = () => {
        onClose();
      };
    }
  };
  
  return (
    <>
      <audio ref={audioRef} hidden />
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50000 flex items-start justify-end pt-10 pr-4"
            onMouseDown={onClose}
          >
            <div className="flex flex-col items-end gap-4" onMouseDown={(e) => e.stopPropagation()}>
              
              {/* --- MODIFIED: Orb is now in a sized wrapper --- */}
              <motion.div
                style={{ width: 100, height: 100 }}
                animate={{ scale: orbScale }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="flex items-center justify-center"
              >
                <button onClick={startListening} className="outline-none">
                  <Orb {...galaxyPreset} />
                </button>
              </motion.div>

              {transcript && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/80 backdrop-blur-md p-3 rounded-xl shadow-lg max-w-xs"
                >
                  <p className="text-neutral-900">
                    {transcript}
                  </p>
                </motion.div>
              )}
              
              <AnimatePresence>
                {state === 'thinking' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="bg-white/80 backdrop-blur-md p-3 rounded-xl shadow-lg max-w-xs"
                  >
                    <div className="flex items-center gap-2 text-neutral-500">
                      <div className="w-2 h-2 bg-neutral-400 rounded-full animate-pulse" />
                      <div className="w-2 h-2 bg-neutral-400 rounded-full animate-pulse [animation-delay:0.2s]" />
                      <div className="w-2 h-2 bg-neutral-400 rounded-full animate-pulse [animation-delay:0.4s]" />
                    </div>
                  </motion.div>
                )}

                {state === 'speaking' && responseText && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/80 backdrop-blur-md p-3 rounded-xl shadow-lg max-w-xs"
                  >
                    <motion.p 
                      className="font-semibold text-blue-700"
                      variants={textBubbleVariant}
                      initial="hidden"
                      animate="visible"
                    >
                      {responseText.split('').map((char, i) => (
                        <motion.span key={`response-${i}`} variants={charVariant}>
                          {char}
                        </motion.span>
                      ))}
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};