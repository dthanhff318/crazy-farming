import { useRef, useState, useEffect, type ReactNode } from "react";

interface ZoomPanContainerProps {
  children: ReactNode;
  minScale?: number;
  maxScale?: number;
  initialScale?: number;
  contentWidth?: number;
  contentHeight?: number;
}

interface Position {
  x: number;
  y: number;
}

interface TouchPoints {
  [key: number]: Position;
}

/**
 * Custom Zoom/Pan container optimized for mobile and desktop
 * Supports:
 * - Pinch to zoom on mobile touchscreen
 * - Pinch to zoom on MacBook trackpad (2 fingers in/out)
 * - Mouse wheel/trackpad scroll to pan
 * - Drag to pan (touch and mouse)
 * - Smooth animations
 */
export const ZoomPanContainer = ({
  children,
  minScale = 1,
  maxScale = 3,
  initialScale = 2.2,
  contentWidth = 4116,
  contentHeight = 2940,
}: ZoomPanContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [scale, setScale] = useState(initialScale);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });

  // For dragging
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<Position>({ x: 0, y: 0 });
  const [lastPosition, setLastPosition] = useState<Position>({ x: 0, y: 0 });

  // For pinch zoom
  const touchPointsRef = useRef<TouchPoints>({});
  const lastScaleRef = useRef(initialScale);
  const lastDistanceRef = useRef(0);

  // Center content on mount - focus on center of the map
  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      const containerRect = container.getBoundingClientRect();

      // Calculate the center point of the content (map)
      const contentCenterX = contentWidth / 2;
      const contentCenterY = contentHeight / 2;

      // Calculate position to center the map's center point in the viewport
      // Position = (viewport center) - (content center * scale)
      const centerX = containerRect.width / 2 - contentCenterX * initialScale;
      const centerY = containerRect.height / 2 - contentCenterY * initialScale;

      // Apply boundary constraints
      const constrainedPos = constrainPosition(
        { x: centerX, y: centerY },
        initialScale
      );

      setPosition(constrainedPos);
      setLastPosition(constrainedPos);
    }
  }, [initialScale, contentWidth, contentHeight]);

  // Calculate distance between two touch points
  const getDistance = (touches: TouchPoints): number => {
    const points = Object.values(touches);
    if (points.length < 2) return 0;

    const dx = points[0].x - points[1].x;
    const dy = points[0].y - points[1].y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Get center point between two touches
  const getCenter = (touches: TouchPoints): Position => {
    const points = Object.values(touches);
    if (points.length < 2) return points[0] || { x: 0, y: 0 };

    return {
      x: (points[0].x + points[1].x) / 2,
      y: (points[0].y + points[1].y) / 2,
    };
  };

  // Constrain position to content boundaries
  const constrainPosition = (pos: Position, currentScale: number): Position => {
    if (!containerRef.current) return pos;

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();

    // Calculate scaled content dimensions
    const scaledWidth = contentWidth * currentScale;
    const scaledHeight = contentHeight * currentScale;

    // Calculate boundaries
    // Max position is 0 (content aligned to top-left)
    // Min position ensures content doesn't go beyond bottom-right
    const maxX = 0;
    const maxY = 0;
    const minX = containerRect.width - scaledWidth;
    const minY = containerRect.height - scaledHeight;

    // If content is smaller than container, center it
    const constrainedX =
      scaledWidth < containerRect.width
        ? (containerRect.width - scaledWidth) / 2
        : Math.max(minX, Math.min(maxX, pos.x));

    const constrainedY =
      scaledHeight < containerRect.height
        ? (containerRect.height - scaledHeight) / 2
        : Math.max(minY, Math.min(maxY, pos.y));

    return { x: constrainedX, y: constrainedY };
  };

  // Handle wheel events (desktop/trackpad)
  const handleWheel = (e: WheelEvent) => {
    e.preventDefault();

    // Check if this is a pinch zoom gesture on trackpad (ctrlKey indicates pinch on most browsers)
    const isPinchZoom = e.ctrlKey;

    if (isPinchZoom) {
      // Trackpad pinch zoom
      const zoomSpeed = 0.01; // Adjust for sensitivity
      const delta = -e.deltaY * zoomSpeed; // Negative because deltaY is opposite
      const newScale = Math.max(minScale, Math.min(maxScale, scale + delta));

      if (newScale !== scale) {
        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        // Zoom towards cursor position
        const scaleRatio = newScale / scale;
        const newX = mouseX - (mouseX - position.x) * scaleRatio;
        const newY = mouseY - (mouseY - position.y) * scaleRatio;

        // Constrain to boundaries
        const constrainedPos = constrainPosition({ x: newX, y: newY }, newScale);

        setScale(newScale);
        setPosition(constrainedPos);
        setLastPosition(constrainedPos);
      }
    } else {
      // Regular scroll - pan the content
      const panSpeed = 1; // Adjust this for faster/slower panning
      const newX = position.x - e.deltaX * panSpeed;
      const newY = position.y - e.deltaY * panSpeed;

      // Constrain to boundaries
      const constrainedPos = constrainPosition({ x: newX, y: newY }, scale);

      setPosition(constrainedPos);
      setLastPosition(constrainedPos);
    }
  };

  // Mouse events for desktop dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click

    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    const newPos = {
      x: lastPosition.x + deltaX,
      y: lastPosition.y + deltaY,
    };

    // Constrain to boundaries
    const constrainedPos = constrainPosition(newPos, scale);
    setPosition(constrainedPos);
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      setLastPosition(position);
    }
  };

  // Touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    // Prevent default to avoid scrolling
    if (e.touches.length > 1) {
      e.preventDefault();
    }

    // Store all touch points
    touchPointsRef.current = {};
    for (let i = 0; i < e.touches.length; i++) {
      const touch = e.touches[i];
      touchPointsRef.current[touch.identifier] = {
        x: touch.clientX,
        y: touch.clientY,
      };
    }

    if (e.touches.length === 1) {
      // Single touch - start dragging
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      });
    } else if (e.touches.length === 2) {
      // Two touches - prepare for pinch zoom
      setIsDragging(false);
      lastDistanceRef.current = getDistance(touchPointsRef.current);
      lastScaleRef.current = scale;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 1) {
      e.preventDefault();
    }

    // Update touch points
    touchPointsRef.current = {};
    for (let i = 0; i < e.touches.length; i++) {
      const touch = e.touches[i];
      touchPointsRef.current[touch.identifier] = {
        x: touch.clientX,
        y: touch.clientY,
      };
    }

    if (e.touches.length === 1 && isDragging) {
      // Single touch - drag
      const deltaX = e.touches[0].clientX - dragStart.x;
      const deltaY = e.touches[0].clientY - dragStart.y;

      const newPos = {
        x: lastPosition.x + deltaX,
        y: lastPosition.y + deltaY,
      };

      // Constrain to boundaries
      const constrainedPos = constrainPosition(newPos, scale);
      setPosition(constrainedPos);
    } else if (e.touches.length === 2) {
      // Two touches - pinch zoom
      const currentDistance = getDistance(touchPointsRef.current);

      if (lastDistanceRef.current > 0) {
        const scaleChange = currentDistance / lastDistanceRef.current;
        const newScale = Math.max(
          minScale,
          Math.min(maxScale, lastScaleRef.current * scaleChange)
        );

        if (newScale !== scale) {
          const container = containerRef.current;
          if (!container) return;

          const rect = container.getBoundingClientRect();
          const center = getCenter(touchPointsRef.current);
          const centerX = center.x - rect.left;
          const centerY = center.y - rect.top;

          // Zoom towards pinch center
          const scaleRatio = newScale / scale;
          const newX = centerX - (centerX - position.x) * scaleRatio;
          const newY = centerY - (centerY - position.y) * scaleRatio;

          // Constrain to boundaries
          const constrainedPos = constrainPosition({ x: newX, y: newY }, newScale);

          setScale(newScale);
          setPosition(constrainedPos);
        }
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length === 0) {
      // All touches released
      setIsDragging(false);
      setLastPosition(position);
      lastDistanceRef.current = 0;
      lastScaleRef.current = scale;
      touchPointsRef.current = {};
    } else if (e.touches.length === 1) {
      // One touch remains - switch back to drag mode
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      });
      setLastPosition(position);
      lastDistanceRef.current = 0;
    }
  };

  // Add wheel event listener
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
    };
  }, [scale, position]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-hidden relative"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      style={{
        cursor: isDragging ? "grabbing" : "grab",
        touchAction: "none", // Prevent default touch behaviors
      }}
    >
      <div
        ref={contentRef}
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transformOrigin: "0 0",
          transition: isDragging ? "none" : "transform 0.1s ease-out",
          willChange: "transform",
        }}
      >
        {children}
      </div>
    </div>
  );
};
