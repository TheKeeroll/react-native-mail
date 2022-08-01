//
//  RNMailModule.swift
//  RNMailModule
//
//  Copyright © 2022 TheKeeroll. All rights reserved.
//

import Foundation
import UIKit
import Accelerate

@objc(RNMailModule)
class RNMailModule: NSObject {
    
    enum RNMailCoreError: Error{
        case RunTimeError(String)
    }
    
    struct ServerConfiguration{
        var hostname: String = "";
        var port: UInt32 = 0;
        var checkCertificate: Bool = false;
        var authType: MCOAuthType = .saslLogin;
        var connectionType: MCOConnectionType = .TLS;
        
        init(_ raw: NSDictionary){
            hostname = raw["hostname"] as! String;
            port = raw["port"] as! UInt32;
            checkCertificate = raw["checkCertificate"] as! Bool;
            authType = MCOAuthType(rawValue: raw["authType"] as! Int);
            connectionType = MCOConnectionType(rawValue: raw["connectionType"] as! Int);
        }
        init(){}
    }
    
    struct UserCredentials{
        var username: String = "";
        var password: String = "";
        var token: String = "";
        init(_ raw: NSDictionary){
            username = raw["username"] as! String;
            password = raw["password"] as! String;
            token    = raw["token"] as! String;
        }
        init(){}
    }
    
    
    
    @objc private var mIMAPSession = MCOIMAPSession();
    @objc private var mSMTPSession = MCOSMTPSession();
    private var mIMAPConfig = ServerConfiguration();
    private var mSMTPConfig = ServerConfiguration();
    private var mCredentials = UserCredentials();
    
    @objc override init(){}
    
    @objc public func SetServerConfig(_ imap: NSDictionary, smtpCfg smtp: NSDictionary) -> Void {
        mIMAPConfig = ServerConfiguration(imap);
        mSMTPConfig = ServerConfiguration(smtp);
        
        mIMAPSession.hostname = mIMAPConfig.hostname;
        mIMAPSession.port = mIMAPConfig.port;
        mIMAPSession.authType = mIMAPConfig.authType;
        mIMAPSession.connectionType = mIMAPConfig.connectionType;
        mIMAPSession.isCheckCertificateEnabled = mIMAPConfig.checkCertificate;
        
        mSMTPSession.hostname = mSMTPConfig.hostname;
        mSMTPSession.port = mSMTPConfig.port;
        mSMTPSession.authType = .saslLogin;//mSMTPConfig.authType;
        mSMTPSession.connectionType = .startTLS;//mSMTPConfig.connectionType;
        mSMTPSession.isCheckCertificateEnabled = mSMTPConfig.checkCertificate;
    }
    
    @objc public func Login(_ credentials: NSDictionary, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
        mCredentials = UserCredentials(credentials);
        
        mIMAPSession.username = mCredentials.username;
        mSMTPSession.username = mCredentials.username;
        
        //if(mIMAPSession.authType == MCOAuthType.xoAuth2){
        //    mIMAPSession.oAuth2Token = mCredentials.token;
        //} else {
            mIMAPSession.password = mCredentials.password;
        //}
        
        //if(mSMTPSession.authType == MCOAuthType.xoAuth2){
        //    mSMTPSession.oAuth2Token = mCredentials.token;
        //} else {
            mSMTPSession.password = mCredentials.password;
        //}
    
        if let checkIMAP = mIMAPSession.checkAccountOperation() {
            checkIMAP.start(){(error)->() in
                if (error != nil) {
                    reject("IMAP Login error", error.debugDescription, error);
                    return;
                }
                if let checkSMTP = self.mSMTPSession.loginOperation() {
                    checkSMTP.start(){(error)->() in
                        if (error != nil) {
                            reject("SMTP Login error", error.debugDescription, error);
                            return;
                        }
                        resolve(0);
                        return;
                    }
                } else {
                    reject("SMTP Login error", "Failed to create loginOperation()", nil);
                    return;
                }
            }
        } else {
            reject("IMAP Login error", "Failed to create checkAccountOperation()", nil);
            return;
        }
    }
    
    @objc public func GetFolders(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
        if let getFoldersOp = mIMAPSession.fetchAllFoldersOperation(){
            getFoldersOp.start(){ (error, foldersRaw)-> () in
                if (error != nil){
                    reject("GetFolders error", error.debugDescription, error);
                    return;
                }
                var folders: [[String:String]] = [];
                for folderRaw in foldersRaw! {
                    var folderDict: [String:String] = [:];
                    let folder: MCOIMAPFolder = folderRaw as! MCOIMAPFolder;
                    let flags: Int = folder.flags.rawValue;
                    folderDict["flags"] = String(flags);
                    folderDict["path"] = folder.path;
                    folders.append(folderDict);
                }
                resolve(folders);
                return;
            }
        }
    }
    
    @objc public func CreateFolder(_ folderName: NSString, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
        if let createFolderOp = mIMAPSession.createFolderOperation(folderName as String){
            createFolderOp.start(){(error)->() in
                if(error != nil){
                    reject("CreateFolder", error.debugDescription, error);
                    return;
                }
                resolve(0);
                return;
            }
        } else {
            reject("CreateFolder", "Failed to create createFolderOperation()", nil);
            return;
        }
    }
    
    @objc public func RenameFolder(_ folderNames: NSDictionary, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
        
        if let renameFolderOp = mIMAPSession.renameFolderOperation((folderNames["old"] as! String), otherName: (folderNames["new"] as! String)){
            renameFolderOp.start(){(error)->() in
                if(error != nil){
                    reject("RenameFolder", error.debugDescription, error);
                    return;
                }
                resolve(0);
                return;
            }
        } else {
            reject("RenameFolder", "Failed to create renameFolderOperation()", nil);
            return;
        }
    }
    
    @objc public func GetMail(_ mailInfo: NSDictionary, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
        let folder = (mailInfo["folder"] as! String);
        let messageUID = MCOIndexSet(index: mailInfo["messageUID"] as! UInt64);
        let requestKind = MCOIMAPMessagesRequestKind(rawValue: mailInfo["requestKind"] as! Int);
        
        if let getMailOp = mIMAPSession.fetchMessagesOperation(withFolder: folder, requestKind: requestKind, uids: messageUID){
            getMailOp.start(){(error, messageRaw, vanished)->() in
                if(error != nil){
                    reject("GetMail", error.debugDescription, error);
                    return;
                }
                let message = messageRaw![0] as! MCOIMAPMessage;
                var messageData: [String: Any] = [:];
                messageData["uid"] = message.uid;
                messageData["flags"] = message.flags.rawValue;
                messageData["subject"] = message.header.subject;
                messageData["from"] = [
                    "mailbox": message.header.from.mailbox,
                    "name": message.header.from.displayName
                ];
                
                if(message.header.to != nil){
                    var recipients: [String:String] = [:]
                    for target in message.header.to {
                        recipients[(target as AnyObject).mailbox] = (target as AnyObject).displayName;
                    }
                    messageData["recipients"] = recipients;
                }
                
                if(message.header.cc != nil){
                    var cc: [String:String] = [:]
                    for target in message.header.cc {
                        cc[(target as AnyObject).mailbox] = (target as AnyObject).displayName;
                    }
                    messageData["cc"] = cc;
                }
                
                if(message.header.bcc != nil){
                    var bcc: [String:String] = [:]
                    for target in message.header.bcc {
                        bcc[(target as AnyObject).mailbox] = (target as AnyObject).displayName;
                    }
                    messageData["bcc"] = bcc;
                }
                
                if((message.attachments().count) > 0){
                    var attachmentsData: [String:Any] = [:];
                    for part in message.attachments() {
                        var attachmentData: [String: Any] = [:];
                        let path = NSURL(fileURLWithPath: NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true)[0]).appendingPathComponent((part as AnyObject).filename);
                        
                        attachmentData["fileName"] = path!.absoluteString;
                        attachmentData["size"] = (part as AnyObject).size as Int;
                        attachmentData["encoding"] = ((part as AnyObject).encoding as MCOEncoding).rawValue;
                        attachmentData["uid"] = (part as AnyObject).uniqueID;
                        attachmentsData[(part as AnyObject).partID] = attachmentData;
                    }
                    messageData["attachments"] = attachmentsData;
                }
                
                if let getFullMailOp = self.mIMAPSession.fetchMessageOperation(withFolder: folder, uid: message.uid){
                    getFullMailOp.start(){(error, data)->() in
                        if(error != nil){
                            reject("GetMail", error.debugDescription, error);
                            return;
                        }
                        //let inlineData = [NSString .localizedStringWithFormat("data:image/jpg;base64,%@", [data? //.base64EncodedString(options: .lineLength64Characters)])];
                        let parser = MCOMessageParser(data: data);
                        let htmlBody = parser?.htmlBodyRendering();
                        let plainBody = parser?.plainTextRendering();
                        var inlineAttachments: [Any] = [];
                        // let inlineAttachments = parser?.htmlInlineAttachments();
                        for attachment in parser!.htmlInlineAttachments(){
                            var dict: [String: Any] = [:];
                            dict["data"] = [NSString .localizedStringWithFormat("data:%@;base64,%@",  (attachment as AnyObject).mimeType), [(attachment as AnyObject).data .base64EncodedString(options: .lineLength64Characters)]];
                            dict["cid"] = (attachment as AnyObject).contentID;
                            inlineAttachments.append(dict);
                        }
                        messageData["plainBody"] = plainBody;
                        messageData["htmlBody"] = htmlBody;
                        messageData["inlines"] = inlineAttachments;
                        resolve(messageData);
                    }
                } else {
                    reject("GetMail", "Failed to create fetchMessagesOperation() (2)", nil);
                }
                
            }
        } else {
            reject("GetMail", "Failed to create fetchMessagesOperation()", nil);
            return;
        }

    }
    
    @objc public func GetMails(_ params: NSDictionary, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
        let folder: String = (params["path"] as! String);
        let requestKind = params["requestKind"] as! Int;
        let lastUID = params["lastUID"] == nil ? 1 : (params["lastUID"] as! UInt64);
        let uidRange = MCOIndexSet(range: MCORangeMake(lastUID, UINT64_MAX));
        if let fetchOperation = mIMAPSession.fetchMessagesOperation(withFolder: folder, requestKind: MCOIMAPMessagesRequestKind(rawValue: requestKind), uids: uidRange){
            fetchOperation.start(){(error, messagesRaw, vanishedMessages)->() in
                if(error != nil) {
                    reject("GetMails", error.debugDescription, error);
                    return;
                }
                var messages: [Any] = [];
                
                for message in messagesRaw! {
                    //var headers:[String:Any] = [:];
                    var dict:[String:Any] = [:];
                    dict["uid"] = (message as! MCOIMAPMessage).uid;
                    dict["flags"] = (message as! MCOIMAPMessage).flags;
                    dict["from"] = ((message as! MCOIMAPMessage).header.from
                                        .displayName != nil) ?
                    (message as! MCOIMAPMessage).header.from.displayName : "";
                    dict["subject"] = (message as! MCOIMAPMessage).header.subject;
                    dict["date"] = Int((message as! MCOIMAPMessage).header.date.timeIntervalSince1970);
                    dict["attachmentsCount"] = ((message as! MCOIMAPMessage).attachments != nil ) ?
                    (message as! MCOIMAPMessage).attachments().count : 0;
                    messages.append(dict);
                }
                resolve(messages);
                return;
            }
        } else {
            reject("GetMails", "Failed to create fetchMessagesOperation()", nil);
            return;
        }
    }
    
    @objc public func GetAttachment(_ attachemntInfo: NSDictionary, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void{
        let fileName = attachemntInfo["fileName"] as! String;
        let attachmentUID = attachemntInfo["attachmentUID"] as! String;
        let folder = attachemntInfo["path"] as! String;
        let messageUID = attachemntInfo["messageUID"] as! UInt32;
        let encoding = attachemntInfo["encoding"] as! UInt32;
        
        if let getMessageOp = mIMAPSession.fetchMessageOperation(withFolder: folder, uid: messageUID){
            getMessageOp.start() {(error,data)->() in
                if(error != nil || data == nil) {
                    reject("GetAttachment", error.debugDescription, error);
                    return;
                }
                
                let parsedMsg = MCOMessageParser(data: data!)!;
                if let downloadAttachmentOp = self.mIMAPSession.fetchMessageAttachmentOperation(withFolder: folder, uid: messageUID, partID: attachmentUID, encoding: MCOEncoding(rawValue: Int(encoding))!){
                    downloadAttachmentOp.start(){(error,data)->() in
                        if(error != nil || data == nil) {
                            reject("GetAttachment", error.debugDescription, error);
                            return;
                        }
                        let path = NSURL(fileURLWithPath: NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true)[0]).appendingPathComponent(fileName)!;
                        do{
                            try data?.write(to: path);
                            resolve(path.absoluteString);
                            return;
                        }catch let error as NSError{
                            reject("GetAttachment", error.debugDescription, error);
                            return;
                        }
                    }
                }else{
                    reject("GetAttachment", "Failed to create downloadAttachmentOp()", nil);
                    return;
                }
                   
                
                
            }
        } else {
            reject("GetAttachment", "Failed to create getMessageOp()", nil);
            return;
        }
    }
    
    private func _SendMail(mail: MCOMessageBuilder, res: @escaping RCTPromiseResolveBlock, rej: @escaping RCTPromiseRejectBlock) -> Void{
        if let sendOp = mSMTPSession.sendOperation(with: mail.data()){
            sendOp.start(){(error)->() in
                if(error != nil){
                    rej("SendMail", error.debugDescription, error);
                    return;
                }
                res(0);
                return;
            }
        } else {
            rej("SendMail", "Failed to create sendOp()", nil);
            return;
        }
    }
    
    @objc public func SendMail(_ mail: NSDictionary, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
        let from = mail["from"] as! [String:String];
        let to: [[String:String]] = mail["to"] as! [[String:String]];
        let cc: [[String:String]] = mail["cc"] as! [[String:String]];
        let bcc: [[String:String]] = mail["bcc"] as! [[String:String]];
        let subject = mail["subject"] as! String;
        let body: String = mail["body"] as! String;
        let attachments: [[String:String]] = mail["attachments"] as! [[String:String]];
        let origID = mail["origID"] as? UInt32;
        let origFolderPath = mail["origFolderPath"] as? String;

        let builder = MCOMessageBuilder();
        
        builder.header.from = MCOAddress(displayName: from["name"]!, mailbox: from["mailbox"]!);
        
        var recipients: [MCOAddress] = [];
        for recipient in to{
            recipients.append(MCOAddress(displayName: recipient["name"], mailbox: recipient["mailbox"]));
        }
        builder.header.to = recipients;
        
        if(!cc.isEmpty){
            var ccc: [MCOAddress] = [];
            for item in cc {
                ccc.append(MCOAddress(displayName: item["name"], mailbox: item["mailbox"]));
            }
            builder.header.cc = ccc;
        }
        
        if(!bcc.isEmpty){
            var bccs: [MCOAddress] = [];
            for item in bcc {
                bccs.append(MCOAddress(displayName: item["name"], mailbox: item["mailbox"]));
            }
            builder.header.cc = bccs;
        }
        builder.header.subject = subject;
        builder.htmlBody = body;
        
        if(!attachments.isEmpty){
            for attachment in attachments {
                //do{
                    //let data: NSData = try NSData(contentsOfFile: );
                let att = MCOAttachment(contentsOfFile: attachment["url"]!);
                builder.addAttachment(att);
                    
                //}catch let error as NSError{
                //    reject("SendMail", error.debugDescription, error);
                //    return;
                //}
            }
        }
        if(origID == nil){
            _SendMail(mail: builder, res: resolve, rej: reject);
        } else {
            if(origFolderPath == nil){
                reject("SendMail", "origFolderPath is nil while origID isn't", nil);
                return;
            }
            if let fetchOrigOp = mIMAPSession.fetchMessageOperation(withFolder: origFolderPath!, uid: origID!){
                fetchOrigOp.start(){(error,data)->() in
                    if(error != nil) {
                        reject("SendMail", error.debugDescription, error);
                        return;
                    }
                    
                    
                    let parser = MCOMessageParser(data: data)!;
                    var refs: [Any] = parser.header.references;
                    if(parser.header.messageID != nil){
                        builder.header.inReplyTo = [parser.header.messageID as Any];
                        refs.append(parser.header.messageID);
                    }
                    builder.header.references = refs;
                    
                    self._SendMail(mail: builder, res: resolve, rej: reject);
                }
            }else{
                reject("SendMail", "Failed to create getMessageOp()", nil);
                return;
            }
        }
        
    }
  @objc
  static public func requiresMainQueueSetup() -> Bool {
    return true
  }
}
