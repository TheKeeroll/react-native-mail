import { NativeModules } from 'react-native';
import { decode_imap_utf7 } from './utf7/utf7';
const { RNMailModule } = NativeModules;
class MailInstance {
    constructor(imapCfg, smtpCfg) {
        this.mUserCredentials = null;
        this.mFolders = [];
        this.mIMAPConfig = imapCfg;
        this.mSMTPConfig = smtpCfg;
    }
    Login(creds) {
        this.mUserCredentials = creds;
        return RNMailModule.Login(creds).then(() => {
            return Promise.resolve(true);
        }).catch((error) => {
            console.error(error);
            return Promise.resolve(false);
        });
    }
    FetchFolders() {
        return RNMailModule.GetMails().then((folders) => {
            this.mFolders = folders;
            for (let folder of this.mFolders)
                folder.name = decode_imap_utf7(folder.path);
            return Promise.resolve(folders);
        }).catch((error) => {
            console.error(error);
            return Promise.resolve(null);
        });
    }
    GetFolders() {
        if (this.mFolders)
            return Promise.resolve(this.mFolders);
        return this.GetFolders();
    }
    CreateFolder(folderName) {
        return RNMailModule.CreateFolder(folderName).then(() => {
            return this.FetchFolders().then(() => {
                return Promise.resolve(true);
            });
        }).catch((error) => {
            console.error(error);
            return Promise.resolve(false);
        });
    }
    RenameFolder(folderName, folderNewName) {
        return RNMailModule.RenameFolder({ old: folderName, 'new': folderNewName }).then(() => {
            return this.FetchFolders().then(() => {
                return Promise.resolve(true);
            });
        }).catch((error) => {
            console.error(error);
            return Promise.resolve(false);
        });
    }
    GetMails(folderPath, requestKind) {
        return RNMailModule.GetMails({ folder: folderPath, requestKind }).then((result) => {
            return Promise.resolve(result);
        }).catch((error) => {
            console.error(error);
            return Promise.resolve(null);
        });
    }
    GetMail(folderPath, requestKind, messageUID) {
        return RNMailModule.GetMail({ folderPath, requestKind, messageUID }).then((result) => {
            return Promise.resolve(result);
        }).catch((error) => {
            console.error(error);
            return Promise.resolve(null);
        });
    }
}
//# sourceMappingURL=index.js.map