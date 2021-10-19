import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import FuzzySearch from '../index';
import './style.css';

const list = [
  {
    id: 1,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
  },
  {
    id: 2,
    title: 'The DaVinci Code',
    author: 'Dan Brown',
  },
  {
    id: 3,
    title: 'Angels & Demons',
    author: 'Dan Brown',
  },
  {
    id: 4,
    title: 'The Greater Gatsby',
    author: 'F. Scott Fitzgerald',
  },
  {
    id: 5,
    title: 'The DaVinci1 Code',
    author: 'Dan Brown',
  },
  {
    id: 6,
    title: 'Angels1 & Demons',
    author: 'Dan Brown',
  },
  {
    id: 7,
    title: 'The Greater2 Gatsby',
    author: 'F. Scott Fitzgerald',
  },
  {
    id: 8,
    title: 'The DaVinci2 Code',
    author: 'Dan Brown',
  },
  {
    id: 9,
    title: 'Angels2 & Demons',
    author: 'Dan Brown',
  },
  {
    id: 10,
    title: 'The Greater Gatsby',
    author: 'F. Scott Fitzgerald',
  },
  {
    id: 11,
    title: 'The DaVinci1 Code',
    author: 'Dan Brown',
  },
  {
    id: 12,
    title: 'Angels1 & Demons',
    author: 'Dan Brown',
  },
];

storiesOf('SearchBox', module)
  .add('Basic', () => (
    <FuzzySearch list={list} keys={['author', 'title']} width={430} onSelect={action('selected')} />
  ))
  .add('Dropdown behavior', () => (
    <FuzzySearch
      isDropdown
      list={list}
      keys={['author', 'title']}
      width={430}
      onSelect={action('selected')}
    />
  ))
  .add('Custom Styles', () => (
    <FuzzySearch
      list={list}
      onSelect={action('selected')}
      keys={['author', 'title']}
      inputStyle={{
        outline: '1px solid red',
      }}
      inputWrapperStyle={{
        outline: '1px solid red',
      }}
      listItemStyle={{
        backgroundColor: 'yellow',
      }}
      listWrapperStyle={{
        border: '2px solid blue',
      }}
      selectedListItemStyle={{
        color: 'red',
      }}
    />
  ))
  .add('Custom Template', () => {
    function x(props, state, styles, clickHandler) {
      return state.results.map((val, i) => {
        const style = state.selectedIndex === i ? styles.selectedResultStyle : styles.resultsStyle;
        return (
          <div
            key={i}
            style={style}
            onClick={() => clickHandler(i)}
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
  })
  .add('Show Dropdown at Start', () => (
    <FuzzySearch
      list={list}
      keys={['author', 'title']}
      width={430}
      onSelect={action('selected')}
      shouldShowDropdownAtStart
    />
  ))
  .add('Passthrough Options', () => {
    const template = (props, state, styles, click) =>
      state.results.map(({ item, matches }, i) => {
        const style = state.selectedIndex === i ? styles.selectedResultStyle : styles.resultsStyle;
        return (
          <div key={i} style={style} onClick={() => click(i)}>
            {item.title}
            <span style={{ float: 'right', opacity: 0.5 }}>by {item.author}</span>
          </div>
        );
      });

    return (
      <FuzzySearch
        list={list}
        keys={['author', 'title']}
        width={430}
        onSelect={action('selected')}
        options={{ includeMatches: true }}
        resultsTemplate={template}
      />
    );
  });
