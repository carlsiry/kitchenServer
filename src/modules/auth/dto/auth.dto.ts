import { User } from "./user.dto";

export interface Auth {
    username: string;
    password: string;
    channelId: string;
    token?: string;
}