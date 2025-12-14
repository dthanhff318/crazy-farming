import { useState } from "react";
import { CommonModal } from "./CommonModal";
import { PixelButton } from "./PixelButton";
import { CurrencyIcon } from "../helpers/currency";
import { Tabs, TabList, TabButton, TabPanel } from "./Tabs";

/**
 * GranarySection - Storage for harvested crops and resources
 */
export const GranarySection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="w-full h-full overflow-y-auto bg-gradient-to-b from-farm-green-100 to-farm-sky-100">
      <div className="px-4 py-20 pb-24 max-w-[600px] mx-auto sm:px-3 sm:pt-[70px] sm:pb-[90px]">
        <h2 className="text-2xl font-bold text-farm-brown-800 mb-6 text-center sm:text-xl sm:mb-5">
          👩‍🌾 Granary
        </h2>

        {/* Tabs */}
        <Tabs defaultTab="basket">
          <TabList>
            <TabButton tab="basket" isFirst={true} icon="🧺">
              Basket
            </TabButton>
            <TabButton tab="chest" icon="📦">
              Chest
            </TabButton>
          </TabList>

          <TabPanel tab="basket">
            <div
              className=""
              style={{
                borderStyle: "solid",
                borderWidth: "12px",
                borderImageSource: "url(/assets/border/light-border.png)",
                borderImageSlice: "4 4 4 4",
                borderImageRepeat: "stretch",
                imageRendering: "pixelated",
                borderRadius: "var(--radius-pixel)",
                backgroundColor: "var(--color-card-bg)",
              }}
            >
              <p className="m-0 text-farm-brown-700 text-base text-center sm:text-sm">
                Basket Content
              </p>
              <p className="m-0 text-farm-brown-700 text-base text-center sm:text-sm">
                Store and manage your harvested crops
              </p>

              {/* Test Modal Button */}
              <PixelButton
                variant="primary"
                onClick={() => setIsModalOpen(true)}
                className="mt-4"
              >
                Test Modal
              </PixelButton>
            </div>
          </TabPanel>

          <TabPanel tab="chest">
            <div
              className=""
              style={{
                borderStyle: "solid",
                borderWidth: "12px",
                borderImageSource: "url(/assets/border/light-border.png)",
                borderImageSlice: "4 4 4 4",
                borderImageRepeat: "stretch",
                imageRendering: "pixelated",
                borderRadius: "var(--radius-pixel)",
                backgroundColor: "var(--color-card-bg)",
              }}
            >
              <p className="m-0 text-farm-brown-700 text-base text-center sm:text-sm">
                Chest Content
              </p>
              <p className="m-0 text-farm-brown-700 text-base text-center sm:text-sm">
                Store special items and valuables
              </p>
            </div>
          </TabPanel>
        </Tabs>
      </div>

      {/* Test Modal */}
      <CommonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="🌻 Sunflower"
        maxWidth="600px"
      >
        <div className="space-y-4">
          {/* Item Image */}
          <div className="flex justify-center">
            <img
              src="/assets/seeds/sunflower.png"
              alt="Sunflower"
              width={80}
              height={80}
              style={{ imageRendering: "pixelated" }}
            />
          </div>

          {/* Description */}
          <p
            className="text-center text-base italic"
            style={{ color: "var(--color-text-primary)", opacity: 0.8 }}
          >
            A sunny flower that brightens your farm
          </p>

          {/* Stats */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between bg-farm-green-200 px-4 py-2 rounded-lg">
              <span
                className="text-sm font-semibold"
                style={{ color: "var(--color-text-primary)" }}
              >
                Growth Time
              </span>
              <span
                className="text-sm font-bold"
                style={{ color: "var(--color-text-primary)" }}
              >
                ⏱️ 4h
              </span>
            </div>

            <div className="flex items-center justify-between bg-farm-yellow-200 px-4 py-2 rounded-lg">
              <span
                className="text-sm font-semibold"
                style={{ color: "var(--color-text-primary)" }}
              >
                Harvest Value
              </span>
              <span
                className="text-sm font-bold flex items-center gap-1"
                style={{ color: "var(--color-text-primary)" }}
              >
                <CurrencyIcon size={14} /> 50
              </span>
            </div>

            <div className="flex items-center justify-between bg-farm-sky-200 px-4 py-2 rounded-lg">
              <span
                className="text-sm font-semibold"
                style={{ color: "var(--color-text-primary)" }}
              >
                Purchase Price
              </span>
              <span
                className="text-sm font-bold flex items-center gap-1"
                style={{ color: "var(--color-text-primary)" }}
              >
                <CurrencyIcon size={14} /> 20
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <PixelButton
              variant="success"
              className="flex-1"
              onClick={() => {
                alert("Buy clicked!");
                setIsModalOpen(false);
              }}
            >
              Buy
            </PixelButton>
            <PixelButton
              variant="secondary"
              className="flex-1"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </PixelButton>
          </div>
        </div>
      </CommonModal>
    </div>
  );
};
