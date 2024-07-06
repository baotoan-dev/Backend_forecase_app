const generateTitleFollow = (
    {
        lang, //language
    } : {
        lang: string,
    }
): string => {
    switch (lang) {
        case "vi":
            return "Tin tuyển dụng mới từ công ty theo dõi";
        case "en":
            return "New job from followed company";
        case "ko":
            return "팔로우한 회사의 새로운 채용 공고";
        default:
            return "Tin tuyển dụng mới từ công ty theo dõi";
    }
}

export default generateTitleFollow;