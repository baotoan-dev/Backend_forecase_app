const generateTitle = (
    {
        lang, //language
    } : {
        lang: string,
    }
): string => {
    switch (lang) {
        case "vi":
            return "Có người bình luận về bài viết của bạn";
        case "en":
            return "Your post has received a new comment";
        case "ko":
            return "누군가가 내 게시물에 댓글을 달았습니다";
        default:
            return "Có người bình luận về bài viết của bạn";
    }
}

export default generateTitle;