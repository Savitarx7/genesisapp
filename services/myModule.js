import { NativeModules } from 'react-native';

const { MyModule } = NativeModules;

/**
 * Wrapper around the native MyModule.doSomething method.
 * Validates input and handles errors gracefully.
 * @param {string} input
 * @returns {Promise<string>} result from native code
 */
export const doSomething = async (input) => {
  if (typeof input !== 'string' || input.trim().length === 0) {
    console.log('doSomething called with invalid input');
    throw new Error('Input must be a non-empty string');
  }

  try {
    console.log('Calling MyModule.doSomething with input:', input);
    return await new Promise((resolve, reject) => {
      MyModule.doSomething(input, (error, result) => {
        if (error) {
          console.log('MyModule.doSomething returned error:', error);
          reject(new Error(error));
        } else {
          console.log('MyModule.doSomething returned result:', result);
          resolve(result);
        }
      });
    });
  } catch (err) {
    console.log('Error invoking MyModule.doSomething:', err);
    throw err;
  }
};
