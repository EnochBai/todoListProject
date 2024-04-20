import React, { useRef } from 'react';
import useKey from '../useKey';
// import axios from 'axios';

// interface Item {
//   id: number;
//   due: Date;
//   priority: 'Must' | 'Should' | 'Could' | "Won't";
//   task: string;
//   status: boolean;
//   attachments: string[];
// }

// interface FormProps {
//   // searchItems: string;
//   // setSearchItems: React.Dispatch<React.SetStateAction<string>>;
// }

interface FormProps {
  // onSearch: (searchQuery: string) => void;
  searchItems: string;
  setSearchItems: React.Dispatch<React.SetStateAction<string>>;
}

const SearchForm: React.FC<FormProps> = ({
  // onSearch,
  searchItems,
  setSearchItems,
}) => {
  const inputEl = useRef<HTMLInputElement>(null);

  useKey('Enter', function () {
    if (inputEl.current && document.activeElement === inputEl.current) return;
    if (inputEl.current) inputEl.current.focus();
    setSearchItems('');
  });

  // const handleSearch = () => {
  //   if (inputEl.current) {
  //     const searchQuery = inputEl.current.value.trim(); // Trim the search query to remove leading and trailing whitespace
  //     setSearchItems(searchQuery); // Update the local state with the search query
  //     onSearch(searchQuery); // Call the onSearch function with the search query
  //   }
  // };

  // useKey('Enter', handleSearch);

  return (
    <div>
      <h3 className="text-center tracking-widest text-blue-500">
        Search Task:
      </h3>
      <input
        name="searchTask"
        id="searchTask"
        placeholder="Type the task that you want to search..."
        type="text"
        value={searchItems}
        onChange={(e) => setSearchItems(e.target.value)}
        ref={inputEl}
        className="input mt-2"
      />
    </div>
  );
};

export default SearchForm;
