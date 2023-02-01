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

- Raect.lazy 와 React.Suspense를 이용해 동적 import를 하여 코드 스플리팅을 하자!

### 컴포넌트 사전로딩

- 컴포넌트 지연로딩의 문제점

  - 지연로딩은 초기 렌더링은 더빠를수있다 (번들 파일에서 분리되기 때문에.)
    하지만 모달같은걸 띄울때 클릭하는시점에 네트워크와 통신하여 새로운 파일을 로드하고 평가 후 열리기 떄문에 시간이 오래걸린다.

- 사전로딩 하는 타이밍

  1. 유저가 버튼 위에 마우스를 올려놨을때.
     - mouseEnter를 통한 동적 import
  2. 최초에 페이지가 로드되고 모든 컴포넌트들의 마운트가 끝났을 때.
     - useEffect를 통한 동적 import

### 이미지 사전 로딩

- 이미지가 화면에 제때 뜰 수 있도록 미리 다운로드하는 이미지 사전로딩 기법

1. Image 객체를 가지고 사전 로딩하기

```javascript
const img = new Image();
img.src =
  'https://stillmed.olympic.org/media/Photos/2016/08/20/part-1/20-08-2016-Football-Men-01.jpg?interpolation=lanczos-none&resize=*:800';
// 이순간 브라우저는 해당 url의 이미지를 다운로드 받는다.
```

- 모달의 가장 첫번째 이미지를 미리 사전로딩 해놓는다.
  (몇개의 리소스를 사전 로딩 해놓냐는 고민을 해야한다. 왜냐하면, 사전로딩을 하는건 그만큼 브라우저의 리소스를 많이 사용하는 것이기 때문에 성능 문제를 야기할 수 있다.)

---

### 이미지 지연 로딩

    - intersection observer
        - 브라우저에서 제공하는 API. 페이지 스크롤시, 해당 요소가 화면에 들어왔는지 아닌지 알려준다. 즉, 스크롤할 때마다 함수를 호출하는 것이 아닌 요소가 화면에 들어왔을 때만 호출한다. (addEventLisener scroll 보다 최적화좋음)
        - entries 배열안에 isIntersecting이 true일때, 뷰포트에 들어온것이고 false일때 나간것이다.
        - 주의점. IntersectionObserver 인스턴스를 한개만 생성하기 위해서 useEffect안에서 생성해줘야한다.

### 이미지 사이즈 최적화

    - 이미지 사이즈가 크면 파일 사이즈가 커지고, 다운로드에 많은 시간이 걸린다. 따라서 그만큼 오래걸려 다른 작업에 영향을 준다.

    - 이미지 포맷
        - PNG : 무손실 압축 방식으로 원본을 훼손없이 압축할 수 있고, 알파채널을 지원한다.
                알파채널이란? 투명도를 말한다. PNG포맷으로 배경색을 투명하게하여 뒤에있는 요소가 보이는 이미지를 만들 수 있다.

        - JPG : 압축 과정에서 정보 손실이 발생한다. 그만큼 더 작은 사이즈로 변환 가능.

        - WebP : 무손실 압축과 손실 압축을 모두 제공하는 최신 이미지 포맷.
                 기존의 PNG와 JPG에 비해 더 효율적인 압축 가능.

    - 어떤 이미지 포맷을 사용해야 할까?
        - 사이즈 : PNG > JPG > WebP
        - 화질 : PNG === WebP > JPG
        - 호환성 : PNG === JPG > WebP

    - squoosh를 사용한 이미지 변환
        https://squoosh.app/

    - picture태그에 대해서.
        - 브라우저 사이즈에 따라 지정된 이미지를 렌더링함.
            ```html
            <!-- 뷰포트에 따른 구분 -->
            <picture>
                <source media="(min-width:650px)" srcset="img_pink_flowers.jpg">
                <source media="(min-width:465px)" srcset="img_white_flowers.jpg">
                <img src="img_orange_flowers.jpg" alt="Flowers" style="width:auto;">
            </picture>

            <!-- 이미지 포맷에 따른 구분 -->
            <picture>
                <source srcset="ph oto.avif" type="image/avif">
                <source srcset="photo.webp" type="image/webp">
                <img src="photo.jpg" alt="photo">
            </picture>
            ```
        - type="image/not-support"를 하면 브라우저에서 지원하지 않는 타입으로 설정된다.

### 동영상 최적화

    - 동영상은 이미지처럼 한번의 요청으로 모든것이 다운되지 않는다. (여러번의 요청을 통해 다운받음. Network탭 확인)

    - 동영상 압축
        - 이미지와 비슷하게 가로와 세로 사이즈를 줄이고 압축 방식을 변경하여 동영상의 용량을 줄인다.

    - 압축 적용
    ```javascript
    <video className="cls" autoPlay loop muted>
        <source src={video_webm} type="video/webm" />
        <source src={video} type="video/mp4" />
    </video>
    ```

    - 동영상 압축후 저화된 화질을 보완하는 방법.
        - 압축을 하면 사이즈가 작아져 최적화는 좋지만, 화질저하를 막을수없다.
          그러므로 패턴이나 필터를 넣어 저화된 화질을 보완해볼 수 있다.
          ex) filter: blur(10px)

### 폰트 최적화

- FOUT (Flash Of Unstyled Text)

  - 엣지 브라우저에서 폰트를 로드하는 방식.
  - 폰트의 다운로드 여부와 상관없이 먼저 텍스트를 보여준 후 폰트가 다운로드되면 그때 폰트를 적용함.

- FOIT (Flash Of Invisible Text)
  - 크롬, 사파리, 파이어폭스 등에서 폰트를 로드하는 방식.
  - 폰트가 완전히 다운로드되기 전까지 텍스트 자체를 보여 주지 않는다.
- 폰트 최적화 방법

  1. 폰트 적용시점 제어하기. (BannerViedo.js 참고)
     - CSS의 font-display속성 이용하기.
     - 옵션
       - auto: 브라우저 기본 동작
       - block: FOIT (timeout = 3s)
       - swap: FOUT
       - fallback: FOIT (timeout = 0.1s) 3초 후에도 불러오지 못하면 기본폰트로 유지.
       - optional: FOIT (timeout = 0.1s) 네트워크 상태에 따라 기본 폰트로할지 결정.
     - fontfaceobserver 라이브러리로 폰트의 다운로드 시점을 알 수 있음.
       이것을 이용하여 폰트다운로드 시점에 javascript로 폰트를 fade-in할 수 있음.

  ```css
  @font-face {
    font-family: BMYEONGSUNG;
    src: url('./assets/fonts/BMYEONSUNG.ttf');
    font-display: fallback;
  }
  ```

  2. 폰트 파일 크기 줄이기

     - 방법1. 이미지나 비디오처럼 압축률이 좋은 폰트 포맷을 사용하는것. (https://transfonter.org)

       - 파일 크기 EOT > TTF/OTF > WOFF > WOFF2 (WOFF파일이 용량은 적지만 브라우저 호환 문제가 있음.)

     - 방법2. 필요한 문자의 폰트만 로드하는 것. (서브셋)

       - 서브셋이란 ?
         - 모든 문자가 들어있는 폰트가 아닌 일부 문자의 폰트 정보만 가지고 있는 것을 서브셋이라고한다.
         - 예를들어 이 롱보드 사이트에서는 KEEP CALM AND RIDE LONGBOARD 문자만 가지고있는 것.
       - 이 서브셋 폰트는 Transfonter의 Charaters에 문자를 넣고 Convert하면된다.

     - 방법3. Data-URI로 변환하여 css파일에 직접 폰트 추가하기.
       - Transfonter의 Base64 encode부분을 체크한후에 WOFF2 파일을 변환한다.
       - Convert하고 css파일에 src 복붙

### 캐시 최적화

- 캐시란?

  - 자주 사용하는 데이터나 값을 미리 복사해둔 임시 저장공간 또는 저장하는 동작이다.
    웹에서는 이미지파일 또는 js파일 같은 리소스 파일을 최초에 한번만 다운받고 캐시에 저장해두고
    이후 요청시에는 다시 다운받지않고 캐시에 저장된파일을 가져다 사용한다.

- 캐시의 종류

  - 메모리 캐시: 메모리에 저장하는 방식 (여기서 메모리는 RAM) 익스텐션의 Network탭의 Size에 memory cache라고 적힘.
  - 디스크 캐시: 파일형태로 디스크에 저장하는 방식 (익스텐션의 Network탭의 Size에 disk cache라고 적힘.)
  - 이 두 캐시는 직접 제어할 수 없고, 브라우저가 특정 알고리즘에 의해 알아서 처리함.

- Cache-Control

  - 리소스의 응답 헤더에 설정되는 헤더이다. 브라우저는 서버에서 이헤더를 통해 캐시를 어떻게, 얼마나 할지 판단한다.

  - 옵션.

    - no-cache : 캐시를 사용하기전 서버에 검사 후 사용. (캐시를 사용하지 않는게 아니라 캐시 사용전에 서버에 캐시된 리소스를 사용해도 되는지 한번 체크한 후 사용한다.)
    - no-store : 캐시 사용 안함.
    - public : 모든환경에서 캐시 사용 가능.
    - private : 브라우저 환경에서만 캐시 사용가능. (외부 캐시 서버에서는 사용 불가.)
    - max-age: 캐시의 유효 시간

  - 옵션 추가 설명.

    - public 과 private은 max-age에 설정한 시간만큼은 서버에 사용유무를 체크하지않고 바로 사용한다.
      max-age의 유효시간이 지났다면, 서버에 캐시된 리소스를 사용하는지 다시 체크후 max-age시간만큼 다시 사용한다. (refresh token 같은 느낌?)
    - public과 private의 차이는 캐시 환경에 차이가 있다. 미들 캐시 서버에 캐시를 적용하고 싶지 않다면 private을 사용하면 된다.

  - 예시)

    - Cache-Control: max-age=60 => 모든 환경에서 60초(1분)동안 캐시를 사용한다.
    - Cache-Control: private, max-age=600 => 600초(10분)동안 브라우저에서만 캐시를 사용
    - Cache-Control: public, max-age=0 => 0초 동안 캐시사용 (캐시가 생성되자마자 만료되기에 매번 캐시를 사용해도 되는지 확인을 한다. 즉, no-cache랑 같은 설정이다.)

- 캐시된 리소스와 서버의 최신 리소스가 같은지 다른지 어떻게 체크할까?

  - 캐시가 만료되면 브라우저는 캐시 리소스를 계속 사용해도 되는지 체크한다.
    이때 서버는 캐시된 리소스의 응답 헤더에 있는 Etag값과 서버에 있는 최신 리소스의 Etag값을 비교하여 캐시된 리소스가 최신인지 아닌지 판단한다.
    만약 서버에있는 리소스가 변햇다면 Etag값이 달라지고, 서버는 새로운 Etag값과 함께 최신 리소스를 브라우저로 다시 보내준다.

- 적절한 캐시 유효 시간

  - 앞에서 적용한 Cache-Control은 모든 리소스에 동일한 캐시 설정이 적용되어있어 비효율적이다.
  - 일반적인 리소스 캐싱 주기

    - HTML : no-cache설정을 적용한다. 항상 최신버전의 웹서비스를 제공하기 위함.
      HTML이 캐시되면 이전 버전의 자바스크립트나 CSS를 로드하게 된다.
    - Javascript 또는 CSS : 빌드된 js나 css는 파일명에 해시를 함께 가지고있다.
      ex) main.bbaac28.chunk.js 즉, 코드가 변경되면 해시도 변경되어 완전히 다른파일이 된다.

    - 정리
      - HTML : no-cache
      - JS, CSS, IMG : public, max-age=31536000

```javascript
const header = {
  setHeaders: (res, path) => {
    /** 캐시를 사용하지 않기 위한 코드 */
    // res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate')
    // res.setHeader('Expires', '-1')
    // res.setHeader('Pragma', 'no-cache')

    /** 캐시를 사용하기 위한 코드 */
    res.setHeader('Cache-Control', 'max-age=10');

    /** 캐시를 각각 다른파일 리소스에 적절한 유효시간을 주기 */
    if (path.endsWith('.html')) {
      /** HTML */
      res.setHeader('Cache-Control', 'no-cache');
    } else if (path.endsWith('.js') || path.endsWith('.css') || path.endsWith('.webp')) {
      /** JS CSS WEBP */
      res.setHeader('Cache-Control', 'public, max-age=31536000');
    } else {
      /** ANOTHER */
      res.setHeader('Cache-Control', 'no-store');
    }
  },
};
```
