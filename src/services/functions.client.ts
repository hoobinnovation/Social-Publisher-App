import { httpsCallable } from "firebase/functions";
import { functions } from "@/services/firebase";

export interface FunctionError {
  code: string;
  message: string;
}

export const callFn = async <TReq, TRes>(name: string, payload?: TReq): Promise<TRes> => {
  try {
    const callable = httpsCallable<TReq, TRes>(functions, name);
    const result = await callable(payload as TReq);
    return result.data;
  } catch (error) {
    const typedError = error as { code?: string; message?: string };
    const normalized: FunctionError = {
      code: typedError.code || "unknown",
      message: typedError.message || "Unexpected error"
    };
    throw normalized;
  }
};
