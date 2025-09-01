export class Email {
	private readonly _value: string;

	constructor(value: string) {
		if (!this.isValidEmailFormat(value)) {
			throw new Error('El formato del email no es válido');
		}
		this._value = value.toLowerCase().trim();
	}

	get value(): string {
		return this._value;
	}

	private isValidEmailFormat(email: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	equals(other: Email): boolean {
		return this._value === other._value;
	}

	toString(): string {
		return this._value;
	}
}
