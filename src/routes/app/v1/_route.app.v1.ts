import { Router } from "express";

import appAccountRouter from './route.app.account';
import appSignInRouter from './route.app.signIn';
import appSiteRouter from './route.app.site';
import appProfileRouter from './route.app.profile';
import appPostRouter from './route.app.post';
import appCategoryRouter from './route.app.category';
import appLocationRouter from './route.app.location';
import appBookmarkRouter from './route.app.bookmark';
import appHistoryRouter from './route.app.history';
import themeRouter from './route.app.theme';
import bannerRouter from './route.app.banner';
import appApplicationRouter from './route.app.application';
import appSearchRouter from './route.app.search';
import appNotificationRouter from '../v1/route.app.notification';
import chatRouter from './route.app.chat';
import fcmRouter from './route.app.fcm-token';
import analyticRouter from './route.app.analytic';

// import homeAdminRouter from './route.app.homeAdmin';

const routeV1 = Router();


// app.use('/api/v1/sign-in', appSignInRouter); // SIGN IN
// app.use('/api/v1/accounts', appAccountRouter); // ACCOUNT
// app.use('/api/v1/profiles', appProfileRouter); // PROFILE
// app.use('/api/v1/posts', appPostRouter); // POST
// app.use('/api/v1/categories', appCategoryRouter); // CATEGORY
// app.use('/api/v1/locations', appLocationRouter); // LOCATION
// app.use('/api/v1/bookmarks', appBookmarkRouter); // BOOKMARK
// app.use('/api/v1/themes', themeRouter); // THEME
// app.use('/api/v1/banners', bannerRouter); // BANNER
// app.use('/api/v1/history', appHistoryRouter); // APPLICATION
// app.use('/api/v1/application', appApplicationRouter); // APPLICATION
// app.use('/api/v1/search', appSearchRouter); // SEARCH
// app.use('/api/v1/notification', appNotificationRouter); // NOTIFICATION
// app.use('/api/v1/chats', chatRouter); // CHAT
// app.use('/api/v1/fcm-token', fcmRouter); // FCM TOKEN
// app.use('/api/v1', appSiteRouter); // SITE

routeV1.use("/home-admin", appAccountRouter);
// routeV1.use('/home-admin', homeAdminRouter);


routeV1.use("/sign-in", appSignInRouter);
routeV1.use("/accounts", appAccountRouter);
routeV1.use("/profiles", appProfileRouter);
routeV1.use("/analytics", analyticRouter);
routeV1.use("/posts", appPostRouter);
routeV1.use("/categories", appCategoryRouter);
routeV1.use("/locations", appLocationRouter);
routeV1.use("/bookmarks", appBookmarkRouter);
routeV1.use("/themes", themeRouter);
routeV1.use("/banners", bannerRouter);
routeV1.use("/history", appHistoryRouter);
routeV1.use("/application", appApplicationRouter);
routeV1.use("/search", appSearchRouter);
routeV1.use("/notification", appNotificationRouter);
routeV1.use("/chats", chatRouter);
routeV1.use("/fcm-token", fcmRouter);
routeV1.use("/", appSiteRouter);

export default routeV1;
