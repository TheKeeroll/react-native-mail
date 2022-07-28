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

  public constructor(imapCfg: ServerConfiguration, smtpCfg: ServerConfiguration) {
    this.mIMAPConfig = imapCfg
    this.mSMTPConfig = smtpCfg
  }

  public Login(creds: UserCredentials): Promise<boolean> {
    this.mUserCredentials = creds
    return RNMailModule.Login(creds).then(()=>{
      return Promise.resolve(true)
    }).catch((error: any)=>{
      console.error(error)
      return Promise.resolve(false)
    })
  }

  public FetchFolders(): Promise<Nullable<Folder[]>> {
    return RNMailModule.GetMails().then((folders: Folder[])=>{
      this.mFolders = folders
      for(let folder of this.mFolders)
        folder.name = decode_imap_utf7(folder.path)
      return Promise.resolve(folders)
    }).catch((error: any)=>{
      console.error(error)
      return Promise.resolve(null)
    })
  }

  public GetFolders() : Promise<Nullable<Folder[]>> {
    if(this.mFolders) return Promise.resolve(this.mFolders)
    return this.GetFolders()
  }


  public CreateFolder(folderName: string): Promise<boolean> {
    return RNMailModule.CreateFolder(folderName).then(()=>{
      return this.FetchFolders().then(()=>{
        return Promise.resolve(true)
      })
    }).catch((error: any)=>{
      console.error(error)
      return Promise.resolve(false)
    })
  }

  public RenameFolder(folderName: string, folderNewName: string): Promise<boolean> {
    return RNMailModule.RenameFolder({old: folderName, 'new': folderNewName}).then(()=>{
      return this.FetchFolders().then(()=>{
        return Promise.resolve(true)
      })
    }).catch((error: any)=>{
      console.error(error)
      return Promise.resolve(false)
    })
  }

  public GetMails(folderPath: string, requestKind: number): Promise<Nullable<MailHeader[]>> {
    return RNMailModule.GetMails({folder: folderPath, requestKind}).then((result: MailHeader[])=>{
      return Promise.resolve(result)
    }).catch((error: any)=>{
      console.error(error)
      return Promise.resolve(null)
    })
  }

  public GetMail(folderPath: string, requestKind: number, messageUID: number) : Promise<Nullable<Mail[]>> {
    return RNMailModule.GetMail({folderPath, requestKind, messageUID}).then((result: Mail[])=>{
      return Promise.resolve(result)
    }).catch((error: any)=>{
      console.error(error)
      return Promise.resolve(null)
    })
  }

}