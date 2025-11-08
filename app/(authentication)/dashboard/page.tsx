"use client";
import { ToastContainer, toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { use, useCallback, useEffect, useState, useTransition } from "react";
import TodoForm from "@/components/TodoForm";
import { useUser } from "@clerk/nextjs";
import Pagination from "@/components/Pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TodoItem from "@/components/TodoItem";
import { useDebounceValue } from "usehooks-ts";
import { AlertTriangle, StoreIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { todo } from "@prisma/client";
export default function App() {
  const { user } = useUser();
  const [isloading, setisloading] = useState(false);
  const [currentpage, setcurrentpage] = useState(1);
  const [searchterm, setsearchitem] = useState("");
  const [debouncesearchquery] = useDebounceValue(searchterm, 3000);
  const [totalpages, settotalpages] = useState(1);
  const [Todos, setTodos] = useState<todo[]>([]);
  const [isSubscribed, setisSubscribed] = useState(false);
  const [isAddingTodo, setisAddingTodo] = useState(false);
  // Interface to notify function
  interface notifyprops {
    Error?: String;
    title?: String;
    desc: String;
  }
  const notify = (Data: notifyprops) => {
    toast(
      <div>
        <p>{Data.Error}</p>
        <p>{Data.title}</p>
        <p>{Data.desc}</p>
      </div>
    );
  };
  // const fetchtodos = useCallback(
  //   async (currentpage: number) => {
  //     notify({
  //       desc: "Fetching todos Please wait...",
  //     });
  //     setisloading(true);
  //     try {
  //       const todos = await fetch(
  //         `/api/todos?page=${currentpage}&search=${debouncesearchquery}`,
  //         {
  //           method: "GET",
  //           headers: { "Content-type": "application/json" },
  //         }
  //       );
  //       if (!todos) {
  //         notify({
  //           Error: "Api not working",
  //           desc: "Error in fetching the Todos",
  //         });
  //       }
  //       const data = await todos.json();
  //       console.log(data);
  //       setTodos(data.todos);
  //       setcurrentpage(data.currentPage);
  //       settotalpages(data.totalPages);
  //     } catch (error) {
  //       notify({
  //         Error: "Internal Server Error",
  //         desc: "Error in fetching the Todos",
  //       });
  //     } finally {
  //       setisloading(false);
  //     }
  //   },
  //   [debouncesearchquery]
  // );
  // const fetchsubscriptionStatus = async () => {
  //   const respone = await fetch("/api/subscription", {
  //     method: "GET",
  //     headers: { "Content-Type": "application/json" },
  //   });

  //   if(respone.ok) {
  //     const data = await respone.json();
  //     setisSubscribed(data.isSubscribed);
  //   }

  // };
  // useEffect(() => {
  //   fetchtodos(1);
  //   fetchsubscriptionStatus();
  // }, [fetchtodos]);
  const handleaddtodos = async (title: string) => {
    notify({
      title: "Adding Todo",
      desc: "Please wait...",
    });
    setisAddingTodo(true);
    try {
      const Response = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
        }),
      });
      if (!Response) {
        throw new Error("Error in creating a todo");
      } else if (Response.ok) {
        // await fetchtodos(currentpage);
        notify({
          desc: "Todo Added",
        });
      }
    } catch (error) {
      notify({
        title: "Internal server Error",
        desc: "Error in Adding the Todo",
      });
    } finally {
      setisAddingTodo(false);
    }
  };
  // handle updating the todo
  const handleupdatetodo = async (id: string, completed: Boolean) => {
    notify({
      desc: "Updating the Todo....",
    });
    try {
      const Response = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          completed,
        }),
      });
      if (!Response.ok) {
        notify({
          Error: "Error in updating the todo",
          desc: "",
        });
      }
      // await fetchtodos(currentpage);
      notify({
        title: "Success",
        desc: "Todo updated successfully.",
      });
    } catch (error) {
      throw new Error("Error in updating the todo");
    }
  };
  const handledeletetodo = async (id: string) => {
    try {
      const respone = await fetch(`/api/todo/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!respone.ok) {
        throw new Error("Error in deleting the todo");
      }
      // await fetchtodos(currentpage);
      notify({
        desc: "Todo deleted successfully",
      });
    } catch (error) {
      notify({
        desc: "Todo deleted successfully",
      });
    }
  };
  // const notify = () => toast('Wow so easy !');
  return (
    <div className="grid place-items-center h-dvh bg-zinc-900/15">
      <h1>Welcome,{user?.emailAddresses[0].emailAddress}</h1>
      {/* // add new todo */}
      <Card>
        <CardHeader>
          <CardTitle>Add Todo</CardTitle>
        </CardHeader>
        <CardContent>
          <TodoForm submit={(title) => handleaddtodos(title)}></TodoForm>
        </CardContent>
      </Card>
      {/* {!isSubscribed && Todos.length > 3 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            user has crossed the free limit to add todo
            <Link href={"/api/subscription"}>Subscribe now!</Link>
            to add more..
          </AlertDescription>
        </Alert>
      )} */}
      {/*       
      <Card>
        <CardHeader>
          <CardTitle>your todos</CardTitle>
        </CardHeader>
        <CardContent>
          <input
            type="text"
            placeholder="Search your todo"
            onChange={(e) => setsearchitem(e.target.value)}
            value={searchterm}
          />
          {isloading ? (
            <div>
              <p>Hey please wait till you todos are loading</p>
            </div>
          ) : Todos.length == 0 ? (
            <div>
              <p>you dont have any todo make one..</p>
            </div>
          ) : (
            <>
              <ul>
                {Todos.map((item, index) => (
                  <TodoItem
                    todo={item}
                    isAdmin={false}
                    onUpdate={handleupdatetodo}
                    onDelete={handledeletetodo}
                  />
                ))}
              </ul>
              {/* <Pagination
                currentpage={currentpage}
                totalpages={totalpages}
                // onpagechange={(page) => fetchtodos(page)}
              /> */}
      {/* </>
          )} */}
      {/*   </CardContent> */}
      {/*  </Card> */}
    </div>
  );
}
