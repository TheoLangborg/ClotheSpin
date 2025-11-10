import React, { useEffect } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'

useGLTF.preload(import.meta.env.BASE_URL + 'doll.glb')

export default function AnimatedModel(props) {
  const { scene, animations } = useGLTF(import.meta.env.BASE_URL + 'doll.glb')
  const { actions } = useAnimations(animations, scene)


  useEffect(() => {

    // Lista alla animationer som laddades från modellen
    console.log('🧩 Animationer i GLB-filen:', animations.map(a => a.name))

    // Lista alla actions (animationer kopplade till scenen)
    console.log('🎬 Actions:', Object.keys(actions))

    // Ser vilken URL som används
    console.log("🌐 GLB path:", import.meta.env.BASE_URL + 'doll.glb')

    // Test: spela första tillgängliga animation
    const first = Object.values(actions)[0]
    if (first) {
      first.reset().fadeIn(0).play()
      console.log(' Spelar:', first)
    } else {
      console.warn(' Ingen animation hittad i actions.')
    }
  }, [actions, animations])


  return <primitive object={scene} {...props} />
}
