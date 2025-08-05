import React, { useState } from 'react';

const Tooltip = ({ children, content, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2',
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className={`absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg whitespace-nowrap ${positionClasses[position]}`}
        >
          {content}
          <div
            className={`absolute w-0 h-0 border-4 border-solid ${
              position === 'top'
                ? 'top-full left-1/2 transform -translate-x-1/2 border-gray-900 border-b-transparent border-l-transparent border-r-transparent'
                : position === 'bottom'
                  ? 'bottom-full left-1/2 transform -translate-x-1/2 border-gray-900 border-t-transparent border-l-transparent border-r-transparent'
                  : position === 'left'
                    ? 'left-full top-1/2 transform -translate-y-1/2 border-gray-900 border-r-transparent border-t-transparent border-b-transparent'
                    : 'right-full top-1/2 transform -translate-y-1/2 border-gray-900 border-l-transparent border-t-transparent border-b-transparent'
            }`}
          ></div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
