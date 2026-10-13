
let ctx
let enabled = true

export function setSound(value) {
  enabled = value
}

const presets = {
  move: { from: 520, to: 520, dur: 0.04, type: 'square', vol: 0.03 },
  open: { from: 660, to: 990, dur: 0.1, type: 'triangle', vol: 0.06 },
  back: { from: 440, to: 300, dur: 0.09, type: 'triangle', vol: 0.06 },
  jump: { from: 380, to: 760, dur: 0.11, type: 'square', vol: 0.04 },
  die: { from: 320, to: 70, dur: 0.35, type: 'sawtooth', vol: 0.05 },
}

export function play(name) {
  if (!enabled) return
  const p = presets[name]
  if (!p) return
  try {
    ctx ??= new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const t = ctx.currentTime
    osc.type = p.type
    osc.frequency.setValueAtTime(p.from, t)
    osc.frequency.exponentialRampToValueAtTime(p.to, t + p.dur)
    gain.gain.setValueAtTime(p.vol, t)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + p.dur)
    osc.connect(gain).connect(ctx.destination)
    osc.start(t)
    osc.stop(t + p.dur)
  } catch {
    
  }
}
