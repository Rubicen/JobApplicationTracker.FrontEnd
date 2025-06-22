import type { Application } from "./application";

export interface ApplicationRow extends Application {
    isNew?: boolean;
}