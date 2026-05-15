import { useQuery } from "@tanstack/react-query";
import {
	getKecamatanListAction,
	getKelurahanListAction,
	getWilayahDetailAction,
	getWilayahListAction,
} from "../actions/wilayah.action";
import type {
	GetKecamatanParams,
	GetKelurahanParams,
	GetWilayahParams,
} from "../types/wilayah.types";

export const wilayahKeys = {
	all: ["wilayah"] as const,
	lists: () => [...wilayahKeys.all, "list"] as const,
	list: (params?: GetWilayahParams) =>
		[...wilayahKeys.lists(), params] as const,
	details: () => [...wilayahKeys.all, "detail"] as const,
	detail: (id: string) => [...wilayahKeys.details(), id] as const,
	kecamatans: (wilayahId: string) =>
		[...wilayahKeys.detail(wilayahId), "kecamatan"] as const,
	kecamatanList: (wilayahId: string, params?: GetKecamatanParams) =>
		[...wilayahKeys.kecamatans(wilayahId), params] as const,
	kelurahans: (wilayahId: string) =>
		[...wilayahKeys.detail(wilayahId), "kelurahan"] as const,
	kelurahanList: (wilayahId: string, params?: GetKelurahanParams) =>
		[...wilayahKeys.kelurahans(wilayahId), params] as const,
};

export const useWilayahList = (params?: GetWilayahParams) => {
	return useQuery({
		queryKey: wilayahKeys.list(params),
		queryFn: () => getWilayahListAction(params),
		staleTime: 1000 * 60 * 60 * 24, // 24 jam cache karena nama wilayah tidak akan berubah
	});
};

export const useWilayahDetail = (id: string, enabled = true) => {
	return useQuery({
		queryKey: wilayahKeys.detail(id),
		queryFn: () => getWilayahDetailAction(id),
		enabled: !!id && enabled,
		staleTime: 1000 * 60 * 60 * 24,
	});
};

export const useKecamatanList = (
	wilayahId: string,
	params?: GetKecamatanParams,
	enabled = true,
) => {
	return useQuery({
		queryKey: wilayahKeys.kecamatanList(wilayahId, params),
		queryFn: () => getKecamatanListAction(wilayahId, params),
		enabled: !!wilayahId && enabled,
		staleTime: 1000 * 60 * 60 * 24,
	});
};

export const useKelurahanList = (
	wilayahId: string,
	params?: GetKelurahanParams,
	enabled = true,
) => {
	return useQuery({
		queryKey: wilayahKeys.kelurahanList(wilayahId, params),
		queryFn: () => getKelurahanListAction(wilayahId, params),
		enabled: !!wilayahId && enabled,
		staleTime: 1000 * 60 * 60 * 24,
	});
};
