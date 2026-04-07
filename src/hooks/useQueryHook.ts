import { useQuery } from "@tanstack/react-query";
import { GraphQLClient } from "graphql-request";
import { locationShortNames } from "helpers/utils";
import { getSession, useSession } from "next-auth/react";
import { format, startOfMonth, endOfMonth, isDate } from "date-fns";

export const getData = async (query, variables = {}, sessionToken) => {
  const graphQLClient = new GraphQLClient(process.env.NEXT_PUBLIC_ENDPOINT, {
    headers: {
      Authorization: `JWT ${sessionToken}`,
    },
  });
  const result = await graphQLClient.request(query, variables);
  return result;
};

export const sendData = async (mutation, variables = {}) => {
  const session = await getSession();
  const fullVariables = {
    ...variables,
    userId: session?.userId,
  };

  const graphQLClient = new GraphQLClient(process.env.NEXT_PUBLIC_ENDPOINT, {
    headers: {
      Authorization: `JWT ${session.accessToken}`,
    },
  });

  const result = await graphQLClient.request(mutation, fullVariables);
  if (process.env.NODE_ENV === "development") {
    console.log(result);
    console.log(variables);
  }
  return result;
};

export const sendMadeDigitalData = async (mutation, variables = {}) => {
  const session = await getSession();
  const fullVariables = {
    ...variables,
  };

  const graphQLClient = new GraphQLClient(
    process.env.NEXT_PUBLIC_MADE_DIGITAL_GRAPHQL_ENDPOINT,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_MADE_DIGITAL_SESSION_TOKEN}`,
      },
    }
  );

  const result = await graphQLClient.request(mutation, fullVariables);
  if (process.env.NODE_ENV === "development") {
    console.log(result);
    console.log(variables);
  }
  return result;
};

export default function useQueryHook(
  cacheValue: any[],
  query,
  variables: any = {},
  options = {},
  log = false
) {
  const { data: session } = useSession();
  const sessionToken = session?.accessToken;
  const fullVariables = {
    ...variables,
    userId: session?.userId,
  };

  const enabledSetting =
    "enabled" in options
      ? options["enabled"] && !!sessionToken
      : !!sessionToken;

  if (log && process.env.NODE_ENV === "development") {
    // console.log("fullVariables", fullVariables)
    // console.log("options", options))
  }

  return useQuery(
    cacheValue,
    () => getData(query, fullVariables, sessionToken),
    {
      retry: process.env.NODE_ENV === "development" ? 0 : 3,
      retryDelay: (attemptIndex) => {
        if (attemptIndex === 0) {
          return 200;
        }
        return Math.min(1000 * 2 ** attemptIndex, 30000);
      },
      ...options,
      enabled: enabledSetting,
    }
  );
}

export function publicApiHook(
  cacheValue: any[],
  query,
  variables = {},
  options = {}
) {
  const graphQLClient = new GraphQLClient(process.env.NEXT_PUBLIC_ENDPOINT, {
    headers: {
      Authorization: process.env.NEXT_PUBLIC_TOKEN,
    },
  });

  return useQuery(cacheValue, () => graphQLClient.request(query, variables), {
    retry: process.env.NODE_ENV === "development" ? 1 : 3,
    ...options,
  });
}

/* Hook functions for new Lead use case*/
export function newLeadApiHook(
  cacheValue: any[],
  query,
  adminFlag,
  selectedDate,
  apiTokens,
  options = {},
  dateRange = {}
): any {
  const { data: session } = useSession();
  const sessionToken = session?.accessToken;
  const enabledSetting =
    "enabled" in options
      ? options["enabled"] && !!sessionToken
      : !!sessionToken;

  return useQuery(
    cacheValue,
    () => getNewLeadData(query, adminFlag, selectedDate, apiTokens, dateRange),
    {
      retry: process.env.NODE_ENV === "development" ? 1 : 1,
      ...options,
      enabled: enabledSetting,
    }
  );
}

// const allon4PlusGraphQlClient = new GraphQLClient(
//   process.env.NEXT_PUBLIC_ALLON4PLUS_GRAPHQL_ENDPOINT,
//   {
//     headers: {
//       Authorization: `Bearer ${process.env.NEXT_PUBLIC_ALLON4PLUS_SESSION_TOKEN}`,
//     },
//   }
// )

// const allon4GraphQlClient = new GraphQLClient(
//   process.env.NEXT_PUBLIC_ALLON4_GRAPHQL_ENDPOINT,
//   {
//     headers: {
//       Authorization: `Bearer ${process.env.NEXT_PUBLIC_ALLON4_SESSION_TOKEN}`,
//     },
//   }
// )

// const sleepdentistrygraphQLClient = new GraphQLClient(
//   process.env.NEXT_PUBLIC_SLEEP_DENTISTRY_MELBOURNE_GRAPHQL_ENDPOINT,
//   {
//     headers: {
//       Authorization: `Bearer ${process.env.NEXT_PUBLIC_SLEEP_DENTISTRY_MELBOURNE_SESSION_TOKEN}`,
//     },
//   }
// )

export const getNewLeadData = async (
  query,
  adminFlag,
  selectedDate,
  apiTokens,
  dateRange
) => {
  const allon4PlusGraphQlClient = new GraphQLClient(
    process.env.NEXT_PUBLIC_ALLON4PLUS_GRAPHQL_ENDPOINT,
    {
      headers: {
        Authorization: `Bearer ${apiTokens?.allon4PlusToken}`,
      },
    }
  );

  const allon4GraphQlClient = new GraphQLClient(
    process.env.NEXT_PUBLIC_ALLON4_GRAPHQL_ENDPOINT,
    {
      headers: {
        Authorization: `Bearer ${apiTokens?.allon4Token}`,
      },
    }
  );
  const sleepdentistrygraphQLClient = new GraphQLClient(
    process.env.NEXT_PUBLIC_SLEEP_DENTISTRY_MELBOURNE_GRAPHQL_ENDPOINT,
    {
      headers: {
        Authorization: `Bearer ${apiTokens?.sleepDentistryToken}`,
      },
    }
  );

  const session = await getSession();
  const locationIds = session?.locationIds ?? [-1];
  let variables = {};
  let janOfCurrentYear = format(new Date(), "yyyy-MM-dd");
  let newSelectedDate = isDate(selectedDate) ? selectedDate : new Date();
  const startOfselectedDate = startOfMonth(newSelectedDate);
  startOfselectedDate.setHours(0, 0, 0, 0);
  const endOfselectedDate = endOfMonth(newSelectedDate);
  endOfselectedDate.setHours(23, 59, 59, 999);

  if (adminFlag) {
    variables = {
      locationInfo: [],
      dateEnquired: [">=" + janOfCurrentYear],
      dateFilter: [
        "and",
        ">=" + startOfselectedDate.toISOString(),
        "<=" + endOfselectedDate.toISOString(),
      ],
    };
  } else {
    variables = {
      locationInfo: locationIds
        ?.map((item) => locationShortNames?.[item])
        ?.flat(),
      dateEnquired: [">=" + janOfCurrentYear],
      dateFilter: [
        "and",
        ">=" + startOfselectedDate.toISOString(),
        "<=" + endOfselectedDate.toISOString(),
      ],
    };
  }

  const fullVariables = {
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    ...variables,
  };

  let finalResult = {};
  //pre initialize result values
  let allOn4Result: any;
  let sleepdentistryResult: any;
  let allOn4PlusResult: any;
  //put into seperate try catch for error handling and to avoid stopping the execution

  try {
    allOn4Result = await allon4GraphQlClient.request(query, fullVariables);
  } catch (err) {}
  try {
    sleepdentistryResult = await sleepdentistrygraphQLClient.request(
      query,
      fullVariables
    );
  } catch (err) {}
  try {
    allOn4PlusResult = await allon4PlusGraphQlClient.request(
      query,
      fullVariables
    );
  } catch (err) {}

  if (
    allOn4PlusResult?.entries ||
    allOn4Result?.entries ||
    sleepdentistryResult?.entries
  ) {
    //concate all the entries if they exist
    finalResult = {
      entries: [].concat(
        allOn4PlusResult?.entries || [],
        allOn4Result?.entries || [],
        sleepdentistryResult?.entries || []
      ),
    };
  } else if (
    allOn4PlusResult?.entryCount ||
    allOn4Result?.entryCount ||
    sleepdentistryResult?.entryCount
  ) {
    //fallback to 0 if number doesnt exist
    finalResult = {
      entryCount:
        (allOn4PlusResult?.entryCount || 0) +
        (allOn4Result?.entryCount || 0) +
        (sleepdentistryResult?.entryCount || 0),
    };
  }
  return finalResult;
};
export const sendNewLeadData = async (
  mutation,
  variables = {},
  websiteEnquired,
  apiTokens
) => {
  const allon4PlusGraphQlClient = new GraphQLClient(
    process.env.NEXT_PUBLIC_ALLON4PLUS_GRAPHQL_ENDPOINT,
    {
      headers: {
        Authorization: `Bearer ${apiTokens?.allon4PlusToken}`,
      },
    }
  );

  const allon4GraphQlClient = new GraphQLClient(
    process.env.NEXT_PUBLIC_ALLON4_GRAPHQL_ENDPOINT,
    {
      headers: {
        Authorization: `Bearer ${apiTokens?.allon4Token}`,
      },
    }
  );

  const sleepdentistrygraphQLClient = new GraphQLClient(
    process.env.NEXT_PUBLIC_SLEEP_DENTISTRY_MELBOURNE_GRAPHQL_ENDPOINT,
    {
      headers: {
        Authorization: `Bearer ${apiTokens?.sleepDentistryToken}`,
      },
    }
  );
  const session = await getSession();
  const fullVariables = {
    ...variables,
  };

  const allOn4WebsitesArray = [
    "https://allon4sydney.com.au",
    "https://allon4melbourne.com.au",
    "https://allon4plus.com.au",
  ];

  const sleepDentistryArray = [
    "https://sleepdentistrymelbourne.com.au",
    "https://www.sleepdentistrymelbourne.com.au",
    "https://cms.sleepdentistrymelbourne.com.au",
    "https://www.sleepdentistrygroup.com.au",
  ];

  let newData = null;
  if (allOn4WebsitesArray.includes(websiteEnquired)) {
    newData = await allon4PlusGraphQlClient.request(mutation, fullVariables);
  } else if (
    process.env.NEXT_PUBLIC_ALLON4_GRAPHQL_ENDPOINT.includes(websiteEnquired)
  ) {
    newData = await allon4GraphQlClient.request(mutation, fullVariables);
  } else if (sleepDentistryArray.includes(websiteEnquired)) {
    newData = await sleepdentistrygraphQLClient.request(
      mutation,
      fullVariables
    );
  }
  if (process.env.NODE_ENV === "development") {
    console.log(newData);
    console.log(variables);
  }
  return newData;
};
