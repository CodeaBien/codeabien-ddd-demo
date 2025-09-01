export class TemporaryEmailNotAllowedError extends Error {
	constructor(email: string) {
		super(`No se permiten emails temporales: ${email}`);
		this.name = 'TemporaryEmailNotAllowedError';
	}
}
