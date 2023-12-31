import { gql, useQuery } from "urql";
import { useEffect, useMemo } from "react";
import { nip19 } from "nostr-tools";

export const useMarketQuery = ({ pageSize = 20, pageIndex = 1, filter }) => {
  const tableName = `market_events`;
  const limit = useMemo(() => {
    return pageSize;
  }, [pageSize]);
  const offset = useMemo(() => {
    return (pageIndex - 1) * pageSize;
  }, [pageIndex, pageSize]);

  let whereMemo = useMemo(() => {
    let where = "{";
    if (filter.type) {
      where += `type:{_eq: "${filter.type}"} `;
    }
    if (filter.token) {
      where += `token:{_eq: "${filter.token}"} `;
    }
    if (filter.nostrAddress && filter.nostrAddress.length >= 8) {
      if (filter.nostrAddress.indexOf("npub") > -1) {
        where += `nostr_address:{_eq: "${filter.nostrAddress}"} `;
      } else {
        where += `messageid:{_eq: "${filter.nostrAddress}"} `;
      }
    }
    where += "}";
    return where;
  }, [filter]);
  let queryGraphsql = useMemo(() => {
    return gql`
    query($offset: Int!, $limit: Int!){
      ${tableName}(limit:$limit,offset:$offset,where:${whereMemo},order_by: {create_time: desc}) {
        create_time
        message_detail
        messageid
        nostr_address
        plaintext_context
        status
        token
        type
      }
      ${tableName}_aggregate(where:${whereMemo}){
        aggregate {
          count
        }
      }
    }
  `;
  }, [tableName, whereMemo]);
  const [result, reexcuteQuery] = useQuery({
    query: queryGraphsql,
    variables: {
      offset,
      limit,
    },
  });

  const { data, fetching } = result;

  const list = data ? data[tableName] : [];
  const total = data ? data[`${tableName}_aggregate`]?.aggregate?.count : 0;

  return {
    list,
    total,
    fetching,
    reexcuteQuery,
  };
};

export const useTokenQuery = ({ pageSize = 20, pageIndex = 1, filter }) => {
  const tableName = `nostr_token_transaction`;
  const limit = useMemo(() => {
    return pageSize;
  }, [pageSize]);
  const offset = useMemo(() => {
    return (pageIndex - 1) * pageSize;
  }, [pageIndex, pageSize]);

  let whereMemo = useMemo(() => {
    let where = "{";
    if (filter.type) {
      where += `type:{_eq: "${filter.type}"} `;
    } else {
      where += `type:{_neq: "zap"} `;
    }
    if (filter.token) {
      where += `token:{_eq: "${filter.token}"} `;
    }
    if (filter.nostrAddress && filter.nostrAddress.length >= 8) {
      if (filter.nostrAddress.indexOf("npub") > -1) {
        const _decode = nip19.decode(filter.nostrAddress);
        where += `sender_address:{_eq: "${_decode?.data}"} `;
      } else {
        const _decode = nip19.decode(filter.nostrAddress);
        where += `event_id:{_eq: "${_decode?.data}"} `;
      }
    }
    where += "}";
    return where;
  }, [filter]);
  let queryGraphsql = useMemo(() => {
    return gql`
    query($offset: Int!, $limit: Int!){
      ${tableName}(limit:$limit,offset:$offset,where:${whereMemo},order_by: {id: desc}) {
        id
        amount
        create_at
        error
        event_content
        event_id
        from_address
        index
        plaintext_content
        reply_event_id
        sender_address
        sequence
        status
        to_address
        token
        token_address
        tx_hash
        type
      }
      ${tableName}_aggregate(where:${whereMemo}){
        aggregate {
          count
        }
      }
    }
  `;
  }, [tableName, whereMemo]);
  const [result, reexcuteQuery] = useQuery({
    query: queryGraphsql,
    variables: {
      offset,
      limit,
    },
  });

  const { data, fetching } = result;

  const list = data ? data[tableName] : [];
  const total = data ? data[`${tableName}_aggregate`]?.aggregate?.count : 0;

  return {
    list,
    total,
    fetching,
    reexcuteQuery,
  };
};

export const useListingQuery = ({
  pageSize = 20,
  pageIndex = 1,
  token,
  type,
  sort,
}) => {
  const tableName = `nostr_market_order`;
  const limit = useMemo(() => {
    return pageSize;
  }, [pageSize]);
  const offset = useMemo(() => {
    return (pageIndex - 1) * pageSize;
  }, [pageIndex, pageSize]);
  let whereMemo = useMemo(() => {
    let where = "{";
    where += `status: { _in: ["INIT", "PUSH_MARKET_SUCCESS", "PART_SUCCESS"]}`;
    if (type) {
      where += `type:{_eq: "${type == "Buy" ? "SELL" : "BUY"}"} `;
    }
    if (token) {
      where += `token:{_eq: "${token.toUpperCase()}"} `;
    }

    where += "}";
    return where;
  }, [token, type]);
  let sortMemo = useMemo(() => {
    let order_by = "";
    if (sort == "Price From Low to High") {
      order_by = `order_by:{price: asc} `;
    }
    if (sort == "Price From High to Low") {
      order_by = `order_by:{price: desc} `;
    }
    if (sort == "Amount From Small to Large") {
      order_by = `order_by:{volume: asc} `;
    }
    if (sort == "Amount From Large to Small") {
      order_by = `order_by:{volume: desc} `;
    }
    if (sort == "From Latest to Earliest") {
      order_by = `order_by:{create_time: desc} `;
    }
    if (sort == "From Earliest to Latest") {
      order_by = `order_by:{create_time: asc} `;
    }
    return order_by;
  }, [sort]);
  let queryGraphsql = useMemo(() => {
    return gql`
    query($offset: Int!, $limit: Int!){
      ${tableName}(limit:$limit,offset:$offset,where:${whereMemo},${sortMemo}) {
        avg_price
        create_time
        deal_money
        deal_volume
        event_id
        id
        modify_time
        owner
        price
        status
        token
        token_address
        total_price
        trade_fee
        type
        volume
      }
      ${tableName}_aggregate(where:${whereMemo}){
        aggregate {
          count
        }
      }
    }
  `;
  }, [sortMemo, tableName, whereMemo]);
  const [result, reexcuteQuery] = useQuery({
    query: queryGraphsql,
    pause: !token,
    variables: {
      offset,
      limit,
    },
  });

  const { data, fetching } = result;

  const list = data ? data[tableName] : [];
  const total = data ? data[`${tableName}_aggregate`]?.aggregate?.count : 0;

  return {
    list,
    total,
    fetching,
    reexcuteQuery,
  };
};

export const useTokenChangeQuery = ({ pageSize = 20, pageIndex = 1 }) => {
  const tableName = `nostr_token`;
  const limit = useMemo(() => {
    return pageSize;
  }, [pageSize]);
  const offset = useMemo(() => {
    return (pageIndex - 1) * pageSize;
  }, [pageIndex, pageSize]);

  let where = `{symbol:{_ne: "USDT"} }`;

  let queryGraphsql = useMemo(() => {
    return gql`
      query($offset: Int!, $limit: Int!){
        ${tableName}(limit:$limit,offset:$offset,order_by: {id: asc}) {
          chain
          chain_name
          create_time
          deal_price
          decimals
          id
          modify_time
          name
          reserve
          symbol
          tf_change
          tf_total_price
          totalSupply
          token
          volume
        }
      }
    `;
  }, [tableName]);
  const [result, reexcuteQuery] = useQuery({
    query: queryGraphsql,
    variables: {
      offset,
      limit,
    },
  });
  const { data, fetching } = result;

  let list = data ? data[tableName] : [];
  list = list.sort((a, b) => {
    return Number(a.id) - Number(b.id);
  });
  return {
    list,
    tokenList: list,
    fetching,
    reexcuteQuery,
  };
};

export const useTokenKlineQuery = ({ pageSize = 20, pageIndex = 1, token }) => {
  const tableName = `nostr_token_kline`;
  const limit = useMemo(() => {
    return pageSize;
  }, [pageSize]);
  const offset = useMemo(() => {
    return (pageIndex - 1) * pageSize;
  }, [pageIndex, pageSize]);

  let whereMemo = useMemo(() => {
    return `{token:{_eq: "${token}"} }`;
  }, [token]);
  let queryGraphsql = useMemo(() => {
    return gql`
      query($offset: Int!, $limit: Int!){
        ${tableName}(limit:$limit,offset:$offset,where:${whereMemo},order_by: {id: desc}) {
          create_time
          date
          close_price
          high_price
          token
          token_volume
          txs
          volume
          price
          modify_time
          open_price
          low_price
          id
        }
      }
    `;
  }, [tableName, whereMemo]);
  const [result, reexcuteQuery] = useQuery({
    query: queryGraphsql,
    variables: {
      offset,
      limit,
    },
  });
  const { data, fetching } = result;

  let list = data ? data[tableName] : [];
  return {
    list,
    klineData: list,
    fetching,
    reexcuteQuery,
  };
};

export const useListingOrderQuery = ({
  pageSize = 20,
  pageIndex = 1,
  type,
  token,
  status,
  nostrAddress,
}) => {
  const tableName = `nostr_market_order`;
  const limit = useMemo(() => {
    return pageSize;
  }, [pageSize]);
  const offset = useMemo(() => {
    return (pageIndex - 1) * pageSize;
  }, [pageIndex, pageSize]);

  let whereMemo = useMemo(() => {
    let where = "{";
    if (type) {
      where += `type:{_eq: "${type.toUpperCase()}"} `;
    }
    if (token) {
      where += `token:{_eq: "${token.toUpperCase()}"} `;
    }

    if (!status) {
      where += `status: { _in: ["INIT","PUSH_MARKET_SUCCESS","TAKE_LOCK","TRADE_PENDING","PART_SUCCESS","SUCCESS","CANCEL"]} `;
    }
    if (status == "Open Orders") {
      where += `status: { _in: ["INIT","PUSH_MARKET_SUCCESS","TAKE_LOCK","TRADE_PENDING","PART_SUCCESS"]} `;
    }
    if (status == "History Orders") {
      where += `status: { _in: ["SUCCESS","CANCEL"]} `;
    }
    if (nostrAddress) {
      if (nostrAddress.indexOf("npub") > -1) {
        where += `owner:{_eq: "${nip19.decode(nostrAddress).data}"} `;
      } else if (nostrAddress.indexOf("note") > -1) {
        where += `event_id:{_eq: "${nip19.decode(nostrAddress).data}"} `;
      } else {
        where += `event_id:{_eq: "${nostrAddress}"} `;
      }
    }
    where += "}";

    return where;
  }, [nostrAddress, status, token, type]);
  let sortMemo = useMemo(() => {
    let order_by = `order_by:{create_time: desc} `;
    return order_by;
  }, []);
  let queryGraphsql = useMemo(() => {
    return gql`
    query($offset: Int!, $limit: Int!){
      ${tableName}(limit:$limit,offset:$offset,where:${whereMemo},${sortMemo}) {
        avg_price
        create_time
        deal_money
        deal_volume
        event_id
        id
        modify_time
        owner
        price
        status
        token
        token_address
        total_price
        trade_fee
        type
        volume
      }
      ${tableName}_aggregate(where:${whereMemo}){
        aggregate {
          count
        }
      }
    }
  `;
  }, [sortMemo, tableName, whereMemo]);
  const [result, reexcuteQuery] = useQuery({
    query: queryGraphsql,
    variables: {
      offset,
      limit,
    },
  });

  const { data, fetching } = result;

  const list = data ? data[tableName] : [];
  const total = data ? data[`${tableName}_aggregate`]?.aggregate?.count : 0;

  return {
    list,
    total,
    fetching,
    reexcuteQuery,
  };
};

export const useMyOrderQuery = ({
  pageSize = 20,
  pageIndex = 1,
  type,
  token,
  status,
  owner,
}) => {
  const tableName = `nostr_market_order`;
  const limit = useMemo(() => {
    return pageSize;
  }, [pageSize]);
  const offset = useMemo(() => {
    return (pageIndex - 1) * pageSize;
  }, [pageIndex, pageSize]);

  let whereMemo = useMemo(() => {
    let where = "{";
    where += `owner: {_eq: "${owner}"} `;
    if (type) {
      where += `type:{_eq: "${type.toUpperCase()}"} `;
    }
    if (token) {
      where += `token:{_eq: "${token.toUpperCase()}"} `;
    }
    if (!status) {
      where += `status: { _in: ["INIT","PUSH_MARKET_SUCCESS","TAKE_LOCK","TRADE_PENDING","PART_SUCCESS","SUCCESS","CANCEL"]} `;
    }
    if (status == "Open Orders") {
      where += `status: { _in: ["INIT","PUSH_MARKET_SUCCESS","TAKE_LOCK","TRADE_PENDING","PART_SUCCESS"]} `;
    }
    if (status == "History Orders") {
      where += `status: { _in: ["SUCCESS","CANCEL"]} `;
    }

    where += "}";
    return where;
  }, [owner, status, token, type]);
  let sortMemo = useMemo(() => {
    let order_by = `order_by:{create_time: desc} `;
    return order_by;
  }, []);

  let queryGraphsql = useMemo(() => {
    return gql`
    query($offset: Int!, $limit: Int!){
      ${tableName}(limit:$limit,offset:$offset,where:${whereMemo},${sortMemo}) {
        avg_price
        create_time
        deal_money
        deal_volume
        event_id
        id
        modify_time
        owner
        price
        status
        token
        token_address
        total_price
        trade_fee
        type
        volume
      }
      ${tableName}_aggregate(where:${whereMemo}){
        aggregate {
          count
        }
      }
    }
  `;
  }, [sortMemo, tableName, whereMemo]);
  const [result, reexcuteQuery] = useQuery({
    query: queryGraphsql,
    pause: !owner,
    variables: {
      offset,
      limit,
    },
  });

  const { data, fetching } = result;

  const list = data ? data[tableName] : [];
  const total = data ? data[`${tableName}_aggregate`]?.aggregate?.count : 0;

  return {
    list,
    total,
    fetching,
    reexcuteQuery,
  };
};

export const useOrderDetailQuery = ({
  pageSize = 20,
  pageIndex = 1,
  id,
  type,
}) => {
  const tableName = `nostr_market_trade`;
  const limit = useMemo(() => {
    return pageSize;
  }, [pageSize]);
  const offset = useMemo(() => {
    return (pageIndex - 1) * pageSize;
  }, [pageIndex, pageSize]);

  let whereMemo = useMemo(() => {
    let where = "{";
    if (type == "BUY") {
      where += `buy_order_id:{_eq: "${id}"} `;
    }
    if (type == "SELL") {
      where += `sell_order_id:{_eq: "${id}"} `;
    }
    where += "}";
    return where;
  }, [id, type]);
  let sortMemo = useMemo(() => {
    let order_by = `order_by:{create_time: desc} `;
    return order_by;
  }, []);
  let queryGraphsql = useMemo(() => {
    return gql`
    query($offset: Int!, $limit: Int!){
      ${tableName}(limit:$limit,offset:$offset,where:${whereMemo},${sortMemo}) {
        buy_free
        buy_order_id
        buy_owner
        create_time
        id
        modify_time
        price
        sell_free
        sell_order_id
        sell_owner
        trend_side
        volume
      }
    }
  `;
  }, [sortMemo, tableName, whereMemo]);
  const [result, reexcuteQuery] = useQuery({
    query: queryGraphsql,
    pause: !id,
    variables: {
      offset,
      limit,
    },
  });

  const { data, fetching } = result;

  const list = data ? data[tableName] : [];

  return {
    list,
    fetching,
    reexcuteQuery,
  };
};
