import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateUser, useGetUser, useUpdateUser } from "@/lib/queries/users";
import { useForm } from "react-hook-form";
import { User } from "@/lib/repositories/users/usersRepositories";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

interface EditUserButtonProps {
  userID: number;
}

export default function EditUserButton({ userID }: EditUserButtonProps) {
  const { register, handleSubmit, reset } = useForm();
  const queryClient = useQueryClient();

  const { mutateAsync: updateUser } = useUpdateUser();
  const { data } = useGetUser(userID);

  const onSubmit = async (formData: any) => {
    await updateUser({ ...data, ...formData });
    queryClient.invalidateQueries({ queryKey: ["getUserID", userID] });
  };

  const handleDialogOpen = () => {
    queryClient.invalidateQueries({ queryKey: ["getUserID", userID] });
    reset(data);
  };

  return (
    <Dialog onOpenChange={handleDialogOpen}>
      <DialogTrigger asChild>
        <Button>Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Label htmlFor="username">Username</Label>
            <Input id="username" {...register("username")} defaultValue={data?.username} />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" {...register("email")} defaultValue={data?.email} />
          </div>
          <div>
            <Label htmlFor="first_name">First Name</Label>
            <Input id="first_name" {...register("first_name")} defaultValue={data?.first_name} />
          </div>
          <div>
            <Label htmlFor="last_name">Last Name</Label>
            <Input id="last_name" {...register("last_name")} defaultValue={data?.last_name} />
          </div>
          <div className="flex justify-end pt-4">
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}