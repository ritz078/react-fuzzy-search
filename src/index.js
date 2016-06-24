import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import Fuse from 'fuse.js';

const styles = {
  searchBoxStyle: {
    border: '1px solid #eee',
    borderRadius: 2,
    padding: '8px 10px',
    lineHeight: '24px',
    width: '100%',
    outline: 'none',
    fontSize: 16,
    fontFamily: 'Lato',
    color: '#666',
    boxSizing: 'border-box'
  },
  searchBoxWrapper: {
    padding: '4px',
    boxShadow: '0 4px 15px 4px rgba(0,0,0,0.2)',
    borderRadius: 2,
    backgroundColor: '#fff'
  },
  resultsStyle: {
    backgroundColor: '#fff',
    position: 'relative',
    padding: '12px',
    borderTop: '1px solid #eee',
    color: '#666',
    fontFamily: 'Lato',
    fontSize: 14
  },
  selectedResultStyle: {
    backgroundColor: '#f9f9f9',
    position: 'relative',
    padding: '12px',
    borderTop: '1px solid #eee',
    color: '#666',
    fontFamily: 'Lato',
    fontSize: 14
  },
  resultsWrapperStyle: {
    width: '100%',
    boxShadow: '0px 12px 30px 2px rgba(0, 0, 0, 0.1)',
    border: '1px solid #eee',
    borderTop: 0,
    boxSizing: 'border-box'
  }
};

const defaultResultsTemplate = (props, state, styl) => {
  return state.results.map((val, i) => {
    const style = state.selectedIndex === i ? styl.selectedResultStyle : styl.resultsStyle;
    return <div key={i} style={style}>{val.title}</div>;
  });
};

export default class FuzzySearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      selectedIndex: 0
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.fuse = new Fuse(props.list, this.getOptions());
  }

  getOptions() {
    const {
      caseSensitive,
      id,
      include,
      keys,
      shouldSort,
      sortFn,
      tokenize,
      verbose,
      maxPatternLength,
      distance,
      threshold,
      location
    } = this.props;

    return {
      caseSensitive,
      id,
      include,
      keys,
      shouldSort,
      sortFn,
      tokenize,
      verbose,
      maxPatternLength,
      distance,
      threshold,
      location
    };
  }

  getResultsTemplate() {
    return this.state.results.map((val, i) => {
      const style = this.state.selectedIndex === i ?
        styles.selectedResultStyle : styles.resultsStyle;
      return <div key={i} style={style}>{val.title}</div>;
    });
  }

  handleChange(e) {
    this.setState({
      results: this.fuse.search(e.target.value)
    });
  }

  handleKeyDown(e) {
    if (e.keyCode === 40 && (this.state.selectedIndex < this.state.results.length - 1)) {
      this.setState({
        selectedIndex: this.state.selectedIndex + 1
      });
    } else if (e.keyCode === 38 && (this.state.selectedIndex > 0)) {
      this.setState({
        selectedIndex: this.state.selectedIndex - 1
      });
    } else if (e.keyCode === 13) {
      if (this.state.results[this.state.selectedIndex]) {
        this.props.onSelect(this.state.results[this.state.selectedIndex]);
      }
      this.setState({
        results: [],
        selectedIndex: 0
      });
    }
  }

  render() {
    const {
      className,
      width,
      resultsTemplate,
      placeholder
    } = this.props;

    const mainClass = classNames('react-fuzzy-search', className);

    return (
      <div
        className={mainClass}
        style={{ width }}
        onKeyDown={this.handleKeyDown}
      >
        <div style={styles.searchBoxWrapper}>
          <input
            type="text"
            style={styles.searchBoxStyle}
            onChange={this.handleChange}
            ref="searchBox"
            placeholder={placeholder}
          />
        </div>
        {
          this.state.results && this.state.results.length > 0 &&
          <div style={styles.resultsWrapperStyle}>
            {resultsTemplate(this.props, this.state, styles)}
          </div>
        }
      </div>
    );
  }
}

FuzzySearch.propTypes = {
  caseSensitive: PropTypes.bool,
  className: PropTypes.string,
  distance: PropTypes.number,
  id: PropTypes.string,
  include: PropTypes.array,
  maxPatternLength: PropTypes.number,
  onSelect: PropTypes.func.isRequired,
  width: PropTypes.number,
  keys: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
  list: PropTypes.array.isRequired,
  location: PropTypes.number,
  placeholder: PropTypes.string,
  resultsTemplate: PropTypes.func,
  shouldSort: PropTypes.bool,
  sortFn: PropTypes.func,
  threshold: PropTypes.number,
  tokenize: PropTypes.bool,
  verbose: PropTypes.bool
};

FuzzySearch.defaultProps = {
  caseSensitive: false,
  distance: 100,
  include: [],
  location: 0,
  width: 430,
  placeholder: 'Search',
  resultsTemplate: defaultResultsTemplate,
  shouldSort: true,
  sortFn(a, b) {
    return a.score - b.score;
  },
  threshold: 0.6,
  tokenize: false,
  verbose: false
};

export default FuzzySearch;
