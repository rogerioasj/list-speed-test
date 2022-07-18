import { useState, useRef } from 'react'

function App() {

  const [data, setData] = useState<ListItem[]>([])

  const [objectList, setObjectList] = useState<any>({})
  const [arrayList, setArrayList] = useState<ListItem[]>([])
  const [mapList, setMapList] = useState(new Map())
  const [setList, setSetList] = useState(new Set())

  const [objectListPerformance, setObjectListPerformance] = useState<ListPerformance>({loading: 0, deleting: 0, adding: 0, updating: 0})
  const [arrayListPerformance, setArrayListPerformance] = useState<ListPerformance>({loading: 0, deleting: 0, adding: 0, updating: 0})
  const [mapListPerformance, setMapListPerformance] = useState<ListPerformance>({loading: 0, deleting: 0, adding: 0, updating: 0})
  const [setListPerformance, setSetListPerformance] = useState<ListPerformance>({loading: 0, deleting: 0, adding: 0, updating: 0})

  const indexToDeleteInput = useRef<HTMLInputElement>(null)

  
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

  type ListPerformance = {
    loading: number,
    deleting: number,
    adding: number,
    updating: number
  }

  /**
   * Returns the difference between the current and last performance
   *
   * @param {number} currentPerformance
   * @return {number} 
   */
  function mesurePerformance(currentPerformance: number): number {
    const elapsedTime = performance.now() - currentPerformance
    return elapsedTime / 1000
  }

  /**
   * Fetches the data from the API and measure and call all the populate functions
   *
   */
  async function populate() {
    const response = await fetch('https://api.json-generator.com/templates/rMum_X1PMGd_/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'bearer agllzvqap4yzzjf8w5t19wexqawhvla5u0h0poif'
      }
    })
    
    setData(await response.json())

    if (data.length ===  0) 
      return

    let start = performance.now()
    data.forEach(item => {
      setObjectList((prevState: any) => {
        return {
          ...prevState,
          [item.id]: item
        }
      })
    })
    setObjectListPerformance(prevState => {
      prevState.loading = mesurePerformance(start)
      return prevState
    })
    
    start = performance.now()
    data.forEach(item => {
      setArrayList((prevState) => [...prevState, item])
    })
    setArrayListPerformance(prevState => {
      prevState.loading = mesurePerformance(start)
      return prevState
    })

    start = performance.now()
    data.forEach(item => {
      setMapList((prevState) => {
        return new Map(prevState).set(item.id, item)
      })
    })
    setMapListPerformance(prevState => {
      prevState.loading = mesurePerformance(start)
      return prevState
    })

    start = performance.now()
    data.forEach(item => {
      setSetList((prevState) => {
        return new Set(prevState).add(item)
      })
    })
    setSetListPerformance(prevState => {
      prevState.loading = mesurePerformance(start)
      return prevState
    })
  }

  function deleteRow() {
    if (!data || data.length === 0) {
      return
    }

    const index: any = indexToDeleteInput.current?.value
    const item = data[index ? index : 0]

    let start = performance.now()
    setObjectList((prevState: any) => {
      delete prevState[item.id]
      return {
        ...prevState
      }
    })
    setObjectListPerformance(prevState => {
      prevState.deleting = mesurePerformance(start)
      return prevState
    })

    start = performance.now()
    setArrayList((prevState) => {
      prevState.splice(index, 1)
      return [...prevState]
    })
    setArrayListPerformance(prevState => {
      prevState.deleting = mesurePerformance(start)
      return prevState
    })

    start = performance.now()
    setMapList((prevState) => {
      prevState.delete(item.id)
      return new Map(prevState)
    })
    setMapListPerformance(prevState => {
      prevState.deleting = mesurePerformance(start)
      return prevState
    })

    start = performance.now()
    setSetList((prevState) => {
      prevState.delete(item)
      return new Set(prevState)
    })
    setSetListPerformance(prevState => {
      prevState.deleting = mesurePerformance(start)
      return prevState
    })
  }

  return (
    <> 
      <button onClick={populate} className="py-2 pl-2 pr-2 bg-green-600 text-center text-white">Populate</button><br />
      <button onClick={() => deleteRow()} className="py-2 pl-2 pr-2 bg-red-600 text-center text-white">Delete element</button><input className="border-2" type="number" ref={indexToDeleteInput} id="indexToDeleteInput" defaultValue={0} />
      <table className="w-9/12">
        <thead>
          <tr>
            <th></th>
            <th>Object List</th>
            <th>Array List</th>
            <th>Map List</th>
            <th>Set List</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>First element</td>
            <td>{data && data.length > 0 ? JSON.stringify(objectList[Object.keys(objectList)[0]]) : ""}</td>
            <td>{data && data.length > 0 ? JSON.stringify(arrayList[0]) : ""}</td>
            <td>{data && data.length > 0 ? JSON.stringify(mapList.get(data[0].id)) : ""}</td>
            <td>{data && data.length > 0 ? JSON.stringify(setList.values().next().value) : ""}</td>
          </tr>
          <tr>
            <td>Loading Speed</td>
            <td>{objectListPerformance.loading || 0}ms</td>
            <td>{arrayListPerformance.loading || 0}ms</td>
            <td>{mapListPerformance.loading || 0}ms</td>
            <td>{setListPerformance.loading || 0}ms</td>
          </tr>
          <tr>
            <td>Deleting Speed</td>
            <td>{objectListPerformance.deleting || 0}ms</td>
            <td>{arrayListPerformance.deleting || 0}ms</td>
            <td>{mapListPerformance.deleting || 0}ms</td>
            <td>{setListPerformance.deleting || 0}ms</td>
          </tr>
          <tr>
            <td>Adding Speed</td>
            <td>{objectListPerformance.adding || 0}ms</td>
            <td>{arrayListPerformance.adding || 0}ms</td>
            <td>{mapListPerformance.adding || 0}ms</td>
            <td>{setListPerformance.adding || 0}ms</td>
          </tr>
          <tr>
            <td>Update Speed</td>
            <td>{objectListPerformance.updating || 0}ms</td>
            <td>{arrayListPerformance.updating || 0}ms</td>
            <td>{mapListPerformance.updating || 0}ms</td>
            <td>{setListPerformance.updating || 0}ms</td>
          </tr>
        </tbody>
      </table>
    </>
  )
}

export default App
