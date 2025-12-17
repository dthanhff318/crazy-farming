import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import type { Database } from "../lib/database.types";

type UserData = Database["public"]["Tables"]["users"]["Row"];
type BuildingType = Database["public"]["Tables"]["building_types"]["Row"];

interface FarmSectionProps {
  userData: UserData | null;
  onBuildingClick: (building: BuildingType, userBuildingId: string) => void;
  onOpenShop?: () => void;
}

/**
 * FarmSection - Main farm gameplay area with zoom and pan functionality
 */
export const FarmSection = (_props: FarmSectionProps) => {
  return (
    <div className="w-full h-full bg-gradient-to-b from-farm-sky-100 to-farm-green-100">
      <TransformWrapper
        initialScale={2.5}
        minScale={0.5}
        maxScale={3}
        centerOnInit={true}
        wheel={{ step: 0.1 }}
        pinch={{ step: 5 }}
        doubleClick={{ disabled: false, mode: "zoomIn", step: 0.3 }}
      >
        {() => (
          <>
            <div className="absolute top-24 left-4 z-10 sm:top-20"></div>

            {/* Farm Land - Zoomable and Pannable */}
            <TransformComponent
              wrapperClass="!w-full !h-full w-[4116px] h-[2940px]"
              contentClass="!w-full !h-full flex items-center justify-center"
            >
              <div
                className="flex justify-center items-center p-8"
                style={{
                  backgroundImage: "url(/assets/objects/sea.png)",
                  backgroundSize: "48px 48px",
                  backgroundRepeat: "repeat",
                  imageRendering: "pixelated",
                  minWidth: "100vw",
                  minHeight: "100vh",
                }}
              >
                <img
                  src="/assets/objects/main-land.png"
                  alt="Farm Land"
                  className="pixelated"
                  style={{ imageRendering: "pixelated", maxWidth: "800px" }}
                />
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
};
