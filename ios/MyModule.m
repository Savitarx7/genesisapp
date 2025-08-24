#import <React/RCTBridgeModule.h>
#import <React/RCTLog.h>

@interface MyModule : NSObject <RCTBridgeModule>
@end

@implementation MyModule {
  dispatch_queue_t _serialQueue;
}

RCT_EXPORT_MODULE();

- (instancetype)init
{
  if (self = [super init]) {
    // Create a serial queue to ensure thread safety instead of using a global concurrent queue
    _serialQueue = dispatch_queue_create("com.genesisapp.MyModule", DISPATCH_QUEUE_SERIAL);
  }
  return self;
}

// Example method exposed to JavaScript that processes a string input
RCT_EXPORT_METHOD(doSomething:(NSString *)input callback:(RCTResponseSenderBlock)callback)
{
  // Validate input from JavaScript
  if (input == nil || [input length] == 0) {
    RCTLogError(@"doSomething called with invalid input");
    if (callback) {
      callback(@[@"Input cannot be empty", [NSNull null]]);
    }
    return;
  }

  RCTLogInfo(@"doSomething called with input: %@", input);

  // Run work asynchronously on the module's serial queue for thread safety
  dispatch_async(_serialQueue, ^{
    @try {
      // Simulate some native work with the input
      NSString *result = [NSString stringWithFormat:@"Processed %@", input];
      RCTLogInfo(@"doSomething processed: %@", result);
      if (callback) {
        callback(@[[NSNull null], result]);
      }
    }
    @catch (NSException *exception) {
      // Catch any Objective-C exceptions and send them back to JavaScript
      RCTLogError(@"Exception in doSomething: %@", exception);
      if (callback) {
        callback(@[exception.reason ?: @"Unknown error", [NSNull null]]);
      }
    }
  });
}

@end
