"use client"
import { columns, UserRole } from "@/app/users/columns";
import { DataTable } from "@/app/users/data-table";
import { useGetUsers } from "@/lib/queries/users";

export default function UserPage() {
    const { data, isLoading } = useGetUsers();
    
    return (
        <div className="container mx-auto py-10">
            <h1 className="pl-10 font-bold text-2xl">Users</h1>
            <div className="flex justify-start pl-10">
                {data ? <DataTable columns={columns} data={data} /> : <p>Loading...</p>}
            </div>
        </div>
    );
}
