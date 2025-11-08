"use client";
import { ToastContainer, toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { use, useCallback, useEffect, useState, useTransition } from "react";
import TodoForm from "@/components/TodoForm";
import TodoItem from "@/components/TodoItem";
import Pagination from "@/components/Pagination";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDebounceValue } from "usehooks-ts";
import { todo } from "@prisma/client";
import { AlertTriangle, StoreIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import Link from "next/link";
// import { useDebounceValue } from "usehooks-ts";
import { error } from "console";

export default function App() {
  const [isloading, setisloading] = useState(false);
  const [currentpage, setcurrentpage] = useState(1);
  const [debouncesearchquery, setdebouncesearchquery] = useDebounceValue(
    "",
    3000
  );
  const [totalpages, settotalpages] = useState(null);
  const [Todos, setTodos] = useState([]);
  const [isSubscribed ,setisSubscribed] = useState(false);

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

  const fetchtodos = useCallback(async () => {
    notify({
      desc: "Fetching todos Please wait...",
    });
    setisloading(true);
    try {
      const todos = await fetch(
        `/api/todos?page=${currentpage}&search=${debouncesearchquery}`,
        {
          method: "GET",
          headers: { "Content-type": "application/json" },
        }
      );
      if (!todos) {
        notify({
          Error: "Api not working",
          desc: "Error in fetching the Todos",
        });
      }
      const data = await todos.json();
      console.log(data);
      setTodos(data.todos);
      setcurrentpage(data.currentPage);
      settotalpages(data.totalPages);
    } catch (error) {
      notify({
        Error: "Internal Server Error",
        desc: "Error in fetching the Todos",
      });
    } finally {
      setisloading(false);
    }
  }, [debouncesearchquery]);

  const fetchsubscriptionStatus = async()=>{
    const respone = await fetch("/api/subscription");
    if(respone.ok){
      const data =await respone.json();
      setisSubscribed(data.isSubscribed);
    }
  } 

  useEffect(()=>{
    fetchtodos(1);
    fetchsubscriptionStatus();
  },[])

  const handleaddtodos = async()=>{
    
  }


    



  // const notify = () => toast('Wow so easy !');
  return <div className="grid place-items-center h-dvh bg-zinc-900/15"></div>;
}
