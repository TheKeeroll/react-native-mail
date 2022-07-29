import { Folder, Mail, MailHeader, ServerConfiguration, UserCredentials, Nullable } from './Types';
declare class MailInstance {
    private readonly mIMAPConfig;
    private readonly mSMTPConfig;
    private mUserCredentials;
    private mFolders;
    constructor(imapCfg: ServerConfiguration, smtpCfg: ServerConfiguration);
    Login(creds: UserCredentials): Promise<void>;
    FetchFolders(): Promise<Folder[]>;
    GetFolders(): Promise<Nullable<Folder[]>>;
    CreateFolder(folderName: string): Promise<void>;
    RenameFolder(folderName: string, folderNewName: string): Promise<void>;
    GetMails(folderPath: string, requestKind: number): Promise<MailHeader[]>;
    GetMail(folderPath: string, requestKind: number, messageUID: number): Promise<Mail[]>;
}
export default MailInstance;
