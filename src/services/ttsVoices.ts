export interface TtsVoiceOption {
  name: string
  label: string
}

export const TTS_VOICES: TtsVoiceOption[] = [
  { name: 'Sulafat', label: 'Sulafat - hangat' },
  { name: 'Kore', label: 'Kore - jelas' },
  { name: 'Puck', label: 'Puck - ringan' },
  { name: 'Aoede', label: 'Aoede - ramah' },
  { name: 'Charon', label: 'Charon - tegas' },
]

export const DEFAULT_TTS_VOICE = TTS_VOICES[0].name
