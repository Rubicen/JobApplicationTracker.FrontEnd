import type { Status } from "../status";

export interface ApplicationUpdateDto {
    id: number;
    position: string;
    companyName: string;
    applicationDate: Date;
    status: Status;
    notes?: string;
}