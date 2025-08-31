import {signToken} from "../../infra/auth/jwt";
import {Role} from "../../domain/enums/role";

export class SignInUseCase {
    constructor() {
    }

    async execute(role: Role): Promise<{ token: string }> {
        const token = signToken({role})
        return {token}
    }
}
