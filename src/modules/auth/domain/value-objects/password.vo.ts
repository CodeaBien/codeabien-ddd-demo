export class Password {
	private readonly _value: string;

	constructor(value: string) {
		if (!this.meetsSecurityRequirements(value)) {
			throw new Error('La contraseña debe cumplir los requisitos mínimos de seguridad (mínimo 6 caracteres)');
		}
		this._value = value;
	}

	get value(): string {
		return this._value;
	}

	private meetsSecurityRequirements(password: string): boolean {
		return password.length >= 6;
	}

	verifyPassword(candidatePassword: string): boolean {
		// En un caso real, aquí se haría hash y comparación segura
		// Por simplicidad, comparación directa
		return this._value === candidatePassword;
	}

	equals(other: Password): boolean {
		return this._value === other._value;
	}
}
