'use client'

import { useRef } from 'react'
import { usePathname } from 'next/navigation'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP, ScrollTrigger)

export default function CinematicMotion() {
  const anchorRef = useRef<HTMLDivElement>(null)
  const meterRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  useGSAP(
    () => {
      const root = anchorRef.current?.closest<HTMLElement>('.qms-public-shell')
      const meter = meterRef.current
      if (!root || !meter) return

      let active = true
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

          gsap.set(meter, { scaleX: reduceMotion ? 1 : 0, transformOrigin: 'left center' })

          if (!reduceMotion) {
            gsap.to(meter, {
              scaleX: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: root,
                start: 'top top',
                end: 'bottom bottom',
                scrub: desktop ? 0.35 : true,
              },
            })

            const sections = Array.from(
              root.querySelectorAll<HTMLElement>(
                'main section:not(.qms-hero), main > .royal-page, main > .qms-cinematic-page',
              ),
            ).slice(0, 28)

            sections.forEach((section) => {
              gsap.fromTo(
                section,
                {
                  y: desktop ? 28 : 14,
                  autoAlpha: 0,
                },
                {
                  y: 0,
                  autoAlpha: 1,
                  duration: desktop ? 0.78 : 0.56,
                  ease: 'power3.out',
                  clearProps: 'transform,opacity,visibility',
                  scrollTrigger: {
                    trigger: section,
                    start: desktop ? 'top 88%' : 'top 93%',
                    once: true,
                  },
                },
              )
            })
          }

          const refresh = () => {
            if (active) ScrollTrigger.refresh()
          }

          const frame = window.requestAnimationFrame(refresh)
          document.fonts?.ready.then(refresh)

          return () => window.cancelAnimationFrame(frame)
        },
      )

      return () => {
        active = false
        mm.revert()
      }
    },
    { dependencies: [pathname], revertOnUpdate: true },
  )

  return (
    <div ref={anchorRef} aria-hidden="true">
      <div ref={meterRef} className="qms-scroll-meter" />
    </div>
  )
}
