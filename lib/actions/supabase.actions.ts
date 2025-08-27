// "use server";

import { createClient } from "@/lib/supabase/client";
import { PostgrestFilterBuilder } from "@supabase/postgrest-js";

interface AddDocumentProps {
  tableName: string;
  doc: any;
}

type QueryFn = (query: any) => any; // 👈 deliberately loosen here

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
  } catch (error) {
    console.log("Error adding document: ", error);
    return { error: "Error adding document" };
  }
};

export const updateDocument = async ({
  tableName,
  doc,
  documentId,
}: AddDocumentProps & {
  documentId: string;
}) => {
  try {
    const supabase = createClient();
    const res = await supabase.from(tableName).update(doc).eq("id", documentId);

    console.log(res);

    if (res?.status === 204) {
      return { message: "Document updated successfully" };
    } else {
      return { error: "Error updating document" };
    }
  } catch (error) {
    console.log("Error updating document: ", error);
    return { error: "Error updating document" };
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
  filters,
  select,
  limit,
}: {
  tableName: string;
  filters?: QueryFn[];
  select?: string;
  limit?: number;
}) => {
  const supabase = createClient();

  let query: any = supabase.from(tableName);

  if (select) {
    query = query.select(select).order("created_at", { ascending: false });
  } else {
    query = query.select().order("created_at", { ascending: false });
  }

  if (filters && filters?.length > 0) {
    for (const apply of filters) {
      query = apply(query);
    }
  }

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

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
