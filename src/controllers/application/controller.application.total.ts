import createError from 'http-errors';
import {Response, Request, NextFunction} from 'express';
import logging from '../../utils/logging';
import applicationService from '../../services/application/_service.application';
import candidateService from '../../services/candidate/_service.candidate';
import communityService from '../../services/community/_service.community';

const totalApplicationController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {id: accountId} = req.user;

    const type = req.query.type as string;

    // view apply

    const resultApply = await applicationService.total.totalApplicationService(
      accountId,
      type,
    );

    // view candidate

    const resultViewCandidate =
      await candidateService.readViewCandidate.readTotalCandidateService(
        accountId,
      );

    // view bookmark

    const resultCandiateBookmark =
      await candidateService.readViewCandidate.readCandidateBookmark(accountId);


    // get count create community

    const resultCreateCommunity =
      await communityService.countCreateCommunity(accountId);


    // get count save community

    const resultSaveCommunity =
      await communityService.countSaveCommunity(accountId);

    
    if (res === null) {
      return next(createError(500, 'Internal server error'));
    }

    return res.status(200).json({
      status: 200,
      data: {
        applyLogs: resultApply,
        viewCandidateLogs: resultViewCandidate,
        saveCandidateLogs: resultCandiateBookmark,
        viewYourCompanyLogs: 0,
        saveYourCompanyLogs: 0,
        createCommunityLogs: parseInt(resultCreateCommunity[0].total),
        saveCommunityLogs: parseInt(resultSaveCommunity[0].total),
      },
    });
  } catch (error) {
    logging.error(error);
    next(createError(500, 'Internal server error'));
  }
};

export default totalApplicationController;
