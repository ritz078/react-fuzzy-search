import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import sinon from 'sinon';

import FuzzySearch from '../index';

const { describe, it } = global;

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
];

const triggerDropdown = (wrapper, letter='t') => {
  const input = wrapper.find('input');

  input.simulate('change', {
    target: {
      value: letter,
    },
  });
}

describe('<FuzzySearch />', () => {
  it('should set correct placeholder text', () => {
    const onSelect = sinon.spy();
    const wrapper = mount(
      <FuzzySearch
        onSelect={onSelect}
        keys={['author', 'title']}
        list={list}
        placeholder="testing"
      />,
    );
    const placeholder = wrapper.find('input').prop('placeholder');
    expect(placeholder).to.equal('testing');
  });

  it('should show results on typing', () => {
    const onSelect = sinon.spy();
    const wrapper = mount(
      <FuzzySearch onSelect={onSelect} keys={['author', 'title']} list={list} />,
    );

    expect(wrapper.state('results').length).to.equal(0);

    triggerDropdown(wrapper);

    expect(wrapper.state('results').length).to.not.equal(0);
  });

  it('should set results as ids if passed in options', () => {
    const onChange = sinon.spy();
    const wrapper = mount(
      <FuzzySearch list={list} onSelect={onChange} keys={['author', 'title']} id="id" />,
    );

    triggerDropdown(wrapper);

    expect(wrapper.state('results')).to.eql(['1', '2']);
  });

  it('should call onChange on selection of result if enter clicked', () => {
    const onChange = sinon.spy();
    const wrapper = mount(
      <FuzzySearch list={list} onSelect={onChange} keys={['author', 'title']} />,
    );

    triggerDropdown(wrapper);

    expect(wrapper.state('results').length).to.not.equal(0);

    const div = wrapper.find('.react-fuzzy-search');

    div.simulate('keydown', {
      keyCode: 13,
    });

    // onChange should be triggered
    expect(onChange.calledOnce).to.equal(true);
    // results should be hidden
    expect(wrapper.state('results').length).to.equal(0);
    // input value should be set
    expect(wrapper.find('input').props().value).to.equal('The Great Gatsby');
  });

  it('should call onSelect on selection of result if mouse clicked', () => {
    const onChange = sinon.spy();
    const wrapper = mount(
      <FuzzySearch list={list} onSelect={onChange} keys={['author', 'title']} />,
    );

    triggerDropdown(wrapper);

    expect(wrapper.state('results').length).to.not.equal(0);

    wrapper.find('div[children="The DaVinci Code"]').simulate('click');

    // onChange should be triggered
    expect(onChange.calledOnce).to.equal(true);
    // results should be hidden
    expect(wrapper.state('results').length).to.equal(0);
    // input value should be set
    expect(wrapper.find('input').props().value).to.equal('The DaVinci Code');
  });

  it('should overwrite previous props with options passed in', () => {
    const onChange = sinon.spy();
    const wrapper = mount(
      <FuzzySearch
        list={list}
        onSelect={onChange}
        keys={['author', 'title']}
        options={{ includeMatches: true }}
      />,
    );

    triggerDropdown(wrapper);

    // Each result should have a 'matches' array now with `includeMatches`
    expect(wrapper.state('results')[0].matches.length).to.not.equal(0);
  });

  it('should set input value even if no title on selectedValue (if ID set)', () => {
    const wrapper = mount(
      <FuzzySearch
        list={list}
        id={'title'}
        keys={['author', 'title']}
        onSelect={sinon.spy()}
      />,
    );

    triggerDropdown(wrapper);

    wrapper.find('.react-fuzzy-search').simulate('keydown', {
      keyCode: 13,
    });

    expect(wrapper.find('input').props().value).to.equal('The Great Gatsby');
  });
});
