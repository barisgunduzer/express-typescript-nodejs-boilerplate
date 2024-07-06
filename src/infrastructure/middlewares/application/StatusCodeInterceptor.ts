import { Action, InterceptorInterface } from 'routing-controllers';
import { Service } from 'typedi';

@Service()
// @Interceptor() // Use if this is a global interceptor
export class StatusCodeInterceptor implements InterceptorInterface {
  intercept(action: Action, content: any) {
    content.status = 300;
    // console.log('I\'m an interceptor!', action.request.body, content);
    return content;
  }
}
