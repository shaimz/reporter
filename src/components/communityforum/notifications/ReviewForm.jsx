import React, { useState, useContext } from 'react';
import myContext from '../../../context/data/myContext';

const ReviewForm = ({ reportID }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
const context = useContext(myContext);
const { submitReview } = context;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0 || comment.trim() === '') {
      alert('Va rugam sa lasati o nota si un mesaj lucrarilor efectuate.');
      return;
    }
    submitReview(reportID, { rating, comment });
    setRating(0);
    setComment('');
  };

  return (
    <div className="w-full mt-4 bg-gray-800 p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-white">Leave a Review</h3>
      <form onSubmit={handleSubmit} className="mt-2" data-testid="reviewForm">
        <div className="mb-4">
          <label className="block text-sm text-gray-300 mb-1" htmlFor='rating'>Rating (1-5):</label>
          <select
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full p-2 rounded bg-gray-700 text-white"
            data-testid='selectRating'
          >
            <option value={0} disabled>
              Select Rating
            </option>
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor='comment' className="block text-sm text-gray-300 mb-1">Comment:</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="3"
            className="w-full p-2 rounded bg-gray-700 text-white"
            placeholder="Write your review here..."
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-all"
        >
          Submit Review
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;