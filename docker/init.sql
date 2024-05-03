CREATE DATABASE templatedb
  LC_COLLATE 'C'
  LC_CTYPE 'C'
  ENCODING 'UTF8'
  TEMPLATE template0;

CREATE USER template WITH ENCRYPTED PASSWORD 'templatepw';

-- 유저에게 데이터베이스 접근 권한 부여
GRANT ALL ON DATABASE templatedb to nouvelles;
-- 유저에게 스키마 접근 권한 부여
GRANT ALL ON SCHEMA public TO template;

-- 유저에게 데이터베이스 생성 권한 부여
ALTER USER template CREATEDB;

-- 타임존 설정
ALTER DATABASE templatedb SET timezone TO 'Asia/Seoul';

\c templatedb