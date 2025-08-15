// "use server";

import { createClient } from "@/lib/supabase/client";

interface AddDocumentProps {
  tableName: string;
  doc: any;
}

export const addDocument = async ({ tableName, doc }: AddDocumentProps) => {
  try {
    const supabase = createClient();
    const res = await supabase.from(tableName).insert(doc);

    console.log(res);

    if (res?.status === 201) {
      return { message: "Document added successfully" };
    } else {
      return { error: "Error adding document" };
    }
  } catch (e) {
    console.log("Error adding document: ", e);
    return { error: "Error adding document" };
  }
};

export const deleteDocument = async ({
  tableName,
  documentId,
}: {
  tableName: string;
  documentId: string;
}) => {
  try {
    const supabase = createClient();

    const response = await supabase
      .from(tableName)
      .delete()
      .eq("id", documentId);

    if (response.status === 204) {
      return { message: "Document deleted successfully" };
    } else {
      return { error: "Error deleting document" };
    }
  } catch (e) {
    console.log("Error deleting document: ", e);
    return { error: "Error deleting document" };
  }
};

export const getData = async ({
  tableName,
  documentId,
}: {
  tableName: string;
  documentId: string;
}) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from(tableName)
    .select()
    .eq("id", documentId);

  if (error) {
    return { error: error.message };
  }

  return data?.[0];
};

export const getCollectionData = async ({
  tableName,
  // dataLimit,
}: {
  tableName: string;
  dataLimit?: number;
}) => {
  const supabase = createClient();
  const { data, error } = await supabase.from(tableName).select();
  console.log({ data, error });

  if (data) {
    console.log(data);
  }

  if (error) {
    console.log(error);
  }

  return data;
};

export const deleteUser = async ({
  userId,
  errorFallback,
}: {
  userId: string;
  errorFallback?: string;
}): Promise<any> => {
  try {
    const res = await fetch(`/api/delete-user?userId=${userId}`, {
      method: "DELETE",
    });

    const result = await res.json();

    console.log(result);
  } catch (error: any) {
    console.error(error.message || errorFallback || "Failed to delete");
  }
};
