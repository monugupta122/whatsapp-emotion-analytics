import { message } from "antd";

export const successToast = (msg: string) => {
  message.success(msg);
};

export const errorToast = (msg: string) => {
  message.error(msg);
};

export const infoToast = (msg: string) => {
  message.info(msg);
};

export const warningToast = (msg: string) => {
  message.warning(msg);
};
