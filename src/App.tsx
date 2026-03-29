import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { HeartScene } from './components/canvas/HeartScene'
import { PostProcessing } from './components/canvas/PostProcessing'
import { HUD } from './components/ui/HUD'
import { ErrorBoundary } from './components/ErrorBoundary'
import './App.css'

export default function App() {
  return (
    <div className="app">
      <div className="title-block">
        <h1>Human Heart</h1>
        <div className="subtitle">Interactive Cardiac Anatomy</div>
      </div>
      <ErrorBoundary>
        <Canvas
          gl={{ antialias: true, powerPreference: 'high-performance' }}
          dpr={[1, 2]}
          shadows
          camera={{ fov: 40, near: 0.1, far: 100, position: [0, 0, 5] }}
        >
          <Suspense fallback={null}>
            <color attach="background" args={['#0a0c12']} />
            <fog attach="fog" args={['#0a0c12', 8, 20]} />
            <HeartScene />
            <PostProcessing />
          </Suspense>
        </Canvas>
      </ErrorBoundary>
      <HUD />
    </div>
  )
}
