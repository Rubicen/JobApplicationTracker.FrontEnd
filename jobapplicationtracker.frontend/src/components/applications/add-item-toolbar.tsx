import React, { useRef } from "react";
import { Toolbar, Tooltip, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { StatusValues, type Status } from "../../models/status";
import type { ApplicationRow } from "../../models/application-row";
import { GridRowModes, type GridRowModesModel } from "@mui/x-data-grid";
import './add-item-toolbar.css';

interface AddItemToolbarProps {
    rows: ApplicationRow[];
    setRows: (rows: ApplicationRow[]) => void;
    setRowModesModel: (
        newModel: (oldModel: GridRowModesModel) => GridRowModesModel,
    ) => void;
}

const AddItemToolbar: React.FC<AddItemToolbarProps> = ({ rows, setRows, setRowModesModel }) => {

    // Use a ref to keep track of the next unique ID, to prevent ID collisions on new additions
    const nextId = useRef<number>(-1);
    const getUniqueId = () => {
        while (rows.some(row => row.id === nextId.current)) {
            {
                nextId.current -= 1;
            }
        }
        return nextId.current--;
    }

    const handleClick = () => {
        const id = getUniqueId();
        setRows([
            ...rows,
            {
                id,
                position: "",
                companyName: "",
                applicationDate: new Date(),
                status: StatusValues[0] as Status,
                notes: "",
                isNew: true,
            },
        ]);
        setRowModesModel((oldModel: GridRowModesModel) => ({
            ...oldModel,
            [id]: { mode: GridRowModes.Edit, fieldToFocus: "position" },
        }));
    };

    return (
        <Toolbar>
            <div style={{ flexGrow: 1 }} />
            <Tooltip title="Add record">
                <Button
                    onClick={handleClick}
                    startIcon={<AddIcon fontSize="small" />}
                    className="add-button"
                ></Button>
            </Tooltip>
        </Toolbar>
    );
};

export default AddItemToolbar;