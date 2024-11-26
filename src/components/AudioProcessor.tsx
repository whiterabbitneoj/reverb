import React, { useState, useEffect, useCallback } from 'react';
import Slider from './Controls/Slider';
import VoiceSelect from './Controls/VoiceSelect';
import { AudioEngine } from './AudioEngine';

const AudioProcessor = () => {
  const [isActive, setIsActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [pitch, setPitch] = useState(0);
  const [reverb, setReverb] = useState(0.5);
  const [voiceEffect, setVoiceEffect] = useState('normal');
  const [audioEngine] = useState(() => new AudioEngine());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      audioEngine.dispose();
    };
  }, [audioEngine]);

  const toggleMicrophone = useCallback(async () => {
    try {
      setError(null);
      if (isActive) {
        audioEngine.stop();
        if (isRecording) {
          audioEngine.stopRecording();
          setIsRecording(false);
        }
      } else {
        await audioEngine.initialize();
        await audioEngine.start();
      }
      setIsActive(!isActive);
    } catch (err) {
      setError('Microphone access denied. Please allow microphone access and try again.');
      console.error(err);
    }
  }, [isActive, isRecording, audioEngine]);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      audioEngine.stopRecording();
    } else {
      audioEngine.startRecording();
    }
    setIsRecording(!isRecording);
  }, [isRecording, audioEngine]);

  const toggleMonitoring = useCallback(() => {
    const newState = !isMonitoring;
    setIsMonitoring(newState);
    audioEngine.setMonitoring(newState);
  }, [isMonitoring, audioEngine]);

  const handlePitchChange = useCallback((value: number[]) => {
    setPitch(value[0]);
    audioEngine.setPitch(value[0]);
  }, [audioEngine]);

  const handleReverbChange = useCallback((value: number[]) => {
    setReverb(value[0]);
    audioEngine.setReverb(value[0]);
  }, [audioEngine]);

  const handleVoiceChange = useCallback((value: string) => {
    setVoiceEffect(value);
    audioEngine.setVoiceEffect(value);
  }, [audioEngine]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-blue-900 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
            ReVerb
          </h1>
          <p className="text-gray-300">Real-time voice effects processor</p>
        </div>
        
        {error && (
          <div className="bg-red-500/80 backdrop-blur text-white p-4 rounded-lg mb-8 shadow-lg">
            {error}
          </div>
        )}

        <div className="space-y-8">
          <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl">
            <div className="space-y-4">
              <button
                onClick={toggleMicrophone}
                className={`w-full py-4 px-6 rounded-xl text-lg font-semibold transition-all duration-300 ${
                  isActive 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-blue-500 hover:bg-blue-600'
                } shadow-lg`}
              >
                {isActive ? 'Stop Microphone' : 'Start Microphone'}
              </button>

              <div className="flex gap-4">
                <button
                  onClick={toggleMonitoring}
                  disabled={!isActive}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    isMonitoring
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-gray-600 hover:bg-gray-700'
                  } disabled:opacity-50 disabled:cursor-not-allowed shadow-lg`}
                >
                  {isMonitoring ? '🔊 Monitoring On' : '🔇 Monitoring Off'}
                </button>

                <button
                  onClick={toggleRecording}
                  disabled={!isActive}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    isRecording
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-gray-600 hover:bg-gray-700'
                  } disabled:opacity-50 disabled:cursor-not-allowed shadow-lg`}
                >
                  {isRecording ? '⏹️ Stop Recording' : '⏺️ Start Recording'}
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl space-y-6">
            <div className="mb-8">
              <VoiceSelect
                value={voiceEffect}
                onChange={handleVoiceChange}
              />
            </div>

            <Slider
              label="Pitch Shift"
              value={pitch}
              onChange={handlePitchChange}
              min={-12}
              max={12}
              step={1}
            />

            <Slider
              label="Reverb Amount"
              value={reverb}
              onChange={handleReverbChange}
              min={0}
              max={1}
              step={0.01}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioProcessor;