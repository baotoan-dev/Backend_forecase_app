const generateWelcomeMail = (email: string) => {
  return `
    <div class="container" style="background-color: #fff">
      <div
        class="wrapper"
        style="padding: 40px 20px; border: 1px solid #b0b1b1; height: 100%"
      >
        <div style="display: flex">
          <img
            src="https://res.cloudinary.com/ddwjnjssj/image/upload/v1697131521/images/mailchimp/ads_mail/logoCircle.png"
            alt="logo"
            style="width: 50px; height: 50px";
            border-radius: 5px;
          />
          <h1
            style="
              font-weight: 700;
              font-size: 16px;
              line-height: 19px;
              margin-left: 12px;
              color: #000;
            "
          >
            CHÀO MỪNG BẠN ĐẾN VỚI Jobs!
          </h1>
        </div>
        <div class="content" style="padding: 24px 0">
          <h1
            style="
              font-weight: 700;
              font-size: 16px;
              line-height: 19px;
              margin: 0;
              padding-top: 24px;
              color: #000000;
            "
          >
            Hiểu thêm về chúng tôi
          </h1>
          <div class="content-text" style="padding: 12px 0">
            <p
              style="
                font-style: normal;
                font-weight: 400;
                font-size: 14px;
                margin: 0;
                line-height: 16px;
                color: #000000;
              "
            >
              Chúng tôi rất vui khi bạn đã ở đây. Jobs là nền tảng tuyển dụng
              được phát triển bởi công ty TNHH Jobs, đăng ký tài khoản Jobs
              thành công đồng nghĩa với việc bạn được cung cấp:
            </p>
            <ul style="margin: 0 24px">
              <li
                style="
                  font-style: normal;
                  font-weight: 400;
                  font-size: 14px;
                  margin: 0;
                  line-height: 16px;
                  color: #000000;
                "
              >
                Một môi trường kết nối ứng viên với nhà tuyển dụng
                <span style="font-weight: 700">nhanh chóng, tiện lợi</span>.
              </li>
              <li
                style="
                  font-style: normal;
                  font-weight: 400;
                  font-size: 14px;
                  margin: 0;
                  line-height: 16px;
                  color: #000000;
                "
              >
                Hàng triệu công việc trong
                <span style="font-weight: 700"> mọi lĩnh vực</span> từ các
                <span style="font-weight: 700">nền tảng việc làm uy tín</span>
                tại Việt Nam.
              </li>
              <li
                style="
                  font-style: normal;
                  font-weight: 400;
                  font-size: 14px;
                  margin: 0;
                  line-height: 16px;
                  color: #000000;
                "
              >
                Tạo CV và bài đăng tuyển hoàn toàn
                <span style="font-weight: 700">miễn phí và dễ dàng</span>.
              </li>
            </ul>
            <p
              style="
                font-style: normal;
                font-weight: 400;
                font-size: 14px;
                margin: 0;
                color: #000000;
              "
            >
              Tất cả việc làm tại Việt Nam đều có ở Jobs, hãy sử dụng và trải
              nghiệm các dịch vụ của ứng dụng hoàn toàn miễn phí. Nếu có bất kỳ
              thắc mắc hãy liên hệ với chúng tôi qua địa chỉ email:
              <a
                href="mailto:baotoandd2016@gmail.com"
                style="
                    text-decoration: none;
                    font-weight: 400;
                    font-size: 14px;
                    line-height: 16px;
                    text-align: center;
                    color: #575757;
                "> baotoandd2016@gmail </a> 
              hoặc số điện
              thoại: 
              <a
                href="tel:02835358983"
                style="
                    text-decoration: none;
                    font-weight: 400;
                    font-size: 14px;
                    line-height: 16px;
                    text-align: center;
                    color: #575757;
                "> (028) 35358983 </a> 
            </p>
          </div>

          <div style="display: flex; margin: 12px 0">
            <a href="https://www.facebook.com/profile.php?id=100009149872534" style="margin: 0 auto;">
              <button
                style="
                  width: 167px;
                  padding: 16px 10px;
                  background-color: #0d99ff;
                  box-shadow: 0px 2px 11px rgba(208, 199, 199, 0.25);
                  border-radius: 10px;
                  color: #fff;
                  font-weight: 700;
                  font-size: 16px;
                  line-height: 19px;
                  border: none;
                "
              >
                Truy cập ứng dụng
              </button>
            </a>
          </div>
        </div>
        <div style="border-top: 1px solid #b0b1b1; padding: 24px">
          <div style="display: flex">
            <div style="margin: 0 auto">
              <div
                  style="margin: 0 auto; display: flex;"
              >
                <a href="https://www.facebook.com/hijobOfficial">
                  <img
                    src="https://hi-job-app-upload.s3.ap-southeast-1.amazonaws.com/images/mailchimp/ri_facebook-fill.png"
                    alt="fb-logo"
                    width="28px"
                    height="28px"
                  />
                </a>
                <a href="https://" style="margin-left: 12px;">
                  <img
                    src="https://hi-job-app-upload.s3.ap-southeast-1.amazonaws.com/images/mailchimp/mdi_link-variant.png"
                    alt=""
                    width="28px"
                    height="28px"
                    style=""
                  />
                </a>
              </div>
            </div>
          </div>
          <p
            style="
              text-align: center;
              margin: 20px 0;
              font-style: italic;
              font-weight: 400;
              font-size: 14px;
              line-height: 16px;
              color: #575757;
            "
          >
            Copyright © *2023* *Công ty TNHH Jobs*, All rights reserved.
          </p>
          <div style="text-align: center">
            <div style="margin: 0 auto">
              <span
                style="
                  font-weight: 500;
                  font-size: 14px;
                  line-height: 16px;
                  text-align: center;
                  color: #575757;
                "
              >
                Our mailing address is:
              </span>
              <a
                style="
                  text-decoration: underline;
                  font-weight: 400;
                  font-size: 14px;
                  line-height: 16px;
                  text-align: center;
                  color: #575757;
                "
              >
                baotoandd2016@gmail.com</a
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
};

export default generateWelcomeMail;
