import { AxiosInstance } from "axios";

import { User, ListUsersParams } from "@/types/users";


export default class UsersApi {
    private axiosInstance: AxiosInstance;

    constructor(axiosInstance: AxiosInstance) {
        this.axiosInstance = axiosInstance;
    }

    // List all users (optional email search)
    public listUsers = async (params?: ListUsersParams): Promise<User[]> => {
        const response = await this.axiosInstance.get<{ data: User[] }>("users");
        return response.data.data;
    };
}