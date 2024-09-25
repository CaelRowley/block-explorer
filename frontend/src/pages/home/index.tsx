import * as React from "react";
import { useQuery } from "@tanstack/react-query";

const Home: React.FC = () => {
  const { isPending, error, data } = useQuery({
    queryKey: [],
    queryFn: () =>
      fetch(
        "http://localhost:8080/eth/block/0xe3f82900c714ca9069cf3525978c8dcb4b67148afed9db1cfaba1b99fc5585b9"
      ).then((res) => res.json()),
  });

  if (isPending) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Oops something went wrong...</p>;
  }

  console.log(data)
  return (
    <div>
      <h1>
        Block Hash
      </h1>
      {data.data.hash}
    </div>
  )
}

export default Home;