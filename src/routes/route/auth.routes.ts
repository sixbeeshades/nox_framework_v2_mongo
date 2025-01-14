import { AuthController } from '@src/modules/sql/auth/auth.controller';
import { Router } from 'express';
import passport from 'passport';

const authRouter = Router();
const authController = new AuthController();

authRouter.post('/signup', authController.signup);

authRouter.post(
  '/login',
  passport.authenticate('local', { session: false }),
  authController.login,
);

authRouter.get('/logout', authController.logout);

authRouter.post(
  '/send-verification-email/:id',
  authController.sendVerificationEmail,
);
authRouter.get('/email-verification/:token', authController.emailVerification);

export default authRouter;
