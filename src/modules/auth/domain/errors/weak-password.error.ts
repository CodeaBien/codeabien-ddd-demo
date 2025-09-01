export class WeakPasswordError extends Error {
	constructor(reason: string) {
		super(`Contraseña débil: ${reason}`);
		this.name = 'WeakPasswordError';
	}
}
