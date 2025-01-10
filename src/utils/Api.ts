import { Platform } from "react-native";

export default class Api {
  public static host = Platform.Version == 23 ? "https://apps.goroga.in/public/api" : "https://apps.goroga.in/public/api";
  // public static host = Platform.Version == 23 ? "https://google.com" : "https://google.com";
  public static register = `${this.host}/register`; // deprecated
  public static login = `${this.host}/login`; // deprecated

  /* register with otp */
  public static registerCheckAndGenerateOtp = `${this.host}/v2/signup/checkAndGenerateOtp/`;
  public static signupWithOtp = `${this.host}/v2/signup`;
  public static deleteAccount = `${this.host}/delete/`;

  /* login with otp */
  public static loginCheckAndGenerateOtp = `${this.host}/v2/signin/checkAndGenerateOtp/`;
  public static signinWithOtp = `${this.host}/v2/signin`;

  public static sessionVideos = `${this.host}/sessions/`;
  public static ProgramsVideos = `${this.host}/programs`;
  public static patientList = `${this.host}/session/user/`;
  public static trackStress = `${this.host}/track/stress/`;
  public static trackVideoRecord = `${this.host}/session/record/`;
  public static FAQScreen = `${this.host}/setting/data`;

  /* analytics */
  public static stressLevel = `${this.host}/track/stressRecord/`;
  public static totalSessionPlayedRecord = `${this.host}/totalSessionPlayedRecord/`;
  public static totalMinuteSpendRecord = `${this.host}/totalMinuteSpendRecord/`;
  public static GAD7ScoreRecord = `${this.host}/GAD7ScoreRecord/`;

  /* session user */
  public static userProfile = `${this.host}/v2/user/profile/`;
  public static SessionUserRregister = `${this.host}/session/user/register`;
  public static surveyQuestion = `${this.host}/surveyquestion/`;
  public static submitSurveyQuestion = `${this.host}/submit/survey/`;
  public static sessionHistory = `${this.host}/session/history/`; // deprecated
  public static patientUnderDoctor = `${this.host}/session/user/`;

  /* device */
  public static deviceStatus = `${this.host}/device/status/`;

  /* favourite videos */
  public static Favourite = `${this.host}/v2/user/favourite`;

  /* pill reminder */
  public static pillReminder = `${this.host}/v1/pillReminder/`;
  public static pillReminderOperation = `${this.host}/v1/pillReminder/reminder/`;
}
