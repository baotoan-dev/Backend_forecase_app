import ImageBucket from "../../../models/enum/imageBucket.enum";

const formatBannerResponse = (banner) => {
    return {
        ...banner,
        image: banner.image ? `${process.env.AWS_BUCKET_PREFIX_URL}/${ImageBucket.BANNER_IMAGES}/` + banner.image : null,
    };
}

export { formatBannerResponse };