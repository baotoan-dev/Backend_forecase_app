const generateTitle = (
    {
        type,
        lang, //language
        applicationStatus
    } : {
        type: number,
        lang: string,
        applicationStatus: number
    }
): string => {
    
    switch (type) {
        case 0:
            // console.log("type: ", type);
            // console.log("applicationStatus: ", applicationStatus);
            switch (applicationStatus) {
                case 2:
                    switch (lang) {
                        case "vi":
                            return "Đơn ứng tuyển đã được duyệt";
                        case "en":
                            return "Application has been approved";
                        case "ko":
                            return "지원서가 승인되었다";
                        default:
                            return "Đơn ứng tuyển đã được duyệt";
                    }
                case 3:
                    switch (lang) {
                        case "vi":
                            return "Đơn ứng tuyển đã bị từ chối";
                        case "en":
                            return "Application has been rejected";
                        case "ko":
                            return "지원서가 거부되었다";
                        default:
                            return "Đơn ứng tuyển đã bị từ chối";
                    }
                case 4:
                    switch (lang) {
                        case "vi":
                            return "Bạn đã được tuyển!";
                        case "en":
                            return "You have been recruited!";
                        case "ko":
                            return "채용되었습니다!";
                        default:

                    }
                }
            break;
        case 1:
            switch (lang) {
                case "vi":
                    return "Ứng viên mới đã nộp hồ sơ";
                case "en":
                    return "New candidate have applied";
                case "ko":
                    return "새로운 지원자가 지원서를 제출했습니다";
                default:
                    return "Ứng viên mới đã nộp hồ sơ";
            }
    }           
}

export default generateTitle;