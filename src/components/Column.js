import React, { useState } from 'react';
import content from '../content.json';

const Columns = () => {
  const [collapse, setCollapse] = useState({ col1: false, col2: true });

  const toggleCollapse = (col) => {
    setCollapse((prevCollapse) => {
      if (!prevCollapse.col1 && col === 'col2') {
        return { col1: true, col2: false };
      }
      if (!prevCollapse.col2 && col === 'col1') {
        return { col1: false, col2: true };
      }
      return { ...prevCollapse, [col]: !prevCollapse[col] };
    });
  };

  const handleKeyPress = (key, col) => {
    if (key === 'Enter') {
      toggleCollapse(col);
    }
  };

  return (
    <div className="columns">
      <div className={`content-column ${collapse.col1 ? 'collapse' : 'visible'}`}>
        <div
          tabIndex={5}
          onClick={() => toggleCollapse('col1')}
          onKeyPress={({ key }) => handleKeyPress(key, 'col1')}
        >
          <h3>
            {content.column1.title}
            <img src="../chevron.png" alt="Toggle panel" className="chevron" />
          </h3>
        </div>
        <div className={`content ${collapse.col1 ? 'collapse' : 'visible'}`}>
          <hr />
          <p>Package includes</p>
          <ul>
            {content.column1.packages.map((elem, i) => (
              <li key={i}>{elem}</li>
            ))}
          </ul>
        </div>
        <div className={`btn ${collapse.col1 ? 'collapse' : 'visible'}`}>
          <input type="submit" value="Button" />
        </div>
      </div>
      <div className={`content-column ${collapse.col2 ? 'collapse' : 'visible'}`}>
        <div
          onClick={() => toggleCollapse('col2')}
          onKeyPress={({ key }) => handleKeyPress(key, 'col2')}
        >
          <h3>
            {content.column2.title}
            <img src="../chevron.png" alt="Toggle panel" className="chevron" />
          </h3>
        </div>
        <div className={`content ${collapse.col2 ? 'collapse' : 'visible'}`}>
          <hr />
          <p>Package includes</p>
          <ul>
            {content.column2.packages.map((elem, i) => (
              <li key={i}>{elem}</li>
            ))}
          </ul>
        </div>
        <div className={`btn ${collapse.col2 ? 'collapse' : 'visible'}`}>
          <input type="submit" value="Button" />
        </div>
      </div>
    </div>
  );
};

export default Columns;
