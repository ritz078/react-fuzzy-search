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
    borderRadius: 2
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
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.fuse = new Fuse(props.list, props.options);
  }

  getResultsTemplate() {
    return this.state.results.map((val, i) => {
      const style = this.state.selectedIndex === i ?
        styles.selectedResultStyle : styles.resultsStyle;
      return <div key={i} style={style}>{val.title}</div>;
    });
  }

  handleChange() {
    this.setState({
      results: this.fuse.search(this.refs.searchBox.value)
    });
  }

  handleKeyPress(e) {
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
        onKeyDown={this.handleKeyPress}
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
  className: PropTypes.string,
  onSelect: PropTypes.func.isRequired,
  width: PropTypes.number,
  list: PropTypes.array.isRequired,
  options: PropTypes.object.isRequired,
  resultsTemplate: PropTypes.func,
  placeholder: PropTypes.string
};

FuzzySearch.defaultProps = {
  width: 430,
  resultsTemplate: defaultResultsTemplate,
  placeholder: 'Search'
};

export default FuzzySearch;
