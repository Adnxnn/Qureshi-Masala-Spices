'use client'

import { useEffect, useMemo, useRef } from 'react'
import type { MutableRefObject } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { ContactShadows, PresentationControls, RoundedBox, useTexture } from '@react-three/drei'
import * as THREE from 'three'

const POUCH_TEXTURE = '/images/Kebab Masala.png'
const SPICE_COLOURS = ['#C1121F', '#E8A317', '#7A2E1D']

type LivingPouchSceneProps = {
  burstSignal: number
  isLight: boolean
  onReady: () => void
  particleLimit: number
  scrollProgressRef: MutableRefObject<number>
}

type SceneProps = LivingPouchSceneProps

function seededValue(index: number, salt: number) {
  const value = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453
  return value - Math.floor(value)
}

function SpiceBurst({
  signal,
  limit,
}: {
  signal: number
  limit: number
}) {
  const pointsRef = useRef<THREE.Points>(null)
  const materialRef = useRef<THREE.PointsMaterial>(null)
  const velocityRef = useRef(new Float32Array(limit * 3))
  const elapsedRef = useRef(10)

  const positions = useMemo(() => {
    const array = new Float32Array(limit * 3)
    for (let index = 0; index < limit; index += 1) {
      array[index * 3 + 1] = -20
    }
    return array
  }, [limit])

  const colours = useMemo(() => {
    const array = new Float32Array(limit * 3)
    for (let index = 0; index < limit; index += 1) {
      const colour = new THREE.Color(SPICE_COLOURS[index % SPICE_COLOURS.length])
      array[index * 3] = colour.r
      array[index * 3 + 1] = colour.g
      array[index * 3 + 2] = colour.b
    }
    return array
  }, [limit])

  useEffect(() => {
    if (signal < 1 || !pointsRef.current) return

    const velocity = velocityRef.current
    const positionAttribute = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute

    for (let index = 0; index < limit; index += 1) {
      const offset = index * 3
      const spread = seededValue(index, signal + 1)
      const lift = seededValue(index, signal + 2)
      const depth = seededValue(index, signal + 3)

      positions[offset] = (spread - 0.5) * 0.52
      positions[offset + 1] = 1.34 + lift * 0.18
      positions[offset + 2] = 0.16 + depth * 0.28

      velocity[offset] = (spread - 0.5) * 2.6
      velocity[offset + 1] = 0.9 + lift * 1.9
      velocity[offset + 2] = 0.2 + depth * 1.35
    }

    positionAttribute.needsUpdate = true
    elapsedRef.current = 0
  }, [limit, positions, signal])

  useFrame((_, delta) => {
    const points = pointsRef.current
    const material = materialRef.current
    if (!points || !material || elapsedRef.current > 2.2) return

    const step = Math.min(delta, 0.034)
    const positionAttribute = points.geometry.attributes.position as THREE.BufferAttribute
    const velocity = velocityRef.current

    elapsedRef.current += step

    for (let index = 0; index < limit; index += 1) {
      const offset = index * 3
      velocity[offset] *= 0.985
      velocity[offset + 1] -= 1.65 * step
      velocity[offset + 2] *= 0.98

      positions[offset] += velocity[offset] * step
      positions[offset + 1] += velocity[offset + 1] * step
      positions[offset + 2] += velocity[offset + 2] * step
    }

    positionAttribute.needsUpdate = true
    material.opacity = THREE.MathUtils.clamp(1 - elapsedRef.current / 2.15, 0, 0.9)
  })

  return (
    <points ref={pointsRef} frustumCulled={false} renderOrder={8}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colours, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={0.075}
        sizeAttenuation
        transparent
        opacity={0}
        depthWrite={false}
        vertexColors
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

function ScrollSpill({
  scrollProgressRef,
}: {
  scrollProgressRef: MutableRefObject<number>
}) {
  const pointsRef = useRef<THREE.Points>(null)
  const materialRef = useRef<THREE.PointsMaterial>(null)
  const particleCount = 32

  const positions = useMemo(() => {
    const array = new Float32Array(particleCount * 3)
    for (let index = 0; index < particleCount; index += 1) {
      const offset = index * 3
      const lane = seededValue(index, 11)
      const fall = seededValue(index, 12)
      const depth = seededValue(index, 13)
      array[offset] = (lane - 0.5) * (0.35 + fall * 0.5)
      array[offset + 1] = 1.28 - fall * 2.2
      array[offset + 2] = 0.22 + depth * 0.28
    }
    return array
  }, [])

  const colours = useMemo(() => {
    const array = new Float32Array(particleCount * 3)
    for (let index = 0; index < particleCount; index += 1) {
      const colour = new THREE.Color(SPICE_COLOURS[index % SPICE_COLOURS.length])
      array[index * 3] = colour.r
      array[index * 3 + 1] = colour.g
      array[index * 3 + 2] = colour.b
    }
    return array
  }, [])

  useFrame(({ clock }) => {
    const points = pointsRef.current
    const material = materialRef.current
    if (!points || !material) return

    const progress = scrollProgressRef.current
    const visibleProgress = THREE.MathUtils.smoothstep(progress, 0.18, 0.78)
    material.opacity = visibleProgress * 0.68
    points.scale.y = 0.24 + visibleProgress * 0.9
    points.position.y = Math.sin(clock.elapsedTime * 1.5) * 0.025 * visibleProgress
  })

  return (
    <points ref={pointsRef} frustumCulled={false} renderOrder={7}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colours, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={0.048}
        sizeAttenuation
        transparent
        opacity={0}
        depthWrite={false}
        vertexColors
      />
    </points>
  )
}

function Pouch({
  burstSignal,
  onReady,
  particleLimit,
  scrollProgressRef,
}: Omit<SceneProps, 'isLight'>) {
  const motionGroupRef = useRef<THREE.Group>(null)
  const sealRef = useRef<THREE.Mesh>(null)
  const readyRef = useRef(false)
  const texture = useTexture(POUCH_TEXTURE)
  const { size } = useThree()

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = 4
    texture.needsUpdate = true

    if (!readyRef.current) {
      readyRef.current = true
      onReady()
    }
  }, [onReady, texture])

  useFrame(({ clock }, delta) => {
    const motionGroup = motionGroupRef.current
    const seal = sealRef.current
    if (!motionGroup || !seal) return

    const progress = scrollProgressRef.current
    const responsiveScale = size.width < 640 ? 1.02 : size.width < 1024 ? 1 : 1.04
    const settle = 1 - Math.pow(0.001, Math.min(delta, 0.05))

    motionGroup.rotation.x = THREE.MathUtils.lerp(
      motionGroup.rotation.x,
      -0.035 + progress * 0.18,
      settle,
    )
    motionGroup.rotation.z = THREE.MathUtils.lerp(
      motionGroup.rotation.z,
      Math.sin(clock.elapsedTime * 0.72) * 0.012 - progress * 0.025,
      settle,
    )
    motionGroup.position.y = THREE.MathUtils.lerp(
      motionGroup.position.y,
      Math.sin(clock.elapsedTime * 0.85) * 0.035 - progress * 0.2,
      settle,
    )
    motionGroup.scale.setScalar(
      THREE.MathUtils.lerp(motionGroup.scale.x, responsiveScale * (1 - progress * 0.035), settle),
    )

    seal.rotation.x = THREE.MathUtils.lerp(seal.rotation.x, -progress * 0.82, settle)
    seal.position.y = THREE.MathUtils.lerp(seal.position.y, 1.31 + progress * 0.12, settle)
    seal.position.z = THREE.MathUtils.lerp(seal.position.z, 0.02 + progress * 0.2, settle)
  })

  return (
    <group ref={motionGroupRef}>
      <PresentationControls
        global
        cursor
        snap={{ mass: 1, tension: 220, friction: 26 }}
        speed={1.1}
        zoom={1}
        rotation={[0.02, -0.16, -0.01]}
        polar={[-0.22, 0.24]}
        azimuth={[-0.72, 0.72]}
      >
        <group>
          <RoundedBox args={[2.04, 2.76, 0.2]} radius={0.12} smoothness={5}>
            <meshStandardMaterial color="#21100d" roughness={0.72} metalness={0.08} />
          </RoundedBox>

          <mesh position={[0, 0, 0.111]} renderOrder={3}>
            <planeGeometry args={[2.3, 3.067, 1, 1]} />
            <meshPhysicalMaterial
              map={texture}
              transparent
              alphaTest={0.025}
              roughness={0.48}
              metalness={0.04}
              clearcoat={0.18}
              clearcoatRoughness={0.68}
              side={THREE.DoubleSide}
            />
          </mesh>

          <mesh position={[0, 0, -0.111]} rotation={[0, Math.PI, 0]} renderOrder={2}>
            <planeGeometry args={[2.3, 3.067, 1, 1]} />
            <meshStandardMaterial
              map={texture}
              transparent
              alphaTest={0.025}
              roughness={0.76}
              color="#6e4d45"
              side={THREE.DoubleSide}
            />
          </mesh>

          <mesh ref={sealRef} position={[0, 1.31, 0.02]} renderOrder={5}>
            <boxGeometry args={[1.94, 0.08, 0.23]} />
            <meshPhysicalMaterial
              color="#17100f"
              roughness={0.5}
              metalness={0.08}
              clearcoat={0.12}
            />
          </mesh>

          <SpiceBurst signal={burstSignal} limit={particleLimit} />
          <ScrollSpill scrollProgressRef={scrollProgressRef} />
        </group>
      </PresentationControls>
    </group>
  )
}

function Scene(props: SceneProps) {
  return (
    <>
      <ambientLight intensity={props.isLight ? 1.5 : 1.05} />
      <spotLight
        position={[-3.6, 4.5, 5.5]}
        angle={0.46}
        penumbra={0.95}
        intensity={props.isLight ? 3.8 : 5.1}
        color={props.isLight ? '#fff4db' : '#ffd99a'}
      />
      <pointLight position={[3.5, 1.2, 3.2]} intensity={4.6} color="#C1121F" />
      <pointLight position={[-3, -0.8, 2.2]} intensity={3.2} color="#E8A317" />

      <Pouch
        burstSignal={props.burstSignal}
        onReady={props.onReady}
        particleLimit={props.particleLimit}
        scrollProgressRef={props.scrollProgressRef}
      />

      <ContactShadows
        position={[0, -1.65, 0]}
        opacity={props.isLight ? 0.24 : 0.42}
        scale={4.8}
        blur={2.8}
        far={3.5}
        color={props.isLight ? '#7A2E1D' : '#050201'}
        frames={1}
      />
    </>
  )
}

export default function LivingPouchScene(props: LivingPouchSceneProps) {
  return (
    <Canvas
      className="qms-living-pouch-canvas"
      camera={{ position: [0, 0.02, 5.35], fov: 34, near: 0.1, far: 50 }}
      dpr={[1, 1.5]}
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
        preserveDrawingBuffer: false,
      }}
      onCreated={({ gl }) => {
        gl.outputColorSpace = THREE.SRGBColorSpace
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = props.isLight ? 1.04 : 1.14
      }}
    >
      <Scene {...props} />
    </Canvas>
  )
}

useTexture.preload(POUCH_TEXTURE)
