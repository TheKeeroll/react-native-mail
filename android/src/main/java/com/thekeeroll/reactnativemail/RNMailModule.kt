package com.thekeeroll.reactnativemail

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.libmailcore.*
import java.io.File
import java.io.FileOutputStream
import kotlin.collections.ArrayList

class RNMailModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    private val mSMTPSession = SMTPSession()
    private val mIMAPSession = IMAPSession()

    open class OperationResultHandler(promise: Promise) : OperationCallback {
        private val mPromise = promise
        override fun succeeded() {}
        override fun failed(p0: MailException?) {
            val message = if(p0 != null) p0.message else "Unknown error"
            mPromise.reject("Operation error", message)
            return
        }
    }

    @ReactMethod
    fun SetServerConfig(imap: MutableMap<String, Any>, smtp: MutableMap<String,String>){
        mIMAPSession.setHostname(imap["hostname"] as String)
        mIMAPSession.setPort(imap["port"] as Int)
        mIMAPSession.setAuthType(imap["authType"] as Int)
        mIMAPSession.setConnectionType(imap["connectionType"] as Int)
        mIMAPSession.isCheckCertificateEnabled = imap["checkCertificate"] as Boolean

        mSMTPSession.setHostname(smtp["hostname"] as String)
        mSMTPSession.setPort(smtp["port"] as Int)
        mSMTPSession.setAuthType(AuthType.AuthTypeSASLLogin/*smtp["authType"] as Int*/)
        mSMTPSession.setConnectionType(ConnectionType.ConnectionTypeStartTLS/*smtp["connectionType"] as Int*/)
        mSMTPSession.isCheckCertificateEnabled = smtp["checkCertificate"] as Boolean
    }

    @ReactMethod
    fun Login(credentials: MutableMap<String, String>, promise: Promise){
        mIMAPSession.setUsername(credentials["username"])
        mIMAPSession.setPassword(credentials["password"])

        mSMTPSession.setUsername(credentials["username"])
        mSMTPSession.setPassword(credentials["password"])

        val checkIMAP = mIMAPSession.checkAccountOperation()
        val checkSMTP = mSMTPSession.loginOperation();

        checkIMAP.start(object: OperationResultHandler(promise){
            override fun succeeded() {
                checkSMTP.start(object : OperationResultHandler(promise){
                    override fun succeeded() {
                        super.succeeded()
                        promise.resolve(0)
                    }
                })
            }
        })
    }

    @ReactMethod
    public fun GetFolders(promise: Promise){
        val getFoldersOp = mIMAPSession.fetchAllFoldersOperation()
        getFoldersOp.start(object: OperationResultHandler(promise){
            val result: MutableList<MutableMap<String, Any>> = ArrayList()
            override fun succeeded() {
                super.succeeded()
                getFoldersOp.folders().forEach {
                    val folder: MutableMap<String,Any> = mutableMapOf()
                    folder["flags"] = it.flags()
                    folder["path"] = it.path()
                    result.add(folder)
                }
                promise.resolve(result)
            }
        })
    }

    @ReactMethod
    public fun GetMail(mailInfo: MutableMap<String, Any>, promise: Promise){
        val folder = mailInfo["folder"] as String
        val messageUID = (IndexSet::indexSetWithIndex)(mailInfo["messageUID"] as Long);
        val requestKind = mailInfo["requestKind"] as Int;

        val getMailOp = mIMAPSession.fetchMessagesByUIDOperation(folder, requestKind, messageUID)
        getMailOp.start(object: OperationResultHandler(promise){
            val result: MutableMap<String, Any> = mutableMapOf<String,Any>()
            override fun succeeded() {
                super.succeeded()
                val message = getMailOp.messages()[0]
                result["uid"] = message.uid()
                result["flags"] = message.flags()
                result["subject"]  = message.header().subject()
                val from = mutableMapOf<String,String>()
                from["mailbox"] = message.header().from().mailbox()
                from["name"] = message.header().from().displayName()
                result["from"] = from

                if(message.header().to() != null){
                    val recipients = mutableMapOf<String,String>()
                    message.header().to().forEach {
                        recipients[it.mailbox()] = it.displayName()
                    }
                    result["recipients"] = recipients
                }
                if(message.header().cc() != null){
                    val cc = mutableMapOf<String,String>()
                    message.header().to().forEach {
                        cc[it.mailbox()] = it.displayName()
                    }
                    result["cc"] = cc
                }
                if(message.header().bcc() != null){
                    val bcc = mutableMapOf<String,String>()
                    message.header().bcc().forEach {
                        bcc[it.mailbox()] = it.displayName()
                    }
                    result["bcc"] = bcc
                }

                if(message.attachments().size > 0){
                    val attachments = mutableMapOf<String, MutableMap<String,Any>>()
                    message.attachments().forEach {
                        val data = mutableMapOf<String,Any>()
                        data["fileName"] = it.filename()
                        data["size"] = (it as IMAPPart).size()
                        data["encoding"] = it.encoding()
                        data["uid"] = it.uniqueID()
                        attachments[it.partID()] = data
                    }
                    result["attachments"] = attachments
                }

                val getMailBody = mIMAPSession.fetchMessageByUIDOperation(folder, message.uid())
                getMailBody.start(object: OperationResultHandler(promise){
                    override fun succeeded() {
                        super.succeeded()
                        val parser = (MessageParser::messageParserWithData)(getMailBody.data())
                        result["plainBody"] = parser.plainTextRendering()
                        result["htmlBody"] = parser.htmlBodyRendering()
                        promise.resolve(result)
                    }
                })
            }

        })
    }

    @ReactMethod
    public fun GetMails(params: Map<String,Any>, promise: Promise){
        val folder = params["path"] as String
        val requestKind = params["requestKind"] as Int
        val lastUID = if(params["lastUID"] == null) 1 else params["lastUID"] as Long
        val uidRange = (IndexSet::indexSetWithRange)(Range(lastUID, Long.MAX_VALUE))

        val getMailsOp = mIMAPSession.fetchMessagesByUIDOperation(folder, requestKind, uidRange)
        getMailsOp.start(object: OperationResultHandler(promise){
            val result: MutableList<Any> = mutableListOf()
            override fun succeeded() {
                super.succeeded()
                getMailsOp.messages().forEach {
                    val dict = mutableMapOf<String, Any>()
                    dict["uid"] = it.uid()
                    dict["flags"] = it.flags()
                    val from = mutableMapOf<String,String>()
                    from["mailbox"] = it.header().from().mailbox()
                    from["name"] = it.header().from().displayName()
                    dict["from"] = from
                    dict["subject"] = it.header().subject()
                    dict["date"] = it.header().date().toInstant().toEpochMilli()
                    dict["attachments"] = it.attachments().size
                    result.add(dict)
                }
                promise.resolve(result)
            }
        })
    }

    @ReactMethod
    public fun GetAttachment(attachemntInfo: Map<String, Any>, promise: Promise){
        val fileName = attachemntInfo["fileName"] as String
        val attachmentUID = attachemntInfo["attachmentUID"] as String
        val folder = attachemntInfo["path"] as String
        val messageUID = attachemntInfo["messageUID"] as Long
        val encoding = attachemntInfo["encoding"] as Int

        val getAttachmentOp = mIMAPSession.fetchMessageAttachmentByUIDOperation(folder, messageUID, attachmentUID, encoding, true)
        getAttachmentOp.start(object: OperationResultHandler(promise){
            override fun succeeded() {
                super.succeeded()
                val file = File(fileName)
                try{
                    val stream = FileOutputStream(file)
                    stream.write(getAttachmentOp.data())
                    stream.close()
                    if(file.canWrite()){
                        promise.resolve(0)
                    }
                } catch (e: Throwable){
                    failed(e as MailException)
                }
            }

        })
    }

    override fun getName() = "RNMailModule"

    override fun getConstants(): MutableMap<String, Any> {
        return hashMapOf("count" to 1)
    }
}
