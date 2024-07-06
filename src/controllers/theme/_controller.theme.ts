import readAllThemesController from "./controller.theme.readAllThemes";
import readEnabledThemesController from "./controller.theme.readEnabledThemes";
import createThemeController from "./controller.theme.create";
import addPostsToThemeController from "./controller.theme.addPostsToTheme";
import updateThemeController from "./controller.theme.update";
import updateThemesStatusController from "./controller.theme.updateThemesStatus";

const themeController = {
    readAllThemes: readAllThemesController,
    readEnabledThemes: readEnabledThemesController,
    create: createThemeController,
    addPostsToTheme: addPostsToThemeController,
    update: updateThemeController,
    updateThemesStatus: updateThemesStatusController,
};

export default themeController;
