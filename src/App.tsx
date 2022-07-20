import { useState, useRef } from 'react'

function App() {

  const [data, setData] = useState<ListItem[]>()

  const [objectList, setObjectList] = useState<any>()
  const [arrayList, setArrayList] = useState<ListItem[]>([])
  const [mapList, setMapList] = useState(new Map())
  const [setList, setSetList] = useState(new Set<ListItem>())

  const [objectListPerformance, setObjectListPerformance] = useState<ListPerformance>({loading: 0, deleting: 0, adding: 0, updating: 0})
  const [arrayListPerformance, setArrayListPerformance] = useState<ListPerformance>({loading: 0, deleting: 0, adding: 0, updating: 0})
  const [mapListPerformance, setMapListPerformance] = useState<ListPerformance>({loading: 0, deleting: 0, adding: 0, updating: 0})
  const [setListPerformance, setSetListPerformance] = useState<ListPerformance>({loading: 0, deleting: 0, adding: 0, updating: 0})

  const indexToDeleteInput = useRef<HTMLInputElement>(null)
  const indexToUpdateInput = useRef<HTMLInputElement>(null)

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
  function measurePerformance(currentPerformance: number): number {
    const elapsedTime = performance.now() - currentPerformance
    return Number(elapsedTime.toFixed(3))
  }

  /**
   * Fetches the data from the API
   */
  async function getDataFromAPI() {
    const response = await fetch('https://api.json-generator.com/templates/rMum_X1PMGd_/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'bearer agllzvqap4yzzjf8w5t19wexqawhvla5u0h0poif'
      }
    })
    
    const apiData: ListItem[] = await response.json()
    if (!apiData || apiData.length === 0)
      return

    {
      const start = performance.now()
      apiData.forEach(item => {
        setObjectList((prevState: any) => {
          return {
            ...prevState,
            [item.id]: item
          }
        })
      })
      setObjectListPerformance(prevState => {
        prevState.loading = measurePerformance(start)
        return prevState
      })
    }
    
    {
      const start = performance.now()
      apiData.forEach(item => {
        setArrayList((prevState) => [...prevState, item])
      })
      setArrayListPerformance(prevState => {
        prevState.loading = measurePerformance(start)
        return prevState
      })      
    }

    {
      const start = performance.now()
      apiData.forEach(item => {
        setMapList((prevState) => {
          return new Map(prevState).set(item.id, item)
        })
      })
      setMapListPerformance(prevState => {
        prevState.loading = measurePerformance(start)
        return prevState
      });      
    }

    {
      const start = performance.now()
      apiData.forEach(item => {
        setSetList((prevState) => {
          return new Set(prevState).add(item)
        })
      })
      setSetListPerformance(prevState => {
        prevState.loading = measurePerformance(start)
        return prevState
      })      
    }

    setData(apiData)
  }

  /**
   * Deletes an item from the lists
   *
   */
  function deleteItem() {
    if (!data || data.length === 0)
      return

    const index = (indexToDeleteInput.current ? indexToDeleteInput.current.value : 0) as number

    if (index < 0 || index >= data.length)
      return

    const item = data[index]

    {
      const start = performance.now()
      setObjectList((prevState: any) => {
        delete prevState[item.id]
        return {
          ...prevState
        }
      })
      setObjectListPerformance(prevState => {
        prevState.deleting = measurePerformance(start)
        return prevState
      })      
    }

    {
      const start = performance.now()
      setArrayList((prevState) => {
        prevState.splice(index, 1)
        return [...prevState]
      })
      setArrayListPerformance(prevState => {
        prevState.deleting = measurePerformance(start)
        return prevState
      })      
    }

    {
      const start = performance.now()
      setMapList((prevState) => {
        prevState.delete(item.id)
        return new Map(prevState)
      })
      setMapListPerformance(prevState => {
        prevState.deleting = measurePerformance(start)
        return prevState
      })
    }
    
    {
      const start = performance.now()
      setSetList((prevState) => {
        prevState.delete(item)
        return new Set(prevState)
      })
      setSetListPerformance(prevState => {
        prevState.deleting = measurePerformance(start)
        return prevState
      })      
    }

    setData((prevState) => {
      prevState!.splice(index, 1)
      return [...prevState!]
    })
  }

  /**
   * Add a new item to the lists
   *
   */
  function addItem() {
    if (!data || data.length === 0)
      return

    const item = data[data.length - 1]
    const newItem: ListItem = {
      id: item.id + 1,
      name: `${item.name}-new`,
      age: item.age + 1,
      isMarried: !item.isMarried,
      children: [{
        id: item.children[0].id + 1,
        name: `${item.children[0].name}-new`,
        age: item.children[0].age + 1,
      }]
    }

    {
      const start = performance.now()
      setObjectList((prevState: any) => {
        return {
          ...prevState,
          [newItem.id]: newItem
        }
      })
      setObjectListPerformance(prevState => {
        prevState.adding = measurePerformance(start)
        return prevState
      })
    }

    {
      const start = performance.now()
      setArrayList((prevState) => [...prevState, newItem])
      setArrayListPerformance(prevState => {
        prevState.adding = measurePerformance(start)
        return prevState
      })
    }

    {
      const start = performance.now()
      setMapList((prevState) => {
        return new Map(prevState).set(newItem.id, newItem)
      })
      setMapListPerformance(prevState => {
        prevState.adding = measurePerformance(start)
        return prevState
      })
    }

    {
      const start = performance.now()
      setSetList((prevState) => {
        return new Set(prevState).add(newItem)
      }
      )
      setSetListPerformance(prevState => {
        prevState.adding = measurePerformance(start)
        return prevState
      })
    }

    setData((prevState) => {
      return [...prevState!, newItem]
    })
  }

  /**
   * Updates an item in the lists
   *
   */
  function updateItem() {
    if (!data || data.length === 0)
      return

    const index = (indexToUpdateInput.current ? indexToUpdateInput.current.value : 0) as number

    if (index < 0 || index >= data.length)
      return

    const item = data[index]

    {
      const start = performance.now()
      setObjectList((prevState: any) => {
        prevState[item.id].name = `${item.name}-updated`
        return {
          ...prevState
        }
      })
      setObjectListPerformance(prevState => {
        prevState.updating = measurePerformance(start)
        return prevState
      })
    }

    {
      const start = performance.now()
      setArrayList((prevState) => {
        prevState[index].name = `${item.name}-updated`
        return [...prevState]
      })
      setArrayListPerformance(prevState => {
        prevState.updating = measurePerformance(start)
        return prevState
      })
    }

    {
      const start = performance.now()
      setMapList((prevState) => {
        prevState.set(item.id, {
          ...prevState.get(item.id),
          name: `${item.name}-updated`
        })
        return new Map(prevState)
      })
      setMapListPerformance(prevState => {
        prevState.updating = measurePerformance(start)
        return prevState
      })
    }

    {
      const start = performance.now()
      setSetList((prevState: Set<ListItem>) => {
        [...prevState][index].name = `${item.name}-updated`
        return new Set(prevState)
      })
      setSetListPerformance(prevState => {
        prevState.updating = measurePerformance(start)
        return prevState
      })
    }
  }

  return (
    <> 
      <button onClick={getDataFromAPI}>Load Data {data ? "(" + data?.length + ")" : ""}</button><br />
      <button onClick={() => deleteItem()}>Delete element</button><input type="number" ref={indexToDeleteInput} id="indexToDeleteInput" /><br />
      <button onClick={() => addItem()}>Add element</button><br />
      <button onClick={() => updateItem()}>Update element</button><input type="number" ref={indexToUpdateInput} id="indexToUpdateInput" /> <br />
      <table>
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
            <td>Last element</td>
            <td>{data ? JSON.stringify(objectList[Object.keys(objectList)[data.length - 1]]) : ""}</td>
            <td>{data ? JSON.stringify(arrayList[data.length - 1]) : ""}</td>
            <td>{data ? JSON.stringify(mapList.get(data[data.length - 1].id)) : ""}</td>
            <td>{data ? JSON.stringify([...setList][data.length - 1]) : ""}</td>
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
