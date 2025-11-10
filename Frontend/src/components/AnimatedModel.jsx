import React, { useEffect } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'

useGLTF.preload(import.meta.env.BASE_URL + 'doll.glb')

export default function AnimatedModel(props) {
  const { scene, animations } = useGLTF(import.meta.env.BASE_URL + 'doll.glb')
  const { actions } = useAnimations(animations, scene)


  useEffect(() => {

    
    // Test: spela första tillgängliga animation
    const first = Object.values(actions)[0]
    if (first) {
      first.reset().fadeIn(0).play()
    
    } else {
    
    }
  }, [actions, animations])


  return <primitive object={scene} {...props} />
}
