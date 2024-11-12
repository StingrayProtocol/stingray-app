import { SuiService } from "@/service";
import { getFullnodeUrl } from "@mysten/sui/client";

export const formatPrice = (price: number) => {
  return Intl.NumberFormat().format(price);
};

export const formatSuiPrice = (price: number) => {
  return Intl.NumberFormat().format(price / 10 ** 9);
};

export const getRelativeTime = (timestamp: number) => {
  const day = Number(
    ((Date.now() / 1000 - timestamp / 1000) / (60 * 60 * 24)).toFixed(0)
  );
  const hour = Number(
    ((Date.now() / 1000 - timestamp / 1000) / (60 * 60)).toFixed(0)
  );
  const minute = Number(
    ((Date.now() / 1000 - timestamp / 1000) / 60).toFixed(0)
  );
  const second = Number((Date.now() / 1000 - timestamp / 1000).toFixed(0));

  if (!day && !hour && !minute) {
    return `${second} seconds ago`;
  }
  if (!day && !hour) {
    return `${minute} minutes ago`;
  }
  if (!day) {
    return `${hour} hours ago`;
  }
  return `${day} days ago`;
};

export const formatAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const toTimestampms = (d: number) => {
  switch (d) {
    case 0:
      return 1000 * 60 * 60 * 24;
    case 1:
      return 1000 * 60 * 60 * 24 * 7;
    case 2:
      return 1000 * 60 * 60 * 24 * 30;
    case 3:
      return 1000 * 60 * 60 * 24 * 365;
    default:
      return 0;
  }
};

export const getSuiService = () => {
  const rpcUrl = getFullnodeUrl("mainnet");
  const suiService = new SuiService({
    url: process.env.NEXT_PUBLIC_SUI_NETWORK_URL ?? rpcUrl,
  });
  return suiService;
};

export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = 3,
  timeout = 5000,
  otherUrls: string[] = []
) {
  let attempts = 0;

  while (attempts < retries) {
    attempts++;
    const controller = new AbortController();
    const { signal } = controller;
    const fetchOptions = { ...options, signal };

    // Start a timeout to abort the request
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const target = otherUrls?.[attempts - 2] || url;
      console.log(target);
      const response = await fetch(target, fetchOptions);
      clearTimeout(timeoutId); // Clear the timeout if the fetch is successful

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return response;
    } catch (e: unknown) {
      const error = e as Error;
      clearTimeout(timeoutId); // Clear the timeout on error too

      if (error.name === "AbortError") {
        console.warn(`Request timed out (Attempt ${attempts}/${retries})`);
      } else {
        console.warn(
          `Fetch error: ${error?.message} (Attempt ${attempts}/${retries})`
        );
      }

      // Retry only if attempts remain
      if (attempts >= retries) {
        throw new Error(`Fetch failed after ${retries} attempts`);
      }
    }
  }
}
