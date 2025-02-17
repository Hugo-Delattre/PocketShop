"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function RegisterForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [first_name, setFirstName] = useState("");
    const [last_name, setLastName] = useState("");
    const [email, setEmail] = useState("");

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // Handle login logic here
        console.log("Username:", username);
        console.log("Password:", password);
        console.log("First Name:", first_name);
        console.log("Last Name:", last_name);
        console.log("Email:", email);
    };

    return (
        <div className="max-w-md mx-auto">
            <form onSubmit={handleSubmit}>
                <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div>
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                        id="first_name"
                        type="text"
                        value={first_name}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>
                <div>
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                        id="last_name"
                        type="text"
                        value={last_name}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>
                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <Button type="submit" className="w-full mt-4">
                    Register
                </Button>
            </form>
        </div>
    );
}
