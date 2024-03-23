import { Router } from "express";
import { googleOAuthHandler } from "../service/gauth.service";
import { logger } from "../utils/logger";
import { FRONTEND_URL } from "../constants";

export const gauthRouter = Router();
// function isuser(obj: any): obj is  {
//     return obj && typeof obj === 'object' && 'role' in obj;
// }

gauthRouter.get("/", async (req, res) => {
    const appUser = await googleOAuthHandler(req);
    console.log(appUser);
    console.log(appUser.data)
    logger.info("Setting session data: " + req.session.email);

    if (appUser.error) {
        res.redirect(FRONTEND_URL);
        return;
    }

    if (appUser.data === "Create new user") {
        logger.info("Creating new user");
        res.redirect(FRONTEND_URL + '/user/create');
        return;
    } else {
        if(appUser.data){
            if(typeof appUser.data !=='string' && appUser.data.role ==="admin"){
            logger.info("Admin login");
            res.redirect(FRONTEND_URL+'/admin/home');
            return;
            }
        }else{
        logger.info("User already exists");
        res.redirect(FRONTEND_URL);
        return;
        }
    }
});