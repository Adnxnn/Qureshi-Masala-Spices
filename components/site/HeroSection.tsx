'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowDownRight, ArrowRight } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP)

export default function HeroSection() {
  const rootRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const root = rootRef.current
      const stage = stageRef.current
      if (!root || !stage) return

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

          if (!reduceMotion) {
            gsap
              .timeline({ defaults: { ease: 'power3.out' } })
              .from('[data-hero-copy]', {
                y: 24,
                autoAlpha: 0,
                duration: 0.8,
                stagger: 0.08,
              })
              .from(
                '[data-pouch]',
                {
                  y: 42,
                  rotation: (index) => (index - 1) * 5,
                  autoAlpha: 0,
                  duration: 1,
                  stagger: 0.12,
                },
                '-=0.56',
              )
          }

          if (!desktop || reduceMotion) return

          const rotateX = gsap.quickTo(stage, 'rotationX', {
            duration: 0.65,
            ease: 'power3.out',
          })
          const rotateY = gsap.quickTo(stage, 'rotationY', {
            duration: 0.65,
            ease: 'power3.out',
          })
          const moveFrontX = gsap.quickTo('[data-pouch="front"]', 'x', {
            duration: 0.7,
            ease: 'power3.out',
          })
          const moveFrontY = gsap.quickTo('[data-pouch="front"]', 'y', {
            duration: 0.7,
            ease: 'power3.out',
          })
          const moveSidesX = gsap.quickTo('[data-pouch-side]', 'x', {
            duration: 0.85,
            ease: 'power3.out',
          })

          const onPointerMove = (event: PointerEvent) => {
            const bounds = root.getBoundingClientRect()
            const x = (event.clientX - bounds.left) / bounds.width - 0.5
            const y = (event.clientY - bounds.top) / bounds.height - 0.5

            rotateY(x * 6)
            rotateX(y * -4)
            moveFrontX(x * 14)
            moveFrontY(y * 10)
            moveSidesX(x * -9)
          }

          const onPointerLeave = () => {
            rotateX(0)
            rotateY(0)
            moveFrontX(0)
            moveFrontY(0)
            moveSidesX(0)
          }

          root.addEventListener('pointermove', onPointerMove)
          root.addEventListener('pointerleave', onPointerLeave)

          return () => {
            root.removeEventListener('pointermove', onPointerMove)
            root.removeEventListener('pointerleave', onPointerLeave)
          }
        },
      )

      return () => mm.revert()
    },
    { scope: rootRef },
  )

  return (
    <section
      ref={rootRef}
      className="royal-grain relative isolate min-h-[calc(100svh-72px)] overflow-hidden border-b border-gold/15 bg-black sm:min-h-[calc(100svh-88px)]"
    >
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 -z-30 h-full w-full object-cover opacity-[0.18] saturate-[0.72]"
        aria-hidden="true"
      >
        <source src="/images/Background01.MP4" type="video/mp4" />
      </video>

      <div
        className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_70%_42%,rgba(91,23,24,0.42),transparent_31rem),linear-gradient(90deg,rgba(8,7,5,0.98)_0%,rgba(8,7,5,0.80)_43%,rgba(8,7,5,0.38)_72%,rgba(8,7,5,0.88)_100%)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-black to-transparent"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -left-3 top-1/2 -z-10 hidden -translate-y-1/2 select-none font-display text-[clamp(7rem,15vw,15rem)] font-semibold uppercase leading-none tracking-[-0.06em] text-transparent xl:block"
        style={{ WebkitTextStroke: '1px rgba(224,200,137,0.09)' }}
        aria-hidden="true"
      >
        Qureshi&apos;s
      </div>

      <div className="mx-auto grid min-h-[calc(100svh-72px)] max-w-[1480px] grid-cols-1 items-center gap-4 px-5 py-12 sm:min-h-[calc(100svh-88px)] sm:px-8 lg:grid-cols-12 lg:gap-0 lg:px-12 xl:px-16">
        <div className="relative z-20 order-2 pb-4 text-center lg:order-1 lg:col-span-5 lg:pb-0 lg:text-left">
          <div data-hero-copy className="royal-eyebrow mb-5 flex items-center justify-center gap-3 lg:justify-start">
            <span className="h-px w-9 bg-gold/70" aria-hidden="true" />
            Blended in Kodagu · Crafted in small batches
          </div>

          <h1
            data-hero-copy
            className="royal-title mx-auto max-w-[11ch] text-[clamp(3.35rem,8.5vw,7.2rem)] lg:mx-0"
          >
            A legacy,
            <span className="block text-gold-light">sealed in spice.</span>
          </h1>

          <p
            data-hero-copy
            className="mx-auto mt-6 max-w-xl text-sm leading-7 text-cream/68 sm:text-base sm:leading-8 lg:mx-0 lg:max-w-lg"
          >
            Authentic masalas shaped by heritage recipes, freshly ground ingredients,
            and the uncompromising flavour of home.
          </p>

          <div
            data-hero-copy
            className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center lg:justify-start"
          >
            <Link href="/shop" className="royal-button group sm:min-w-48">
              Explore the collection
              <ArrowRight
                size={15}
                className="transition-transform duration-200 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
            <Link href="/#heritage" className="royal-button-secondary group sm:min-w-40">
              Our heritage
              <ArrowDownRight
                size={15}
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:translate-y-0.5"
                aria-hidden="true"
              />
            </Link>
          </div>

          <dl
            data-hero-copy
            className="mx-auto mt-9 grid max-w-lg grid-cols-3 border-y border-gold/15 py-4 text-left lg:mx-0"
          >
            {[
              ['100%', 'Natural'],
              ['Zero', 'Preservatives'],
              ['20', 'Signature blends'],
            ].map(([value, label], index) => (
              <div
                key={label}
                className={`px-3 first:pl-0 lg:px-5 lg:first:pl-0 ${index ? 'border-l border-gold/15' : ''}`}
              >
                <dt className="font-display text-2xl font-semibold leading-none text-cream sm:text-3xl">
                  {value}
                </dt>
                <dd className="mt-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-cream/42 sm:text-[10px]">
                  {label}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative order-1 h-[48svh] min-h-[340px] lg:order-2 lg:col-span-7 lg:h-[min(76svh,780px)]">
          <div className="absolute right-0 top-4 z-20 hidden items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-cream/40 lg:flex">
            <span>Move to explore</span>
            <span className="h-px w-10 bg-gold/45" aria-hidden="true" />
          </div>

          <div
            ref={stageRef}
            className="absolute inset-0 [perspective:1300px] [transform-style:preserve-3d] will-change-transform"
          >
            <div
              className="absolute bottom-[8%] left-1/2 h-[21%] w-[78%] -translate-x-1/2 rounded-[50%] border border-gold/15 bg-[radial-gradient(ellipse_at_center,rgba(199,161,90,0.22),rgba(91,23,24,0.14)_38%,transparent_72%)] blur-[0.2px]"
              aria-hidden="true"
            />
            <div
              className="absolute bottom-[11%] left-1/2 h-px w-[62%] -translate-x-1/2 bg-gradient-to-r from-transparent via-gold/55 to-transparent"
              aria-hidden="true"
            />

            <div
              data-pouch="left"
              data-pouch-side
              className="absolute bottom-[12%] left-[4%] z-10 h-[61%] w-[41%] opacity-90 [transform-style:preserve-3d] will-change-transform sm:left-[8%]"
            >
              <div className="relative h-full w-full [transform:translateZ(-28px)_rotate(-7deg)]">
                <Image
                  src="/images/Biryani Masala.png"
                  alt="Qureshi's Biryani Masala pouch"
                  fill
                  sizes="(max-width: 900px) 42vw, 28vw"
                  className="object-contain drop-shadow-[0_34px_36px_rgba(0,0,0,0.62)]"
                  priority
                />
              </div>
            </div>

            <div
              data-pouch="right"
              data-pouch-side
              className="absolute bottom-[12%] right-[2%] z-10 h-[61%] w-[41%] opacity-90 [transform-style:preserve-3d] will-change-transform sm:right-[6%]"
            >
              <div className="relative h-full w-full [transform:translateZ(-24px)_rotate(7deg)]">
                <Image
                  src="/images/Green Chicken Masala.png"
                  alt="Qureshi's Green Chicken Kebab Masala pouch"
                  fill
                  sizes="(max-width: 900px) 42vw, 28vw"
                  className="object-contain drop-shadow-[0_34px_36px_rgba(0,0,0,0.62)]"
                  priority
                />
              </div>
            </div>

            <div className="absolute bottom-[7%] left-1/2 z-20 h-[76%] w-[51%] -translate-x-1/2 [transform-style:preserve-3d]">
              <div
                data-pouch="front"
                className="relative h-full w-full [transform-style:preserve-3d] will-change-transform"
              >
                <div className="relative h-full w-full [transform:translateZ(52px)]">
                  <Image
                    src="/images/Kebab Masala.png"
                    alt="Qureshi's Chicken Kebab Masala pouch"
                    fill
                    sizes="(max-width: 900px) 52vw, 34vw"
                    className="object-contain drop-shadow-[0_42px_44px_rgba(0,0,0,0.74)]"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-[5%] right-0 z-30 hidden max-w-[13rem] border-l border-gold/35 pl-4 text-[10px] uppercase leading-5 tracking-[0.16em] text-cream/42 xl:block">
            Real Qureshi&apos;s pouches
            <span className="block text-gold-light/80">No decorative mockups</span>
          </div>
        </div>
      </div>
    </section>
  )
}
