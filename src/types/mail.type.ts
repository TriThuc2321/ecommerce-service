export interface ISendEmail {
  subject: string;
  to: string;
  template: string;
  context: unknown;
}

export interface IEmailRegisterContext {
  username: string;
  activeUrl: string;
}

export interface IEmailForgotPasswordContext {
  resetLink: string;
  username: string;
}
