import React from "react";
import { Button } from "./ui/button";
interface paginationprops {
  currentpage: number;
  totalpages: number;
  onpagechange: (page: number) => void;
}
const Pagination = ({
  currentpage,
  totalpages,
  onpagechange,
}: paginationprops) => {
  return (
    <div className="flex justify-center space-x-2 mt-4">
      <Button
        onClick={() => onpagechange(currentpage - 1)}
        disabled={currentpage == 1}
        variant="outline"
      >
        <span>previous Page</span>
      </Button>
      <p className="flex items-center">
        `Current page ${currentpage} , TotalPages ${totalpages}`
      </p>
      <Button
        onClick={() => onpagechange(currentpage + 1)}
        disabled={currentpage == totalpages}
      >
        <span>Next Page</span>
      </Button>
    </div>
  );
};

export default Pagination;
