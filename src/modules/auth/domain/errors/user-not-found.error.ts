export class UserNotFoundError extends Error {
	constructor(email: string) {
		super(`Usuario no encontrado con el email: ${email}`);
		this.name = 'UserNotFoundError';
	}
}
