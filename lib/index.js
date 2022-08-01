import { NativeModules } from 'react-native';
import { decode_imap_utf7 } from './utf7/utf7';
const { RNMailModule } = NativeModules;
class MailInstance {
    constructor(imapCfg, smtpCfg) {
        this.mUserCredentials = null;
        this.mFolders = [];
        this.mLoggedIn = false;
        this.mIMAPConfig = imapCfg;
        this.mSMTPConfig = smtpCfg;
        RNMailModule.SetServerConfig(this.mIMAPConfig, this.mSMTPConfig);
    }
    get LoggedIn() { return this.mLoggedIn; }
    Login(creds) {
        this.mUserCredentials = creds;
        return RNMailModule.Login(creds).then(() => {
            this.mLoggedIn = true;
            return Promise.resolve();
        });
    }
    FetchFolders() {
        return RNMailModule.GetFolders().then((folders) => {
            this.mFolders = folders;
            for (let folder of this.mFolders)
                folder.name = decode_imap_utf7(folder.path);
            return Promise.resolve(folders);
        });
    }
    GetFolders() {
        if (this.mFolders.length)
            return Promise.resolve(this.mFolders);
        return this.FetchFolders();
    }
    CreateFolder(folderName) {
        return RNMailModule.CreateFolder(folderName).then(() => {
            return this.FetchFolders().then(() => {
                return Promise.resolve();
            });
        });
    }
    RenameFolder(folderName, folderNewName) {
        return RNMailModule.RenameFolder({ old: folderName, 'new': folderNewName });
    }
    GetMails(folder, requestKind, lastLocalUID) {
        return RNMailModule.GetMails({ path: folder.path, requestKind: requestKind, lastUID: lastLocalUID });
    }
    GetMail(folderPath, requestKind, messageUID) {
        return RNMailModule.GetMail({ folder: folderPath, requestKind, messageUID });
    }
    GetAttachment(fileName, folderPath, messageUID, attachmentUID) {
        return RNMailModule.GetAttachment({
            fileName, path: folderPath, messageUID, attachmentUID
        });
    }
}
export default MailInstance;
//# sourceMappingURL=index.js.map