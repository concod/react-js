import { useState } from "react";
import "./rating.css";

type StarRatingProps = {
  stars?: number;
  rating: number;
  onChange: (value: number) => void;
};

const StarRating = ({ stars = 5, rating, onChange }: StarRatingProps) => {
  // Local state holds ONLY the transient hover preview (0 = not hovering).
  const [hovered, setHovered] = useState(0);
  const active = hovered || rating;

  // Given the mouse position within a star, return whether it's the left
  // half (value = i + 0.5) or the right half (value = i + 1).
  const valueFromMouse = (e: React.MouseEvent, i: number) => {
    const { left, width } = e.currentTarget.getBoundingClientRect();
    const isLeftHalf = e.clientX - left < width / 2;
    return isLeftHalf ? i + 0.5 : i + 1;
  };

  return (
    <div className="stars" onMouseLeave={() => setHovered(0)}>
      {Array.from({ length: stars }).map((_, i) => {
        // How much of THIS star is gold: 1 = full, 0.5 = half, 0 = empty.
        const fill = Math.max(0, Math.min(1, active - i));
        return (
          <span
            key={i}
            className="star-wrap"
            onMouseMove={(e) => setHovered(valueFromMouse(e, i))}
            onClick={(e) => onChange(valueFromMouse(e, i))}
          >
            <span className="star-bg">★</span>
            <span className="star-fg" style={{ width: `${fill * 100}%` }}>
              ★
            </span>
          </span>
        );
      })}
    </div>
  );
};

export default function Rating() {
  const [rating, setRating] = useState<number>(0);

  const onChange = (val: number) => setRating(val);

  return (
    <div>
      <StarRating stars={5} rating={rating} onChange={onChange} />
      <p style={{ color: "#94a3b8" }}>
        {rating ? `You rated ${rating} / 5` : "No rating yet"}
      </p>
      <button className="reset-btn" onClick={() => setRating(0)}>
        Reset
      </button>
    </div>
  );
};
