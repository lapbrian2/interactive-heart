import { useState } from 'react'

/**
 * Mute/unmute toggle for heart sounds.
 * Controls the global audio context suspend/resume.
 */
export function SoundToggle() {
  const [muted, setMuted] = useState(false)

  const toggle = () => {
    setMuted(!muted)
    // Suspend or resume all audio contexts
    const contexts = (window as any).__audioContexts as AudioContext[] | undefined
    if (!contexts) return
    contexts.forEach((ctx) => {
      if (muted) ctx.resume()
      else ctx.suspend()
    })
  }

  return (
    <button
      className="sound-toggle"
      onClick={toggle}
      aria-label={muted ? 'Unmute heart sounds' : 'Mute heart sounds'}
      title={muted ? 'Unmute' : 'Mute'}
    >
      {muted ? 'SOUND OFF' : 'SOUND ON'}
    </button>
  )
}
