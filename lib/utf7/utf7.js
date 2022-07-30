import {decode as atob, encode as btoa} from 'base-64'
function ureplacer(pmatch) {
    var ret = ""
    pmatch = pmatch.replace(/\,/g,'/')
    var ix = pmatch.substr(1,pmatch.length-2)

    if (ix.length % 4 != 0) 
      ix = ix.padEnd(ix.length+ 4 - ix.length % 4,"=")
    try {
    var dx = atob(ix)
    for (var j = 0; j < dx.length; j = j+2) {
        ret = ret + String.fromCharCode((dx.charCodeAt(j) << 8) + dx.charCodeAt(j+1))
    }
    } catch(err) {
    console.log("Error in decoding foldername IMAP UTF7, sending empty string back")
    console.log(err)
    ret = ""
    }
    return ret
}

function breplacer(umatch) {
    var bst = ""
    for (var i=0; i < umatch.length; i++) {
      var f = umatch.charCodeAt(i)
      bst = bst + String.fromCharCode(f >> 8) + String.fromCharCode(f & 255)
    }

    try {
    bst = '&'+btoa(bst).replace(/\//g,',').replace(/=+/,'')+'-'
    }catch(err) {
    console.log("Error in encoding foldername IMAP UTF7, sending empty string back")
    console.log(err)
    bst = ""
    }
    return bst
}

export function decode_imap_utf7(mstring) {
    var stm = new RegExp(/(\&[A-Za-z0-9\+\,]+\-)/,'g')
    return mstring.replace(stm,ureplacer).replace('&-','&')
}

export function encode_imap_utf7(ustring) {
    ustring = ustring.replace(/\/|\~|\\/g,'')
    var vgm = new RegExp(/([^\x20-\x7e]+)/,'g')
    return ustring.replace('&','&-').replace(vgm,breplacer)
}

