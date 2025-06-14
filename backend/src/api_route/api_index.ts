import express from 'express';
import {get_keys,display_apis} from './api_controllers';;
const router = express.Router();

router.post('/',get_keys);
router.get('/:user_id', display_apis);

export default router;