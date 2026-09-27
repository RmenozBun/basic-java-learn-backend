import moment from "moment-timezone";

const nowInBangkok = () => moment().tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss");

export default nowInBangkok;
