# Coding & Architecture Conventions (.agent/CONVENTION.md)

이 문서는 AI 개발팀이 자율적으로 고품질의 플랫폼을 구현하기 위해 준수해야 하는 백엔드/프론트엔드 코딩 스타일, 데이터베이스 네이밍 표준, 그리고 확장성 높은 도메인형 패키지 구조 기반의 계층형 아키텍처 규칙을 정의합니다.

---

## 1. 백엔드 코딩 규칙 (Backend Coding Rules - Java 21)

### A. Java 21 모던 기능 활용
- **Record 사용**: DTO(Data Transfer Object)와 단순 데이터 레코드 표현식은 Java `record`를 최우선적으로 사용하여 불변성(Immutability)과 가독성을 확보합니다.
- **Pattern Matching & Switch Expressions**: 타입 판별이나 상태 체크 시 향상된 switch 문을 활용하여 간결하고 안전한 매칭 로직을 구현합니다.
- **var 키워드**: 지역 변수 선언 시 타입 선언의 중복을 막고 가독성을 높이기 위해 `var`를 제한적으로 사용합니다. 단, 가독성이 흐려질 우려가 있는 복잡한 반환 타입 등은 명시적 타입을 적어줍니다.

### B. Lombok 사용 표준
- **의존성 주입**: 필드 주입(`@Autowired`)을 금지하고, 모든 Bean 의존성은 `private final` 필드로 선언한 후 `@RequiredArgsConstructor`를 사용하여 생성자 주입 방식으로 구성합니다.
- **Entity 클래스 규칙**: Entity에는 절대 `@Data`나 `@AllArgsConstructor`를 남발하지 않습니다. 순순한 getter와 필요 최소한의 setter만 사용하기 위해 `@Getter`와 `@Setter`를 명시하며, 무분별한 객체 생성을 막기 위해 `@NoArgsConstructor(access = AccessLevel.PROTECTED)`를 지정합니다. 생성은 `@Builder` 패턴이나 전용 정적 팩토리 메서드를 사용합니다.

### C. 전역 예외 처리 & 응답 규격
- **@RestControllerAdvice**: 모든 API 예외는 전역 예외 처리 핸들러를 통해 일관된 JSON 응답으로 가공하여 반환합니다.
- **일관된 ApiResponse**: 성공 및 실패 응답은 일정한 규격을 따릅니다.
  ```json
  {
    "status": "success",
    "data": { ... },
    "message": "성공 메시지"
  }
  ```

---

## 2. 계층형 및 도메인형 아키텍처 규칙 (Layered & Domain-driven Architecture)

기능의 추가나 변경(예: 한국투자증권 API / MCP 서버 통합)에 유연하게 대처할 수 있도록 기술 계층이 아닌 **업무 도메인(Domain)을 기준**으로 패키지를 분리하고, 그 내부에서 기술적 계층형 아키텍처 규칙을 유지해야 합니다.

```
com.jh.app.
├── config/             # 전역 보안 및 공통 설정 (JWT, Security, CORS 등)
├── member/             # 회원 도메인
│   ├── MemberController.java
│   ├── MemberService.java
│   ├── MemberRepository.java
│   ├── MemberDTO.java  # Entity
│   └── MemberRecord.java # DTO (Java 21 Record)
├── board/              # 자유게시판 및 댓글 도메인
│   ├── FreeBoardController.java
│   ├── FreeBoardService.java
│   ├── FreeBoardRepository.java
│   ├── FreeBoard.java  # Entity
│   ├── Comment.java    # Entity
│   └── CommentRepository.java
├── notice/             # 공지사항 도메인
│   ├── NoticeController.java
│   ├── NoticeService.java
│   ├── NoticeRepository.java
│   └── NoticeDTO.java  # Entity
└── stock/              # 주식 정보 도메인
    ├── StockController.java
    ├── StockService.java # Interface (느슨한 결합 제공)
    ├── MockStockServiceImpl.java # 기본 mock 구현체
    ├── StockRepository.java
    ├── Stock.java      # Entity
    └── StockHistory.java # Entity
```

### A. Presentation Layer (Controller)
- **책임**: HTTP 요청 수신, 입력 검증(`@Valid`), HTTP 응답 상태 코드 반환 및 DTO 매핑.
- **패키지 위치**: 개별 도메인 패키지 내부의 최상단에 배치합니다. (예: `com.jh.app.member.MemberController`)

### B. Business Layer (Service & ServiceImpl)
- **책임**: 도메인 핵심 비즈니스 로직, 트랜잭션 범위 지정(`@Transactional`).
- **인터페이스 분리 필수**: 
  - 외부 연동이나 비즈니스 로직의 교체가 잦은 서비스(예: `StockService`)는 반드시 인터페이스로 정의합니다.
  - 해당 인터페이스의 기본 구현체로 `MockStockServiceImpl` 등을 주입하고, 향후 실제 연동이 필요할 때 새로운 구현체인 `KoreaInvestmentStockServiceImpl`을 만들어 스프링 빈(`@Primary` 혹은 `@Qualifier`)으로 갈아끼우는 방식으로 느슨한 결합(Loose Coupling)을 보장합니다.

### C. Persistence Layer (Repository)
- **책임**: Spring Data JPA를 기반으로 데이터베이스 직접 접근.
- **규칙**: 인프라 종속성을 비즈니스 로직 레이어와 철저히 차단합니다. (예: `com.jh.app.board.FreeBoardRepository`)

### D. 도메인 분리 규칙 (Entity vs DTO)
- 데이터베이스 테이블과 직접 연결된 Entity 객체는 Presentation Layer(Controller)까지 전달되지 않고 Service Layer 내부에서 소멸해야 합니다.
- 외부와 주고받는 모든 데이터 포맷은 DTO(또는 Record)를 이용해 캡슐화하며, 이 역시 동일 도메인 패키지 내부에서 격리합니다.

---

## 3. 데이터베이스 네이밍 스타일 (Database Naming Standards - PostgreSQL)

PostgreSQL의 특성을 감안해 하이픈이나 대소문자 구분의 부작용을 원천 배제하는 **소문자+스네이크 케이스(snake_case)** 규칙을 철저히 준수합니다.

- **테이블 명**: `tb_` 접두사를 붙여 명명합니다. (예: `tb_users`, `tb_free_boards`, `tb_board_comments`, `tb_stocks`)
- **컬럼 명**: 소문자 스네이크 케이스를 준수합니다. (예: `created_at`, `member_id`, `change_rate`)
- **기본키(PK) 명**: `id` 혹은 `테이블명_id` 규칙을 사용합니다.
- **외래키(FK) 명**: `fk_참조테이블_피참조테이블` 형식으로 생성하고, 관계 매핑 시 확실히 식별할 수 있는 인덱스를 지정합니다.

---

## 4. 프론트엔드 코딩 규칙 (Frontend Coding Rules - React & TailwindCSS v3)

### A. React 설계 원칙
- **함수형 컴포넌트**: 모든 컴포넌트는 함수형 컴포넌트(`const MyComponent = () => {}`)로 작성하며, React Hooks를 활용해 상태를 다룹니다.
- **Fetch API 추상화**: 백엔드 API와의 통신을 단순 `fetch`로 직접 호출하기보다, 토큰 만료 처리 및 공통 헤더(`Authorization: Bearer <token>`) 주입 로직이 추상화된 공통 fetch 유틸리티 클래스(`/utils/api.js`)를 구현해 자율적으로 호출합니다.
- **경로 관리**: React Router v6의 정의대로 상위 Layout 내 `<Outlet />` 구조를 완벽하게 유지합니다.

### B. TailwindCSS v3 스타일링 원칙
- **유틸리티 결합**: CSS 파일에 원시 코드를 과도하게 넣는 대신 Tailwind의 마크업 내 유틸리티 클래스를 최우선시합니다.
- **클래스 순서 규칙**: Tailwind 클래스는 레이아웃(flex, grid) -> 크기/여백(w, h, p, m) -> 폰트/색상(text, bg) -> 보더 및 효과(border, rounded, shadow) -> 호버/포커스 순으로 구성하여 가독성을 일관되게 유지합니다.
- **디자인 토큰**: `tailwind.config.js`에 설정된 Toss 프리미엄 포인트 컬러(`bg-toss-blue`, `text-toss-blue`) 및 간결한 라운드 설정(`rounded-toss`) 등을 통일성 있게 사용합니다.

---

## 5. 민감정보 및 환경설정 관리 규칙 (Secrets & Configuration Management)

데이터베이스 자격 증명, 보안 키, 외부 API 액세스 토큰 등 보안에 유의해야 하는 정보는 원천적인 유출을 차단하도록 엄격하게 관리합니다.

- **원천 격리**: 모든 민감 정보는 절대 소스코드 내부에 하드코딩하지 않으며, 오직 루트 경로의 `.env` 파일에 기록하여 관리합니다.
- **Git 커밋 완전 금지**: `.env` 파일은 물리적으로 반드시 `.gitignore`에 등록되어 로컬 환경 밖으로 유출되는 것을 차단합니다.
- **백엔드 바인딩**: `application.properties`는 자격 증명을 직접 작성하는 대신 `${DB_URL}`, `${DB_USERNAME}`, `${DB_PASSWORD}` 등 시스템 환경 변수를 로드하도록 구성하고, 개발 시 `.env` 환경 변수가 빌드 툴 또는 IDE 실행 환경에 세팅되도록 설정합니다.
- **프론트엔드 바인딩**: Vite 환경의 특성에 따라 클라이언트 단에서 환경 변수를 노출해야 하는 경우 반드시 `VITE_` 접두사를 붙여 선언하며, 중요 보안 토큰(예: GitHub Access Token 등)은 보안 유지를 위해 브라우저에 직접 노출하지 않고 백엔드 API Gateway 역할을 통해 통제합니다.
- **MCP 서버 및 외부 도구 연동 (config.json)**:
  - GitHub MCP 서버 연동을 위한 설정은 루트 경로의 `config.json`에서 관리합니다.
  - 보안 유지를 위해 물리적 토큰값을 `config.json`에 하드코딩하는 대신, `config.json` 내 `"GITHUB_PERSONAL_ACCESS_TOKEN": "${GITHUB_ACCESS_TOKEN}"`과 같이 선언하며, 실제 보안 토큰값은 루트 경로의 `.env` 파일 내 `GITHUB_ACCESS_TOKEN` 변수에서 안전하게 동적 바인딩해 로드합니다.

