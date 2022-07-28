//
//  RNMailModule.m
//  RNMailModule
//
//  Copyright © 2022 TheKeeroll. All rights reserved.
//
#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(RNMailModule, NSObject)
RCT_EXTERN_METHOD(SetServerConfig: (NSDictionary)imap smtpCfg:(NSDictionary)smtp)
RCT_EXTERN_METHOD(Login: (NSDictionary)credentials resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(GetFolders: (RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(CreateFolder: (NSString)folderName resolver: (RCTPromiseResolveBlock)resolve rejecter: (RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(RenameFolder: (NSString)folderNames resolver: (RCTPromiseResolveBlock)resolve rejecter: (RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(GetMail: (NSDictionary)mailinfo resolver: (RCTPromiseResolveBlock)resolve rejecter: (RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(GetMails: (NSDictionary)params resolver: (RCTPromiseResolveBlock)resolve rejecter: (RCTPromiseRejectBlock)reject)
@end
