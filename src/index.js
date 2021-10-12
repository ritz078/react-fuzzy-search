import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
    color: '#666',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  searchBoxWrapper: {
    padding: '4px',
    boxShadow: '0 4px 15px 4px rgba(0,0,0,0.2)',
    borderRadius: 2,
    backgroundColor: '#fff',
  },
  resultsStyle: {
    backgroundColor: '#fff',
    position: 'relative',
    padding: '12px',
    borderTop: '1px solid #eee',
    color: '#666',
    fontSize: 14,
    cursor: 'pointer',
  },
  selectedResultStyle: {
    backgroundColor: '#f9f9f9',
    position: 'relative',
    padding: '12px',
    borderTop: '1px solid #eee',
    color: '#666',
    fontSize: 14,
    cursor: 'pointer',
  },
  resultsWrapperStyle: {
    width: '100%',
    boxShadow: '0px 12px 30px 2px rgba(0, 0, 0, 0.1)',
    border: '1px solid #eee',
    borderTop: 0,
    boxSizing: 'border-box',
    maxHeight: 400,
    overflow: 'auto',
    position: 'relative',
  },
};

function defaultResultsTemplate(props, state, styl, clickHandler) {
  return state.results.map((val, i) => {
    const style = state.selectedIndex === i ? {...styl.selectedResultStyle, ...props.selectedListItemStyle} : {...styl.resultsStyle, ...props.listItemStyle };
    return (
      <div tabIndex="0" key={i} style={style} onClick={() => clickHandler(i)}>
        {val[props.keyForDisplayName]}
      </div>
    );
  });
}

export default class FuzzySearch extends Component {
  static propTypes = {
    caseSensitive: PropTypes.bool,
    className: PropTypes.string,
    distance: PropTypes.number,
    id: PropTypes.string,
    include: PropTypes.array,
    isDropdown: PropTypes.bool,
    maxPatternLength: PropTypes.number,
    onSelect: PropTypes.func.isRequired,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    keyForDisplayName: PropTypes.string,
    keys: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    list: PropTypes.array.isRequired,
    location: PropTypes.number,
    placeholder: PropTypes.string,
    resultsTemplate: PropTypes.func,
    shouldShowDropdownAtStart: PropTypes.bool,
    shouldSort: PropTypes.bool,
    sortFn: PropTypes.func,
    threshold: PropTypes.number,
    tokenize: PropTypes.bool,
    verbose: PropTypes.bool,
    autoFocus: PropTypes.bool,
    maxResults: PropTypes.number,
    options: PropTypes.object,
    inputStyle: PropTypes.object,
    inputWrapperStyle: PropTypes.object,
    listItemStyle: PropTypes.object,
    listWrapperStyle: PropTypes.object,
    selectedListItemStyle: PropTypes.object,
  };

  static defaultProps = {
    caseSensitive: false,
    distance: 100,
    include: [],
    isDropdown: false,
    keyForDisplayName: 'title',
    location: 0,
    width: 430,
    placeholder: 'Search',
    resultsTemplate: defaultResultsTemplate,
    shouldShowDropdownAtStart: false,
    shouldSort: true,
    sortFn(a, b) {
      return a.score - b.score;
    },
    threshold: 0.6,
    tokenize: false,
    verbose: false,
    autoFocus: false,
    maxResults: 10,
    inputStyle: {},
    inputWrapperStyle: {},
    listItemStyle: {},
    listWrapperStyle: {},
    selectedListItemStyle: {},
  };

  constructor(props) {
    super(props);
    this.state = {
      isOpen: !this.props.shouldShowDropdownAtStart,
      results: [],
      selectedIndex: 0,
      value: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleMouseClick = this.handleMouseClick.bind(this);
    this.fuse = new Fuse(props.list, this.getOptions());
    this.setDropdownRef = ref => {
      this.dropdownRef = ref;
    };
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
      location,
      options,
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
      location,
      ...options,
    };
  }

  handleChange(e) {
    const shouldDisplayAllListItems = this.props.shouldShowDropdownAtStart && !e.target.value;

    this.setState({
      isOpen: true,
      results: shouldDisplayAllListItems
        ? this.props.list
        : this.fuse.search(e.target.value).slice(0, this.props.maxResults - 1),
      value: e.target.value,
    });
  }

  handleKeyDown(e) {
    const { results, selectedIndex } = this.state;

    // Handle DOWN arrow
    if (e.keyCode === 40 && selectedIndex < results.length - 1) {
      this.setState({
        selectedIndex: selectedIndex + 1,
      });

      // Handle UP arrow
    } else if (e.keyCode === 38 && selectedIndex > 0) {
      this.setState({
        selectedIndex: selectedIndex - 1,
      });

      // Handle ENTER
    } else if (e.keyCode === 13) {
      this.selectItem();
    }
  }

  selectItem(index) {
    const { results } = this.state;
    const selectedIndex = index || this.state.selectedIndex;
    const result = results[selectedIndex];
    if (result) {
      // send result to onSelectMethod
      this.props.onSelect(result);
      // and set it as input value
      this.setState({
        value: result[this.props.keyForDisplayName],
      });
    }
    // hide dropdown
    this.setState({
      results: [],
      selectedIndex: 0,
    });
  }

  handleMouseClick(clickedIndex) {
    this.selectItem(clickedIndex);
  }

  render() {
    const {
      autoFocus,
      className,
      isDropdown,
      list,
      placeholder,
      resultsTemplate,
      shouldShowDropdownAtStart,
      width,
    } = this.props;

    // Update the search space list
    if (this.fuse.setCollection && list) {
      this.fuse.setCollection(list);
    }

    const mainClass = classNames('react-fuzzy-search', className);

    return (
      <div
        className={mainClass}
        ref={this.setDropdownRef}
        style={{ width }}
        onBlur={(e) => {
          if (this.dropdownRef.contains(e.relatedTarget)) return;

          // Check shouldShowDropdownAtStart for backwards-compatibility.
          if (isDropdown || shouldShowDropdownAtStart) {
            this.setState({
              isOpen: false,
            });
          }
        }}
        onKeyDown={this.handleKeyDown}
      >
        <div style={{...styles.searchBoxWrapper, ...this.props.inputWrapperStyle}}>
          <input
            autoFocus={autoFocus}
            onChange={this.handleChange}
            placeholder={placeholder}
            style={{...styles.searchBoxStyle, ...this.props.inputStyle}}
            type="text"
            value={this.state.value}
            onFocus={() => {
              if (shouldShowDropdownAtStart) {
                this.setState({
                  isOpen: true,
                  results: this.state.value ? this.state.results : list,
                });
              }
            }}
          />
        </div>
        {this.state.isOpen && this.state.results && this.state.results.length > 0 && (
          <div style={{...styles.resultsWrapperStyle, ...this.props.listWrapperStyle}}>
            {resultsTemplate(this.props, this.state, styles, this.handleMouseClick)}
          </div>
        )}
      </div>
    );
  }
}
