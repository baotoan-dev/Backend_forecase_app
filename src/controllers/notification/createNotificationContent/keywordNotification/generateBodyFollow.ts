const generateBodyFollow = ({
    postTitle,
    companyName,
    lang = "vi",
}: {
    postTitle: string;
    companyName: string;
    lang?: string;
}) => {
    switch (lang) {
        case "vi":
            return `Công ty ${companyName} bạn đã theo dõi đã đăng tin tuyển dụng ${postTitle}`;
        case "en":
            return `${companyName} has followed a new job: ${postTitle}`;
        case "ko":
            return `${companyName}이(가) 새로운 채용 공고를 게시했습니다: ${postTitle}`;
        default:
            return `Công ty ${companyName} bạn đã theo dõi đã đăng tin tuyển dụng ${postTitle}`;

    }
};

export default generateBodyFollow;
