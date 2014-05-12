var crypto = require('crypto'),
    util = require('util'),
    xmlbuilder = require('xmlbuilder');

exports.doGet = function(req, res){

    if(!checkSource(req)){
        res.end('error');
        return;
    }

    res.end(req.query.echostr);
}

exports.doPost = function(req, res){

    if(!checkSource(req)){
        res.end('error');
        return;
    }

    var xml = buildXml(msg.FromUserName, msg.ToUserName, 'text', '0', function(xml) {
        return xml.ele('Content')
            .dat('hello world');
    });

    console.log(xml);

    res.contentType('text/xml');
    res.send(xml, 200);
}


function checkSource(req){
    var signature = req.query.signature,
        timestamp = req.query.timestamp,
        nonce = req.query.nonce,
        shasum = crypto.createHash('sha1'),
        arr = ['balabala', timestamp, nonce];

    shasum.update(arr.sort().join(''),'utf-8');
    return shasum.digest('hex') == signature;
}

function buildXml(to, from, msgType, funFlag, callback){
    var xml = xmlbuilder.create('xml')
        .ele('ToUserName')
        .dat(to)
        .up()
        .ele('FromUserName')
        .dat(from)
        .up()
        .ele('CreateTime')
        .txt(new Date().getMilliseconds())
        .up()
        .ele('MsgType')
        .dat(msgType)
        .up();
    xml = callback(xml);
    return xml.ele('FuncFlag',{},funFlag).end({pretty:true});
}