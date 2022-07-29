export var MessagesRequestKind;
(function (MessagesRequestKind) {
    MessagesRequestKind[MessagesRequestKind["UID"] = 0] = "UID";
    MessagesRequestKind[MessagesRequestKind["FLAGS"] = 1] = "FLAGS";
    MessagesRequestKind[MessagesRequestKind["HEADERS"] = 2] = "HEADERS";
    MessagesRequestKind[MessagesRequestKind["STRUCTURE"] = 4] = "STRUCTURE";
    MessagesRequestKind[MessagesRequestKind["INTERNAL_DATE"] = 8] = "INTERNAL_DATE";
    MessagesRequestKind[MessagesRequestKind["FULL_HEADERS"] = 16] = "FULL_HEADERS";
    MessagesRequestKind[MessagesRequestKind["HEADER_SUBJECT"] = 32] = "HEADER_SUBJECT";
    MessagesRequestKind[MessagesRequestKind["GMAIL_LABELS"] = 64] = "GMAIL_LABELS";
    MessagesRequestKind[MessagesRequestKind["GMAIL_MESSAGE_ID"] = 128] = "GMAIL_MESSAGE_ID";
    MessagesRequestKind[MessagesRequestKind["GMAIL_THREAD_ID"] = 256] = "GMAIL_THREAD_ID";
    MessagesRequestKind[MessagesRequestKind["EXTRA_HEADERS"] = 512] = "EXTRA_HEADERS";
    MessagesRequestKind[MessagesRequestKind["SIZE"] = 1024] = "SIZE";
})(MessagesRequestKind || (MessagesRequestKind = {}));
export var RequestFlags;
(function (RequestFlags) {
    RequestFlags[RequestFlags["ADD"] = 0] = "ADD";
    RequestFlags[RequestFlags["REMOVE"] = 1] = "REMOVE";
    RequestFlags[RequestFlags["SET"] = 2] = "SET";
})(RequestFlags || (RequestFlags = {}));
export var AuthType;
(function (AuthType) {
    AuthType[AuthType["SASLNone"] = 0] = "SASLNone";
    AuthType[AuthType["SASLCRAMMDS"] = 1] = "SASLCRAMMDS";
    AuthType[AuthType["SASLPlain"] = 2] = "SASLPlain";
    AuthType[AuthType["SASLGSSAPI"] = 4] = "SASLGSSAPI";
    AuthType[AuthType["SASLDIGESTMD5"] = 8] = "SASLDIGESTMD5";
    AuthType[AuthType["SASLLogin"] = 16] = "SASLLogin";
    AuthType[AuthType["SASLSRP"] = 32] = "SASLSRP";
    AuthType[AuthType["SASLNTLM"] = 64] = "SASLNTLM";
    AuthType[AuthType["SASLKerberosV4"] = 128] = "SASLKerberosV4";
    AuthType[AuthType["XOAuth2"] = 256] = "XOAuth2";
    AuthType[AuthType["XOAuth2Outlook"] = 512] = "XOAuth2Outlook";
})(AuthType || (AuthType = {}));
export var FolderFlags;
(function (FolderFlags) {
    FolderFlags[FolderFlags["NONE"] = 0] = "NONE";
    FolderFlags[FolderFlags["MARKED"] = 1] = "MARKED";
    FolderFlags[FolderFlags["UNMARKED"] = 2] = "UNMARKED";
    FolderFlags[FolderFlags["NO_SELECT"] = 4] = "NO_SELECT";
    FolderFlags[FolderFlags["NO_INFERIORS"] = 8] = "NO_INFERIORS";
    FolderFlags[FolderFlags["INBOX"] = 16] = "INBOX";
    FolderFlags[FolderFlags["SENT_MAIL"] = 32] = "SENT_MAIL";
    FolderFlags[FolderFlags["FLAGGED"] = 64] = "FLAGGED";
    FolderFlags[FolderFlags["STARRED"] = 64] = "STARRED";
    FolderFlags[FolderFlags["ALL"] = 128] = "ALL";
    FolderFlags[FolderFlags["TRASH"] = 256] = "TRASH";
    FolderFlags[FolderFlags["DRAFTS"] = 512] = "DRAFTS";
    FolderFlags[FolderFlags["SPAM"] = 1024] = "SPAM";
    FolderFlags[FolderFlags["JUNK"] = 1024] = "JUNK";
    FolderFlags[FolderFlags["IMPORTANT"] = 2048] = "IMPORTANT";
    FolderFlags[FolderFlags["ARCHIVE"] = 4096] = "ARCHIVE";
    FolderFlags[FolderFlags["FOLDER_TYPE_MASK"] = 8176] = "FOLDER_TYPE_MASK";
})(FolderFlags || (FolderFlags = {}));
export var ConnectionType;
(function (ConnectionType) {
    ConnectionType[ConnectionType["Clear"] = 1] = "Clear";
    ConnectionType[ConnectionType["StartTLS"] = 2] = "StartTLS";
    ConnectionType[ConnectionType["TLS"] = 4] = "TLS";
})(ConnectionType || (ConnectionType = {}));
export var MessageFlags;
(function (MessageFlags) {
    MessageFlags[MessageFlags["None"] = 0] = "None";
    MessageFlags[MessageFlags["Seen"] = 1] = "Seen";
    MessageFlags[MessageFlags["Answered"] = 2] = "Answered";
    MessageFlags[MessageFlags["Flagged"] = 4] = "Flagged";
    MessageFlags[MessageFlags["Deleted"] = 8] = "Deleted";
    MessageFlags[MessageFlags["Draft"] = 16] = "Draft";
    MessageFlags[MessageFlags["MDNSent"] = 32] = "MDNSent";
    MessageFlags[MessageFlags["Forwarded"] = 64] = "Forwarded";
    MessageFlags[MessageFlags["SubmitPending"] = 128] = "SubmitPending";
    MessageFlags[MessageFlags["Submitted"] = 256] = "Submitted";
})(MessageFlags || (MessageFlags = {}));
//# sourceMappingURL=Types.js.map