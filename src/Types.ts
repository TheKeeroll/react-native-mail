export type Nullable<T> = null | T

export enum MessagesRequestKind{
    UID = 0,
    FLAGS = 1,
    HEADERS = 2,
    STRUCTURE = 4,
    INTERNAL_DATE = 8,
    FULL_HEADERS = 16,
    HEADER_SUBJECT = 32,
    GMAIL_LABELS = 64,
    GMAIL_MESSAGE_ID = 128,
    GMAIL_THREAD_ID = 256,
    EXTRA_HEADERS = 512,
    SIZE = 1024 //TODO make bitwise
}
   
export enum RequestFlags{
    ADD = 0,
    REMOVE = 1 << 0,
    SET = 1 << 1
}

export enum AuthType{
    SASLNone = 0,
    SASLCRAMMDS = 1 << 0,
    SASLPlain = 1 << 1,
    SASLGSSAPI = 1 << 2,
    SASLDIGESTMD5 = 1 << 3,
    SASLLogin = 1 << 4,
    SASLSRP = 1 << 5,
    SASLNTLM = 1 << 6,
    SASLKerberosV4 = 1 << 7,
    XOAuth2 = 1 << 8,
    XOAuth2Outlook = 1 << 9
}

export enum FolderFlags{
    NONE = 0,
    MARKED = 1,
    UNMARKED = 2,
    NO_SELECT = 4,
    NO_INFERIORS = 8,
    INBOX = 16,
    SENT_MAIL = 32,
    FLAGGED = 64,
    STARRED = 64,
    ALL = 128,
    TRASH = 256,
    DRAFTS = 512,
    SPAM = 1024,
    JUNK = 1024,
    IMPORTANT = 2048,
    ARCHIVE = 4096,
    FOLDER_TYPE_MASK = 8176
}

export enum ConnectionType {
    Clear = 1 << 0,
    StartTLS = 1 << 1,
    TLS = 1 << 2
}

export enum MessageFlags {
    None = 0,
    Seen = 1 << 0,
    Answered = 1 << 1,
    Flagged = 1 << 2,
    Deleted = 1 << 3,
    Draft = 1 << 4,
    MDNSent = 1 << 5,
    Forwarded = 1 << 6,
    SubmitPending = 1 << 7,
    Submitted = 1 << 8
}

export interface UIDRange{
    from: number,
    to: number
  }

export interface MailHeader{
    attachmentCount: number
    date: number
    flags: number
    from: MailUser
    subject: string
    uid: number
}

export interface Recipients{
    [key: string]: string
}

export interface MailUser{
    mailbox: string
    name: string
}

export interface Mail{
    header: MailHeader
    attachments: {
        [key: string]: Attachment
    }
    from: MailUser
    htmlBody: string
    plainBody: string
    inlines: any
    recipients: Recipients
}
export interface AttachemtnBuild{
    url: string,
    fileName: string,
    type: string
}
export interface MailBuild{
    from: MailUser,
    to: MailUser[],
    cc: MailUser[],
    bcc: MailUser[],
    subject: string,
    body: string,
    attachments: AttachemtnBuild[],
    origID: Nullable<number>,
    origFolderPath: Nullable<string>
}

export interface Attachment{
    encoding: number
    fileName: string
    size: number
    uid: number
    partID: string
}

export interface Folder{
  flags: FolderFlags
  path: string
  name: string
}

export interface ServerConfiguration{
    hostname: string
    port: number
    connectionType: ConnectionType
    authType: AuthType
    checkCertificate: boolean
}

export interface UserCredentials{
    username: string
    password: string
    token: Nullable<string>
}