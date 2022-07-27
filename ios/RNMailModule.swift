//
//  RNMailModule.swift
//  RNMailModule
//
//  Copyright © 2022 TheKeeroll. All rights reserved.
//

import Foundation



@objc(RNMailModule)
class RNMailModule: NSObject {
  @objc var mIMAPSession;
  @objc var mSMTPSession;

  @objc var mParams : NSDictionary;

  @objc init(){
    mIMAPSession = MCOIMAPSession();
    mSMTPSession = MCOSMPTSession();
  }

  @objc
  func SetParams(_ params: NSDictionary) -> void {
    mParams = params;
  }

  @objc func Login(_ resolve: RCTPromiseResolveBlock, rejecter reject: RCTPromiseRejectBlock) -> void {
    mIMAPSession.hostname = mParams["hostname"];
    mIMAPSession.port = mParams["port"];
    mIMAPSession.username = mParams["username"];
    mIMAPSession.password = mParams["passowrd"];
    mIMAPSession.connectionType = mParams["connectionType"];

    mSMTPession.hostname = mParams["hostname"];
    mSMTPession.port = mParams["port"];
    mSMTPession.username = mParams["username"];
    mSMTPession.password = mParams["passowrd"];
    mSMTPession.connectionType = mParams["connectionType"];
    
    if let connectOp = mIMAPSession.connectOperation(){
      connectOp.start{ error in
        resolve(error);
      }
    } else {
        reject("FAIL");
    }

  }


  @objc
  func constantsToExport() -> [AnyHashable : Any]! {
    return ["count": 1]
  }

  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
