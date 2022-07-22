import React, { useEffect } from 'react'
import RNMailModule, { Counter } from 'react-native-mail'

const App = () => {
  useEffect(() => {
    console.log(RNMailModule)
  })

  return <Counter />
}

export default App
