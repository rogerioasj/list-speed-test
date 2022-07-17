// token: agllzvqap4yzzjf8w5t19wexqawhvla5u0h0poif
// url: https://api.json-generator.com/templates/rMum_X1PMGd_/data


import { useState } from 'react'

function App() {

  const [objectList, setObjectList] = useState({})
  const [arrayList, setArrayList] = useState<ListItem[]>([])
  const [mapList, setMapList] = useState(new Map())
  const [setList, setSetList] = useState(new Set())

  const [objectListLoadingSpeed, setObjectListLoadingSpeed] = useState(0)
  const [arrayListLoadingSpeed, setArrayListLoadingSpeed] = useState(0)
  const [mapListLoadingSpeed, setMapListLoadingSpeed] = useState(0)
  const [setListLoadingSpeed, setSetListLoadingSpeed] = useState(0)

  type ListItem = {
    id: number,
    name: string,
    age: number,
    isMarried: boolean,
    children: [{
      id: number,
      name: string,
      age: number,
    }]
  }

  function mesureSpeed(start: number) {
    const elapsedTime = performance.now() - start
    return elapsedTime
  }

  function populateObjectList(item: ListItem) {
    setObjectList((prevState) => {
      return {
        ...prevState,
        [item.id]: item
      }
    })
  }

  function populateArrayList(item: ListItem) {
    setArrayList((prevState) => [...prevState, item])
  }

  function populateMapList(item: ListItem) {
    setMapList((prevState) => {
      return new Map(prevState).set(item.id, item)
    })
  }

  function populateSetList(item: ListItem) {
    setSetList((prevState) => {
      return new Set(prevState).add(item)
    })
  }

  async function populate() {
    const response = await fetch('https://api.json-generator.com/templates/rMum_X1PMGd_/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'bearer agllzvqap4yzzjf8w5t19wexqawhvla5u0h0poif'
      }
    })
    const data: ListItem[] = await response.json()
    console.dir(data)

          //populateMapList(item)
      //populateSetList(item)

    let start = performance.now()
    data.forEach(item => {
      populateObjectList(item)
    })
    setObjectListLoadingSpeed(mesureSpeed(start))
    
    start = performance.now()
    data.forEach(item => {
      populateArrayList(item)
    })
    setArrayListLoadingSpeed(mesureSpeed(start))

    start = performance.now()
    data.forEach(item => {
      populateMapList(item)
    })
    setMapListLoadingSpeed(mesureSpeed(start))

    start = performance.now()
    data.forEach(item => {
      populateSetList(item)
    })
    setSetListLoadingSpeed(mesureSpeed(start))
  }

  return (
    <> 
      <button onClick={populate}>Populate</button><br />
      objectList Loading Speed: {objectListLoadingSpeed}ms <br />
      arrayList Loading Speed: {arrayListLoadingSpeed}ms <br />
      mapList Loading Speed: {mapListLoadingSpeed}ms <br />
      setList Loading Speed: {setListLoadingSpeed}ms <br />
    </>
  )
}

export default App
