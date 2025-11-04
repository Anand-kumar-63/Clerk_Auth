"use client"
import React from "react"
import { Button } from './ui/button'
import { ChevronLeft } from "lucide-react";
import { useRouter } from 'next/router';

const BackButton = () => {
  const router = useRouter();
    return (
    <div>
       <Button  variant={"ghost"} onClick={ () => router.back } className="mb-4">
           <ChevronLeft />
             Back
       </Button>
    </div>
  )
}
export default BackButton