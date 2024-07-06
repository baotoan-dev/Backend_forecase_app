
interface NotificationData {
    type: number;
    type_text: string;
    applicationId: number | null;
    postId: number | null;
    notificationId: number | null;
    applicationStatus: number | null;
}

interface NotificationContent {
    application_id: number | null;
    post_id: number | null;
    type: number | null;
    applicationStatus: number | null;
    postTitle: string | null;
    companyName: string | null;
    name: string | null;
    notificationId: number | null;
}

const createNotificationContent = (
    lang: string,
    content: NotificationContent
) => {

    let title = "";

    let body = '<p style="font-size:14px;color:#575757">';

    let body_push = "";

    let data: NotificationData = {
        type: 0,
        type_text: "",
        applicationId: null,
        postId: null,
        notificationId: null,
        applicationStatus: null
    };

    
    data.applicationId = content.application_id;
    data.postId = content.post_id;
    data.applicationStatus = content.applicationStatus;
    data.notificationId = content.notificationId;
    
    if (content.type === 0) {
        data.type = 0;
        data.type_text = "applicator";
        if (content.applicationStatus === 2) {
            title = lang === "vi" ? "Đơn ứng tuyển đã được duyệt"
                : lang === "en" ? "Application has been approved" : "지원서가 승인되었다";

            body += 
                lang === "vi" ? `Đơn ứng tuyển vị trí <b style="color: #0D99FF;">${content.postTitle}</b> cho ${content.companyName} của bạn đã được nhà tuyển dụng duyệt!.`
                : lang === "en" ? `Your application for the position of <b style="color: #0D99FF;">${content.postTitle}</b> for ${content.companyName} has been approved`
                : `당신의 ${content.companyName} 사의 <b style="color: #0D99FF;">${content.postTitle}</b> 포지션 지원서가 고용주에 의해 승인되었습니다!`;

            body_push = lang === "vi" ? `Đơn ứng tuyển vị trí ${content.postTitle} cho ${content.companyName} của bạn đã được nhà tuyển dụng duyệt!.`
            : lang === "en" ? `Your application for the position of ${content.postTitle} for ${content.companyName} has been approved`
            : `당신의 ${content.companyName} 사의 ${content.postTitle} 포지션 지원서가 고용주에 의해 승인되었습니다!`;
        } else if (content.applicationStatus === 4) {
            title = lang === "vi" ? "Bạn đã được tuyển!"
                : lang === "en" ? "You have been recruited!" : "채용되었습니다!";

            body += lang === "vi" ? `Chúc mừng bạn! Bạn đã được nhà tuyển dụng xác nhận tuyển cho vị trí <b style="color: #0D99FF;">${content.postTitle}</b> cho ${content.companyName}.`
                : lang === "en" ? `Congratulation! You have been confirmed by the employer for the position of <b style="color: #0D99FF;">${content.postTitle}</b> for ${content.companyName}.`
                : `축하드립니다 ${content.companyName} 에서 <b style="color: #0D99FF;">${content.postTitle}</b> 로 채용이 확정되었습니다!`;

            body_push = lang === "vi" ? `Chúc mừng bạn! Bạn đã được nhà tuyển dụng xác nhận tuyển cho vị trí ${content.postTitle} cho ${content.companyName}.`
            : lang === "en" ? `Congratulation! You have been confirmed by the employer for the position of ${content.postTitle} for ${content.companyName}.`
            : `축하드립니다 ${content.companyName} 에서 ${content.postTitle} 로 채용이 확정되었습니다!`;
        }
    } else if (content.type === 1) {
        data.type = 1;
        data.type_text = "recruiter";
        title = lang === "vi" ? "Ứng viên mới đã nộp hồ sơ"
            : lang === "en" ? "New candidate have applied" : "새로운 지원자가 지원서를 제출했습니다.";

        body += lang === "vi" ? `Ứng viên ${content.name} vừa nộp hồ sơ ứng tuyển vị trí <b style="color: #0D99FF;">${content.postTitle}</b> cho ${content.companyName} của bạn.`
            : lang === "en" ? `Candidate ${content.name} has just applied for the position of <b style="color: #0D99FF;">${content.postTitle}</b> for your ${content.companyName}.`
            : `${content.name} 후보자는 방금 당신의 ${content.companyName} 회사에 <b style="color: #0D99FF;">${content.postTitle}</b> 포지션 지원서를 제출했습니다.`;

        body_push = lang === "vi" ? `Ứng viên ${content.name} vừa nộp hồ sơ ứng tuyển vị trí ${content.postTitle} cho ${content.companyName} của bạn.`
        : lang === "en" ? `Candidate ${content.name} has just applied for the position of ${content.postTitle} for your ${content.companyName}.`
        : `${content.name} 후보자는 방금 당신의 ${content.companyName} 회사에 ${content.postTitle} 포지션 지원서를 제출했습니다.`;
    }

    body += "</p>";
    return {
        title,
        body,
        data,
        body_push
    }
}

export { createNotificationContent };
export type { NotificationData };
export type { NotificationContent };