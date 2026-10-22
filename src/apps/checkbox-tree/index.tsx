import { useMemo, useState } from 'react';
import { fileData, type CheckboxNode } from './data';
import './checkbox-tree.css';

type Status = 'checked' | 'unchecked' | 'indeterminate';

// ── STEP 1 ──────────────────────────────────────────────────────────────
// For every node id, collect the ids of the LEAF nodes in its subtree.
// Why: when a parent is toggled, only its leaves actually need to change —
// every ancestor's status will be DERIVED from leaves, never stored
// directly (step 3), so a parent and its children can never disagree.
//
// Hint: recursive walk. A node with no `children` (or an empty array) IS a
// leaf — it returns [node.id]. Otherwise, flatMap the walk over its
// children and record that combined list against this node's own id too.
function buildLeafIndex(nodes: CheckboxNode[]): Map<number, number[]> {
  const treeMap = new Map<number, number[]>();

  function walk(node: CheckboxNode): number[] {
    if (!node.children || node.children.length === 0) {
      // leaf — the only leaf id under itself is its own id
      treeMap.set(node.id, [node.id]);
      return [node.id];
    }

    // combine every child's leaf ids into one flat list
    const leafIds: number[] = [];
    for (const child of node.children) {
      const childLeafIds = walk(child);
      for (const id of childLeafIds) {
        leafIds.push(id);
      }
    }
    treeMap.set(node.id, leafIds);
    return leafIds;
  }

  nodes.forEach((node) => walk(node));

  return treeMap;
}

// ── STEP 2 ──────────────────────────────────────────────────────────────
// Build the initial "source of truth": which leaves start checked.
// Only LEAVES go in this map. Parents never get an entry here — their
// checked/indeterminate state is always computed, never stored.
//
// Hint: walk the tree; for each leaf node, read `node.checked ?? false`
// (the data set only sets `checked` on some leaves, so default matters).
function initialLeafChecked(nodes: CheckboxNode[]): Map<number, boolean> {
  // TODO: implement
  let map = new Map();

  const walkNode = (nodes: CheckboxNode[]) => {
    nodes.forEach((node) => {
      if (node.children?.length) {
        walkNode(node.children);
      } else {
        map.set(node.id, node.checked ?? false);
      }
    });
  };

  walkNode(nodes);

  return map;
}

// ── STEP 3 ──────────────────────────────────────────────────────────────
// Given the leaf-checked map, compute a Status for EVERY node (leaf and
// parent alike). A parent's status depends on its children's statuses:
//   - every child 'checked'    -> 'checked'
//   - every child 'unchecked'  -> 'unchecked'
//   - anything else (mixed)    -> 'indeterminate'
//
// Hint: recursive walk, bottom-up — resolve each child's status first
// (recursing), then derive the current node's status from that list.
function computeStatuses(
  nodes: CheckboxNode[],
  leafChecked: Map<number, boolean>,
): Map<number, Status> {
  // TODO: implement
  return new Map();
}

// ── STEP 4 ──────────────────────────────────────────────────────────────
// One row: a native checkbox + label, rendered recursively for children.
// Look at src/apps/file-explorer/index.tsx's `Node` component for the
// general shape of "recurse over node.children".
//
// Requirements this needs to satisfy:
//   - the checkbox's `checked` prop should reflect status === 'checked'
//   - `indeterminate` is a DOM property, NOT a React prop — there's no JSX
//     attribute for it. You have to set it imperatively via a ref callback
//     on the <input>, e.g. `ref={(el) => { if (el) el.indeterminate = ... }}`
//   - toggling (click or Space, since it's a native checkbox) calls
//     onToggle(node.id)
function CheckboxItem({
  node,
  statuses,
  onToggle,
}: {
  node: CheckboxNode;
  //statuses: Map<number, Status>
  //onToggle: (id: number) => void
}) {
  // TODO: implement

  return (
    <li className="ct-node">
      {
        <div className="ct-row">
          <input type="checkbox" /> <span>{node.name}</span>
        </div>
      }

      {node.children && (
        <ul className="ct-children">
          {node.children.map((item) => (
            <CheckboxItem key={item.id} node={item} />
          ))}
        </ul>
      )}
    </li>
  );
}

// ── STEP 5 ──────────────────────────────────────────────────────────────
// Wire it all together.
//   - leafIdsUnder: compute once with buildLeafIndex(fileData) — it never
//     changes, since the tree shape is static (useMemo with [] deps).
//   - leafChecked: React state, initialized with initialLeafChecked(fileData).
//   - statuses: derived from leafChecked via computeStatuses — recompute
//     whenever leafChecked changes (useMemo with [leafChecked] deps).
//   - handleToggle(id):
//       1. look up the node's CURRENT status
//       2. decide the next boolean: if current status is 'checked', the
//          new value is false; otherwise ('unchecked' or 'indeterminate')
//          the new value is true
//       3. get this node's leaf ids from leafIdsUnder, and set ALL of them
//          to that new value in leafChecked (copy the map, don't mutate
//          state directly)
export default function CheckboxTree() {
  // TODO: implement state + handleToggle, then render fileData through
  // CheckboxItem inside the <ul> below.

  const data = buildLeafIndex(fileData);
  console.log(initialLeafChecked(fileData), data, 'data');
  return (
    <div className="ct">
      <h1>Hierarchical Checkboxes</h1>
      <ul className="ct-root">
        {fileData.map((item, index) => (
          <CheckboxItem key={item.id} node={item} />
        ))}
      </ul>
    </div>
  );
}
