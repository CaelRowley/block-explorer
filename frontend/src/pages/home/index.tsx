import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import Decimal from "decimal.js";
import {
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Pagination,
  Grid2 as Grid,
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
  const pageSize = 10;
  const orderByField = "timestamp";
  const orderByDirection = "desc";
  const refetchInterval = 15000;

  const [page, setPage] = React.useState<number>(1);
  const onHandlePagination = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const { isPending, error, data } = useQuery({
    queryKey: [page],
    queryFn: () =>
      fetch(
        `${import.meta.env.VITE_BACKEND_URL}/eth/blocks?page=${page}&pageSize=${pageSize}&orderByField=${orderByField}&orderByDirection=${orderByDirection}`,
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
        <Table sx={{ minWidth: "100%" }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left">Number</TableCell>
              <TableCell align="right">Size</TableCell>
              <TableCell align="right">Timestamp</TableCell>
              <TableCell align="right">Nonce</TableCell>
              <TableCell align="right">Gas&nbsp;Limit</TableCell>
              <TableCell align="right">Hash</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.data.map((row: Block) => {
              return (
                <TableRow sx={{ height: 60 }} key={row.hash}>
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
      <Grid display="flex" justifyContent="end">
        <Pagination
          page={page}
          onChange={onHandlePagination}
          count={Math.ceil(data.count / pageSize)}
          color="primary"
        />
      </Grid>
    </Paper>
  );
};

export default Home;
