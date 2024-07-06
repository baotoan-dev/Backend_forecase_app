import readAcceptedPostsOfMyAccountController from "./controller.post.readAcceptedPostsOfMyAccount";
import readPostByIdController from "./readPost/handler/controller.post.readPostById";
import readAcceptedPostsOfAnotherAccountController from "./controller.post.readAcceptedPostsOfAnotherAccount";
import readAcceptedPostsInBookmarkController from "./readPost/handler/controller.post.readAcceptedPostsInBookmark";
import readAcceptedPostsByThemeController from "./readPost/handler/controller.post.readAcceptedPostsByTheme";
import readPostsByAdminController from "./controller.post.readPostsByAdmin";
import readNewestAcceptedPostsController from "./readPost/handler/controller.post.readNewestAcceptedPosts";
import readNearbyAcceptedPostsController from "./readPost/handler/controller.post.readNearbyAcceptedPosts";
import readAllPostsByThemeController from "./controller.post.readAllPostsByTheme";
import countPostQuantityByAdminController from "./controller.post.countPostQuantityByAdmin";
import createPostController from "./controller.post.create";
import updatePostInformationController from "./controller.post.updateInformation";
import updateInformationByAdminController from "./controller.post.updateInformationByAdmin";
import updatePostStatusController from "./controller.post.updateStatus";
import updateStatusOfManyPostsController from "./controller.post.updateStatusOfManyPosts";
import readPostByIdByAdminController from "./controller.post.readPostByIdByAdmin";
import filterPostByAddressController from "./controller.post.filterPostByAddress";
import readRelatedPostsController from "./readPost/handler/controller.post.readRelatedPosts";
import searchPostsByAdminController from "./controller.post.searchPostsByAdmin";

const postController = {
    // READ ALL POSTS
    readPostsByAdmin: readPostsByAdminController,

    // SEARCH POSTS BY ADMIN
    searchPostsByAdmin:searchPostsByAdminController,

    // READ ALL POSTS BY THEME
    readAllPostsByTheme: readAllPostsByThemeController,

    // READ ACCEPTED POSTS OF OWN ACCOUNT
    readAcceptedPostsOfMyAccount: readAcceptedPostsOfMyAccountController,

    // READ ACCEPTED POSTS OF ANOTHER ACCOUNT
    readAcceptedPostsOfAnotherAccount:
        readAcceptedPostsOfAnotherAccountController,

    // READ ACCEPTED POSTS IN BOOKMARK
    readAcceptedPostsInBookmark: readAcceptedPostsInBookmarkController,

    // READ ACCEPTED POSTS BY THEME
    readAcceptedPostsByTheme: readAcceptedPostsByThemeController,

    // READ NEWEST ACCEPTED POSTS
    readNewestAcceptedPosts: readNewestAcceptedPostsController,

    // READ NEARBY ACCEPTED POSTS
    readNearbyAcceptedPosts: readNearbyAcceptedPostsController,

    // READ POST BY ID
    readPostById: readPostByIdController,

    // READ POST BY ID BY ADMIN
    readPostByIdByAdmin: readPostByIdByAdminController,

    //RELATED POSTS
    readRelatedPosts: readRelatedPostsController,

    // COUNT BY ADMIN
    countPostQuantityByAdmin: countPostQuantityByAdminController,

    // CREATE POST
    create: createPostController,

    // UPDATE POST INFORMATION
    updateInformationByAdmin: updateInformationByAdminController,
    updateInformation: updatePostInformationController,

    // UPDATE POST STATUS
    updateStatus: updatePostStatusController,

    // UPDATE STATUS OF MANY POSTS
    updateStatusOfManyPosts: updateStatusOfManyPostsController,

    // filter post by address
    filterPostByAddress: filterPostByAddressController,
};

export default postController;
