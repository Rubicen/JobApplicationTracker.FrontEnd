import type { Status } from "../status";

export interface ApplicationCreateDto {
    jobTitle: string;
    companyName: string;
    applicationDate: Date;
    status: Status;
    notes?: string;
}