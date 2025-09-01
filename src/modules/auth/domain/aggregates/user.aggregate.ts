import { Email } from '../value-objects/email.vo';
import { Password } from '../value-objects/password.vo';

export class UserAggregate {
	private constructor(
		private readonly _id: string,
		private readonly _email: Email,
		private readonly _password: Password
	) {}

	static create(email: string, password: string): UserAggregate {
		const emailVO = new Email(email);
		const passwordVO = new Password(password);

		// En un escenario real, el ID sería generado aquí o por el repositorio
		return new UserAggregate('', emailVO, passwordVO);
	}

	static reconstituteFromPersistence(id: string, email: string, password: string): UserAggregate {
		const emailVO = new Email(email);
		const passwordVO = new Password(password);

		return new UserAggregate(id, emailVO, passwordVO);
	}

	get id(): string {
		return this._id;
	}

	get email(): Email {
		return this._email;
	}

	get emailAddress(): string {
		return this._email.value;
	}

	/**
	 * Verifica si las credenciales proporcionadas coinciden con las del usuario
	 */
	verifyCredentials(candidatePassword: string): boolean {
		return this._password.verifyPassword(candidatePassword);
	}

	/**
	 * Obtiene la representación de la contraseña para persistencia
	 * TODO: En un caso real, esto debería devolver el hash
	 */
	getPasswordForPersistence(): string {
		return this._password.value;
	}
}
