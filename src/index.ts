import * as React from 'react'
import { NativeModules } from 'react-native'
import {Attachment, Folder, Mail, MailHeader, UIDRange, ServerConfiguration, UserCredentials, Nullable} from './Types'
import { decode_imap_utf7 } from './utf7/utf7'

const {RNMailModule} = NativeModules

class MailInstance{
  private readonly mIMAPConfig: ServerConfiguration
  private readonly mSMTPConfig: ServerConfiguration
  private mUserCredentials: Nullable<UserCredentials> = null
  private mFolders: Folder[] = []
  private mLoggedIn = false

  public constructor(imapCfg: ServerConfiguration, smtpCfg: ServerConfiguration) {
    this.mIMAPConfig = imapCfg
    this.mSMTPConfig = smtpCfg
    RNMailModule.SetServerConfig(this.mIMAPConfig, this.mSMTPConfig)
  }

  public get LoggedIn(){return this.mLoggedIn}

  public Login(creds: UserCredentials): Promise<void> {
    this.mUserCredentials = creds
    return RNMailModule.Login(creds).then(()=>{
      this.mLoggedIn = true
      return Promise.resolve()
    })
  }

  public FetchFolders(): Promise<Folder[]> {
    return RNMailModule.GetFolders().then((folders: Folder[])=>{
      this.mFolders = folders
      for(let folder of this.mFolders)
        folder.name = decode_imap_utf7(folder.path)
      return Promise.resolve(folders)
    })
  }

  public GetFolders() : Promise<Nullable<Folder[]>> {
    if(this.mFolders.length) return Promise.resolve(this.mFolders)
    return this.FetchFolders()
  }


  public CreateFolder(folderName: string): Promise<void> {
    return RNMailModule.CreateFolder(folderName).then(()=>{
      return this.FetchFolders().then(()=>{
        return Promise.resolve()
      })
    })
  }

  public RenameFolder(folderName: string, folderNewName: string): Promise<void> {
    return RNMailModule.RenameFolder({old: folderName, 'new': folderNewName})
  }
  public GetMails(folder: Folder, requestKind: number, lastLocalUID?: number): Promise<MailHeader[]> {
    return RNMailModule.GetMails({path: folder.path, requestKind: requestKind, lastUID: lastLocalUID})
  }
  public GetMail(folderPath: string, requestKind: number, messageUID: number) : Promise<Mail> {
    return RNMailModule.GetMail({folder: folderPath, requestKind, messageUID})
  }
  public GetAttachment(fileName: string, folderPath: string, messageUID: number, attachmentUID: number): Promise<void> {
    return RNMailModule.GetAttachment({
      fileName, path: folderPath, messageUID, attachmentUID
    })
  }

}

export default MailInstance