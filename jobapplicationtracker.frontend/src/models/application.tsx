import type { Status } from "./status";

export interface Application {
  id: number;
  jobTitle: string;
  companyName: string;
  applicationDate: Date;
  status: Status;
  notes?: string;
}