# optimize

### 이미지 사이즈 최적화

1.  실제 DOM에 렌더링되는 사이즈의 2배정도의 크기의 이미지를 사용하는 것이 좋다. (120x120 이라면 240x240)

- api를 통해 받아오는 이미지라면 어떻게 해야할까?
  - Cloudinary나 imgix같은 이미지CDN을 사용하여 쿼리스트링으로 이미지의 사이즈를 정해서 가져옴.
  - http://cdn.image.com?src=[img_src]&width=240&height=240
    ex) https://images.unsplash.com/photo-1542435503-956c469947f6?width=240&height=240

### 병목 코드 최적화

1. View Original Trace를 눌러 Performance 패널로 이동

2. 직접 Performance 패널로 찾아들어감.

   - 상태를 조금 더 상세히 보기위해 네트워크 설정 Fast 3G로 제한

   2-1. CPU 차트, 네트워크 차트, 스크린샷

   - 색깔
     - 노란색 : 자바스크립트 실행 작업
     - 보라색 : 랜더링/레이아웃 작업
     - 초록색 : 페인팅 작업
     - 회색 : 기타 시스템 작업

   2-2. 네트워크 타입라인

   - 왼쪽 회색 선 : 초기 연결 시간
   - 막대의 옅은 색 영역 : 요청을 보낸 시점부터 응답을 기다리는 시점까지의 시간(TTFB, Time to First Btye)
   - 막대의 짙은 색 영역 : 콘텐츠 다운로드 시간
   - 오른쪽 회색 선 : 해당 요청에 대한 메인 스레드의 작업 시간

   2-3. Frames, Timings, Main

   - Frames 섹션 : 화면 변화가 있을 때마다 스크린샷을 찍어줌
   - Timings 섹션 : User Timing Api를 통해 기록된 정보를 기록.
   - Main 섹션 : 브라우저의 메인 스레드에서 실행되는 작업을 플레임 차트로 보여줌. (이를 통해 오래걸리는 작업 파악 가능)

   2-4. 하단 탭
   Summary, Bottom-up, Call Tree, Event log 등 선택된 영역의 상세내용 확인가능

   - Summary : 발생한 작엄 시간의 총합과 각 작업이 차지하는 비중.
   - Bottom-up : 가장 최하위에 있는 작업부터 상위 작업까지 역순으로 보여줌.
   - Call Tree : Bottom up의 반대, 가장 상위 작업에서 하위 작업 순으로 내용을 Tree view로 보여줌.
   - Event log : Loading, Experience Scripting, Rendering, Painting등을 보여줌
