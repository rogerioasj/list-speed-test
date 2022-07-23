import { useState, useRef, useEffect } from "react";
import localData from "./assets/data.json";

function App() {
  const [data, setData] = useState<ListItem[]>();

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
  }, [data]);

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
   * Fetches the data from the API
   */
  async function getDataFromAPI() {
    // const response = await fetch(
    //   "https://api.json-generator.com/templates/rMum_X1PMGd_/data",
    //   {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: "bearer agllzvqap4yzzjf8w5t19wexqawhvla5u0h0poif",
    //     },
    //   }
    // );
    // const apiData: ListItem[] = await response.json();

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
  }

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
  }

  return (
    <>
      <div className="flex content-center pl-2 py-2">
        <button
          onClick={getDataFromAPI}
          className="bg-gray-500 flex items-center"
        >
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
      {data &&
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
              <td>{data ? JSON.stringify([...setList][data.length - 1]) : ""}</td>
            </tr>
            <tr className="border-b-2 border-gray-500">
              <td className="font-bold pl-1">Loading Performance</td>
              <td>{objectListPerformance.loading || 0}ms</td>
              <td>{arrayListPerformance.loading || 0}ms</td>
              <td>{mapListPerformance.loading || 0}ms</td>
              <td>{setListPerformance.loading || 0}ms</td>
            </tr>
            <tr className="border-b-2 border-gray-500">
              <td className="font-bold pl-1">Deleting Performance</td>
              <td>{objectListPerformance.deleting || 0}ms</td>
              <td>{arrayListPerformance.deleting || 0}ms</td>
              <td>{mapListPerformance.deleting || 0}ms</td>
              <td>{setListPerformance.deleting || 0}ms</td>
            </tr>
            <tr className="border-b-2 border-gray-500">
              <td className="font-bold pl-1">Adding Performance</td>
              <td>{objectListPerformance.adding || 0}ms</td>
              <td>{arrayListPerformance.adding || 0}ms</td>
              <td>{mapListPerformance.adding || 0}ms</td>
              <td>{setListPerformance.adding || 0}ms</td>
            </tr>
            <tr className="border-b-2 border-gray-500">
              <td className="font-bold pl-1">Update Performance</td>
              <td>{objectListPerformance.updating || 0}ms</td>
              <td>{arrayListPerformance.updating || 0}ms</td>
              <td>{mapListPerformance.updating || 0}ms</td>
              <td>{setListPerformance.updating || 0}ms</td>
            </tr>
          </tbody>
        </table>
      }
      {!data && <div className="pl-2 text-left">No data</div>}
    </>
  );
}

export default App;
