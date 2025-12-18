import { useRef, useState, useEffect, ReactNode } from "react";

interface ZoomPanContainerProps {
  children: ReactNode;
  minScale?: number;
  maxScale?: number;
  initialScale?: number;
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

  // Center content on mount
  useEffect(() => {
    if (containerRef.current && contentRef.current) {
      const container = containerRef.current;
      const content = contentRef.current;

      const containerRect = container.getBoundingClientRect();
      const contentRect = content.getBoundingClientRect();

      const centerX = (containerRect.width - contentRect.width * initialScale) / 2;
      const centerY = (containerRect.height - contentRect.height * initialScale) / 2;

      setPosition({ x: centerX, y: centerY });
      setLastPosition({ x: centerX, y: centerY });
    }
  }, [initialScale]);

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

        setScale(newScale);
        setPosition({ x: newX, y: newY });
        setLastPosition({ x: newX, y: newY });
      }
    } else {
      // Regular scroll - pan the content
      const panSpeed = 1; // Adjust this for faster/slower panning
      const newX = position.x - e.deltaX * panSpeed;
      const newY = position.y - e.deltaY * panSpeed;

      setPosition({ x: newX, y: newY });
      setLastPosition({ x: newX, y: newY });
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

    setPosition({
      x: lastPosition.x + deltaX,
      y: lastPosition.y + deltaY,
    });
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

      setPosition({
        x: lastPosition.x + deltaX,
        y: lastPosition.y + deltaY,
      });
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

          setScale(newScale);
          setPosition({ x: newX, y: newY });
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
