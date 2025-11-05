import React, { useState, useTransition, useCallback, useEffect } from "react";
import { todo, User } from "@prisma/client";
import todoItem from "@/components/todoItem";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import pagination from "@/components/pagination";
import { ToastContainer, toast } from "react-toastify";
import { useDebounceValue } from "usehooks-ts";
import { CarTaxiFront, FileTerminal, Flag } from "lucide-react";
import { PUT } from "@/app/todos/[id]/route";
import { subscribe } from "diagnostics_channel";

interface userwithtodos extends User {
  todo: todo[];
}
const Admindashboard = ({ todo }: userwithtodos) => {
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
          `api/admin/email=${debounceemail}&page=${page}`
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

  const HandleUpdatesubscription = async () => {
    notify({ title: "Updating subscription", message: "Please wait...." });
    try {
      const updatedtodo = await fetch("/api/admin",{
        method:"PUT",
        headers:{"Content-type":"application/json"},
        body:JSON.stringify({
             email:debounceemail,
             isSubscribed: !User?.isSubscribed
        })
      })
      if(!updatedtodo)throw new Error("Error in updating the subscription please try again");
      
    } catch (error) {

    }
  };

  return <div></div>;
};

export default Admindashboard;
