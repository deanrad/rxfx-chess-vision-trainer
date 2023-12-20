import React, { useMemo } from "react";
import {
  Box,
  Flex,
  ModalHeader,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  TimeIcon,
  CloseIcon,
} from "@chakra-ui/icons";

import { historyModal } from "@src/services/historyModal";
import {
  useFilters,
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import { CSVLink } from "react-csv";

import { timeLogService } from "@src/services/timeLog";
import { useService, useStableValue, useWhileMounted } from "@rxfx/react";

const datetime = Date.now();
const formatDate = (datetime: number) => {
  const date = new Date(datetime);
  const options = { weekday: "short", month: "short", day: "numeric" };
  return date.toLocaleDateString(undefined, options);
};

const columns = [
  {
    Header: "Blindfold",
    accessor: "BLINDFOLD_ON",
    Filter: SelectColumnFilter,
    filter: "",
    Cell: ({ row: { original } }) => (
      <span>{original.BLINDFOLD_ON ? "😎" : ""}</span>
    ),
  },
  {
    Header: "Piece",
    accessor: "piece",
    Filter: SelectColumnFilter,
    filter: "",
  },
  {
    Header: "Difficulty",
    accessor: "difficulty",
    Filter: "",
    filter: "",
  },
  {
    Header: "Duration",
    accessor: "duration",
    Filter: "",
    filter: "",
  },
  {
    Header: "Solved At",
    accessor: "solvedAt",
    Filter: "",
    filter: "",
    Cell: ({ row: { original } }) => (
      <span>{formatDate(original.solvedAt)}</span>
    ),
  },
];

export function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  return (
    <Select
      size={"xs"}
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
      variant={"outline"}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option.toString()}>
          {option.toString()}
        </option>
      ))}
    </Select>
  );
}

export function HistoryModal() {
  const { state: rawData } = useService(timeLogService);
  const data = useMemo(() => {
    return rawData.map((item) => ({
      ...item,
      solvedAt: new Date(item.solvedAt).toISOString(),
    }));
  }, [rawData]);

  useWhileMounted(() => {
    function dismiss(event: KeyboardEvent) {
      if (event.key === "Escape") {
        // The Escape key was pressed, do something here
        historyModal.cancelCurrent();
      }
    }
    document.addEventListener("keydown", dismiss);
    return () => document.removeEventListener("keydown", dismiss);
  });

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, page } =
    useTable(
      {
        columns,
        data,
        initialState: { pageIndex: 0, pageSize: 25 },
      },
      useFilters,
      useGlobalFilter,
      useSortBy,
      usePagination
    );

  return (
    <div className="history-modal">
      <ModalHeader>History</ModalHeader>
      <TableContainer>
        <Table variant={"simple"} size="md" {...getTableProps()}>
          <Thead>
            {headerGroups.map((headerGroup) => (
              <Tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <Th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    <Flex align={"center"} gap={"10px"}>
                      <Box as="span"> {column.render("Header")} </Box>
                      {column.isSorted && (
                        <Box as="span">
                          {column.isSortedDesc ? (
                            <ArrowDownIcon boxSize={3} ml={2} />
                          ) : (
                            <ArrowUpIcon boxSize={3} ml={2} />
                          )}
                        </Box>
                      )}
                      <Box ml={2} as="span">
                        {column?.canFilter ? column.render("Filter") : null}
                      </Box>
                    </Flex>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <Tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <Td {...cell.getCellProps()}>{cell.render("Cell")}</Td>
                    );
                  })}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
      <CSVLink data={data} filename="chess-vision-history.csv">
        Download
      </CSVLink>
    </div>
  );
}
