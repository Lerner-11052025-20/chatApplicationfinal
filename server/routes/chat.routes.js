import express from 'express'
import { getChats } from '../controllers/getChats.controllers.js'
import { sendMesssage } from '../controllers/sendMessage.controllers.js'
import { recieveMessage } from '../controllers/recieveMessage.controllers.js'
import { getUsers } from '../controllers/getUsers.controllers.js'
import { getPinnedMessages } from '../controllers/getPinnedMessages.controllers.js'
import { Authenticate } from '../middleware/auth.middleware.js'


const router = express.Router()


router.get('/users', Authenticate, getUsers)
router.get('/chats/:userId', Authenticate, getChats)
router.post('/messages', Authenticate, sendMesssage)
router.get('/messages/:chatId', Authenticate, recieveMessage)
router.get('/pinned/:chatId', Authenticate, getPinnedMessages)
export default router