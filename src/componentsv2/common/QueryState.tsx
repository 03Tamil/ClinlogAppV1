import { Button, Flex, FlexProps, Spinner, Text } from "@chakra-ui/react";
import { ReactNode } from "react";

type StateMessageProps = {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
} & FlexProps;

// Centered title + hint + optional action, shared by the empty and error
// states so every screen reports "nothing here" and "failed" the same way.
function StateMessage({
  title,
  description,
  action,
  ...flexProps
}: StateMessageProps) {
  return (
    <Flex
      w="100%"
      align="center"
      justify="center"
      direction="column"
      gap="2"
      py="12"
      px="4"
      textAlign="center"
      {...flexProps}
    >
      <Text fontSize="16px" fontWeight="700" color="textStrong">
        {title}
      </Text>
      {description && (
        <Text fontSize="13px" color="textMuted" maxW="420px">
          {description}
        </Text>
      )}
      {action && <Flex mt="1">{action}</Flex>}
    </Flex>
  );
}

export function EmptyState(props: StateMessageProps) {
  return <StateMessage {...props} />;
}

type ErrorStateProps = Omit<StateMessageProps, "title" | "action"> & {
  title?: string;
  onRetry?: () => void;
};

export function ErrorState({
  title = "Something went wrong.",
  description = "Check your connection and try again.",
  onRetry,
  ...rest
}: ErrorStateProps) {
  return (
    <StateMessage
      role="alert"
      title={title}
      description={description}
      action={
        onRetry && (
          <Button size="sm" colorScheme="brand" onClick={onRetry}>
            Retry
          </Button>
        )
      }
      {...rest}
    />
  );
}

export function LoadingState({
  label = "Loading",
  ...flexProps
}: { label?: string } & FlexProps) {
  return (
    <Flex
      w="100%"
      justify="center"
      align="center"
      py="16"
      role="status"
      aria-live="polite"
      {...flexProps}
    >
      <Spinner color="brand.500" thickness="3px" size="lg" label={label} />
    </Flex>
  );
}

type QueryStateProps = {
  isLoading: boolean;
  isError: boolean;
  isEmpty?: boolean;
  onRetry?: () => void;
  errorTitle?: string;
  emptyTitle?: string;
  emptyDescription?: ReactNode;
  loading?: ReactNode;
  children: ReactNode;
};

// Renders loading -> error (with retry) -> empty -> children for a query.
export function QueryState({
  isLoading,
  isError,
  isEmpty = false,
  onRetry,
  errorTitle,
  emptyTitle = "Nothing to show yet",
  emptyDescription,
  loading,
  children,
}: QueryStateProps) {
  if (isLoading) return <>{loading ?? <LoadingState />}</>;
  if (isError) return <ErrorState title={errorTitle} onRetry={onRetry} />;
  if (isEmpty)
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  return <>{children}</>;
}
