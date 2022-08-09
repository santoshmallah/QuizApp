import { send, init } from "emailjs-com";



const serviceId = "service_iqhch19";
const templateId = "template_h12vlsh";
const userID = "lZ_UOoTdh5rbUWbd0";

const sendEmail = (content) => {
  init(userID);
  const toSend = {
    from_name: 'Quizapp',
    to_name: content.to_name,
    to_email: content.to_email,
    message: content.message,
  };
  console.log(toSend)
  send(serviceId, templateId, toSend)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};

export default { sendEmail };