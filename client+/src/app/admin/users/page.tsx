"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import BackgroundImage from "../../../../public/assets/images/hero.jpg";
import useAuthStore from "@/stores/AuthStore";
import { useRouter } from "next/navigation";
import DeleteModal from "@/components/global/DeleteModal";
import { ScrollArea } from "@/components/ui/scroll-area";
import SelectRole from "@/components/global/toUserOrArtist";
import { toast } from "@/components/ui/use-toast";

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
  __v?: number; // Optional version field
};

const GetUsers: React.FC = () => {
  const [isModalOpenDel, setModalOpenDel] = useState(false);
  const [isModalOpenChangeRole, setModalOpenChangeRole] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null);
  const [userIdToChangeRole, setUserIdToChangeRole] = useState<string | null>(null);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const router = useRouter();

  // Redirect to signin page if user is not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/signin");
    }
  }, [isAuthenticated, router]);

  // Fetch users from the server
  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get<User[]>(
          "http://localhost:8000/api/user/getalluser",
          {
            headers: {
              "x-auth-token": token || "",
            },
          }
        );
        setUsers(response.data);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error fetching users",
          description: error.response
            ? error.response.data.message
            : "Something went wrong",
        });
      }
    };

    fetchUsers();
  }, []);

  // Open delete modal
  const handleOpenModalDel = (userId: string) => {
    setUserIdToDelete(userId);
    setModalOpenDel(true);
  };

  // Open change role modal
  const handleOpenModalChangeRole = (userId: string) => {
    setUserIdToChangeRole(userId);
    setModalOpenChangeRole(true);
  };

  // Close delete modal
  const handleCloseModalDel = () => {
    setUserIdToDelete(null);
    setModalOpenDel(false);
  };

  // Close change role modal
  const handleCloseModalChangeRole = () => {
    setUserIdToChangeRole(null);
    setModalOpenChangeRole(false);
  };

  // Handle user deletion
  const handleDelete = async () => {
    if (!userIdToDelete) return;

    const token = localStorage.getItem("token");
    try {
      await axios.delete(
        `http://localhost:8000/api/user/delete/${userIdToDelete}`,
        {
          headers: {
            "x-auth-token": token || "",
          },
        }
      );
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user._id !== userIdToDelete)
      );
      toast({
        variant: "default",
        description: "Successfully deleted.",
      });
      handleCloseModalDel();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.response
          ? error.response.data.message
          : "Something went wrong",
      });
    }
  };

  // Handle role change
  const handleRoleChange = async (newRole: string) => {
    if (!userIdToChangeRole) return;

    const selectedUser = users.find((user) => user._id === userIdToChangeRole);

    if (!selectedUser) {
      toast({
        variant: "destructive",
        title: "User not found",
        description: "User to change role was not found",
      });
      return;
    }

    const token = localStorage.getItem("token");

    // Remove _id and __v from user data
    const { _id, __v, ...userDataWithoutIdV } = selectedUser;

    try {
      const response = await axios.put<User>(
        `http://localhost:8000/api/user/update/${userIdToChangeRole}`,
        {
          ...userDataWithoutIdV,
          role: newRole,
        },
        {
          headers: {
            "x-auth-token": token || "",
          },
        }
      );

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userIdToChangeRole
            ? { ...user, role: response.data.role }
            : user
        )
      );
      toast({
        variant: "default",
        description: `Role successfully updated to ${response.data.role}`,
      });
      handleCloseModalChangeRole();
    } catch (error) {
      console.error("Error updating user role:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.response
          ? error.response.data.message
          : "Something went wrong",
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <div className="absolute inset-0">
        <Image
          src={BackgroundImage}
          alt="Background"
          layout="fill"
          objectFit="cover"
          className="opacity-40 z-0"
        />
      </div>
      <div className="bg-white z-10 p-8 rounded shadow-md w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Users</h2>
        <ScrollArea className="h-[500px] rounded-md border">
          <table className="w-full table-auto">
            <thead className="sticky top-0 bg-white bg-opacity-95">
              <tr>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Role</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="bg-gray-50">
                  <td className="border px-4 py-2">{user.name}</td>
                  <td className="border px-4 py-2">{user.email}</td>
                  <td className="border px-4 py-2">{user.role}</td>
                  <td className="border px-4 py-2 flex justify-center">
                    <button
                      onClick={() => handleOpenModalChangeRole(user._id)}
                      className={`${
                        user.role === "admin" ? "bg-yellow-500" : "bg-green-500"
                      } text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600 transition duration-200`}
                    >
                      Change Role
                    </button>
                    <button
                      onClick={() => handleOpenModalDel(user._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition duration-200"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollArea>
      </div>

      <DeleteModal
        isOpen={isModalOpenDel}
        onClose={handleCloseModalDel}
        onDelete={handleDelete}
      />

      <SelectRole
        isOpen={isModalOpenChangeRole}
        onClose={handleCloseModalChangeRole}
        onSelectRole={handleRoleChange}
      />
    </div>
  );
};

export default GetUsers;
