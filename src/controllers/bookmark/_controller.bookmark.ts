import createBookmarkController from "./controller.bookmark.create";
import deleteBookmarkController from "./controller.bookmark.delete";

const bookmarkController = {
    create: createBookmarkController,
    delete: deleteBookmarkController,
};

export default bookmarkController;
