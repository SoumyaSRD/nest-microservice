import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const DUser = createParamDecorator(
    async (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const user = await request.user.toPromise()
        console.log("promise", user);

        return user;
    },
);