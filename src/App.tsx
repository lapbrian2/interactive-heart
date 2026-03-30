import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { HeartScene } from './components/canvas/HeartScene'
import { PostProcessing } from './components/canvas/PostProcessing'
import { HUD } from './components/ui/HUD'
import { LoadingScreen } from './components/ui/LoadingScreen'
import { ErrorBoundary } from './components/ErrorBoundary'
import { IntroOverlay } from './components/ui/IntroOverlay'
import { KeyboardShortcuts } from './components/ui/KeyboardShortcuts'
import { SoundToggle } from './components/ui/SoundToggle'
import { DynamicTitle } from './components/ui/DynamicTitle'
import './App.css'

export default function App() {
  return (
    <div className="app">
      <div className="title-block">
        <h1>Human Heart</h1>
        <div className="subtitle">Interactive Cardiac Anatomy</div>
      </div>
      <div className="top-right-controls">
        <SoundToggle />
      </div>
      <ErrorBoundary>
        <Canvas
          gl={{ antialias: true, powerPreference: 'high-performance', localClippingEnabled: true }}
          dpr={[1, 2]}
          shadows
          camera={{ fov: 45, near: 0.1, far: 100, position: [0, 0.2, 3.5] }}
        >
          <Suspense fallback={null}>
            <color attach="background" args={['#0a0c12']} />
            <fog attach="fog" args={['#0a0c12', 8, 20]} />
            <HeartScene />
            <PostProcessing />
          </Suspense>
        </Canvas>
      </ErrorBoundary>
      <LoadingScreen />
      <HUD />
      <IntroOverlay />
      <KeyboardShortcuts />
      <DynamicTitle />
      <footer className="site-footer">
        <span>Built by Brian Lapinski</span>
        <span className="footer-sep">|</span>
        <span>Heart model CC-BY Mesh-Magnet via Sketchfab</span>
        <span className="footer-sep">|</span>
        <span>React Three Fiber + Three.js</span>
        <span className="footer-sep">|</span>
        <span>Space: pause | 1-7: phases | R: reset</span>
      </footer>
    </div>
  )
}
