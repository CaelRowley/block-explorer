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
  const pageSize = 10;
  const refetchInterval = 15000;

  const [page, setPage] = useState<number>(1);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [orderByField, setOrderByField] = useState<string>("timestamp");
  const [orderByDir, setOrderByDir] = useState<"asc" | "desc">("desc");
  const [isAllChecked, setIsAllChecked] = useState<boolean>(false);

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
    queryKey: [page, orderByField, orderByDir],
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
            <TableRow>
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
                  <TableCell align="left">{row.number.toString()}</TableCell>
                  <TableCell align="right">{row.size.toString()}</TableCell>
                  <TableCell align="right">
                    {new Decimal(row.timestamp).toHex()}
                  </TableCell>
                  <TableCell align="right">
                    {new Decimal(row.nonce).toHex()}
                  </TableCell>
                  <TableCell align="right">{row.gasLimit.toString()}</TableCell>
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
      <Grid container justifyContent={"space-between"} spacing={2}>
        <Grid display="flex" justifyContent="end">
          <Button
            onClick={handleOnDeleteClick}
            disabled={selectedRows.length <= 0 && !isAllChecked}
            variant="outlined"
          >
            Delete Selected
          </Button>
        </Grid>
        <Grid display="flex" justifyContent="end">
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
