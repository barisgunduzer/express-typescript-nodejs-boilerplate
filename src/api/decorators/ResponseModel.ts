// TODO: This is a custom decorator that I created to simplify the use of the ResponseSchema decorator from routing-controllers-openapi. But it's not working as expected.'

// import { ResponseSchema } from 'routing-controllers-openapi';
//
// export function ResponseModel(
//   responseSchema: Function,
//   options?: {
//     statusCode?: string;
//     contentType?: string;
//     description?: string;
//     isArray?: boolean;
//   },
// ) {
//
//   const ApiResponseSchemaOptions = {
//     contentType: options?.contentType ? options.contentType : 'application/json',
//     statusCode: options?.statusCode ? options.statusCode : '200',
//     description: options?.description ? options.description : 'Operation completed successfully',
//     isArray: options?.isArray,
//   };
//
//   return ResponseSchema(responseSchema, ApiResponseSchemaOptions);
// }
