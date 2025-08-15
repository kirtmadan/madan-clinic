import { createClient as createServerClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" });
    }

    const supabase = await createServerClient("admin");

    const { data, error } = await supabase.auth.admin.deleteUser(userId);

    if (error) return NextResponse.json({ error });

    return NextResponse.json({
      data,
      message: "Successfully deleted the user",
    });
  } catch (error: any) {
    console.log({ error });
    return NextResponse.json({ error: error.message });
  }
}
