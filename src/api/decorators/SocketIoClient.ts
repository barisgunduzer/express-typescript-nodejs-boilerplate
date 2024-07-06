import { createParamDecorator } from 'routing-controllers';

export function SocketIoClient(options?: { required?: boolean }) {
  return createParamDecorator({
    required: options && options.required,
    value: (action) => {
      if (action.request.app) {
        return action.request.io;
      }

      return undefined;
    },
  });
}
