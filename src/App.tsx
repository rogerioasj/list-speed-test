import { useState, useRef, useEffect } from "react"
import localData from "./assets/data.json"
import './app.css'

function App() {
  const [data, setData] = useState<ListItem[]>();
  const [loading, setLoading] = useState(false);

  const [objectList, setObjectList] = useState<any>();
  const [arrayList, setArrayList] = useState<ListItem[]>([]);
  const [mapList, setMapList] = useState(new Map());
  const [setList, setSetList] = useState(new Set<ListItem>());

  const [objectListPerformance, setObjectListPerformance] =
    useState<ListPerformance>({
      loading: 0,
      deleting: 0,
      adding: 0,
      updating: 0,
    });
  const [arrayListPerformance, setArrayListPerformance] =
    useState<ListPerformance>({
      loading: 0,
      deleting: 0,
      adding: 0,
      updating: 0,
    });
  const [mapListPerformance, setMapListPerformance] = useState<ListPerformance>(
    { loading: 0, deleting: 0, adding: 0, updating: 0 }
  );
  const [setListPerformance, setSetListPerformance] = useState<ListPerformance>(
    { loading: 0, deleting: 0, adding: 0, updating: 0 }
  );
  const [bestLoadingPerformance, setBestLoadingPerformance] = useState<number>(0);
  const [bestDeletingPerformance, setBestDeletingPerformance] = useState<number>(0);
  const [bestAddingPerformance, setBestAddingPerformance] = useState<number>(0);
  const [bestUpdatingPerformance, setBestUpdatingPerformance] = useState<number>(0);

  const indexToDeleteInput = useRef<HTMLInputElement>(null);
  const indexToUpdateInput = useRef<HTMLInputElement>(null);

  type ListItem = {
    id: number;
    name: string;
    age: number;
    isMarried: boolean;
    children: [
      {
        id: number;
        name: string;
        age: number;
      }
    ];
  };

  type ListPerformance = {
    loading: number;
    deleting: number;
    adding: number;
    updating: number;
  };

  useEffect(() => {
    indexToDeleteInput.current ? indexToDeleteInput.current.value = String(data ? data.length - 1: 0) : null
    indexToUpdateInput.current ? indexToUpdateInput.current.value = String(data ? data.length - 1: 0) : null

    setLoading(false)
  }, [data]);

  useEffect(() => {
    setBestLoadingPerformance(Math.min(...[objectListPerformance.loading, arrayListPerformance.loading, mapListPerformance.loading, setListPerformance.loading]))
  }, [objectListPerformance.loading])

  useEffect(() => {
    setBestDeletingPerformance(Math.min(...[objectListPerformance.deleting, arrayListPerformance.deleting, mapListPerformance.deleting, setListPerformance.deleting]))
  }, [objectListPerformance.deleting])

  useEffect(() => {
    setBestAddingPerformance(Math.min(...[objectListPerformance.adding, arrayListPerformance.adding, mapListPerformance.adding, setListPerformance.adding]))
  }, [objectListPerformance.adding])

  useEffect(() => {
    setBestUpdatingPerformance(Math.min(...[objectListPerformance.updating, arrayListPerformance.updating, mapListPerformance.updating, setListPerformance.updating]))
  }, [objectListPerformance.updating])
  
  /**
   * Returns the difference between the current and last performance
   *
   * @param {number} currentPerformance
   * @return {number}
   */
  function measurePerformance(currentPerformance: number): number {
    const elapsedTime = performance.now() - currentPerformance;
    return Number(elapsedTime.toFixed(3));
  }

  /**
   * Clear data, lists aand performance measures
   *
   */
  function resetData() {
    setData([])
    setObjectList([])
    setArrayList([])
    setMapList(new Map())
    setSetList(new Set<ListItem>())

    setObjectListPerformance({ loading: 0, deleting: 0, adding: 0, updating: 0 })
    setArrayListPerformance({ loading: 0, deleting: 0, adding: 0, updating: 0 })
    setMapListPerformance({ loading: 0, deleting: 0, adding: 0, updating: 0 })
    setSetListPerformance({ loading: 0, deleting: 0, adding: 0, updating: 0 })
  }

  /**
   * Fetches the data from the API
   */
  // async function getDataFromAPI() {
  useEffect(() => {
    if (!loading)
      return

    if (data && data.length > 0) 
      resetData()

    const apiData: ListItem[] = (localData as unknown) as ListItem[];
    if (!apiData || apiData.length === 0) return;

    {
      const start = performance.now();
      apiData.forEach((item) => {
        setObjectList((prevState: any) => {
          return {
            ...prevState,
            [item.id]: item,
          };
        });
      });
      setObjectListPerformance((prevState) => {
        prevState.loading = measurePerformance(start);
        return prevState;
      });
    }

    {
      const start = performance.now();
      apiData.forEach((item) => {
        setArrayList((prevState) => [...prevState, item]);
      });
      setArrayListPerformance((prevState) => {
        prevState.loading = measurePerformance(start);
        return prevState;
      });
    }

    {
      const start = performance.now();
      apiData.forEach((item) => {
        setMapList((prevState) => {
          return new Map(prevState).set(item.id, item);
        });
      });
      setMapListPerformance((prevState) => {
        prevState.loading = measurePerformance(start);
        return prevState;
      });
    }

    {
      const start = performance.now();
      apiData.forEach((item) => {
        setSetList((prevState) => {
          return new Set(prevState).add(item);
        });
      });
      setSetListPerformance((prevState) => {
        prevState.loading = measurePerformance(start);
        return prevState;
      });
    }

    setData(apiData);
    setLoading(false)
  }, [loading])

  /**
   * Deletes an item from the lists
   *
   */
  function deleteItem() {
    if (!data || data.length === 0) return;

    const index = (
      indexToDeleteInput.current ? indexToDeleteInput.current.value : 0
    ) as number;

    if (index < 0 || index >= data.length) return;

    const item = data[index];

    {
      const start = performance.now();
      setObjectList((prevState: any) => {
        delete prevState[item.id];
        return {
          ...prevState,
        };
      });
      setObjectListPerformance((prevState) => {
        prevState.deleting = measurePerformance(start);
        return prevState;
      });
    }

    {
      const start = performance.now();
      setArrayList((prevState) => {
        prevState.splice(index, 1);
        return [...prevState];
      });
      setArrayListPerformance((prevState) => {
        prevState.deleting = measurePerformance(start);
        return prevState;
      });
    }

    {
      const start = performance.now();
      setMapList((prevState) => {
        prevState.delete(item.id);
        return new Map(prevState);
      });
      setMapListPerformance((prevState) => {
        prevState.deleting = measurePerformance(start);
        return prevState;
      });
    }

    {
      const start = performance.now();
      setSetList((prevState) => {
        prevState.delete(item);
        return new Set(prevState);
      });
      setSetListPerformance((prevState) => {
        prevState.deleting = measurePerformance(start);
        return prevState;
      });
    }

    setData((prevState) => {
      prevState!.splice(index, 1);
      return [...prevState!];
    });

    setBestDeletingPerformance(Math.max(...[objectListPerformance.deleting, arrayListPerformance.deleting, mapListPerformance.deleting, setListPerformance.deleting]))
  }

  /**
   * Add a new item to the lists
   *
   */
  function addItem() {
    if (!data || data.length === 0) return;

    const item = data[data.length - 1];
    const newItem: ListItem = {
      id: item.id + 1,
      name: `${item.name}-new`,
      age: item.age + 1,
      isMarried: !item.isMarried,
      children: [
        {
          id: item.children[0].id + 1,
          name: `${item.children[0].name}-new`,
          age: item.children[0].age + 1,
        },
      ],
    };

    {
      const start = performance.now();
      setObjectList((prevState: any) => {
        return {
          ...prevState,
          [newItem.id]: newItem,
        };
      });
      setObjectListPerformance((prevState) => {
        prevState.adding = measurePerformance(start);
        return prevState;
      });
    }

    {
      const start = performance.now();
      setArrayList((prevState) => [...prevState, newItem]);
      setArrayListPerformance((prevState) => {
        prevState.adding = measurePerformance(start);
        return prevState;
      });
    }

    {
      const start = performance.now();
      setMapList((prevState) => {
        return new Map(prevState).set(newItem.id, newItem);
      });
      setMapListPerformance((prevState) => {
        prevState.adding = measurePerformance(start);
        return prevState;
      });
    }

    {
      const start = performance.now();
      setSetList((prevState) => {
        return new Set(prevState).add(newItem);
      });
      setSetListPerformance((prevState) => {
        prevState.adding = measurePerformance(start);
        return prevState;
      });
    }

    setData((prevState) => {
      return [...prevState!, newItem];
    });

    setBestAddingPerformance(Math.max(...[objectListPerformance.adding, arrayListPerformance.adding, mapListPerformance.adding, setListPerformance.adding]))
  }

  /**
   * Updates an item in the lists
   *
   */
  function updateItem() {
    if (!data || data.length === 0) return;

    const index = (
      indexToUpdateInput.current ? indexToUpdateInput.current.value : 0
    ) as number;

    if (index < 0 || index >= data.length) return;

    const item = data[index];

    {
      const start = performance.now();
      setObjectList((prevState: any) => {
        prevState[item.id].name = `${item.name}-updated`;
        return {
          ...prevState,
        };
      });
      setObjectListPerformance((prevState) => {
        prevState.updating = measurePerformance(start);
        return prevState;
      });
    }

    {
      const start = performance.now();
      setArrayList((prevState) => {
        prevState[index].name = `${item.name}-updated`;
        return [...prevState];
      });
      setArrayListPerformance((prevState) => {
        prevState.updating = measurePerformance(start);
        return prevState;
      });
    }

    {
      const start = performance.now();
      setMapList((prevState) => {
        prevState.set(item.id, {
          ...prevState.get(item.id),
          name: `${item.name}-updated`,
        });
        return new Map(prevState);
      });
      setMapListPerformance((prevState) => {
        prevState.updating = measurePerformance(start);
        return prevState;
      });
    }

    {
      const start = performance.now();
      setSetList((prevState: Set<ListItem>) => {
        [...prevState][index].name = `${item.name}-updated`;
        return new Set(prevState);
      });
      setSetListPerformance((prevState) => {
        prevState.updating = measurePerformance(start);
        return prevState;
      });
    }

    setBestUpdatingPerformance(Math.max(...[objectListPerformance.updating, arrayListPerformance.updating, mapListPerformance.updating, setListPerformance.updating]))
  }

  return (
    <>
      <div className="flex content-center pl-2 py-2">
        <button
          onClick={() => setLoading(true)}
          className="bg-gray-500 flex items-center"
        >
          {
            loading && <div role="status">
              <svg
                className="inline mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-purple-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">Loading...</span>
            </div>
         }
          Load Data {data ? "(" + data?.length + ")" : ""}
        </button>
        <button
          onClick={() => deleteItem()}
          className="bg-red-600 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          Delete element
        </button>
        <input
          className="bg-gray-700 pl-2 text-left border-2 mr-1 w-16"
          type="number"
          ref={indexToDeleteInput}
          id="indexToDeleteInput"
          defaultValue={0}
          // value={data ? data?.length - 1 : 0}
        />
        <br />
        <button
          onClick={() => addItem()}
          className="bg-green-600 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Add element
        </button>
        <br />
        <button
          onClick={() => updateItem()}
          className="bg-orange-500 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
            <path d="M9 13h2v5a1 1 0 11-2 0v-5z" />
          </svg>
          Update element
        </button>
        <input
          className="bg-gray-700 pl-2 text-left border-2 mr-1 w-16"
          type="number"
          ref={indexToUpdateInput}
          id="indexToUpdateInput"
          defaultValue={0}
          // value={data ? data?.length - 1 : 0}
        />
        <br />
      </div>
      {data && (
        <table className="table-fixed bg-gray-700 text-gray-300 ml-2 mr-2">
          <thead>
            <tr className="border-b-2 border-gray-500">
              <th className="w-28"></th>
              <th>Object List</th>
              <th>Array List</th>
              <th>Map List</th>
              <th>Set List</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b-2 border-gray-500">
              <td className="font-bold pl-1">Last element</td>
              <td>
                {data
                  ? JSON.stringify(
                      objectList[Object.keys(objectList)[data.length - 1]]
                    )
                  : ""}
              </td>
              <td>{data ? JSON.stringify(arrayList[data.length - 1]) : ""}</td>
              <td>
                {data
                  ? JSON.stringify(mapList.get(data[data.length - 1].id))
                  : ""}
              </td>
              <td>
                {data ? JSON.stringify([...setList][data.length - 1]) : ""}
              </td>
            </tr>
            <tr className="border-b-2 border-gray-500">
              <td className="font-bold pl-1">Loading Performance</td>
              <td
                className={
                  bestLoadingPerformance &&
                  bestLoadingPerformance === objectListPerformance.loading
                    ? "bestPerformance"
                    : ""
                }
              >
                {objectListPerformance.loading || 0}ms
              </td>
              <td
                className={
                  bestLoadingPerformance &&
                  bestLoadingPerformance === arrayListPerformance.loading
                    ? "bestPerformance"
                    : ""
                }
              >
                {arrayListPerformance.loading || 0}ms
              </td>
              <td
                className={
                  bestLoadingPerformance &&
                  bestLoadingPerformance === mapListPerformance.loading
                    ? "bestPerformance"
                    : ""
                }
              >
                {mapListPerformance.loading || 0}ms
              </td>
              <td
                className={
                  bestLoadingPerformance &&
                  bestLoadingPerformance === setListPerformance.loading
                    ? "bestPerformance"
                    : ""
                }
              >
                {setListPerformance.loading || 0}ms
              </td>
            </tr>
            <tr className="border-b-2 border-gray-500">
              <td className="font-bold pl-1">Deleting Performance</td>
              <td
                className={
                  bestDeletingPerformance &&
                  bestDeletingPerformance === objectListPerformance.deleting
                    ? "bestPerformance"
                    : ""
                }
              >
                {objectListPerformance.deleting || 0}ms
              </td>
              <td
                className={
                  bestDeletingPerformance &&
                  bestDeletingPerformance === arrayListPerformance.deleting
                    ? "bestPerformance"
                    : ""
                }
              >
                {arrayListPerformance.deleting || 0}ms
              </td>
              <td
                className={
                  bestDeletingPerformance &&
                  bestDeletingPerformance === mapListPerformance.deleting
                    ? "bestPerformance"
                    : ""
                }
              >
                {mapListPerformance.deleting || 0}ms
              </td>
              <td
                className={
                  bestDeletingPerformance &&
                  bestDeletingPerformance === setListPerformance.deleting
                    ? "bestPerformance"
                    : ""
                }
              >
                {setListPerformance.deleting || 0}ms
              </td>
            </tr>
            <tr className="border-b-2 border-gray-500">
              <td className="font-bold pl-1">Adding Performance</td>
              <td
                className={
                  bestAddingPerformance &&
                  bestAddingPerformance === objectListPerformance.adding
                    ? "bestPerformance"
                    : ""
                }
              >
                {objectListPerformance.adding || 0}ms
              </td>
              <td
                className={
                  bestAddingPerformance &&
                  bestAddingPerformance === arrayListPerformance.adding
                    ? "bestPerformance"
                    : ""
                }
              >
                {arrayListPerformance.adding || 0}ms
              </td>
              <td
                className={
                  bestAddingPerformance &&
                  bestAddingPerformance === mapListPerformance.adding
                    ? "bestPerformance"
                    : ""
                }
              >
                {mapListPerformance.adding || 0}ms
              </td>
              <td
                className={
                  bestAddingPerformance &&
                  bestAddingPerformance === setListPerformance.adding
                    ? "bestPerformance"
                    : ""
                }
              >
                {setListPerformance.adding || 0}ms
              </td>
            </tr>
            <tr className="border-b-2 border-gray-500">
              <td className="font-bold pl-1">Update Performance</td>
              <td
                className={
                  bestUpdatingPerformance &&
                  bestUpdatingPerformance === objectListPerformance.updating
                    ? "bestPerformance"
                    : ""
                }
              >
                {objectListPerformance.updating || 0}ms
              </td>
              <td
                className={
                  bestUpdatingPerformance &&
                  bestUpdatingPerformance === arrayListPerformance.updating
                    ? "bestPerformance"
                    : ""
                }
              >
                {arrayListPerformance.updating || 0}ms
              </td>
              <td
                className={
                  bestUpdatingPerformance &&
                  bestUpdatingPerformance === mapListPerformance.updating
                    ? "bestPerformance"
                    : ""
                }
              >
                {mapListPerformance.updating || 0}ms
              </td>
              <td
                className={
                  bestUpdatingPerformance &&
                  bestUpdatingPerformance === setListPerformance.updating
                    ? "bestPerformance"
                    : ""
                }
              >
                {setListPerformance.updating || 0}ms
              </td>
            </tr>
          </tbody>
        </table>
      )}
      {!data && <div className="pl-2 text-left">No data</div>}
    </>
  );
}

export default App