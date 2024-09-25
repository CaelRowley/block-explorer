import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Decimal from "decimal.js";
import axios from "axios";
import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableSortLabel,
  CircularProgress,
  Pagination,
  Grid2 as Grid,
  Checkbox,
  Button,
  FormControlLabel,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

type Block = {
  hash: string;
  size: Decimal;
  number: Decimal;
  timestamp: Decimal;
  nonce: Decimal;
  gasLimit: Decimal;
};

const Home: React.FC = () => {
  const queryClient = useQueryClient();
  const refetchInterval = 15000;

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [orderByField, setOrderByField] = useState<string>("timestamp");
  const [orderByDir, setOrderByDir] = useState<"asc" | "desc">("desc");
  const [isAllChecked, setIsAllChecked] = useState<boolean>(false);
  const [selectedCells, setSelectedCells] = useState<string[]>([]);
  const [showHumanReadable, setShowHumanReadable] = useState(false);

  const onHandlePagination = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleOnSortClick = (property: string) => {
    const isAsc = orderByField === property && orderByDir === "asc";
    setOrderByDir(isAsc ? "desc" : "asc");
    setOrderByField(property);
  };

  const handleRowChecked = (key: string) => {
    setIsAllChecked(false);
    if (selectedRows.includes(key)) {
      setSelectedRows(selectedRows.filter((item) => item !== key));
    } else {
      setSelectedRows([...selectedRows, key]);
    }
  };

  const handleAllChecked = () => {
    setIsAllChecked(!isAllChecked);
    setSelectedRows([]);
  };

  const handleOnCellClicked = (key: string) => {
    if (selectedCells.includes(key)) {
      setSelectedCells(selectedCells.filter((item) => item !== key));
    } else {
      setSelectedCells([...selectedCells, key]);
    }
  };

  const onToggleHexConversion = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setShowHumanReadable(event.target.checked);
    setSelectedCells([]);
  };

  const handleOnDeleteClick = async () => {
    try {
      if (isAllChecked) {
        await axios.delete(
          `${import.meta.env.VITE_BACKEND_URL}/eth/blocks/all`,
        );
      } else {
        await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/eth/blocks`, {
          data: {
            hashes: selectedRows,
          },
        });
      }
      setSelectedRows([]);
      setIsAllChecked(false);
      await queryClient.refetchQueries();
    } catch (error) {
      console.error("Error deleting blocks:", error);
    }
  };

  const { isPending, error, data } = useQuery({
    queryKey: [page, pageSize, orderByField, orderByDir],
    queryFn: () =>
      fetch(
        `${import.meta.env.VITE_BACKEND_URL}/eth/blocks?page=${page}&pageSize=${pageSize}&orderByField=${orderByField}&orderByDirection=${orderByDir}`,
      ).then((res) => res.json()),
    refetchInterval,
  });
  if (isPending) {
    return <CircularProgress />;
  }
  if (error) {
    return <p>Oops something went wrong...</p>;
  }

  return (
    <Paper sx={{ padding: "32px" }}>
      <h2>Blocks Data</h2>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: "100%" }} aria-label="Block table">
          <TableHead>
            <TableRow selected={isAllChecked}>
              <TableCell padding="checkbox">
                <Checkbox
                  color="primary"
                  checked={isAllChecked}
                  onChange={() => handleAllChecked()}
                />
              </TableCell>
              <TableCell align="left">
                <TableSortLabel
                  active={orderByField === "number"}
                  direction={orderByField === "number" ? orderByDir : "asc"}
                  onClick={() => handleOnSortClick("number")}
                >
                  <h3>Number</h3>
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={orderByField === "size"}
                  direction={orderByField === "size" ? orderByDir : "asc"}
                  onClick={() => handleOnSortClick("size")}
                >
                  <h3>Size</h3>
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={orderByField === "timestamp"}
                  direction={orderByField === "timestamp" ? orderByDir : "asc"}
                  onClick={() => handleOnSortClick("timestamp")}
                >
                  <h3>Timestamp</h3>
                </TableSortLabel>
              </TableCell>
              <TableCell align="right">
                <h3>Nonce</h3>
              </TableCell>
              <TableCell align="right">
                <h3>Gas&nbsp;Limit</h3>
              </TableCell>
              <TableCell align="right">
                <TableSortLabel
                  active={orderByField === "hash"}
                  direction={orderByField === "hash" ? orderByDir : "asc"}
                  onClick={() => handleOnSortClick("hash")}
                >
                  <h3>Hash</h3>
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.data.map((row: Block) => {
              const isRowSelected = selectedRows.includes(row.hash);
              return (
                <TableRow
                  sx={{ height: 60 }}
                  key={row.hash}
                  selected={isRowSelected || isAllChecked}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      onChange={() => handleRowChecked(row.hash)}
                      checked={isRowSelected || isAllChecked}
                    />
                  </TableCell>
                  <TableCell
                    sx={{ cursor: "pointer" }}
                    onClick={() => handleOnCellClicked("number_" + row.hash)}
                    align="left"
                  >
                    {showHumanReadable !==
                    selectedCells.includes("number_" + row.hash)
                      ? row.number.toString()
                      : new Decimal(row.number).toHex()}
                  </TableCell>
                  <TableCell
                    sx={{ cursor: "pointer" }}
                    onClick={() => handleOnCellClicked("size_" + row.hash)}
                    align="right"
                  >
                    {showHumanReadable !==
                    selectedCells.includes("size_" + row.hash)
                      ? row.size.toString()
                      : new Decimal(row.size).toHex()}
                  </TableCell>
                  <TableCell
                    sx={{ cursor: "pointer" }}
                    onClick={() => handleOnCellClicked("timestamp_" + row.hash)}
                    align="right"
                  >
                    {showHumanReadable !==
                    selectedCells.includes("timestamp_" + row.hash)
                      ? new Date(
                          new Decimal(row.timestamp).mul(1000).toNumber(),
                        ).toLocaleString()
                      : new Decimal(row.timestamp).toHex()}
                  </TableCell>
                  <TableCell align="right">
                    {new Decimal(row.nonce).toHex()}
                  </TableCell>
                  <TableCell
                    sx={{ cursor: "pointer" }}
                    onClick={() => handleOnCellClicked("gasLimit_" + row.hash)}
                    align="right"
                  >
                    {showHumanReadable !==
                    selectedCells.includes("gasLimit_" + row.hash)
                      ? row.gasLimit.toString()
                      : new Decimal(row.gasLimit).toHex()}
                  </TableCell>
                  <TableCell align="right">{row.hash}</TableCell>
                </TableRow>
              );
            })}
            {Array.from({ length: pageSize - data.data.length }).map(
              (_, index) => (
                <TableRow sx={{ height: 60 }} key={`empty-${index}`}>
                  <TableCell />
                  <TableCell />
                  <TableCell />
                  <TableCell />
                  <TableCell />
                  <TableCell />
                  <TableCell />
                </TableRow>
              ),
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <br />
      <Grid container justifyContent={"space-between"}>
        <Grid display="flex" justifyContent="start" size={{ xs: 2 }}>
          <Button
            onClick={handleOnDeleteClick}
            disabled={selectedRows.length <= 0 && !isAllChecked}
            variant="outlined"
          >
            {isAllChecked
              ? "Delete All Blocks"
              : selectedRows.length <= 0
                ? "Delete Blocks"
                : "Delete Selected"}
          </Button>
        </Grid>
        <Grid display="flex" justifyContent="start" size="grow">
          <FormControlLabel
            control={
              <Switch onChange={onToggleHexConversion} defaultChecked={false} />
            }
            label="Show Human Readable Values"
          />
        </Grid>
        <Grid display="flex" justifyContent="end" size={{ xs: 1 }}>
          <FormControl fullWidth>
            <InputLabel>Row Count</InputLabel>
            <Select
              value={pageSize}
              label="Row Count"
              onChange={(event) => setPageSize(Number(event.target.value))}
            >
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={30}>30</MenuItem>
              <MenuItem value={50}>50</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid display="flex" justifyContent="end" size="grow">
          <Pagination
            page={page}
            onChange={onHandlePagination}
            count={Math.ceil(data.count / pageSize)}
            color="primary"
          />
        </Grid>
      </Grid>
    </Paper>
  );
};

export default Home;
