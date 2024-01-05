import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import myContext from '../../../../context/data/myContext'; // Import your context
import '@testing-library/jest-dom'; // Import jest-dom for better assertions
import Notification from '../../../communityforum/notifications/Notification';

describe('Notification', () => {
  test('handles submitReview from context', () => {
    // Mock the context value
    const mockSubmitReview = jest.fn();
    const mockContextValue = {
      submitReview: mockSubmitReview,
    };

    // Create a mock provider
    const MockProvider = ({ children }) => (
      <myContext.Provider value={mockContextValue}>
        {children}
      </myContext.Provider>
    );

    // Render the component with the mock provider
    render(
      <MockProvider>
        <Notification reportID={"1"} />
      </MockProvider>
    );

    // insert rating and comment values
    const ratingSelect = screen.getByTestId('selectRating');
    const commentInput = screen.getByPlaceholderText('Write your review here...');
    fireEvent.change(ratingSelect, { target: { value: '5' } });
    fireEvent.change(commentInput, { target: { value: 'Great service!' } });
    // Simulate user interaction
    fireEvent.click(screen.getByText('Submit Review')); // Replace with your button text

    // Assert that the mocked function was called

    expect(screen.getByTestId('reviewForm'))
      .toBeInTheDocument();
    expect(mockSubmitReview).toHaveBeenCalledWith("1", {
      rating: 5,
      comment: 'Great service!',
    });
  });
});