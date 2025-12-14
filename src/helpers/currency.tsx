/**
 * Currency helper functions
 */

export type CurrencyType = "coin" | "gem" | "token";

/**
 * Get the URL for a currency icon
 * @param currencyType - The type of currency
 * @returns The URL path to the currency image
 */
export const getCurrencyIconUrl = (currencyType: CurrencyType = "coin"): string => {
  const currencyPaths: Record<CurrencyType, string> = {
    coin: "/assets/currencies/coin.png",
    gem: "/assets/currencies/gem.png",
    token: "/assets/currencies/token.png",
  };

  return currencyPaths[currencyType];
};

/**
 * Currency icon component - renders a currency icon image
 * @param currencyType - The type of currency (default: "coin")
 * @param size - The size of the icon in pixels (default: 16)
 * @param className - Additional CSS classes
 */
interface CurrencyIconProps {
  currencyType?: CurrencyType;
  size?: number;
  className?: string;
}

export const CurrencyIcon = ({
  currencyType = "coin",
  size = 16,
  className = ""
}: CurrencyIconProps) => {
  return (
    <img
      src={getCurrencyIconUrl(currencyType)}
      alt={currencyType}
      width={size}
      height={size}
      className={`inline-block ${className}`}
      style={{ imageRendering: "pixelated" }}
    />
  );
};
