import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MailIcon, MapPinIcon, PhoneCallIcon } from "lucide-react";

export default function PatientProfile() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex! flex-row justify-between items-center">
        <CardTitle className="font-medium text-lg">Patient Profile</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="border-b pb-4 w-full h-full flex items-center justify-center flex-col gap-2">
          <Avatar className="size-28">
            <AvatarImage src="https://github.com/shadcn.pn" />
            <AvatarFallback className="text-3xl">LA</AvatarFallback>
          </Avatar>

          <h3 className="font-medium">Leslie Alaxander</h3>
          <p className="text-muted-foreground text-sm">
            Created on : 22-03-2023
          </p>
        </div>

        <div className="flex flex-col gap-5 py-4 border-b">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-base text-muted-foreground">
              <PhoneCallIcon className="size-4" />
              Phone Number
            </div>

            <span className="text-base pl-5">+91 8728383939</span>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-base text-muted-foreground">
              <MailIcon className="size-4" />
              Email Address
            </div>

            <span className="text-base pl-5">kris_alexander@doctor.com</span>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-base text-muted-foreground">
              <MapPinIcon className="size-4" />
              Address
            </div>

            <span className="text-base pl-5">
              23 New York Street, New York, USA
            </span>
          </div>
        </div>

        <div className="pt-4">
          <Button className="w-full">Edit Patient</Button>
        </div>
      </CardContent>
    </Card>
  );
}
