import React, { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSignUp } from "@clerk/nextjs";
import { redirect, useRouter } from "next/navigation";
import { CarTaxiFront, Flag } from "lucide-react";
import { asyncWrapProviders } from "async_hooks";
import { Eye, EyeOff } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
const Signuppage = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const [emailAddress, setemailAddress] = useState("");
  const [password, setpassword] = useState("");
  const [pendingverification, setpendingverification] = useState(false);
  const [code, setcode] = useState("");
  const [error, seterror] = useState("");
  const [showcode, setshowcode] = useState(false);
  const [showpassword, setshowpassword] = useState(false);
  const router = useRouter();

  if (!isLoaded) {
    return null;
  }
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoaded) {
      return;
    }
    try {
      await signUp.create({
        emailAddress,
        password,
      });
      // after creating the user you have to verify the things
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });

      // now you will try to tell the clerk that you have to unmount the
      setpendingverification(true);
    } catch (error: any) {
      console.log(JSON.stringify(error));
      seterror(error.error[0].message);
    }
  }

  // this function will handle the verify logic
  async function onpressverify(e: React.FormEvent) {
    e.preventDefault();
    if (!isLoaded) {
      return;
    }
    try {
      const completeSignup = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignup.status != "complete") {
        console.log(JSON.stringify(completeSignup, null, 2));
      }
      if (completeSignup.status === "complete") {
        await setActive({ session: completeSignup.createdSessionId });
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.log(JSON.stringify(error));
      seterror(error.error[0].message);
    }
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign-up for todo master</CardTitle>
      </CardHeader>
      <CardContent>
        {!pendingverification ? (
          <form onSubmit={submit}>
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
        ) : (
          <form onSubmit={onpressverify}>
            <div>
              <label htmlFor="code">Enter the Code</label>
              <input
                type={showcode ? "text" : "password"}
                placeholder="Enter the code here"
                id="code"
                onChange={(e) => {
                  setcode(e.target.value);
                }}
                required
              />
              <Button>
                {showcode ? (
                  <EyeOff className="h-4 w-4 bg-gray-200" />
                ) : (
                  <Eye className="h-4 w-4 bg-gray-200" />
                )}
              </Button>
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button className="text-white px-6 py-1 bg-green-400 mt-2">
              Submit
            </Button>
          </form>
        )}
      </CardContent>
      <CardFooter>
        <p>Already have an account? </p>
        <Link href={"/Sign-in"}>
          <span className="text-blue-500 hover:underline text-sm">Sign-up</span>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default Signuppage;
