import { useState, useEffect } from 'react';

//tables: trips, 

function useLocalStorage(key, initialData) {
  const [data, setData] = useState(()=>{
    let current;
    try {
        current = JSON.parse(
            localStorage.getItem(key) || String(initialData)
        )
    } catch (error) {
        current = initialData
    }

    return current
  })

//   useEffect(() => {
//     const storedData = localStorage.getItem(key);
//     if (storedData) {
//       setData(JSON.parse(storedData));
//     } else {
//       // If initialData is provided and there's no data in localStorage, use initialData
//       setData(initialData);
//     }
//   }, [key, initialData]);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(data));
  }, [key, data]);

  const create = (item) => {
    setData((prevData) => {
      const newData = [...prevData, item];
      return newData;
    });
  };

  const read = () => {
    return data;
  };

  const readById = (id) => {
    return data.find((obj) => obj._id == id)
  }

  const update = (id, updatedItem) => {
    console.log("localstorage update")
    console.log(updatedItem)
    setData((prevData) => {
      const updatedData = prevData.map((item) => (item._id == id ? updatedItem : item));
      return updatedData;
    });
  };

  const toggleTrue = () => {
    setData(true)
  }

  const remove = (id) => {
    setData((prevData) => {
      const updatedData = prevData.filter((item) => item._id !== id);
      return updatedData;
    });
  };

  return { data, create, read, update, remove, readById, toggleTrue };
}

export default useLocalStorage