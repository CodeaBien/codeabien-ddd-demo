import { WeakPasswordError } from '../errors';

export class Password {
	private readonly _value: string;
	private readonly _strength: PasswordStrength;

	constructor(value: string) {
		this.validatePassword(value);
		this._value = value;
		this._strength = this.calculateStrength(value);
	}

	get value(): string {
		return this._value;
	}

	get strength(): PasswordStrength {
		return this._strength;
	}

	private validatePassword(password: string): void {
		if (!password || password.length === 0) {
			throw new WeakPasswordError('La contraseña no puede estar vacía');
		}

		if (password.length < 8) {
			throw new WeakPasswordError('La contraseña debe tener al menos 8 caracteres');
		}

		if (password.length > 128) {
			throw new WeakPasswordError('La contraseña no puede exceder 128 caracteres');
		}

		if (!this.hasRequiredCharacters(password)) {
			throw new WeakPasswordError(
				'La contraseña debe contener al menos una letra mayúscula, una minúscula y un número'
			);
		}

		if (this.hasCommonPatterns(password)) {
			throw new WeakPasswordError('La contraseña contiene patrones comunes no permitidos');
		}
	}

	private hasRequiredCharacters(password: string): boolean {
		const hasUpperCase = /[A-Z]/.test(password);
		const hasLowerCase = /[a-z]/.test(password);
		const hasNumber = /\d/.test(password);

		return hasUpperCase && hasLowerCase && hasNumber;
	}

	private hasCommonPatterns(password: string): boolean {
		const commonPatterns = [
			'123456',
			'password',
			'qwerty',
			'abc123',
			'admin',
			'letmein',
			'welcome',
			'monkey',
			'dragon',
			'master',
		];

		const lowerPassword = password.toLowerCase();
		return commonPatterns.some((pattern) => lowerPassword.includes(pattern));
	}

	private calculateStrength(password: string): PasswordStrength {
		let score = 0;

		// Longitud
		if (password.length >= 8) score += 1;
		if (password.length >= 12) score += 1;
		if (password.length >= 16) score += 1;

		// Caracteres
		if (/[a-z]/.test(password)) score += 1;
		if (/[A-Z]/.test(password)) score += 1;
		if (/\d/.test(password)) score += 1;
		if (/[^a-zA-Z\d]/.test(password)) score += 1;

		// Complejidad
		if (this.hasRequiredCharacters(password)) score += 1;
		if (!this.hasCommonPatterns(password)) score += 1;

		if (score <= 3) return PasswordStrength.WEAK;
		if (score <= 5) return PasswordStrength.MEDIUM;
		if (score <= 7) return PasswordStrength.STRONG;
		return PasswordStrength.VERY_STRONG;
	}

	/**
	 * Verifica si la contraseña es lo suficientemente fuerte para el contexto
	 */
	isStrongEnough(minimumStrength: PasswordStrength = PasswordStrength.MEDIUM): boolean {
		const strengthOrder = {
			[PasswordStrength.WEAK]: 0,
			[PasswordStrength.MEDIUM]: 1,
			[PasswordStrength.STRONG]: 2,
			[PasswordStrength.VERY_STRONG]: 3,
		};

		return strengthOrder[this._strength] >= strengthOrder[minimumStrength];
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

export enum PasswordStrength {
	WEAK = 'WEAK',
	MEDIUM = 'MEDIUM',
	STRONG = 'STRONG',
	VERY_STRONG = 'VERY_STRONG',
}
