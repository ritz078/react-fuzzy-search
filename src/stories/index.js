import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import FuzzySearch from '../index';
import './style.css';

const list = [
  { id: 1, title: 'Anaphylaxis', label: 'Anaphylaxis' },
  { id: 2, title: 'Burning', label: 'comes from sickness' },
  { id: 3, title: 'Cough', label: 'Cough' },
  { id: 4, title: 'Dizziness or feeling faint', label: 'Dizziness or feeling faint' },
  { id: 5, title: 'Fatigue', label: 'Fatigue' },
  { id: 6, title: 'Hay fever', label: 'Hay fever' },
  { id: 7, title: 'Hives', label: 'Hives' },
  { id: 8, title: 'Inability to speak or breathe', label: 'Inability to speak or breathe' },
  { id: 9, title: 'Itching', label: 'Itching' },
  { id: 10, title: 'Itchy eyes', label: 'Itchy eyes' },
  { id: 11, title: 'Itchy mouth', label: 'Itchy skin' },
  { id: 12, title: 'Pale or blue color skin', label: 'Pale or blue color skin' },
  { id: 13, title: 'Puffy eyelids', label: 'Puffy eyelids' },
  { id: 14, title: 'Redness', label: 'Redness' },
  { id: 15, title: 'Runny nose', label: 'Runny nose' },
  { id: 16, title: 'Shock or circulatory collapse', label: 'Shock or circulatory collapse' },
  { id: 17, title: 'Shortness of breath', label: 'Shortness of breath' },
  { id: 18, title: 'Sneezing', label: 'Sneezing' },
  { id: 19, title: 'Swelling of the tongue', label: 'Swelling of the tongue' },
  { id: 20, title: 'Tight, hoarse throat', label: 'Tight, hoarse throat' },
  { id: 21, title: 'Trouble swallowing', label: 'Trouble swallowing' },
  { id: 22, title: 'Vomiting and/or stomach cramps', label: 'Vomiting and/or stomach cramps' },
  { id: 23, title: 'Watery discharge', label: 'Watery discharge' }
];

storiesOf('SearchBox', module)
  .add('Basic', () => (
    <FuzzySearch list={list} keys={['author', 'title']} onSelect={action('selected')} />
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
