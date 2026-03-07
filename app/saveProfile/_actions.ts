"use server";

import {
  upsertUserTrainData,
  type UpsertUserTrainDataBody,
} from "@/app/_lib/api/fetch-generated";

export async function saveProfileAction(data: UpsertUserTrainDataBody) {
  return upsertUserTrainData(data);
}
