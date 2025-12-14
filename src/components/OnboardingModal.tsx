import { useState } from 'react';
import { PixelButton } from './PixelButton';

interface OnboardingModalProps {
  onComplete: (farmerName: string) => void;
}

export const OnboardingModal = ({ onComplete }: OnboardingModalProps) => {
  const [farmerName, setFarmerName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!farmerName.trim()) {
      setError('Please enter your farmer name');
      return;
    }

    if (farmerName.trim().length < 2) {
      setError('Farmer name must be at least 2 characters');
      return;
    }

    onComplete(farmerName.trim());
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl border-4 border-farm-green-400 p-8 max-w-md w-full shadow-2xl">
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🌾</div>
          <h2 className="text-2xl font-bold text-farm-brown-800 mb-2">
            Welcome to Crazy Farming!
          </h2>
          <p className="text-farm-brown-600">
            Let's start your farming adventure
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="farmerName"
              className="block text-sm font-semibold text-farm-brown-800 mb-2"
            >
              What's your farmer name?
            </label>
            <input
              id="farmerName"
              type="text"
              value={farmerName}
              onChange={(e) => {
                setFarmerName(e.target.value);
                setError('');
              }}
              placeholder="Enter your farmer name"
              className="w-full px-4 py-3 rounded-xl border-2 border-farm-brown-300 focus:border-farm-green-400 focus:outline-none transition-colors"
              autoFocus
            />
            {error && (
              <p className="text-red-600 text-sm mt-2">{error}</p>
            )}
          </div>

          <PixelButton
            type="submit"
            variant="success"
            className="w-full"
            style={{ minHeight: "56px" }}
          >
            Start Farming! 🚜
          </PixelButton>
        </form>
      </div>
    </div>
  );
};
