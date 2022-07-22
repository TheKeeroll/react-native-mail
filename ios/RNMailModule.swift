//
//  RNMailModule.swift
//  RNMailModule
//
//  Copyright © 2022 TheKeeroll. All rights reserved.
//

import Foundation

@objc(RNMailModule)
class RNMailModule: NSObject {
  @objc
  func constantsToExport() -> [AnyHashable : Any]! {
    return ["count": 1]
  }

  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
}
