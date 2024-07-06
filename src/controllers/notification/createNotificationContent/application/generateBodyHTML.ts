import validator from "validator";

const generateBodyHTML = ({
    type,
    applicationStatus,
    postTitle,
    companyName,
    name,
    lang = "vi",
}: {
    type: number;
    applicationStatus: number;
    postTitle: string;
    companyName: string;
    name: string;
    lang?: string;
}) => {
    let postTitleHTML = validator.escape(postTitle);
    let companyNameHTML = validator.escape(companyName);
    let nameHTML = validator.escape(name);

    switch (type) {
        case 0:
            switch (applicationStatus) {
                case 2:
                    switch (lang) {
                        case "vi":
                            return `Đơn ứng tuyển vị trí <b style="color: #0D99FF;">${postTitleHTML}</b> cho ${companyNameHTML} của bạn đã được nhà tuyển dụng duyệt!`;
                        case "en":
                            return `Your application for the position of <b style="color: #0D99FF;">${postTitleHTML}</b> for ${companyNameHTML} has been approved`;
                        case "ko":
                            return `당신의 ${companyNameHTML} 사의 <b style="color: #0D99FF;">${postTitleHTML}</b> 포지션 지원서가 고용주에 의해 승인되었습니다!`;
                        default:
                            return `Đơn ứng tuyển vị trí <b style="color: #0D99FF;">${postTitleHTML}</b> cho ${companyNameHTML} của bạn đã được nhà tuyển dụng duyệt!`;
                    }
                case 3:
                    switch (lang) {
                        case "vi":
                            return `Đơn ứng tuyển vị trí <b style="color: #0D99FF;">${postTitleHTML}</b> cho ${companyNameHTML} của bạn đã bị từ chối!`;
                        case "en":
                            return `Your application for the position of <b style="color: #0D99FF;">${postTitleHTML}</b> for ${companyNameHTML} has been rejected!`;
                        case "ko":
                            return `당신의 ${companyNameHTML} 사의 <b style="color: #0D99FF;">${postTitleHTML}</b> 포지션 지원서가 거부되었습니다!`;
                        default:
                            return `Đơn ứng tuyển vị trí <b style="color: #0D99FF;">${postTitleHTML}</b> cho ${companyNameHTML} của bạn đã bị từ chối!`;
                    }
                case 4:
                    switch (lang) {
                        case "vi":
                            return `Chúc mừng bạn! Bạn đã được nhà tuyển dụng xác nhận tuyển cho vị trí <b style="color: #0D99FF;">${postTitleHTML}</b> cho ${companyNameHTML}.`;
                        case "en":
                            return `Congratulation! You have been confirmed by the employer for the position of <b style="color: #0D99FF;">${postTitleHTML}</b> for ${companyNameHTML}.`
                        case "ko":
                            return `축하드립니다 ${companyNameHTML} 에서 <b style="color: #0D99FF;">${postTitleHTML}</b> 로 채용이 확정되었습니다!`;
                        default:
                            return `Chúc mừng bạn! Bạn đã được nhà tuyển dụng xác nhận tuyển cho vị trí <b style="color: #0D99FF;">${postTitleHTML}</b> cho ${companyNameHTML}.`;
                    }
            }
            break;
        case 1:
            switch (lang) {
                case "vi":
                    return `Ứng viên ${nameHTML} vừa nộp hồ sơ ứng tuyển vị trí <b style="color: #0D99FF;">${postTitleHTML}</b> cho ${companyNameHTML} của bạn.`
                case "en":
                    return `Candidate ${nameHTML} has just applied for the position of <b style="color: #0D99FF;">${postTitleHTML}</b> for your ${companyNameHTML}.`
                case "ko":
                    return `${nameHTML} 후보자는 방금 당신의 ${companyNameHTML} 회사에 <b style="color: #0D99FF;">${postTitleHTML}</b> 포지션 지원서를 제출했습니다.`;
                default:
                    return `Ứng viên ${nameHTML} vừa nộp hồ sơ ứng tuyển vị trí <b style="color: #0D99FF;">${postTitleHTML}</b> cho ${companyNameHTML} của bạn.`
            }
    }
};

export default generateBodyHTML;
