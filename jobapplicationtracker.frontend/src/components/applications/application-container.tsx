import React, { useEffect, useState } from 'react';
import ApplicationTable from './application-table';
import { getApplications } from '../../services/applicationservice';
import type { Application } from '../../models/application';
import './application-container.css';

const ApplicationContainer: React.FC = () => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch applications from the backend when the component mounts, holding off from loading the table until data is available
    useEffect(() => {
        getApplications().then(apps => {
            setApplications(apps);
            setLoading(false);
        });
    }, []);

    return (
        <>
            {loading ? (
                <div>Loading applications...</div>
            ) :
                <ApplicationTable applications={applications} />
            }
        </>
    );
};

export default ApplicationContainer;