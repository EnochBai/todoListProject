import React, { useState } from 'react';
import Button from '../Button';

interface Item {
  id: number;
  due: Date;
  priority: 'Must' | 'Should' | 'Could' | "Won't";
  task: string;
  status: boolean;
  attachments: string[];
}

interface FormProps {
  onAddItems: (item: Item) => void;
}

const AddForm: React.FC<FormProps> = ({ onAddItems }) => {
  const [due, setDue] = useState(new Date().toLocaleDateString());
  const [task, setTask] = useState('');
  const [priority, setPriority] = useState<Item['priority']>('Must');
  const [attachment, setAttachment] = useState<File | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!task) return;

    const newItem: Item = {
      id: new Date().getTime(),
      due: new Date(due),
      priority,
      task,
      status: false,
      attachments: attachment ? [URL.createObjectURL(attachment)] : [],
    };

    onAddItems(newItem);

    setPriority('Must');
    setTask('');
    setDue(new Date().toLocaleDateString());
    setAttachment(null);
  }

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setAttachment(file);
    }
  };

  return (
    <form className="add-form pt-4 sm:pt-10" onSubmit={handleSubmit}>
      <h3 className="text-center tracking-widest text-blue-500">Add Task:</h3>
      <p className="mt-2 tracking-widest text-blue-500">Due Date:</p>
      <input
        type="date"
        value={due}
        onChange={(e) => setDue(e.target.value)}
        className="input mt-2"
      />
      <p className="mt-2 tracking-widest text-blue-500">Task Name:</p>
      <input
        type="text"
        value={task}
        placeholder="task name..."
        onChange={(e) => setTask(e.target.value)}
        className="input mt-2"
      />
      <div className="mt-2 flex items-center justify-between">
        <div>
          <p className="tracking-widest text-blue-500">Priority:</p>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as Item['priority'])}
            className="select mt-2"
          >
            <option value="Must">Must</option>
            <option value="Should">Should</option>
            <option value="Could">Could</option>
            <option value="Won't">Won't</option>
          </select>
          <p className="tracking-widest text-blue-500 mt-2">Add Images:</p>
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleAttachmentChange}
            className="select mt-2 bg-stone-100"
          />
        </div>
        <Button>Add</Button>
      </div>
    </form>
  );
};

export default AddForm;
