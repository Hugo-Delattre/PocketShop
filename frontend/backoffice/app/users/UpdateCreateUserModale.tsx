import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { User, UserRole } from "@/lib/repositories/users/usersRepositories";
import { useMemo, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import token from "@/lib/token";
import { jwtConstants } from "@/utils/jwt";

export type ModalUser = Omit<User, "id">;

interface UpdateCreateModalProps {
  isOpen?: boolean;
  setIsOpen(v: boolean): void;
  selectedItem?: ModalUser;
  onSubmit(v: ModalUser): void;
  isEditing?: boolean;
}

const defaultValue: ModalUser = {
  username: "",
  email: "",
  first_name: "",
  last_name: "",
  password: "",
  role: UserRole.USER,
};

export default function UpdateCreateUserModal({
  isOpen,
  setIsOpen,
  selectedItem,
  onSubmit,
  isEditing,
}: UpdateCreateModalProps) {
  const [formItem, setFormItem] = useState<ModalUser>(
    selectedItem ?? defaultValue
  );

  const { role } = token.decodeToken(jwtConstants.key);

  const isAdmin = role === UserRole["ADMIN"];

  useMemo(() => {
    setFormItem(selectedItem ?? defaultValue);
  }, [selectedItem]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className="sm:max-w-[425px]"
        aria-describedby="update or insert product"
      >
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit" : "Add"} a new user</DialogTitle>
        </DialogHeader>
        <form className="flex flex-col gap-4 py-4">
          <div className="">
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              value={formItem?.username}
              onChange={(e) =>
                setFormItem((prev) => ({
                  ...prev,
                  username: e.target.value,
                }))
              }
            />
          </div>
          <div className="">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={formItem?.email}
              onChange={(e) =>
                setFormItem((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
              className="col-span-3"
            />
          </div>
          <div className="">
            <Label htmlFor="first_name" className="text-right">
              First name
            </Label>
            <Input
              id="first_name"
              value={formItem?.first_name}
              type="text"
              onChange={(e) =>
                setFormItem((prev) => ({
                  ...prev,
                  first_name: e.target.value,
                }))
              }
            />
          </div>
          <div className="">
            <Label htmlFor="last_name" className="text-right">
              Last name
            </Label>
            <Input
              id="last_name"
              value={formItem?.last_name}
              type="text"
              onChange={(e) =>
                setFormItem((prev) => ({
                  ...prev,
                  last_name: e.target.value,
                }))
              }
            />
          </div>
          {isAdmin && (
            <div>
              <Label htmlFor="role" className="text-right">
                Role
              </Label>
              <Select
                name="role"
                value={formItem.role}
                onValueChange={(v) =>
                  setFormItem((prev) => ({
                    ...prev,
                    role: v as UserRole,
                  }))
                }
              >
                <SelectTrigger className="w-[180px]" aria-label="Role">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UserRole.USER}>User</SelectItem>
                  <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="">
            <Label htmlFor="password" className="text-right">
              Password
            </Label>
            <Input
              id="password"
              value={formItem?.password}
              type="password"
              onChange={(e) =>
                setFormItem((prev) => ({
                  ...prev,
                  password: e.target.value,
                }))
              }
            />
          </div>

          <div style={{ marginTop: "20px", textAlign: "right" }}>
            <Button
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                onSubmit(formItem);
                setIsOpen(false);
              }}
            >
              {isEditing ? "Save changes" : "Create user"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
