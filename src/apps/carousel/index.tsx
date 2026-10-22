import ImageCarousel from './ImageCarousel';

const images = [
  {
    src: 'https://picsum.photos/id/600/600/400',
    alt: 'Forest',
  },
  {
    src: 'https://picsum.photos/id/100/600/400',
    alt: 'Beach',
  },
  {
    src: 'https://picsum.photos/id/200/600/400',
    alt: 'Yak',
  },
  {
    src: 'https://picsum.photos/id/300/600/400',
    alt: 'Hay',
  },
  {
    src: 'https://picsum.photos/id/400/600/400',
    alt: 'Plants',
  },
  {
    src: 'https://picsum.photos/id/500/600/400',
    alt: 'Building',
  },
  {
    src: 'https://picsum.photos/id/700/600/400',
    alt: 'Mountain',
  },
  {
    src: 'https://picsum.photos/id/800/600/400',
    alt: 'River',
  },
  {
    src: 'https://picsum.photos/id/900/600/400',
    alt: 'Desert',
  },
  {
    src: 'https://picsum.photos/id/1000/600/400',
    alt: 'City',
  },
];

export default function App() {
  return (
    <div>
      <ImageCarousel images={images} />
    </div>
  );
}
