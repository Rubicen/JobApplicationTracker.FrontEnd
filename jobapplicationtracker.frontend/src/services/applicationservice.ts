import axios from 'axios';
import type { Application } from '../models/application';
import { toApplicationCreateDto, toApplicationUpdateDto } from '../models/application-mapper';

const API_BASE_URL = '/api/applications';

// Service functions to interact with the backend API for job applications

// Fetch all applications
export async function getApplications(): Promise<Application[]> {
    const response = await axios.get<Application[]>(API_BASE_URL);
    return parseApplicationDates(response.data);
}

// Fetch a single application by ID
export async function getApplicationById(id: number): Promise<Application> {
    const response = await axios.get<Application>(`${API_BASE_URL}/${id}`);
    return parseApplicationDate(response.data);
}

// Create a new application
export async function createApplication(application: Omit<Application, 'id'>): Promise<Application> {
    const response = await axios.post<Application>(API_BASE_URL, toApplicationCreateDto(application));
    return parseApplicationDate(response.data);
}

// Update an existing application   
export async function updateApplication(application: Application): Promise<Application> {
    const response = await axios.put<Application>(API_BASE_URL, toApplicationUpdateDto(application));
    return parseApplicationDate(response.data);
}

// Delete an application by ID
export async function deleteApplication(id: number): Promise<void> {
    await axios.delete(`${API_BASE_URL}/${id}`);
}

//Helpers
function parseApplicationDate(apps: Application): Application {
    return {
        ...apps,
        applicationDate: new Date(apps.applicationDate)
    };
}
function parseApplicationDates(apps: Application[]): Application[] {
    return apps.map(app => ({
        ...app,
        applicationDate: new Date(app.applicationDate)
    }));
}