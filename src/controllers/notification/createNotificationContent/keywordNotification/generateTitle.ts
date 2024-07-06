const generateTitle = (
    {
        lang, //language
    } : {
        lang: string,
    }
): string => {
    switch (lang) {
        case "vi":
            return "Tin tuyển dụng mới";
        case "en":
            return "New job";
        case "ko":
            return "새로운 채용 공고";
        default:
            return "Tin tuyển dụng mới";
    }
}

export default generateTitle;