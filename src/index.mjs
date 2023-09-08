
/*
import { isBrowser, isJsDom } from 'browser-or-node';
import * as mod from 'module';
import * as path from 'path';
let internalRequire = null;
if(typeof require !== 'undefined') internalRequire = require;
const ensureRequire = ()=> (!internalRequire) && (internalRequire = mod.createRequire(import.meta.url));
//*/

/**
 * A JSON object
 * @typedef { object } JSON
 */
import { isBrowser, isJsDom } from 'browser-or-node';

const isNode = (!(isBrowser || isJsDom));
const directoryPath = '';
// isNode?globals.__dirname:url.fileURLToPath(new URL('.', import.meta.url));
const fonts = {};

const parseFont= function(name, fn) {
    if (fonts[name]) fn(fonts[name]);
    else loadFont(name, function(defn){
        _parseFont(name, defn, function(font){
            fonts[name] = font;
            fn(font);
        });
    });
};
const _parseFont = function(name, defn, fn) {
    var lines = defn.split("\n");
    var header = lines[0].split(" ");
    var hardblank = header[0].charAt(header[0].length - 1);
    var height = +header[1];
    var comments = +header[5];
    var font = {
        defn: lines.slice(comments + 1),
        hardblank: hardblank,
        height: height,
        char: {}
    };
    fn(font);
};
const parseChar = function(char, font) {
    if(char > 122) return;
    if (char in font.char) return font.char[char];
    var height = font.height,
        start = (char - 32) * height,
        charDefn = [],
        i;
    for (i = 0; i < height; i++) {
        if(!font.defn[start + i]) return;
        charDefn[i] = font.defn[start + i].replace(/@/g, "")
        .replace(RegExp("\\" + font.hardblank, "g"), " ");
    }
    return font.char[char] = charDefn;
};
const loadFont = function(name, fn) {
    //var fs = require('fs');
    var fileName = this.path + name+ '.flf';
    fs.readFile(fileName, 'utf8', function(error, data) {
        if(error) throw(error);
        if(data) fn(data);
    });
};

export class Font{
    constructor(name, path){
        this.name = name;
        this.path = path || directoryPath;
    }
    
    write(){
        
    }
}
 
export class FigletFont extends Font{
    constructor(name, path){
        super(name, path);
    }
    
    write(str, callback){
        parseFont(this.name, (font)=>{
             var chars = {},
             result = "";
             for (var i = 0, len = str.length; i < len; i++) {
                 chars[i] = parseChar(str.charCodeAt(i), font);
             }
             for (var i = 0, height = chars[0].length; i < height; i++) {
                 for (var j = 0; j < len; j++) {
                     if(chars[j]) result += chars[j][i];
                 }
                 result += "\n";
             }
             callback(result, font);
         });
    }
}
