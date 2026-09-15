import { useEffect, useRef } from 'react'
import './App.css'

const WHATSAPP_URL = 'https://chat.whatsapp.com/HLN7YfSxety5z8gOGUdnTG'
const GITHUB_URL = 'https://github.com/smeglan/clase-de-programacion-creativa'

type Dot = {
  x: number
  y: number
  r: number
  vx: number
  vy: number
  hue: number
  phase: number
}

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let width = 0
    let height = 0
    let dots: Dot[] = []

    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const count = Math.min(Math.floor((width * height) / 9000), 90)
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 1 + Math.random() * 2.4,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        hue: 240 + Math.random() * 120,
        phase: Math.random() * Math.PI * 2,
      }))
    }

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height)

      for (const dot of dots) {
        dot.x += dot.vx
        dot.y += dot.vy
        if (dot.x < -10) dot.x = width + 10
        if (dot.x > width + 10) dot.x = -10
        if (dot.y < -10) dot.y = height + 10
        if (dot.y > height + 10) dot.y = -10

        const pulse = 0.5 + 0.5 * Math.sin(t / 900 + dot.phase)

        const grad = ctx.createRadialGradient(
          dot.x,
          dot.y,
          0,
          dot.x,
          dot.y,
          dot.r * 6,
        )
        grad.addColorStop(0, `hsla(${dot.hue}, 90%, 65%, ${0.5 * pulse})`)
        grad.addColorStop(1, 'hsla(260, 90%, 60%, 0)')

        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(dot.x, dot.y, dot.r * 6, 0, Math.PI * 2)
        ctx.fill()
      }

      for (let i = 0; i < dots.length; i += 1) {
        for (let j = i + 1; j < dots.length; j += 1) {
          const a = dots[i]
          const b = dots[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 140) {
            const alpha = (1 - dist / 140) * 0.12
            ctx.strokeStyle = `hsla(210, 100%, 70%, ${alpha})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
      }

      raf = requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className="landing">
      <canvas ref={canvasRef} className="bg-canvas" aria-hidden="true" />
      <main className="content">
        <h1 className="title">
          Programación
          <span className="title-accent">Creativa</span>
        </h1>
        <p className="subtitle">
          Crea tus propias obras interactivas con código. 
        </p>
        <div className="actions">
          <a
            className="btn btn-whatsapp"
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.9-1.5A10 10 0 1 0 12 2Zm5.4 14.1c-.2.7-1.3 1.3-1.9 1.4-.5.1-1.1.2-3.5-.8-2.9-1.2-4.7-4.2-4.9-4.4-.1-.2-1.1-1.6-1.1-3s.7-2.1.9-2.4c.2-.3.5-.4.7-.4h.5c.2 0 .4 0 .6.4l.9 2.2c.1.2.1.4 0 .5l-.4.6-.4.5c-.1.1-.3.3-.1.6.1.3.7 1.2 1.5 1.9 1 .9 1.9 1.2 2.2 1.4.2.1.4.1.5-.1l.7-.9c.2-.2.3-.2.6-.1l2 1c.3.1.5.2.6.3.1.2.1.6 0 1.3Z"
              />
            </svg>
            Grupo de WhatsApp
          </a>
          <a
            className="btn btn-ghost"
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.4-3.4-1.4-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.4 1.1 2.9.8.1-.6.3-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.2-.4-1.2.1-2.6 0 0 .8-.3 2.7 1a9.4 9.4 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.6.6.7 1 1.6 1 2.7 0 3.9-2.4 4.7-4.6 5 .4.3.7.9.7 1.9v2.7c0 .3.2.6.7.5A10 10 0 0 0 12 2Z"
              />
            </svg>
            Código · GitHub
          </a>
        </div>
      </main>
      <footer className="footer">
        <p>Hecho con ♥ y código</p>
      </footer>
    </div>
  )
}

export default App