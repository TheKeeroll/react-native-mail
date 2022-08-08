package com.thekeeroll.reactnativemail

import co.nedim.maildroidx.MaildroidX
import co.nedim.maildroidx.MaildroidXType
import com.facebook.common.logging.FLog
import com.facebook.react.bridge.*
import com.libmailcore.*
import java.io.File
import java.io.FileOutputStream
import java.util.concurrent.Executors

class RNMailModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    @ReactMethod
    fun SetServerConfig(imap: ReadableMap, smtp: ReadableMap){
    }

    @ReactMethod
    fun Login(credentials: ReadableMap, promise: Promise){
        promise.reject("Not implemented", "")
    }

    @ReactMethod
    fun GetFolders(promise: Promise){
        promise.reject("Not implemented", "")
    }

    @ReactMethod
    fun GetMail(mailInfo: ReadableMap, promise: Promise){
        promise.reject("Not implemented", "")
    }

    @ReactMethod
    fun GetMails(params: ReadableMap, promise: Promise){
        promise.reject("Not implemented", "")
    }

    @ReactMethod
    fun GetAttachment(attachemntInfo: ReadableMap, promise: Promise){
        promise.reject("Not implemented", "")
    }

    @ReactMethod
    fun SendMail(mail: ReadableMap, promise: Promise){
        promise.reject("Not implemented", "")
    }

    override fun getName() = "RNMailModule"

    override fun getConstants(): MutableMap<String, Any> {
        return hashMapOf("count" to 1)
    }
}
