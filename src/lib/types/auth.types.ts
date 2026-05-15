export interface CreateApiKeyRequest {
	developer_name: string;
	project_name: string;
	tier?: "free" | "pro" | "enterprise";
	lifespan_days?: number | null;
}

export interface CreateApiKeyResponse {
	id: string;
	api_key: string;
}
