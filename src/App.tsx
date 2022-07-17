import { useState } from 'react'

function App() {

  const [data, setData] = useState<ListItem[]>([])

  const [objectList, setObjectList] = useState<any>({})
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

  /**
   *Returns the difference between the current and last performance
   *
   * @param {number} start
   * @return {number} 
   */
  function mesureSpeed(start: number): number {
    const elapsedTime = performance.now() - start
    return elapsedTime / 1000
  }

  /**
   * Populates the object list with data
   *
   * @param {ListItem} item
   */
  function populateObjectList(item: ListItem) {
    setObjectList((prevState: any) => {
      return {
        ...prevState,
        [item.id]: item
      }
    })
  }

  /**
   * Populates the array list with data
   *
   * @param {ListItem} item
   */
  function populateArrayList(item: ListItem) {
    setArrayList((prevState) => [...prevState, item])
  }

  /**
   * Populates the map list with data
   *
   * @param {ListItem} item
   */
  function populateMapList(item: ListItem) {
    setMapList((prevState) => {
      return new Map(prevState).set(item.id, item)
    })
  }

  /**
   * Populates the set list with data
   *
   * @param {ListItem} item
   */
  function populateSetList(item: ListItem) {
    setSetList((prevState) => {
      return new Set(prevState).add(item)
    })
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
      <button>Delete element</button><input type="number" id="indexToDeleteInput" />
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
            <td>First element</td>
            <td>{data && data.length > 0 ? JSON.stringify(objectList[Object.keys(objectList)[0]]) : ""}</td>
            <td>{data && data.length > 0 ? JSON.stringify(arrayList[0]) : ""}</td>
            <td>{data && data.length > 0 ? JSON.stringify(mapList.get(data[0].id)) : ""}</td>
            <td>{data && data.length > 0 ? JSON.stringify(setList.values().next().value) : ""}</td>
          </tr>
          <tr>
            <td>Loading Speed</td>
            <td>{objectListLoadingSpeed}</td>
            <td>{arrayListLoadingSpeed}</td>
            <td>{mapListLoadingSpeed}</td>
            <td>{setListLoadingSpeed}</td>
          </tr>
          <tr>
            <td>Deleting Speed</td>
            <td>{objectListLoadingSpeed}</td>
            <td>{arrayListLoadingSpeed}</td>
            <td>{mapListLoadingSpeed}</td>
            <td>{setListLoadingSpeed}</td>
          </tr>
          <tr>
            <td>Adding Speed</td>
            <td>{objectListLoadingSpeed}</td>
            <td>{arrayListLoadingSpeed}</td>
            <td>{mapListLoadingSpeed}</td>
            <td>{setListLoadingSpeed}</td>
          </tr>
          <tr>
            <td>Update Speed</td>
            <td>{objectListLoadingSpeed}</td>
            <td>{arrayListLoadingSpeed}</td>
            <td>{mapListLoadingSpeed}</td>
            <td>{setListLoadingSpeed}</td>
          </tr>
        </tbody>
      </table>
    </>
  )
}

export default App
