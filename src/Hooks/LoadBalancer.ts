import axios, { AxiosResponse } from "axios";

const endpoint: string = import.meta.env.VITE_CONSUMET_API_ENDPOINTS;

export const consumetZoro = async (query: string | null): Promise<AxiosResponse<any, any>> => {
  // const endpoint = endpoint[0];
  const url = `${endpoint}/anime/zoro/${query}`;

  try {
    const response = await axios.get(url);
    return response;
  } catch (error) {
    throw new Error("Endpoint failed");
  }
};