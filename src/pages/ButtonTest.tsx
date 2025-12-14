import { PixelButton } from "../components/PixelButton";

export const ButtonTest = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-farm-sky-100 to-farm-green-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-farm-brown-800 mb-8 text-center">
          Pixel Button Test
        </h1>

        <div className="bg-white rounded-2xl border-4 border-farm-brown-400 p-8 shadow-lg">
          {/* Primary Buttons */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-farm-brown-800 mb-4">
              Primary Buttons
            </h2>
            <div className="flex flex-wrap gap-4">
              <PixelButton variant="primary">Click Me!</PixelButton>
              <PixelButton variant="primary">Buy 💰 100</PixelButton>
              <PixelButton variant="primary">Upgrade</PixelButton>
              <PixelButton variant="primary" disabled>
                Disabled
              </PixelButton>
            </div>
          </div>

          {/* Secondary Buttons */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-farm-brown-800 mb-4">
              Secondary Buttons
            </h2>
            <div className="flex flex-wrap gap-4">
              <PixelButton variant="secondary">Cancel</PixelButton>
              <PixelButton variant="secondary">Back</PixelButton>
              <PixelButton variant="secondary" disabled>
                Disabled
              </PixelButton>
            </div>
          </div>

          {/* Success Buttons */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-farm-brown-800 mb-4">
              Success Buttons
            </h2>
            <div className="flex flex-wrap gap-4">
              <PixelButton variant="success">Harvest</PixelButton>
              <PixelButton variant="success">Collect 🌾</PixelButton>
              <PixelButton variant="success" disabled>
                Disabled
              </PixelButton>
            </div>
          </div>

          {/* Danger Buttons */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-farm-brown-800 mb-4">
              Danger Buttons
            </h2>
            <div className="flex flex-wrap gap-4">
              <PixelButton variant="danger">Sell</PixelButton>
              <PixelButton variant="danger">Delete</PixelButton>
              <PixelButton variant="danger" disabled>
                Disabled
              </PixelButton>
            </div>
          </div>

          {/* Different Sizes */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-farm-brown-800 mb-4">
              Different Sizes
            </h2>
            <div className="flex flex-wrap gap-4 items-end">
              <PixelButton
                variant="primary"
                className="text-sm px-4 py-2"
                style={{ minWidth: "80px", minHeight: "36px" }}
              >
                Small
              </PixelButton>
              <PixelButton variant="primary">Medium</PixelButton>
              <PixelButton
                variant="primary"
                className="text-lg px-8 py-4"
                style={{ minWidth: "160px", minHeight: "60px" }}
              >
                Large
              </PixelButton>
            </div>
          </div>

          {/* Interactive Demo */}
          <div>
            <h2 className="text-2xl font-bold text-farm-brown-800 mb-4">
              Interactive Demo
            </h2>
            <div className="flex flex-wrap gap-4">
              <PixelButton
                variant="primary"
                onClick={() => alert("Button clicked!")}
              >
                Alert Test
              </PixelButton>
              <PixelButton
                variant="success"
                onClick={() => console.log("Success action!")}
              >
                Console Test
              </PixelButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
