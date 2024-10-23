import axios, { AxiosResponse } from "axios";

const endpoints: string[] = import.meta.env.VITE_CONSUMET_API_ENDPOINTS.split(',');

export const consumetZoro = async (query: string | null): Promise<AxiosResponse<any, any>> => {
  const endpointsCopy = [...endpoints];

  for (let i = 0; i < endpointsCopy.length; i++) {
    const randomIndex = Math.floor(Math.random() * endpointsCopy.length);
    const randomEndpoint = endpointsCopy.splice(randomIndex, 1)[0];
    const url = `${randomEndpoint}/anime/zoro/${query}`;

    try {
      const response = await axios.get(url);
      return response;
    } catch (error) {
      if (i === endpointsCopy.length - 1) {
        throw new Error("All endpoints failed");
      }
    }
  }

  return {} as AxiosResponse<any, any>;
};