import { InvalidEmailError } from '../errors';

export class Email {
	private readonly _value: string;
	private readonly _domain: string;
	private readonly _localPart: string;

	constructor(value: string) {
		const trimmedValue = value.trim();

		if (!this.isValidEmailFormat(trimmedValue)) {
			throw new InvalidEmailError(trimmedValue, 'formato inválido');
		}

		if (!this.isValidLength(trimmedValue)) {
			throw new InvalidEmailError(trimmedValue, 'longitud inválida');
		}

		if (!this.hasValidCharacters(trimmedValue)) {
			throw new InvalidEmailError(trimmedValue, 'caracteres inválidos');
		}

		this._value = trimmedValue.toLowerCase();
		const [localPart, domain] = this._value.split('@');
		this._localPart = localPart;
		this._domain = domain;
	}

	get value(): string {
		return this._value;
	}

	get domain(): string {
		return this._domain;
	}

	get localPart(): string {
		return this._localPart;
	}

	private isValidEmailFormat(email: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	private isValidLength(email: string): boolean {
		// RFC 5321: local part max 64 chars, domain max 253 chars, total max 254 chars
		return email.length <= 254 && email.length > 0;
	}

	private hasValidCharacters(email: string): boolean {
		// Validar que no tenga caracteres peligrosos o no permitidos
		const dangerousChars = /[<>\"'&]/;
		return !dangerousChars.test(email);
	}

	/**
	 * Verifica si el email pertenece a un dominio temporal conocido
	 */
	isTemporaryEmail(): boolean {
		const temporaryDomains = [
			'10minutemail.com',
			'tempmail.org',
			'guerrillamail.com',
			'mailinator.com',
			'temp-mail.org',
			'yopmail.com',
		];
		return temporaryDomains.includes(this._domain);
	}

	/**
	 * Verifica si el email pertenece a un proveedor de email conocido
	 */
	isFromKnownProvider(): boolean {
		const knownProviders = [
			'gmail.com',
			'yahoo.com',
			'hotmail.com',
			'outlook.com',
			'live.com',
			'icloud.com',
			'protonmail.com',
		];
		return knownProviders.includes(this._domain);
	}

	equals(other: Email): boolean {
		return this._value === other._value;
	}

	toString(): string {
		return this._value;
	}
}
