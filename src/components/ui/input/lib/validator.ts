import check from 'validator'
import { Input } from '../input'

export class Validator {
	element: Input
	methods: Array<string>
	errors: Array<object> = []

	constructor (element: Input) {
		this.element = element
		this.prepare()
	}

	validate (instance: Input): { errors?: any; valid?: boolean; level?: number; } {
		this.errors = []
		this.element = instance

		this.tests()

		return this.results()
	}

	prepare() {
		this.methods = []

		if (this.element.required) {
			this.methods.push("required")
		}

		this.methods.push(this.element.type)

		if (this.element.validates) {
			const methods: any = this.element.validates.split(',')
			this.methods = [...this.methods, methods]
		}
	}

	results (): { errors?: any; valid?: boolean; level?: number; } {
		const valid = (this.errors.length === 0)

		return {
			errors: this.errors,
			valid: valid,
		}
	}

	tests () {
		this.checkEmpty()
		this.checkEmail()
		this.checkColor()
		this.checkTelephone()
		this.checkIP()
		this.checkURL()
		this.checkPassword()
	}

	addError (method: string, message: string) {
		this.errors.push({ method, message })
	}

	checkEmpty () {
		if (check.isIn("required", this.methods)) {
			const result = check.isEmpty(this.element.val())

			if (result) {
				this.addError("required", "This field is required.")
			}
		}
	}

	checkEmail () {
		if (check.isIn("email", this.methods)) {
			const result = check.isEmail(this.element.val())

			if (!result) {
				this.addError("email", "Please enter a valid email.")
			}
		}

	}

	checkColor () {
		if (check.isIn("color", this.methods)) {
			const result = check.isHexColor(this.element.val())

			if (!result) {
				this.addError("color", "Please enter a valid color.")
			}
		}
	}

	checkURL () {
		if (check.isIn("url", this.methods)) {
			const result = check.isURL(this.element.val())

			if (!result) {
				this.addError("url", "Please enter a valid URL.")
			}
		}
	}

	checkIP () {
		if (check.isIn("ipv4", this.methods)) {
			const result = check.isIP(this.element.val(), 4)

			if (!result) {
				this.addError("ipv4", "Please enter a valid IP Address.")
			}
		}

		if (check.isIn("ipv6", this.methods)) {
			const result = check.isIP(this.element.val(), 6)

			if (!result) {
				this.addError("ipv6", "Please enter a valid IP Address.")
			}
		}
	}

	checkTelephone () {
		if (check.isIn("tel", this.methods)) {
			const result = check.isMobilePhone(this.element.val(), 'any')

			if (!result) {
				this.addError("tel", "Please enter a valid phone number.")
			}
		}
	}

	checkPassword () {
		if (check.isIn("password", this.methods)) {
			const result: any = this.element.getStrength()

			if (result.score < 3) {
				this.addError("password", "This password must be stonger.")

				if (result.feedback.warning) {
					this.addError("password_warning", result.feedback.warning)
				}
			}

			if (check.isEmail(this.element.val())) {
				this.element.setStrength(0);
				this.addError("password_warning", "This password is an email.")
			}
		}
	}
}
