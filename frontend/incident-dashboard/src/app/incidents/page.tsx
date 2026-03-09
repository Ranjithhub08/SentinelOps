import IncidentTable from '@/components/IncidentTable';

export default function IncidentsPage() {
    return (
        <div className="h-full flex flex-col">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-rose-400 mb-6">
                Active Incidents
            </h2>
            <div className="flex-1 min-h-0 relative">
                <IncidentTable />
            </div>
        </div>
    );
}
