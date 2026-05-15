import { useMutation } from "@tanstack/react-query";
import { createApiKeyAction } from "../actions/auth.action";
import type { AppError } from "../error";
import type {
	CreateApiKeyRequest,
	CreateApiKeyResponse,
} from "../types/auth.types";

export const useCreateApiKey = () => {
	return useMutation<CreateApiKeyResponse, AppError, CreateApiKeyRequest>({
		mutationFn: (data) => createApiKeyAction(data),
	});
};
