import type { FC } from 'react';
import { useCustomCursor } from '../hooks/useCustomCursor';

const CustomCursor: FC = () => {
  const { position, isHovering, isMobile } = useCustomCursor();

  if (isMobile) return null;

  return (
    <>
      {/* Main cursor */}
      <div
        className={`cursor ${isHovering ? 'hover' : ''}`}
        style={{
          left: position.x,
          top: position.y,
        }}
      />
      
      {/* Cursor dot */}
      <div
        className="cursor-dot"
        style={{
          left: position.x,
          top: position.y,
        }}
      />
    </>
  );
};

export default CustomCursor;