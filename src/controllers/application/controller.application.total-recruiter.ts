import createError from 'http-errors';
import { Response, Request, NextFunction } from 'express';
import logging from '../../utils/logging';
import applicationService from '../../services/application/_service.application';
import communityService from '../../services/community/_service.community';
import countApplyPostService from '../../services/post/service.post.countBookmarkPost';
import viewDetailViewPostService from '../../services/post/service.post.detailViewPost';
import resultSearchJobService from '../../services/search/service.search.resultSearchJob';
import countBookmarkPostService from '../../services/post/service.post.countBookmarkPost';

const totalApplicationRecruiterController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: accountId } = req.user;

    const type = req.query.type as string;

    // view apply

    const resultApply = await applicationService.total.totalApplicationCandidateService(
      accountId,
      type,
    );

    // view candidate

    const resultViewJob =
      await viewDetailViewPostService(
        accountId,
      );

    // view bookmark

    const resultSearchJob =
      await resultSearchJobService(accountId);

    const readCountPostBookmark = await countBookmarkPostService(accountId);

    const resultCreateCommunity = await communityService.countCreateCommunity(accountId);


    // get count save community

    const resultSaveCommunity = await communityService.countSaveCommunity(accountId);

    if (res === null) {
      return next(createError(500, 'Internal server error'));
    }

    return res.status(200).json({
      status: 200,
      data: {
        applyLogs: resultApply,
        resultViewJob: resultViewJob,
        resultSearchJob: resultSearchJob,
        viewYourCompanyLogs: 0,
        saveYourCompanyLogs: 0,
        countPostBookmark: parseInt(readCountPostBookmark[0].total),
        createCommunityLogs: parseInt(resultCreateCommunity[0].total),
        saveCommunityLogs: parseInt(resultSaveCommunity[0].total),
      },
    });
  } catch (error) {
    logging.error(error);
    next(createError(500, 'Internal server error'));
  }
};

export default totalApplicationRecruiterController;
