import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
interface TodoFormprops {
  submit: (title: string) => void;
}
const TodoForm = ({ submit }: TodoFormprops) => {
  const [title, settitle] = useState("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      submit(title.trim());
    }
  };
  return (
    <div className="flex flex-col items-center">
      <h1>Todo Form</h1>
      <form onSubmit={handleSubmit} className="flex space-x-2 mb-4">
        <Input
          type="text"
          placeholder="Enter your todo"
          onChange={(e) => settitle(e.target.value)}
          className="flex-grow"
          required
        ></Input>
        <Button type="submit">Add Todo</Button>
      </form>
    </div>
  );
};
export default TodoForm;
