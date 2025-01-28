import { User, columns, UserRole } from "@/app/users/columns";
import { DataTable } from "@/app/users/data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

async function getData(): Promise<User[]> {
    return [
        {
            id: 1,
            first_name: "John",
            last_name: "Doe",
            username: "johndoe",
            email: "aez@azeaez.com",
            password: "azeaze",
            role: UserRole.USER,
        },
        {
            id: 2,
            first_name: "Jane",
            last_name: "Doe",
            username: "janedoe",
            email: "aze@gmail.com",
            password: "azeaze",
            role: UserRole.ADMIN,
        },
    ];
}
function generateRandomUser(id: number): User {
    const firstNames = ["John", "Jane", "Alice", "Bob", "Charlie", "David", "Eva", "Frank", "Grace", "Hannah"];
    const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Martinez", "Hernandez"];
    const roles = [UserRole.USER, UserRole.ADMIN];

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const username = `${firstName.toLowerCase()}${lastName.toLowerCase()}${id}`;
    const email = `${username}@example.com`;
    const password = "password"; // In a real application, ensure to hash passwords

    return {
        id,
        first_name: firstName,
        last_name: lastName,
        username,
        email,
        password,
        role: roles[Math.floor(Math.random() * roles.length)],
    };
}

async function getDataMock(): Promise<User[]> {
    const users: User[] = [];
    for (let i = 1; i <= 1500; i++) {
        users.push(generateRandomUser(i));
    }
    return users;
}

async function getDataMock1(): Promise<User[]> {
    return []
}

export default async function UserPage() {
    const data = await getDataMock();

    return (
        <div className="container mx-auto py-10">
            <h1 className="pl-10 font-bold text-2xl">Users</h1>
            <div className="flex justify-start pl-10">
                <DataTable columns={columns} data={data} />
            </div>
        </div>
    );
}
