import { authService } from "../services/auth.service";
import type { CreateApiKeyRequest } from "../types/auth.types";

export const createApiKeyAction = (data: CreateApiKeyRequest) => {
	return authService.createKey(data);
};
