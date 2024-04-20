import React, { useState } from 'react';
import AddForm from './components/AddForm';
import SearchForm from './components/SearchForm';
import Pagination from './components/Pagination';
import { useEffect } from 'react';
import Loader from './Loader';
import Progress from './components/Progress';
import axios from 'axios';
//import Button from './Button';

interface Item {
  id: number;
  due: Date;
  priority: 'Must' | 'Should' | 'Could' | "Won't";
  task: string;
  status: boolean;
  attachments: string[];
}

interface TableProps {
  currentData: Item[];
  searchedData: Item[];
  deleteItem: (id: number) => void;
  toggleItem: (id: number) => void;
  editItem: (id: number, updatedItem: Item) => void;
}

const Table: React.FC<TableProps> = ({
  currentData,
  searchedData,
  deleteItem,
  toggleItem,
  editItem,
}) => {
  const [editableItemId, setEditableItemId] = useState<number | null>(null);
  const [editedItem, setEditedItem] = useState<Item | null>(null);
  const [sortBy, setSortBy] = useState('default');
  let sortedItems: Item[] = [];
  const [selectedTasksForBatching, setSelectedTasksForBatching] = useState<
    number[]
  >([]);

  //Edit Start

  const handleEdit = (id: number) => {
    setEditableItemId(id);
    const itemToEdit = currentData.find((item) => item.id === id);
    if (itemToEdit) {
      setEditedItem({ ...itemToEdit });
    }
  };

  const handleSave = () => {
    if (editedItem) {
      const dueDate = new Date(editedItem.due);
      editItem(editedItem.id, { ...editedItem, due: dueDate });
      setEditableItemId(null);
      setEditedItem(null);
    }
  };

  const handleCancel = () => {
    setEditableItemId(null);
    setEditedItem(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editedItem) {
      const { name, value } = e.target;
      setEditedItem((item) => ({
        ...(item as Item),
        [name]: name === 'due' ? new Date(value) : value,
      }));
    }
  };

  const handleChangePriority = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (editedItem) {
      const { value } = e.target;
      setEditedItem((item) => ({
        ...(item as Item),
        priority: value as Item['priority'],
      }));
    }
  };

  //Edit End

  //filter start
  if (sortBy === 'default') sortedItems = currentData;

  if (sortBy === 'task') {
    sortedItems = searchedData.slice().sort((a, b) => a.task.localeCompare(b.task));
  }

  if (sortBy === 'due')
    sortedItems = searchedData
      .slice()
      .sort((a, b) => new Date(a.due).getTime() - new Date(b.due).getTime());

  if (sortBy === 'priority') {
    const priorityOrder: { [key: string]: number } = {
      Must: 1,
      Should: 2,
      Could: 3,
      "Won't": 4,
    };
    sortedItems = searchedData
      .slice()
      .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
  }

  if (sortBy === 'status')
    sortedItems = searchedData
      .slice()
      .sort((a, b) => Number(a.status) - Number(b.status));

  //filter end

  //batch mode start

  const handleCheckboxChange = (taskId: number) => {
    setSelectedTasksForBatching((tasks) => {
      if (tasks.includes(taskId)) {
        return tasks.filter((id) => id !== taskId);
      } else {
        return [...tasks, taskId];
      }
    });
  };

  const handleBatchDelete = () => {
    selectedTasksForBatching.forEach((taskId) => {
      deleteItem(taskId);
    });
    setSelectedTasksForBatching([]);
  };

  const handleBatchMarkAsDone = () => {
    selectedTasksForBatching.forEach((taskId) => {
      toggleItem(taskId);
    });
    setSelectedTasksForBatching([]);
  };

  //batch mode end

  return (
    <>
      <table className="mx-auto mt-2 border-2 border-stone-900 bg-stone-50 text-blue-500">
        <thead>
          <tr>
            <th>ID</th>
            <th>Due</th>
            <th>Priority</th>
            <th>Task</th>
            <th>
              <span>&#10003;</span>
            </th>
            <th>Attachments</th>
            <th>Actions</th>
            <th>Batch Mode</th>
          </tr>
        </thead>
        <tbody>
          {sortedItems.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>
                {/* {editableItemId === item.id ? (
                  <input
                    type="date"
                    name="due"
                    value={editedItem?.due?.toISOString().substr(0, 10)}
                    onChange={handleChange}
                  />
                ) : (
                  item.due
                )} */}
                {item.due}
              </td>
              <td>
                {editableItemId === item.id ? (
                  <select
                    value={editedItem?.priority}
                    onChange={handleChangePriority}
                  >
                    <option value="Must">Must</option>
                    <option value="Should">Should</option>
                    <option value="Could">Could</option>
                    <option value="Won't">Won't</option>
                  </select>
                ) : (
                  item.priority
                )}
              </td>
              <td>
                {editableItemId === item.id ? (
                  <input
                    type="text"
                    name="task"
                    value={editedItem?.task}
                    onChange={handleChange}
                  />
                ) : (
                  item.task
                )}
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={item.status}
                  onChange={() => toggleItem(item.id)}
                  className="h-6 w-6 accent-yellow-400 focus:outline-none focus:ring focus:ring-yellow-400 focus:ring-offset-2"
                />
              </td>
              <td>
                {item.attachments.map((attachment) => (
                  <a
                    href={attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Attachment {attachment}
                  </a>
                ))}
              </td>
              <td>
                {editableItemId === item.id ? (
                  <>
                    <button onClick={handleSave}>Save</button>
                    <button onClick={handleCancel}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(item.id)}>✏️</button>
                    <button onClick={() => deleteItem(item.id)}>❌</button>
                  </>
                )}
              </td>
              <td className="px-10">
                <input
                  type="checkbox"
                  checked={selectedTasksForBatching.includes(item.id)}
                  onChange={() => handleCheckboxChange(item.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-2 flex items-center justify-between sm:px-60">
        <div className="my-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="select"
          >
            <option value="default">Sort by default order</option>
            <option value="due">Sort by due date</option>
            <option value="task">Sort by task</option>
            <option value="priority">Sort by priority</option>
            <option value="status">Sort by progress status</option>
          </select>
        </div>

        <div>
          <h3 className="tracking-widest text-blue-500">
            Selection for Batch Mode:
          </h3>
          <button
            onClick={handleBatchDelete}
            className="px-2 text-blue-500 transition-all duration-300 hover:text-blue-600 hover:underline"
          >
            ❌Delete Selected
          </button>
          <button
            onClick={handleBatchMarkAsDone}
            className="px-2 text-blue-500 hover:text-blue-600 hover:underline"
          >
            <span className="text-xl font-semibold text-green-500">
              &#10003;
            </span>
            Mark as Done or Unfinished
          </button>
        </div>
      </div>
    </>
  );
};

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<Item[]>([]);
  const [searchItems, setSearchItems] = useState<string>('');
  // const searchedItems = searchItems
  //   ? items.filter((item) =>
  //       item.task.toLowerCase().includes(searchItems.toLowerCase()),
  //     )
  //   : items;
  const [searchedItems, setSearchedItems] = useState<Item[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(5);

  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     setIsLoading(false);
  //   }, 2000);
  //   return () => clearTimeout(timeout);
  // }, []);

  useEffect(() => {
    axios
      .get('http://localhost:3000/api/items')
      .then((response) => {
        setItems(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      });
  }, []);

  // const handleSearch = async (searchQuery: string) => {
  //   try {
  //     if (searchQuery === '') {
  //       setSearchedItems(items);
  //     } else {
  //       const response = await axios.get(`http://localhost:3000/api/items/search?q=${searchQuery}`);
  //       setSearchedItems(response.data);
  //     }
  //   } catch (error) {
  //     console.error('Error searching items:', error);
  //   }
  // };

  useEffect(() => {
    if (searchItems.trim() !== '') {
      axios
        .get(`http://localhost:3000/api/items/search?q=${searchItems}`)
        .then((response) => {
          console.log(response.data);
          setSearchedItems(response.data);
        })
        .catch((error) => {
          console.error('Error searching items:', error);
        });
    } else {
      setSearchedItems(items);
    }
  }, [searchItems, items]);

  // function handleAddItems(item: Item) {
  //   setItems((items) => [...items, item]);
  // }
  function handleAddItems(item: Item) {
    axios
      .post('http://localhost:3000/api/items', item)
      .then((response) => {
        setItems((items) => [...items, response.data.item]);
      })
      .catch((error) => {
        console.error('Error adding item:', error);
      });
  }

  function handleDeleteItem(id: number) {
    axios
      .delete(`http://localhost:3000/api/items/${id}`)
      .then(() => {
        setItems((items) => items.filter((item) => item.id !== id));
      })
      .catch((error) => {
        console.error('Error deleting item:', error);
      });
  }

  // function handleDeleteItem(id: number) {
  //   setItems((items) => items.filter((item) => item.id !== id));
  // }

  // function handleToggleItem(id: number) {
  //   setItems((items) =>
  //     items.map((item) =>
  //       item.id === id ? { ...item, status: !item.status } : item,
  //     ),
  //   );
  // }

  function handleToggleItem(id: number) {
    axios
      .put(`http://localhost:3000/api/items/${id}/toggle`)
      .then((response) => {
        // Update the state with the updated item received from the backend
        const updatedItem = response.data.item;
        setItems((items) =>
          items.map((item) =>
            item.id === updatedItem.id ? updatedItem : item,
          ),
        );
      })
      .catch((error) => {
        // Handle errors, such as displaying an error message
        console.error('Error toggling item status:', error);
      });
  }

  // function handleEditItem(id: number, updatedItem: Item) {
  //   setItems((items) =>
  //     items.map((item) => (item.id === id ? updatedItem : item)),
  //   );
  // }

  function handleEditItem(id: number, updatedItem: Item) {
    axios
      .put(`http://localhost:3000/api/items/${id}`, updatedItem)
      .then((response) => {
        const updatedItem = response.data.item;
        setItems((items) =>
          items.map((item) =>
            item.id === updatedItem.id ? updatedItem : item,
          ),
        );
      })
      .catch((error) => {
        console.error('Error updating item:', error);
      });
  }

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentItems = searchedItems.slice(
    indexOfFirstRecord,
    indexOfLastRecord,
  );
  const nPages = Math.ceil(searchedItems.length / recordsPerPage);
  console.log(searchedItems);
  console.log(currentItems);

  return (
    <div className="grid h-screen bg-stone-700">
      {isLoading && <Loader />}
      <div className="grid grid-rows-[auto_1fr_auto] bg-stone-700">
        <div className="mb-2 border-b-2 border-stone-400 bg-stone-900 text-center sm:px-6 sm:py-6">
          <h1 className="font-semibold tracking-widest text-blue-500">
            Welcome to WhiteUI!
          </h1>
        </div>
        <div className="pt-4 sm:px-20 sm:pt-10">
          <SearchForm
            setSearchItems={setSearchItems}
            searchItems={searchItems}
          />
          <AddForm onAddItems={handleAddItems} />
          <Table
            currentData={currentItems}
            searchedData={searchedItems}
            deleteItem={handleDeleteItem}
            toggleItem={handleToggleItem}
            editItem={handleEditItem}
          />
          <Pagination
            nPages={nPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
        <div className="border-t-2 border-stone-400 bg-stone-900 py-4">
          <Progress items={items} />
        </div>
      </div>
    </div>
  );
};

export default App;
