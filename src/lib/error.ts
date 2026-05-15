export interface ApiErrorResponse {
	success: boolean;
	message: string;
	code?: string;
	details?: Record<string, string | string[]>;
}

export class AppError extends Error {
	public code?: string;
	public details?: Record<string, string | string[]>;

	constructor(
		message: string,
		code?: string,
		details?: Record<string, string | string[]>,
	) {
		super(message);
		this.name = "AppError";
		this.code = code;
		this.details = details;
	}
}

export const createSuccessResponse = <T>(data: T, message = "Success") => ({
	success: true,
	message,
	data,
});

export const createErrorResponse = (error: AppError | Error) => ({
	success: false,
	message: error.message,
	code: error instanceof AppError ? error.code : "UNKNOWN_ERROR",
	details: error instanceof AppError ? error.details : undefined,
});

export const handleError = (error: unknown): AppError => {
	if (error instanceof AppError) {
		return error;
	}
	if (error instanceof Error) {
		return new AppError(error.message);
	}
	return new AppError("Terjadi kesalahan yang tidak diketahui");
};
