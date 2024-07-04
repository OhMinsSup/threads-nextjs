import { isBefore, isEqual, sub, toDate } from "date-fns";

interface CompareSessionExpireDateReturnType {
  type:
    | "nextAuthExpireDate"
    | "remoteBackendExpireDate"
    | "authExpireDate"
    | "none";
  isUpdate: boolean;
  message: string;
}

export const isSessionExpireDate = (
  nextAuthExpireValue: Date | number | string,
  remoteBackendExpireValue: Date | number | string,
): CompareSessionExpireDateReturnType => {
  const nextAuthExpireDate = toDate(nextAuthExpireValue);
  const remoteBackendExpireDate = toDate(remoteBackendExpireValue);

  const now = toDate(new Date());
  // 현재시간의 5분전 시간
  const fiveMinutesAgo = toDate(sub(now, { minutes: 5 }));

  // "tenMinutesAgo" 보다 "nextAuthExpireDate" 값이 작으면 만료된 것으로 판단
  if (isBefore(nextAuthExpireDate, fiveMinutesAgo)) {
    return {
      type: "nextAuthExpireDate",
      isUpdate: true,
      message: "nextAuthExpireDate is expired",
    };
  }

  // remoteBackendExpireDate 현재 시간보다 적으면 만료된 것으로 판단
  if (isAccessTokenExpireDate(remoteBackendExpireDate)) {
    return {
      type: "remoteBackendExpireDate",
      isUpdate: true,
      message: "remoteBackendExpireDate is expired",
    };
  }

  // (nextAuthExpireDate)7/30일 만료 - (remoteBackendExpireDate)7/31|7/30일 만료
  // "nextAuthExpireDate" 값하고 "remoteBackendExpireDate" 값이 같거나 값이 크면 만료된 것으로 판단
  if (isEqual(nextAuthExpireDate, remoteBackendExpireDate)) {
    return {
      type: "authExpireDate",
      isUpdate: true,
      message: "authExpireDate is expired",
    };
  }

  if (isBefore(nextAuthExpireDate, remoteBackendExpireDate)) {
    return {
      type: "authExpireDate",
      isUpdate: true,
      message: "authExpireDate is expired",
    };
  }

  return {
    type: "none",
    isUpdate: false,
    message: "not expired",
  };
};

export const isAccessTokenExpireDate = (
  accessTokenExpireDate: Date | number | string,
): boolean => {
  const accessTokenExpireDateToNumber = toDate(accessTokenExpireDate);
  const now = toDate(new Date());
  // 현재시간의 5분전 시간
  const fiveMinutesAgo = toDate(sub(now, { minutes: 5 }));

  // accessTokenExpireDate 값이 5분전 시간보다 같거나 작으면 만료된 것으로 판단
  if (isEqual(accessTokenExpireDateToNumber, fiveMinutesAgo)) {
    return true;
  }

  if (isBefore(accessTokenExpireDateToNumber, fiveMinutesAgo)) {
    return true;
  }

  return false;
};
