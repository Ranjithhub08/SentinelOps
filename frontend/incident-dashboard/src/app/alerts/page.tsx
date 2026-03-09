import AlertFeed from '@/components/AlertFeed';

export default function AlertsPage() {
    return (
        <div className="h-full flex flex-col">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-yellow-400 mb-6">
                Alert Feed History
            </h2>
            <div className="flex-1 min-h-0 relative max-w-2xl">
                <AlertFeed />
            </div>
        </div>
    );
}
