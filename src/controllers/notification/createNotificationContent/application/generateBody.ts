const generateBody = ({
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
    switch (type) {
        case 0:
            switch (applicationStatus) {
                case 2:
                    switch (lang) {
                        case "vi":
                            return `Đơn ứng tuyển vị trí ${postTitle} cho ${companyName} của bạn đã được nhà tuyển dụng duyệt!.`;
                        case "en":
                            return `Your application for the position of ${postTitle} for ${companyName} has been approved`;
                        case "ko":
                            return `당신의 ${companyName} 사의 ${postTitle} 포지션 지원서가 고용주에 의해 승인되었습니다!`;
                        default:
                            return `Đơn ứng tuyển vị trí ${postTitle} cho ${companyName} của bạn đã được nhà tuyển dụng duyệt!.`;
                    }
                case 3:
                    switch (lang) {
                        case "vi":
                            return `Đơn ứng tuyển vị trí ${postTitle} cho ${companyName} của bạn đã bị từ chối!`;
                        case "en":
                            return `Your application for the position of ${postTitle} for ${companyName} has been rejected!`;
                        case "ko":
                            return `당신의 ${companyName} 사의 ${postTitle} 포지션 지원서가 거부되었습니다!`;
                        default:
                            return `Đơn ứng tuyển vị trí ${postTitle} cho ${companyName} của bạn đã bị từ chối!`;
                    }
                case 4:
                    switch (lang) {
                        case "vi":
                            return `Chúc mừng bạn! Bạn đã được nhà tuyển dụng xác nhận tuyển cho vị trí ${postTitle} cho ${companyName}.`;
                        case "en":
                            return `Congratulation! You have been confirmed by the employer for the position of ${postTitle} for ${companyName}.`;
                        case "ko":
                            return `축하드립니다 ${companyName} 에서 ${postTitle} 로 채용이 확정되었습니다!`;
                        default:
                            return `Chúc mừng bạn! Bạn đã được nhà tuyển dụng xác nhận tuyển cho vị trí ${postTitle} cho ${companyName}.`;
                    }
            }
            break;
        case 1:
            switch (lang) {
                case "vi":
                    return `Ứng viên ${name} vừa nộp hồ sơ ứng tuyển vị trí ${postTitle} cho ${companyName} của bạn.`;
                case "en":
                    return `Candidate ${name} has just applied for the position of ${postTitle} for your ${companyName}.`;
                case "ko":
                    return `당신의 ${companyName} 사의 ${postTitle} 포지션 지원서가 고용주에 의해 승인되었습니다!`;
                default:
                    return `${name} 후보자는 방금 당신의 ${companyName} 회사에 ${postTitle} 포지션 지원서를 제출했습니다.`;
            }
    }
};

export default generateBody;
