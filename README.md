# 팀 경비 정산·승인 시스템

Node.js 기반 백엔드의 기본 구조와 데이터베이스 연동 과정을 직접 경험하기 위한 **백엔드 학습 프로젝트**입니다.

사용자가 경비를 신청하고, 이후 승인 또는 반려할 수 있는 간단한 정산 시스템을 구현합니다.

완성된 서비스를 빠르게 만드는 것보다 **HTTP 요청부터 서버 로직, SQL 실행, 데이터베이스 처리, 응답까지 이어지는 백엔드 전체 흐름을 직접 이해하는 것**을 우선합니다.

초기에는 ORM이나 높은 수준의 프레임워크에 의존하지 않고 SQL과 DB 연결을 직접 경험한 뒤, 이후 ORM이나 구조화된 프레임워크를 사용할 때 어떤 부분을 대신 처리해주는지 비교하는 방향으로 학습합니다.

---

## 1. 시작 배경

프론트엔드 개발자로 근무하던 중 회사에서 **Node.js 기반 백엔드 업무로 전환될 가능성**이 생기면서 백엔드 학습을 시작했습니다.

JavaScript를 이용한 프론트엔드 개발 경험은 있었지만 백엔드 실무 경험은 없었기 때문에, 새로운 언어까지 동시에 학습하기보다 기존 JavaScript 경험을 활용해 먼저 백엔드 전체 흐름을 한 번 경험하는 것을 목표로 잡았습니다.

```text
Client
  ↓
HTTP Request
  ↓
API Server
  ↓
Business Logic
  ↓
SQL
  ↓
Database
  ↓
HTTP Response
  ↓
Client
```

실제 전환 가능성이 있었던 팀에서 Node.js를 사용하고 있었기 때문에, 가능한 한 해당 업무 환경과 가까운 기술 스택으로 학습하는 방향을 선택했습니다.

---

## 2. 학습 목표

이 프로젝트를 통해 다음 내용을 직접 구현하고 이해하는 것을 목표로 합니다.

* Node.js 기반 서버 애플리케이션의 기본 구조
* HTTP Request / Response
* REST API 설계
* Express를 이용한 라우팅과 요청 처리
* PostgreSQL과 애플리케이션 연결
* SQL을 이용한 데이터 생성·조회·수정
* 관계형 데이터베이스와 데이터 무결성
* DB Migration
* 정렬과 페이지네이션
* 상태 변화가 있는 비즈니스 로직
* 트랜잭션
* 인증과 인가

---

## 3. 기술 스택

| 구분             | 기술         |
| -------------- | ---------- |
| Language       | TypeScript |
| Runtime        | Node.js 22 |
| Web Framework  | Express 5  |
| Database       | PostgreSQL |
| DB Driver      | pg         |
| DB Environment | Docker     |

---

## 4. 기술 선택 이유

### Node.js 22

백엔드 학습을 시작한 직접적인 계기는 회사에서 **Node.js 기반 백엔드 업무로 전환될 가능성**이 생겼기 때문입니다.

실제 업무 환경과 가까운 기술을 사용해 학습하기 위해 Node.js를 선택했으며, JavaScript가 가장 익숙한 언어이기 때문에 새로운 언어를 배우는 데 필요한 학습 비용을 줄이고 HTTP, API, DB, SQL 등 백엔드 자체의 개념에 집중할 수 있다는 점도 고려했습니다.

정확한 팀의 Node.js 버전까지 확인한 것은 아니지만, 제품 개발 시기 등을 기준으로 Node.js 22 계열을 사용하고 있을 가능성이 있다고 추정하여 학습 환경을 Node.js 22로 구성했습니다.

따라서 Node.js 22는 다른 버전보다 기술적으로 우수해서 선택한 것이 아니라, **실제 업무 환경과 유사한 환경을 가정한 학습 목적의 선택**입니다.

새 프로젝트의 Node.js 버전을 직접 결정해야 한다면 특별한 환경 제약이 없는 경우 현재 지원 중인 Active LTS를 우선 검토하고, 회사 표준·배포 환경·라이브러리 호환성 등의 제약이 있다면 다른 지원 버전을 검토합니다.

---

### TypeScript

JavaScript를 그대로 사용하는 것도 후보였지만, 기존 JavaScript 경험을 활용하면서 요청 데이터, 함수의 입력과 출력, DB 조회 결과 등의 구조를 타입으로 명확하게 표현하는 경험을 하기 위해 TypeScript를 선택했습니다.

이번 프로젝트에서는 TypeScript 자체를 깊게 학습하는 것보다 **백엔드 코드에서 타입을 사용하고 데이터 구조를 명확하게 관리하는 경험**을 우선합니다.

---

### Express 5

Node.js의 기본 `http` 모듈, Express, Fastify, NestJS 등을 후보로 볼 수 있었습니다.

Node.js의 기본 HTTP 기능만 사용하면 라우팅과 요청 처리를 직접 구현해야 하는 부분이 많아지고, NestJS를 사용하면 첫 백엔드 프로젝트에서 Controller, Service, Module, Dependency Injection 등 프레임워크 자체의 구조를 먼저 학습해야 할 수 있습니다.

Express는 Node.js의 HTTP 기능을 직접 사용하는 것보다 API를 쉽게 구현할 수 있으면서도 많은 구조를 미리 강제하지 않아,

```text
Request
↓
Route
↓
Server Logic
↓
Database
↓
Response
```

의 기본 흐름을 직접 확인하기에 적합하다고 판단했습니다.

---

### PostgreSQL

MySQL, MariaDB, SQLite 등을 함께 후보로 볼 수 있었습니다.

SQLite는 별도의 DB 서버 없이 간단하게 사용할 수 있지만, 이번 프로젝트에서는 애플리케이션과 별도의 데이터베이스 서버가 연결되는 구조까지 경험하고 싶어 제외했습니다.

MySQL과 PostgreSQL 모두 관계형 데이터베이스의 기본기를 학습하기에 충분하지만, PostgreSQL이 **표준 SQL을 비교적 충실하게 따르고 데이터 타입과 SQL 기능이 풍부한 편**이기 때문에 학습 과정에서 여러 데이터베이스 기능을 직접 경험하기에 적합하다고 판단했습니다.

PostgreSQL이 MySQL보다 항상 우수해서 선택한 것이 아니라, 이번 학습 프로젝트의 목적에 더 잘 맞는 쪽을 선택한 것입니다.

---

### pg / ORM 미사용

Prisma, TypeORM, Sequelize 등의 ORM을 사용하는 방법도 있었지만 첫 백엔드 프로젝트에서는 ORM이 SQL과 DB 접근 과정을 대신 처리하도록 하지 않았습니다.

`pg`를 사용해 직접 SQL을 작성하면서,

```text
TypeScript
↓
pg
↓
pool.query()
↓
SQL
↓
PostgreSQL
```

로 이어지는 과정을 경험하는 것을 우선합니다.

SQL과 DB 연결 방식을 충분히 경험한 뒤 ORM을 사용하면, 이전에 직접 구현했던 작업을 ORM이 어떻게 대신 처리하는지 비교할 수 있다고 판단했습니다.

---

### Docker

PostgreSQL을 로컬 운영체제에 직접 설치하는 방법도 있었지만, DB 환경을 로컬 환경과 분리하고 동일한 설정으로 다시 구성할 수 있는 개발 환경을 경험하기 위해 Docker를 사용했습니다.

현재 프로젝트에서는 Docker 자체를 깊게 학습하기보다 **PostgreSQL 실행 환경을 관리하는 도구**로 사용하는 데 집중합니다.

---

## 5. 진행 상황

```text
[x] 프로젝트 초기 설정
[x] TypeScript 설정
[x] Express 서버 구성
[x] GET /health 구현

[x] Docker PostgreSQL 환경 구성
[x] PostgreSQL 연결
[x] expenses 테이블 Migration 작성

[x] 경비 신청 API 기본 구현
[x] INSERT 학습
[x] RETURNING 학습

[x] 경비 목록 조회 SQL 학습
[x] ORDER BY 학습
[x] LIMIT / OFFSET 학습

[ ] pool.query 사용 숙련
[ ] 경비 목록 조회 API 마무리

[ ] 승인 API
[ ] 반려 API
[ ] 입력 검증
[ ] 상태 전이 규칙
[ ] Transaction
[ ] 인증
[ ] 인가
```
