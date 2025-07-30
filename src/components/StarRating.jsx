// src/components/StarRating.jsx
import { Star, StarHalf } from 'lucide-react';

export default function StarRating({ rating = 0 }) {
    const totalStars = 5;
    const stars = [];

    for (let i = 1; i <= totalStars; i++) {
        if (i <= rating) {
            // Estrela Cheia
            stars.push(<Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />);
        } else if (i - 0.5 <= rating) {
            // Meia Estrela
            stars.push(<StarHalf key={i} size={16} className="text-yellow-400 fill-yellow-400" />);
        } else {
            // Estrela Vazia
            stars.push(<Star key={i} size={16} className="text-gray-300 fill-gray-300" />);
        }
    }

    return <div className="flex items-center">{stars}</div>;
}
