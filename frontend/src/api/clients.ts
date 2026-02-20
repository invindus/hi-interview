import { AxiosInstance } from "axios";

import { Client, CreateClientPayload } from "@/types/clients";


export default class ClientsApi {
    private axiosInstance: AxiosInstance;

    constructor(axiosInstance: AxiosInstance) {
        this.axiosInstance = axiosInstance;
    }

    // Get details for a single client by ID
    public getClient = async (id: string): Promise<Client> => {
      const response = await this.axiosInstance.get<Client>(`client/${id}`);
        return response.data;
    };

    // Get list of all clients
    public listClients = async (): Promise<Client[]> => {
        const response = await this.axiosInstance.get<{ data: Client[] }>("client");
        return response.data.data;
    };

    // Create a new client
    public createClient = async (payload: CreateClientPayload): Promise<Client> => {
        const response = await this.axiosInstance.post<Client>("client", payload);
        return response.data;
    };
}
