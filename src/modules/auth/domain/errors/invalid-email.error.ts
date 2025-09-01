export class InvalidEmailError extends Error {
	constructor(email: string, reason?: string) {
		const message = reason ? `Email inválido: ${email}. Razón: ${reason}` : `Email inválido: ${email}`;
		super(message);
		this.name = 'InvalidEmailError';
	}
}
