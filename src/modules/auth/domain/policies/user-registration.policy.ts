import { TemporaryEmailNotAllowedError } from '../errors';
import { Email } from '../value-objects/email.vo';
import { Password, PasswordStrength } from '../value-objects/password.vo';

export interface UserRegistrationPolicy {
	validateEmail(email: Email): void;
	validatePassword(password: Password): void;
	validateRegistrationContext(email: Email, password: Password): void;
}

export class StandardUserRegistrationPolicy implements UserRegistrationPolicy {
	validateEmail(email: Email): void {
		// Verificar que no sea un email temporal
		if (email.isTemporaryEmail()) {
			throw new TemporaryEmailNotAllowedError(email.value);
		}

		// En un contexto más avanzado, podríamos verificar:
		// - Lista negra de dominios
		// - Verificación de existencia del dominio
		// - Políticas específicas por organización
	}

	validatePassword(password: Password): void {
		// Verificar que la contraseña cumpla con los estándares mínimos
		if (!password.isStrongEnough(PasswordStrength.MEDIUM)) {
			throw new Error(`La contraseña debe tener al menos fortaleza ${PasswordStrength.MEDIUM}`);
		}
	}

	validateRegistrationContext(email: Email, password: Password): void {
		// Validaciones que requieren ambos valores
		this.validateEmail(email);
		this.validatePassword(password);

		// Verificar que la contraseña no contenga información del email
		if (this.passwordContainsEmailInfo(password, email)) {
			throw new Error('La contraseña no puede contener información del email');
		}
	}

	private passwordContainsEmailInfo(password: Password, email: Email): boolean {
		const passwordLower = password.value.toLowerCase();
		const emailLocalPart = email.localPart.toLowerCase();
		const emailDomain = email.domain.toLowerCase();

		// Verificar si la contraseña contiene partes del email
		return (
			passwordLower.includes(emailLocalPart) ||
			passwordLower.includes(emailDomain) ||
			passwordLower.includes(email.value.toLowerCase())
		);
	}
}

export class StrictUserRegistrationPolicy implements UserRegistrationPolicy {
	validateEmail(email: Email): void {
		// Política más estricta: solo permitir proveedores conocidos
		if (!email.isFromKnownProvider()) {
			throw new Error('Solo se permiten emails de proveedores conocidos');
		}

		if (email.isTemporaryEmail()) {
			throw new TemporaryEmailNotAllowedError(email.value);
		}
	}

	validatePassword(password: Password): void {
		// Política más estricta: contraseñas muy fuertes
		if (!password.isStrongEnough(PasswordStrength.STRONG)) {
			throw new Error(`La contraseña debe tener al menos fortaleza ${PasswordStrength.STRONG}`);
		}
	}

	validateRegistrationContext(email: Email, password: Password): void {
		this.validateEmail(email);
		this.validatePassword(password);

		// Validaciones adicionales para política estricta
		if (this.passwordContainsEmailInfo(password, email)) {
			throw new Error('La contraseña no puede contener información del email');
		}

		// Verificar longitud mínima más estricta
		if (password.value.length < 12) {
			throw new Error('La contraseña debe tener al menos 12 caracteres');
		}
	}

	private passwordContainsEmailInfo(password: Password, email: Email): boolean {
		const passwordLower = password.value.toLowerCase();
		const emailLocalPart = email.localPart.toLowerCase();
		const emailDomain = email.domain.toLowerCase();

		return (
			passwordLower.includes(emailLocalPart) ||
			passwordLower.includes(emailDomain) ||
			passwordLower.includes(email.value.toLowerCase())
		);
	}
}
