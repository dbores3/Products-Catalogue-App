import React from 'react';
import { render, screen } from '@testing-library/react';
import {Pagination} from './components/Pagination';
import App from './App';
import { shallow } from 'enzyme';
 
it("Renders App without crashing", () => {
    render(<App />);
    expect(screen.getByText(/Products/i)).toBeInTheDocument()
});

it('Pagination has the same amount of cards', () => {
    render(<Participants />)
    expect(screen.getAllByTestId('pagination')).toHaveLength(2000)
  })
  
it("Renders the pagination", () => {
    const startState = [{ totalRows: 2000}];
    const finState = Pagination(startState, 1);

    const pagination = <Pagination 
        totalRows={2000}
        pageLimit={18}
        pageSiblings={1}
    />;
    expect(wrapper.contains(welcome)).toEqual(true);
});

it("Renders the product card", () => {
    const wrapper = shallow(<App />);
    const img = <img></img>;
    expect(wrapper.contains(img)).toEqual(true);
});