'use client'

import {
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import type {
  PointerEvent as ReactPointerEvent,
  ReactNode,
} from 'react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const LivingPouchScene = dynamic(() => import('./LivingPouchScene'), {
  ssr: false,
  loading: () => null,
})

const INTRO_STORAGE_KEY = 'qms-kodagu-intro-v1'
const INTRO_COLOURS = ['#C1121F', '#E8A317', '#4A6C2F', '#7A2E1D']

const INTRO_PARTICLES = Array.from({ length: 34 }, (_, index) => ({
  x: Math.sin(index * 1.91) * (130 + (index % 5) * 24),
  y: Math.cos(index * 1.37) * (90 + (index % 7) * 21),
  rotation: (index % 2 ? 1 : -1) * (42 + index * 9),
  colour: INTRO_COLOURS[index % INTRO_COLOURS.length],
}))

type ErrorBoundaryProps = {
  children: ReactNode
  onError: () => void
}

type ErrorBoundaryState = {
  failed: boolean
}

class Hero3DErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch() {
    this.props.onError()
  }

  render() {
    return this.state.failed ? null : this.props.children
  }
}

function HandDrawnChilli() {
  return (
    <svg
      width="27"
      height="18"
      viewBox="0 0 27 18"
      fill="none"
      aria-hidden="true"
      className="qms-hero-chilli-mark"
    >
      <path
        d="M4 6.5c3.1 7.2 10.6 8.4 17.4 3.1-4.7.6-8.4-1.7-10.8-6.2C8.8 5.2 6.8 6.2 4 6.5Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinejoin="round"
      />
      <path
        d="M10.2 3.8c.2-1.7 1.3-2.7 3.3-3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M2.2 7.1 1 8.2M23.4 8.6l2.1-.2"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  )
}

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(
      window.WebGLRenderingContext
      && (canvas.getContext('webgl2') || canvas.getContext('webgl')),
    )
  } catch {
    return false
  }
}

export default function HeroSection() {
  const rootRef = useRef<HTMLElement>(null)
  const introRef = useRef<HTMLDivElement>(null)
  const scrollProgressRef = useRef(0)
  const gestureRef = useRef<{
    pointerId: number
    x: number
    y: number
    triggered: boolean
  } | null>(null)

  const [showIntro, setShowIntro] = useState(true)
  const [canUse3D, setCanUse3D] = useState(false)
  const [webglReady, setWebglReady] = useState(false)
  const [isLight, setIsLight] = useState(false)
  const [particleLimit, setParticleLimit] = useState(72)
  const [burstSignal, setBurstSignal] = useState(0)
  const [announcement, setAnnouncement] = useState('')

  const finishIntro = useCallback(() => {
    try {
      window.sessionStorage.setItem(INTRO_STORAGE_KEY, 'seen')
    } catch {
      // Session storage can be unavailable in strict privacy modes.
    }
    setShowIntro(false)
  }, [])

  const disable3D = useCallback(() => {
    setCanUse3D(false)
    setWebglReady(false)
  }, [])

  const triggerBurst = useCallback(() => {
    setBurstSignal((current) => {
      const next = current + 1
      setAnnouncement(`Spice burst ${next} released.`)
      return next
    })
  }, [])

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(INTRO_STORAGE_KEY) === 'seen') {
        setShowIntro(false)
      }
    } catch {
      // Keep the intro enabled if storage cannot be read.
    }
  }, [])

  useEffect(() => {
    const syncTheme = () => {
      setIsLight(document.documentElement.dataset.theme === 'light')
    }
    const desktopQuery = window.matchMedia('(min-width: 900px)')
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const navigatorDetails = navigator as Navigator & {
      connection?: { saveData?: boolean }
      deviceMemory?: number
    }

    const syncParticleLimit = () => {
      setParticleLimit(desktopQuery.matches ? 160 : 72)
    }

    syncTheme()
    syncParticleLimit()
    window.addEventListener('qms-theme-change', syncTheme)
    desktopQuery.addEventListener('change', syncParticleLimit)

    const lowEndDevice = (
      (navigatorDetails.deviceMemory !== undefined && navigatorDetails.deviceMemory <= 2)
      || (navigator.hardwareConcurrency !== undefined && navigator.hardwareConcurrency <= 2)
      || Boolean(navigatorDetails.connection?.saveData)
    )

    if (!reducedMotionQuery.matches && !lowEndDevice && supportsWebGL()) {
      const enableTimer = window.setTimeout(() => setCanUse3D(true), 180)
      return () => {
        window.clearTimeout(enableTimer)
        window.removeEventListener('qms-theme-change', syncTheme)
        desktopQuery.removeEventListener('change', syncParticleLimit)
      }
    }

    return () => {
      window.removeEventListener('qms-theme-change', syncTheme)
      desktopQuery.removeEventListener('change', syncParticleLimit)
    }
  }, [])

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return

      const mm = gsap.matchMedia()

      mm.add(
        {
          desktop: '(min-width: 900px)',
          reduceMotion: '(prefers-reduced-motion: reduce)',
        },
        (context) => {
          const { desktop, reduceMotion } = context.conditions as {
            desktop: boolean
            reduceMotion: boolean
          }

          if (reduceMotion) {
            gsap.set('[data-hero-reveal]', { autoAlpha: 1, y: 0, rotation: 0 })
          } else {
            gsap
              .timeline({
                delay: showIntro ? 0.68 : 0.06,
                defaults: { ease: 'power3.out' },
              })
              .from('[data-hero-title-line]', {
                yPercent: 112,
                rotation: (index) => (index === 0 ? -2.4 : 2.4),
                duration: desktop ? 0.82 : 0.66,
                stagger: 0.08,
              })
              .from(
                '[data-hero-reveal]',
                {
                  y: desktop ? 24 : 15,
                  autoAlpha: 0,
                  duration: desktop ? 0.64 : 0.5,
                  stagger: 0.055,
                },
                '-=0.46',
              )
              .from(
                '[data-living-stage]',
                {
                  y: desktop ? 48 : 28,
                  rotation: desktop ? 2 : 0.8,
                  autoAlpha: 0,
                  duration: 0.82,
                },
                '-=0.58',
              )
          }

          ScrollTrigger.create({
            id: 'qms-living-pouch-progress',
            trigger: root,
            start: 'top top',
            end: 'bottom top',
            onUpdate: (self) => {
              scrollProgressRef.current = self.progress
            },
          })

          if (!reduceMotion) {
            gsap.to('[data-static-pouch]', {
              yPercent: desktop ? 13 : 7,
              rotation: desktop ? 1.5 : 0.7,
              ease: 'none',
              scrollTrigger: {
                trigger: root,
                start: 'top top',
                end: 'bottom top',
                scrub: desktop ? 0.55 : true,
              },
            })
          }
        },
      )

      return () => mm.revert()
    },
    {
      dependencies: [showIntro],
      revertOnUpdate: true,
      scope: rootRef,
    },
  )

  useGSAP(
    () => {
      const intro = introRef.current
      if (!showIntro || !intro) return

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduceMotion) {
        gsap.to(intro, {
          autoAlpha: 0,
          duration: 0.01,
          delay: 0.08,
          onComplete: finishIntro,
        })
        return
      }

      const particles = gsap.utils.toArray<HTMLElement>('[data-intro-particle]')
      gsap.set(particles, {
        x: (index) => INTRO_PARTICLES[index].x,
        y: (index) => INTRO_PARTICLES[index].y,
        rotation: (index) => INTRO_PARTICLES[index].rotation,
        autoAlpha: 0,
        scale: (index) => 0.55 + (index % 4) * 0.18,
      })
      gsap.set('[data-intro-logo]', { autoAlpha: 0, scale: 0.9 })

      gsap
        .timeline({ defaults: { ease: 'power3.inOut' } })
        .to(particles, {
          x: 0,
          y: 0,
          rotation: 0,
          autoAlpha: 0.88,
          duration: 0.64,
          stagger: { amount: 0.18, from: 'random' },
        })
        .to(
          '[data-intro-logo]',
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.3,
            ease: 'power3.out',
          },
          '-=0.24',
        )
        .to(
          particles,
          {
            autoAlpha: 0,
            scale: 0.12,
            duration: 0.24,
            stagger: { amount: 0.08, from: 'edges' },
          },
          '-=0.02',
        )
        .to(intro, {
          autoAlpha: 0,
          duration: 0.2,
          ease: 'power2.out',
          onComplete: finishIntro,
        })
    },
    {
      dependencies: [finishIntro, showIntro],
      revertOnUpdate: true,
      scope: rootRef,
    },
  )

  const handlePointerDownCapture = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!canUse3D || (event.target as HTMLElement).closest('button, a')) return
    gestureRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      triggered: false,
    }
  }

  const handlePointerMoveCapture = (event: ReactPointerEvent<HTMLDivElement>) => {
    const gesture = gestureRef.current
    if (!gesture || gesture.pointerId !== event.pointerId || gesture.triggered) return

    const distance = Math.hypot(event.clientX - gesture.x, event.clientY - gesture.y)
    if (distance > 48) {
      gesture.triggered = true
      triggerBurst()
    }
  }

  const handlePointerUpCapture = (event: ReactPointerEvent<HTMLDivElement>) => {
    const gesture = gestureRef.current
    if (!gesture || gesture.pointerId !== event.pointerId) return

    const distance = Math.hypot(event.clientX - gesture.x, event.clientY - gesture.y)
    if (!gesture.triggered && distance < 14) {
      triggerBurst()
    }
    gestureRef.current = null
  }

  return (
    <section
      ref={rootRef}
      className="qms-hero qms-kodagu-hero"
      aria-labelledby="qms-hero-title"
    >
      <div className="qms-hero-pigment qms-hero-pigment-chilli" aria-hidden="true" />
      <div className="qms-hero-pigment qms-hero-pigment-turmeric" aria-hidden="true" />
      <div className="qms-hero-pigment qms-hero-pigment-leaf" aria-hidden="true" />
      <div className="qms-hero-print-grid" aria-hidden="true" />

      {showIntro ? (
        <div ref={introRef} className="qms-hero-intro" aria-label="Qureshi's Masala & Spices">
          <div className="qms-hero-intro-particles" aria-hidden="true">
            {INTRO_PARTICLES.map((particle, index) => (
              <span
                key={`${particle.colour}-${index}`}
                data-intro-particle
                className="qms-hero-intro-particle"
                style={{ backgroundColor: particle.colour }}
              />
            ))}
          </div>
          <div data-intro-logo className="qms-hero-intro-logo">
            <Image
              src="/images/qureshis-navbar-logo.png"
              alt=""
              width={542}
              height={192}
              priority
            />
            <span>Small-batch flavour from Kodagu</span>
          </div>
          <button type="button" className="qms-hero-intro-skip" onClick={finishIntro}>
            Skip intro
          </button>
        </div>
      ) : null}

      <div className="qms-kodagu-grid">
        <div className="qms-hero-copy">
          <div data-hero-reveal className="qms-hero-eyebrow">
            <HandDrawnChilli />
            <span>Kodagu · Small batch · No preservatives</span>
          </div>

          <h1 id="qms-hero-title" className="qms-hero-title">
            <span className="qms-hero-title-clip">
              <span data-hero-title-line>Ground with</span>
            </span>
            <span className="qms-hero-title-clip">
              <span data-hero-title-line>memory. Built</span>
            </span>
            <span className="qms-hero-title-clip">
              <span data-hero-title-line>for fire.</span>
            </span>
          </h1>
        </div>

        <div
          data-living-stage
          className="qms-living-stage"
          onPointerDownCapture={handlePointerDownCapture}
          onPointerMoveCapture={handlePointerMoveCapture}
          onPointerUpCapture={handlePointerUpCapture}
          onPointerCancel={() => {
            gestureRef.current = null
          }}
        >
          <div className="qms-hero-stage-index" aria-hidden="true">
            <span>01 / Living pouch</span>
            <span>Chicken kebab masala</span>
          </div>

          <div className="qms-pouch-axis qms-pouch-axis-one" aria-hidden="true" />
          <div className="qms-pouch-axis qms-pouch-axis-two" aria-hidden="true" />
          <div className="qms-pouch-aura" aria-hidden="true" />
          <div className="qms-pouch-shadow" aria-hidden="true" />

          <div
            className={`qms-living-pouch-frame ${webglReady ? 'is-webgl-ready' : ''}`}
            role="img"
            aria-label="Interactive Qureshi's Chicken Kebab Masala pouch"
          >
            <div data-static-pouch className="qms-static-pouch">
              <Image
                src="/images/Kebab Masala.png"
                alt="Qureshi's Chicken Kebab Masala pouch"
                fill
                sizes="(max-width: 899px) 74vw, 38vw"
                className="object-contain"
                priority
              />
            </div>

            {canUse3D ? (
              <Hero3DErrorBoundary onError={disable3D}>
                <LivingPouchScene
                  burstSignal={burstSignal}
                  isLight={isLight}
                  onReady={() => setWebglReady(true)}
                  particleLimit={particleLimit}
                  scrollProgressRef={scrollProgressRef}
                />
              </Hero3DErrorBoundary>
            ) : null}
          </div>

          <button
            type="button"
            className="qms-pouch-shake"
            onPointerDown={(event) => event.stopPropagation()}
            onPointerUp={(event) => event.stopPropagation()}
            onClick={triggerBurst}
            disabled={!canUse3D}
          >
            <span className="qms-pouch-shake-grains" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            {canUse3D ? 'Tap to release spice' : 'Interactive view loading'}
          </button>

          <p className="qms-pouch-instruction" aria-hidden="true">
            <span>Drag to rotate</span>
            <span>Quick shake releases spice</span>
          </p>
          <div className="sr-only" aria-live="polite">
            {announcement}
          </div>
        </div>

        <div className="qms-hero-support">
          <p data-hero-reveal className="qms-hero-lede">
            Qureshi family blends, freshly ground in small batches—made to turn
            everyday cooking into the dish everyone remembers.
          </p>

          <div data-hero-reveal className="qms-hero-actions">
            <Link href="/shop" className="qms-hero-primary">
              Shop the spice table
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
            <Link href="/our-story" className="qms-hero-secondary">
              Read our story
              <ArrowDownRight size={17} aria-hidden="true" />
            </Link>
          </div>

          <div data-hero-reveal className="qms-hero-ledger" aria-label="Product facts">
            <span>
              <b>20</b>
              signature blends
            </span>
            <span>
              <b>100%</b>
              natural
            </span>
            <span>
              <b>0</b>
              preservatives
            </span>
          </div>
        </div>
      </div>

      <div className="qms-hero-origin-stamp" aria-hidden="true">
        <span>GROUND FRESH</span>
        <b>KODAGU</b>
        <span>QMS / BATCH 26</span>
      </div>

      <div className="qms-hero-torn-edge" aria-hidden="true" />
    </section>
  )
}
