import React, { useState } from 'react';
import { Star } from 'lucide-react';

export const StarRating = ({
  rating = 0,
  maxStars = 5,
  size = 'md',
  interactive = false,
  onChange = () => {},
  showValue = true,
  count = null,
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
    xl: 'w-9 h-9',
  };

  const ratingDescriptions = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent',
  };

  const activeRating = interactive && hoverRating > 0 ? hoverRating : rating;

  return (
    <div className="inline-flex items-center gap-1.5">
      <div className="flex items-center">
        {Array.from({ length: maxStars }, (_, index) => {
          const starValue = index + 1;
          const isFilled = activeRating >= starValue;
          const isHalf = !isFilled && activeRating >= starValue - 0.5;

          return (
            <button
              key={starValue}
              type="button"
              disabled={!interactive}
              onClick={() => interactive && onChange(starValue)}
              onMouseEnter={() => interactive && setHoverRating(starValue)}
              onMouseLeave={() => interactive && setHoverRating(0)}
              className={`p-0.5 transition-transform ${
                interactive
                  ? 'cursor-pointer hover:scale-110 focus:outline-none'
                  : 'cursor-default'
              }`}
              title={interactive ? `${starValue} Star - ${ratingDescriptions[starValue]}` : `${rating} out of 5`}
            >
              <Star
                className={`${sizeClasses[size] || sizeClasses.md} ${
                  isFilled
                    ? 'text-amber-400 fill-amber-400'
                    : isHalf
                    ? 'text-amber-400 fill-amber-400/50'
                    : 'text-slate-300'
                } transition-colors duration-150`}
              />
            </button>
          );
        })}
      </div>

      {showValue && (
        <span className="text-sm font-semibold text-slate-700 ml-1">
          {rating > 0 ? rating.toFixed(1) : 'No ratings'}
        </span>
      )}

      {count !== null && (
        <span className="text-xs text-slate-500">
          ({count} {count === 1 ? 'rating' : 'ratings'})
        </span>
      )}

      {interactive && hoverRating > 0 && (
        <span className="text-xs font-medium text-amber-600 ml-2 animate-fade-in">
          {ratingDescriptions[hoverRating]}
        </span>
      )}
    </div>
  );
};
