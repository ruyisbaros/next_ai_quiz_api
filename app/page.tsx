import SignInBtn from "@/components/SigninBtn";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAuthSession } from "@/lib/nextAuth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Sign In",
};

export default async function Home() {
  const session = await getAuthSession();
  if (session?.user) {
    return redirect("/dashboard");
  }
  return (
    <div className=" absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Welcome to AI Based Quiz Platform 🔥</CardTitle>
          <CardDescription>
            This is an AI based quiz platform that allows you to create quizzes
            and test yourself.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignInBtn text="Sign In with Google" />
        </CardContent>
      </Card>
    </div>
  );
}
