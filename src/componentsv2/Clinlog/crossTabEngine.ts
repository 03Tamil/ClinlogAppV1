import {
  getFieldLabel,
  getFieldOptions,
  getRecordFieldValues,
  recordHasOption,
  type FieldOption,
  type OptionContext,
} from "./clinlogFields";

/**
 * Cross-tab counting engine.
 *
 * The previous tables filtered the full record list once per
 * (column value × sub value × row value) combination and then searched the
 * resulting array again for every rendered cell — O(cells × records) twice.
 * Here each record's field values are read once, stored as membership
 * bitmaps, and every cell is a cheap intersection count.
 */
type Bucket = { idx: number[]; has: Uint8Array };
export type Membership = Map<string, Map<string, Bucket>>;

export const buildMembership = (
  records: any[],
  keys: string[],
  ctx: OptionContext,
  surveyByRecordId?: Map<string, any>,
): Membership => {
  const membership: Membership = new Map();
  const n = records.length;
  keys.forEach((key) => {
    if (membership.has(key)) return;
    const options = getFieldOptions(key, ctx);
    const byOption = new Map<string, Bucket>();
    options.forEach((option) =>
      byOption.set(option.value, { idx: [], has: new Uint8Array(n) }),
    );
    records.forEach((record, i) => {
      const values = getRecordFieldValues(record, key, surveyByRecordId);
      if (values.length === 0) return;
      options.forEach((option) => {
        if (recordHasOption(values, key, option.value)) {
          const bucket = byOption.get(option.value)!;
          bucket.idx.push(i);
          bucket.has[i] = 1;
        }
      });
    });
    membership.set(key, byOption);
  });
  return membership;
};

/** Number of records that are in every bucket given (null = "all records"). */
export const countAll = (buckets: (Bucket | null)[], total: number) => {
  const real = buckets.filter(Boolean) as Bucket[];
  if (real.length === 0) return total;
  real.sort((a, b) => a.idx.length - b.idx.length);
  const [smallest, ...rest] = real;
  if (rest.length === 0) return smallest.idx.length;
  let count = 0;
  for (const i of smallest.idx) {
    let inAll = true;
    for (const bucket of rest) {
      if (!bucket.has[i]) {
        inAll = false;
        break;
      }
    }
    if (inAll) count++;
  }
  return count;
};

export type HeaderCell = {
  text: string;
  colSpan?: number;
  rowSpan?: number;
  kind?: "corner" | "group" | "option" | "total";
};
export type BodyRow = {
  kind: "sample" | "field" | "value";
  label: string;
  cells: { count: number; pct?: number; kind?: "total" }[];
};
export type CrossTabModel = {
  header: HeaderCell[][];
  body: BodyRow[];
  totalRecords: number;
};

const pct = (count: number, of: number) => (of > 0 ? (count / of) * 100 : 0);

export type CrossTabConfig = {
  rowFields: string[];
  colFields: string[];
  subFields: string[];
  /** Selected values per field; missing = all values. */
  values: Record<string, string[] | undefined>;
};

const selectedOptions = (
  key: string,
  config: CrossTabConfig,
  ctx: OptionContext,
): FieldOption[] => {
  const all = getFieldOptions(key, ctx);
  const chosen = config.values[key];
  return chosen ? all.filter((o) => chosen.includes(o.value)) : all;
};

/** "Fluid" layout: every value of each column field, sample size per row field. */
export const buildFluidModel = (
  records: any[],
  config: CrossTabConfig,
  ctx: OptionContext,
  membership: Membership,
): CrossTabModel => {
  const total = records.length;
  const cols = config.colFields.flatMap((key) =>
    getFieldOptions(key, ctx).map((option) => ({
      key,
      option,
      bucket: membership.get(key)?.get(option.value) ?? null,
    })),
  );
  const header: HeaderCell[][] = [
    [
      { text: "", kind: "corner" },
      ...config.colFields.map((key) => ({
        text: getFieldLabel(key),
        colSpan: getFieldOptions(key, ctx).length || 1,
        kind: "group" as const,
      })),
    ],
    [
      { text: "", kind: "corner" },
      ...cols.map((c) => ({ text: c.option.label, kind: "option" as const })),
    ],
  ];
  const body: BodyRow[] = [];
  config.rowFields.forEach((rowKey) => {
    const rowOptions = getFieldOptions(rowKey, ctx);
    const rowBuckets = rowOptions.map(
      (o) => membership.get(rowKey)?.get(o.value) ?? null,
    );
    body.push({
      kind: "sample",
      label: "Sample size",
      cells: cols.map((c) => ({ count: countAll([c.bucket], total) })),
    });
    const counts = rowBuckets.map((rb) =>
      cols.map((c) => countAll([c.bucket, rb], total)),
    );
    const fieldTotals = cols.map((_, ci) =>
      counts.reduce((sum, row) => sum + row[ci], 0),
    );
    body.push({
      kind: "field",
      label: getFieldLabel(rowKey),
      cells: fieldTotals.map((count) => ({ count })),
    });
    rowOptions.forEach((option, ri) => {
      body.push({
        kind: "value",
        label: option.label,
        cells: counts[ri].map((count, ci) => ({
          count,
          pct: pct(count, fieldTotals[ci]),
        })),
      });
    });
  });
  return { header, body, totalRecords: total };
};

/** "Restricted values" layout: chosen values only, optional split columns, totals. */
export const buildRestrictedModel = (
  records: any[],
  config: CrossTabConfig,
  ctx: OptionContext,
  membership: Membership,
): CrossTabModel => {
  const total = records.length;
  const cols = config.colFields.flatMap((key) =>
    selectedOptions(key, config, ctx).map((option) => ({
      key,
      option,
      bucket: membership.get(key)?.get(option.value) ?? null,
    })),
  );
  const implicitSub = config.subFields.length === 0;
  const subs = implicitSub
    ? [{ key: "", option: { value: "", label: "All" }, bucket: null }]
    : config.subFields.flatMap((key) =>
        selectedOptions(key, config, ctx).map((option) => ({
          key,
          option,
          bucket: membership.get(key)?.get(option.value) ?? null,
        })),
      );

  const header: HeaderCell[][] = implicitSub
    ? [
        [
          { text: "", kind: "corner" },
          ...cols.map((c) => ({
            text: `${getFieldLabel(c.key)}: ${c.option.label}`,
            kind: "option" as const,
          })),
          { text: "Total", kind: "total" },
        ],
      ]
    : [
        [
          { text: "", kind: "corner" },
          ...cols.map((c) => ({
            text: `${getFieldLabel(c.key)}: ${c.option.label}`,
            colSpan: subs.length,
            kind: "group" as const,
          })),
          { text: "Total", colSpan: subs.length, kind: "total" },
          { text: "Total (all)", rowSpan: 2, kind: "total" },
        ],
        [
          { text: "Split by", kind: "corner" },
          ...cols.flatMap(() =>
            subs.map((s) => ({
              text: `${getFieldLabel(s.key)}: ${s.option.label}`,
              kind: "option" as const,
            })),
          ),
          ...subs.map((s) => ({
            text: `${getFieldLabel(s.key)}: ${s.option.label}`,
            kind: "total" as const,
          })),
        ],
      ];

  // Sample size row
  const sample = cols.map((c) =>
    subs.map((s) => countAll([c.bucket, s.bucket], total)),
  );
  const sampleSubTotals = subs.map((_, si) =>
    sample.reduce((sum, row) => sum + row[si], 0),
  );
  const sampleAll = sampleSubTotals.reduce((a, b) => a + b, 0);
  const body: BodyRow[] = [
    {
      kind: "sample",
      label: "Sample size",
      cells: [
        ...sample.flat().map((count) => ({ count })),
        ...(implicitSub
          ? [{ count: sampleAll, kind: "total" as const }]
          : [
              ...sampleSubTotals.map((count) => ({
                count,
                kind: "total" as const,
              })),
              { count: sampleAll, kind: "total" as const },
            ]),
      ],
    },
  ];

  config.rowFields.forEach((rowKey) => {
    const rowOptions = selectedOptions(rowKey, config, ctx);
    // counts[ri][ci][si]
    const counts = rowOptions.map((o) => {
      const rb = membership.get(rowKey)?.get(o.value) ?? null;
      return cols.map((c) =>
        subs.map((s) => countAll([c.bucket, s.bucket, rb], total)),
      );
    });
    const cell = (ci: number, si: number) =>
      counts.reduce((sum, r) => sum + r[ci][si], 0);
    const fieldCells = cols.map((_, ci) => subs.map((_, si) => cell(ci, si)));
    const fieldSubTotals = subs.map((_, si) =>
      fieldCells.reduce((sum, row) => sum + row[si], 0),
    );
    const fieldAll = fieldSubTotals.reduce((a, b) => a + b, 0);
    body.push({
      kind: "field",
      label: getFieldLabel(rowKey),
      cells: [
        ...fieldCells.flat().map((count) => ({ count })),
        ...(implicitSub
          ? [{ count: fieldAll, kind: "total" as const }]
          : [
              ...fieldSubTotals.map((count) => ({
                count,
                kind: "total" as const,
              })),
              { count: fieldAll, kind: "total" as const },
            ]),
      ],
    });
    rowOptions.forEach((option, ri) => {
      const rowCells = counts[ri];
      const subTotals = subs.map((_, si) =>
        rowCells.reduce((sum, c) => sum + c[si], 0),
      );
      const all = subTotals.reduce((a, b) => a + b, 0);
      body.push({
        kind: "value",
        label: option.label,
        cells: [
          ...rowCells.flatMap((c, ci) =>
            c.map((count, si) => ({
              count,
              pct: pct(count, fieldCells[ci][si]),
            })),
          ),
          ...(implicitSub
            ? [{ count: all, pct: pct(all, fieldAll), kind: "total" as const }]
            : [
                ...subTotals.map((count, si) => ({
                  count,
                  pct: pct(count, fieldSubTotals[si]),
                  kind: "total" as const,
                })),
                { count: all, pct: pct(all, fieldAll), kind: "total" as const },
              ]),
        ],
      });
    });
  });
  return { header, body, totalRecords: total };
};

export const formatCell = (cell: { count: number; pct?: number }) =>
  cell.pct === undefined
    ? String(cell.count)
    : `${cell.count} (${cell.pct.toFixed(1)}%)`;

/** Flatten the model to CSV rows (spans expanded). */
export const modelToCsvRows = (model: CrossTabModel) => {
  const width =
    1 + (model.body[0]?.cells.length ?? model.header[0].length - 1);
  const grid: string[][] = model.header.map(() => Array(width).fill(""));
  model.header.forEach((row, r) => {
    let c = 0;
    row.forEach((cell) => {
      while (grid[r][c] === "\u0000") c++;
      grid[r][c] = cell.text;
      for (let k = 1; k < (cell.colSpan ?? 1); k++) grid[r][c + k] = "";
      if ((cell.rowSpan ?? 1) > 1) {
        for (let rr = r + 1; rr < r + (cell.rowSpan ?? 1); rr++) {
          if (grid[rr]) grid[rr][c] = "\u0000";
        }
      }
      c += cell.colSpan ?? 1;
    });
  });
  const header = grid.map((row) => row.map((v) => (v === "\u0000" ? "" : v)));
  const body = model.body.map((row) => [
    row.label,
    ...row.cells.map((cell) => formatCell(cell)),
  ]);
  return [...header, ...body];
};
