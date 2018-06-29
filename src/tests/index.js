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

    const input = wrapper.find('input');
    expect(wrapper.state('results').length).to.equal(0);

    input.simulate('change', {
      target: {
        value: 't',
      },
    });

    expect(wrapper.state('results').length).to.not.equal(0);
  });

  it('should set results as ids if passed in options', () => {
    const onChange = sinon.spy();
    const wrapper = mount(
      <FuzzySearch list={list} onSelect={onChange} keys={['author', 'title']} id="id" />,
    );

    const input = wrapper.find('input');
    input.simulate('change', {
      target: {
        value: 't',
      },
    });

    expect(wrapper.state('results')).to.eql(['1', '2']);
  });

  it('should call onChange on selection of result', () => {
    const onChange = sinon.spy();
    const wrapper = mount(
      <FuzzySearch list={list} onSelect={onChange} keys={['author', 'title']} />,
    );

    const input = wrapper.find('input');
    input.simulate('change', {
      target: {
        value: 't',
      },
    });

    expect(wrapper.state('results').length).to.not.equal(0);

    const div = wrapper.find('.react-fuzzy-search');

    div.simulate('keydown', {
      keyCode: 13,
    });

    expect(onChange.calledOnce).to.equal(true);
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

    const input = wrapper.find('input');
    input.simulate('change', {
      target: {
        value: 't',
      },
    });

    // Each result should have a 'matches' array now with `includeMatches`
    expect(wrapper.state('results')[0].matches.length).to.not.equal(0);
  });

  it('should use resultTitle property if given', () => {
    const wrapper = mount(
      <FuzzySearch
        list={list}
        resultTitle={'author'}
        keys={['author', 'title']}
        onSelect={sinon.spy()} 
      />,
    );

    const input = wrapper.find('input');
    input.simulate('change', {
      target: {
        value: 't',
      },
    });

    expect(wrapper.find('div[children="F. Scott Fitzgerald"]')).to.have.length(1);
  });


  it('should use default title property if resultTitle not given', () => {
    const wrapper = mount(
      <FuzzySearch
        list={list}
        keys={['author', 'title']}
        onSelect={sinon.spy()} 
      />,
    );

    const input = wrapper.find('input');
    input.simulate('change', {
      target: {
        value: 't',
      },
    });

    expect(wrapper.find('div[children="The Great Gatsby"]')).to.have.length(1);
  });
});
