import { AuthGuard } from "@nestjs/passport";

export class CustomAuthGuard extends AuthGuard('local') { }