import React from "react";
import { useState } from "react";
import { todo } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { Trash2, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { spawn } from "child_process";

interface Todoitemprops {
  todo: todo;
  isAdmin?: Boolean;
  onUpdate: (id: string, completed: Boolean) => void;
  onDelete: (id: string) => void;
}

const todoItem = ({
  todo,
  isAdmin = false,
  onUpdate,
  onDelete,
}: Todoitemprops) => {
  const [iscompleted, setiscompleted] = useState(todo.isCompleted);

  const togglecomplete = async () => {
    const newcompletedstate = !iscompleted;
    setiscompleted(newcompletedstate);
    onUpdate(todo.id, newcompletedstate);
  };
  return (
    <div>
      <Card>
        <CardContent>
          <span className={`${iscompleted}` ? "line-through" : "underline"}>
            {todo.title}
          </span>
          <div>
            <Button variant={"outline"} size={"sm"} onClick={togglecomplete}>
              {iscompleted ? (
                <XCircle className="mr-2 h-4 w-4" />
              ) : (
                <CheckCircle className="mr-2 h-4 w-4" />
              )}
            </Button>

            <Button
              variant={"outline"}
              size={"sm"}
              className=""
              onClick={() => {
                onDelete(todo.id);
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
            {isAdmin && (
              <span className="ml-2 text-sm text-muted-foreground">
                User ID :{todo.userId}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default todoItem;
