import { UserLoggedInEvent, UserRegisteredEvent } from '../events';
import { DomainEvent } from '../events/domain-event.interface';
import { Email } from '../value-objects/email.vo';
import { Password } from '../value-objects/password.vo';

export class UserAggregate {
	private _domainEvents: DomainEvent[] = [];

	private constructor(
		private readonly _id: string,
		private readonly _email: Email,
		private readonly _password: Password
	) {}

	static create(email: string, password: string): UserAggregate {
		const emailVO = new Email(email);
		const passwordVO = new Password(password);
		const now = new Date();

		// En un escenario real, el ID sería generado aquí o por el repositorio
		const user = new UserAggregate('', emailVO, passwordVO);

		// Emitir evento de dominio
		user.addDomainEvent(new UserRegisteredEvent('', emailVO.value, now));

		return user;
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
	 * Realiza el login del usuario y emite el evento correspondiente
	 */
	login(ipAddress?: string, userAgent?: string): void {
		// En un caso real, aquí podríamos validar intentos de login,
		// verificar si la cuenta está bloqueada, etc.
		this.addDomainEvent(new UserLoggedInEvent(this._id, this._email.value, new Date(), ipAddress, userAgent));
	}

	/**
	 * Obtiene la representación de la contraseña para persistencia
	 * TODO: En un caso real, esto debería devolver el hash
	 */
	getPasswordForPersistence(): string {
		return this._password.value;
	}

	/**
	 * Agrega un evento de dominio al agregado
	 */
	private addDomainEvent(event: DomainEvent): void {
		this._domainEvents.push(event);
	}

	/**
	 * Obtiene todos los eventos de dominio pendientes
	 */
	getDomainEvents(): DomainEvent[] {
		return [...this._domainEvents];
	}

	/**
	 * Limpia los eventos de dominio después de ser procesados
	 */
	clearDomainEvents(): void {
		this._domainEvents = [];
	}
}
