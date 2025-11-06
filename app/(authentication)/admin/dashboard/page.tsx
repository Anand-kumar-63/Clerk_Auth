import React, { useState, useTransition, useCallback, useEffect } from "react";
import { todo, User } from "@prisma/client";
import todoItem from "@/components/todoItem";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import pagination from "@/components/pagination";
import { ToastContainer, toast } from "react-toastify";
import { useDebounceValue } from "usehooks-ts";
import { error } from "console";
import { currentUser } from "@clerk/nextjs/server";
import { verify } from "crypto";
import { Input } from "@/components/ui/input";
interface userwithtodos extends User {
  todo: todo[];
}
const Admindashboard = async ({ todo }: userwithtodos) => {
  const [email, setemail] = useState("");
  const [debounceemail, setdebounceemail] = useDebounceValue("", 300);
  const [User, setUser] = useState<userwithtodos | null>(null);
  const [isloading, setisloading] = useState(false);
  const [currentpage, setcurrentpage] = useState(1);
  const [totoalpages, settotalpages] = useState(1);

  const notify = (Toastmessage: {
    Error?: string;
    title?: string;
    message: string;
  }) =>
    toast(
      <div>
        <strong>{Toastmessage.Error}</strong>
        <p>{Toastmessage.message}</p>
      </div>
    );

  const fetchuserdata = useCallback(
    async (page: number) => {
      setisloading(true);
      try {
        const Response = await fetch(
          `api/admin/email=${debounceemail}&page=${page}`,
          {
            method: "GET",
            headers: { "Content-type": "application/json" },
          }
        );
        if (!Response.ok) throw new Error("Error in fetching the data");
        const data = await Response.json();
        setUser(data.user);
        setcurrentpage(data.currentpage);
        settotalpages(data.currentpage);
        notify({ title: "success", message: "Dat fetched successfully" });
      } catch (error) {
        console.log("Error:", error);
        notify({ title: "failed", message: "Error in fetching the user todo" });
      } finally {
        setisloading(false);
      }
    },
    [debounceemail]
  );

  useEffect(() => {
    if (debounceemail) fetchuserdata(1);
  }, [debounceemail]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setdebounceemail(email);
  };
  const handelupdatesubscription = async () => {
    notify({
      title: "Updating Subscription",
      message: "Please wait...",
    });
    try {
      const response = await fetch("/api/admin", {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          email: debounceemail,
          isSubscribed: !User?.isSubscribed,
        }),
      });
      if (!response.ok) throw new Error("Failed to update subscription");
      fetchuserdata(currentpage);
      notify({
        title: "Success",
        message: "update subscription successfully",
      });
    } catch (error) {
      notify({
        Error: "Error",
        title: "admin/dashboard",
        message: "Error in Updating the subscription",
      });
    }
  };
  const HandleUpdatesubscription = async () => {
    notify({ title: "Updating subscription", message: "Please wait...." });
    try {
      const updatedtodo = await fetch("/api/admin", {
        method: "PUT",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          email: debounceemail,
          isSubscribed: !User?.isSubscribed,
        }),
      });
      if (!updatedtodo)
        throw new Error("Error in updating the subscription please try again");
      fetchuserdata(currentpage);
      notify({
        title: "Success",
        message: "Subscription updated successfully.",
      });
    } catch (error) {
      notify({
        Error: "Error",
        title: "Admin dashboard Error",
        message: "Error in updating the Todo",
      });
    }
  };

  const handleDeletetodo = async (todoId: string) => {
    notify({
      title: "Deleting todo",
      message: "please wait...",
    });

    try {
      const respone = await fetch("/api/admin", {
        method: "Delete",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({
          todoId: todoId,
        }),
      });
      if (!respone.ok) throw new Error("failed to delete todo");
      fetchuserdata(currentpage);
    } catch (error) {
      console.log("Error", error);
      notify({
        Error: "Error 404",
        title: "Delete user Error",
        message: "Internal Server Error",
      });
    }
  };
  return;
  <div className="container mx-auto p-4 max-w-3xl mb-8">
    <h1 className="text-3xl font-bold mb-8 text-center">Admin Dashboard</h1>
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Search User</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSearch} className="flex space-x-2">
          <Input
            type="email"
            value={email}
            onChange={(e) => setemail(e.target.value)}
            placeholder="Enter user email"
            required
          />
          <Button type="submit">Search</Button>
        </form>
      </CardContent>
    </Card>

    {isloading ? (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Loading user data...</p>
        </CardContent>
      </Card>
    ) : User ? (
      <>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>User Details</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Email: {User?.email}</p>
            <p>
              Subscription Status:{" "}
              {User?.isSubscribed ? "Subscribed" : "Not Subscribed"}
            </p>
            {User?.subscriptionEnds && (
              <p>
                Subscription Ends:{" "}
                {new Date(User?.subscriptionEnds).toLocaleDateString()}
              </p>
            )}
            <Button onClick={handelupdatesubscription} className="mt-2">
              {User?.isSubscribed ? "Cancel Subscription" : "Subscribe User"}
            </Button>
          </CardContent>
        </Card>

        {User?.todo.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>User Todos</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {User?.todo.map((todo) => (
                  <todoItem
                    key={todo.id}
                    todo={todo}
                    isAdmin={true}
                    onUpdate={handleUpdateTodo}
                    onDelete={handleDeleteTodo}
                  />
                ))}
              </ul>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => fetchUserData(page)}
              />
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">This user has no todos.</p>
            </CardContent>
          </Card>
        )}
      </>
    ) : debouncedEmail ? (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">
            No user found with this email.
          </p>
        </CardContent>
      </Card>
    ) : null}
  </div>;
};

export default Admindashboard;
