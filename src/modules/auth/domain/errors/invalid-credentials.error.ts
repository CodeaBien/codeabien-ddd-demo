export class InvalidCredentialsError extends Error {
	constructor() {
		super('Las credenciales proporcionadas no son válidas');
		this.name = 'InvalidCredentialsError';
	}
}
