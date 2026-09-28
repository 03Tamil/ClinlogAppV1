// @ts-nocheck
import {
  Box,
  Flex,
  Spacer,
  Tab,
  Table,
  TableContainer,
  TabList,
  Tabs,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Link,
  Button,
  chakra,
  useBreakpointValue,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Textarea,
  Spinner,
  Select,
} from "@chakra-ui/react";
import {
  CheckIcon,
  DownloadIcon,
  TriangleDownIcon,
  TriangleUpIcon,
} from "@chakra-ui/icons";
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";
import dynamic from "next/dynamic";
import animationData from "../animationsv2/clinlog_loading.json";
import useQueryHook, { getData, sendData } from "hooks/useQueryHook";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  differenceInDays,
  format,
  isAfter,
  isBefore,
  subMonths,
} from "date-fns";
import { MdSearch } from "react-icons/md";
import { StylesConfig } from "react-select";

import { clinlogFilterColumns } from "helpersv2/utils";
import { useSession } from "next-auth/react";
import {
  // allClinicsQuery,
  clinlogDataQueryNew,
  clinlogDataQuery,
  clinlogNotesQuery,
  globalIdsQuery,
  mainViewerQuery,
} from "helpersv2/queries";
import ClinlogFilterBar from "componentsv2/Clinlog/ClinlogFilterBar";
import ClinlogDataTable from "componentsv2/Clinlog/ClinlogDataTable";
import GroupedChecklist from "componentsv2/Clinlog/GroupedChecklist";
import { exportCasesCsv } from "componentsv2/Clinlog/caseExport";
import {
  FIELD_GROUPS,
  getFieldMeta,
  optionLabel,
} from "componentsv2/Clinlog/clinlogFields";
import { MdViewColumn } from "react-icons/md";
import { keyframes } from "@emotion/react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { clinlogNoteMutation } from "componentsv2/DetailsPage/detailsPageMutations";
import { useRouter } from "next/router";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "componentsv2/common/QueryState";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

// Heavy views are only rendered on demand (a tab or a selected case), so load
// their code on demand too instead of shipping it with the initial page.
const TabLoading = () => <LoadingState />;
const ClinlogDemoGraphics = dynamic(
  () => import("componentsv2/Analytics/ClinlogDemoGraphics"),
  { loading: TabLoading },
);
const ClinlogPreSurgical = dynamic(
  () => import("componentsv2/Analytics/ClinlogPreSurgical"),
  { loading: TabLoading },
);
const ClinlogPostSurgical = dynamic(
  () => import("componentsv2/Analytics/ClinlogPostSurgical"),
  { loading: TabLoading },
);
const ClinlogHabitsAndRiskFactors = dynamic(
  () => import("componentsv2/Analytics/ClinlogHabitsAndRiskFactors"),
  { loading: TabLoading },
);
const ClinlogDataTool = dynamic(
  () => import("componentsv2/Analytics/ClinlogDataTool"),
  { loading: TabLoading },
);
const SurgicalDetailsV3_2 = dynamic(
  () => import("componentsv2/DetailsPage/Clinical/SurgicalDetailsV3_2"),
  { loading: TabLoading },
);

const formatClinlogLoadDuration = (milliseconds: number) => {
  const safeMilliseconds = Number.isFinite(milliseconds)
    ? Math.max(milliseconds, 0)
    : 0;
  const totalSeconds = safeMilliseconds / 1000;

  if (totalSeconds < 60) {
    return `${totalSeconds.toFixed(1)}s`;
  }

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");

  return `${minutes}m ${seconds}s`;
};

/**
 * Self-contained load timer. It owns the 250ms interval so that only this tiny
 * component re-renders while records stream in. Previously the interval lived
 * in the page component, which re-rendered the whole 3,000-line page (table,
 * filters, data tool) four times a second for the entire load.
 */
const ClinlogLoadTimer = React.memo(function ClinlogLoadTimer({
  startedAt,
  finishedAt,
}: {
  startedAt: number | null;
  finishedAt: number | null;
}) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!startedAt || finishedAt) return;
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(id);
  }, [startedAt, finishedAt]);

  if (!startedAt) return <>{formatClinlogLoadDuration(0)}</>;
  return <>{formatClinlogLoadDuration((finishedAt ?? now) - startedAt)}</>;
});

// Defined at module scope so it isn't re-created (and the Lottie animation
// restarted) on every render of the page.
const InitialLoader = () => (
  <Flex
    zIndex={99999999999999}
    align="center"
    justify="center"
    position="absolute"
    top="0px"
    left="0px"
    w="100vw"
    h="100vh"
    p="4"
    bgColor="#FCF8FF"
    direction="column"
    gap="2"
    role="status"
    aria-live="polite"
  >
    <Lottie
      animationData={animationData}
      loop={true}
      autoplay={true}
      style={{ width: 100, height: 100 }}
    />
    <Text fontSize="13px" fontWeight="600" color="#351361">
      Loading Clinlog records…
    </Text>
  </Flex>
);

// ---- Record fetching -------------------------------------------------------
// First request is small so the table appears quickly; after that we request
// several chunks concurrently instead of one-at-a-time.
const FIRST_PAGE_SIZE = 100;
const CHUNK_SIZE = 200;
const PARALLEL_CHUNKS = 3;

// ---- Batch timing diagnostics (development only) --------------------------
// Every chunk request is timed. When a full load finishes in development, the
// browser downloads clinlog-batch-timings.txt listing each batch, slowest
// first, with the record ids it contained.
type ChunkTiming = {
  batch: number;
  offset: number;
  limit: number;
  count: number;
  ms: number;
  ids: string[];
};
const SHOULD_RECORD_TIMINGS = process.env.NODE_ENV === "development";

const fetchClinlogChunk = async (
  offset: number,
  limit: number,
  recordClinic: string[],
  signal?: AbortSignal,
  timing?: { batch: number; log: ChunkTiming[] },
) => {
  const startedAt = performance.now();
  const res = await fetch("/api/clinlog/records", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ offset, limit, recordClinic }),
    signal,
  });
  if (!res.ok) {
    throw new Error(`Failed to load Clinlog records (${res.status})`);
  }
  const json = await res.json();
  const entries = (json?.entries ?? []) as any[];
  if (timing) {
    timing.log.push({
      batch: timing.batch,
      offset,
      limit,
      count: entries.length,
      ms: Math.round(performance.now() - startedAt),
      ids: entries.map((entry) => String(entry?.id)),
    });
  }
  return entries;
};

const buildBatchTimingReport = (log: ChunkTiming[], totalMs: number) => {
  const pad = (value: string | number, width: number) =>
    String(value).padEnd(width);
  const byBatch = new Map<number, ChunkTiming[]>();
  log.forEach((chunk) => {
    byBatch.set(chunk.batch, [...(byBatch.get(chunk.batch) ?? []), chunk]);
  });
  const batches = Array.from(byBatch.entries()).map(([batch, chunks]) => ({
    batch,
    // Chunks in a batch run in parallel, so the batch takes as long as its
    // slowest chunk.
    ms: Math.max(...chunks.map((chunk) => chunk.ms)),
    count: chunks.reduce((sum, chunk) => sum + chunk.count, 0),
    chunks: [...chunks].sort((a, b) => a.offset - b.offset),
  }));
  const totalRecords = batches.reduce((sum, b) => sum + b.count, 0);
  const slowest = [...batches].sort((a, b) => b.ms - a.ms)[0];
  const slowestChunk = [...log].sort((a, b) => b.ms - a.ms)[0];

  const lines = [
    "Clinlog batch timings",
    `Generated: ${new Date().toISOString()}`,
    `Total load time: ${(totalMs / 1000).toFixed(1)}s for ${totalRecords} records in ${batches.length} batches`,
    `Batch sizes: batch 1 = ${FIRST_PAGE_SIZE} records, then ${PARALLEL_CHUNKS} x ${CHUNK_SIZE} records in parallel per batch`,
    "",
    slowest
      ? `SLOWEST BATCH: #${slowest.batch} (${(slowest.ms / 1000).toFixed(1)}s, ${slowest.count} records, ${Math.round((slowest.ms / Math.max(totalMs, 1)) * 100)}% of total time)`
      : "No batches recorded.",
    slowestChunk
      ? `SLOWEST REQUEST: offset ${slowestChunk.offset}-${slowestChunk.offset + slowestChunk.limit - 1} (${(slowestChunk.ms / 1000).toFixed(1)}s, ${slowestChunk.count} records, ${slowestChunk.count ? Math.round(slowestChunk.ms / slowestChunk.count) : 0}ms/record)`
      : "",
    "",
    "Batches, slowest first",
    `${pad("Batch", 7)}${pad("Time", 10)}${pad("Records", 9)}ms/record`,
    ...[...batches]
      .sort((a, b) => b.ms - a.ms)
      .map(
        (b) =>
          `${pad(`#${b.batch}`, 7)}${pad(`${(b.ms / 1000).toFixed(1)}s`, 10)}${pad(b.count, 9)}${b.count ? Math.round(b.ms / b.count) : "-"}`,
      ),
    "",
    "Requests in each batch (in load order)",
  ];
  batches
    .sort((a, b) => a.batch - b.batch)
    .forEach((b) => {
      lines.push("", `Batch #${b.batch} - ${(b.ms / 1000).toFixed(1)}s`);
      b.chunks.forEach((chunk) => {
        lines.push(
          `  offset ${chunk.offset}-${chunk.offset + chunk.limit - 1}: ${(chunk.ms / 1000).toFixed(1)}s, ${chunk.count} records`,
          `    record ids: ${chunk.ids.join(", ") || "(none)"}`,
        );
      });
    });
  return lines.join("\n");
};

const downloadTextFile = (fileName: string, text: string) => {
  const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

// ---- Precomputed column metadata ------------------------------------------
const clinlogColumnMeta = new Map(
  clinlogFilterColumns.map((column) => [column.key, column]),
);
const columnsByGroup = (group: string) =>
  clinlogFilterColumns.filter((column) => column.group === group);
const GENERAL_DETAILS_COLUMNS = columnsByGroup("generalDetails");
const PATIENT_CHAR_COLUMNS = columnsByGroup("patientCharacteristics");
const TREATMENT_CHAR_COLUMNS = columnsByGroup("treatmentCharacteristics");
const FOLLOW_UP_COLUMNS = columnsByGroup("followUp");

const hasValue = (value) =>
  value !== null && value !== undefined && value !== "";

// Returns "completed" | "inProgress". Computed once per record (in tableData)
// instead of on every render of every status cell.
const getRecordDataStatus = (data) => {
  const followUpData = data?.recordFollowUpMatrix?.[0];
  const complete =
    GENERAL_DETAILS_COLUMNS.every((column) => hasValue(data[column.key])) &&
    PATIENT_CHAR_COLUMNS.every((column) => hasValue(data[column.key])) &&
    TREATMENT_CHAR_COLUMNS.every(
      (column) =>
        hasValue(data[column.key]) ||
        column.key === "lowerArchCondition" ||
        column.key === "timeFromSurgery",
    ) &&
    FOLLOW_UP_COLUMNS.every(
      (column) =>
        hasValue(followUpData?.[column.key]) ||
        column.key === "timeFromSurgery_fs",
    );
  return complete ? "completed" : "inProgress";
};

// Most recent site-specific follow-up, without mutating the cached query data
// (the old code called .sort() in place on React Query's cache).
const latestSiteFollowUp = (site) => {
  const followUps =
    site?.attachedSiteSpecificRecords?.[0]?.attachedSiteSpecificFollowUp;
  if (!followUps?.length) return undefined;
  return [...followUps].sort(
    (a, b) =>
      new Date(b?.recordFollowUpDate).getTime() -
      new Date(a?.recordFollowUpDate).getTime(),
  )[0];
};

const selectCustomStyle: StylesConfig = {
  menu: (styles) => ({
    ...styles,
    fontSize: "13px",
    zIndex: 100002,
  }),
  control: (styles) => ({
    ...styles,
    borderRadius: "6px",
    borderColor: "gray.400",
  }),
  option: (styles) => ({
    ...styles,
    fontSize: "13px",
  }),
  input: (styles) => ({
    ...styles,
    fontSize: "13px",
  }),
  placeholder: (styles) => ({
    ...styles,
    fontSize: "13px",
    color: "#767676",
  }),
  singleValue: (styles) => ({
    ...styles,
    fontSize: "13px",
  }),
};

function Clinlog() {
  const [filterArray, setFilterArray] = React.useState([]);
  const [openTab, setOpenTab] = useState("allCases");
  const { data: session } = useSession();
  const [viewPatient, setViewPatient] = useState(null);
  const [locationArr, setLocationArr] = useState([session?.locationIds?.[0]]);
  const [clinlogStatus, setClinlogStatus] = useState("More Data Required");
  const [newNote, setNewNote] = useState("");
  //const [notesPageIndex, setNotesPageIndex] = useState(1);
  const toast = useToast();
  const toastIdRef = useRef<any>(null);
  const queryClient = useQueryClient();
  const isBase = useBreakpointValue({ base: true, md: false });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isSurveyOpen,
    onOpen: onSurveyOpen,
    onClose: onSurveyClose,
  } = useDisclosure();

  const [openMenu, setOpenMenu] = useState(true);
  const [patientSurveyData, setPatientSurveyData] = useState(null);
  const [loadTiming, setLoadTiming] = useState<{
    startedAt: number | null;
    finishedAt: number | null;
  }>({ startedAt: null, finishedAt: null });

  // const viewerMainNavbarResult = useQueryHook(
  //   ["mainViewerQuery"],
  //   mainViewerQuery,
  //   {},
  //   { enabled: !!session },
  // );

  // const viewerValues = useMemo(() => {
  //   return viewerMainNavbarResult?.data?.viewer;
  // }, [viewerMainNavbarResult?.data?.viewer]);

  const [collapseTabs, setCollapseTabs] = useState(true);
  const isAdmin = session?.groups?.includes("Admin");
  const router = useRouter();

  useEffect(() => {
    if (
      session?.locationIds?.[0] &&
      (!locationArr?.length || locationArr.every((item) => !item))
    ) {
      setLocationArr([session.locationIds[0].toString()]);
    }
  }, [session?.locationIds, locationArr]);

  const locationQueryKey = useMemo(
    () =>
      (locationArr ?? [])
        .filter(Boolean)
        .map((item) => item.toString())
        .sort()
        .join("|"),
    [locationArr],
  );

  const clinlogDataInfiniteQueryKey = useMemo(
    () => [
      "clinlogData",
      "infinite",
      locationQueryKey,
      session?.userId ?? null,
    ],
    [locationQueryKey, session?.userId],
  );

  // const globalIdsResults = useQueryHook(
  //   ["globalIds"],
  //   globalIdsQuery,
  //   {
  //     // recordClinic: isAdmin
  //     //   ? allClinicsQueryResult?.data?.clinics?.map((clinic) => clinic?.id)
  //     //   : session?.locationIds,
  //     recordClinic: globalClinicIds,
  //   },
  //   {
  //     enabled: allClinicsQueryResult?.isSuccess && globalClinicIds.length > 0,
  //     refetchOnMount: false,
  //     refetchOnReconnect: false,
  //     refetchOnWindowFocus: false,
  //     staleTime: Infinity,
  //   },
  // );

  // Per-load timing log (reset whenever the record query key changes).
  const batchTimingsRef = useRef<ChunkTiming[]>([]);
  const batchTimingsStartedAtRef = useRef<number | null>(null);
  const batchTimingsDownloadedRef = useRef(false);
  useEffect(() => {
    batchTimingsRef.current = [];
    batchTimingsStartedAtRef.current = null;
    batchTimingsDownloadedRef.current = false;
  }, [clinlogDataInfiniteQueryKey]);

  const {
    data: clinlogDataInfinite,
    fetchNextPage,
    isLoading,
    isError,
    refetch,
    hasNextPage,
    isFetching,
  } = useInfiniteQuery(
    clinlogDataInfiniteQueryKey,
    async ({ pageParam = 0, signal }) => {
      const recordClinic = (locationArr ?? [])
        .filter(Boolean)
        .map((item) => item.toString());
      if (pageParam === 0) {
        // A fresh load (or refetch) starts a new timing log.
        batchTimingsRef.current = [];
        batchTimingsStartedAtRef.current = performance.now();
        batchTimingsDownloadedRef.current = false;
      }
      const timing = SHOULD_RECORD_TIMINGS
        ? {
            batch:
              pageParam === 0
                ? 1
                : 2 +
                  (pageParam - FIRST_PAGE_SIZE) /
                    (PARALLEL_CHUNKS * CHUNK_SIZE),
            log: batchTimingsRef.current,
          }
        : undefined;

      if (pageParam === 0) {
        const entries = await fetchClinlogChunk(
          0,
          FIRST_PAGE_SIZE,
          recordClinic,
          signal,
          timing,
        );
        return {
          entries,
          nextOffset: FIRST_PAGE_SIZE,
          reachedEnd: entries.length === 0,
        };
      }

      // Fetch several chunks in parallel to cut total load time.
      const chunks = await Promise.all(
        Array.from({ length: PARALLEL_CHUNKS }, (_, i) =>
          fetchClinlogChunk(
            pageParam + i * CHUNK_SIZE,
            CHUNK_SIZE,
            recordClinic,
            signal,
            timing,
          ),
        ),
      );
      return {
        entries: chunks.flat(),
        nextOffset: pageParam + PARALLEL_CHUNKS * CHUNK_SIZE,
        // Same stop condition as before (an empty response), applied per chunk.
        reachedEnd: chunks.some((chunk) => chunk.length === 0),
      };
    },
    {
      getNextPageParam: (lastPage) =>
        lastPage?.reachedEnd ? undefined : lastPage?.nextOffset,
      enabled: locationQueryKey.length > 0 && !!session?.accessToken,
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 10 * 60 * 1000,
    },
  );

  const clinlogHasLoadedRecords = useMemo(
    () =>
      clinlogDataInfinite?.pages?.some((page) => page?.entries?.length > 0) ??
      false,
    [clinlogDataInfinite?.pages],
  );

  const hasFinishedClinlogDataLoading =
    (clinlogDataInfinite?.pages?.length ?? 0) > 0 &&
    !isLoading &&
    !isFetching &&
    !hasNextPage;

  const hasLoadedAllClinlogPages =
    clinlogHasLoadedRecords && hasFinishedClinlogDataLoading;

  // Development only: once every batch has loaded, download a text file
  // showing which batch (and which records) caused the slowdown.
  useEffect(() => {
    if (
      !SHOULD_RECORD_TIMINGS ||
      !hasFinishedClinlogDataLoading ||
      batchTimingsDownloadedRef.current ||
      batchTimingsRef.current.length === 0 ||
      batchTimingsStartedAtRef.current === null
    ) {
      return;
    }
    batchTimingsDownloadedRef.current = true;
    const totalMs = performance.now() - batchTimingsStartedAtRef.current;
    downloadTextFile(
      "clinlog-batch-timings.txt",
      buildBatchTimingReport(batchTimingsRef.current, totalMs),
    );
  }, [hasFinishedClinlogDataLoading]);

  // Load timing: only start/finish timestamps live here. The ticking display
  // is handled by <ClinlogLoadTimer/> so the page doesn't re-render 4x/sec.
  useEffect(() => {
    setLoadTiming({ startedAt: null, finishedAt: null });
  }, [locationQueryKey, session?.userId]);

  useEffect(() => {
    if (
      !locationQueryKey ||
      !session?.accessToken ||
      hasFinishedClinlogDataLoading
    ) {
      return;
    }
    setLoadTiming((current) =>
      current.startedAt ? current : { startedAt: Date.now(), finishedAt: null },
    );
  }, [hasFinishedClinlogDataLoading, locationQueryKey, session?.accessToken]);

  useEffect(() => {
    if (!hasFinishedClinlogDataLoading) return;
    setLoadTiming((current) =>
      current.startedAt && !current.finishedAt
        ? { ...current, finishedAt: Date.now() }
        : current,
    );
  }, [hasFinishedClinlogDataLoading]);

  // const allClinicsQueryResult = useQueryHook(
  //   ["clinics"],
  //   allClinicsQuery,
  //   {},
  //   {
  //     enabled: hasFinishedClinlogDataLoading && !!session,
  //   },
  // );
  //
  // const locationOptions = useMemo(() => {
  //   // if (isAdmin) {
  //   //   return allClinicsQueryResult?.data?.clinics?.map((clinic) => ({
  //   //     value: clinic?.id,
  //   //     label: `${clinic?.locationShortName}`,
  //   //   }));
  //   // } else {
  //   //   const allClinicIds = allClinicsQueryResult?.data?.clinics?.map(
  //   //     (clinic) => clinic?.id,
  //   //   );
  //   //   const location = session?.locationIds
  //   //     ?.filter((item) => allClinicIds?.includes(item.toString()))
  //   //     .map((clinic) => ({
  //   //       value: clinic.toString(),
  //   //       label: allClinicsQueryResult?.data?.clinics?.find(
  //   //         (item) => item.id === clinic.toString(),
  //   //       )?.locationShortName,
  //   //     }));
  //   //   return location || [];
  //   // }
  //   return allClinicsQueryResult?.data?.clinics?.map((clinic) => ({
  //     value: clinic?.id,
  //     label: `${clinic?.locationShortName}`,
  //   }));
  // }, [allClinicsQueryResult?.data?.clinics, session?.locationIds]);
  //
  // useEffect(() => {
  //   if (!locationArr?.includes("all") && allClinicsQueryResult?.data?.clinics) {
  //     const allClinicIds = allClinicsQueryResult?.data?.clinics?.map(
  //       (clinic) => clinic.id,
  //     );
  //     const filteredArr = locationArr.filter((item) =>
  //       allClinicIds.includes(item.toString()),
  //     );
  //     setLocationArr(filteredArr.map((item) => item.toString()));
  //   }
  // }, [allClinicsQueryResult?.data?.clinics]);
  //
  // const globalClinicIds = useMemo(
  //   () =>
  //     allClinicsQueryResult?.data?.clinics?.map((clinic) => clinic?.id) ?? [],
  //   [allClinicsQueryResult?.data?.clinics],
  // );

  // Notes don't depend on the record batches (the query has no clinic
  // variables), so load them in parallel instead of after every record page.
  const clinlogNotesQueryResult = useQueryHook(
    ["clinlogNotesQueryResult", session?.userId ?? null],
    clinlogNotesQuery,
    {},
    { refetchOnWindowFocus: false },
  );

  // recordId -> first patient survey matrix. Replaces a linear .find() over
  // every note for every row during filtering and cell rendering.
  const surveyByRecordId = useMemo(() => {
    const map = new Map();
    clinlogNotesQueryResult?.data?.recordNotes?.forEach((note) => {
      const recordId = note?.recordNoteRecord?.[0]?.id;
      if (
        recordId === undefined ||
        recordId === null ||
        !(note?.attachedSurveyForm?.length > 0) ||
        map.has(String(recordId))
      ) {
        return;
      }
      map.set(
        String(recordId),
        note.attachedSurveyForm?.[0]?.patientSurveyMatrix?.[0],
      );
    });
    return map;
  }, [clinlogNotesQueryResult?.data?.recordNotes]);

  const clinlogDataQueryResults = useMemo(() => {
    //if (!clinlogDataInfinite) return [];

    //fetchNextPage();
    return clinlogDataInfinite?.pages?.flatMap((p) => p?.entries ?? []) ?? [];
    // Depend on the pages array itself (not just its length) so a refetch
    // with the same number of pages still updates the table.
  }, [clinlogDataInfinite?.pages]);

  const surgeonOptions = useMemo(() => {
    return [
      ...new Set(
        clinlogDataQueryResults
          ?.map(
            (record) =>
              record["recordTreatmentSurgeons"]?.map(
                (surgeon) => surgeon.fullName,
              ), // Extract the IDs of the surgeons
          )
          .flat(),
      ),
    ]?.filter((surgeon) => surgeon !== null && surgeon !== undefined);
  }, [clinlogDataQueryResults]);

  const implantLineOptions = useMemo(() => {
    return [
      ...new Set(
        clinlogDataQueryResults
          ?.map((record) => {
            const allSites =
              record.attachedDentalCharts?.[0]?.proposedTreatmentToothMatrix?.filter(
                (site) => site.treatmentItemNumber === "688",
              );
            return allSites?.map(
              (site) => site.attachedSiteSpecificRecords?.[0]?.implantLine,
            );
          })
          .flat(),
      ),
      ,
      "Not Recorded",
    ]?.filter(
      (implantLine) => implantLine !== null && implantLine !== undefined,
    );
  }, [clinlogDataQueryResults]);

  const [xaxis, setXaxis] = useState([]);
  const getMonths = (num) => {
    const xaxisMonths = [];
    const months = [];
    const today = new Date();

    for (let i = 0; i < num; i++) {
      const month = subMonths(today, i);
      xaxisMonths.push(format(month, "MMM yyyy"));
      const monthYear = format(month, "MMM yyyy");
      months.push(monthYear);
    }
    setXaxis(xaxisMonths.reverse());
    //return months.reverse();
  };
  useEffect(() => {
    getMonths(12);
  }, []);
  useEffect(() => {
    if (isBase) {
      setOpenMenu(false);
    } else {
      setOpenMenu(true);
    }
  }, [isBase]);
  const [pagination, setPagination] = useState({
    pageSize: 20,
    pageIndex: 0,
  });
  // Selected case ids (kept by record id so selection survives new batches,
  // sorting and paging).
  const [rowSelection, setRowSelection] = useState({});
  // Cases sent from All Cases to the Data Tool ("Analyse selected").
  const [dataToolCaseIds, setDataToolCaseIds] = useState<string[] | null>(null);
  const [globalFilter, setGlobalFilter] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({
    caseNumber: true,
    patientName: true,
    fullName: false,
    status: true,
    images: true,
    recordTreatmentDate: true,
    tools: true,
    sex: false,
    ageAtTimeOfSurgery: false,
    archType: false,
    treatmentTitle: false,
    edentulous: false,
    treatmentPlannedBy: false,
    diabetesAndOsteoporosis: false,
    oestrogen: false,
    smoking: false,
    alcohol: false,
    oralHygiene: false,
    bruxism: false,
    diagnosisOrAetiology: false,
    upperArchCondition: false,
    lowerArchCondition: false,
    zygomaImplants: false,
    regularImplants: false,
    totalImplants: false,
    immediateRestoration: false,
    dateOfInsertion: false,
    timeFromSurgery: false,
    immediateFunctionSpeech: false,
    immediateAesthetics: false,
    examiner: false,
    numberOfReviews: true,
    numberOfRestorativeBreakages: false,
    examinerRadiographic: false,
    zirconiaUpgrade: false,
    dateOfFollowUp: true,
    smokingAtFollowUp: false,
    hygieneAtFollowUp: false,
    performanceOverFollowUpPeriod: false,
    toothValue: false,
    implantBrand: false,
    implantType: false,
    implantLength: false,
    angleCorrectionAbutment: false,
    placement: false,
    trabecularBoneDensity: false,
    boneVascularity: false,
    graftingApplied: false,
    graftMaterial: false,
    intraOperativeSinusComplications: false,
    crestalRest: false,
    insertionTorque: false,
    relevantBoneWidth: false,
    preOperativeSinusDisease: false,
    conformanceWithTreatmentPlan: false,
    preOperativeSinusDiseaseManagement: false,
    recordTreatmentSurgeons: true,
    recordClinic: false,
    recordFollowUpDate: false,
    implantFunctionAtFollowUp: false,
    abutmentFunctionAtFollowUp: false,
    sinusitis: false,
    facialSwelling: false,
    inflammation: false,
    pain: false,
    suppuration: false,
    recession: false,
    timeFromSurgery_fs: false,
    midShaftSoftTissueDehiscence: false,
    firstAbutmentLevelComplication: false,
    otherAbutmentLevelComplications: false,
    totalNumberOfAbutmentLevelComplications: false,
    dateOfFirstAbutmentLevelComplication: false,
    firstAbutmentLevelComplicationTimeFromSurgery: false,
    postOperativeSinusDisease: false,
    boneLoss: false,
    surveyDate: false,
    timeFromSurgery_ps: false,
    patientSatisfactionAesthetic: false,
    patientSatisfactionFunction: false,
    patientSatisfactionMaintenance: false,
    patientSatisfactionTreatment: false,
    postOpPain: false,
    smoking_ps: false,
    implantCategory: false,
    implantLine: false,
    graftConditionAtFollowUp: false,
    prostheticUpgrades: false,
    dateOfProstheticUpgrade: false,
  });
  const selectTypeFilterFunction = (actualValue, filterValue, condition) => {
    if (
      condition === "hasAValue" &&
      actualValue &&
      actualValue !== "" &&
      actualValue !== null &&
      actualValue?.replaceAll(",", "") !== ""
    ) {
      return true;
    }

    if (
      condition === "isEmpty" &&
      (actualValue === "" ||
        actualValue === null ||
        actualValue?.replaceAll(",", "") === "")
    ) {
      return true;
    }

    if (condition === "isOneOf") {
      return (
        filterValue.map((val) => val?.value).includes(actualValue) ||
        filterValue.some((val) =>
          actualValue?.split(",")?.includes(val?.value?.replaceAll(",", "")),
        )
      );
    }
    if (condition === "isNotOneOf") {
      // return !filterValue.map((val) => val.value).includes(actualValue);
      return !filterValue.some((val) =>
        actualValue?.split(",").includes(val?.value?.replaceAll(",", "")),
      );
    }
    if (condition === "" && filterValue.length === 0) {
      return true;
    }
    return false;
  };
  const numberTypeFilterFunction = (
    actualValue,
    filterValue,
    toValue,
    condition,
  ) => {
    if (condition === "hasAValue" && actualValue) {
      return true;
    }

    if (condition === "isEmpty" && (actualValue === null || actualValue < 0)) {
      return true;
    }

    if (condition === "equals") {
      const value = filterValue?.[0];

      return actualValue && actualValue === value;
    }
    if (condition === "notEquals") {
      const value = filterValue?.[0];
      return actualValue && actualValue !== value;
    }
    if (condition === "isGreaterThan") {
      const value = filterValue?.[0];
      return actualValue && actualValue > value;
    }
    if (condition === "isGreaterThanOrEquals") {
      const value = filterValue?.[0];
      return actualValue && actualValue >= value;
    }
    if (condition === "isLessThan") {
      const value = filterValue?.[0];
      return actualValue && actualValue < value;
    }
    if (condition === "isLessThanOrEquals") {
      const value = filterValue?.[0];
      return actualValue && actualValue <= value;
    }
    if (condition === "isBetween") {
      const fromValue = filterValue?.[0];
      const toValue_ = toValue?.[0];
      return actualValue && actualValue >= fromValue && actualValue <= toValue_;
    }
    if (condition === "" && filterValue.length === 0) {
      return true;
    }
    return false;
  };
  const stringTypeFilterFunction = (actualValue, filterValue, condition) => {
    if (
      condition === "hasAValue" &&
      actualValue &&
      actualValue !== "" &&
      actualValue !== null &&
      actualValue?.replaceAll(",", "")?.replaceAll("NaN", "") !== ""
    ) {
      return true;
    }

    if (
      condition === "isEmpty" &&
      (actualValue === "" ||
        actualValue === null ||
        actualValue?.replaceAll(",", "")?.replaceAll("NaN", "") === "")
    ) {
      return true;
    }
  };

  const dateTypeFilterFunction = (
    actualValue,
    filterValue,
    toValue,
    condition,
  ) => {
    if (condition === "hasAValue" && actualValue) {
      return true;
    }

    if (
      condition === "isEmpty" &&
      (actualValue === "" || actualValue === null)
    ) {
      return true;
    }

    if (condition === "isBefore" && actualValue) {
      const dateValue = filterValue?.[0];

      return isBefore(new Date(actualValue), new Date(dateValue));
    }
    if (condition === "isAfter" && actualValue) {
      const dateValue = filterValue?.[0];
      return isAfter(new Date(actualValue), new Date(dateValue));
    }

    if (
      condition === "isBetween" &&
      filterValue.length > 0 &&
      toValue.length > 0 &&
      actualValue
    ) {
      const dateFromValue = filterValue?.[0];
      const dateToValue = toValue?.[0];
      return (
        isAfter(new Date(actualValue), new Date(dateFromValue)) &&
        isBefore(new Date(actualValue), new Date(dateToValue))
      );
    }
    if (condition === "" && filterValue.length === 0) {
      return true;
    }

    return false;
  };

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const columnHelper = createColumnHelper<any>();
  const columns = useMemo(
    () => [
      {
        accessorKey: "caseNumber",
        id: "caseNumber",
        header: "Case Number",
        cell: (row) => {
          return row?.row?.original?.caseNumber?.length > 0
            ? `${row.row.original.caseNumber} / SCR${row.row.original.id}`
            : `SCR${row.row.original.id}`;
        },
      },
      {
        accessorKey: "patientName",
        id: "patientName",
        header: "Patient Name",
        cell: (row) => {
          return `${row.row.original.patientName} (${
            row.row.original.caseNumber || "-"
          })`;
        },
        filterFn: (row, columnId, filterValue) => {
          const patientName = `${row.original.patientName} (${
            row.original.caseNumber || "-"
          })`;

          return patientName.toLowerCase().includes(filterValue.toLowerCase());
        },
      },
      {
        accessorKey: "fullName",
        id: "fullName",
        header: "Full Name",
        cell: (row) => {
          return (
            row.row.original.recordFirstName +
            " " +
            row.row.original.recordLastName
          );
        },
      },
      {
        id: "status",
        header: "Data Status",
        cell: (row) => {
          const status =
            row.row.original.__dataStatus ??
            getRecordDataStatus(row.row.original);
          return (
            <Flex w="100%" align={"center"} justify={"center"}>
              <Box
                w="12px"
                h="12px"
                borderRadius={"full"}
                bgColor={
                  status === "completed"
                    ? "#4ADE80"
                    : status === "inProgress"
                      ? "orange.400"
                      : "red.400"
                }
                title={
                  status === "completed"
                    ? "All data complete"
                    : status === "inProgress"
                      ? "Some data missing"
                      : "No data"
                }
                aria-label={
                  status === "completed"
                    ? "All data complete"
                    : status === "inProgress"
                      ? "Some data missing"
                      : "No data"
                }
              ></Box>
            </Flex>
          );
        },
      },
      // {
      //   id: "images",
      //   header: "Images",
      //   cell: (row) => {
      //     return (
      //       <Box
      //         w="15px"
      //         h="15px"
      //         borderRadius={"full"}
      //         bgColor={"green.400"}
      //       ></Box>
      //     );
      //   },
      // },
      {
        accessorKey: "recordTreatmentDate",
        id: "recordTreatmentDate",
        header: "Surgery Date",

        cell: (row) => {
          const chartData = row?.row?.original?.attachedDentalCharts?.[0];

          const cellValue = chartData?.recordTreatmentDate
            ? format(new Date(chartData?.recordTreatmentDate), "yyyy-MM-dd")
            : row?.row.original?.recordTreatmentDate
              ? format(
                  new Date(row?.row.original?.recordTreatmentDate),
                  "yyyy-MM-dd",
                )
              : "N/A";
          return cellValue;
        },
      },
      {
        accessorKey: "recordTreatmentSurgeons",
        id: "recordTreatmentSurgeons",
        header: "Surgeon",
        cell: (row) => {
          if (row.row.original.recordTreatmentSurgeons?.length > 0) {
            return (
              <Flex flexDirection={"column"} gap="0.1rem" w="100%">
                {row.row.original.recordTreatmentSurgeons?.map((surgeon, i) => (
                  <Text key={i} w="70%">
                    Dr. {surgeon.fullName}
                  </Text>
                )) || "N/A"}
              </Flex>
            );
          } else {
            return (
              <Flex flexDirection={"column"} gap="0.1rem" w="100%">
                {row.row.original.attachedDentalCharts?.[0]?.defaultDentist?.map(
                  (surgeon, i) => (
                    <Text key={i} w="70%">
                      Dr. {surgeon.fullName}
                    </Text>
                  ),
                ) || "N/A"}
              </Flex>
            );
          }
        },
      },
      // {
      //   id: "tools",
      //   header: "Tools",
      //   cell: (row) => {
      //     return (
      //       <Button bg="none" _hover={{ bg: "none" }}>
      //         <chakra.span
      //           fontSize={{ base: "18px", md: "22px" }}
      //           className="material-symbols-outlined"
      //           color={"#007AFF"}
      //         >
      //           delete
      //         </chakra.span>
      //       </Button>
      //     );
      //   },
      // },
      {
        id: "sex",
        accessorKey: "sex",
        header: "Gender",
        cell: (row) => {
          return row.row.original.sex;
        },
        // filterFn: (row, columnId, filterValue) => {
        //   const gender = row.original.sex;
        //   return selectTypeFilterFunction(
        //     gender,
        //     filterValue?.value,
        //     filterValue?.condition
        //   );
        // },
      },
      {
        id: "ageAtTimeOfSurgery",
        accessorKey: "ageAtTimeOfSurgery",
        header: "Age At Time Of Surgery",
        cell: (row) => {
          return row.row.original.ageAtTimeOfSurgery;
        },
        filterFn: (row, columnId, filterValue) => {
          const age = row.original.ageAtTimeOfSurgery
            ? Number(row.original.ageAtTimeOfSurgery)
            : null;
          return numberTypeFilterFunction(
            age,
            filterValue?.value,
            filterValue?.toValue,
            filterValue?.condition,
          );
        },
      },
      {
        header: "Arch Type",
        accessorKey: "archType",
        id: "archType",
        cell: (row) => {
          // Readable label ("Upper & Lower"); also no longer crashes when the
          // arch type is empty.
          const archType = row.row.original.archType;
          return archType ? optionLabel("archType", archType) : "N/A";
        },
        filterFn: (row, columnId, filterValue) => {
          const archType = row.original.archType;
          return selectTypeFilterFunction(
            archType,
            filterValue?.value,
            filterValue?.condition,
          );
        },
      },
      {
        id: "treatmentTitle",
        accessorKey: "treatmentTitle",
        header: "Treatment",
        cell: (row) => {
          return row.row.original.treatmentTitle;
        },
        filterFn: (row, columnId, filterValue) => {
          const treatment = row.original.treatmentTitle;
          return selectTypeFilterFunction(
            treatment,
            filterValue?.value,
            filterValue?.condition,
          );
        },
      },
      {
        id: "edentulous",
        accessorKey: "edentulous",
        header: "Edentulous",
        cell: (row) => {
          return row.row.original.edentulous;
        },
        filterFn: (row, columnId, filterValue) => {
          const edentulous = row.original.edentulous;
          return selectTypeFilterFunction(
            edentulous,
            filterValue?.value,
            filterValue?.condition,
          );
        },
      },

      {
        id: "treatmentPlannedBy",
        accessorKey: "treatmentPlannedBy",
        header: "Treatment Planned By",
        cell: (row) => {
          return row.row.original.treatmentPlannedBy;
        },
        filterFn: (row, columnId, filterValue) => {
          const treatmentPlannedBy = row.original.treatmentPlannedBy;
          return selectTypeFilterFunction(
            treatmentPlannedBy,
            filterValue?.value,
            filterValue?.condition,
          );
        },
      },
      {
        id: "diabetesAndOsteoporosis",
        accessorKey: "diabetesAndOsteoporosis",
        header: "Diabetes & Osteoporosis",
        cell: (row) => {
          return row.row.original.diabetesAndOsteoporosis;
        },
        filterFn: (row, columnId, filterValue) => {
          const diabetesAndOsteoporosis = row.original.diabetesAndOsteoporosis;
          return selectTypeFilterFunction(
            diabetesAndOsteoporosis,
            filterValue?.value,
            filterValue?.condition,
          );
        },
      },
      {
        id: "oestrogen",
        accessorKey: "oestrogen",
        header: "Oestrogen",
        cell: (row) => {
          return row.row.original.oestrogen?.toUpperCase();
        },
        filterFn: (row, columnId, filterValue) => {
          const oestrogen = row.original.oestrogen;
          return selectTypeFilterFunction(
            oestrogen,
            filterValue?.value,
            filterValue?.condition,
          );
        },
      },
      {
        id: "smoking",
        accessorKey: "smoking",
        header: "Smoking",
        cell: (row) => {
          return row.row.original.smoking;
        },
        filterFn: (row, columnId, filterValue) => {
          const smoking = row.original.smoking;
          return selectTypeFilterFunction(
            smoking,
            filterValue?.value,
            filterValue?.condition,
          );
        },
      },
      {
        id: "alcohol",
        accessorKey: "alcohol",
        header: "Alcohol",
        cell: (row) => {
          return row.row.original.alcohol;
        },
        filterFn: (row, columnId, filterValue) => {
          const alcohol = row.original.alcohol;
          return selectTypeFilterFunction(
            alcohol,
            filterValue?.value,
            filterValue?.condition,
          );
        },
      },
      {
        id: "oralHygiene",
        accessorKey: "oralHygiene",
        header: "Oral Hygiene",
        cell: (row) => {
          return row.row.original.oralHygiene;
        },
        filterFn: (row, columnId, filterValue) => {
          const oralHygiene = row.original.oralHygiene;
          return selectTypeFilterFunction(
            oralHygiene,
            filterValue?.value,
            filterValue?.condition,
          );
        },
      },
      {
        id: "bruxism",
        accessorKey: "bruxism",
        header: "Bruxism",
        cell: (row) => {
          return row.row.original.bruxism;
        },
        filterFn: (row, columnId, filterValue) => {
          const bruxism = row.original.bruxism;
          return selectTypeFilterFunction(
            bruxism,
            filterValue?.value,
            filterValue?.condition,
          );
        },
      },
      {
        id: "diagnosisOrAetiology",
        accessorKey: "diagnosisOrAetiology",
        header: "Diagnosis Or Aetiology",
        cell: (row) => {
          return row.row.original.diagnosisOrAetiology;
        },
        filterFn: (row, columnId, filterValue) => {
          const diagnosisOrAetiology = row.original.diagnosisOrAetiology;
          return selectTypeFilterFunction(
            diagnosisOrAetiology,
            filterValue?.value,
            filterValue?.condition,
          );
        },
      },
      {
        id: "upperArchCondition",
        accessorKey: "upperArchCondition",
        header: "Upper Arch Condition",
        cell: (row) => {
          return row.row.original.upperArchCondition;
        },
        filterFn: (row, columnId, filterValue) => {
          const upperArchCondition = row.original.upperArchCondition;
          return selectTypeFilterFunction(
            upperArchCondition,
            filterValue?.value,
            filterValue?.condition,
          );
        },
      },
      {
        id: "lowerArchCondition",
        accessorKey: "lowerArchCondition",
        header: "Opposing Arch Condition",
        cell: (row) => {
          return row.row.original.lowerArchCondition;
        },
        filterFn: (row, columnId, filterValue) => {
          const lowerArchCondition = row.original.lowerArchCondition;
          return selectTypeFilterFunction(
            lowerArchCondition,
            filterValue?.value,
            filterValue?.condition,
          );
        },
      },
      {
        id: "zygomaImplants",
        accessorKey: "zygomaImplants",
        header: "Zygoma Implants",
        cell: (row) => {
          const siteDetails =
            row.row.original.attachedDentalCharts?.[0]?.proposedTreatmentToothMatrix?.filter(
              (site) => site.treatmentItemNumber === "688",
            );
          const zygomaImplants =
            siteDetails?.filter((site) =>
              site.attachedSiteSpecificRecords?.[0]?.implantCategory?.includes(
                "zygomatic",
              ),
            )?.length || 0;
          return zygomaImplants;
        },
        filterFn: (row, columnId, filterValue) => {
          const siteDetails =
            row.original.attachedDentalCharts?.[0]?.proposedTreatmentToothMatrix?.filter(
              (site) => site.treatmentItemNumber === "688",
            );
          const zygomaImplants = siteDetails?.filter((site) =>
            site.attachedSiteSpecificRecords?.[0]?.implantCategory?.includes(
              "zygomatic",
            ),
          )?.length;
          //const zygomaImplants = Number(row.original.zygomaImplants);

          return numberTypeFilterFunction(
            zygomaImplants,
            filterValue?.value,
            filterValue?.toValue,
            filterValue?.condition,
          );
        },
      },

      {
        id: "regularImplants",
        accessorKey: "regularImplants",
        header: "Regular Implants",
        cell: (row) => {
          const siteDetails =
            row.row.original.attachedDentalCharts?.[0]?.proposedTreatmentToothMatrix?.filter(
              (site) => site.treatmentItemNumber === "688",
            );
          const regularImplants =
            siteDetails?.filter(
              (site) =>
                !site.attachedSiteSpecificRecords?.[0]?.implantCategory?.includes(
                  "zygomatic",
                ),
            )?.length || 0;
          return regularImplants;
        },
        filterFn: (row, columnId, filterValue) => {
          const siteDetails =
            row.original.attachedDentalCharts?.[0]?.proposedTreatmentToothMatrix?.filter(
              (site) => site.treatmentItemNumber === "688",
            );
          const regularImplants =
            siteDetails?.filter(
              (site) =>
                !site.attachedSiteSpecificRecords?.[0]?.implantCategory?.includes(
                  "zygomatic",
                ),
            )?.length || 0;
          // const regularImplants = Number(row.original.regularImplants);

          return numberTypeFilterFunction(
            regularImplants,
            filterValue?.value,
            filterValue?.toValue,
            filterValue?.condition,
          );
        },
      },

      {
        id: "totalImplants",
        accessorKey: "totalImplants",
        header: "Total Implants",
        cell: (row) => {
          const siteDetails =
            row.row.original.attachedDentalCharts?.[0]?.proposedTreatmentToothMatrix?.filter(
              (site) => site.treatmentItemNumber === "688",
            );
          const regularImplants =
            siteDetails?.filter(
              (site) =>
                !site.attachedSiteSpecificRecords?.[0]?.implantCategory?.includes(
                  "zygomatic",
                ),
            )?.length || 0;
          const zygomaImplants =
            siteDetails?.filter((site) =>
              site.attachedSiteSpecificRecords?.[0]?.implantCategory?.includes(
                "zygomatic",
              ),
            )?.length || 0;

          // const zygomaImplants = Number(row.row.original.zygomaImplants) || 0;
          // const regularImplants = Number(row.row.original.regularImplants) || 0;
          return zygomaImplants + regularImplants;
        },
      },
      {
        id: "immediateRestoration",
        accessorKey: "immediateRestoration",
        header: "Immediate Restoration",
        cell: (row) => {
          return row.row.original.immediateRestoration;
        },
        filterFn: (row, columnId, filterValue) => {
          const immediateRestoration = row.original.immediateRestoration;
          return selectTypeFilterFunction(
            immediateRestoration,
            filterValue?.value,
            filterValue?.condition,
          );
        },
      },
      {
        id: "dateOfInsertion",
        accessorKey: "dateOfInsertion",
        header: "Date Of Insertion",
        cell: (row) => {
          const cellValue = row?.row.original?.dateOfInsertion
            ? format(new Date(row?.row.original?.dateOfInsertion), "yyyy-MM-dd")
            : "N/A";
          return cellValue;
        },
        filterFn: (row, columnId, filterValue) => {
          const dateOfInsertion = row.original.dateOfInsertion
            ? format(new Date(row.original.dateOfInsertion), "yyyy-MM-dd")
            : null;
          return dateTypeFilterFunction(
            dateOfInsertion,
            filterValue?.value,
            filterValue?.toValue,
            filterValue?.condition,
          );
        },
      },
      {
        id: "timeFromSurgery",
        accessorKey: "timeFromSurgery",
        header: "Time from Surgery to Insertion (days)",
        cell: (row) => {
          const chartData = row?.row?.original?.attachedDentalCharts?.[0];
          const surgeryDate =
            chartData?.recordTreatmentDate ||
            row?.row.original?.recordTreatmentDate;

          const timeDiff =
            row.row.original.dateOfInsertion && surgeryDate
              ? differenceInDays(
                  new Date(
                    format(
                      new Date(row.row.original.dateOfInsertion),
                      "yyyy-MM-dd",
                    ),
                  ),
                  new Date(format(new Date(surgeryDate), "yyyy-MM-dd")),
                )
              : null;

          return timeDiff > 0 ? timeDiff : "";
        },
        filterFn: (row, columnId, filterValue) => {
          const chartData = row?.original?.attachedDentalCharts?.[0];
          const surgeryDate =
            chartData?.recordTreatmentDate || row.original?.recordTreatmentDate;
          const timeDiff =
            row.original.dateOfInsertion && surgeryDate
              ? differenceInDays(
                  new Date(
                    format(
                      new Date(row.original.dateOfInsertion),
                      "yyyy-MM-dd",
                    ),
                  ),
                  new Date(format(new Date(surgeryDate), "yyyy-MM-dd")),
                )
              : null;

          return numberTypeFilterFunction(
            timeDiff > 0 ? timeDiff : null,
            filterValue?.value,
            filterValue?.toValue,
            filterValue?.condition,
          );
        },
      },
      {
        id: "immediateFunctionSpeech",
        accessorKey: "immediateFunctionSpeech",
        header: "Immediate Function Speech",
        cell: (row) => {
          return row.row.original.immediateFunctionSpeech;
        },
        filterFn: (row, columnId, filterValue) => {
          const immediateFunctionSpeech = row.original.immediateFunctionSpeech;
          return selectTypeFilterFunction(
            immediateFunctionSpeech,
            filterValue?.value,
            filterValue?.condition,
          );
        },
      },
      {
        id: "immediateAesthetics",
        accessorKey: "immediateAesthetics",
        header: "Immediate Aesthetics",
        cell: (row) => {
          return row.row.original.immediateAesthetics;
        },
        filterFn: (row, columnId, filterValue) => {
          const immediateAesthetics = row.original.immediateAesthetics;
          return selectTypeFilterFunction(
            immediateAesthetics,
            filterValue?.value,
            filterValue?.condition,
          );
        },
      },
      {
        id: "recordClinic",
        accessorKey: "recordClinic",
        header: "Location",
        cell: (row) => {
          return row?.row?.original?.recordClinic
            ?.map((clinic) => clinic?.locationShortName)
            .join(", ");
        },
        filterFn: (row, columnId, filterValue) => {
          const recordClinic = row.original.recordClinic
            ?.map((clinic) => clinic.id)
            .join(",");

          return selectTypeFilterFunction(
            recordClinic,
            filterValue?.value,
            filterValue?.condition,
          );
        },
      },
      ...clinlogFilterColumns
        .filter((column) =>
          ["followUp", "siteSpecificCharacteristics", "patientSurvey"].includes(
            column.group,
          ),
        )
        ?.map((column) => ({
          id: `${column.key}`,
          accessorKey: `${column.key}_${column.group}`,
          header:
            column.key === "dateOfFollowUp"
              ? "Date of Last Review"
              : column.label,
          cell: (row) => {
            if (column.group === "followUp") {
              const followUpData = row.row.original.recordFollowUpMatrix?.[0];
              if (column.key === "numberOfReviews") {
                return (
                  followUpData?.[column.key] ||
                  row.row.original.recordFollowUpMatrix?.length
                );
              }
              if (column.key === "dateOfFollowUp") {
                return followUpData?.[column.key]
                  ? format(new Date(followUpData?.[column.key]), "yyyy-MM-dd")
                  : "N/A";
              }
              return followUpData?.[column.key?.split("_")?.[0]] || "N/A";
            } else if (column.group === "siteSpecificCharacteristics") {
              const siteDetails =
                row.row.original.attachedDentalCharts?.[0]?.proposedTreatmentToothMatrix?.filter(
                  (site) => site.treatmentItemNumber === "688",
                );

              const siteSpecificData = siteDetails?.map((site) => {
                if (column.key === "toothValue") {
                  return site.toothValue;
                } else if (column?.subGroup === "ssFollowUp") {
                  const siteFollowUpRecords = latestSiteFollowUp(site);
                  if (column.type === "date") {
                    return siteFollowUpRecords?.[column.key]
                      ? format(
                          new Date(siteFollowUpRecords?.[column.key]),
                          "dd-MM-yyyy",
                        )
                      : "";
                  }

                  return siteFollowUpRecords?.[column.key] || "-";
                } else if (column.key === "implantCategory") {
                  const implantCategory =
                    site?.attachedSiteSpecificRecords?.[0]
                      ?.implantCategoryLabel;
                  return implantCategory || "-";
                }
                return site.attachedSiteSpecificRecords?.[0]?.[column.key];
              });

              return siteSpecificData?.map((data, index) => {
                return <Box key={index}>{data || "-"}</Box>;
              });
            } else if (column.group === "patientSurvey") {
              const patientSurveyData = surveyByRecordId.get(
                String(row.row.original.id),
              );
              if (column.type === "date") {
                return patientSurveyData?.[column.key]
                  ? format(
                      new Date(patientSurveyData?.[column.key]),
                      "dd-MM-yyyy",
                    )
                  : "";
              }

              return patientSurveyData?.[column.key?.split("_")?.[0]] || "";
            }
            return "";
          },
          enableSorting: false,
          enableHiding: true,
          filterFn: (row, columnId, filterValue) => {
            let cellValue = "";
            if (column.group === "followUp") {
              const followUpData = row.original.recordFollowUpMatrix?.[0];
              cellValue = followUpData?.[column.key];
            } else if (column.group === "siteSpecificCharacteristics") {
              const siteDetails =
                row.original.attachedDentalCharts?.[0]?.proposedTreatmentToothMatrix?.filter(
                  (site) => site.treatmentItemNumber === "688",
                );
              const siteSpecificData = siteDetails?.map((site) => {
                if (column.key === "toothValue") {
                  return site.toothValue;
                } else if (column?.subGroup === "ssFollowUp") {
                  const siteFollowUpRecords =
                    site?.attachedSiteSpecificRecords?.[0]
                      ?.attachedSiteSpecificFollowUp?.[0];
                  if (column.type === "date") {
                    return siteFollowUpRecords?.[column.key]
                      ? format(
                          new Date(siteFollowUpRecords?.[column.key]),
                          "dd-MM-yyyy",
                        )
                      : "";
                  }

                  return siteFollowUpRecords?.[column.key];
                }
                return site.attachedSiteSpecificRecords?.[0]?.[column.key];
              });
              cellValue = siteSpecificData?.join(",");
            }

            if (column.type === "select") {
              return selectTypeFilterFunction(
                cellValue,
                filterValue?.value,
                filterValue?.condition,
              );
            } else if (column.type === "number") {
              return numberTypeFilterFunction(
                Number(cellValue) || null,
                filterValue?.value,
                filterValue?.toValue,
                filterValue?.condition,
              );
            } else {
              return true;
            }
          },
        })),
    ],
    [surveyByRecordId],
  );
  function evaluateConditions(conditions) {
    if (!conditions.length) return true;

    let result = conditions[0]?.isTrue;
    if (conditions.length === 1) return result;
    for (let i = 1; i < conditions.length; i++) {
      const operation = conditions[i - 1].operation;

      const isTrue = conditions[i].isTrue;

      if (operation.toLowerCase() === "and") {
        result = result && isTrue;
      } else if (operation.toLowerCase() === "or") {
        result = result || isTrue;
      } else {
        // throw new Error(`Unknown operation: ${current.operation}`)
      }
    }

    return result;
  }
  const tableData = useMemo(() => {
    return clinlogDataQueryResults?.map((entry) => {
      const lastNamePrefix = entry.recordLastName?.slice(0, 2) || "";
      const firstNamePrefix = entry.recordFirstName?.slice(0, 2) || "";

      return {
        ...entry,
        patientName: `${lastNamePrefix}, ${firstNamePrefix}`,
        __dataStatus: getRecordDataStatus(entry),
      };
    });
  }, [clinlogDataQueryResults]);

  const locationOptions = useMemo(() => {
    const locationMap = new Map();

    tableData?.forEach((entry) => {
      entry.recordClinic?.forEach((clinic) => {
        if (!clinic?.id) return;

        locationMap.set(clinic.id.toString(), {
          value: clinic.id.toString(),
          label:
            clinic.locationShortName || clinic.title || clinic.id.toString(),
        });
      });
    });

    return Array.from(locationMap.values()).sort((a, b) =>
      a.label.localeCompare(b.label),
    );
  }, [tableData]);

  const globalFilterFunction = useCallback(
    (row, columnId, filters) => {
      const conditionChecks = filters.map((filter) => {
        const filterValue = filter.value.value;
        const condition = filter.value.condition;
        const filterColumnId = filter.id;
        const columnMeta = clinlogColumnMeta.get(filterColumnId);
        const group = columnMeta?.group;
        const subGroup = columnMeta?.subGroup;
        const type = columnMeta?.type;
        let cellValue: any;
        if (group === "followUp") {
          const followUpData = row.original.recordFollowUpMatrix?.[0];
          if (filterColumnId === "numberOfReviews") {
            cellValue =
              followUpData?.[filterColumnId?.split("_")?.[0]] ||
              row.original?.recordFollowUpMatrix?.length;
          } else {
            cellValue = followUpData?.[filterColumnId?.split("_")?.[0]];
          }
        } else if (group === "siteSpecificCharacteristics") {
          const siteDetails =
            row.original.attachedDentalCharts?.[0]?.proposedTreatmentToothMatrix?.filter(
              (site) => site?.treatmentItemNumber === "688",
            );
          const siteSpecificData = siteDetails?.map((site) => {
            if (filterColumnId === "toothValue") {
              return site.toothValue;
            } else if (subGroup === "ssFollowUp") {
              const siteFollowUpRecords =
                site?.attachedSiteSpecificRecords?.[0]
                  ?.attachedSiteSpecificFollowUp?.[0];

              return siteFollowUpRecords?.[filterColumnId]?.replaceAll(",", "");
            }
            return site.attachedSiteSpecificRecords?.[0]?.[
              filterColumnId
            ]?.replaceAll(",", "");
          });
          cellValue = siteSpecificData?.join(",");
        } else if (group === "patientSurvey") {
          const patientSurveyData = surveyByRecordId.get(
            String(row.original.id),
          );
          cellValue =
            patientSurveyData?.[filterColumnId?.split("_")?.[0]] || null;
        } else {
          if (filterColumnId === "recordTreatmentSurgeons") {
            cellValue =
              row.original?.recordTreatmentSurgeons?.length > 0
                ? row.original?.recordTreatmentSurgeons
                    ?.map((surgeon) => surgeon?.fullName)
                    ?.join(",")
                : row?.original?.attachedDentalCharts?.[0]?.defaultDentist
                    ?.map((surgeon) => surgeon?.fullName)
                    ?.join(",") || null;
          } else if (filterColumnId === "recordTreatmentDate") {
            const chartData = row?.original?.attachedDentalCharts?.[0];
            cellValue = chartData?.recordTreatmentDate
              ? format(new Date(chartData?.recordTreatmentDate), "yyyy-MM-dd")
              : row?.original?.recordTreatmentDate
                ? format(
                    new Date(row?.original?.recordTreatmentDate),
                    "yyyy-MM-dd",
                  )
                : null;
          } else if (filterColumnId === "timeFromSurgery") {
            const chartData = row?.original?.attachedDentalCharts?.[0];
            const surgeryDate =
              chartData?.recordTreatmentDate ||
              row.original?.recordTreatmentDate;
            cellValue =
              row.original?.dateOfInsertion && surgeryDate
                ? differenceInDays(
                    new Date(
                      format(
                        new Date(row.original?.dateOfInsertion),
                        "yyyy-MM-dd",
                      ),
                    ),
                    new Date(format(new Date(surgeryDate), "yyyy-MM-dd")),
                  )
                : null;
          } else if (filterColumnId === "recordClinic") {
            cellValue =
              // Joined without spaces so multi-clinic records match
              // ("12, 34".split(",") left " 34" unmatched).
              row.original.recordClinic?.map((clinic) => clinic.id).join(",") ||
              null;
          } else if (filterColumnId === "zygomaImplants") {
            const siteDetails =
              row.original.attachedDentalCharts?.[0]?.proposedTreatmentToothMatrix?.filter(
                (site) => site.treatmentItemNumber === "688",
              );
            const zygomaImplants = siteDetails?.filter((site) =>
              site.attachedSiteSpecificRecords?.[0]?.implantCategory?.includes(
                "zygomatic",
              ),
            )?.length;
            cellValue = zygomaImplants || 0;
          } else if (filterColumnId === "regularImplants") {
            const siteDetails =
              row.original.attachedDentalCharts?.[0]?.proposedTreatmentToothMatrix?.filter(
                (site) => site.treatmentItemNumber === "688",
              );
            const regularImplants =
              siteDetails?.filter(
                (site) =>
                  !site.attachedSiteSpecificRecords?.[0]?.implantCategory?.includes(
                    "zygomatic",
                  ),
              )?.length || 0;
            cellValue = regularImplants;
          } else if (filterColumnId === "totalImplants") {
            const siteDetails =
              row.original.attachedDentalCharts?.[0]?.proposedTreatmentToothMatrix?.filter(
                (site) => site.treatmentItemNumber === "688",
              );
            const zygomaImplants = siteDetails?.filter((site) =>
              site.attachedSiteSpecificRecords?.[0]?.implantCategory?.includes(
                "zygomatic",
              ),
            )?.length;
            // Bug fix: `regularImplants` was not defined in this branch, so
            // filtering on Total Implants threw a ReferenceError.
            cellValue = siteDetails?.length || 0;
          } else {
            cellValue = row.original?.[filterColumnId] || null;
          }
        }
        if (type === "select") {
          return {
            operation: filter.value.operation || "AND",
            isTrue: selectTypeFilterFunction(cellValue, filterValue, condition),
          };
        } else if (type === "number") {
          return {
            operation: filter.value.operation || "AND",
            isTrue: numberTypeFilterFunction(
              Number(cellValue) || null,
              filterValue,
              filter?.value?.toValue,
              condition,
            ),
          };
        } else if (type === "date") {
          const dateValue = cellValue
            ? format(new Date(cellValue), "yyyy-MM-dd")
            : null;
          return {
            operation: filter.value.operation || "AND",
            isTrue: dateTypeFilterFunction(
              dateValue,
              filterValue,
              filter?.value?.toValue,
              condition,
            ),
          };
        } else if (type === "string") {
          return {
            operation: filter.value.operation || "AND",
            isTrue: stringTypeFilterFunction(cellValue, filterValue, condition),
          };
        }
      });
      return evaluateConditions(conditionChecks);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [surveyByRecordId],
  );

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      globalFilter,
      columnFilters,
      columnVisibility,
      pagination,
      sorting,
      rowSelection,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    getRowId: (row) => String(row.id),
    // The custom filter ignores the column id, so evaluate it once per row
    // (tanstack otherwise re-runs it for every column of every row that
    // doesn't match).
    getColumnCanGlobalFilter: (column) => column.id === "caseNumber",
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: globalFilterFunction,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    // Don't jump back to page 1 every time another batch of records arrives.
    // Page index is reset explicitly when search / filters change.
    autoResetPageIndex: false,
  });

  useEffect(() => {
    setPagination((prev) =>
      prev.pageIndex === 0 ? prev : { ...prev, pageIndex: 0 },
    );
  }, [columnFilters, globalFilter, sorting]);

  // Debounced case search so each keystroke doesn't re-filter every record.
  const [searchText, setSearchText] = useState("");
  useEffect(() => {
    const id = window.setTimeout(() => {
      const value = searchText.trim();
      setColumnFilters(value ? [{ id: "patientName", value }] : []);
    }, 250);
    return () => window.clearTimeout(id);
  }, [searchText]);

  // ---- Column picker + CSV export helpers --------------------------------
  const defaultVisibleColumnsRef = useRef(
    Object.keys(columnVisibility).filter((key) => columnVisibility[key]),
  );
  const columnGroups = useMemo(
    () => [{ value: "case", label: "Case" }, ...FIELD_GROUPS],
    [],
  );
  const columnItems = useMemo(
    () =>
      columns
        .filter((column) => column.id)
        .map((column) => ({
          id: column.id,
          label: typeof column.header === "string" ? column.header : column.id,
          group: getFieldMeta(column.id)?.group ?? "case",
        })),
    [columns],
  );
  const visibleColumnIds = useMemo(
    () =>
      columnItems
        .map((item) => item.id)
        .filter((id) => columnVisibility[id] !== false),
    [columnItems, columnVisibility],
  );
  const setVisibleColumns = useCallback(
    (ids: string[]) => {
      const next = {};
      columnItems.forEach((item) => {
        next[item.id] = ids.includes(item.id);
      });
      setColumnVisibility((prev) => ({ ...prev, ...next }));
    },
    [columnItems],
  );
  const exportRows = (rows) => {
    exportCasesCsv({
      records: rows.map((row) => row.original),
      columns: table.getVisibleLeafColumns().map((column) => ({
        id: column.id,
        label:
          typeof column.columnDef.header === "string"
            ? column.columnDef.header
            : column.id,
      })),
      ctx: {
        surgeonOptions,
        locationOptions,
        implantLineOptions,
        surveyByRecordId,
      },
    });
  };

  const handleFilter = (arrowClicked: string) => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    if (arrowClicked === "left") {
      let numOfPagesfiltered = Math.ceil(
        table.getFilteredRowModel().rows.length / 30,
      );
      //setPageCount(numOfPagesfiltered);
    } else if (arrowClicked === "right") {
      let numOfPagesfiltered = Math.ceil(
        table.getFilteredRowModel().rows.length / 30,
      );
      //setPageCount(numOfPagesfiltered);
    }
  };

  useEffect(() => {
    if (filterArray.length === 0 || filterArray[0].group === "") {
      setGlobalFilter([]);
    }
  }, [filterArray]);
  const slide = keyframes`
  0% { transform: translateX(-50%); }
  100% { transform: translateX(50%); }
`;
  const fadeInSlide = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;
  const tabsList = [
    { name: "allCases", label: "All Cases" },
    { name: "dataTool", label: "Data Tool" },
    //  { name: "implants", label: "Implants" },
  ];
  //const animation = `${fadeInSlide} 2s ease-in-out infinite`;

  const selectedPatientNotes = useMemo(() => {
    if (viewPatient && clinlogNotesQueryResult?.isSuccess) {
      const notes = clinlogNotesQueryResult.data?.recordNotes?.filter(
        (note) =>
          note.recordNoteRecord?.[0]?.id?.toString() ===
          viewPatient?.id?.toString(),
      );
      return notes;
    }
    return [];
  }, [viewPatient, clinlogNotesQueryResult?.data?.recordNotes]);

  const addClinlogNotesMutationFunction = useMutation(
    (newData: any) => sendData(clinlogNoteMutation, newData),
    {
      onMutate: () => {
        toastIdRef.current = toast({
          render: () => (
            <Flex
              justify="space-around"
              color="white"
              p={3}
              bg="blue.500"
              borderRadius="6px"
            >
              Adding Note...
              <Spinner color="white" />
            </Flex>
          ),
          duration: 2000,
          isClosable: true,
        });
      },
      onError: (err) => {
        toast.update(toastIdRef.current, {
          description: "Error Adding Note",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      },
      onSuccess: () => {
        toast.update(toastIdRef.current, {
          description: "Successfully Added Note",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      },
      onSettled: () => {
        onClose();
        setNewNote("");
        queryClient.invalidateQueries(["clinlogNotesQueryResult"]);
      },
    },
  );

  const handleAddNote = () => {
    const notesData = {
      recordNoteRecord: Number(viewPatient?.id),
      recordNoteNote: newNote,
      title: `Clinlog Notes - ${viewPatient?.patientName}`,
    };
    addClinlogNotesMutationFunction.mutate(notesData);
  };

  useEffect(() => {
    // Keep pulling batches until the server reports the end. Guarded by
    // isFetching/isError so we never cancel an in-flight request or loop on
    // a failing page.
    if (hasNextPage && !isFetching && !isError) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetching, isError, clinlogDataInfinite]);

  if (isError && clinlogDataQueryResults?.length === 0) {
    return (
      <ErrorState
        h="80vh"
        bgColor="surfaceSubtle"
        title="We couldn't load Clinlog records."
        onRetry={() => refetch()}
      />
    );
  }

  if (hasFinishedClinlogDataLoading && clinlogDataQueryResults?.length === 0) {
    return (
      <EmptyState
        h="80vh"
        bgColor="surfaceSubtle"
        title="No Clinlog records yet"
        description="Records with Clinlog enabled for your clinic will appear here."
      />
    );
  }

  return clinlogDataQueryResults?.length === 0 ? (
    <Flex h="100vh" w="100%" bgColor="#FCF8FF">
      <InitialLoader />
    </Flex>
  ) : (
    <Flex w="100%" flexDirection={"column"} bgColor="#FCF8FF" minH="100vh">
      <Flex
        w="100%"
        flexDirection={"column"}
        position={"sticky"}
        top="0"
        zIndex={"99"}
      >
        <Flex
          w="100%"
          bgColor="white"
          align="center"
          justify={"center"}
          position="sticky"
          p="2"
        >
          <Flex w="100%" align="start" py="10px" maxW="2000px" mx="auto">
            <Tabs
              variant="unstyled"
              w="100%"
              align={"start"}
              orientation={isBase ? "vertical" : "horizontal"}
            >
              <TabList
                w="100%"
                gap="8px"
                fontWeight="500"
                fontFamily="inter"
                color="#333333"
                bg="transparent"
                border="none"
              >
                {tabsList.map((tab, index) => (
                  <Tab
                    key={index}
                    fontSize={{ base: "12px", md: "11px", lg: "13px" }}
                    display={
                      isBase && openTab !== tab.name
                        ? collapseTabs
                          ? "none"
                          : "block"
                        : "block"
                    }
                    px={{ base: "16px", md: "20px", lg: "24px" }}
                    py="10px"
                    textTransform={"none"}
                    borderRadius="full"
                    color={openTab === tab.name ? "white" : "black"}
                    bgGradient={
                      openTab === tab.name
                        ? "linear-gradient(90deg, var(--clinlog-purple, #452A7E) 25%, #612ECC 100%)"
                        : undefined
                    }
                    bgColor={openTab === tab.name ? undefined : "#F5F5F5"}
                    fontWeight={openTab === tab.name ? "600" : "500"}
                    _hover={{
                      bgColor: openTab === tab.name ? undefined : "#E5E5E5",
                    }}
                    transition="all 0.2s"
                    onClick={() => {
                      setOpenTab(tab.name);
                      // if (collapseTabs) {
                      //   setCollapseTabs(!collapseTabs);
                      // }
                    }}
                    border="none"
                  >
                    <Flex align={"center"} gap="8px">
                      {/* <chakra.span
                        className="material-symbols-outlined"
                        fontSize="18px"
                        style={{
                          color: openTab === tab.name ? "#00D4FF" : "black",
                          fill: openTab === tab.name ? "#00D4FF" : "black",
                        }}
                      >
                        {tab.icon}
                      </chakra.span> */}
                      <Text
                        fontFamily={"inter"}
                        letterSpacing={"0px"}
                        fontWeight={openTab === tab.name ? "600" : "500"}
                        color={openTab === tab.name ? "white" : "black"}
                      >
                        {tab.label}
                      </Text>
                      <Spacer display={{ base: "block", md: "none" }} />
                      {/* <ChevronDownIcon
                        fontSize="28px"
                        display={
                          isBase && openTab === tab.name
                            ? "block"
                            : isBase && index === 0
                              ? "block"
                              : "none"
                        }
                      /> */}
                    </Flex>
                  </Tab>
                ))}
              </TabList>
            </Tabs>
            <Flex
              align="center"
              mt="2"
              minH="34px"
              w={{ base: "100%", md: "auto" }}
              aria-live="polite"
            >
              {isError && hasNextPage ? (
                <Flex
                  align="center"
                  gap="0.6rem"
                  px="3"
                  py="1.5"
                  border="1px solid"
                  borderColor="#FECACA"
                  borderRadius="8px"
                  bgColor="#FEF2F2"
                >
                  <Text fontSize="13px" fontWeight="700" color="#991B1B">
                    Some records failed to load
                  </Text>
                  <Text fontSize="12px" color="#991B1B">
                    {clinlogDataQueryResults.length} loaded
                  </Text>
                  <Button
                    size="xs"
                    colorScheme="red"
                    variant="outline"
                    onClick={() => fetchNextPage()}
                  >
                    Retry
                  </Button>
                </Flex>
              ) : hasNextPage ? (
                <Flex
                  align="center"
                  gap="0.6rem"
                  px="3"
                  py="1.5"
                  border="1px solid"
                  borderColor="#DDD6FE"
                  borderRadius="8px"
                  bgColor="#F7F3FF"
                >
                  <Spinner size="xs" thickness="2px" color="#351361" />
                  <Text
                    fontSize="13px"
                    fontWeight="700"
                    color="#351361"
                    whiteSpace="nowrap"
                  >
                    Loading records
                  </Text>
                  {
                    <Text
                      fontSize="12px"
                      fontWeight="700"
                      color="#351361"
                      fontVariantNumeric="tabular-nums"
                      whiteSpace="nowrap"
                    >
                      <ClinlogLoadTimer
                        startedAt={loadTiming.startedAt}
                        finishedAt={loadTiming.finishedAt}
                      />
                    </Text>
                  }
                  <Text
                    fontSize="12px"
                    fontWeight="600"
                    color="#5B4B77"
                    fontVariantNumeric="tabular-nums"
                    whiteSpace="nowrap"
                  >
                    {clinlogDataQueryResults.length} loaded
                  </Text>
                </Flex>
              ) : hasLoadedAllClinlogPages ? (
                <Flex
                  align="center"
                  gap="0.6rem"
                  px="3"
                  py="1.5"
                  border="1px solid"
                  borderColor="#BBF7D0"
                  borderRadius="8px"
                  bgColor="#F0FDF4"
                >
                  <Flex
                    align="center"
                    justify="center"
                    w="18px"
                    h="18px"
                    borderRadius="full"
                    bgColor="#16A34A"
                    color="white"
                  >
                    <CheckIcon boxSize="9px" />
                  </Flex>
                  <Text
                    fontSize="13px"
                    fontWeight="700"
                    color="#166534"
                    whiteSpace="nowrap"
                  >
                    All records loaded
                  </Text>
                  {
                    <Text
                      fontSize="12px"
                      fontWeight="700"
                      color="#166534"
                      fontVariantNumeric="tabular-nums"
                      whiteSpace="nowrap"
                    >
                      Loaded in{" "}
                      <ClinlogLoadTimer
                        startedAt={loadTiming.startedAt}
                        finishedAt={loadTiming.finishedAt}
                      />
                    </Text>
                  }
                  <Text
                    fontSize="12px"
                    fontWeight="600"
                    color="#3F7F52"
                    fontVariantNumeric="tabular-nums"
                    whiteSpace="nowrap"
                  >
                    {clinlogDataQueryResults.length} records
                  </Text>
                </Flex>
              ) : null}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <Flex p="2" w="100%" justify={"center"}>
        {/* {clinlogDataQueryResults.isLoading ? (
          <InitialLoader />
        ) : (
          <> */}
        {openTab === "demographics" && (
          <Flex w="100%" justify="center" ml={4}>
            <ClinlogDemoGraphics
              clinlogRecordDetails={clinlogDataQueryResults}
              xaxis={xaxis}
            />
          </Flex>
        )}
        {openTab === "preSurgical" && (
          <Flex w="100%" justify="center" ml={4}>
            <ClinlogPreSurgical
              clinlogRecordDetails={clinlogDataQueryResults}
            />
          </Flex>
        )}
        {openTab === "postSurgical" && (
          <Flex w="100%" justify="center" ml={4}>
            <ClinlogPostSurgical
              clinlogRecordDetails={clinlogDataQueryResults}
            />
          </Flex>
        )}
        {openTab === "habitsAndRisk" && (
          <Flex w="100%" justify="center" ml={4}>
            <ClinlogHabitsAndRiskFactors
              clinlogRecordDetails={clinlogDataQueryResults}
              filterColumns={clinlogFilterColumns}
            />
          </Flex>
        )}
        {openTab === "allCases" && (
          <Flex
            flexDirection={"column"}
            gap="1rem"
            w="100%"
            maxW={{ base: "100%", lg: "2000px" }}
            align={"center"}
          >
            {viewPatient ? (
              <Flex w="100%" height={"100%"}>
                {" "}
                <Flex direction="column" gap="1rem" w="80%" p="4">
                  <Flex w="100%" gap="0.5rem" align="center">
                    <Flex flexDirection={"column"} gap="0.2rem">
                      <Flex align={"center"} gap="1rem">
                        <chakra.button
                          type="button"
                          aria-label="Back to all cases"
                          className="material-symbols-outlined"
                          fontSize="36px"
                          onClick={() => {
                            setViewPatient(null);
                            setGlobalFilter([]);
                          }}
                          cursor="pointer"
                          color="#351361"
                          borderRadius="full"
                          _hover={{ color: "#612ECC" }}
                          _focusVisible={{ boxShadow: "outline" }}
                        >
                          arrow_circle_left
                        </chakra.button>
                        <Text fontSize={"18px"} fontWeight="700">
                          {`${viewPatient.patientName} (${
                            viewPatient.caseNumber || "-"
                          })`}
                        </Text>
                      </Flex>
                      <Text
                        fontSize="12px"
                        fontWeight={500}
                        //textTransform="uppercase"
                        color="scBlack"
                        letterSpacing={"0.36px"}
                        opacity={0.9}
                      >
                        Stores implant details and related data for clinical
                        records, seamlessly integrating with Clinlog’s analytics
                        for performance and outcome insights.
                      </Text>
                    </Flex>
                    <Spacer />
                  </Flex>
                  <SurgicalDetailsV3_2
                    setClinlogStatus={setClinlogStatus}
                    selectedRecord={viewPatient}
                    toastData={{ toast: toast, toastIdRef: toastIdRef }}
                    patientName={`${viewPatient.patientName} (${
                      viewPatient.caseNumber || "-"
                    })`}
                    proposedTreatmentChartResults={
                      viewPatient?.attachedDentalCharts || []
                    }
                    isLoading={isLoading}
                    //@ts-ignore
                    proposedTreatmentChartIds={viewPatient?.attachedDentalCharts?.map(
                      (chart) => chart.id,
                    )}
                    patientDob={
                      viewPatient?.recordPatient?.[0]?.userDateOfBirth ||
                      viewPatient?.recordDateOfBirth
                    }
                    patientGender={
                      viewPatient?.recordPatient?.[0]?.sex || viewPatient?.sex
                    }
                    fromClinlog={true}
                  />
                </Flex>
                <Flex direction={"column"} w="20%" p="4" gap="1rem">
                  <Flex
                    flexDirection={"column"}
                    borderRadius={"6px"}
                    border="1px solid #F7F0F0"
                  >
                    <Flex
                      w="100%"
                      p="4"
                      borderRadius={"6px 6px 0px 0px"}
                      background={
                        "linear-gradient(90deg, var(--clinlog-purple, #452A7E) 25%, #612ECC 100%)"
                      }
                    >
                      <Flex flexDirection={"column"} gap="0.2rem" color="white">
                        <Text
                          fontSize={{ base: "10px", md: "11px" }}
                          fontWeight="400"
                          letterSpacing={"0.84px"}
                        >
                          NOTIFICATIONS{" "}
                        </Text>
                        <Text
                          fontSize={{ base: "12px", md: "13px" }}
                          fontWeight="700"
                          letterSpacing={"0.84px"}
                        >
                          CASE HISTORY
                        </Text>
                      </Flex>
                      <Spacer />
                      <Button
                        size="sm"
                        onClick={() => {
                          onOpen();
                        }}
                      >
                        Note
                      </Button>
                    </Flex>
                    <Flex
                      w="100%"
                      p="4"
                      flexDirection={"column"}
                      gap="0.5rem"
                      bg="white"
                      borderRadius={"0px 0px 6px 6px"}
                      h="100%"
                    >
                      {clinlogNotesQueryResult.isLoading ? (
                        <LoadingState label="Loading notes" py="6" />
                      ) : clinlogNotesQueryResult.isError ? (
                        <ErrorState
                          py="6"
                          title="We couldn't load notes."
                          onRetry={() => clinlogNotesQueryResult.refetch()}
                        />
                      ) : selectedPatientNotes.length > 0 ? (
                        selectedPatientNotes?.map((note, index) => (
                          <Flex
                            key={index}
                            w="100%"
                            bg="#FDF7F7"
                            p="4"
                            flexDirection="column"
                            gap="0.2rem"
                          >
                            <Flex>
                              <Text
                                fontSize={{ base: "11px", md: "12px" }}
                                fontWeight="600"
                              >
                                Note Added by {note?.author?.fullName}
                              </Text>
                              <Spacer />
                              <Text fontSize={{ base: "11px", md: "12px" }}>
                                {note?.postDate
                                  ? format(
                                      new Date(note.postDate),
                                      "dd MMM, yyyy",
                                    )
                                  : ""}
                              </Text>
                            </Flex>
                            <Text fontSize={{ base: "11px", md: "12px" }}>
                              {note.recordNoteNote}
                            </Text>
                            {note?.attachedSurveyForm?.length > 0 && (
                              <Button
                                size="xs"
                                bgColor={"#351361"}
                                color="white"
                                onClick={() => {
                                  setPatientSurveyData(
                                    note.attachedSurveyForm?.[0],
                                  );
                                  onSurveyOpen();
                                }}
                              >
                                View Patient Survey
                              </Button>
                            )}
                          </Flex>
                        ))
                      ) : (
                        <EmptyState
                          py="6"
                          title="No notes yet"
                          description="Notes added to this record will appear here."
                        />
                      )}
                      {/* <Flex
                        w="100%"
                        justify="center"
                        align="center"
                        gap="0.5rem"
                      >
                        <Button
                          size="sm"
                          bg="none"
                          border="1px solid #F5F5F5"
                          disabled={notesPageIndex === 1}
                          onClick={() => {
                            setNotesPageIndex((prev) => prev - 1);
                          }}
                        >
                          {"<"}
                        </Button>
                        <Text
                          fontSize={{ base: "12px", md: "13px" }}
                          fontWeight="600"
                        >
                          {notesPageIndex} of{" "}
                          {Math.ceil(selectedPatientNotes?.length / 5)}
                        </Text>
                        <Button
                          size="sm"
                          size="sm"
                          bg="none"
                          border="1px solid #F5F5F5"
                          disabled={
                            notesPageIndex >
                            Math.ceil(selectedPatientNotes?.length / 5) - 1
                          }
                          onClick={() => {
                            setNotesPageIndex((prev) => prev + 1);
                          }}
                        >
                          {">"}
                        </Button>
                      </Flex> */}
                    </Flex>
                  </Flex>
                  {/* <Flex
                    flexDirection={"column"}
                    borderRadius={"6px"}
                    border="1px solid #F7F0F0"
                    maxH="60%"
                  >
                    <Flex
                      w="100%"
                      p="4"
                      borderRadius={"6px 6px 0px 0px"}
                      background={
                        "linear-gradient(90deg, var(--clinlog-purple, #452A7E) 25%, #612ECC 100%)"
                      }
                    >
                      <Flex flexDirection={"column"} gap="0.2rem" color="white">
                        <Text
                          fontSize={{ base: "10px", md: "11px" }}
                          fontWeight="400"
                          letterSpacing={"0.84px"}
                        >
                          IMAGES{" "}
                        </Text>
                        <Text
                          fontSize={{ base: "12px", md: "13px" }}
                          fontWeight="700"
                          letterSpacing={"0.84px"}
                        >
                          CLINICAL IMAGING
                        </Text>
                      </Flex>
                      <Spacer />
                    </Flex>
                    <Flex
                      w="100%"
                      p="4"
                      flexDirection={"column"}
                      gap="0.5rem"
                      bg="white"
                      borderRadius={"0px 0px 6px 6px"}
                    >
                      <Text
                        fontSize={{ base: "12px", md: "13px" }}
                        fontWeight="600"
                      >
                        Pre-op Imaging
                      </Text>
                      <Flex align={"center"} gap="0.2rem">
                        <chakra.span
                          className="material-symbols-outlined"
                          fontSize={"18px"}
                        >
                          {viewPatient?.preOpPhotos
                            ? "check_box"
                            : "check_box_outline_blank"}{" "}
                        </chakra.span>
                        <Text
                          fontSize={{ base: "13px", md: "14px" }}
                          fontWeight="500"
                        >
                          Photos
                        </Text>
                      </Flex>

                    
                      <Flex align={"center"} gap="0.2rem">
                        <chakra.span
                          className="material-symbols-outlined"
                          fontSize={"18px"}
                        >
                          {viewPatient?.preOpReconstructedOpg
                            ? "check_box"
                            : "check_box_outline_blank"}{" "}
                        </chakra.span>
                        <Text
                          fontSize={{ base: "13px", md: "14px" }}
                          fontWeight="500"
                        >
                          Reconstructed OPG
                        </Text>
                      </Flex>
                      <Text
                        fontSize={{ base: "12px", md: "13px" }}
                        fontWeight="600"
                      >
                        Post-op Imaging
                      </Text>
                      <Flex align={"center"} gap="0.2rem">
                        <chakra.span
                          className="material-symbols-outlined"
                          fontSize={"18px"}
                        >
                          {viewPatient?.postOpPhotos
                            ? "check_box"
                            : "check_box_outline_blank"}{" "}
                        </chakra.span>
                        <Text
                          fontSize={{ base: "13px", md: "14px" }}
                          fontWeight="500"
                        >
                          Photos
                        </Text>
                      </Flex>

                      <Flex align={"center"} gap="0.2rem">
                        <chakra.span
                          className="material-symbols-outlined"
                          fontSize={"18px"}
                        >
                          {viewPatient?.postOp2DOpg
                            ? "check_box"
                            : "check_box_outline_blank"}{" "}
                        </chakra.span>
                        <Text
                          fontSize={{ base: "13px", md: "14px" }}
                          fontWeight="500"
                        >
                          2-D OPG
                        </Text>
                      </Flex>

                      <Flex align={"center"} gap="0.2rem">
                        <chakra.span
                          className="material-symbols-outlined"
                          fontSize={"18px"}
                        >
                          {viewPatient?.postOp3DOpg
                            ? "check_box"
                            : "check_box_outline_blank"}{" "}
                        </chakra.span>
                        <Text
                          fontSize={{ base: "13px", md: "14px" }}
                          fontWeight="500"
                        >
                          3-D CBCT
                        </Text>
                      </Flex>
                      {viewPatient?.isImageIdentifiable && (
                        <>
                          <Flex
                            p="4"
                            bg="#D9D9D9"
                            justify="center"
                            borderRadius="6px"
                            mt="2"
                          >
                            <Text fontSize={{ base: "11px", md: "12px" }}>
                              IMAGES UNAVAILABLE FOR VIEWING
                            </Text>
                          </Flex>
                          <Flex
                            p="4"
                            bg="#FFB1B1"
                            align={"center"}
                            borderRadius="6px"
                            gap={"0.2rem"}
                            color="#B12C2C"
                            fontWeight={"600"}
                            mt="2"
                          >
                            <chakra.span
                              className="material-symbols-outlined"
                              fontSize={"18px"}
                            >
                              gpp_maybe
                            </chakra.span>
                            <Text fontSize={{ base: "11px", md: "12px" }}>
                              Contains Identifiable Features (Face Visible,
                              Eyes, Tattoos, Background){" "}
                            </Text>
                          </Flex>
                        </>
                      )}
                    </Flex>
                  </Flex> */}
                </Flex>
                <Modal
                  isOpen={isOpen}
                  onClose={onClose}
                  size="lg"
                  scrollBehavior="inside"
                >
                  <ModalOverlay />
                  <ModalContent top="20">
                    <ModalHeader
                      background={
                        "linear-gradient(90deg, var(--clinlog-purple, #452A7E) 25%, #612ECC 100%)"
                      }
                      color="white"
                      textTransform={"uppercase"}
                      fontSize={{ base: "15px", md: "16px" }}
                    >
                      Add Clinlog Note
                    </ModalHeader>
                    <ModalCloseButton color="white" />
                    <ModalBody>
                      <Flex p="4" flexDirection={"column"} gap="1rem">
                        <Text
                          fontSize={{ base: "11px", md: "12px" }}
                          fontWeight="600"
                          color="#970000"
                          bg="#FFB1B1"
                          p="2"
                          borderRadius={"6px"}
                        >
                          Important: Notes must not include any
                          patient-identifiable information. Enter only
                          non-identifiable details.
                        </Text>
                        <Textarea
                          minH="150px"
                          fontSize={{ base: "13px", md: "14px" }}
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          placeholder="Enter your note here..."
                        />
                        <Button
                          size="sm"
                          bgColor="scBlack"
                          color={"white"}
                          _hover={{ bgColor: "scBlack" }}
                          alignSelf="flex-end"
                          onClick={() => {
                            handleAddNote();
                          }}
                        >
                          Add Note
                        </Button>
                      </Flex>
                    </ModalBody>
                  </ModalContent>
                </Modal>
                <Modal
                  isOpen={isSurveyOpen}
                  onClose={onSurveyClose}
                  size="2xl"
                  scrollBehavior="inside"
                >
                  <ModalOverlay />
                  <ModalContent top="20">
                    <ModalHeader
                      background={
                        "linear-gradient(90deg, var(--clinlog-purple, #452A7E) 25%, #612ECC 100%)"
                      }
                      color="white"
                      textTransform={"uppercase"}
                      fontSize={{ base: "15px", md: "16px" }}
                    >
                      Patient Survey Responses
                    </ModalHeader>
                    <ModalCloseButton color="white" />
                    <ModalBody>
                      <Flex px="4" py="8" flexDirection={"column"} gap="1rem">
                        {patientSurveyData && (
                          <SimpleGrid columns={1} gap="1rem" w="100%" h="100%">
                            <Flex flexDirection={"column"} gap="0.5rem">
                              <Text
                                fontSize={{ base: "10px", md: "11px" }}
                                fontWeight="700"
                                textTransform={"uppercase"}
                              >
                                Survey Date
                              </Text>
                              <Text
                                fontWeight={500}
                                fontSize={{ base: "13px", md: "14px" }}
                                p="3"
                                border="1px solid #E2E8F0"
                                borderRadius={"6px"}
                              >
                                {patientSurveyData.patientSurveyMatrix?.[0]
                                  ?.surveyDate
                                  ? format(
                                      new Date(
                                        patientSurveyData
                                          .patientSurveyMatrix?.[0]?.surveyDate,
                                      ),
                                      "dd MMM, yyyy",
                                    )
                                  : "N/A"}
                              </Text>
                            </Flex>
                            <Flex flexDirection={"column"} gap="0.5rem">
                              <Text
                                fontSize={{ base: "10px", md: "11px" }}
                                fontWeight="700"
                                textTransform={"uppercase"}
                                mt="1"
                              >
                                Time From Surgery
                              </Text>
                              <Text
                                fontWeight={500}
                                fontSize={{ base: "13px", md: "14px" }}
                                p="3"
                                border="1px solid #E2E8F0"
                                borderRadius={"6px"}
                              >
                                {patientSurveyData.patientSurveyMatrix?.[0]
                                  ?.timeFromSurgery || "N/A"}
                              </Text>
                            </Flex>
                            <Flex flexDirection={"column"} gap="0.5rem">
                              <Text
                                fontSize={{ base: "10px", md: "11px" }}
                                fontWeight="700"
                                textTransform={"uppercase"}
                                mt="1"
                              >
                                How do you feel about the OUTCOME?
                              </Text>
                              <Text
                                fontWeight={500}
                                fontSize={{ base: "13px", md: "14px" }}
                                p="3"
                                border="1px solid #E2E8F0"
                                borderRadius={"6px"}
                              >
                                {patientSurveyData.patientSurveyMatrix?.[0]
                                  ?.patientSatisfactionAesthetic || "N/A"}
                              </Text>
                            </Flex>
                            <Flex flexDirection={"column"} gap="0.5rem">
                              <Text
                                fontSize={{ base: "10px", md: "11px" }}
                                fontWeight="700"
                                textTransform={"uppercase"}
                                mt="1"
                              >
                                How is your FUNCTION?
                              </Text>
                              <Text
                                fontWeight={500}
                                fontSize={{ base: "13px", md: "14px" }}
                                p="3"
                                border="1px solid #E2E8F0"
                                borderRadius={"6px"}
                              >
                                {patientSurveyData.patientSurveyMatrix?.[0]
                                  ?.patientSatisfactionFunction || "N/A"}
                              </Text>
                            </Flex>
                            <Flex flexDirection={"column"} gap="0.5rem">
                              <Text
                                fontSize={{ base: "10px", md: "11px" }}
                                fontWeight="700"
                                textTransform={"uppercase"}
                                mt="1"
                              >
                                How was the TREATMENT PROCESS?
                              </Text>
                              <Text
                                fontWeight={500}
                                fontSize={{ base: "13px", md: "14px" }}
                                p="3"
                                border="1px solid #E2E8F0"
                                borderRadius={"6px"}
                              >
                                {patientSurveyData.patientSurveyMatrix?.[0]
                                  ?.patientSatisfactionTreatment || "N/A"}
                              </Text>
                            </Flex>
                            <Flex flexDirection={"column"} gap="0.5rem">
                              <Text
                                fontSize={{ base: "10px", md: "11px" }}
                                fontWeight="700"
                                textTransform={"uppercase"}
                                mt="1"
                              >
                                How is the maintenance?
                              </Text>
                              <Text
                                fontWeight={500}
                                fontSize={{ base: "13px", md: "14px" }}
                                p="3"
                                border="1px solid #E2E8F0"
                                borderRadius={"6px"}
                              >
                                {patientSurveyData.patientSurveyMatrix?.[0]
                                  ?.patientSatisfactionMaintenance || "N/A"}
                              </Text>
                            </Flex>
                            <Flex flexDirection={"column"} gap="0.5rem">
                              <Text
                                fontSize={{ base: "10px", md: "11px" }}
                                fontWeight="700"
                                textTransform={"uppercase"}
                                mt="1"
                              >
                                Have you had pain following your surgery?
                              </Text>
                              <Text
                                fontWeight={500}
                                fontSize={{ base: "13px", md: "14px" }}
                                p="3"
                                border="1px solid #E2E8F0"
                                borderRadius={"6px"}
                              >
                                {patientSurveyData.patientSurveyMatrix?.[0]
                                  ?.postOpPain || "N/A"}
                              </Text>
                            </Flex>
                            <Flex flexDirection={"column"} gap="0.5rem">
                              <Text
                                fontSize={{ base: "10px", md: "11px" }}
                                fontWeight="700"
                                textTransform={"uppercase"}
                                mt="1"
                              >
                                Smoking
                              </Text>
                              <Text
                                fontWeight={500}
                                fontSize={{ base: "13px", md: "14px" }}
                                p="3"
                                border="1px solid #E2E8F0"
                                borderRadius={"6px"}
                              >
                                {patientSurveyData.patientSurveyMatrix?.[0]
                                  ?.smoking || "N/A"}
                              </Text>
                            </Flex>
                          </SimpleGrid>
                        )}
                      </Flex>
                    </ModalBody>
                  </ModalContent>
                </Modal>
              </Flex>
            ) : (
              <Flex flexDirection={"column"} gap="1rem" w="100%">
                {" "}
                <Flex gap="0.5rem" align="center">
                  <Flex flexDirection={"column"} gap="0.2rem">
                    <Text
                      fontSize={"18px"}
                      fontWeight={700}
                      fontFamily={"inter"}
                      color={"#351361"}
                      textTransform={"uppercase"}
                      letterSpacing={"2.52px"}
                    >
                      All Cases
                    </Text>
                    <Text
                      fontSize={"11px"}
                      fontFamily={"inter"}
                      color={"#351361"}
                    >
                      All information displayed within Clinlog is fully
                      de-identified to protect patient privacy and meet clinical
                      research standards.
                    </Text>
                  </Flex>
                  <Spacer />

                  {/* {locationOptions?.length > 1 && (
                    <>
                      <Flex gap="0.2rem">
                        {locationArr.length > 0 &&
                          locationArr?.map((item) => {
                            if (item === "all") {
                              return (
                                <Tag
                                  key={item}
                                  size="sm"
                                  variant="solid"
                                  colorScheme="blue"
                                >
                                  <TagLabel>All</TagLabel>
                                  <TagCloseButton
                                    onClick={() => {
                                      setLocationArr(
                                        session.locationIds?.map((item) =>
                                          item.toString()
                                        )
                                      );
                                    }}
                                  />
                                </Tag>
                              );
                            } else if (
                              locationOptions
                                .map((item) => item.value)
                                .includes(item)
                            ) {
                              return (
                                <Tag
                                  key={item}
                                  size="sm"
                                  variant="solid"
                                  colorScheme="blue"
                                >
                                  <TagLabel>
                                    {
                                      allClinicsQueryResult?.data?.clinics?.find(
                                        (clinic) =>
                                          Number(clinic.id) === Number(item)
                                      )?.locationShortName
                                    }
                                  </TagLabel>
                                  <TagCloseButton
                                    onClick={() => {
                                      setLocationArr(
                                        locationArr.filter(
                                          (loc) => loc !== item
                                        )?.length > 0
                                          ? locationArr.filter(
                                              (loc) => loc !== item
                                            )
                                          : [session?.locationIds?.[0]]
                                      );
                                    }}
                                  />
                                </Tag>
                              );
                            }
                          })}
                      </Flex>
                      <Select
                        fontSize={"13px"}
                        w="15%"
                        onChange={(e) => {
                          const location = e.target.value;

                          if (location === "all") {
                            setLocationArr(["all"]);
                          } else if (location === "") {
                            setLocationArr([]);
                          } else {
                            if (locationArr.includes("all")) {
                              setLocationArr([location]);
                            } else {
                              setLocationArr((prev) => {
                                return [...prev, location];
                              });
                            }
                          }
                        }}
                      >
                        <option value="">-- Location --</option>
                        <option value="all">All</option>
                        {locationOptions?.map((item) => {
                          if (!locationArr.includes(item.value)) {
                            return (
                              <option key={item.value} value={item.value}>
                                {item.label}
                              </option>
                            );
                          }
                        })}
                      </Select>
                    </>
                  )} */}
                </Flex>
                <ClinlogFilterBar
                  filters={globalFilter}
                  onFiltersChange={setGlobalFilter}
                  surgeonOptions={surgeonOptions}
                  locationOptions={locationOptions}
                  implantLineOptions={implantLineOptions}
                  searchValue={searchText}
                  onSearchChange={setSearchText}
                  resultCount={table.getFilteredRowModel().rows.length}
                  totalCount={tableData.length}
                />
                <ClinlogDataTable
                  table={table}
                  isLoadingMore={!!hasNextPage}
                  onRowClick={(row) => setViewPatient(row.original)}
                  toolbarLeft={
                    <Flex align="center" gap="3" wrap="wrap">
                      <Text fontSize="14px" fontWeight="700" color="#351361">
                        Cases
                      </Text>
                      <Flex
                        align="center"
                        gap="3"
                        fontSize="11px"
                        color="gray.600"
                      >
                        <Flex align="center" gap="1">
                          <Box
                            w="8px"
                            h="8px"
                            borderRadius="full"
                            bg="#4ADE80"
                          />
                          All data complete
                        </Flex>
                        <Flex align="center" gap="1">
                          <Box
                            w="8px"
                            h="8px"
                            borderRadius="full"
                            bg="orange.400"
                          />
                          Some data missing
                        </Flex>
                      </Flex>
                    </Flex>
                  }
                  toolbarRight={
                    <>
                      <GroupedChecklist
                        buttonLabel="Columns"
                        buttonIcon={<MdViewColumn />}
                        title="Show these columns"
                        items={columnItems}
                        groups={columnGroups}
                        selected={visibleColumnIds}
                        onChange={setVisibleColumns}
                        lockedIds={["caseNumber"]}
                        defaultSelected={defaultVisibleColumnsRef.current}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        borderRadius="full"
                        fontSize="13px"
                        leftIcon={<DownloadIcon />}
                        onClick={() =>
                          exportRows(table.getFilteredRowModel().rows)
                        }
                        isDisabled={
                          table.getFilteredRowModel().rows.length === 0
                        }
                      >
                        Export all
                      </Button>
                    </>
                  }
                  renderSelectionActions={(rows) => (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        bg="white"
                        leftIcon={<DownloadIcon />}
                        onClick={() => exportRows(rows)}
                      >
                        Export selected (CSV)
                      </Button>
                      <Button
                        size="sm"
                        bg="#452A7E"
                        color="white"
                        _hover={{ bg: "#612ECC" }}
                        onClick={() => {
                          setDataToolCaseIds(
                            rows.map((row) => String(row.original.id)),
                          );
                          setOpenTab("dataTool");
                        }}
                      >
                        Analyse in Data Tool
                      </Button>
                    </>
                  )}
                  renderRowActions={(row) => (
                    <Button
                      size="xs"
                      onClick={() => setViewPatient(row.original)}
                      bgColor={"scBlack"}
                      color="white"
                      borderRadius="full"
                      px="3"
                      fontSize={"12px"}
                      fontWeight="700"
                      _hover={{ bgColor: "#612ECC" }}
                      aria-label={`View case ${row.original.patientName}`}
                    >
                      View
                    </Button>
                  )}
                />
              </Flex>
            )}
          </Flex>
        )}
        {openTab === "dataTool" && (
          <Flex
            flexDirection={"column"}
            gap="1rem"
            w="100%"
            maxW={{ base: "100%", lg: "2000px" }}
            align={"center"}
          >
            <ClinlogDataTool
              filterColumns={clinlogFilterColumns}
              clinlogRecordDetails={clinlogDataQueryResults}
              allCasesData={tableData}
              columnData={columns}
              selectCustomStyle={selectCustomStyle}
              globalFilterFunction={globalFilterFunction}
              locationOptions={locationOptions}
              surgeonOptions={surgeonOptions}
              implantLineOptions={implantLineOptions}
              clinlogNotes={clinlogNotesQueryResult?.data?.recordNotes || []}
              focusCaseIds={dataToolCaseIds}
              onClearFocus={() => setDataToolCaseIds(null)}
            />
          </Flex>
        )}
      </Flex>
    </Flex>
  );
}
export default Clinlog;
Clinlog.auth = {
  role: "Staff",
};
