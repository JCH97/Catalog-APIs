import {signToken} from "../../infra/auth/jwt.js";
import {Role} from "../../domain/enums/role.js";

/**
 * @class SignInUseCase
 * @description Use case for signing in a user.
 */
export class SignInUseCase {
    /**
     * @constructor
     */
    constructor() {
    }

    /**
     * @method execute
     * @description Executes the use case.
     * @param {Role} role - The role of the user to sign in.
     * @returns {Promise<{token: string}>} A promise that resolves with a token.
     */
    async execute(role: Role): Promise<{ token: string }> {
        const token = signToken({role})
        return {token}
    }
}
