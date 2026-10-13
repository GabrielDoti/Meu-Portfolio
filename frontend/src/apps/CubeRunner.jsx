import { useEffect, useRef } from 'react'
import { play } from '../sound'
import { useT } from '../i18n'

// Auto-runner original: o cubo corre sozinho, você só pula.
const W = 800
const H = 360
const GROUND = 290
const SIZE = 36
const CUBE_X = 120
const GRAVITY = 0.9
const JUMP_V = -14.2
const HALF_PI = Math.PI / 2

const RED = '#ff4554'
const BLUE = '#00c3e3'

function readBest() {
  try {
    return Number(localStorage.getItem('cube-best')) || 0
  } catch {
    return 0
  }
}

function saveBest(v) {
  try {
    localStorage.setItem('cube-best', String(v))
  } catch {
    /* ignora */
  }
}

function newGame(state = 'ready') {
  return {
    state,
    y: GROUND - SIZE,
    vy: 0,
    rot: 0,
    onGround: true,
    speed: 6,
    dist: 0,
    obstacles: [],
    nextAt: 520,
    hold: false,
    particles: [],
    best: readBest(),
  }
}

function spawn(g) {
  const roll = Math.random()
  let o
  if (roll < 0.35) o = { type: 'spike', n: 1 }
  else if (roll < 0.6) o = { type: 'spike', n: 2 }
  else if (roll < 0.72) o = { type: 'spike', n: 3 }
  else o = { type: 'block', n: 1 }
  o.x = W + 40
  g.obstacles.push(o)
  // distância mínima pra dar tempo de pular, cresce com a velocidade
  g.nextAt = 230 + g.speed * 20 + Math.random() * 220
}

export default function CubeRunner() {
  const canvasRef = useRef(null)
  const t = useT()
  // O loop do jogo vive dentro de um effect; esta ref entrega sempre o idioma atual.
  const tRef = useRef(t)
  tRef.current = t

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let g = newGame()
    let raf
    let last = performance.now()

    function jump() {
      if (g.state === 'ready' || g.state === 'dead') {
        const best = g.best
        g = newGame('playing')
        g.best = best
        g.hold = true
        return
      }
      g.hold = true
    }

    function release() {
      g.hold = false
    }

    function die() {
      g.state = 'dead'
      play('die')
      const score = Math.floor(g.dist / 10)
      if (score > g.best) {
        g.best = score
        saveBest(score)
      }
      for (let i = 0; i < 16; i++) {
        g.particles.push({
          x: CUBE_X + SIZE / 2,
          y: g.y + SIZE / 2,
          vx: (Math.random() - 0.5) * 12,
          vy: (Math.random() - 1) * 10,
          life: 40 + Math.random() * 20,
        })
      }
    }

    function update(dt) {
      // partículas continuam depois da morte
      g.particles.forEach((p) => {
        p.x += p.vx * dt
        p.y += p.vy * dt
        p.vy += 0.5 * dt
        p.life -= dt
      })
      g.particles = g.particles.filter((p) => p.life > 0)

      if (g.state !== 'playing') return

      g.speed = Math.min(11, 6 + g.dist / 2500)
      g.dist += g.speed * dt

      // pulo (segurar a tecla pula de novo assim que pousar)
      if (g.hold && g.onGround) {
        g.vy = JUMP_V
        g.onGround = false
        play('jump')
      }

      const prevBottom = g.y + SIZE
      g.vy += GRAVITY * dt
      g.y += g.vy * dt
      g.onGround = false

      if (g.y >= GROUND - SIZE) {
        g.y = GROUND - SIZE
        g.vy = 0
        g.onGround = true
      }

      // obstáculos
      g.obstacles.forEach((o) => {
        o.x -= g.speed * dt
      })
      g.obstacles = g.obstacles.filter((o) => o.x + o.n * SIZE > -10)

      g.nextAt -= g.speed * dt
      if (g.nextAt <= 0) spawn(g)

      const cx = CUBE_X + 4
      const cw = SIZE - 8

      for (const o of g.obstacles) {
        if (o.type === 'spike') {
          for (let i = 0; i < o.n; i++) {
            const hx = o.x + i * SIZE + 10
            const hy = GROUND - 26
            const hit = cx < hx + 16 && cx + cw > hx && g.y + 4 < hy + 26 && g.y + SIZE - 4 > hy
            if (hit) return die()
          }
        } else {
          const top = GROUND - SIZE
          const overlapX = cx < o.x + SIZE && cx + cw > o.x
          if (overlapX && g.y + SIZE > top) {
            if (prevBottom <= top + 1 && g.vy >= 0) {
              g.y = top - SIZE
              g.vy = 0
              g.onGround = true
            } else if (g.y + SIZE > top + 4) {
              return die()
            }
          }
        }
      }

      // rotação no ar, alinha ao pousar
      if (g.onGround) {
        g.rot = Math.round(g.rot / HALF_PI) * HALF_PI
      } else {
        g.rot += 0.11 * dt
      }
    }

    function drawSpike(x) {
      ctx.fillStyle = BLUE
      ctx.beginPath()
      ctx.moveTo(x, GROUND)
      ctx.lineTo(x + SIZE / 2, GROUND - SIZE)
      ctx.lineTo(x + SIZE, GROUND)
      ctx.closePath()
      ctx.fill()
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2
      ctx.stroke()
    }

    function draw() {
      // fundo
      const bg = ctx.createLinearGradient(0, 0, 0, H)
      bg.addColorStop(0, '#14142b')
      bg.addColorStop(1, '#2a1233')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, W, H)

      // faixas de parallax
      ctx.fillStyle = 'rgba(255,255,255,0.04)'
      const off = (g.dist * 0.3) % 160
      for (let x = -160; x < W + 160; x += 160) {
        ctx.fillRect(x - off, 0, 60, GROUND)
      }

      // chão
      ctx.fillStyle = '#0c0c1a'
      ctx.fillRect(0, GROUND, W, H - GROUND)
      const line = ctx.createLinearGradient(0, 0, W, 0)
      line.addColorStop(0, RED)
      line.addColorStop(1, BLUE)
      ctx.fillStyle = line
      ctx.fillRect(0, GROUND, W, 4)

      // obstáculos
      g.obstacles.forEach((o) => {
        if (o.type === 'spike') {
          for (let i = 0; i < o.n; i++) drawSpike(o.x + i * SIZE)
        } else {
          ctx.fillStyle = '#1b1b3a'
          ctx.fillRect(o.x, GROUND - SIZE, SIZE, SIZE)
          ctx.strokeStyle = BLUE
          ctx.lineWidth = 3
          ctx.strokeRect(o.x + 1.5, GROUND - SIZE + 1.5, SIZE - 3, SIZE - 3)
        }
      })

      // cubo
      if (g.state !== 'dead') {
        ctx.save()
        ctx.translate(CUBE_X + SIZE / 2, g.y + SIZE / 2)
        ctx.rotate(g.rot)
        ctx.fillStyle = RED
        ctx.fillRect(-SIZE / 2, -SIZE / 2, SIZE, SIZE)
        ctx.strokeStyle = '#ffffff'
        ctx.lineWidth = 3
        ctx.strokeRect(-SIZE / 2 + 1.5, -SIZE / 2 + 1.5, SIZE - 3, SIZE - 3)
        ctx.fillStyle = BLUE
        ctx.fillRect(-9, -8, 6, 10)
        ctx.fillRect(4, -8, 6, 10)
        ctx.restore()
      }

      // partículas
      ctx.fillStyle = RED
      g.particles.forEach((p) => ctx.fillRect(p.x, p.y, 7, 7))

      // HUD
      const score = Math.floor(g.dist / 10)
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 22px system-ui, sans-serif'
      ctx.textAlign = 'left'
      const tr = tRef.current
      ctx.fillText(`${tr('game.points')} ${score}`, 20, 36)
      ctx.textAlign = 'right'
      ctx.fillText(`${tr('game.best')} ${Math.max(g.best, score)}`, W - 20, 36)

      ctx.textAlign = 'center'
      if (g.state === 'ready') {
        ctx.font = 'bold 28px system-ui, sans-serif'
        ctx.fillText(tr('game.title'), W / 2, 120)
        ctx.font = '18px system-ui, sans-serif'
        ctx.fillText(tr('game.start'), W / 2, 155)
      } else if (g.state === 'dead') {
        ctx.font = 'bold 30px system-ui, sans-serif'
        ctx.fillText(`${tr('game.over')} • ${score}`, W / 2, 120)
        ctx.font = '18px system-ui, sans-serif'
        ctx.fillText(tr('game.retry'), W / 2, 155)
      }
    }

    function loop(now) {
      const dt = Math.min(2.5, (now - last) / 16.667)
      last = now
      update(dt)
      draw()
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const isJumpKey = (e) => ['Space', 'ArrowUp', 'KeyW'].includes(e.code)
    const onDown = (e) => {
      if (isJumpKey(e)) {
        e.preventDefault()
        if (!e.repeat) jump()
      }
    }
    const onUp = (e) => {
      if (isJumpKey(e)) release()
    }
    window.addEventListener('keydown', onDown)
    window.addEventListener('keyup', onUp)

    const el = canvasRef.current
    const pointerDown = (e) => {
      e.preventDefault()
      jump()
    }
    el.addEventListener('pointerdown', pointerDown)
    window.addEventListener('pointerup', release)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('keydown', onDown)
      window.removeEventListener('keyup', onUp)
      window.removeEventListener('pointerup', release)
      el.removeEventListener('pointerdown', pointerDown)
    }
  }, [])

  return (
    <div className="game">
      <canvas ref={canvasRef} width={W} height={H} />
      <p className="muted">{t('game.tip')}</p>
    </div>
  )
}
