import type { Application } from './application';
import type { ApplicationRow } from './application-row';
import type { ApplicationCreateDto } from './dto/application-create-dto';
import type { ApplicationUpdateDto } from './dto/application-update-dto';

export function mapRowToApplication(row: ApplicationRow): Application {
  const { isNew, ...application } = row;
  return application;
}

export function mapApplicationToRow(application: Application): ApplicationRow {
  return { ...application, isNew: false };
}


export function toApplicationCreateDto(app: Omit<Application, 'id'>): ApplicationCreateDto {
    return {
        position: app.position,
        companyName: app.companyName,
        applicationDate: app.applicationDate,
        status: app.status,
        notes: app.notes
    };
}

export function toApplicationUpdateDto(app: Application): ApplicationUpdateDto {
    return {
        id: app.id,
        position: app.position,
        companyName: app.companyName,
        applicationDate: app.applicationDate,
        status: app.status,
        notes: app.notes
    };
}