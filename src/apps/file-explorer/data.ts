export type FileNode = {
  id: number;
  name: string;
  // Directories have a `children` array (possibly empty).
  // Files have no `children` key at all.
  children?: FileNode[];
};

export const fileSystem: FileNode[] = [
  {
    id: 1,
    name: "README.md",
  },
  {
    id: 2,
    name: "src",
    children: [
      {
        id: 3,
        name: "components",
        children: [
          { id: 4, name: "Button.tsx" },
          { id: 5, name: "Modal.tsx" },
          {
            id: 6,
            name: "icons",
            children: [
              { id: 7, name: "star.svg" },
              { id: 8, name: "arrow.svg" },
            ],
          },
        ],
      },
      { id: 9, name: "index.tsx" },
      { id: 10, name: "App.tsx" },
    ],
  },
  {
    id: 11,
    name: "public",
    children: [
      { id: 12, name: "favicon.ico" },
      { id: 13, name: "logo.png" },
    ],
  },
  {
    id: 14,
    name: "empty-dir",
    children: [],
  },
  {
    id: 15,
    name: "package.json",
  },
];
