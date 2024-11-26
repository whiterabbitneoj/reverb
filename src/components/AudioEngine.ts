import * as Tone from 'tone';

export class AudioEngine {
  private mic: Tone.UserMedia | null = null;
  private pitchShift: Tone.PitchShift | null = null;
  private reverb: Tone.Reverb | null = null;
  private voiceEffect: Tone.FeedbackDelay | null = null;
  private distortion: Tone.Distortion | null = null;
  private autoFilter: Tone.AutoFilter | null = null;
  private recorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private monitorNode: Tone.Volume | null = null;

  async initialize() {
    await Tone.start();
    
    this.disconnect();

    this.mic = new Tone.UserMedia();
    this.pitchShift = new Tone.PitchShift(0);
    this.reverb = new Tone.Reverb(0.5);
    this.voiceEffect = new Tone.FeedbackDelay(0.1, 0);
    this.distortion = new Tone.Distortion(0);
    this.autoFilter = new Tone.AutoFilter(0).start();
    this.monitorNode = new Tone.Volume(-Infinity);

    await this.mic.open();
    
    // Default chain
    this.mic.chain(
      this.pitchShift,
      this.reverb,
      this.voiceEffect,
      this.distortion,
      this.autoFilter,
      this.monitorNode,
      Tone.Destination
    );

    // Set up recording
    const destination = Tone.Destination.context.createMediaStreamDestination();
    this.autoFilter?.connect(destination);
    
    this.recorder = new MediaRecorder(destination.stream);
    this.recorder.ondataavailable = (event) => {
      this.audioChunks.push(event.data);
    };
    
    this.recorder.onstop = () => {
      const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
      const url = URL.createObjectURL(audioBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'reverb-recording.wav';
      a.click();
      URL.revokeObjectURL(url);
      this.audioChunks = [];
    };
  }

  disconnect() {
    this.mic?.disconnect();
    this.pitchShift?.disconnect();
    this.reverb?.disconnect();
    this.voiceEffect?.disconnect();
    this.distortion?.disconnect();
    this.autoFilter?.disconnect();
    this.monitorNode?.disconnect();
  }

  setPitch(value: number) {
    if (this.pitchShift) {
      this.pitchShift.pitch = value;
    }
  }

  setReverb(value: number) {
    if (this.reverb) {
      this.reverb.decay = value * 10;
    }
  }

  setMonitoring(enabled: boolean) {
    if (this.monitorNode) {
      this.monitorNode.volume.value = enabled ? 0 : -Infinity;
    }
  }

  startRecording() {
    if (this.recorder && this.recorder.state === 'inactive') {
      this.audioChunks = [];
      this.recorder.start();
    }
  }

  stopRecording() {
    if (this.recorder && this.recorder.state === 'recording') {
      this.recorder.stop();
    }
  }

  setVoiceEffect(effect: string) {
    if (!this.mic || !this.distortion || !this.autoFilter || !this.voiceEffect) return;

    // Reset effects
    this.distortion.distortion = 0;
    this.autoFilter.frequency.value = 0;
    this.voiceEffect.feedback.value = 0;

    switch (effect) {
      case 'robot':
        this.distortion.distortion = 0.5;
        this.autoFilter.frequency.value = 4;
        break;
      case 'alien':
        this.pitchShift!.pitch = 5;
        this.autoFilter.frequency.value = 2;
        break;
      case 'demon':
        this.pitchShift!.pitch = -12;
        this.distortion.distortion = 0.8;
        break;
      case 'chipmunk':
        this.pitchShift!.pitch = 12;
        break;
      case 'echo':
        this.voiceEffect.feedback.value = 0.6;
        this.voiceEffect.delayTime.value = 0.3;
        break;
      case 'underwater':
        this.autoFilter.frequency.value = 0.1;
        this.autoFilter.depth.value = 0.8;
        break;
      default:
        this.pitchShift!.pitch = 0;
    }
  }

  async start() {
    try {
      await this.mic?.open();
    } catch (err) {
      throw new Error('Microphone access denied');
    }
  }

  stop() {
    this.mic?.close();
  }

  dispose() {
    this.stop();
    this.disconnect();
  }
}