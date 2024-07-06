import deleteAccountControllerById from "./controller.account.deleteAccountById";
import readAccountsController from "./controller.account.readAccounts";
import readTodayAccountsController from "./controller.account.readTodayAccounts";
import searchAccountsController from "./controller.account.searchAccounts";
import searchTodayAccountsController from "./controller.account.searchTodayAccounts";

const accountController = {
    readAccounts: readAccountsController,
    readTodayAccounts: readTodayAccountsController,
    deleteAccount: deleteAccountControllerById,
    searchAccounts: searchAccountsController,
    searchTodayAccounts:searchTodayAccountsController
};

export default accountController;
