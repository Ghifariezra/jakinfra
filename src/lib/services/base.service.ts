/** biome-ignore-all lint/suspicious/noExplicitAny: ... */
/** biome-ignore-all lint/complexity/noThisInStatic: ... */

import type { AxiosInstance, AxiosRequestConfig } from "axios";
import api from "../axios";
import type { ApiResponse } from "../types/api.types";

export abstract class BaseService {
	protected api: AxiosInstance = api;

	// Dictionary untuk menyimpan instance singleton
	private static instances = new Map<any, any>();

	/**
	 * Helper Singleton: Mengembalikan instance tunggal untuk setiap class turunan yang dipanggil.
	 */
	public static getInstance<T extends BaseService>(this: new () => T): T {
		if (!BaseService.instances.has(this)) {
			BaseService.instances.set(this, new this());
		}
		return BaseService.instances.get(this);
	}

	/**
	 * Wrapper request GET yang otomatis mengekstrak property `data` dari backend
	 */
	protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
		const response = await this.api.get<ApiResponse<T>>(url, config);
		return response.data.data;
	}

	/**
	 * Wrapper request POST yang otomatis mengekstrak property `data` dari backend
	 */
	protected async post<T, D = unknown>(
		url: string,
		data?: D,
		config?: AxiosRequestConfig,
	): Promise<T> {
		const response = await this.api.post<ApiResponse<T>>(url, data, config);
		return response.data.data;
	}
}
