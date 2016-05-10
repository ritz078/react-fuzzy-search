import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import FuzzySearch from '../index';
import './style.css';

const list = [{
  id: 1,
  title: 'The Great Gatsby',
  author: 'F. Scott Fitzgerald'
}, {
  id: 2,
  title: 'The DaVinci Code',
  author: 'Dan Brown'
}, {
  id: 3,
  title: 'Angels & Demons',
  author: 'Dan Brown'
}];

storiesOf('SearchBox', module)
  .add('Basic', () => (
    <FuzzySearch
      list={list}
      keys={['author', 'title']}
      width={430}
      onSelect={action('selected')}
    />
  ))
  .add('Custom Template', () => {
    function x(props, state, styles) {
      return state.results.map((val, i) => {
        const style = state.selectedIndex === i ? styles.selectedResultStyle : styles.resultsStyle;
        return (
          <div
            key={i}
            style={style}
          >
            {val.title}
            <span style={{ float: 'right', opacity: 0.5 }}>by {val.author}</span>
          </div>
        );
      });
    }

    return (
      <FuzzySearch
        list={list}
        keys={['author', 'title']}
        onSelect={action('selected')}
        resultsTemplate={x}
        placeholder="I am custom placeholder"
      />
    );
  });
