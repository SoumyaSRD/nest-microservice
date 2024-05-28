import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { UserDocument } from "../users/models/user.scema";
const getUserByContext = (context: ExecutionContext): UserDocument => context.switchToHttp().getRequest().user
export const DUser = createParamDecorator((_data: unknown, context: ExecutionContext) => getUserByContext(context)) 