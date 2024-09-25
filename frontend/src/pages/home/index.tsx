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
  const { isPending, error, data } = useQuery({
    queryKey: [],
    queryFn: () =>
      fetch(
        `${import.meta.env.VITE_BACKEND_URL}/eth/block/0xe3f82900c714ca9069cf3525978c8dcb4b67148afed9db1cfaba1b99fc5585b9`,
      ).then((res) => res.json()),
  });

  if (isPending) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Oops something went wrong...</p>;
  }

  return (
    <Paper sx={{ padding: "32px" }}>
      <h2>Blocks Data</h2>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 1200 }} aria-label="simple table">
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
            {[data.data].map((row: Block) => {
              return (
                <TableRow sx={{ height: 60 }} key={row.hash}>
                  <TableCell align="left">{row.number.toString()}</TableCell>
                  <TableCell align="right">{row.size.toString()}</TableCell>
                  <TableCell align="right">
                    new Decimal(row.timestamp).toHex()
                  </TableCell>
                  <TableCell align="right">
                    {new Decimal(row.nonce).toHex()}
                  </TableCell>
                  <TableCell align="right">{row.gasLimit.toString()}</TableCell>
                  <TableCell align="right">{row.hash}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default Home;
