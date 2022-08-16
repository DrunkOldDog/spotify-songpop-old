import { useRef } from "react";
import PropTypes from "prop-types";
import { AsyncSelect } from "chakra-react-select";

export const DebounceSelect = ({
  debounceMs = 1000,
  onSelect,
  remoteRetriever,
}) => {
  const searchRef = useRef(null);

  return (
    <AsyncSelect
      isClearable
      onChange={onSelect}
      placeholder="Search your favorite artist"
      size="md"
      loadOptions={(inputValue, callback) => {
        if (searchRef.current) {
          clearTimeout(searchRef.current);
        }

        /* Added code for debounce multiple requests */
        searchRef.current = setTimeout(async () => {
          const values = await remoteRetriever(inputValue);
          searchRef.current = null;
          callback(values);
        }, debounceMs);
      }}
    />
  );
};

DebounceSelect.propTypes = {
  onSelect: PropTypes.func,
  debounceMs: PropTypes.number,
  remoteRetriever: PropTypes.func.isRequired,
};
