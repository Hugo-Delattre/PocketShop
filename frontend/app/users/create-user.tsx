import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";

export default function CreateUserButton() {
    const { register, handleSubmit } = useForm();

    const onSubmit = (data: any) => {
        console.log(data);
    };

    return (
        <div>
            <Dialog>
                <DialogTrigger>
                    <Button>New</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create a new user</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" {...register("username")} />
                        </div>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" {...register("email")} />
                        </div>
                        <div>
                            <Label htmlFor="firstName">First Name</Label>
                            <Input id="firstName" {...register("firstName")} />
                        </div>
                        <div>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" {...register("lastName")} />
                        </div>
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" {...register("password")} />
                        </div>
                        <Button type="submit">Submit</Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}