"use server";

import { revalidatePath } from "next/cache";

export async function revalidateCache(pathname: string) {
  // Revalidate the specific path
  revalidatePath(pathname);
}
