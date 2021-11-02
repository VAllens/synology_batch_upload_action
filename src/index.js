const core = require("@actions/core");
core.info('init start')
const request = require('request')
const util = require('util');
const fs = require('fs')
const path = require('path')
const pRequestGet = util.promisify(request.get);
const pRequestPost = util.promisify(request.post);

const host = core.getInput("host");
const username = core.getInput("username");
const password = core.getInput("password");
const filepath = core.getInput("filepath");
const uploadpath = core.getInput("uploadpath");
let filename = core.getInput("filename")
const overwrite = core.getInput("overwrite").toString().toLowerCase() == 'true';
const createparent = core.getInput("createparent").toString().toLowerCase() == 'true';

let fileExist = fs.existsSync(filepath)
if (!fileExist) {
    core.setFailed(`file not exist ${filepath}`);
    return
}
if(!filename){
    filename = path.basename(filepath)
}

core.info('init end')

async function auth() {
    core.info('start auth')
    let options = {
        url: `${host}/webapi/auth.cgi`,
        method: 'GET',
        qs: {
            'api': 'SYNO.API.Auth',
            'version': '3',
            'method': 'login',
            'account': username,
            'passwd': password,
            'session': 'FileStation',
        },
    };
    let res = await pRequestGet(options)
    core.info('end auth')
    core.info(res.body)
    try {
        let body = JSON.parse(res.body)
        return body.data.sid
    }
    catch (e) {
        core.error(res.body)
        core.setFailed(e)
        return null
    }
}

async function upload(session) {
    core.info('start upload')
    let options = {
        url: `${host}/webapi/entry.cgi`,
        method: 'POST',
        headers: {
            'Cookie': `id=${session};`,
        },
        qs: {
            'api': 'SYNO.FileStation.Upload',
            'version': '2',
            'method': 'upload',
        },
        formData: {
            path: uploadpath,
            create_parents: createparent.toString(),
            overwrite: overwrite.toString(),
            file: {
                value: fs.createReadStream(filepath),
                options: {
                    filename: filename,
                }
            }
        }
    }

    let res = await pRequestPost(options)
    core.info(res.body)
    let body = JSON.parse(res)
    if (!body.success) {
        core.setFailed(`upload is not successful ${res.body}`)
    }
    core.info('end upload')
}

async function run() {
    try {
        let session = await auth()
        if (session == null) {
            core.setFailed('session is null')
            return
        }
        await upload(session)
    }
    catch (e) {
        core.setFailed(e)
    }
}

run()