import searchByQueryController from "./controller.search.byQuery";
import deleteAllHistoryKeywordController from "./controller.search.deleteAllHistory";
import deleteHistoryKeywordController from "./controller.search.deleteHistoryKeyword";
import readHistorySearchByAccountIdController from "./controller.search.readHistorySearch";
import readSuggestedListSearchController from "./controller.search.readSuggestList";

const searchController = {
    search: searchByQueryController,
    readHistorySearch: readHistorySearchByAccountIdController,
    readSuggestedListSearch: readSuggestedListSearchController,
    deleteHistorySearch: deleteHistoryKeywordController,
    deleteAllHistorySearch: deleteAllHistoryKeywordController
};

export default searchController;