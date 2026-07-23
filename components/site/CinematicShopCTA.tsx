'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import type { Product } from '@/types'

gsap.registerPlugin(useGSAP)

const stagePositions = [
  'left-[2%] top-[20%] z-10 -rotate-[10deg] scale-[0.82] opacity-75 sm:left-[4%]',
  'left-1/2 top-[5%] z-30 -translate-x-1/2 scale-100',
  'right-[2%] top-[20%] z-20 rotate-[10deg] scale-[0.82] opacity-80 sm:right-[4%]',
]

export default function CinematicShopCTA({ products }: { products: Product[] }) {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const stage = stageRef.current
    const glow = glowRef.current
    if (!stage || !glow) return

    const layers = Array.from(stage.querySelectorAll<HTMLElement>('[data-depth]'))
    const media = gsap.matchMedia()

    media.add(
      {
        desktop: '(min-width: 768px)',
        reducedMotion: '(prefers-reduced-motion: reduce)',
      },
      (context) => {
        const { desktop, reducedMotion } = context.conditions as {
          desktop: boolean
          reducedMotion: boolean
        }

        if (!desktop || reducedMotion) return

        const layerMotion = layers.map((layer) => ({
          depth: Number(layer.dataset.depth || 1),
          x: gsap.quickTo(layer, 'x', { duration: 0.65, ease: 'power3.out' }),
          y: gsap.quickTo(layer, 'y', { duration: 0.65, ease: 'power3.out' }),
          rotationX: gsap.quickTo(layer, 'rotationX', { duration: 0.75, ease: 'power3.out' }),
          rotationY: gsap.quickTo(layer, 'rotationY', { duration: 0.75, ease: 'power3.out' }),
        }))
        const glowX = gsap.quickTo(glow, 'x', { duration: 0.8, ease: 'power3.out' })
        const glowY = gsap.quickTo(glow, 'y', { duration: 0.8, ease: 'power3.out' })

        const move = (event: PointerEvent) => {
          const bounds = stage.getBoundingClientRect()
          const x = (event.clientX - bounds.left) / bounds.width - 0.5
          const y = (event.clientY - bounds.top) / bounds.height - 0.5

          layerMotion.forEach((motion) => {
            motion.x(x * 11 * motion.depth)
            motion.y(y * 8 * motion.depth)
            motion.rotationY(x * 3.5 * motion.depth)
            motion.rotationX(y * -2.5 * motion.depth)
          })
          glowX(x * 34)
          glowY(y * 24)
        }

        const reset = () => {
          layerMotion.forEach((motion) => {
            motion.x(0)
            motion.y(0)
            motion.rotationX(0)
            motion.rotationY(0)
          })
          glowX(0)
          glowY(0)
        }

        stage.addEventListener('pointermove', move)
        stage.addEventListener('pointerleave', reset)

        return () => {
          stage.removeEventListener('pointermove', move)
          stage.removeEventListener('pointerleave', reset)
        }
      },
    )

    return () => media.revert()
  }, { scope: sectionRef })

  return (
    <section
      ref={sectionRef}
      className="cinematic-shop-cta relative isolate overflow-hidden border-y border-white/[0.07] bg-[#090908] px-4 py-20 sm:px-8 sm:py-28 lg:py-32"
    >
      <div className="pointer-events-none absolute inset-0 opacity-70" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_45%,rgba(199,161,90,0.08),transparent_25rem),radial-gradient(circle_at_82%_58%,rgba(91,23,24,0.13),transparent_30rem)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        <div className="cinematic-cta-grid absolute inset-0" />
      </div>

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[0.88fr_1.12fr] lg:gap-10">
        <div className="relative z-20 max-w-2xl text-left">
          <p className="royal-eyebrow mb-5">From Kodagu to your kitchen</p>
          <h2 className="royal-title text-[3.35rem] leading-[0.9] sm:text-7xl lg:text-[5.6rem]">
            Bring the flavour<br />home today.
          </h2>
          <p className="mt-6 max-w-xl text-sm leading-7 text-cream/[0.58] sm:text-base">
            Small-batch masalas, freshly ground and blended with the depth of recipes carried through generations.
          </p>

          <div className="mt-8 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <Link href="/shop" className="royal-button group">
              Shop the full range
              <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
            <span className="text-[10px] uppercase tracking-[0.23em] text-cream/[0.34]">
              20 handcrafted blends · No preservatives
            </span>
          </div>
        </div>

        <div
          ref={stageRef}
          className="relative mx-auto h-[330px] w-full max-w-[560px] [perspective:1100px] sm:h-[430px] lg:h-[500px] lg:max-w-[650px]"
          aria-label="Selected Qureshi's masala pouches"
        >
          <div
            ref={glowRef}
            className="pointer-events-none absolute left-[15%] top-[25%] h-[44%] w-[70%] rounded-full bg-gold/[0.075] blur-[55px] will-change-transform"
            aria-hidden="true"
          />

          <div className="pointer-events-none absolute bottom-[9%] left-1/2 h-[13%] w-[78%] -translate-x-1/2 rounded-[50%] bg-black/70 shadow-[0_26px_80px_rgba(0,0,0,0.82)]" aria-hidden="true" />
          <div className="pointer-events-none absolute bottom-[14%] left-1/2 h-px w-[64%] -translate-x-1/2 bg-gradient-to-r from-transparent via-gold/25 to-transparent" aria-hidden="true" />

          {products.map((product, index) => (
            <div
              key={product.id}
              className={`absolute h-[72%] w-[48%] origin-bottom transform-gpu ${stagePositions[index] || stagePositions[1]}`}
            >
              <div
                data-depth={index === 1 ? '1.25' : '0.75'}
                className="relative h-full w-full transform-gpu will-change-transform"
              >
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  sizes="(max-width: 640px) 44vw, (max-width: 1024px) 240px, 290px"
                  className="object-contain drop-shadow-[0_34px_34px_rgba(0,0,0,0.62)]"
                />
              </div>
            </div>
          ))}

          <div className="pointer-events-none absolute bottom-[2%] right-[2%] hidden border-l border-white/10 pl-4 text-[9px] uppercase leading-5 tracking-[0.2em] text-cream/[0.3] sm:block" aria-hidden="true">
            Move to explore<br />the collection
          </div>
        </div>
      </div>
    </section>
  )
}
