// "use server";

import { createClient } from "@/lib/supabase/client";

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

export const addTreatmentPlan = async ({
  patientId,
  description,
  treatmentItems,
  authorized_amount,
}: {
  patientId: string;
  description?: string;
  treatmentItems: { treatment_id: string; quantity: number | string }[];
  authorized_amount?: number;
}) => {
  const supabase = createClient();

  const { status, error } = await supabase.rpc(
    "add_treatment_plan_with_items",
    {
      _patient_id: patientId,
      _description: description,
      _authorized_amount: authorized_amount,
      _status: "ongoing",
      _items: treatmentItems?.map((item) => ({
        ...item,
        quantity: parseInt(item?.quantity?.toString()),
      })),
    },
  );

  if (status === 200) {
    return { message: "Successfully added the treatment plan" };
  } else {
    console.error("Error inserting treatment plan with items:", error);
    return { error: "Error adding the treatment plan" };
  }
};

export const updateTreatmentPlanPayment = async ({
  _amount,
  // _plan_id,
  _patient_id,
  _method,
}: {
  _amount: number;
  _method: string;
  // _plan_id: string;
  _patient_id: string;
}) => {
  const supabase = createClient();
  const res = await supabase.from("payments").insert({
    amount: _amount,
    method: _method,
    // plan_id: _plan_id,
    patient_id: _patient_id,
    created_at: new Date().toISOString(),
  });

  // const { status, error } = await supabase.rpc(
  //   "update_paid_amount_in_treatment_plan",
  //   {
  //     _amount,
  //     _auth_amount,
  //     // _plan_id,
  //     _patient_id,
  //   },
  // );

  if ([201].includes(res?.status)) {
    return { message: "Successfully updated the payment details" };
  } else {
    console.error("Error updating the payment details:");
    return { error: "Error updating the payment details" };
  }
};

export const updateTreatmentPlanItems = async ({
  _plan_id,
  treatmentItems,
}: {
  _plan_id: string;
  treatmentItems: {
    plan_item_id?: string;
    treatment_id: string;
    quantity: number | string;
  }[];
}) => {
  const supabase = createClient();

  const { status, error } = await supabase.rpc("upsert_treatment_plan_items", {
    _plan_id,
    _items: treatmentItems?.map((item) => ({
      ...item,
      quantity: parseInt(item?.quantity?.toString()),
    })),
  });

  if (status === 200) {
    return { message: "Successfully updated the treatment plan items" };
  } else {
    console.error("Error updating treatment plan items:", error);
    return { error: "Error updating the treatment plan items" };
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
  select,
  comparisonKey = "id",
}: {
  tableName: string;
  documentId: string;
  select?: string;
  comparisonKey?: string;
}) => {
  const supabase = createClient();

  let query = supabase.from(tableName).select().eq(comparisonKey, documentId);

  if (select) {
    query = supabase
      .from(tableName)
      .select(select)
      .eq(comparisonKey, documentId);
  }

  const { data, error } = await query;

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

export const fetchPaymentStats = async () => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("payment_stats")
    .select("*")
    .single();

  if (error) {
    return { error: error.message };
  }

  return data;
};

export const fetchAppointmentStats = async () => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("appointment_stats")
    .select("*")
    .single();

  if (error) {
    return { error: error.message };
  }

  return data;
};
