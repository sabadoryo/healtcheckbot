import * as dotenv from 'dotenv'
import Config from './types/Config'
dotenv.config()

export default function(): Config {
    return {
        "TELEGRAM_BOT_TOKEN" : process.env.TELEGRAM_BOT_TOKEN || "",
        "OPENAI_API_KEY" : process.env.OPENAI_API_KEY || "",
        "ADMIN_TELEGRAM_IDS" : process.env.ADMIN_TELEGRAM_IDS || "",
        "SYSTEM_TEXT" : process.env.SYSTEM_TEXT || ""
    }
}