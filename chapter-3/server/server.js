const express = require('express');
const app = express();
const port = 5000;
const path = require('path');

const header = {
  setHeaders: (res, path) => {
    /** 캐시를 사용하지 않기 위한 코드 */
    // res.setHeader('Cache-Control', 'private, no-cache, no-store, must-revalidate')
    // res.setHeader('Expires', '-1')
    // res.setHeader('Pragma', 'no-cache')

    /** 캐시를 사용하기 위한 코드 */
    // res.setHeader('Cache-Control', 'max-age=10');

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

app.use(express.static(path.join(__dirname, '../build'), header));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));
