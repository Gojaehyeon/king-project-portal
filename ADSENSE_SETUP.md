# AdSense / AdMob 셋업 절차서

이 문서는 `king.gojaehyun.com`을 통해 AdSense를, 각 iOS 앱을 통해 AdMob을 활성화하기 위해 **사용자가 직접 수행해야 하는 단계**를 정리합니다. 코드/페이지/광고 인프라는 이미 모두 준비되어 있습니다.

## 0. 진행 전 확인사항 (이미 완료된 것)

포털에 다음이 자동으로 추가되었습니다.

- `/privacy` 개인정보처리방침
- `/terms` 이용약관
- `/about` 소개 페이지
- `/contact` 연락처 페이지
- `/blog` 블로그 인덱스 + 시드 글 3편 (`/blog/[slug]`)
- `/robots.txt`, `/sitemap.xml` 자동 생성
- `/ads.txt` 라우트 (Publisher ID 환경변수 연동)
- 모든 페이지 공통 푸터 (법인 정보 + 법적 페이지 링크)
- 루트 layout에 AdSense 스크립트 슬롯 (환경변수 주입 시 자동 적용)

블로그 글은 `src/data/posts.json`을 편집하면 추가됩니다. 블로그 글 10개 이상 채워 두면 승인 확률이 크게 올라갑니다.

---

## 1. 법인 명의 Google 계정 (10분)

새 Google 계정을 만들거나, 기존 사업 메일을 사용해도 됩니다.

1. https://accounts.google.com/signup 에서 계정 생성
2. 비즈니스 계정 옵션 선택
3. 이메일은 회사 도메인(예: `ads@gojaehyun.com`) 또는 `tntlabgo+ads@gmail.com` 같은 alias 권장
4. 2단계 인증 활성화

---

## 2. AdSense 신청 (15분 + 승인 대기 1~2주)

1. https://www.google.com/adsense 접속, 법인 Google 계정으로 로그인
2. **계정 정보 입력**
   - 국가: 대한민국
   - 시간대: (UTC+09:00) 서울
   - 결제 유형: **사업자 (Business)**
   - 이름: `티엔티랩스` (사업자등록증상 상호와 정확히 일치)
   - 주소: 사업자등록증상 주소
   - 전화: 사업자 등록 전화
3. **사이트 추가**
   - URL: `king.gojaehyun.com`
4. **사이트 인증 코드 받기** → "사이트와 AdSense 연결" 화면에서 두 가지 방법 중 하나 선택:
   - **방법 A (권장): 메타 태그** — 이 코드를 복사
     ```
     <meta name="google-adsense-account" content="ca-pub-XXXXXXXXXXXXXXXX">
     ```
     `ca-pub-...` 값만 추출해 다음 단계 환경변수에 입력하면 자동 삽입됩니다.
   - 방법 B: ads.txt 추가 → 이미 라우트로 준비되어 있어 환경변수만 넣으면 됩니다.
5. **Vercel 환경변수 등록**
   - Vercel 프로젝트 대시보드 → Settings → Environment Variables
   - `NEXT_PUBLIC_ADSENSE_CLIENT_ID` = `ca-pub-XXXXXXXXXXXXXXXX`
   - `NEXT_PUBLIC_SITE_URL` = `https://king.gojaehyun.com`
   - Production, Preview, Development 모두 체크
6. **재배포** — Vercel 대시보드에서 "Redeploy" 또는 main 브랜치에 빈 커밋 푸시
7. **검증** (재배포 후)
   - 브라우저로 `https://king.gojaehyun.com/ads.txt` 접속 → `google.com, pub-XXXX, DIRECT, f08c47fec0942fa0` 한 줄이 나와야 함
   - 페이지 소스에 `<meta name="google-adsense-account" ...>` 가 있는지 확인
   - 페이지 하단에 `pagead2.googlesyndication.com/pagead/js/adsbygoogle.js` 스크립트가 로드되는지 확인
8. **AdSense 콘솔로 돌아가서 "검토 요청"** 클릭
9. 1~2주 대기. 결과는 등록 메일로 옵니다.

---

## 3. 승인 후 광고 단위 만들기 (10분)

승인 메일 받은 후 진행합니다.

1. AdSense 콘솔 → 광고 → 자동 광고 → **사이트별 자동 광고 켜기** (가장 쉬운 방법)
2. 또는 수동 광고 단위 생성:
   - 광고 → 광고 단위 → "디스플레이 광고" 만들기
   - 광고 단위 코드를 받아 React 컴포넌트로 만들어 원하는 위치에 삽입
   - 필요 시 알려주시면 컴포넌트 추가해 드리겠습니다

자동 광고를 켜면 별도 코드 변경 없이 즉시 광고가 노출됩니다. **첫 추천 셋업은 자동 광고입니다.**

---

## 4. vercel.app 도메인 5개 자체 도메인 이전

AdSense는 `*.vercel.app`에서 광고를 띄울 수 없습니다. 다음 5개 앱은 자체 도메인으로 옮겨야 합니다.

| 앱 | 현재 URL | 권장 새 URL |
|---|---|---|
| samplego | samplego.vercel.app | samplego.gojaehyun.com |
| handvox | handvox.vercel.app | handvox.gojaehyun.com |
| bang-zombie | bang-zombie.vercel.app | bang-zombie.gojaehyun.com |
| chamchamcham | chamchamcham.vercel.app | chamchamcham.gojaehyun.com |
| photomoto | photo4u.vercel.app | photomoto.gojaehyun.com |

**작업 절차 (각 앱당 2분):**

1. Vercel 프로젝트 → Settings → Domains → "Add Domain" → `<slug>.gojaehyun.com`
2. Vercel이 안내하는 CNAME(`cname.vercel-dns.com`) 레코드를 도메인 DNS에 추가
3. SSL 자동 발급 대기 (1~5분)
4. `src/data/apps.json`에서 해당 앱의 `demoUrl`을 새 URL로 수정 + 다음 커밋

이 작업은 AdSense 승인을 기다리는 1~2주 사이에 동시 진행하시면 시간을 아낄 수 있습니다.

---

## 5. AdMob 신청 (각 iOS 앱)

AdMob은 AdSense와 별개입니다. 같은 Google 계정 하나로 둘 다 운영 가능합니다.

1. https://apps.admob.com 접속, 동일 법인 Google 계정으로 로그인
2. 약관 동의 + 세금 정보 입력 (한국 법인은 사업자등록번호)
3. **앱 추가**
   - "앱 추가" 클릭
   - 이미 App Store에 출시된 앱이면 검색해서 자동 연결
   - 미출시 앱이면 "App Store에 게시되지 않음" 선택 → App ID 수동 입력
4. **광고 단위 만들기**
   - 배너, 전면, 보상형, 네이티브 중 선택
   - 시작 권장: **배너 + 전면**
5. **AdMob App ID 받기** → 각 iOS 프로젝트의 `Info.plist`에 추가
   - 키: `GADApplicationIdentifier`
   - 값: 발급받은 App ID
6. **Google Mobile Ads SDK 통합**
   - Swift Package Manager: `https://github.com/googleads/swift-package-manager-google-mobile-ads`
   - 각 앱별 Xcode 프로젝트에서 추가
7. App Store Connect의 앱 정보에 "광고 식별자(IDFA) 사용" 체크

각 iOS 앱 SDK 통합 작업은 앱 하나씩 별도로 요청해 주시면 코드 작업까지 진행해 드리겠습니다.

---

## 6. 지급 정보 (승인 후 / 누적 $100 이상 시)

- AdSense/AdMob 콘솔 → 결제 → 지급 방법 추가
- 한국 법인은 **은행 송금(SWIFT)** 또는 **외환은행 외화통장** 권장
- 사업자등록번호와 법인 명의 통장 일치해야 함
- 첫 지급 임계값은 $100. 도달 시 매월 21일경 자동 송금

---

## 체크리스트

```
[ ] 법인 명의 Google 계정 생성
[ ] AdSense 신청 (king.gojaehyun.com)
[ ] Vercel에 NEXT_PUBLIC_ADSENSE_CLIENT_ID 환경변수 등록
[ ] 재배포 후 /ads.txt와 head 메타 태그 확인
[ ] AdSense "검토 요청" 버튼 클릭
[ ] vercel.app 도메인 5개 → gojaehyun.com 서브도메인 이전
[ ] (승인 후) 자동 광고 ON
[ ] AdMob 가입 + 법인 세금 정보
[ ] iOS 앱별 AdMob App ID 발급 + SDK 통합
[ ] 지급 정보 등록
```

진행 중 막히는 단계가 있으면 그 단계만 알려주시면 됩니다.
