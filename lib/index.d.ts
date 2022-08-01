import { Attachment, Folder, Mail, MailHeader, ServerConfiguration, UserCredentials, Nullable, MailBuild } from './Types';
declare class MailInstance {
    private readonly mIMAPConfig;
    private readonly mSMTPConfig;
    private mUserCredentials;
    private mFolders;
    private mLoggedIn;
    constructor(imapCfg: ServerConfiguration, smtpCfg: ServerConfiguration);
    get LoggedIn(): boolean;
    Login(creds: UserCredentials): Promise<void>;
    FetchFolders(): Promise<Folder[]>;
    GetFolders(): Promise<Nullable<Folder[]>>;
    CreateFolder(folderName: string): Promise<void>;
    RenameFolder(folderName: string, folderNewName: string): Promise<void>;
    GetMails(folder: Folder, requestKind: number, lastLocalUID?: number): Promise<MailHeader[]>;
    GetMail(folderPath: string, requestKind: number, messageUID: number): Promise<Mail>;
    GetAttachment(folderPath: string, messageUID: number, attachment: Attachment): Promise<void>;
    SendMail(mail: MailBuild): Promise<void>;
}
export default MailInstance;
