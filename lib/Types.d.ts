export declare type Nullable<T> = null | T;
export declare enum MessagesRequestKind {
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
    SIZE = 1024
}
export declare enum RequestFlags {
    ADD = 0,
    REMOVE = 1,
    SET = 2
}
export declare enum AuthType {
    SASLNone = 0,
    SASLCRAMMDS = 1,
    SASLPlain = 2,
    SASLGSSAPI = 4,
    SASLDIGESTMD5 = 8,
    SASLLogin = 16,
    SASLSRP = 32,
    SASLNTLM = 64,
    SASLKerberosV4 = 128,
    XOAuth2 = 256,
    XOAuth2Outlook = 512
}
export declare enum FolderFlags {
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
export declare enum ConnectionType {
    Clear = 1,
    StartTLS = 2,
    TLS = 4
}
export declare enum MessageFlags {
    None = 0,
    Seen = 1,
    Answered = 2,
    Flagged = 4,
    Deleted = 8,
    Draft = 16,
    MDNSent = 32,
    Forwarded = 64,
    SubmitPending = 128,
    Submitted = 256
}
export interface UIDRange {
    from: number;
    to: number;
}
export interface MailHeader {
    attachmentCount: number;
    date: Nullable<String | Date>;
    flags: Nullable<number>;
    from: string;
    subject: string;
    uid: number;
}
export interface Mail {
    header: MailHeader;
    attachments: Nullable<Map<String, Attachment>>;
    from: Nullable<{
        mailbox: string;
        name: string;
    }>;
    htmlBody: Nullable<string>;
    plainBody: Nullable<string>;
    inlines: any;
    recipients: Nullable<string[]>;
}
export interface Attachment {
    encoding: Nullable<String>;
    fileName: String;
    size: number;
    uid: number;
}
export interface Folder {
    flags: FolderFlags;
    path: string;
    name: string;
}
export interface ServerConfiguration {
    hostname: string;
    smtpPort: number;
    imapPort: number;
    connectiontype: ConnectionType;
    authType: AuthType;
    checkCertificate: boolean;
}
export interface UserCredentials {
    username: string;
    password: string;
    token: Nullable<string>;
}
