import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CalendarClockIcon,
  MailIcon,
  MapPinIcon,
  PhoneCallIcon,
} from "lucide-react";
import dayjs from "dayjs";
import AddPatient from "@/components/AddPatient";

interface PatientProfileProps {
  id: string;
  name: string;
  createdAt: string;
  email: string;
  age: number;
  gender: string;
  phone: string;
  address: string;
}

export default function PatientProfile({
  id,
  name,
  createdAt,
  email,
  age,
  gender,
  phone,
  address,
}: PatientProfileProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex! flex-row justify-between items-center">
        <CardTitle className="font-medium text-lg">Patient Profile</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="border-b pb-4 w-full h-full flex items-center justify-center flex-col gap-2">
          <Avatar className="size-28">
            <AvatarFallback className="text-3xl uppercase!">
              {name?.split(" ")?.[0]?.[0]}
              {name?.split(" ")?.[1]?.[0] || name?.split(" ")?.[0]?.[1]}
            </AvatarFallback>
          </Avatar>

          <h3 className="font-medium">
            {name}{" "}
            <span className="capitalize text-sm text-muted-foreground">
              ({gender})
            </span>
          </h3>
          <p className="text-muted-foreground text-sm">Age : {age} years</p>
        </div>

        <div className="flex flex-col gap-5 py-4 border-b">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-base text-muted-foreground">
              <CalendarClockIcon className="size-4" />
              Created on
            </div>

            <span className="text-base pl-5">
              {dayjs(createdAt).format("DD MMM YYYY")}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-base text-muted-foreground">
              <PhoneCallIcon className="size-4" />
              Phone Number
            </div>

            <span className="text-base pl-5">+91 {phone}</span>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-base text-muted-foreground">
              <MailIcon className="size-4" />
              Email Address
            </div>

            <span className="text-base pl-5">{email}</span>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-base text-muted-foreground">
              <MapPinIcon className="size-4" />
              Address
            </div>

            <span className="text-base pl-5">{address}</span>
          </div>
        </div>

        <div className="pt-4">
          <AddPatient
            editData={{ id, name, age, gender, phone, email, address }}
            trigger={<Button className="w-full">Edit Patient</Button>}
          />
        </div>
      </CardContent>
    </Card>
  );
}
