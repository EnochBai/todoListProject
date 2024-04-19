import React from 'react';

interface Item {
  status: boolean;
}

interface ProgressProps {
  items: Item[];
}

const Progress: React.FC<ProgressProps> = ({ items }) => {
  if (!items.length)
    return (
      <p className="flex justify-center text-stone-50">
        <em>Start adding some tasks to your To-Do list</em>
      </p>
    );

  const numItems: number = items.length;
  const numDone: number = items.filter((item) => item.status).length;
  const percentage: number = Math.round((numDone / numItems) * 100);

  return (
    <footer>
      <em className="flex justify-center text-stone-50">
        {percentage === 100
          ? "You got everything done! Have a good break."
          : ` You have ${numItems} tasks on your list, and you already done ${numDone} (${percentage}%) tasks, keep going!`}
      </em>
    </footer>
  );
};

export default Progress;