import * as React from 'react'
import { NativeModules } from 'react-native'
import { Attachment, Folder, Mail, MailHeader, MailUIDRange, ServerConfiguration } from './Types'
import { decode_imap_utf7 } from './utf7/utf7'

const {RNMailModule} = NativeModules



class Session{
  private mServerConfig: ServerConfiguration
  private mFolders: Folder[] = []


  public constructor(serverConfig: ServerConfiguration){
    this.mServerConfig = serverConfig;
    RNMailModule.SetServerConfiguration(this.mServerConfig);
  }

  public SetServerConfiguration(config: ServerConfiguration): void{
    this.mServerConfig = config;
    RNMailModule.SetServerConfiguration(this.mServerConfig);
  }

  public FetchFolders(): Promise<Folder[]> {
    return RNMailModule.GetFolders().then((result: Folder[])=>{
      for(let folder of result) folder.name = decode_imap_utf7(folder.path);
      this.mFolders = result;
      return Promise.resolve(result);
    }).catch((error: any)=>{
      console.error(error)
      return Promise.reject(error)
    })
  }

  public get Folders() {return this.mFolders}

  public GetMails(folder: Folder, range: MailUIDRange): Promise<MailHeader[]> {
    return RNMailModule.GetMails(folder, range).then((result: MailHeader[])=>{
      return Promise.resolve(result)
    }).catch((error: any)=>{
      console.error(error)
      return Promise.reject(error)
    })
  }

  public GetFullMail(mail: MailHeader): Promise<Mail> {
    return RNMailModule.GetFullMail(mail).then((result: Mail)=>{
      return Promise.resolve(result);
    }).catch((error: any)=>{
      console.error(error)
      return Promise.reject(error)
    })
  }

  public GetMailAttachments(mail: MailHeader): Promise<Attachment[]>{
    return RNMailModule.GetMailAttachments(mail).then((result: Attachment[])=>{
      return Promise.resolve(result);
    }).catch((error: any)=>{
      console.error(error)
      return Promise.reject(error)
    })
  }

  public DownloadAttachment(mail: MailHeader, attachment: Attachment): Promise<Attachment>{
    return RNMailModule.DownloadAttachment(mail, attachment).then((result: Attachment)=>{
      return Promise.resolve(result);
    }).catch((error: any)=>{
      console.error(error)
      return Promise.reject(error)
    })
  }

  public MoveMail(mail: Mail, destination: Folder): Promise<void>{
    return RNMailModule.MoveMail(mail, destination).then(()=>{
      return Promise.resolve();
    }).catch((error: any)=>{
      console.error(error)
      return Promise.reject(error)
    })
  }

  public DeleteMail(mail: Mail, permanent: boolean = false): Promise<void>{
    //return permanent ? this.PermanentDeleteMail(mail) : this.MoveMail(mail, this.mFolders.get('TRASH')!)
  }

  public PermanentDeleteMail(mail: Mail): Promise<void>{
    return RNMailModule.DeleteMail(mail).then(()=>{
      return Promise.resolve();
    }).catch((error: any)=>{
      console.error(error)
      return Promise.reject(error)
    })
  }

  public SendMail(mail: Mail){
    
  }

}


export default Session;