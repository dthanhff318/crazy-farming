import { useState } from "react";
import { PixelButton } from "./PixelButton";
import { PixelCard } from "./PixelCard";

interface OnboardingModalProps {
  onComplete: (farmerName: string) => void;
}

export const OnboardingModal = ({ onComplete }: OnboardingModalProps) => {
  const [farmerName, setFarmerName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!farmerName.trim()) {
      return;
    }

    if (farmerName.trim().length < 2) {
      return;
    }

    onComplete(farmerName.trim());
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <PixelCard
        className="p-8 max-w-md w-full shadow-2xl"
        backgroundColor="var(--color-card-bg)"
      >
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold mb-2">Welcome to Crazy Farming!</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="farmerName"
              className="block text-2xl font-semibold mb-2"
            >
              What's your farmer name?
            </label>
            <input
              id="farmerName"
              type="text"
              value={farmerName}
              onChange={(e) => {
                setFarmerName(e.target.value);
              }}
              placeholder="Enter your farmer name"
              className="w-full px-4 py-3 rounded-xl border-2 outline-none border-farm-brown-300 text-2xl"
              autoFocus
            />
          </div>

          <PixelButton
            type="submit"
            className="w-full text-2xl"
            style={{ minHeight: "56px" }}
            disabled={farmerName.trim() === ""}
          >
            Start adventure!
          </PixelButton>
        </form>
      </PixelCard>
    </div>
  );
};
