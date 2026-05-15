import { wilayahService } from "../services/wilayah.service";
import type {
	GetKecamatanParams,
	GetKelurahanParams,
	GetWilayahParams,
} from "../types/wilayah.types";

export const getWilayahListAction = (params?: GetWilayahParams) => {
	return wilayahService.getAll(params);
};

export const getWilayahDetailAction = (id: string) => {
	return wilayahService.getById(id);
};

export const getKecamatanListAction = (
	wilayahId: string,
	params?: GetKecamatanParams,
) => {
	return wilayahService.getKecamatan(wilayahId, params);
};

export const getKelurahanListAction = (
	wilayahId: string,
	params?: GetKelurahanParams,
) => {
	return wilayahService.getKelurahan(wilayahId, params);
};
