// import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateRandomId, getStadium } from "@/lib/randomId";
import { useSocket } from "@/Providers/SockerProvider";
import { useAppStore } from "@/Providers/store";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";

export function meta() {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function JoinRoom() {
  const stadium = useMemo(() => getStadium(), []);

  const [stadiumId, setStadiumId] = useState(stadium);
  const { userId } = useAppStore();

  return (
    <div className="h-[100dvh] w-full bg-[url('./hc_bg.avif')] bg-cover bg-no-repeat bg-center bg-fixed bg flex justify-center items-center">
      <Card className="w-full min-h-[50%] max-w-sm bg-black/70 rounded-xl shadow-2xl border-2 border-black/40 flex flex-col justify-center">
        {/* <Card className="w-full min-h-[47%] max-w-sm bg-linear-to-br from-gray-600 via-gray-300 to-gray-500 rounded-xl shadow-2xl border-2 border-black/40 flex flex-col justify-center"> */}
        <CardHeader>
          <CardTitle className="text-4xl mx-auto text-white text-shadow-lg/20">
            Handcricket
          </CardTitle>
          <CardDescription className="text-2xl mx-auto text-white text-shadow-md/10">
            Join a stadium
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label
                    htmlFor="password"
                    className="text-white/80 text-shadow-lg/20"
                  >
                    Player ID
                  </Label>
                </div>
                {/* <Input required placeholder="thala_007" className="placeholder:text-gray-300" /> */}
                <p className="text-white font-bold text-xl">{userId}</p>
              </div>
              <div className="grid gap-2">
                <Label
                  htmlFor="email"
                  className="text-white text-shadow-lg/20"
                >
                  Stadium ID
                </Label>
                <Input
                  placeholder="lords_heaven"
                  value={stadiumId}
                  onChange={(e) => setStadiumId(e.target.value)}
                  required
                  className="placeholder:text-gray-300 text-white"
                />
              </div>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex-col gap-2">
          <Link
            to={`/stadium/${stadiumId.toLowerCase()}`}
            replace
          >
            <Button
              type="submit"
              className="w-full backdrop-blur-md bg-primary/70"
            >
              ENTER STADIUM
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
