import { useEffect, useState } from "react";
import { PixelCard } from "./PixelCard";

export const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{
        backgroundImage: "url(/assets/objects/sea.png)",
        backgroundSize: "96px 96px",
        backgroundRepeat: "repeat",
        imageRendering: "pixelated",
      }}
    >
      {/* Main Content */}
      <div className="text-center justify-center z-10 w-[90%] max-w-[500px]">
        {/* Title */}
        <div
          className="flex flex-col items-start gap-3"
          style={{
            fontFamily: "Pixel",
          }}
        >
          <img
            src="/assets/objects/boat.gif"
            alt="Crazy"
            className="w-[206px] h-[90px] pixelated"
          />
          <h1
            className="text-6xl font-bold pixelated text-left text-farm-peach-500 ml-5"
            style={{
              textShadow: `
                  -2px -2px 0 #fff,
                  2px -2px 0 #fff,
                  -2px 2px 0 #fff,
                  2px 2px 0 #fff,
                  -3px 0 0 #fff,
                  3px 0 0 #fff,
                  0 -3px 0 #fff,
                  0 3px 0 #fff
                `,
            }}
          >
            CRAZY
          </h1>
          <h1
            className="text-7xl font-bold pixelated text-left text-farm-green-500 ml-5"
            style={{
              textShadow: `
                -2px -2px 0 #fff,
                2px -2px 0 #fff,
                -2px 2px 0 #fff,
                2px 2px 0 #fff,
                -3px 0 0 #fff,
                3px 0 0 #fff,
                0 -3px 0 #fff,
                0 3px 0 #fff
              `,
            }}
          >
            FARMING
          </h1>
        </div>

        {/* Version */}
        <div className="fixed bottom-4 left-[50%] translate-x-[-50%] text-xl font-semibold inline-block pixelated text-[#3b4c2b]">
          v0.0.1 Beta
        </div>

        <img
          src="/assets/objects/goblin_swimming.gif"
          alt="Sunflower"
          className="w-[252px] h-[168px] pixelated fixed bottom-20 right-40"
        />

        {/* Loading Bar */}
        <PixelCard className="mt-4 mx-auto w-[90%] max-w-[500px] h-[46px]">
          <div
            className="relative h-full pixelated"
            style={{
              overflow: "hidden",
            }}
          >
            {/* Progress Fill */}
            <div
              className="h-full transition-all duration-300 ease-out"
              style={{
                width: `${progress}%`,
                backgroundColor: "#F4D4A0",
              }}
            />

            {/* Loading Text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="text-xl font-bold pixelated"
                style={{
                  color: "#3D5C1E",
                  textShadow: "1px 1px 0 rgba(255,255,255,0.5)",
                }}
              >
                Loading...
              </span>
            </div>
          </div>
        </PixelCard>
      </div>
    </div>
  );
};
