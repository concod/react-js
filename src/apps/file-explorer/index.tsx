import { useState } from "react";
import { fileSystem, type FileNode } from "./data";
import "./file-explorer.css";

// Directories before files, then alphabetical within each group.
function sortNodes(nodes: FileNode[]): FileNode[] {
  return [...nodes].sort((a, b) => {
    const aDir = Array.isArray(a.children);
    const bDir = Array.isArray(b.children);
    if (aDir !== bDir) return aDir ? -1 : 1; // dirs first
    return a.name.localeCompare(b.name); // then alphabetical
  });
}

// One component per node. It owns ITS OWN expand/collapse state and renders
// itself recursively for children — so it works for any depth.
function Node({ node }: { node: FileNode }) {
  const [open, setOpen] = useState(false);
  const isDir = Array.isArray(node.children);

  return (
    <li className="fe-node">
      <div
        className={`fe-row ${isDir ? "is-dir" : "is-file"}`}
        onClick={() => isDir && setOpen((o) => !o)}
      >
        <span className="fe-icon">
          {isDir ? (open ? "📂" : "📁") : "📄"}
        </span>
        <span className="fe-name">{node.name}</span>
      </div>

      {isDir && open && (
        <ul className="fe-children">
          {sortNodes(node.children!).map((child) => (
            <Node key={child.id} node={child} />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function FileExplorer() {
  return (
    <div className="fe">
      <h1>File Explorer</h1>
      <ul className="fe-root">
        {sortNodes(fileSystem).map((node) => (
          <Node key={node.id} node={node} />
        ))}
      </ul>
    </div>
  );
}
