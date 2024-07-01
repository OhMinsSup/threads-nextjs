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
  nextAuthExpireDate: Date | number | string,
  remoteBackendExpireDate: Date | number | string,
): CompareSessionExpireDateReturnType => {
  const nextAuthExpireDateToNumber = toDate(nextAuthExpireDate);
  const remoteBackendExpireDateToNumber = toDate(remoteBackendExpireDate);

  const now = toDate(new Date());
  // 현재시간의 10분전 시간
  const tenMinutesAgo = toDate(sub(now, { minutes: 5 }));

  // "tenMinutesAgo" 보다 "nextAuthExpireDate" 값이 작으면 만료된 것으로 판단
  if (isBefore(nextAuthExpireDateToNumber, tenMinutesAgo)) {
    return {
      type: "nextAuthExpireDate",
      isUpdate: true,
      message: "nextAuthExpireDate is expired",
    };
  }

  // remoteBackendExpireDate 현재 시간보다 적으면 만료된 것으로 판단
  if (isBefore(remoteBackendExpireDateToNumber, now)) {
    return {
      type: "remoteBackendExpireDate",
      isUpdate: true,
      message: "remoteBackendExpireDate is expired",
    };
  }

  // (nextAuthExpireDate)7/30일 만료 - (remoteBackendExpireDate)7/31|7/30일 만료
  // "nextAuthExpireDate" 값하고 "remoteBackendExpireDate" 값이 같거나 값이 크면 만료된 것으로 판단
  if (isEqual(nextAuthExpireDateToNumber, remoteBackendExpireDateToNumber)) {
    return {
      type: "authExpireDate",
      isUpdate: true,
      message: "authExpireDate is expired",
    };
  }

  if (isBefore(nextAuthExpireDateToNumber, remoteBackendExpireDateToNumber)) {
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
