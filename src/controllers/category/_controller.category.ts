import readAllParentCategories from "./controller.category.readAllParent";
import readChildCategoriesByParentCategoryId from "./controller.category.readChildsByParentId";
import readAllCategoriesController from "./controller.category.readAll";

const categoryController = {
    readAllParents: readAllParentCategories,
    readChildsByParentId: readChildCategoriesByParentCategoryId,
    readAllCategories: readAllCategoriesController,
};

export default categoryController;
