"use client";
import { columns } from "@/app/users/columns";
import { sortToQueryParam, Table } from "@/components/table/Table";
import {
  useCreateUser,
  useDeleteUser,
  useGetUsers,
  useUpdateUser,
} from "@/lib/queries/users";
import type { ColumnSort, PaginationState } from "@tanstack/react-table";
import { useState } from "react";
import UpdateCreateUserModal, { ModalUser } from "./UpdateCreateUserModale";
import {
  ClientSideUser,
  User,
  UserRole,
} from "@/lib/repositories/users/usersRepositories";
import { Loader } from "@/components/ui/loader";
import { Error } from "@/components/ui/error";
import { AxiosError } from "axios";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

export default function UserPage() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const [searchValue, setSearchValue] = useState("");
  const [search] = useDebouncedValue(searchValue, 300);

  const [sorting, setSorting] = useState<ColumnSort[]>([]);

  const { data, isLoading, error } = useGetUsers({
    skip: pagination.pageIndex * pagination.pageSize,
    take: pagination.pageSize,
    search: search,
    sort: sortToQueryParam(sorting),
  });

  const { mutateAsync: deleteUser } = useDeleteUser();
  const { mutateAsync: createUser } = useCreateUser();
  const { mutateAsync: updateUser } = useUpdateUser();

  if (error) {
    return <Error error={error as AxiosError} />;
  }

  if (!data || isLoading) {
    return <Loader />;
  }

  const handleSubmit = async (
    value: ModalUser,
    isEditing: boolean,
    selectedItemId?: number
  ) => {
    if (value.password === "") {
      // @ts-expect-error louis
      delete value.password;
    }
    if (isEditing && selectedItemId) {
      const updateUserObj = {
        ...value,
        id: selectedItemId,
      } as User;

      await updateUser(updateUserObj);
      return;
    }

    await createUser(value as User);
  };

  return (
    <div className="w-5/6 mx-auto pt-14">
      <h1 className="font-crimson text-4xl mb-6">Users</h1>
      <Table<ClientSideUser>
        data={data}
        pagination={pagination}
        setPagination={setPagination}
        columns={columns}
        sorting={sorting}
        setSorting={setSorting}
        deleteElement={async (userId) => await deleteUser(userId)}
        searchValue={searchValue}
        searchOnChange={(value) => setSearchValue(value)}
      >
        {({ isOpen, handleClose, isEditing, selectedItem }) => (
          <UpdateCreateUserModal
            isOpen={isOpen}
            setIsOpen={handleClose}
            onSubmit={(value) =>
              handleSubmit(value, isEditing, selectedItem?.id)
            }
            isEditing={isEditing}
            selectedItem={{
              first_name: selectedItem?.first_name || "",
              last_name: selectedItem?.last_name || "",
              email: selectedItem?.email || "'",
              username: selectedItem?.username || "",
              role: selectedItem?.role || UserRole.USER,
              password: "",
            }}
          />
        )}
      </Table>
    </div>
  );
}
