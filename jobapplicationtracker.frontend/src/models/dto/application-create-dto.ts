import type { Status } from "../status";

export interface ApplicationCreateDto {
    position: string;
    companyName: string;
    applicationDate: Date;
    status: Status;
    notes?: string;
}