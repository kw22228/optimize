# optimize

### 이미지 사이즈 최적화

1.  실제 DOM에 렌더링되는 사이즈의 2배정도의 크기의 이미지를 사용하는 것이 좋다. (120x120 이라면 240x240)

- api를 통해 받아오는 이미지라면 어떻게 해야할까?
  - Cloudinary나 imgix같은 이미지CDN을 사용하여 쿼리스트링으로 이미지의 사이즈를 정해서 가져옴.
  - http://cdn.image.com?src=[img_src]&width=240&height=240
    ex) https://images.unsplash.com/photo-1542435503-956c469947f6?width=240&height=240
