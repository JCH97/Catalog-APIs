import {signToken} from "../../infra/auth/jwt.js";
import {Role} from "../../domain/enums/role.js";

export class SignInUseCase {
    constructor() {
    }

    async execute(role: Role): Promise<{ token: string }> {
        const token = signToken({role})
        return {token}
    }
}
