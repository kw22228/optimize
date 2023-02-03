/** 메모이제이션 캐쉬 저장소 */
const cache = {};

export function getAverageColorOfImage(imgElement) {
  /** 메모이제이션으로 코드 최적화 하기 */
  if (cache.hasOwnProperty(imgElement.src)) return cache[imgElement.src];

  const canvas = document.createElement('canvas');
  const context = canvas.getContext && canvas.getContext('2d');
  const averageColor = {
    r: 0,
    g: 0,
    b: 0,
  };

  if (!context) {
    return averageColor;
  }

  const width = (canvas.width =
    imgElement.naturalWidth || imgElement.offsetWidth || imgElement.width);
  const height = (canvas.height =
    imgElement.naturalHeight || imgElement.offsetHeight || imgElement.height);

  context.drawImage(imgElement, 0, 0);

  const imageData = context.getImageData(0, 0, width, height).data;
  const length = imageData.length;

  for (let i = 0; i < length; i += 4) {
    averageColor.r += imageData[i];
    averageColor.g += imageData[i + 1];
    averageColor.b += imageData[i + 2];
  }

  const count = length / 4;
  averageColor.r = ~~(averageColor.r / count); // ~~ => convert to int
  averageColor.g = ~~(averageColor.g / count);
  averageColor.b = ~~(averageColor.b / count);

  /** 메모이제이션으로 코드 최적화 하기 (cache에 property를 결과값 저장) */
  cache[imgElement.src] = averageColor;

  return averageColor;
}
