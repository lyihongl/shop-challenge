import { Button, Grid, TextField, Typography } from "@material-ui/core";
import { queryByRole } from "@testing-library/react";
import { FormEvent, useEffect, useState } from "react";
import ImageFeed from ".";
import { useSearchByTagLazyQuery } from "../../../../generated/graphql";
import { commaStringToArray } from "../../../../util/utils";

enum SearchMode {
  AND = "AND",
  OR = "OR",
}

const SearchImages = () => {
  const [getData, { loading, data }] = useSearchByTagLazyQuery();
  const [searchMode, setSearchMode] = useState<SearchMode>(SearchMode.OR);
  const [query, setQuery] = useState("");

  const toggleSearchMode = () => {
    if (searchMode === SearchMode.AND) {
      setSearchMode(SearchMode.OR);
    } else {
      setSearchMode(SearchMode.AND);
    }
  };

  console.log(data);

  const handleFetch = () => {
    getData({
      variables: {
        isOr: searchMode === SearchMode.OR,
        query: commaStringToArray(query),
      },
    });
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography>Search modes:</Typography>
          <Typography>
            OR: entering "happy, funny" in OR mode will search for images with
            either the happy or funny tag
          </Typography>
          <Typography>
            AND: entering "happy, funny" in AND mode will search for images that
            have both the happy and funny tag
          </Typography>
          <Typography>
            Search mode:{" "}
            <Button onClick={toggleSearchMode}>{searchMode}</Button>
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <TextField
            size="small"
            fullWidth
            variant="outlined"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </Grid>
        <Grid item xs={1}>
          <Button onClick={handleFetch}>Search</Button>
        </Grid>
      </Grid>
      <ImageFeed data={data?.searchByTag} enableDelete={false} />
    </>
  );
};

export { SearchImages };
