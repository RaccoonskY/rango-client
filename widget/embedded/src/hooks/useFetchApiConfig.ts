import { useUiStore } from '../store/ui';
import { getConfig } from '../utils/configs';

export type Watermark = 'NONE' | 'FULL';

type ConfigResponse = {
  config: {
    watermark: Watermark;
  };
};

interface UseFetchApiConfig {
  fetchApiConfig: () => void;
}

export function useFetchApiConfig(): UseFetchApiConfig {
  const { setWatermark } = useUiStore();

  const fetchApiConfig: UseFetchApiConfig['fetchApiConfig'] = async () => {
    try {
      const response = await fetch(
        `${getConfig('BASE_URL')}/meta/dapp/config?apiKey=${getConfig(
          'API_KEY'
        )}`
      );

      if (!response.ok) {
        throw new Error(`Request failed with status: ${response.status} `);
      }

      const data: ConfigResponse = await response.json();

      setWatermark(data.config.watermark);
    } catch (error: any) {
      console.error(error.message || 'An error occurred during the fetch.');
    }
  };
  return { fetchApiConfig };
}
