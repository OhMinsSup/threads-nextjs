export enum HttpStatus {
  OK = 1, // 성공
  FAIL = 0, // 실패
  INCORRECT_PASSWORD = 4004, // 잘못된 패스워드
  NOT_EXIST = 2001, // 존재하지 않음
  DELETED = 2002, // 삭제됨
  ALREADY_EXIST = 2003, // 이미 존재함
  INVALID = 2004, // 유효하지 않음
  CANNOT_BE_LOGIN = 5000, // 로그인 할 수 없음
  LOGIN_REQUIRED = 5001, // 로그인이 필요함
}
