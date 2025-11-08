"use client"
import { CarTaxiFront, Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSignIn } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Alert, AlertDescription } from "@/components/ui/alert";

const Signinpage = () => {
  const router = useRouter();
  const { isLoaded, setActive, signIn } = useSignIn();
  const [emailAddress, setemailAddress] = useState("");
  const [password, setpassword] = useState("");
  const [showpassword, setshowpassword] = useState(false);
  const [error, seterror] = useState("");
  if (!isLoaded) {
    return null;
  }

  
  async function handlesubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoaded) {
      return;
    }
    try {
      const result = await signIn.create({
        identifier: emailAddress,
        password,
      });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        return router.push("/dashboard");
      } else {
        console.error(JSON.stringify(result, null, 2));
      }
    } catch (error: any) {
      console.log("error", error.errors[0].message);
      seterror(error.errors[0].message);
      console.error(JSON.stringify(error, null, 2));
    }
  }
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Sign-in for todo master</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlesubmit}>
            <div className="flex flex-col space-y-4">
              <label htmlFor="email">Email: </label>
              <input
                type="email"
                placeholder="Enter you email"
                required
                id="email"
                value={emailAddress}
                onChange={(e) => {
                  setemailAddress(e.target.value);
                }}
              />
            </div>
            <div className="flex flex-col space-y-4">
              <label htmlFor="password">Password: </label>
              <input
                type={showpassword ? "text" : "password"}
                placeholder="Enter you password"
                value={password}
                id="password"
                onChange={(e) => {
                  setpassword(e.target.value);
                }}
                required
              />
              <Button
                onClick={() => setshowpassword(!showpassword)}
                className="absolute right-2 top-1/2 -translate-y-0.5"
              >
                {showpassword ? (
                  <EyeOff className="h-8 w-8 bg-gray-300" />
                ) : (
                  <Eye className="h-8 w-8 bg-gray-300" />
                )}
              </Button>
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <button
              type="submit"
              className="px-4 py-1 bg-green-400 text-white mt-2"
            >
              Sign-up
            </button>
          </form>
        </CardContent>
        <CardFooter>
          <p>Don't have an account? </p>
          <Link href={"/sign-up"}>
            <span className="text-blue-500 hover:underline text-sm">
              Sign-in
            </span>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Signinpage;
