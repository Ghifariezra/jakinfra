import type {
	CreateApiKeyRequest,
	CreateApiKeyResponse,
} from "../types/auth.types";
import { BaseService } from "./base.service";

export class AuthService extends BaseService {
	/**
	 * Membuat kredensial API Key baru.
	 */
	public async createKey(
		data: CreateApiKeyRequest,
	): Promise<CreateApiKeyResponse> {
		return this.post<CreateApiKeyResponse>("/auth/keys", data);
	}

	// Catatan: Endpoint /auth/keys/revoke tidak diimplementasikan sesuai instruksi.
}

export const authService = AuthService.getInstance();
