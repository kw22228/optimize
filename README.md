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

### 코드 분할 & 지연 로딩

- chunk.js의 코드를 보기위해 wabpack-bundle-analyzer로 확인한다. (cra프로젝트인 경우 cra-bundle-analyzer로 webpack overriding없이 확인 가능)
  react-syntax-highlighter 모듈이 크기가 큼 (refractor를 사용하기 때문)
  마크다운을 필요로하는 모듈은 상세 페이지에서만 필요하지 목록 페이지에서는 react-syntax-highlighter를 다운할 필요가없다.

- 코드분할 이란?

  - 하나의 번들 파일을 여러개의 파일로 쪼개는 방법 (코드를 분리하여 해당 코드가 필요하는 시점에만 로드 시킴. -> 지연로딩)
  - 예) bundle.js(ListPage, ViewPage) --> ListPage.Chunk.js(ListPage), ViewPage.chunk.js(ViewPage)
  - 페이지별로 코드를 분할할 수도 있지만, 모듈이 많고 사이즈가 큰경우 모듈별로 분할 할 수 도있음. (불필요한 코드 또는 중복되는 코드 없이 적절한 사이즈의 코드가 적절한 타이밍에 로드되도록 하자 !!)

- 적용하기

  1. 동적 import

  ```javascript
  //원래 import
  import { add } from './math';
  console.log(`1 + 4 =`, add(1, 4));

  //동적 import
  import('add').then(module => {
    const { add } = modlue;
    console.log('1 + 4 =', add(1, 4));
  });
  ```

  1-1. React에서의 컴포넌트 동적 import(lazy, suspense)

  ```javascript
  import React, { Suspense } from 'react';

  const SomeComponent = React.lazy(() => import('./SomeComponent));

  function MyComponent() {
      return (
          <div>
            <Suspense fallback={<div>Loading...</div>}>
                <SomeComponent />
            </Suspense>
          </div>
      );
  }
  ```

  - lazy로 동적 import후 Suspense로 감싸지않으면 error가 나옴. (React18에서도 똑같이 동작할지는 잘모르겟다... 알아봐야할듯!?)

### 텍스트 압축

- production환경일 때는 webpack에서 경량화라든지 난독화같은 추가적인 최적화 작업을 진행한다.
- 따라서, production환경으로 빌드된 서비스의 성능이 더 뛰어나다.

---

### 애니메이션 최적화

- 일단 브라우저 렌더링 과정을 알아야한다.

  - DOM + CSSOM -> 렌더 트리 -> 레이아웃 -> 페인트 -> 컴포지트 (이러한 작업을 픽셀 파이프라인 작업이라고함.)

  1. DOM + CSSOM

  - HTML파일과 CSS등 화면을 그리는데 필요한 리소스를 다운로드한다.
  - 다운로드한 HTML을 브라우저가 이해할 수 있는 형태로 변환하는 파싱 과정을 거친다. (DOM트리 생성)
  - 마찬가지로 CSS도 브라우저가 이해할 수 있는 형태로 변환. (CSSOM트리 생성)

  2. 렌더 트리

  - DOM트리와 CSSOM의 결합으로 생성된다.
  - 화면에 표시되는 각 요소의 레이아웃을 계산하는데 사용한다. (display:none으로 설정되어 화면에 표시되지 않는 요소는 렌더트리에 포함하지 않는다.)

  3. 레이아웃

  - 화면 구성 요소의 위치나 크기를 계산하고, 해당 위치에 요소를 배치하는 작업을 한다. (말 그대로 화면의 레이아웃을 잡는 과정.)

  4. 페인트

  - 레이아웃단계에서 화면에 요소의 위치와 크기를 잡아 놨으니, 색을 입힐 단계이다. (배경색, 글자색, 테두리색 등등..)
  - 브라우저는 효율적인 페인트 과정을 위해서 구성 요소를 여러 개의 레이어로 나눠서 작업하기도 한다.

  5. 컴포지트

  - 각 레이어를 합성하는 작업을 한다. 페인트 단계에서 설명한 것 처럼 브라우저는 화면을 그릴 때 여러개의 레이어로 화면을 쪼개서 그린다. 그 쪼개진 화면을 하나로 합치는 과정이다.

- Performance의 렌더링 과정

  - 회색 세로선: 브라우저는 1초에 화면을 60번그림. 이 선이 바로 화면을 그리는 시점이다.

- 리플로우와 리페인트

  - 화면이 모두 그려진 후, 자바스크립트로인해 화면 내 요소의 너비와 높이가 변경되었다면, 브라우저는 해당 요소의 가로와 세로를 다시 계산하여 화면을 새로 그린다.

  - transform, opacity같은 속성을 이용하면 작업을 GUP에 위임하여 처리하기때문에 레이아웃과 페인트를 건너뛸수있다.

- 하드웨어 가속(GPU가속)
  - GPU는 그래픽스를 처리하는데 필요한 연산을 CPU보다 훨씬 빠른속도로 처리할 수 있다.
  - transform, opacity같은 속성이 이 GPU로 작업을 할 수 있게 해준다.

---

### 컴포넌트 지연로딩
