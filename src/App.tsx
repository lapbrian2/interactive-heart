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
      <ErrorBoundary>
        <Canvas
          gl={{ antialias: true, powerPreference: 'high-performance' }}
          dpr={[1, 2]}
          camera={{ fov: 45, near: 0.1, far: 100, position: [0, 0, 6] }}
        >
          <Suspense fallback={null}>
            <HeartScene />
            <PostProcessing />
          </Suspense>
        </Canvas>
      </ErrorBoundary>
      <HUD />
    </div>
  )
}
