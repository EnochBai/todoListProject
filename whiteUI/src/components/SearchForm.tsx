import React, { useRef } from 'react';
import useKey from '../useKey';

interface FormProps {
  searchItems: string;
  setSearchItems: React.Dispatch<React.SetStateAction<string>>;
}

const SearchForm: React.FC<FormProps> = ({ searchItems, setSearchItems }) => {
  const inputEl = useRef<HTMLInputElement>(null);

  useKey('Enter', function () {
    if (inputEl.current && document.activeElement === inputEl.current) return;
    if (inputEl.current) inputEl.current.focus();
    setSearchItems('');
  });

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
