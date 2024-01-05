import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // Import jest-dom for better assertions
import ReviewForm from '../../../communityforum/notifications/ReviewForm';
import myContext from '../../../../context/data/myContext';

describe('ReviewForm Component', () => {
  const mockSubmitReview = jest.fn();

  const renderWithContext = (ui) => {
    const mockContextValue = {
      submitReview: mockSubmitReview,
    };

    return render(
      <myContext.Provider value={mockContextValue}>
        {ui}
      </myContext.Provider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders the ReviewForm component', () => {
    renderWithContext(<ReviewForm reportID="12345" />);

    // Check if the form elements are rendered
    expect(screen.getByText('Leave a Review')).toBeInTheDocument();
    expect(screen.getByTestId("selectRating")).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Write your review here...')).toBeInTheDocument();
    expect(screen.getByText('Submit Review')).toBeInTheDocument();
  });

  test('shows an alert if the form is submitted without a rating or comment', () => {
    window.alert = jest.fn(); // Mock the alert function

    renderWithContext(<ReviewForm reportID="12345" />);

    // Submit the form without filling out fields
    const submitButton = screen.getByText('Submit Review');
    fireEvent.click(submitButton);

    // Check if the alert is shown
    expect(window.alert).toHaveBeenCalledWith('Va rugam sa lasati o nota si un mesaj lucrarilor efectuate.');
    expect(mockSubmitReview).not.toHaveBeenCalled();
  });

  test('calls submitReview with correct data when the form is submitted', () => {
    renderWithContext(<ReviewForm reportID="12345" />);

    // Fill out the form
    const ratingSelect = screen.getByTestId('selectRating');
    const commentInput = screen.getByPlaceholderText('Write your review here...');
    fireEvent.change(ratingSelect, { target: { value: '5' } });
    fireEvent.change(commentInput, { target: { value: 'Great service!' } });

    // Submit the form
    const submitButton = screen.getByText('Submit Review');
    fireEvent.click(submitButton);

    // Check if submitReview was called with the correct arguments
    expect(mockSubmitReview).toHaveBeenCalledTimes(1);
    expect(mockSubmitReview).toHaveBeenCalledWith('12345', {
      rating: 5,
      comment: 'Great service!',
    });

    // Check if the form fields are reset
    expect(ratingSelect.value).toBe('0');
    expect(commentInput.value).toBe('');
  });
});