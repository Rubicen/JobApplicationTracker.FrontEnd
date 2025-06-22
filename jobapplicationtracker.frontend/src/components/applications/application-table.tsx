import React from 'react';
import type { Application } from '../../models/application';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Box, Button, createTheme, ThemeProvider, Toolbar, Tooltip, } from '@mui/material';
import { DataGrid, GridActionsCellItem, GridRowEditStopReasons, GridRowModes, ToolbarButton, type GridColDef, type GridEventListener, type GridRowId, type GridRowModesModel, type GridRowsProp, type GridSlotProps } from '@mui/x-data-grid';
import { StatusValues, type Status } from '../../models/status';
import { createApplication, deleteApplication, updateApplication } from '../../services/applicationservice';
import './application-table.css';
import { mapRowToApplication } from '../../models/application-mapper';
import type { ApplicationRow } from '../../models/application-row';
import AddItemToolbar from './add-item-toolbar';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { type AlertColor } from '@mui/material/Alert';

export interface ApplicationTableProps {
    applications: Application[];
}

declare module '@mui/x-data-grid' {
    interface ToolbarPropsOverrides {
        rows: ApplicationRow[];
        setRows: (oldRows: ApplicationRow[]) => void;
        setRowModesModel: (
            newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
        ) => void;
    }
}

const ApplicationTable: React.FC<ApplicationTableProps> = ({ applications }) => {
    const [rows, setRows] = React.useState<ApplicationRow[]>(applications);
    const [rowModesModel, setRowModesModel] = React.useState<GridRowModesModel>({});
    const [snackbarOpen, setSnackbarOpen] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const [snackbarSeverity, setSnackbarSeverity] = React.useState<AlertColor>('success');

    const handleSnackbarClose = () => setSnackbarOpen(false);
    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
        },
    });

    const paginationModel = { page: 0, pageSize: 10 };
    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'ID',
            minWidth: 120,
            flex: 0.2,
            type: 'number',
            sortable: true,
            hideable: false
        },
        {
            field: 'position',
            headerName: 'Position',
            minWidth: 120,
            flex: 0.2,
            editable: true
        },
        {
            field: 'companyName',
            headerName: 'Company Name',
            minWidth: 180,
            flex: 0.2,
            editable: true
        },
        {
            field: 'applicationDate',
            headerName: 'Application Date',
            minWidth: 180,
            flex: 0.2,
            type: 'date',
            valueFormatter: (value: Date) => value.toLocaleString(),
            editable: true
        },
        {
            field: 'status',
            headerName: 'Status',
            minWidth: 120,
            flex: 0.2,
            editable: true,
            cellClassName: 'status-dropdown',
            type: 'singleSelect',
            valueOptions: StatusValues
        },
        {
            field: 'notes',
            headerName: 'Notes',
            minWidth: 150,
            flex: 0.4,
            editable: true
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 85,
            maxWidth: 85,
            minWidth: 85,
            editable: false,
            getActions: ({ id }) => {
                const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
                if (isInEditMode) {
                    return [
                        <GridActionsCellItem
                            icon={<SaveIcon />}
                            label="Save"
                            material={{
                                sx: {
                                    color: 'primary.main',
                                },
                            }}
                            onClick={handleSaveClick(id)}
                        />,
                        <GridActionsCellItem
                            icon={<CancelIcon />}
                            label="Cancel"
                            className="textPrimary"
                            onClick={handleCancelClick(id)}
                            color="inherit"
                        />
                    ];
                }
                return [<GridActionsCellItem
                    icon={<EditIcon />}
                    label="Edit"
                    className="textPrimary"
                    onClick={handleEditClick(id)}
                    color="inherit"
                />,
                <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Delete"
                    onClick={handleDeleteClick(id)}
                    color="inherit"
                />];
            }
        }
    ];

    const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };

    const handleProcessRowUpdateError = (error: any) => {
        alert(`Update failed: ${error?.message || error}`);
    };

    const handleEditClick = (id: GridRowId) => () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
    }

    const handleSaveClick = (id: GridRowId) => async () => {
        setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
    };

    const handleCancelClick = (id: GridRowId) => () => {
        setRowModesModel({
            ...rowModesModel,
            [id]: { mode: GridRowModes.View, ignoreModifications: true },
        });

        // If row is new, remove it from the state
        if (rows.find((row) => row.id === id)?.isNew) {
            setRows(rows.filter((row) => row.id !== id as number));
        }
    }

    // Function to handle row deletion
    const handleDeleteClick = (id: GridRowId) => async () => {
        if (!rows.find((row) => row.id === id)?.isNew) {
            await deleteApplication(id as number);
            setSnackbarMessage('Application deleted successfully!');
            setSnackbarSeverity('success');
            setSnackbarOpen(true);
        }
        setRows(rows.filter((row) => row.id !== id as number));
    };

    // Function to handle row updates, either creating or updating an application
    const rowUpdate = async (newRow: ApplicationRow) => {
        let updatedRow: ApplicationRow;

        if (newRow.isNew) {
            const { id, ...appWithoutId } = mapRowToApplication(newRow);
            const createdApp = await createApplication(appWithoutId);
            updatedRow = { ...createdApp, isNew: false };
            setSnackbarMessage('Application created successfully!');
        } else {
            const updatedApp = await updateApplication(mapRowToApplication(newRow));
            updatedRow = { ...updatedApp, isNew: false };
            setSnackbarMessage('Application updated successfully!');
        }

        setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        return updatedRow;
    };

    return (
        <Box className="application-table-container">
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <MuiAlert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </MuiAlert>
            </Snackbar>
            <ThemeProvider theme={darkTheme}>
                <DataGrid
                    editMode="row"
                    rowModesModel={rowModesModel}
                    rows={rows}
                    columns={columns}
                    onRowEditStop={handleRowEditStop}
                    initialState={{
                        pagination: { paginationModel },
                        filter: {
                            filterModel: {
                                items: [],
                            },
                        },
                        columns: {
                            columnVisibilityModel: {
                                id: false
                            }
                        }
                    }}
                    processRowUpdate={rowUpdate}
                    onProcessRowUpdateError={handleProcessRowUpdateError}
                    pageSizeOptions={[10, 25, 50, { label: 'All', value: -1 }]}
                    slots={{ toolbar: AddItemToolbar }}
                    slotProps={{ toolbar: { rows, setRows, setRowModesModel } }}
                    showToolbar
                />
            </ThemeProvider>
        </Box>);
};



export default ApplicationTable;