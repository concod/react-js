import { useState } from 'react';

const left = ['HTML', 'JavaScript', 'CSS', 'TypeScript'];
const right = ['React', 'Angular', 'Vue', 'Svelte'];

export default function TransferList() {
  const [selectedItems, setSelectedItems] = useState(new Set<string>());
  const [leftList, setLeftList] = useState(left);
  const [rightList, setRightList] = useState(right);
  const handleChange = (item: string) => {
    console.log(item);

    setSelectedItems((prev) => {
      let next = new Set(prev);
      if (next.has(item)) next.delete(item);
      else next.add(item);
      return next;
    });
  };

  const handleClick = (type: string) => {
    if (type == 'allRight') {
      const leftItems = leftList;
      setLeftList([]);
      setRightList((prev) => [...prev, ...leftItems]);
    }

    if (type === 'allLeft') {
      const rightItems = rightList;
      setRightList([]);
      setLeftList((prev) => [...prev, ...rightItems]);
    }

    if (type === 'checkedRight') {
      const leftChecked = leftList.filter((item) => selectedItems.has(item));
      setRightList((prev) => [...prev, ...leftChecked]);
    }
    if (type === 'checkedLeft') {
      const rightChecked = rightList.filter((item) => selectedItems.has(item));
      setLeftList((prev) => [...prev, ...rightChecked]);
    }
  };
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}
    >
      {/* Transfer List */}

      <ul style={{ listStyle: 'none', padding: '0px', width: '200px' }}>
        {leftList.map((item) => (
          <li key={item}>
            <input
              id={`left-${item}`}
              type="checkbox"
              onChange={() => handleChange(item)}
              checked={selectedItems.has(item)}
            />
            <label htmlFor={`left-${item}`}>{item}</label>
          </li>
        ))}
      </ul>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <button
          disabled={!leftList.length}
          onClick={() => handleClick('allRight')}
        >
          {'>>'}
        </button>
        <button onClick={() => handleClick('checkedRight')}>{'>'}</button>
        <button onClick={() => handleClick('checkedLeft')}>{'<'}</button>
        <button
          disabled={!rightList.length}
          onClick={() => handleClick('allLeft')}
        >
          {'<<'}
        </button>
      </div>
      <ul style={{ listStyle: 'none', padding: '0px', width: '200px' }}>
        {rightList.map((item) => (
          <li key={item}>
            <input
              id={`right-${item}`}
              type="checkbox"
              onChange={() => handleChange(item)}
              checked={selectedItems.has(item)}
            />
            <label htmlFor={`right-${item}`}>{item}</label>
          </li>
        ))}
      </ul>
    </div>
  );
}
